-- ===========================================================================
-- Templates (modelos de álbum) e o que o lojista precisa para gerir a loja.
--
-- Rode DEPOIS de 0004_helpers_fora_da_api.sql.
--
-- `lojista_id` nulo = modelo padrão da plataforma, visível para todas as
-- lojas. O lojista duplica um padrão e edita, ou cria do zero; os padrões
-- não têm policy de escrita, então ninguém os altera pela API.
-- ===========================================================================

create table if not exists public.templates (
  id             uuid primary key default gen_random_uuid(),
  lojista_id     uuid references public.lojistas(id) on delete cascade,
  nome           text not null,                 -- "Clássico 30×30"
  produto        text not null,                 -- "Fotolivro capa dura"
  categoria      text not null default 'fotolivro',
  largura_mm     int  not null,
  altura_mm      int  not null,
  paginas_min    int  not null default 20,
  paginas_max    int  not null default 100,
  sangria_mm     numeric(4,1) not null default 3,
  area_segura_mm numeric(4,1) not null default 8,
  preco_base     numeric(10,2),
  publicado      boolean not null default true,
  ordem          int not null default 0,
  criado_em      timestamptz not null default now(),
  atualizado_em  timestamptz not null default now()
);

create index if not exists templates_lojista_idx on public.templates(lojista_id, ordem);

drop trigger if exists templates_touch on public.templates;
create trigger templates_touch before update on public.templates
  for each row execute function public.touch_atualizado_em();

alter table public.projetos
  add column if not exists template_id uuid references public.templates(id) on delete set null;

-- ---------------------------------------------------------------------------
-- Convite por e-mail
--
-- Criar a conta de login exige a service_role, que o lojista não tem. Então o
-- lojista cadastra o cliente pelo e-mail e a linha nasce sem `user_id`; quando
-- alguém entra na loja com aquele e-mail, `garantirCliente` reivindica a linha.
-- Enquanto não for reivindicada, a policy `clientes_self` (user_id = auth.uid())
-- deixa a linha invisível para qualquer cliente.
-- ---------------------------------------------------------------------------
alter table public.clientes
  add column if not exists email text,
  add column if not exists convidado_em timestamptz default now(),
  add column if not exists primeiro_acesso_em timestamptz;

alter table public.clientes alter column user_id drop not null;

-- o par (user_id, lojista_id) continua único, mas agora aceita vários nulos;
-- o e-mail é que identifica o convite dentro da loja
create unique index if not exists clientes_email_por_lojista
  on public.clientes(lojista_id, lower(email)) where email is not null;

-- Marca da loja, que aparece no painel do cliente final
alter table public.lojistas
  add column if not exists cor_secundaria text default '#06B6D4',
  add column if not exists descricao text;

-- ===========================================================================
-- RLS
-- ===========================================================================
alter table public.templates enable row level security;

-- Cliente final vê os padrões e os da loja dele; a equipe vê os da loja.
drop policy if exists templates_leitura on public.templates;
create policy templates_leitura on public.templates
  for select using (
    (lojista_id is null and publicado)
    or lojista_id in (select c.lojista_id from public.clientes c where c.user_id = auth.uid())
    or private.is_membro_do_lojista(lojista_id)
    or private.is_super_admin()
  );

-- Escrita só nos templates da própria loja. `lojista_id is not null` protege
-- os padrões da plataforma de qualquer alteração pela API.
drop policy if exists templates_escrita_da_equipe on public.templates;
create policy templates_escrita_da_equipe on public.templates
  for all
  using (lojista_id is not null
         and (private.is_membro_do_lojista(lojista_id) or private.is_super_admin()))
  with check (lojista_id is not null
         and (private.is_membro_do_lojista(lojista_id) or private.is_super_admin()));

-- A equipe edita a própria loja: logo, nome, slug, cores, contatos.
drop policy if exists lojistas_equipe_edita on public.lojistas;
create policy lojistas_equipe_edita on public.lojistas
  for update
  using (private.is_membro_do_lojista(id) or private.is_super_admin())
  with check (private.is_membro_do_lojista(id) or private.is_super_admin());

-- A equipe cadastra e edita os clientes finais da loja.
drop policy if exists clientes_equipe_gerencia on public.clientes;
create policy clientes_equipe_gerencia on public.clientes
  for all
  using (private.is_membro_do_lojista(lojista_id) or private.is_super_admin())
  with check (private.is_membro_do_lojista(lojista_id) or private.is_super_admin());

-- A equipe avisa os clientes dela.
drop policy if exists notificacoes_equipe on public.notificacoes;
create policy notificacoes_equipe on public.notificacoes
  for all
  using (
    cliente_id in (
      select c.id from public.clientes c
      where private.is_membro_do_lojista(c.lojista_id) or private.is_super_admin()
    )
  )
  with check (
    cliente_id in (
      select c.id from public.clientes c
      where private.is_membro_do_lojista(c.lojista_id) or private.is_super_admin()
    )
  );

-- A equipe registra eventos no histórico dos projetos dela.
drop policy if exists projeto_eventos_equipe on public.projeto_eventos;
create policy projeto_eventos_equipe on public.projeto_eventos
  for all
  using (
    projeto_id in (
      select p.id from public.projetos p
      where private.is_membro_do_lojista(p.lojista_id) or private.is_super_admin()
    )
  )
  with check (
    projeto_id in (
      select p.id from public.projetos p
      where private.is_membro_do_lojista(p.lojista_id) or private.is_super_admin()
    )
  );
