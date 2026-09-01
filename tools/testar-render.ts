/**
 * Teste ponta a ponta da renderização, contra o banco real.
 *
 * `checar-render` prova o renderizador sozinho (sharp, sem rede). Este prova o
 * resto do caminho, que é onde as coisas realmente quebram: fila → worker →
 * acervo no bucket `galerias` → JPEG → bucket `renders` → `projeto_arquivos` →
 * URL assinada. Nenhum desses passos aparece num build verde.
 *
 * Precisa da service_role (o mesmo `.env.worker` do worker): a fila e os dois
 * buckets são fechados por RLS, e sem atravessar a loja não há como conferir o
 * que o worker gravou.
 *
 *   node --experimental-strip-types --import ./tools/resolver-ts.mjs tools/testar-render.ts
 *
 * Opções:
 *   --projeto=<uuid>  usa este projeto; sem isso, escolhe o primeiro que tem
 *                     foto no documento (e, na falta de todos, o mais recente)
 *   --preparar        preenche os quadros de foto vazios com fotos da galeria
 *                     do projeto antes de enfileirar. Sem fotos no documento o
 *                     job termina verde e o álbum sai EM BRANCO — o resultado
 *                     mais enganoso possível
 *   --manter          não desfaz nada ao final (o padrão é limpar o rastro)
 *   --espera=<seg>    quanto esperar o worker (padrão 180)
 *
 * O padrão é não deixar rastro: ao final apaga o job de teste, seus logs, os
 * arquivos que subiram, as linhas de `projeto_arquivos` e devolve o projeto ao
 * status em que estava. Um job de teste na fila real é ruído que a próxima
 * pessoa lê como trabalho de verdade.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { migrarLaminas, fotosUsadas, type Lamina } from '../src/lib/album';

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const CHAVE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL_SUPABASE || !CHAVE) {
  console.error(
    'testar-render: faltam NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.\n' +
      'A fila e os buckets são fechados por RLS; sem a chave de serviço não há o\n' +
      'que conferir. Carregue os dois arquivos de ambiente:\n' +
      '  set -a && . ./.env && . ./.env.worker && set +a',
  );
  process.exit(1);
}

const arg = (nome: string) =>
  process.argv.find((a) => a.startsWith(`--${nome}=`))?.split('=').slice(1).join('=');
const tem = (nome: string) => process.argv.includes(`--${nome}`);

const ESPERA_S = Number(arg('espera') ?? 180);
const LIMPAR = !tem('manter');

const db: SupabaseClient = createClient(URL_SUPABASE, CHAVE, { auth: { persistSession: false } });

let problemas = 0;
const ok = (rotulo: string, passou: boolean, detalhe = '') => {
  console.log(`${passou ? 'ok  ' : 'NAO '} ${rotulo.padEnd(42)} ${detalhe}`);
  if (!passou) problemas++;
};
const nota = (t: string) => console.log(`     ${t}`);
const dormir = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Projeto = {
  id: string;
  codigo: string | null;
  titulo: string | null;
  status: string | null;
  lojista_id: string;
  galeria_id: string | null;
  paginas: unknown;
};

// ---------------------------------------------------------------------------
// 1. Worker de pé
//
// Sem isto o job fica em `na_fila` e o teste falharia por timeout, sem dizer o
// motivo. "Online" é medido, não declarado: dois minutos sem bater ponto e o
// painel já considera o worker fora.
// ---------------------------------------------------------------------------
const { data: workers } = await db
  .from('render_workers')
  .select('nome, estado, visto_em')
  .order('visto_em', { ascending: false })
  .limit(5);

const vivos = (workers ?? []).filter(
  (w) => Date.now() - new Date(w.visto_em as string).getTime() < 2 * 60_000,
);
ok(
  'worker ouvindo a fila',
  vivos.length > 0,
  vivos.length ? vivos.map((w) => `${w.nome} (${w.estado})`).join(', ') : 'nenhum worker com sinal nos últimos 2min',
);
if (!vivos.length) {
  nota('suba com: docker compose up -d render && docker logs -f photoon-render-1');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// 2. Escolher o projeto
// ---------------------------------------------------------------------------
const CAMPOS = 'id, codigo, titulo, status, lojista_id, galeria_id, paginas';

let projeto: Projeto | null = null;
const idPedido = arg('projeto');

if (idPedido) {
  const { data } = await db.from('projetos').select(CAMPOS).eq('id', idPedido).maybeSingle();
  projeto = (data as Projeto) ?? null;
  ok('projeto informado existe', !!projeto, idPedido);
  if (!projeto) process.exit(1);
} else {
  const { data } = await db
    .from('projetos')
    .select(CAMPOS)
    .is('arquivado_em', null)
    .order('atualizado_em', { ascending: false })
    .limit(50);

  const candidatos = (data ?? []) as Projeto[];
  // Preferir um que já tenha foto: é o que renderiza algo visível.
  projeto =
    candidatos.find((p) => fotosUsadas(migrarLaminas(p.paginas)).size > 0) ?? candidatos[0] ?? null;
  ok('projeto de teste escolhido', !!projeto, projeto ? `${projeto.codigo ?? projeto.id} — ${projeto.titulo ?? ''}` : 'nenhum projeto no banco');
  if (!projeto) process.exit(1);
}

const alvo = projeto;
let laminas: Lamina[] = migrarLaminas(alvo.paginas);
ok('documento tem lâmina', laminas.length > 0, `${laminas.length} lâmina(s)`);
if (!laminas.length) process.exit(1);

// ---------------------------------------------------------------------------
// 3. Fotos no documento
//
// O worker resolve `fotoId` → `galeria_fotos.storage_path`. Documento sem
// `fotoId` nenhum renderiza páginas em branco e o job termina VERDE — o teste
// passaria sem provar nada.
// ---------------------------------------------------------------------------
const paginasOriginais = alvo.paginas;
let documentoAlterado = false;

let usadas = fotosUsadas(laminas);
if (usadas.size === 0 && tem('preparar')) {
  const { data: fotos } = await db
    .from('galeria_fotos')
    .select('id, storage_path')
    .eq('galeria_id', alvo.galeria_id ?? '00000000-0000-0000-0000-000000000000')
    .order('ordem', { ascending: true })
    .limit(200);

  const disponiveis = (fotos ?? []).map((f) => f.id as string);
  if (!disponiveis.length) {
    ok('galeria com fotos para preparar', false, `galeria ${alvo.galeria_id ?? '(nenhuma)'} sem foto`);
  } else {
    let i = 0;
    for (const l of laminas)
      for (const p of [l.esquerda, l.direita])
        for (const q of p.quadros)
          if (q.tipo === 'foto' && !q.fotoId) q.fotoId = disponiveis[i++ % disponiveis.length];

    usadas = fotosUsadas(laminas);
    const { error } = await db
      .from('projetos')
      .update({ paginas: laminas, fotos_usadas: usadas.size })
      .eq('id', alvo.id);
    ok('documento preparado com fotos da galeria', !error, error?.message ?? `${usadas.size} foto(s) distinta(s)`);
    documentoAlterado = !error;
  }
}

ok(
  'documento referencia foto',
  usadas.size > 0,
  usadas.size ? `${usadas.size} foto(s) distinta(s)` : 'nenhuma — o álbum sairia em branco; use --preparar',
);

// O worker prefere `projeto_fotos` e cai em `galeria_fotos` quando o índice não
// tem a foto. Vale saber por qual caminho este teste vai passar.
const { data: indice } = await db
  .from('projeto_fotos')
  .select('galeria_foto_id')
  .eq('projeto_id', alvo.id);
const noIndice = new Set((indice ?? []).map((l) => l.galeria_foto_id as string));
const faltando = [...usadas].filter((f) => !noIndice.has(f));
nota(
  `acervo: ${usadas.size - faltando.length} foto(s) pelo índice projeto_fotos, ` +
    `${faltando.length} pelo caminho reserva (galeria_fotos direto)`,
);

// ---------------------------------------------------------------------------
// 4. Enfileirar
// ---------------------------------------------------------------------------
const { data: job, error: erroFila } = await db
  .from('render_jobs')
  .insert({
    lojista_id: alvo.lojista_id,
    projeto_id: alvo.id,
    estado: 'na_fila',
    etapa: 'preflight',
  })
  .select('id')
  .single();

ok('job enfileirado', !erroFila && !!job, erroFila?.message ?? job?.id ?? '');
if (!job) process.exit(1);
const jobId = job.id as string;

// ---------------------------------------------------------------------------
// 5. Acompanhar até um estado terminal
// ---------------------------------------------------------------------------
const TERMINAIS = ['pronto', 'erro', 'cancelado'];
const limite = Date.now() + ESPERA_S * 1000;
let estado = 'na_fila';
let ultimo = '';
let jobFinal: Record<string, unknown> | null = null;

while (Date.now() < limite) {
  const { data } = await db
    .from('render_jobs')
    .select('estado, etapa, progresso, erro_mensagem, iniciado_em, concluido_em')
    .eq('id', jobId)
    .maybeSingle();

  if (data) {
    jobFinal = data;
    estado = data.estado as string;
    const linha = `${data.estado} · ${data.etapa} · ${data.progresso}%`;
    if (linha !== ultimo) {
      nota(linha);
      ultimo = linha;
    }
    if (TERMINAIS.includes(estado)) break;
  }
  await dormir(1500);
}

ok(
  'job chegou a pronto',
  estado === 'pronto',
  estado === 'pronto'
    ? `em ${Math.round(
        (new Date(jobFinal?.concluido_em as string).getTime() -
          new Date(jobFinal?.iniciado_em as string).getTime()) / 1000,
      )}s`
    : `parou em "${estado}" ${(jobFinal?.erro_mensagem as string) ?? ''}`,
);

// ---------------------------------------------------------------------------
// 6. Conferir o que ficou gravado
// ---------------------------------------------------------------------------
const { data: arquivos } = await db
  .from('projeto_arquivos')
  .select('id, nome, caminho, bucket, mime, bytes, checksum, tipo, estado, criado_em')
  .eq('projeto_id', alvo.id)
  .eq('tipo', 'renderizado')
  .is('removido_em', null)
  .order('criado_em', { ascending: false })
  .limit(laminas.length);

const gerados = arquivos ?? [];
ok('uma linha em projeto_arquivos por lâmina', gerados.length === laminas.length, `${gerados.length}/${laminas.length}`);
ok('checksum e bytes preenchidos', gerados.every((a) => a.checksum && (a.bytes as number) > 0));
ok(
  'caminho começa pelo id da loja (policy renders_da_equipe)',
  gerados.every((a) => (a.caminho as string).startsWith(`${alvo.lojista_id}/`)),
  gerados[0]?.caminho as string,
);

// O binário existe mesmo no bucket, e bate com o que a linha diz?
const primeiro = gerados[0];
if (primeiro) {
  const { data: baixado, error: erroBaixa } = await db.storage
    .from(primeiro.bucket as string)
    .download(primeiro.caminho as string);
  const bytes = baixado ? (await baixado.arrayBuffer()).byteLength : 0;
  ok('arquivo existe no bucket', !erroBaixa && bytes > 0, erroBaixa?.message ?? `${Math.round(bytes / 1024)} KB`);
  ok('tamanho bate com projeto_arquivos.bytes', bytes === primeiro.bytes, `${bytes} vs ${primeiro.bytes}`);

  const { data: assinada, error: erroUrl } = await db.storage
    .from(primeiro.bucket as string)
    .createSignedUrl(primeiro.caminho as string, 60);
  ok('URL assinada emitida', !erroUrl && !!assinada?.signedUrl, erroUrl?.message ?? '60s');

  if (assinada?.signedUrl) {
    const r = await fetch(assinada.signedUrl);
    const tipo = r.headers.get('content-type') ?? '';
    ok('URL assinada entrega o JPEG', r.ok && tipo.includes('image'), `HTTP ${r.status} ${tipo}`);
  }
}

const { data: logs } = await db
  .from('render_logs')
  .select('etapa, mensagem, severidade')
  .eq('job_id', jobId)
  .order('criado_em', { ascending: true });
ok('as sete etapas registraram log', new Set((logs ?? []).map((l) => l.etapa)).size >= 7, `${logs?.length ?? 0} linha(s)`);

const { data: proj } = await db.from('projetos').select('status').eq('id', alvo.id).maybeSingle();
ok('projeto foi para "renderizado"', proj?.status === 'renderizado', String(proj?.status));

// ---------------------------------------------------------------------------
// 7. Desfazer o rastro do teste
// ---------------------------------------------------------------------------
if (LIMPAR) {
  for (const a of gerados) {
    await db.storage.from(a.bucket as string).remove([a.caminho as string]);
  }
  await db.from('projeto_arquivos').delete().in('id', gerados.map((a) => a.id as string));
  await db.from('render_logs').delete().eq('job_id', jobId);
  await db.from('eventos').delete().eq('entidade', 'render_jobs').eq('entidade_id', jobId);
  await db.from('render_jobs').delete().eq('id', jobId);

  const volta: Record<string, unknown> = { status: alvo.status };
  if (documentoAlterado) volta.paginas = paginasOriginais;
  await db.from('projetos').update(volta).eq('id', alvo.id);

  nota(`rastro desfeito: job, logs, ${gerados.length} arquivo(s) e status do projeto (${alvo.status}).`);
  if (documentoAlterado) nota('documento devolvido ao estado anterior.');
} else {
  nota(`job ${jobId} e ${gerados.length} arquivo(s) MANTIDOS (--manter).`);
}

console.log(`\n${problemas} problema(s)\n`);
process.exit(problemas ? 1 : 0);
