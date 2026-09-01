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
import { createHash } from 'node:crypto';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { renderizarLamina, MEDIDAS_PADRAO, type Medidas } from '../src/lib/impressao';
import { migrarLaminas } from '../src/lib/album';

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const CHAVE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const NOME = process.env.RENDER_WORKER_NOME ?? `worker-${process.pid}`;
const INTERVALO = Number(process.env.RENDER_INTERVALO_MS ?? 3000);
const BUCKET = 'renders';
const BUCKET_FOTOS = 'galerias';

if (!URL_SUPABASE || !CHAVE) {
  console.error(
    'worker-render: faltam NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.\n' +
      'O worker atravessa lojas, e a RLS é por sessão de usuário — sem a chave\n' +
      'de serviço ele não consegue ler a fila nem gravar os arquivos.\n' +
      'A chave vai em `.env.worker` (NÃO em `.env`, que o site também lê).',
  );
  process.exit(1);
}

/**
 * Confere que a chave é mesmo a de serviço, e não a anônima.
 *
 * As duas são JWT parecidos e ficam lado a lado no painel do Supabase. Com a
 * anônima o worker sobe, conecta e roda — e não enxerga job nenhum, porque a
 * RLS esconde tudo. O sintoma seria "fila sempre vazia", que não parece erro de
 * credencial e custa horas para achar. Melhor recusar na partida.
 *
 * Só o campo `role` do payload é lido; a assinatura não é verificada aqui (quem
 * verifica é o Supabase). Nada da chave é impresso.
 */
function papelDaChave(jwt: string): string | null {
  try {
    const payload = jwt.split('.')[1];
    if (!payload) return null;
    const json = Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString();
    return (JSON.parse(json) as { role?: string }).role ?? null;
  } catch {
    return null;
  }
}

const papel = papelDaChave(CHAVE);
if (papel && papel !== 'service_role') {
  console.error(
    `worker-render: a chave em SUPABASE_SERVICE_ROLE_KEY tem role "${papel}", não "service_role".\n` +
      'Com ela o worker sobe mas a RLS esconde a fila inteira, e a tela mostra\n' +
      '"nenhum job" para sempre. Pegue a service_role em Settings → API.',
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

/** Só o progresso, para a barra andar dentro de uma etapa longa. */
async function progredir(jobId: string, progresso: number) {
  await db.from('render_jobs').update({ progresso }).eq('id', jobId);
}

/**
 * O painel cancela escrevendo `estado='cancelado'` na linha do job. O worker
 * não é interrompido de fora, então pergunta entre as etapas — e no meio da
 * renderização, que é a parte demorada. Sem isto, cancelar um álbum de 80
 * lâminas só teria efeito depois de renderizar as 80.
 */
async function foiCancelado(jobId: string): Promise<boolean> {
  const { data } = await db.from('render_jobs').select('estado').eq('id', jobId).maybeSingle();
  return data?.estado === 'cancelado';
}

/** Erro que não é falha: o job foi cancelado e a saída é terminal e limpa. */
class Cancelado extends Error {
  constructor() {
    super('Cancelado pelo operador.');
  }
}

/**
 * Busca as fotos do acervo, com cache por job.
 *
 * `fotoId` no documento é o id de `galeria_fotos`; o binário está no bucket
 * privado `galerias`, no `storage_path` da linha. A mesma foto costuma repetir
 * em várias lâminas (capa e miolo), e baixar de novo a cada quadro dominaria o
 * tempo do job — por isso o cache vive enquanto o job durar, e não além dele:
 * segurar o acervo inteiro na memória entre jobs estouraria o container.
 *
 * O caminho preferido é `projeto_fotos`, o índice de quais fotos o álbum usa.
 * Mas o índice é derivado do documento, e o documento é a verdade: projeto
 * salvo antes de o editor passar a manter esse índice não tem linha nenhuma
 * ali, e uma sincronia que falhou deixa buracos. Cair fora do índice não pode
 * significar renderizar em branco — o `fotoId` é um id de `galeria_fotos`, e a
 * segunda consulta o resolve direto. Sem essa saída, a falha seria silenciosa
 * e do pior tipo: job verde, arquivo gerado, álbum em branco no papel.
 */
function acervoDoProjeto(projetoId: string) {
  const cache = new Map<string, Buffer | null>();
  const caminhos = new Map<string, string>();
  let indiceLido = false;

  /** O índice do álbum, lido uma vez por job. */
  async function lerIndice() {
    const { data } = await db
      .from('projeto_fotos')
      .select('galeria_foto_id, galeria_fotos(id, storage_path)')
      .eq('projeto_id', projetoId);

    for (const l of data ?? []) {
      const f = l.galeria_fotos as unknown as { id: string; storage_path: string } | null;
      if (f?.storage_path) caminhos.set(f.id, f.storage_path);
    }
    indiceLido = true;
  }

  /** A foto pelo id, para quando o índice não a tem. */
  async function caminhoAvulso(fotoId: string): Promise<string | null> {
    const { data } = await db
      .from('galeria_fotos')
      .select('storage_path')
      .eq('id', fotoId)
      .maybeSingle();
    return data?.storage_path ?? null;
  }

  return async function buscarFoto(fotoId: string): Promise<Buffer | null> {
    if (cache.has(fotoId)) return cache.get(fotoId) ?? null;

    if (!indiceLido) await lerIndice();

    const caminho = caminhos.get(fotoId) ?? (await caminhoAvulso(fotoId));
    if (!caminho) {
      cache.set(fotoId, null);
      return null;
    }
    caminhos.set(fotoId, caminho);

    const { data: arquivo } = await db.storage.from(BUCKET_FOTOS).download(caminho);
    const buffer = arquivo ? Buffer.from(await arquivo.arrayBuffer()) : null;
    cache.set(fotoId, buffer);
    return buffer;
  };
}

/** As medidas do produto; o padrão só entra quando o projeto não as tem. */
function medidasDoProjeto(p: { largura_mm: number | null; altura_mm: number | null }): Medidas {
  return {
    ...MEDIDAS_PADRAO,
    larguraMm: p.largura_mm ?? MEDIDAS_PADRAO.larguraMm,
    alturaMm: p.altura_mm ?? MEDIDAS_PADRAO.alturaMm,
  };
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
      .select('id, codigo, titulo, paginas, total_paginas, largura_mm, altura_mm, lojista_id')
      .eq('id', job.projeto_id)
      .single();

    if (!projeto) throw new Error('Projeto não encontrado.');

    const buscarFoto = acervoDoProjeto(projeto.id);
    const medidas = medidasDoProjeto(projeto);
    // `projetos.paginas` guarda `Lamina[]` — cada item já é a folha aberta, com
    // página esquerda e direita. `migrarLaminas` aceita documento v1 e campo
    // faltando: álbum de cliente não pode falhar por um campo a menos.
    const laminas = migrarLaminas(projeto.paginas);

    // Rendido em memória e enviado depois: um JPEG de lâmina fica na casa das
    // centenas de KB, então o álbum inteiro cabe folgado, e separar as etapas
    // mantém a barra de progresso do painel fiel ao que está acontecendo.
    const gerados: { nome: string; jpeg: Buffer }[] = [];

    for (const etapa of ETAPAS) {
      if (await foiCancelado(job.id)) throw new Cancelado();

      await andar(job.id, etapa.id, estadoDaEtapa(etapa.id), etapa.ate);
      await logar(job.id, etapa.id, `Etapa ${etapa.id} iniciada.`);

      if (etapa.id === 'preflight' && laminas.length === 0) {
        throw new Error('Projeto sem lâminas para renderizar.');
      }

      if (etapa.id === 'renderizacao') {
        await logar(job.id, etapa.id, `${laminas.length} lâmina(s) a renderizar.`);

        // A faixa desta etapa vai do fim da anterior até `etapa.ate`; o
        // progresso anda dentro dela, lâmina a lâmina.
        const de = ETAPAS[ETAPAS.indexOf(etapa) - 1]?.ate ?? 0;
        const faixa = etapa.ate - de;

        for (const [i, lamina] of laminas.entries()) {
          if (await foiCancelado(job.id)) throw new Cancelado();

          const t = Date.now();
          const jpeg = await renderizarLamina(lamina, medidas, buscarFoto);
          const nome = `${projeto.codigo ?? projeto.id}-lamina-${String(i + 1).padStart(3, '0')}.jpg`;
          gerados.push({ nome, jpeg });

          await progredir(job.id, Math.round(de + (faixa * (i + 1)) / laminas.length));
          await logar(
            job.id,
            etapa.id,
            `Lâmina ${i + 1}/${laminas.length}: ${nome}, ` +
              `${Math.round(jpeg.length / 1024)} KB em ${Math.round((Date.now() - t) / 100) / 10}s.`,
          );
        }
      }

      if (etapa.id === 'validacao') {
        const vazias = gerados.filter((g) => g.jpeg.length === 0).length;
        if (vazias) throw new Error(`${vazias} lâmina(s) saíram vazias.`);
        await logar(job.id, etapa.id, `${gerados.length} arquivo(s) conferido(s).`);
      }

      if (etapa.id === 'upload') {
        // O caminho começa pelo id da loja: é o que a policy `renders_da_equipe`
        // do bucket exige (regra 19).
        const pasta = `${job.lojista_id}/${projeto.id}`;
        await logar(job.id, etapa.id, `Destino: ${BUCKET}/${pasta}/`);

        const de = ETAPAS[ETAPAS.indexOf(etapa) - 1]?.ate ?? 0;
        const faixa = etapa.ate - de;

        for (const [i, arquivo] of gerados.entries()) {
          if (await foiCancelado(job.id)) throw new Cancelado();

          const caminho = `${pasta}/${arquivo.nome}`;
          const { error } = await db.storage
            .from(BUCKET)
            .upload(caminho, arquivo.jpeg, { contentType: 'image/jpeg', upsert: true });
          if (error) throw new Error(`Upload de ${arquivo.nome} falhou: ${error.message}`);

          const checksum = createHash('sha256').update(arquivo.jpeg).digest('hex');

          // Reprocessar gera o arquivo de novo no mesmo caminho. A linha antiga
          // é marcada como removida em vez de apagada: regra 32 — apagar a
          // versão anterior apaga a informação de que ela existiu.
          await db
            .from('projeto_arquivos')
            .update({ removido_em: new Date().toISOString() })
            .eq('projeto_id', projeto.id)
            .eq('caminho', caminho)
            .is('removido_em', null);

          await db.from('projeto_arquivos').insert({
            projeto_id: projeto.id,
            lojista_id: job.lojista_id,
            tipo: 'renderizado',
            nome: arquivo.nome,
            caminho,
            bucket: BUCKET,
            mime: 'image/jpeg',
            bytes: arquivo.jpeg.length,
            checksum,
            versao: job.tentativa,
            estado: 'pronto',
          });

          await progredir(job.id, Math.round(de + (faixa * (i + 1)) / gerados.length));
        }

        const total = gerados.reduce((s, g) => s + g.jpeg.length, 0);
        await logar(
          job.id,
          etapa.id,
          `${gerados.length} arquivo(s), ${Math.round(total / 1024 / 1024 * 10) / 10} MB enviados.`,
        );
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
    // Cancelamento é saída limpa, não falha: o job já está `cancelado` (foi o
    // painel que escreveu) e o projeto não pode ficar marcado `com_erro` por
    // causa de uma decisão do operador.
    if (e instanceof Cancelado) {
      await db
        .from('render_jobs')
        .update({ progresso: 0, concluido_em: new Date().toISOString() })
        .eq('id', job.id);
      await logar(job.id, 'entrega', 'Cancelado pelo operador; worker liberado.', 'aviso');
      await baterPonto('ocioso');
      return;
    }

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
