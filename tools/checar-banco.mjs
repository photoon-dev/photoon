/**
 * Confere se uma migração chegou ao banco, sem credencial privilegiada.
 *
 * Usa a chave anônima e o PostgREST: a RLS esconde as LINHAS, mas o erro
 * distingue "a tabela/coluna não existe" de "existe e você não vê nada".
 *
 *   404 / PGRST205  -> não existe
 *   400 / 42703     -> coluna não existe
 *   200 (mesmo [])  -> existe
 *
 *   node tools/checar-banco.mjs
 */
import fs from 'node:fs';

const env = Object.fromEntries(
  fs.readFileSync('.env', 'utf8').split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]),
);

const URL_BASE = env.NEXT_PUBLIC_SUPABASE_URL;
const CHAVE = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!URL_BASE || !CHAVE) {
  console.error('.env sem NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY');
  process.exit(2);
}

async function checar(tabela, coluna) {
  const alvo = coluna ?? 'id';
  const r = await fetch(`${URL_BASE}/rest/v1/${tabela}?select=${alvo}&limit=1`, {
    headers: { apikey: CHAVE, Authorization: `Bearer ${CHAVE}` },
  });
  if (r.ok) return { ok: true, nota: 'existe' };
  const corpo = await r.json().catch(() => ({}));
  const cod = corpo.code ?? String(r.status);
  if (cod === 'PGRST205' || r.status === 404) return { ok: false, nota: 'tabela não existe' };
  if (cod === '42703') return { ok: false, nota: 'coluna não existe' };
  // 401/403 = RLS barrou a leitura, mas o objeto existe.
  if (r.status === 401 || r.status === 403) return { ok: true, nota: 'existe (RLS barrou a leitura)' };
  return { ok: false, nota: `${cod}: ${corpo.message ?? r.statusText}` };
}

const ALVOS = [
  // 0014
  ['filiais', null],
  ['filiais', 'padrao'],
  ['pedidos', 'filial_id'],
  ['pedidos', 'codigo'],
  ['projetos', 'filial_id'],
  ['projetos', 'codigo'],
  ['clientes', 'filial_id'],
  ['vendedores', 'filial_id'],
  ['producao', 'filial_id'],
  // 0015 — tabelas novas
  ['projeto_arquivos', null],
  ['projeto_versoes', null],
  ['projeto_validacoes', null],
  ['render_jobs', null],
  ['render_logs', null],
  ['render_workers', null],
  ['producao_historico', null],
  ['eventos', null],
  // 0015 — colunas novas
  ['projetos', 'arquivado_em'],
  ['projetos', 'bytes_total'],
  ['projetos', 'fotos_enviadas'],
  ['projetos', 'criado_por'],
  ['projetos', 'dorso_mm'],
  ['render_jobs', 'progresso'],
  ['render_jobs', 'tentativa'],
  ['producao', 'entrou_na_etapa_em'],
  ['expedicao', 'volumes'],
  ['expedicao', 'peso_kg'],
  ['expedicao', 'sla_dias'],
  ['expedicao', 'etiqueta_url'],
];

/**
 * Funções de sequência: ninguém de fora pode consumi-las.
 *
 * O 404/PGRST202 do PostgREST cobre os dois casos que interessam — função
 * inexistente e função sem EXECUTE para este papel —, então o teste é "não
 * consegui chamar". Um 409 (chegou na chave estrangeira) significa que a
 * permissão passou: é exatamente a falha que a 0015 fecha.
 */
const FECHADAS = [
  ['proximo_numero_pedido', { loja: '00000000-0000-0000-0000-000000000000' }],
  ['proximo_codigo_projeto', { loja: '00000000-0000-0000-0000-000000000000', categoria: 'album' }],
  ['projetos_busca', { loja: '00000000-0000-0000-0000-000000000000', termo: 'x' }],
];

let faltando = 0;
for (const [tabela, coluna] of ALVOS) {
  const { ok, nota } = await checar(tabela, coluna);
  if (!ok) faltando++;
  console.log(`${ok ? 'ok  ' : 'NAO '} ${(coluna ? `${tabela}.${coluna}` : tabela).padEnd(24)} ${nota}`);
}

console.log('');
for (const [fn, args] of FECHADAS) {
  const r = await fetch(`${URL_BASE}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: CHAVE, Authorization: `Bearer ${CHAVE}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  const corpo = await r.json().catch(() => ({}));
  const fechada = r.status === 404 || r.status === 401 || r.status === 403;
  if (!fechada) faltando++;
  console.log(
    `${fechada ? 'ok  ' : 'NAO '} rpc ${fn.padEnd(24)} ` +
    (fechada ? 'anon nao consegue chamar' : `ABERTA a anon (HTTP ${r.status} ${corpo.code ?? ''})`),
  );
}

// RLS: anon nao pode ver linha nenhuma das tabelas por loja.
console.log('');
for (const t of ['filiais', 'projetos', 'pedidos', 'clientes', 'render_jobs', 'projeto_arquivos', 'eventos']) {
  const r = await fetch(`${URL_BASE}/rest/v1/${t}?select=id&limit=3`, {
    headers: { apikey: CHAVE, Authorization: `Bearer ${CHAVE}` },
  });
  const b = await r.text();
  const n = b.startsWith('[') ? JSON.parse(b).length : null;
  const ok = n === 0;
  if (!ok) faltando++;
  console.log(`${ok ? 'ok  ' : 'NAO '} rls ${t.padEnd(24)} ${n === null ? 'resposta inesperada' : `anon ve ${n} linha(s)`}`);
}

console.log(faltando ? `\n${faltando} problema(s)` : '\n0014 e 0015 aplicadas: estrutura, permissao e RLS conferem');
process.exit(faltando ? 1 : 0);
