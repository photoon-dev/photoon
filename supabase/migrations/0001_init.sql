-- ===========================================================================
-- Photoon SaaS - schema da area do cliente final
-- Multi-tenant por lojista; cada lojista atende em <slug>.photoon.com.br
-- Modelo derivado das telas Cliente Entrar / Meus projetos / Detalhe / Editor.
-- ===========================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Lojistas (tenants)
-- ---------------------------------------------------------------------------
create table if not exists public.lojistas (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique
                   check (slug ~ '^[a-z0-9](?:[a-z0-9-]{1,48}[a-z0-9])$'),
  nome             text not null,
  logo_url         text,
  cor_primaria     text default '#2563EB',
  telefone_suporte text,
  email_suporte    text,
  url_politica     text,
  url_contato      text,
  ativo            boolean not null default true,
  criado_em        timestamptz not null default now()
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
-- Galeria: o conjunto de fotos que o lojista liberou para o cliente.
-- E o "pool" de onde os albuns puxam imagens ("38 de 120 fotos").
-- ---------------------------------------------------------------------------
create table if not exists public.galerias (
  id            uuid primary key default gen_random_uuid(),
  lojista_id    uuid not null references public.lojistas(id) on delete cascade,
  cliente_id    uuid not null references public.clientes(id) on delete cascade,
  nome          text not null,                  -- "Formatura 2026 · sessão Julia"
  max_albuns    int  not null default 4,        -- quantos albuns cabem nesta galeria
  criada_em     timestamptz not null default now(),
  atualizada_em timestamptz not null default now()
);

create index if not exists galerias_cliente_idx on public.galerias(cliente_id);

create table if not exists public.galeria_fotos (
  id           uuid primary key default gen_random_uuid(),
  galeria_id   uuid not null references public.galerias(id) on delete cascade,
  storage_path text not null,
  largura      int,
  altura       int,
  ordem        int not null default 0,
  criada_em    timestamptz not null default now()
);

create index if not exists galeria_fotos_galeria_idx on public.galeria_fotos(galeria_id, ordem);

-- ---------------------------------------------------------------------------
-- Projetos (albuns)
-- Estados conforme os filtros da tela "Meus projetos".
-- ---------------------------------------------------------------------------
do $$ begin
  create type projeto_status as enum (
    'nao_iniciado', 'em_edicao', 'com_pendencias', 'pronto', 'finalizado'
  );
exception when duplicate_object then null;
end $$;

create table if not exists public.projetos (
  id            uuid primary key default gen_random_uuid(),
  lojista_id    uuid not null references public.lojistas(id) on delete cascade,
  cliente_id    uuid not null references public.clientes(id) on delete cascade,
  galeria_id    uuid references public.galerias(id) on delete set null,
  titulo        text not null default 'Novo álbum',
  status        projeto_status not null default 'nao_iniciado',
  produto_nome  text,                        -- "Wood Fotográfico"
  produto_tamanho text,                      -- "40 × 30 cm"
  preco_estimado numeric(10,2),
  paginas       jsonb not null default '[]'::jsonb,
  -- progresso mostrado no card (0-100); calculado pelo editor ao salvar
  progresso     int not null default 0 check (progresso between 0 and 100),
  -- pendencias da revisao, na forma
  --   [{ titulo, descricao, nivel: 'obrigatoria'|'recomendacao', acao }]
  avisos        jsonb not null default '[]'::jsonb,
  capa_url      text,
  total_paginas int generated always as (jsonb_array_length(paginas)) stored,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists projetos_cliente_idx on public.projetos(cliente_id, atualizado_em desc);
create index if not exists projetos_lojista_idx on public.projetos(lojista_id);

-- Fotos escolhidas pelo cliente para este album (subconjunto da galeria).
create table if not exists public.projeto_fotos (
  projeto_id      uuid not null references public.projetos(id) on delete cascade,
  galeria_foto_id uuid not null references public.galeria_fotos(id) on delete cascade,
  ordem           int not null default 0,
  primary key (projeto_id, galeria_foto_id)
);

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

-- ---------------------------------------------------------------------------
-- Historico do projeto (aba "Histórico" da tela de detalhe)
-- ---------------------------------------------------------------------------
create table if not exists public.projeto_eventos (
  id         uuid primary key default gen_random_uuid(),
  projeto_id uuid not null references public.projetos(id) on delete cascade,
  descricao  text not null,          -- "Você editou a lâmina 5"
  autor      text,                   -- 'cliente' | 'ia' | 'empresa'
  criado_em  timestamptz not null default now()
);

create index if not exists projeto_eventos_idx
  on public.projeto_eventos(projeto_id, criado_em desc);

-- ---------------------------------------------------------------------------
-- Notificacoes ("Avisos da Photoon sobre seus projetos")
-- ---------------------------------------------------------------------------
create table if not exists public.notificacoes (
  id         uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.clientes(id) on delete cascade,
  projeto_id uuid references public.projetos(id) on delete cascade,
  tag        text not null default 'Aviso',
  titulo     text not null,
  corpo      text,
  lida       boolean not null default false,
  criada_em  timestamptz not null default now()
);

create index if not exists notificacoes_cliente_idx
  on public.notificacoes(cliente_id, criada_em desc);

-- ===========================================================================
-- RLS
-- ===========================================================================
alter table public.lojistas      enable row level security;
alter table public.clientes      enable row level security;
alter table public.galerias      enable row level security;
alter table public.galeria_fotos enable row level security;
alter table public.projetos      enable row level security;
alter table public.projeto_fotos enable row level security;
alter table public.projeto_eventos enable row level security;
alter table public.notificacoes  enable row level security;

-- ids de cliente do usuario logado
create or replace function public.meus_clientes()
returns setof uuid language sql stable security definer set search_path = public as $$
  select id from public.clientes where user_id = auth.uid();
$$;

create or replace function public.is_cliente_do_lojista(p_lojista uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.clientes c
    where c.user_id = auth.uid() and c.lojista_id = p_lojista
  );
$$;

-- Lojistas: nome/logo/telefone sao lidos na tela de login, antes da sessao.
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

-- Galerias: somente leitura pelo cliente (quem libera fotos e o lojista).
drop policy if exists galerias_do_cliente on public.galerias;
create policy galerias_do_cliente on public.galerias
  for select using (cliente_id in (select public.meus_clientes()));

drop policy if exists galeria_fotos_do_cliente on public.galeria_fotos;
create policy galeria_fotos_do_cliente on public.galeria_fotos
  for select using (
    galeria_id in (
      select g.id from public.galerias g where g.cliente_id in (select public.meus_clientes())
    )
  );

-- Projetos: do proprio cliente E dentro do proprio lojista.
drop policy if exists projetos_do_cliente on public.projetos;
create policy projetos_do_cliente on public.projetos
  for all
  using (
    cliente_id in (select public.meus_clientes())
    and public.is_cliente_do_lojista(lojista_id)
  )
  with check (
    cliente_id in (select public.meus_clientes())
    and public.is_cliente_do_lojista(lojista_id)
  );

drop policy if exists projeto_fotos_do_cliente on public.projeto_fotos;
create policy projeto_fotos_do_cliente on public.projeto_fotos
  for all
  using (
    projeto_id in (
      select p.id from public.projetos p where p.cliente_id in (select public.meus_clientes())
    )
  )
  with check (
    projeto_id in (
      select p.id from public.projetos p where p.cliente_id in (select public.meus_clientes())
    )
  );

drop policy if exists projeto_eventos_do_cliente on public.projeto_eventos;
create policy projeto_eventos_do_cliente on public.projeto_eventos
  for select using (
    projeto_id in (
      select p.id from public.projetos p where p.cliente_id in (select public.meus_clientes())
    )
  );

-- Notificacoes: leitura e marcar como lida.
drop policy if exists notificacoes_do_cliente on public.notificacoes;
create policy notificacoes_do_cliente on public.notificacoes
  for select using (cliente_id in (select public.meus_clientes()));

drop policy if exists notificacoes_marcar_lida on public.notificacoes;
create policy notificacoes_marcar_lida on public.notificacoes
  for update using (cliente_id in (select public.meus_clientes()))
  with check (cliente_id in (select public.meus_clientes()));

-- ===========================================================================
-- Storage: bucket privado das fotos
--   caminho: <galeria_id>/<arquivo>
-- ===========================================================================
insert into storage.buckets (id, name, public)
values ('galerias', 'galerias', false)
on conflict (id) do nothing;

drop policy if exists galerias_storage_leitura on storage.objects;
create policy galerias_storage_leitura on storage.objects
  for select
  using (
    bucket_id = 'galerias'
    and (storage.foldername(name))[1]::uuid in (
      select g.id from public.galerias g where g.cliente_id in (select public.meus_clientes())
    )
  );
