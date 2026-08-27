-- ===========================================================================
-- Photoon SaaS - schema base (cliente final)
-- Multi-tenant por lojista; cada lojista atende em <slug>.photoon.com.br
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Lojistas (tenants)
-- ---------------------------------------------------------------------------
create table if not exists public.lojistas (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique
                check (slug ~ '^[a-z0-9](?:[a-z0-9-]{1,48}[a-z0-9])$'),
  nome          text not null,
  logo_url      text,
  cor_primaria  text default '#111111',
  ativo         boolean not null default true,
  criado_em     timestamptz not null default now()
);

comment on column public.lojistas.slug is
  'Subdominio do lojista: <slug>.photoon.com.br';

-- ---------------------------------------------------------------------------
-- Clientes finais: vinculo entre um usuario do Supabase Auth e um lojista.
-- O mesmo e-mail pode ser cliente de mais de um lojista.
-- ---------------------------------------------------------------------------
create table if not exists public.clientes (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  lojista_id  uuid not null references public.lojistas(id) on delete cascade,
  nome        text,
  telefone    text,
  criado_em   timestamptz not null default now(),
  unique (user_id, lojista_id)
);

create index if not exists clientes_lojista_idx on public.clientes(lojista_id);
create index if not exists clientes_user_idx    on public.clientes(user_id);

-- ---------------------------------------------------------------------------
-- Projetos (albuns) do cliente final
-- ---------------------------------------------------------------------------
create type projeto_status as enum ('rascunho', 'em_edicao', 'enviado', 'em_producao', 'concluido');

create table if not exists public.projetos (
  id            uuid primary key default gen_random_uuid(),
  lojista_id    uuid not null references public.lojistas(id) on delete cascade,
  cliente_id    uuid not null references public.clientes(id) on delete cascade,
  titulo        text not null default 'Novo projeto',
  status        projeto_status not null default 'rascunho',
  capa_url      text,
  template_id   uuid,
  paginas       jsonb not null default '[]'::jsonb,
  total_paginas int generated always as (jsonb_array_length(paginas)) stored,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists projetos_cliente_idx on public.projetos(cliente_id, atualizado_em desc);
create index if not exists projetos_lojista_idx on public.projetos(lojista_id);

-- ---------------------------------------------------------------------------
-- Fotos enviadas pelo cliente (metadados; binario fica no Storage)
-- ---------------------------------------------------------------------------
create table if not exists public.projeto_fotos (
  id            uuid primary key default gen_random_uuid(),
  projeto_id    uuid not null references public.projetos(id) on delete cascade,
  storage_path  text not null,
  largura       int,
  altura        int,
  ordem         int not null default 0,
  criado_em     timestamptz not null default now()
);

create index if not exists projeto_fotos_projeto_idx on public.projeto_fotos(projeto_id, ordem);

-- ---------------------------------------------------------------------------
-- atualizado_em automatico
-- ---------------------------------------------------------------------------
create or replace function public.touch_atualizado_em()
returns trigger language plpgsql as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

drop trigger if exists projetos_touch on public.projetos;
create trigger projetos_touch before update on public.projetos
  for each row execute function public.touch_atualizado_em();

-- ===========================================================================
-- RLS
-- ===========================================================================
alter table public.lojistas      enable row level security;
alter table public.clientes      enable row level security;
alter table public.projetos      enable row level security;
alter table public.projeto_fotos enable row level security;

-- Helper: o cliente logado pertence a este lojista?
create or replace function public.is_cliente_do_lojista(p_lojista uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.clientes c
    where c.user_id = auth.uid() and c.lojista_id = p_lojista
  );
$$;

-- Lojistas: dados publicos (nome/logo/cor) sao lidos na tela de login.
drop policy if exists lojistas_select_publico on public.lojistas;
create policy lojistas_select_publico on public.lojistas
  for select using (ativo);

-- Clientes: cada usuario ve/edita apenas os proprios vinculos.
drop policy if exists clientes_self on public.clientes;
create policy clientes_self on public.clientes
  for select using (user_id = auth.uid());

drop policy if exists clientes_insert_self on public.clientes;
create policy clientes_insert_self on public.clientes
  for insert with check (user_id = auth.uid());

drop policy if exists clientes_update_self on public.clientes;
create policy clientes_update_self on public.clientes
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Projetos: apenas os projetos do proprio cliente, dentro do proprio lojista.
drop policy if exists projetos_do_cliente on public.projetos;
create policy projetos_do_cliente on public.projetos
  for all
  using (
    cliente_id in (select id from public.clientes where user_id = auth.uid())
    and public.is_cliente_do_lojista(lojista_id)
  )
  with check (
    cliente_id in (select id from public.clientes where user_id = auth.uid())
    and public.is_cliente_do_lojista(lojista_id)
  );

-- Fotos: seguem o projeto.
drop policy if exists fotos_do_cliente on public.projeto_fotos;
create policy fotos_do_cliente on public.projeto_fotos
  for all
  using (
    projeto_id in (
      select p.id from public.projetos p
      join public.clientes c on c.id = p.cliente_id
      where c.user_id = auth.uid()
    )
  )
  with check (
    projeto_id in (
      select p.id from public.projetos p
      join public.clientes c on c.id = p.cliente_id
      where c.user_id = auth.uid()
    )
  );

-- ===========================================================================
-- Storage: bucket privado das fotos, isolado por projeto
--   caminho: <lojista_slug>/<projeto_id>/<arquivo>
-- ===========================================================================
insert into storage.buckets (id, name, public)
values ('projetos', 'projetos', false)
on conflict (id) do nothing;

drop policy if exists projetos_storage_rw on storage.objects;
create policy projetos_storage_rw on storage.objects
  for all
  using (
    bucket_id = 'projetos'
    and (storage.foldername(name))[2]::uuid in (
      select p.id from public.projetos p
      join public.clientes c on c.id = p.cliente_id
      where c.user_id = auth.uid()
    )
  )
  with check (
    bucket_id = 'projetos'
    and (storage.foldername(name))[2]::uuid in (
      select p.id from public.projetos p
      join public.clientes c on c.id = p.cliente_id
      where c.user_id = auth.uid()
    )
  );
