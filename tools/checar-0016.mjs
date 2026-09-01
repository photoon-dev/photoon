/**
 * Validação da migration 0016, função a função, contra o banco real.
 *
 * `checar-banco.mjs` cobre três RPCs pelo lado do `anon`. Esta confere as oito
 * funções da 0016 e, principalmente, o outro lado: o que `authenticated`
 * PRECISA continuar podendo fazer. Fechar demais quebra o painel de um jeito
 * que só aparece quando o lojista tenta usar.
 *
 *   SENHA_TESTE='...' node tools/checar-0016.mjs
 */
import { createClient } from '@supabase/supabase-js';

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const EMAIL = process.env.EMAIL_TESTE ?? 'lojista@photoon.com.br';
const SENHA = process.env.SENHA_TESTE ?? '';

if (!URL || !ANON) throw new Error('faltam NEXT_PUBLIC_SUPABASE_URL/ANON_KEY');

let problemas = 0;
const ok = (rotulo, passou, detalhe = '') => {
  console.log(`${passou ? 'ok  ' : 'NAO '} ${rotulo.padEnd(46)} ${detalhe}`);
  if (!passou) problemas++;
};

/** Uma chamada de RPC devolve `negado` quando a permissão barrou. */
async function chamar(db, nome, args) {
  const { error } = await db.rpc(nome, args);
  if (!error) return { negado: false, nota: 'executou (HTTP 200)' };
  const t = `${error.code ?? ''} ${error.message ?? ''}`.toLowerCase();
  const negado =
    t.includes('permission denied') ||
    t.includes('not find the function') ||
    error.code === '42501' ||
    error.code === 'PGRST202';
  return { negado, nota: `${error.code ?? '?'}: ${(error.message ?? '').slice(0, 58)}` };
}

const ZERO = '00000000-0000-0000-0000-000000000000';

// As oito da 0016. As de trigger não são chamáveis por RPC, mas se a permissão
// estivesse aberta o PostgREST responderia outra coisa que não "não existe".
const ALVOS = [
  ['proximo_numero_pedido', { p_lojista: ZERO }],
  ['proximo_codigo_projeto', { p_lojista: ZERO, p_prefixo: 'X' }],
  ['projeto_recebe_codigo', {}],
  ['pedido_recebe_numero', {}],
  ['criar_filial_padrao', {}],
  ['producao_registra_troca', {}],
  ['proximo_sequencial', { p_lojista: ZERO, p_chave: 'x', p_de: 1 }],
  ['projetos_busca', { loja: ZERO, termo: 'x' }],
];

console.log('\n-- anon: nenhuma das 8 pode executar --\n');
const anon = createClient(URL, ANON, { auth: { persistSession: false } });
for (const [nome, args] of ALVOS) {
  const r = await chamar(anon, nome, args);
  ok(`anon x ${nome}`, r.negado, r.nota);
}

console.log('\n-- anon: continua sem enxergar linha (RLS de pe) --\n');
for (const t of ['lojistas', 'projetos', 'pedidos', 'clientes', 'render_jobs', 'projeto_arquivos']) {
  const { data, error } = await anon.from(t).select('id').limit(5);
  // `lojistas` tem leitura publica de proposito (a vitrine precisa dela).
  const esperado = t === 'lojistas' ? 'leitura publica prevista' : '0 linhas';
  const passou = t === 'lojistas' ? !error : !error && (data?.length ?? 0) === 0;
  ok(`anon le ${t}`, passou, `${data?.length ?? 0} linha(s) · ${esperado}`);
}

if (!SENHA) {
  console.log('\n(sem SENHA_TESTE: o lado authenticated nao foi conferido)\n');
  process.exit(problemas ? 1 : 0);
}

console.log('\n-- authenticated: o painel precisa continuar funcionando --\n');
const auth = createClient(URL, ANON, { auth: { persistSession: false } });
const { error: erroLogin } = await auth.auth.signInWithPassword({ email: EMAIL, password: SENHA });
ok('login do lojista', !erroLogin, erroLogin?.message ?? EMAIL);

if (!erroLogin) {
  // A unica das 8 que o painel chama de fato (src/lib/projetos.ts:101).
  const busca = await chamar(auth, 'projetos_busca', { loja: ZERO, termo: 'x' });
  ok('authenticated x projetos_busca (PRECISA executar)', !busca.negado, busca.nota);

  // As internas continuam fechadas mesmo com sessao.
  for (const nome of ['proximo_numero_pedido', 'proximo_codigo_projeto', 'proximo_sequencial']) {
    const args = ALVOS.find(([n]) => n === nome)[1];
    const r = await chamar(auth, nome, args);
    ok(`authenticated x ${nome} (deve ser negado)`, r.negado, r.nota);
  }

  // E os dados da loja continuam legiveis para quem tem sessao.
  for (const t of ['projetos', 'pedidos', 'clientes']) {
    const { error } = await auth.from(t).select('id').limit(1);
    ok(`authenticated le ${t}`, !error, error?.message ?? 'consulta aceita');
  }
}

console.log(`\n${problemas} problema(s)\n`);
process.exit(problemas ? 1 : 0);
