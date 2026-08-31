-- ===========================================================================
-- 0014 — Filiais e códigos amigáveis
--
-- Duas coisas que o painel inteiro passa a pedir e que não existiam:
--
--   1. FILIAL. Pedido, projeto, cliente, vendedor e produção passam a ter um
--      escopo dentro da loja. Toda loja ganha uma filial padrão, para que
--      nenhuma linha antiga fique órfã e nenhum filtro precise tratar null.
--
--   2. CÓDIGO AMIGÁVEL. O UUID continua sendo a chave primária — o código é
--      coluna única e indexada, nunca PK. É o que o cliente diz ao telefone:
--      projeto L4512367, pedido PT-10482.
--
-- Aditiva: nenhuma tabela ou coluna é removida.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- Filiais
-- ---------------------------------------------------------------------------
create table if not exists public.filiais (
  id           uuid primary key default gen_random_uuid(),
  lojista_id   uuid not null references public.lojistas(id) on delete cascade,
  nome         text not null,
  cnpj         text,
  -- Endereço no mesmo formato que `expedicao.endereco` já usa.
  endereco     jsonb,
  responsavel  text,
  telefone     text,
  email        text,
  -- Uma filial pode produzir, pode só receber retirada, ou as duas coisas.
  produz       boolean not null default true,
  retirada     boolean not null default false,
  -- A filial padrão da loja: recebe o que não foi atribuído a nenhuma outra.
  padrao       boolean not null default false,
  ativo        boolean not null default true,
  criado_em    timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index if not exists filiais_loja_idx on public.filiais(lojista_id) where ativo;
-- Só uma padrão por loja.
create unique index if not exists filiais_padrao_por_loja
  on public.filiais(lojista_id) where padrao;

drop trigger if exists filiais_touch on public.filiais;
create trigger filiais_touch before update on public.filiais
  for each row execute function public.touch_atualizado_em();

-- Toda loja existente ganha a sua. Idempotente: roda de novo sem duplicar.
insert into public.filiais (lojista_id, nome, padrao, produz, retirada)
select l.id, 'Matriz', true, true, true
from public.lojistas l
where not exists (select 1 from public.filiais f where f.lojista_id = l.id);

-- E toda loja nova também.
create or replace function public.criar_filial_padrao()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.filiais (lojista_id, nome, padrao, produz, retirada)
  values (new.id, 'Matriz', true, true, true);
  return new;
end;
$$;

drop trigger if exists lojistas_filial_padrao on public.lojistas;
create trigger lojistas_filial_padrao after insert on public.lojistas
  for each row execute function public.criar_filial_padrao();

-- ---------------------------------------------------------------------------
-- Escopo de filial nas entidades que o painel filtra
--
-- `on delete set null` de propósito: apagar uma filial não pode apagar pedido.
-- ---------------------------------------------------------------------------
alter table public.pedidos    add column if not exists filial_id uuid references public.filiais(id) on delete set null;
alter table public.projetos   add column if not exists filial_id uuid references public.filiais(id) on delete set null;
alter table public.clientes   add column if not exists filial_id uuid references public.filiais(id) on delete set null;
alter table public.vendedores add column if not exists filial_id uuid references public.filiais(id) on delete set null;
alter table public.producao   add column if not exists filial_id uuid references public.filiais(id) on delete set null;

create index if not exists pedidos_filial_idx   on public.pedidos(filial_id)   where filial_id is not null;
create index if not exists projetos_filial_idx  on public.projetos(filial_id)  where filial_id is not null;
create index if not exists clientes_filial_idx  on public.clientes(filial_id)  where filial_id is not null;

-- O que já existe fica na matriz.
update public.pedidos p    set filial_id = f.id from public.filiais f where f.lojista_id = p.lojista_id and f.padrao and p.filial_id is null;
update public.projetos pr  set filial_id = f.id from public.filiais f where f.lojista_id = pr.lojista_id and f.padrao and pr.filial_id is null;
update public.clientes c   set filial_id = f.id from public.filiais f where f.lojista_id = c.lojista_id and f.padrao and c.filial_id is null;
update public.vendedores v set filial_id = f.id from public.filiais f where f.lojista_id = v.lojista_id and f.padrao and v.filial_id is null;

-- ---------------------------------------------------------------------------
-- Código amigável do projeto
--
-- Letra do tipo de produto + 7 dígitos, sequencial por loja:
--   L = fotolivro · R = revelação · F = fotoproduto · P = outros
--
-- Sequencial e não aleatório porque o atendimento precisa comparar dois
-- códigos e saber qual é mais novo. Começa em 4.500.000 para que o primeiro
-- projeto de uma loja nova não anuncie que é o primeiro.
-- ---------------------------------------------------------------------------
alter table public.projetos add column if not exists codigo text;

create unique index if not exists projetos_codigo_por_loja
  on public.projetos(lojista_id, codigo) where codigo is not null;

create or replace function public.letra_do_produto(categoria text)
returns text language sql immutable as $$
  select case lower(coalesce(categoria, ''))
    when 'revelacao'   then 'R'
    when 'revelação'   then 'R'
    when 'fotoproduto' then 'F'
    when 'album'       then 'L'
    when 'álbum'       then 'L'
    when 'fotolivro'   then 'L'
    else 'P'
  end;
$$;

create or replace function public.proximo_codigo_projeto(loja uuid, categoria text)
returns text language plpgsql volatile security definer set search_path = public as $$
declare
  letra text := public.letra_do_produto(categoria);
  proximo bigint;
begin
  -- O maior número já usado nesta loja, qualquer que seja a letra: o
  -- sequencial é da loja, não da categoria, senão dois projetos de tipos
  -- diferentes recebem o mesmo número e só a letra os separa.
  select coalesce(max(substring(codigo from 2)::bigint), 4500000) + 1
    into proximo
    from public.projetos
   where lojista_id = loja and codigo ~ '^[A-Z][0-9]{7}$';

  return letra || lpad(proximo::text, 7, '0');
end;
$$;

create or replace function public.projeto_recebe_codigo()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.codigo is null then
    new.codigo := public.proximo_codigo_projeto(
      new.lojista_id,
      coalesce((select categoria from public.templates where id = new.template_id), 'album')
    );
  end if;
  return new;
end;
$$;

drop trigger if exists projetos_codigo on public.projetos;
create trigger projetos_codigo before insert on public.projetos
  for each row execute function public.projeto_recebe_codigo();

-- Os projetos que já existem.
do $$
declare r record;
begin
  for r in select id, lojista_id, template_id from public.projetos where codigo is null order by criado_em
  loop
    update public.projetos
       set codigo = public.proximo_codigo_projeto(
             r.lojista_id,
             coalesce((select categoria from public.templates where id = r.template_id), 'album'))
     where id = r.id;
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Código amigável do pedido
--
-- `numero` já é sequencial por loja e visível ao cliente. O código é só a
-- forma de escrever esse mesmo número — coluna gerada, não há o que sair de
-- sincronia e não há migração de dado.
-- ---------------------------------------------------------------------------
alter table public.pedidos
  add column if not exists codigo text generated always as ('PT-' || numero::text) stored;

create index if not exists pedidos_codigo_idx on public.pedidos(lojista_id, codigo);

-- ---------------------------------------------------------------------------
-- Busca: o painel procura projeto por código, nome e cliente
-- ---------------------------------------------------------------------------
create index if not exists projetos_titulo_busca
  on public.projetos using gin (to_tsvector('portuguese', coalesce(titulo, '')));

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.filiais enable row level security;

drop policy if exists filiais_equipe on public.filiais;
create policy filiais_equipe on public.filiais for all
  using (private.is_membro_do_lojista(lojista_id) or private.is_super_admin())
  with check (private.is_membro_do_lojista(lojista_id) or private.is_super_admin());

-- O cliente vê as filiais da loja dele: é o que alimenta a escolha de retirada.
drop policy if exists filiais_do_cliente on public.filiais;
create policy filiais_do_cliente on public.filiais for select
  using (ativo and private.is_cliente_do_lojista(lojista_id));
