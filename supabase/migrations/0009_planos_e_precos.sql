-- ===========================================================================
-- Cobrança em dois níveis
--
--   super admin -> lojista : planos (fixo + por projeto + por lâmina)
--   lojista     -> cliente : preço no modelo (base + página extra + foto extra)
--
-- Mais as regras do que cada evento libera para o cliente escolher.
--
-- Rode DEPOIS de ATUALIZAR.sql (migrations 0005 a 0008).
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. Planos que o super admin cobra do lojista
--
-- Os três componentes convivem: um plano só de mensalidade tem os outros
-- zerados; um plano só por lâmina zera a mensalidade. Não há tipo de plano,
-- só valores — é isso que dá a flexibilidade de montar qualquer combinação.
-- ---------------------------------------------------------------------------
create table if not exists public.planos (
  id                  uuid primary key default gen_random_uuid(),
  nome                text not null,
  descricao           text,
  valor_mensal        numeric(10,2) not null default 0,
  valor_por_projeto   numeric(10,2) not null default 0,
  valor_por_lamina    numeric(10,2) not null default 0,
  -- nulo = ilimitado
  limite_projetos     int,
  limite_clientes     int,
  limite_armazenamento_gb int,
  ativo               boolean not null default true,
  ordem               int not null default 0,
  criado_em           timestamptz not null default now(),
  atualizado_em       timestamptz not null default now()
);

drop trigger if exists planos_touch on public.planos;
create trigger planos_touch before update on public.planos
  for each row execute function public.touch_atualizado_em();

alter table public.lojistas
  add column if not exists plano_id uuid references public.planos(id) on delete set null,
  add column if not exists plano_desde timestamptz;

-- ---------------------------------------------------------------------------
-- 2. Preço que o lojista cobra do cliente, por modelo
--
-- "Projeto com N páginas e M fotos custa X; cada página a mais custa A, cada
--  foto a mais custa B." O valor é sempre o da tabela vigente: reajustar o
--  modelo altera o preço de álbuns em andamento — decisão do lojista.
-- ---------------------------------------------------------------------------
alter table public.templates
  add column if not exists paginas_incluidas   int not null default 20,
  add column if not exists fotos_incluidas     int not null default 0,
  add column if not exists preco_pagina_extra  numeric(10,2) not null default 0,
  add column if not exists preco_foto_extra    numeric(10,2) not null default 0;

-- os padrões da plataforma nascem com as páginas mínimas já incluídas
update public.templates
   set paginas_incluidas = paginas_min
 where lojista_id is null and paginas_incluidas = 20 and paginas_min <> 20;

-- ---------------------------------------------------------------------------
-- 3. Regras do evento: o que o cliente pode escolher
--
-- Ficam na galeria (o evento), não no cliente: o mesmo cliente pode ter um
-- casamento 30×30 de 40 páginas e um batizado 20×20 de 20.
--
-- `templates_permitidos` nulo ou vazio = todos os modelos publicados.
-- Os limites nulos caem no que o modelo definir.
-- ---------------------------------------------------------------------------
alter table public.galerias
  add column if not exists templates_permitidos uuid[],
  add column if not exists paginas_min int,
  add column if not exists paginas_max int,
  add column if not exists fotos_max int,
  add column if not exists permite_paginas_extras boolean not null default true;

-- ---------------------------------------------------------------------------
-- 4. Consumo do lojista, por competência
--
-- Uma linha por (loja, mês). O gatilho soma na criação do projeto; as lâminas
-- são recontadas quando o editor salva.
-- ---------------------------------------------------------------------------
create table if not exists public.uso_lojista (
  lojista_id  uuid not null references public.lojistas(id) on delete cascade,
  competencia date not null,             -- sempre o dia 1 do mês
  projetos    int  not null default 0,
  laminas     int  not null default 0,
  primary key (lojista_id, competencia)
);

create or replace function public.registrar_uso_projeto()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_comp date := date_trunc('month', now())::date;
  v_lam  int  := coalesce(jsonb_array_length(new.paginas), 0);
begin
  if tg_op = 'INSERT' then
    insert into public.uso_lojista (lojista_id, competencia, projetos, laminas)
    values (new.lojista_id, v_comp, 1, v_lam)
    on conflict (lojista_id, competencia) do update
      set projetos = public.uso_lojista.projetos + 1,
          laminas  = public.uso_lojista.laminas + v_lam;
  else
    -- só a diferença de lâminas
    insert into public.uso_lojista (lojista_id, competencia, projetos, laminas)
    values (new.lojista_id, v_comp, 0, v_lam - coalesce(jsonb_array_length(old.paginas), 0))
    on conflict (lojista_id, competencia) do update
      set laminas = public.uso_lojista.laminas
                    + (v_lam - coalesce(jsonb_array_length(old.paginas), 0));
  end if;
  return new;
end;
$$;

drop trigger if exists projetos_uso on public.projetos;
create trigger projetos_uso after insert or update of paginas on public.projetos
  for each row execute function public.registrar_uso_projeto();

-- ---------------------------------------------------------------------------
-- 5. Limite do plano bloqueia a criação
--
-- No gatilho, e não na aplicação: vale para qualquer caminho de escrita,
-- inclusive a API direta.
-- ---------------------------------------------------------------------------
create or replace function public.checar_limite_do_plano()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_limite int;
  v_atual  int;
begin
  select p.limite_projetos into v_limite
    from public.lojistas l
    join public.planos p on p.id = l.plano_id
   where l.id = new.lojista_id;

  if v_limite is null then
    return new;                       -- sem plano ou sem limite
  end if;

  select count(*) into v_atual from public.projetos where lojista_id = new.lojista_id;

  if v_atual >= v_limite then
    raise exception 'O plano da loja permite % projetos e o limite já foi atingido.', v_limite
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

drop trigger if exists projetos_limite on public.projetos;
create trigger projetos_limite before insert on public.projetos
  for each row execute function public.checar_limite_do_plano();

-- ===========================================================================
-- RLS
-- ===========================================================================
alter table public.planos      enable row level security;
alter table public.uso_lojista enable row level security;

-- O lojista precisa ler o próprio plano (para mostrar limites); só o super
-- admin escreve.
drop policy if exists planos_leitura on public.planos;
create policy planos_leitura on public.planos
  for select using (ativo or private.is_super_admin());

drop policy if exists planos_super_admin on public.planos;
create policy planos_super_admin on public.planos
  for all using (private.is_super_admin()) with check (private.is_super_admin());

-- Cada loja vê o próprio consumo; o super admin vê tudo. Ninguém escreve pela
-- API: quem grava é o gatilho, com privilégio definido.
drop policy if exists uso_leitura on public.uso_lojista;
create policy uso_leitura on public.uso_lojista
  for select using (private.is_membro_do_lojista(lojista_id) or private.is_super_admin());

create index if not exists uso_lojista_competencia_idx
  on public.uso_lojista(competencia desc);

-- ---------------------------------------------------------------------------
-- 6. Planos iniciais, para não começar vazio
-- ---------------------------------------------------------------------------
insert into public.planos
  (nome, descricao, valor_mensal, valor_por_projeto, valor_por_lamina,
   limite_projetos, limite_clientes, limite_armazenamento_gb, ordem)
select t.* from (values
  ('Essencial', 'Mensalidade fixa, volume menor',        149.00,  0.00, 0.00,   50,   200,  50, 1),
  ('Studio',    'Mensalidade mais valor por projeto',    349.00,  9.00, 0.00,  300,  2000, 250, 2),
  ('Escala',    'Mensalidade, projeto e lâmina',         890.00,  6.00, 0.40, null, null, 1000, 3),
  ('Sob demanda', 'Sem mensalidade, só por projeto',       0.00, 29.00, 0.00, null,   500, 100, 4)
) as t(nome, descricao, valor_mensal, valor_por_projeto, valor_por_lamina,
       limite_projetos, limite_clientes, limite_armazenamento_gb, ordem)
where not exists (select 1 from public.planos x where x.nome = t.nome);
