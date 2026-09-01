/**
 * Reconstrói `projeto_fotos` e `projetos.fotos_usadas` a partir do documento.
 *
 * O editor passou a manter esse índice em `salvarLaminas`, mas só a partir da
 * próxima gravação: projeto que ninguém abrir continua com o índice vazio, e
 * com `fotos_usadas` zerada na tela. Isto acerta o passado de uma vez.
 *
 * A renderização NÃO depende disto — o worker cai em `galeria_fotos` quando o
 * índice não tem a foto. O que se ganha aqui é a contagem certa na tela, a
 * marcação "já usada" na Galeria, e uma consulta a menos por foto no worker.
 *
 * O índice é derivado do documento, que é a verdade: rodar de novo dá o mesmo
 * resultado, e o pior caso de um erro aqui é uma contagem errada — nada do que
 * o cliente montou passa por aqui.
 *
 *   set -a && . ./.env && . ./.env.worker && set +a
 *   node --experimental-strip-types --import ./tools/resolver-ts.mjs tools/reindexar-fotos.ts [--aplicar]
 *
 * Sem `--aplicar` só mostra o que faria.
 */
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { migrarLaminas, fotosUsadas } from '../src/lib/album';

const URL_SUPABASE = process.env.NEXT_PUBLIC_SUPABASE_URL;
const CHAVE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_SUPABASE || !CHAVE) {
  console.error('reindexar-fotos: faltam NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.');
  process.exit(1);
}

const APLICAR = process.argv.includes('--aplicar');
const db: SupabaseClient = createClient(URL_SUPABASE, CHAVE, { auth: { persistSession: false } });

const { data: projetos } = await db
  .from('projetos')
  .select('id, codigo, paginas, fotos_usadas')
  .is('arquivado_em', null);

let mexidos = 0;

for (const p of projetos ?? []) {
  const usadas = [...fotosUsadas(migrarLaminas(p.paginas))];

  // Só entram fotos que existem de fato. Documento antigo pode citar foto que
  // saiu da galeria, e uma FK quebrada aqui derrubaria o insert inteiro.
  const { data: existentes } = await db
    .from('galeria_fotos')
    .select('id')
    .in('id', usadas.length ? usadas : ['00000000-0000-0000-0000-000000000000']);
  const validas = usadas.filter((f) => (existentes ?? []).some((e) => e.id === f));
  const orfas = usadas.length - validas.length;

  const { data: atuais } = await db
    .from('projeto_fotos')
    .select('galeria_foto_id')
    .eq('projeto_id', p.id);
  const tinha = new Set((atuais ?? []).map((l) => l.galeria_foto_id as string));

  const entrando = validas.filter((f) => !tinha.has(f));
  const saindo = [...tinha].filter((f) => !validas.includes(f));
  const contaErrada = (p.fotos_usadas ?? 0) !== validas.length;

  if (!entrando.length && !saindo.length && !contaErrada) {
    console.log(`ok   ${p.codigo}  ja em dia (${validas.length} foto(s))`);
    continue;
  }

  console.log(
    `${APLICAR ? 'agir' : 'seria'} ${p.codigo}  +${entrando.length} -${saindo.length}  ` +
      `fotos_usadas ${p.fotos_usadas ?? 0} -> ${validas.length}` +
      (orfas ? `  (${orfas} foto(s) do documento nao existem mais na galeria)` : ''),
  );

  if (!APLICAR) continue;

  if (entrando.length) {
    const { error } = await db.from('projeto_fotos').upsert(
      entrando.map((galeria_foto_id) => ({
        projeto_id: p.id,
        galeria_foto_id,
        ordem: validas.indexOf(galeria_foto_id),
      })),
      { onConflict: 'projeto_id,galeria_foto_id' },
    );
    if (error) console.error(`     erro ao inserir: ${error.message}`);
  }
  if (saindo.length) {
    const { error } = await db
      .from('projeto_fotos')
      .delete()
      .eq('projeto_id', p.id)
      .in('galeria_foto_id', saindo);
    if (error) console.error(`     erro ao remover: ${error.message}`);
  }
  await db.from('projetos').update({ fotos_usadas: validas.length }).eq('id', p.id);
  mexidos++;
}

console.log(
  APLICAR
    ? `\n${mexidos} projeto(s) reindexado(s).\n`
    : `\nnada foi gravado — rode com --aplicar.\n`,
);
