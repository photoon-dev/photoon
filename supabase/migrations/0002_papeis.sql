-- ===========================================================================
-- Papéis do sistema
--
--   super admin  -> administra a plataforma inteira, todos os lojistas
--   admin/equipe -> administra UM lojista (libera fotos, cria projetos)
--   cliente      -> o cliente final, ja modelado em public.clientes
--
-- Este arquivo cria apenas o modelo de dados e as policies. As telas de
-- administracao ainda nao existem.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- Super admins da plataforma
-- ---------------------------------------------------------------------------
create table if not exists public.super_admins (
  user_id   uuid primary key references auth.users(id) on delete cascade,
  criado_em timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Equipe de um lojista
-- ---------------------------------------------------------------------------
do $$ begin
  create type papel_lojista as enum ('admin', 'operador');
exception when duplicate_object then null;
end $$;

create table if not exists public.lojista_membros (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  lojista_id uuid not null references public.lojistas(id) on delete cascade,
  papel      papel_lojista not null default 'operador',
  criado_em  timestamptz not null default now(),
  unique (user_id, lojista_id)
);

create index if not exists lojista_membros_lojista_idx
  on public.lojista_membros(lojista_id);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_super_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.super_admins s where s.user_id = auth.uid());
$$;

create or replace function public.is_membro_do_lojista(p_lojista uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.lojista_membros m
    where m.user_id = auth.uid() and m.lojista_id = p_lojista
  );
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.super_admins    enable row level security;
alter table public.lojista_membros enable row level security;

-- Ninguem se promove sozinho: sem policy de insert/update, so o service_role
-- (ou o SQL Editor) consegue escrever nestas tabelas.
drop policy if exists super_admins_leitura on public.super_admins;
create policy super_admins_leitura on public.super_admins
  for select using (user_id = auth.uid());

drop policy if exists lojista_membros_leitura on public.lojista_membros;
create policy lojista_membros_leitura on public.lojista_membros
  for select using (user_id = auth.uid() or public.is_super_admin());

-- ---------------------------------------------------------------------------
-- Acesso da equipe do lojista aos dados dos clientes dele.
-- As policies existentes (do cliente final) continuam valendo; estas somam.
-- ---------------------------------------------------------------------------
drop policy if exists galerias_da_equipe on public.galerias;
create policy galerias_da_equipe on public.galerias
  for all
  using (public.is_membro_do_lojista(lojista_id) or public.is_super_admin())
  with check (public.is_membro_do_lojista(lojista_id) or public.is_super_admin());

drop policy if exists galeria_fotos_da_equipe on public.galeria_fotos;
create policy galeria_fotos_da_equipe on public.galeria_fotos
  for all
  using (
    galeria_id in (
      select g.id from public.galerias g
      where public.is_membro_do_lojista(g.lojista_id) or public.is_super_admin()
    )
  )
  with check (
    galeria_id in (
      select g.id from public.galerias g
      where public.is_membro_do_lojista(g.lojista_id) or public.is_super_admin()
    )
  );

drop policy if exists projetos_da_equipe on public.projetos;
create policy projetos_da_equipe on public.projetos
  for all
  using (public.is_membro_do_lojista(lojista_id) or public.is_super_admin())
  with check (public.is_membro_do_lojista(lojista_id) or public.is_super_admin());

drop policy if exists clientes_da_equipe on public.clientes;
create policy clientes_da_equipe on public.clientes
  for select using (public.is_membro_do_lojista(lojista_id) or public.is_super_admin());

-- Super admin enxerga e edita a lista de lojistas.
drop policy if exists lojistas_super_admin on public.lojistas;
create policy lojistas_super_admin on public.lojistas
  for all using (public.is_super_admin()) with check (public.is_super_admin());
