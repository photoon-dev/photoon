-- ===========================================================================
-- Reivindicação do convite e bucket público das logos.
--
-- Rode DEPOIS de 0005_templates_e_gestao.sql.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- reivindicar_convite
--
-- A linha de convite tem `user_id` nulo, então nenhuma policy do cliente a
-- alcança — nem para ler, nem para atualizar. Esta função roda com privilégio
-- definido e confere, ela mesma, que o e-mail do convite é o do usuário
-- logado antes de gravar. Sem isso, dar ao cliente permissão de update em
-- linhas de user_id nulo deixaria qualquer um sequestrar o convite alheio.
-- ---------------------------------------------------------------------------
create or replace function public.reivindicar_convite(p_lojista uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
  v_id    uuid;
begin
  if auth.uid() is null then
    return null;
  end if;

  select lower(u.email) into v_email from auth.users u where u.id = auth.uid();
  if v_email is null then
    return null;
  end if;

  update public.clientes c
     set user_id = auth.uid(),
         primeiro_acesso_em = coalesce(c.primeiro_acesso_em, now())
   where c.lojista_id = p_lojista
     and c.user_id is null
     and lower(c.email) = v_email
  returning c.id into v_id;

  return v_id;
end;
$$;

revoke all on function public.reivindicar_convite(uuid) from public;
grant execute on function public.reivindicar_convite(uuid) to authenticated;

-- ---------------------------------------------------------------------------
-- Bucket das logos
--
-- Público de propósito: a logo aparece na tela de login, antes de existir
-- sessão. Só a equipe da loja escreve, e apenas na pasta da própria loja.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('marcas', 'marcas', true)
on conflict (id) do update set public = true;

drop policy if exists marcas_leitura_publica on storage.objects;
create policy marcas_leitura_publica on storage.objects
  for select using (bucket_id = 'marcas');

drop policy if exists marcas_escrita_da_equipe on storage.objects;
create policy marcas_escrita_da_equipe on storage.objects
  for all
  using (
    bucket_id = 'marcas'
    and (storage.foldername(name))[1]::uuid in (
      select l.id from public.lojistas l
      where private.is_membro_do_lojista(l.id) or private.is_super_admin()
    )
  )
  with check (
    bucket_id = 'marcas'
    and (storage.foldername(name))[1]::uuid in (
      select l.id from public.lojistas l
      where private.is_membro_do_lojista(l.id) or private.is_super_admin()
    )
  );
