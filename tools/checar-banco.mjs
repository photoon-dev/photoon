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
  ['filiais', null],
  ['filiais', 'padrao'],
  ['pedidos', 'filial_id'],
  ['pedidos', 'codigo'],
  ['projetos', 'filial_id'],
  ['projetos', 'codigo'],
  ['clientes', 'filial_id'],
  ['vendedores', 'filial_id'],
  ['producao', 'filial_id'],
];

let faltando = 0;
for (const [tabela, coluna] of ALVOS) {
  const { ok, nota } = await checar(tabela, coluna);
  if (!ok) faltando++;
  console.log(`${ok ? 'ok  ' : 'NAO '} ${(coluna ? `${tabela}.${coluna}` : tabela).padEnd(24)} ${nota}`);
}

console.log(faltando ? `\n${faltando} objeto(s) faltando — a 0014 não foi aplicada (ou foi só em parte)`
                     : '\n0014 aplicada: todos os objetos respondem');
process.exit(faltando ? 1 : 0);
