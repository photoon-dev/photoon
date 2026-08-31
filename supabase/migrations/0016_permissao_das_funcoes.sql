-- ===========================================================================
-- 0016 — Fecha de verdade as funções internas
--
-- A 0015 tentou fechá-las com `revoke execute ... from anon, authenticated` e
-- isso NÃO teve efeito nenhum. No Postgres, toda função nasce com EXECUTE
-- concedido a PUBLIC; `anon` e `authenticated` nunca tiveram concessão direta,
-- então não havia o que revogar deles — continuavam executando pela herança de
-- PUBLIC.
--
-- Medido contra o banco real depois da 0015:
--   rpc proximo_numero_pedido   -> HTTP 409 (passou pela permissão)
--   rpc proximo_codigo_projeto  -> HTTP 409 (passou pela permissão)
--   rpc projetos_busca          -> HTTP 200 (anon executou)
--
-- A ACL confirmava: `=X/postgres` — o grantee vazio é PUBLIC.
--
-- Aditiva e idempotente: revogar duas vezes não faz diferença.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- Sequenciais: ninguém de fora consome, em hipótese nenhuma
--
-- `lojistas` tem leitura pública (a vitrine precisa), então o id de uma loja é
-- descobrível. Estas funções CONSOMEM da sequência: aberta, uma delas deixa
-- qualquer visitante empurrar a numeração de pedidos da loja para onde quiser.
--
-- Os triggers continuam funcionando: são `security definer`, executam como o
-- dono e não dependem do privilégio de quem inseriu a linha.
-- ---------------------------------------------------------------------------
revoke execute on function public.proximo_numero_pedido(uuid)             from public;
revoke execute on function public.proximo_codigo_projeto(uuid, text)      from public;
revoke execute on function public.projeto_recebe_codigo()                 from public;
revoke execute on function public.pedido_recebe_numero()                  from public;
revoke execute on function public.criar_filial_padrao()                   from public;
revoke execute on function public.producao_registra_troca()               from public;
revoke execute on function private.proximo_sequencial(uuid, text, bigint) from public;

-- ---------------------------------------------------------------------------
-- Busca de projeto: o painel precisa dela, o visitante não
--
-- Fecha para PUBLIC e devolve só a quem entra com sessão. A função já filtra
-- por loja, e a consulta que a usa filtra de novo por `lojista_id` — mesmo que
-- alguém chame com o id de outra loja, os ids devolvidos não passam pela RLS
-- de `projetos`.
-- ---------------------------------------------------------------------------
revoke execute on function public.projetos_busca(uuid, text) from public;
grant  execute on function public.projetos_busca(uuid, text) to authenticated, service_role;

-- ---------------------------------------------------------------------------
-- E daqui em diante, por padrão
--
-- Sem isto, a próxima função criada em `public` nasce aberta a PUBLIC de novo
-- e o problema volta na migração seguinte. O default vale para o que o dono
-- criar a partir daqui; o que já existe foi tratado acima.
-- ---------------------------------------------------------------------------
alter default privileges in schema public  revoke execute on functions from public;
alter default privileges in schema private revoke execute on functions from public;
