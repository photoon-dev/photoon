-- ###########################################################################
--  PHOTOON — script único de atualização
--
--  Cole tudo no SQL Editor do Supabase e execute uma vez.
--  Reexecutar é seguro: tudo é idempotente.
--
--  Pressupõe que 0001, 0002 e 0004 já foram aplicados (é o estado atual do
--  projeto whsrcrqyoblulpqsjxmq).
--
--  O que este script faz:
--    1. templates (modelos de álbum) + 11 modelos padrão do mercado
--    2. campos de marca da loja (cores, descrição)
--    3. convite por e-mail: cliente cadastrado pelo lojista sem senha
--    4. bucket público das logos
--    5. policies de escrita da equipe do lojista
--    6. índices para centenas de milhares de clientes
-- ###########################################################################


-- ===== 0005_templates_e_gestao.sql =================================

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

-- ===== 0006_templates_padrao.sql ===================================

-- ===========================================================================
-- Modelos padrão da plataforma (lojista_id nulo).
--
-- Formatos correntes do mercado brasileiro de fotolivros e álbuns. Toda loja
-- nasce com estes; o lojista duplica e edita os que quiser, ou cria os seus.
--
-- Idempotente: reexecutar não duplica.
-- ===========================================================================

insert into public.templates
  (lojista_id, nome, produto, categoria, largura_mm, altura_mm,
   paginas_min, paginas_max, sangria_mm, area_segura_mm, preco_base, ordem)
select null, t.nome, t.produto, t.categoria, t.larg, t.alt,
       t.pmin, t.pmax, t.sangria, t.segura, t.preco, t.ordem
from (values
  -- fotolivros quadrados
  ('Clássico 30×30',      'Fotolivro capa dura',   'fotolivro', 300, 300, 20, 100, 3.0, 8.0,  980.00,  1),
  ('Minimal 20×20',       'Fotolivro capa flex',   'fotolivro', 200, 200, 20,  60, 3.0, 6.0,  389.00,  2),
  ('Newborn 15×15',       'Fotolivro capa dura',   'fotolivro', 150, 150, 16,  40, 3.0, 6.0,  259.00,  3),
  ('Casamento fine art 35×35', 'Fotolivro premium','fotolivro', 350, 350, 40, 120, 5.0, 10.0, 2410.00, 4),
  -- paisagem
  ('Panorâmico 30×20',    'Fotolivro capa dura',   'fotolivro', 300, 200, 20,  80, 3.0, 8.0,  760.00,  5),
  ('Paisagem 28×21',      'Fotolivro capa flex',   'fotolivro', 280, 210, 20,  60, 3.0, 6.0,  489.00,  6),
  -- retrato
  ('Retrato 20×30',       'Fotolivro capa dura',   'fotolivro', 200, 300, 20,  80, 3.0, 8.0,  720.00,  7),
  ('Revista 21×28',       'Revista fotográfica',   'revista',   210, 280, 16,  48, 3.0, 6.0,  149.00,  8),
  -- eventos
  ('Formatura 24×30',     'Álbum de evento',       'evento',    240, 300, 24,  80, 3.0, 8.0,  890.00,  9),
  ('Formatura escolar 20×25', 'Álbum de evento',   'evento',    200, 250, 20,  60, 3.0, 8.0,  590.00, 10),
  -- parede
  ('Canvas galeria 40×60','Quadro em canvas',      'quadro',    400, 600,  1,   1, 20.0, 25.0, 289.00, 11)
) as t(nome, produto, categoria, larg, alt, pmin, pmax, sangria, segura, preco, ordem)
where not exists (
  select 1 from public.templates x where x.lojista_id is null and x.nome = t.nome
);

-- (conferência movida para o fim do script)

-- ===== 0007_convite_e_bucket_marcas.sql ============================

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

-- ===== 0008_indices_de_escala.sql ==================================

-- ===========================================================================
-- Índices para o volume real: uma loja com centenas de milhares de clientes,
-- cada cliente com vários eventos e dezenas de álbuns.
--
-- Rode DEPOIS de 0007_convite_e_bucket_marcas.sql.
-- ===========================================================================

-- Listagem paginada de clientes da loja, ordenada por cadastro.
create index if not exists clientes_lojista_convidado_idx
  on public.clientes(lojista_id, convidado_em desc);

-- Busca por nome ou e-mail com ILIKE '%termo%'. Sem trigramas, o ILIKE não
-- usa índice e vira varredura da tabela inteira a cada busca.
create extension if not exists pg_trgm;

create index if not exists clientes_nome_trgm
  on public.clientes using gin (nome gin_trgm_ops);

create index if not exists clientes_email_trgm
  on public.clientes using gin (email gin_trgm_ops);

-- Reivindicação do convite: busca por (lojista, e-mail) com user_id nulo.
create index if not exists clientes_convite_pendente_idx
  on public.clientes(lojista_id, lower(email))
  where user_id is null;

-- Álbuns por evento — a tela do lojista agrupa os projetos pela galeria.
create index if not exists projetos_galeria_idx
  on public.projetos(galeria_id);

-- Galerias de um cliente, da mais recente para a mais antiga.
create index if not exists galerias_cliente_recente_idx
  on public.galerias(cliente_id, atualizada_em desc);

-- Contagem de fotos por galeria (usada em toda listagem).
create index if not exists galeria_fotos_contagem_idx
  on public.galeria_fotos(galeria_id);

-- Notificações não lidas do cliente (o badge do sino).
create index if not exists notificacoes_nao_lidas_idx
  on public.notificacoes(cliente_id)
  where not lida;


-- ###########################################################################
--  Conferência
-- ###########################################################################
select 'modelos padrão' as item, count(*)::text as valor from public.templates where lojista_id is null
union all
select 'coluna clientes.email', count(*)::text from information_schema.columns
  where table_schema='public' and table_name='clientes' and column_name='email'
union all
select 'função reivindicar_convite', count(*)::text from pg_proc p
  join pg_namespace n on n.oid=p.pronamespace
  where n.nspname='public' and p.proname='reivindicar_convite'
union all
select 'bucket marcas (público)', coalesce(public::text,'ausente') from storage.buckets where id='marcas'
union all
select 'índices novos', count(*)::text from pg_indexes
  where schemaname='public' and indexname in (
    'clientes_lojista_convidado_idx','clientes_nome_trgm','clientes_email_trgm',
    'clientes_convite_pendente_idx','projetos_galeria_idx',
    'galerias_cliente_recente_idx','galeria_fotos_contagem_idx','notificacoes_nao_lidas_idx');
