-- 0013 — perfil completo do cliente: dados, documentos, endereço e sessões.
--
-- A tela "Minha conta" do design pede muito mais do que `clientes` guardava
-- (nome, telefone e avatar). Este script acrescenta o que falta, separa os
-- documentos numa tabela própria e abre as duas funções que a aba de
-- segurança precisa.
--
-- Cole no SQL Editor do Supabase e execute uma vez. Reexecutar é seguro.

-- ===========================================================================
-- 1. Dados pessoais e endereço no próprio cliente
-- ===========================================================================
--
-- `clientes` é por loja (o mesmo e-mail pode ser cliente de vários lojistas),
-- então estes campos também são: a pessoa pode ter um apelido no estúdio de
-- formatura e outro no de casamento. O endereço é jsonb com a mesma forma que
-- `expedicao.endereco` já usa, para a etiqueta não precisar traduzir nada.
alter table public.clientes
  add column if not exists apelido    text,
  add column if not exists nascimento date,
  add column if not exists turma      text,
  add column if not exists endereco   jsonb not null default '{}'::jsonb;

comment on column public.clientes.endereco is
  'Entrega do cliente: {cep, rua, numero, complemento, bairro, cidade, uf, quem_recebe}. Mesma forma de expedicao.endereco.';

-- ===========================================================================
-- 2. Documentos numa tabela à parte
-- ===========================================================================
--
-- CPF, RG e nome da mãe existem para a nota fiscal, e só para isso. Numa
-- coluna de `clientes` eles viajariam em todo `select` do painel — a lista de
-- clientes, o CRM, o card do pedido. Postgres não tem RLS por coluna, então a
-- separação em outra tabela é o que de fato impede o vazamento por descuido.
create table if not exists public.cliente_documentos (
  cliente_id    uuid primary key references public.clientes(id) on delete cascade,
  cpf           text,
  rg            text,
  orgao_emissor text,
  nome_mae      text,
  atualizado_em timestamptz not null default now()
);

alter table public.cliente_documentos enable row level security;

-- O dono lê e escreve os próprios documentos.
drop policy if exists documentos_do_dono on public.cliente_documentos;
create policy documentos_do_dono on public.cliente_documentos
  for select using (
    cliente_id in (select id from public.clientes where user_id = auth.uid())
  );

drop policy if exists documentos_insert_dono on public.cliente_documentos;
create policy documentos_insert_dono on public.cliente_documentos
  for insert with check (
    cliente_id in (select id from public.clientes where user_id = auth.uid())
  );

drop policy if exists documentos_update_dono on public.cliente_documentos;
create policy documentos_update_dono on public.cliente_documentos
  for update using (
    cliente_id in (select id from public.clientes where user_id = auth.uid())
  ) with check (
    cliente_id in (select id from public.clientes where user_id = auth.uid())
  );

-- A equipe da loja lê, porque é ela que emite a nota. Não escreve: documento
-- é dado da pessoa, quem corrige é ela.
drop policy if exists documentos_da_loja on public.cliente_documentos;
create policy documentos_da_loja on public.cliente_documentos
  for select using (
    cliente_id in (
      select c.id from public.clientes c
      where private.is_membro_do_lojista(c.lojista_id)
    )
  );

-- ===========================================================================
-- 3. "Acessos recentes" — as sessões da própria pessoa
-- ===========================================================================
--
-- O schema `auth` não é exposto pelo PostgREST, e é bom que não seja. Estas
-- duas funções são a fresta controlada: rodam como dono (security definer),
-- mas filtram por `auth.uid()` — sem esse filtro, qualquer usuário listaria as
-- sessões de todo mundo. Ficam em `public` porque precisam ser chamáveis por
-- `.rpc()`; o `search_path` fixo evita sequestro por tabela homônima.
create or replace function public.minhas_sessoes()
returns table (
  id             uuid,
  criada_em      timestamptz,
  atualizada_em  timestamptz,
  agente         text,
  ip             text,
  esta_sessao    boolean
)
language sql
security definer
set search_path = auth, public, pg_temp
as $$
  select
    s.id,
    s.created_at,
    coalesce(s.refreshed_at, s.updated_at),
    s.user_agent,
    host(s.ip),
    s.id = nullif(current_setting('request.jwt.claims', true)::jsonb ->> 'session_id', '')::uuid
  from auth.sessions s
  where s.user_id = auth.uid()
  order by coalesce(s.refreshed_at, s.updated_at) desc
$$;

revoke all on function public.minhas_sessoes() from public, anon;
grant execute on function public.minhas_sessoes() to authenticated;

-- Encerrar um aparelho. Apagar a linha invalida o refresh token daquela
-- sessão; a sessão atual continua de pé.
create or replace function public.encerrar_sessao(p_sessao uuid)
returns boolean
language plpgsql
security definer
set search_path = auth, public, pg_temp
as $$
declare
  apagadas int;
begin
  delete from auth.sessions s
   where s.id = p_sessao
     and s.user_id = auth.uid();
  get diagnostics apagadas = row_count;
  return apagadas > 0;
end;
$$;

revoke all on function public.encerrar_sessao(uuid) from public, anon;
grant execute on function public.encerrar_sessao(uuid) to authenticated;
