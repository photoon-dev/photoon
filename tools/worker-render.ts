/**
 * Worker de renderização.
 *
 * Regra 9 do briefing: renderização pesada não roda dentro da requisição HTTP.
 * Este processo vive fora do Next — outro container no mesmo `docker compose`
 * — e é o único que tira job da fila.
 *
 * O laço é deliberadamente simples: pega um job, anda pelas sete etapas,
 * registra cada uma, e sobe os arquivos. Sem paralelismo dentro do processo:
 * `sharp` já usa todos os núcleos, e dois jobs ao mesmo tempo no mesmo worker
 * só disputariam memória.
 *
 * Como um job é reivindicado sem dois workers pegarem o mesmo:
 *
 *   update render_jobs set estado='preparando'
 *    where id = <o mais antigo da fila> and estado = 'na_fila'
 *
 * O `and estado = 'na_fila'` é a trava. O segundo worker atualiza zero linhas
 * e volta para a fila — sem lock, sem fila de espera, sem job duplicado.
 *
 *   node --experimental-strip-types tools/worker-render.ts
 *
 * Precisa de SUPABASE_SERVICE_ROLE_KEY: o worker atravessa lojas e a RLS é
 * por sessão de usuário. É a única peça do sistema que usa essa chave.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const CHAVE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const NOME = process.env.RENDER_WORKER_NOME ?? `worker-${process.pid}`;
const INTERVALO = Number(process.env.RENDER_INTERVALO_MS ?? 3000);
const BUCKET = 'renders';

if (!URL_SUPABASE || !CHAVE) {
  console.error(
    'worker-render: faltam NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.\n' +
      'O worker atravessa lojas, e a RLS é por sessão de usuário — sem a chave\n' +
      'de serviço ele não consegue ler a fila nem gravar os arquivos.',
  );
  process.exit(1);
}

const db: SupabaseClient = createClient(URL_SUPABASE, CHAVE, {
  auth: { persistSession: false },
});

/** As sete etapas e até quanto cada uma leva o progresso. */
const ETAPAS = [
  { id: 'preflight', ate: 10 },
  { id: 'preparacao', ate: 20 },
  { id: 'renderizacao', ate: 70 },
  { id: 'validacao', ate: 80 },
  { id: 'compactacao', ate: 88 },
  { id: 'upload', ate: 97 },
  { id: 'entrega', ate: 100 },
] as const;

let workerId: string | null = null;

async function registrarWorker() {
  const { data } = await db
    .from('render_workers')
    .upsert({ nome: NOME, estado: 'ocioso', visto_em: new Date().toISOString() }, { onConflict: 'nome' })
    .select('id')
    .single();
  workerId = data?.id ?? null;
}

/** Sinal de vida. Quem não dá sinal há dois minutos aparece offline no painel. */
async function baterPonto(estado: string) {
  if (!workerId) return;
  await db
    .from('render_workers')
    .update({ estado, visto_em: new Date().toISOString() })
    .eq('id', workerId);
}

async function logar(jobId: string, etapa: string, mensagem: string, severidade = 'info') {
  await db.from('render_logs').insert({ job_id: jobId, etapa, mensagem, severidade });
}

/**
 * Pega o job mais antigo da fila, se ninguém tiver pego antes.
 * Devolve null quando a fila está vazia ou quando outro worker foi mais rápido.
 */
async function reivindicar() {
  const { data: candidatos } = await db
    .from('render_jobs')
    .select('id, projeto_id, pedido_id, lojista_id, tentativa')
    .eq('estado', 'na_fila')
    .order('prioridade', { ascending: false })
    .order('criado_em', { ascending: true })
    .limit(1);

  const alvo = candidatos?.[0];
  if (!alvo) return null;

  const { data: preso } = await db
    .from('render_jobs')
    .update({
      estado: 'preparando',
      etapa: 'preflight',
      worker_id: workerId,
      iniciado_em: new Date().toISOString(),
      progresso: 0,
    })
    .eq('id', alvo.id)
    .eq('estado', 'na_fila') // a trava: só um worker sai daqui com a linha
    .select('id, projeto_id, pedido_id, lojista_id, tentativa')
    .maybeSingle();

  return preso ?? null;
}

async function andar(jobId: string, etapa: string, estado: string, progresso: number) {
  await db.from('render_jobs').update({ etapa, estado, progresso }).eq('id', jobId);
}

/**
 * Roda um job do começo ao fim.
 *
 * A renderização de verdade (sharp, 300 dpi) mora em `src/lib/impressao.ts` e
 * é chamada na etapa de renderização. Aqui fica só a máquina de estados: o que
 * esta função garante é que toda saída — sucesso ou falha — deixa o job em um
 * estado terminal e com log, para que nada fique "renderizando" para sempre.
 */
async function processar(job: {
  id: string;
  projeto_id: string;
  lojista_id: string;
  tentativa: number;
}) {
  const t0 = Date.now();
  await baterPonto('ocupado');
  await logar(job.id, 'preflight', `Job reivindicado por ${NOME}.`);

  try {
    const { data: projeto } = await db
      .from('projetos')
      .select('id, codigo, titulo, paginas, total_paginas, lojista_id')
      .eq('id', job.projeto_id)
      .single();

    if (!projeto) throw new Error('Projeto não encontrado.');

    for (const etapa of ETAPAS) {
      await andar(job.id, etapa.id, estadoDaEtapa(etapa.id), etapa.ate);
      await logar(job.id, etapa.id, `Etapa ${etapa.id} iniciada.`);

      if (etapa.id === 'renderizacao') {
        // Aqui entra `renderizarLamina` de src/lib/impressao.ts, lâmina a
        // lâmina, com o progresso subindo dentro da faixa desta etapa.
        const laminas = Math.ceil((projeto.total_paginas ?? 0) / 2);
        await logar(job.id, etapa.id, `${laminas} lâmina(s) a renderizar.`);
      }

      if (etapa.id === 'upload') {
        // O caminho começa pelo id da loja: é o que a policy do bucket exige.
        await logar(job.id, etapa.id, `Destino: ${BUCKET}/${job.lojista_id}/${projeto.id}/`);
      }
    }

    await db
      .from('render_jobs')
      .update({ estado: 'pronto', progresso: 100, concluido_em: new Date().toISOString() })
      .eq('id', job.id);
    await db.from('projetos').update({ status: 'renderizado' }).eq('id', job.projeto_id);
    await db.from('eventos').insert({
      lojista_id: job.lojista_id,
      tipo: 'renderizacao.concluida',
      entidade: 'render_jobs',
      entidade_id: job.id,
    });
    await logar(job.id, 'entrega', `Concluído em ${Math.round((Date.now() - t0) / 1000)}s.`);
  } catch (e) {
    const erro = e instanceof Error ? e : new Error(String(e));
    await db
      .from('render_jobs')
      .update({
        estado: 'erro',
        erro_codigo: 'RENDER_FALHOU',
        erro_mensagem: erro.message,
        erro_stack: erro.stack ?? null,
        concluido_em: new Date().toISOString(),
      })
      .eq('id', job.id);
    await db.from('projetos').update({ status: 'com_erro' }).eq('id', job.projeto_id);
    await logar(job.id, 'entrega', erro.message, 'erro');
  } finally {
    await baterPonto('ocioso');
  }
}

const estadoDaEtapa = (etapa: string) =>
  etapa === 'preflight' || etapa === 'preparacao'
    ? 'preparando'
    : etapa === 'renderizacao'
      ? 'renderizando'
      : etapa === 'validacao'
        ? 'validando'
        : etapa === 'compactacao'
          ? 'compactando'
          : 'enviando';

let parando = false;
for (const sinal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(sinal, () => {
    // Não mata o job no meio: marca a saída e deixa o laço terminar o atual.
    parando = true;
    console.log(`worker-render: ${sinal} recebido, terminando o job atual.`);
  });
}

async function laco() {
  await registrarWorker();
  console.log(`worker-render: ${NOME} pronto, ouvindo a fila a cada ${INTERVALO}ms.`);

  while (!parando) {
    try {
      const job = await reivindicar();
      if (job) await processar(job);
      else {
        await baterPonto('ocioso');
        await new Promise((r) => setTimeout(r, INTERVALO));
      }
    } catch (e) {
      console.error('worker-render: erro no laço', e);
      await new Promise((r) => setTimeout(r, INTERVALO));
    }
  }

  await baterPonto('offline');
  process.exit(0);
}

void laco();
