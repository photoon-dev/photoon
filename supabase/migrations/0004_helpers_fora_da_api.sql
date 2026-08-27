-- ===========================================================================
-- Tira as funções auxiliares da RLS de dentro da API pública.
--
-- O linter do Supabase apontou que `public.is_super_admin()`,
-- `public.meus_clientes()`, `public.is_membro_do_lojista()` e
-- `public.is_cliente_do_lojista()` eram chamáveis por qualquer um via
-- /rest/v1/rpc/<nome>, porque o PostgREST expõe o schema `public`.
--
-- Revogar EXECUTE não serve: as policies são avaliadas com os privilégios de
-- quem faz a consulta, e sem EXECUTE toda leitura passaria a falhar. A
-- correção é mover as funções para um schema que a API não expõe.
--
-- Também fixa o search_path do trigger, que estava mutável.
--
-- APLICADO em 27/08/2026 no projeto whsrcrqyoblulpqsjxmq.
-- ===========================================================================

create schema if not exists private;
grant usage on schema private to authenticated, anon;

create or replace function private.meus_clientes()
returns setof uuid language sql stable security definer set search_path = public as $$
  select id from public.clientes where user_id = auth.uid();
$$;

create or replace function private.is_cliente_do_lojista(p_lojista uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.clientes c
    where c.user_id = auth.uid() and c.lojista_id = p_lojista
  );
$$;

create or replace function private.is_super_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.super_admins s where s.user_id = auth.uid());
$$;

create or replace function private.is_membro_do_lojista(p_lojista uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.lojista_membros m
    where m.user_id = auth.uid() and m.lojista_id = p_lojista
  );
$$;

create or replace function public.touch_atualizado_em()
returns trigger language plpgsql set search_path = public as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Policies do cliente final
-- ---------------------------------------------------------------------------
drop policy if exists projetos_do_cliente on public.projetos;
create policy projetos_do_cliente on public.projetos
  for all
  using (
    cliente_id in (select private.meus_clientes())
    and private.is_cliente_do_lojista(lojista_id)
  )
  with check (
    cliente_id in (select private.meus_clientes())
    and private.is_cliente_do_lojista(lojista_id)
  );

drop policy if exists projeto_fotos_do_cliente on public.projeto_fotos;
create policy projeto_fotos_do_cliente on public.projeto_fotos
  for all
  using (
    projeto_id in (select p.id from public.projetos p
                   where p.cliente_id in (select private.meus_clientes()))
  )
  with check (
    projeto_id in (select p.id from public.projetos p
                   where p.cliente_id in (select private.meus_clientes()))
  );

drop policy if exists galerias_do_cliente on public.galerias;
create policy galerias_do_cliente on public.galerias
  for select using (cliente_id in (select private.meus_clientes()));

drop policy if exists galeria_fotos_do_cliente on public.galeria_fotos;
create policy galeria_fotos_do_cliente on public.galeria_fotos
  for select using (
    galeria_id in (select g.id from public.galerias g
                   where g.cliente_id in (select private.meus_clientes()))
  );

drop policy if exists projeto_eventos_do_cliente on public.projeto_eventos;
create policy projeto_eventos_do_cliente on public.projeto_eventos
  for select using (
    projeto_id in (select p.id from public.projetos p
                   where p.cliente_id in (select private.meus_clientes()))
  );

drop policy if exists notificacoes_do_cliente on public.notificacoes;
create policy notificacoes_do_cliente on public.notificacoes
  for select using (cliente_id in (select private.meus_clientes()));

drop policy if exists notificacoes_marcar_lida on public.notificacoes;
create policy notificacoes_marcar_lida on public.notificacoes
  for update using (cliente_id in (select private.meus_clientes()))
  with check (cliente_id in (select private.meus_clientes()));

-- ---------------------------------------------------------------------------
-- Policies da equipe do lojista e do super admin
-- ---------------------------------------------------------------------------
drop policy if exists lojista_membros_leitura on public.lojista_membros;
create policy lojista_membros_leitura on public.lojista_membros
  for select using (user_id = auth.uid() or private.is_super_admin());

drop policy if exists galerias_da_equipe on public.galerias;
create policy galerias_da_equipe on public.galerias
  for all
  using (private.is_membro_do_lojista(lojista_id) or private.is_super_admin())
  with check (private.is_membro_do_lojista(lojista_id) or private.is_super_admin());

drop policy if exists galeria_fotos_da_equipe on public.galeria_fotos;
create policy galeria_fotos_da_equipe on public.galeria_fotos
  for all
  using (
    galeria_id in (select g.id from public.galerias g
                   where private.is_membro_do_lojista(g.lojista_id) or private.is_super_admin())
  )
  with check (
    galeria_id in (select g.id from public.galerias g
                   where private.is_membro_do_lojista(g.lojista_id) or private.is_super_admin())
  );

drop policy if exists projetos_da_equipe on public.projetos;
create policy projetos_da_equipe on public.projetos
  for all
  using (private.is_membro_do_lojista(lojista_id) or private.is_super_admin())
  with check (private.is_membro_do_lojista(lojista_id) or private.is_super_admin());

drop policy if exists clientes_da_equipe on public.clientes;
create policy clientes_da_equipe on public.clientes
  for select using (private.is_membro_do_lojista(lojista_id) or private.is_super_admin());

drop policy if exists lojistas_super_admin on public.lojistas;
create policy lojistas_super_admin on public.lojistas
  for all using (private.is_super_admin()) with check (private.is_super_admin());

drop policy if exists galerias_storage_leitura on storage.objects;
create policy galerias_storage_leitura on storage.objects
  for select using (
    bucket_id = 'galerias'
    and (storage.foldername(name))[1]::uuid in (
      select g.id from public.galerias g
      where g.cliente_id in (select private.meus_clientes())
    )
  );

-- ---------------------------------------------------------------------------
-- Remove as versões expostas
-- ---------------------------------------------------------------------------
drop function if exists public.meus_clientes();
drop function if exists public.is_cliente_do_lojista(uuid);
drop function if exists public.is_super_admin();
drop function if exists public.is_membro_do_lojista(uuid);
