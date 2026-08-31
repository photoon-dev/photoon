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
-- Sequenciais por loja, atômicos
--
-- `max(...) + 1` não serve: entre o SELECT de uma transação e o INSERT dela,
-- outra transação lê o mesmo máximo e as duas calculam o mesmo número. Com o
-- índice único isso vira erro na cara do cliente em vez de código duplicado —
-- falha segura, mas ainda é falha, e some justamente quando a loja está
-- movimentada.
--
-- O contador resolve pela raiz: `update ... returning` tranca a LINHA do
-- contador, então duas transações simultâneas entram em fila e cada uma sai
-- com um valor diferente. Vale mesmo quando as chamadas estão em transações
-- separadas — que é o caso de um RPC pelo PostgREST, onde um advisory lock
-- seria solto assim que a função retornasse, reabrindo a corrida.
--
-- Uma SEQUENCE do Postgres não serviria aqui: ela é não-transacional e pula
-- números quando a transação aborta. O contador em tabela é transacional --
-- se o insert do projeto volta atrás, o contador volta junto e o número é
-- reaproveitado. O preço é que os inserts de uma mesma loja se serializam;
-- para o volume de uma loja de fotografia, é troca barata por não ter buraco
-- nem colisão.
--
-- Fica em `private` porque a API não expõe esse schema — nenhum cliente
-- precisa ler nem escrever o contador direto.
-- ---------------------------------------------------------------------------
create table if not exists private.loja_sequencias (
  lojista_id uuid not null references public.lojistas(id) on delete cascade,
  escopo     text not null,            -- 'projeto' | 'pedido'
  valor      bigint not null,
  primary key (lojista_id, escopo)
);

create or replace function private.proximo_sequencial(loja uuid, p_escopo text, inicio bigint)
returns bigint language plpgsql volatile security definer set search_path = public as $$
declare v bigint;
begin
  loop
    -- Caminho normal: a linha existe e o update a tranca.
    update private.loja_sequencias
       set valor = valor + 1
     where lojista_id = loja and escopo = p_escopo
    returning valor into v;
    exit when found;

    -- Primeira vez desta loja neste escopo.
    begin
      insert into private.loja_sequencias (lojista_id, escopo, valor)
      values (loja, p_escopo, inicio + 1);
      v := inicio + 1;
      exit;
    exception when unique_violation then
      -- Outra transação criou a linha entre o update e o insert: volta ao
      -- update, que agora encontra.
      null;
    end;
  end loop;
  return v;
end;
$$;

-- ---------------------------------------------------------------------------
-- Código amigável do projeto
--
-- Letra do tipo de produto + 7 dígitos, sequencial por loja:
--   L = fotolivro · R = revelação · F = fotoproduto · P = outros
--
-- Sequencial e não aleatório porque o atendimento precisa comparar dois
-- códigos e saber qual é mais novo. Começa em 4.500.000 para que o primeiro
-- projeto de uma loja nova não anuncie que é o primeiro.
--
-- O número é da LOJA, não da categoria: sequenciais separados por letra fariam
-- L4500001 e R4500001 nascerem no mesmo dia, e um dígito trocado ao telefone
-- viraria outro projeto que existe.
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
returns text language sql volatile security definer set search_path = public as $$
  select public.letra_do_produto(categoria)
      || lpad(private.proximo_sequencial(loja, 'projeto', 4500000)::text, 7, '0');
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

-- Os projetos que já existem, em ordem de criação. O contador nasce aqui e
-- continua de onde este laço parar.
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
-- Número e código amigável do pedido
--
-- `numero` já era sequencial por loja e visível ao cliente ("#1042"), e tinha
-- exatamente a mesma corrida: `proximo_numero_pedido` era um `max(numero)+1`
-- puro. Passa a sair do mesmo contador.
--
-- O contador de cada loja começa no maior número que ela já usou, então
-- **nenhum pedido existente muda de número** e o próximo continua a série.
--
-- `codigo` é coluna gerada: é só a forma de escrever o mesmo `numero`, não há
-- o que sair de sincronia e não há dado a migrar.
-- ---------------------------------------------------------------------------
insert into private.loja_sequencias (lojista_id, escopo, valor)
select l.id, 'pedido', coalesce((select max(p.numero) from public.pedidos p where p.lojista_id = l.id), 1000)
from public.lojistas l
on conflict (lojista_id, escopo) do nothing;

create or replace function public.proximo_numero_pedido(loja uuid)
returns int language sql volatile security definer set search_path = public as $$
  select private.proximo_sequencial(loja, 'pedido', 1000)::int;
$$;

-- Quem inserir sem número recebe um, atômico. Quem passar o número (o seed,
-- por exemplo) fica com o que passou.
create or replace function public.pedido_recebe_numero()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.numero is null then
    new.numero := public.proximo_numero_pedido(new.lojista_id);
  end if;
  return new;
end;
$$;

drop trigger if exists pedidos_numero on public.pedidos;
create trigger pedidos_numero before insert on public.pedidos
  for each row execute function public.pedido_recebe_numero();

-- `numero` precisa aceitar nulo na entrada para o trigger poder preenchê-lo;
-- a coluna continua NOT NULL, que é checado depois do trigger BEFORE.
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
