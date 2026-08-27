-- ===========================================================================
-- Contas e loja de teste.
--
-- APLICADO em 27/08/2026 no projeto whsrcrqyoblulpqsjxmq.
-- Mantido no repositório para recriar o ambiente do zero.
--
-- Rode DEPOIS de 0001_init.sql e 0002_papeis.sql.
--
-- ANTES DE RODAR: na seção 2, troque SENHA_DE_TESTE pela senha desejada.
-- A senha não fica neste arquivo de propósito: ele é versionado no GitHub.
-- O script recusa rodar se você esquecer.
--
-- Estas contas são para teste. Troque as senhas antes de qualquer uso real.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. Loja de teste
-- ---------------------------------------------------------------------------
insert into public.lojistas (slug, nome, telefone_suporte, email_suporte)
values ('demo', 'Estúdio Demo', '(11) 98844-2210', 'contato@photoon.com.br')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- 2. Usuários
--
-- Cria direto em auth.users porque a API de admin exige a service_role.
-- Se algum INSERT falhar por coluna faltando (a estrutura do GoTrue muda
-- entre versões do Supabase), crie os três pelo painel em
-- Authentication > Users > Add user, marcando "Auto Confirm User",
-- e rode apenas as seções 3 e 4 deste arquivo.
-- ---------------------------------------------------------------------------
do $$
declare
  v_senha text := 'SENHA_DE_TESTE';   -- <<< TROQUE AQUI ANTES DE RODAR
  v_uid   uuid;
  v_conta record;
begin
  if v_senha = 'SENHA_DE_TESTE' then
    raise exception 'Troque SENHA_DE_TESTE pela senha real antes de rodar.';
  end if;

  for v_conta in
    select * from (values
      ('admin@photoon.com.br',   'Super Admin'),
      ('lojista@photoon.com.br', 'Lojista Demo'),
      ('usuario@photoon.com.br', 'Usuário Demo')
    ) as t(email, nome)
  loop
    select id into v_uid from auth.users where email = v_conta.email;
    if v_uid is not null then
      raise notice 'já existe, pulando: %', v_conta.email;
      continue;
    end if;

    v_uid := gen_random_uuid();

    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, recovery_token, email_change, email_change_token_new
    ) values (
      '00000000-0000-0000-0000-000000000000', v_uid, 'authenticated', 'authenticated',
      v_conta.email, crypt(v_senha, gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      jsonb_build_object('nome', v_conta.nome),
      '', '', '', ''
    );

    -- Identidade do provedor "email". Sem ela o login por senha não resolve.
    insert into auth.identities (
      id, user_id, provider_id, identity_data, provider,
      last_sign_in_at, created_at, updated_at
    ) values (
      gen_random_uuid(), v_uid, v_uid::text,
      jsonb_build_object('sub', v_uid::text, 'email', v_conta.email, 'email_verified', true),
      'email', now(), now(), now()
    );

    raise notice 'criado: %', v_conta.email;
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- 3. Papéis
-- ---------------------------------------------------------------------------
-- admin@ -> super admin da plataforma
insert into public.super_admins (user_id)
select id from auth.users where email = 'admin@photoon.com.br'
on conflict (user_id) do nothing;

-- lojista@ -> admin da loja demo
insert into public.lojista_membros (user_id, lojista_id, papel)
select u.id, l.id, 'admin'
from auth.users u, public.lojistas l
where u.email = 'lojista@photoon.com.br' and l.slug = 'demo'
on conflict (user_id, lojista_id) do nothing;

-- usuario@ -> cliente final da loja demo
insert into public.clientes (user_id, lojista_id, nome)
select u.id, l.id, 'Usuário Demo'
from auth.users u, public.lojistas l
where u.email = 'usuario@photoon.com.br' and l.slug = 'demo'
on conflict (user_id, lojista_id) do nothing;

-- ---------------------------------------------------------------------------
-- 4. Galeria e projetos, para as telas não ficarem vazias
-- ---------------------------------------------------------------------------
insert into public.galerias (lojista_id, cliente_id, nome)
select l.id, c.id, 'Formatura 2026 · sessão de teste'
from public.clientes c
join public.lojistas l on l.id = c.lojista_id
join auth.users u on u.id = c.user_id
where u.email = 'usuario@photoon.com.br' and l.slug = 'demo'
  and not exists (select 1 from public.galerias g where g.cliente_id = c.id);

insert into public.projetos (
  lojista_id, cliente_id, galeria_id, titulo,
  produto_nome, produto_tamanho, preco_estimado
)
select l.id, c.id, g.id, t.titulo, t.produto, t.tamanho, t.preco
from public.clientes c
join public.lojistas l on l.id = c.lojista_id
join auth.users u on u.id = c.user_id
join public.galerias g on g.cliente_id = c.id
cross join (values
  ('Fotolivro da formatura', 'Wood Fotográfico', '40 × 30 cm', 489.00),
  ('Álbum dos pais',         'Encadernado',      '30 × 30 cm', 389.00),
  ('Revista da turma',       'Revista',          '21 × 28 cm', 149.00)
) as t(titulo, produto, tamanho, preco)
where u.email = 'usuario@photoon.com.br' and l.slug = 'demo'
  and not exists (select 1 from public.projetos p where p.cliente_id = c.id);

-- ---------------------------------------------------------------------------
-- Conferência
-- ---------------------------------------------------------------------------
select u.email,
       case when s.user_id is not null then 'super admin'
            when m.user_id is not null then 'admin do lojista'
            when c.user_id is not null then 'cliente final'
            else 'sem papel' end as papel
from auth.users u
left join public.super_admins    s on s.user_id = u.id
left join public.lojista_membros m on m.user_id = u.id
left join public.clientes        c on c.user_id = u.id
where u.email like '%@photoon.com.br'
order by u.email;
