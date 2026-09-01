-- ===========================================================================
-- MIGRATION 0016 — fecha o EXECUTE herdado de PUBLIC nas funcoes internas
--
-- Cole este bloco inteiro no SQL Editor do Supabase e rode uma vez.
-- E idempotente: rodar de novo nao muda nada e nao da erro.
-- Ao final ele imprime a tabela de verificacao (deve sair tudo como esperado).
-- ===========================================================================
begin;

-- ---------------------------------------------------------------------------
-- 1. Sequenciais e triggers: ninguem de fora executa, em hipotese nenhuma.
--
--    Os triggers continuam funcionando: sao `security definer` e executam como
--    o dono, sem depender do privilegio de quem inseriu a linha. Por isso
--    criar pedido e criar projeto seguem funcionando depois desta migration.
-- ---------------------------------------------------------------------------
do $bloco$
declare
  alvo text;
  fn   regprocedure;
begin
  foreach alvo in array array[
    'public.proximo_numero_pedido(uuid)',
    'public.proximo_codigo_projeto(uuid, text)',
    'public.projeto_recebe_codigo()',
    'public.pedido_recebe_numero()',
    'public.criar_filial_padrao()',
    'public.producao_registra_troca()',
    'private.proximo_sequencial(uuid, text, bigint)'
  ] loop
    fn := to_regprocedure(alvo);
    if fn is null then
      raise notice 'pulada (nao existe): %', alvo;
    else
      execute format('revoke execute on function %s from public', fn);
      execute format('revoke execute on function %s from anon', fn);
      execute format('revoke execute on function %s from authenticated', fn);
      raise notice 'fechada: %', fn;
    end if;
  end loop;
end
$bloco$;

-- ---------------------------------------------------------------------------
-- 2. projetos_busca: o painel precisa dela, o visitante nao.
--
--    Fecha para PUBLIC e devolve so a quem entra com sessao. A funcao ja
--    filtra por loja, e a consulta que a usa filtra de novo por `lojista_id`.
-- ---------------------------------------------------------------------------
do $bloco$
declare fn regprocedure := to_regprocedure('public.projetos_busca(uuid, text)');
begin
  if fn is null then
    raise notice 'pulada (nao existe): public.projetos_busca(uuid, text)';
  else
    execute format('revoke execute on function %s from public', fn);
    execute format('revoke execute on function %s from anon', fn);
    execute format('grant execute on function %s to authenticated, service_role', fn);
    raise notice 'fechada a anon e liberada a authenticated: %', fn;
  end if;
end
$bloco$;

-- ---------------------------------------------------------------------------
-- 3. E daqui em diante, por padrao.
--
--    Sem isto a proxima funcao criada nasce aberta a PUBLIC de novo e o
--    problema volta na migration seguinte.
-- ---------------------------------------------------------------------------
alter default privileges in schema public  revoke execute on functions from public;
alter default privileges in schema private revoke execute on functions from public;

commit;

-- ===========================================================================
-- VERIFICACAO — o resultado esperado esta na coluna `esperado`.
-- Todas as linhas devem sair com veredito = OK.
-- ===========================================================================
select
  n.nspname || '.' || p.proname                              as funcao,
  has_function_privilege('anon',          p.oid, 'EXECUTE')  as anon,
  has_function_privilege('authenticated', p.oid, 'EXECUTE')  as authenticated,
  case when p.proname = 'projetos_busca'
       then 'anon=false, authenticated=true'
       else 'anon=false, authenticated=false' end            as esperado,
  case
    when p.proname = 'projetos_busca'
      and has_function_privilege('anon', p.oid, 'EXECUTE') = false
      and has_function_privilege('authenticated', p.oid, 'EXECUTE') = true then 'OK'
    when p.proname <> 'projetos_busca'
      and has_function_privilege('anon', p.oid, 'EXECUTE') = false
      and has_function_privilege('authenticated', p.oid, 'EXECUTE') = false then 'OK'
    else 'FALHOU'
  end                                                        as veredito
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where (n.nspname, p.proname) in (
  ('public','proximo_numero_pedido'), ('public','proximo_codigo_projeto'),
  ('public','projeto_recebe_codigo'), ('public','pedido_recebe_numero'),
  ('public','criar_filial_padrao'),   ('public','producao_registra_troca'),
  ('public','projetos_busca'),        ('private','proximo_sequencial')
)
order by funcao;
