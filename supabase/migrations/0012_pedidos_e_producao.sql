-- 0012 — o negócio: catálogo, pedidos, produção, expedição e pagamentos.
--
-- Até aqui a plataforma sabia montar álbuns e não sabia vendê-los. Este é o
-- modelo que sustenta as telas de Pedidos, Produção, Expedição, Pagamentos,
-- Carteira, Catálogo, Preços, CRM, Vendedores e Relatórios.
--
-- Duas decisões que valem explicação:
--
-- 1. O preço é CONGELADO no item do pedido. `src/lib/preco.ts` calcula a partir
--    do template, e o template muda: sem congelar, alterar o preço de um modelo
--    mudaria o valor de uma compra já fechada.
-- 2. Credencial de gateway não fica em texto puro. É chave de dinheiro de
--    terceiro; a coluna guarda o cifrado e a chave de cifragem vive fora do
--    banco, no ambiente do app.

-- ---------------------------------------------------------------------------
-- Catálogo: o que a loja vende
-- ---------------------------------------------------------------------------
create table if not exists public.produtos (
  id            uuid primary key default gen_random_uuid(),
  lojista_id    uuid not null references public.lojistas(id) on delete cascade,
  template_id   uuid references public.templates(id) on delete set null,
  nome          text not null,
  descricao     text,
  categoria     text not null default 'album',
  sku           text,
  preco_base    numeric(12,2) not null default 0,
  preco_pagina_extra numeric(12,2) not null default 0,
  preco_foto_extra   numeric(12,2) not null default 0,
  prazo_producao_dias int not null default 7,
  ativo         boolean not null default true,
  ordem         int not null default 0,
  criado_em     timestamptz not null default now()
);
create index if not exists produtos_loja_idx on public.produtos(lojista_id) where ativo;

-- ---------------------------------------------------------------------------
-- Vendedores: quem atende o cliente e ganha comissão
-- ---------------------------------------------------------------------------
create table if not exists public.vendedores (
  id           uuid primary key default gen_random_uuid(),
  lojista_id   uuid not null references public.lojistas(id) on delete cascade,
  user_id      uuid references auth.users(id) on delete set null,
  nome         text not null,
  email        text,
  telefone     text,
  comissao_pct numeric(5,2) not null default 0,
  ativo        boolean not null default true,
  criado_em    timestamptz not null default now()
);
create index if not exists vendedores_loja_idx on public.vendedores(lojista_id);

-- ---------------------------------------------------------------------------
-- Pedidos
--
-- `numero` é sequencial POR LOJA e visível ao cliente: "#1042" é o que ele diz
-- ao telefone. Um uuid não serve para isso.
-- ---------------------------------------------------------------------------
create table if not exists public.pedidos (
  id            uuid primary key default gen_random_uuid(),
  lojista_id    uuid not null references public.lojistas(id) on delete cascade,
  cliente_id    uuid references public.clientes(id) on delete set null,
  vendedor_id   uuid references public.vendedores(id) on delete set null,
  numero        int not null,
  -- rascunho: montado e não fechado | aguardando_pagamento | pago |
  -- em_producao | pronto | enviado | entregue | cancelado
  estado        text not null default 'rascunho',
  canal         text not null default 'loja',
  subtotal      numeric(12,2) not null default 0,
  desconto      numeric(12,2) not null default 0,
  frete         numeric(12,2) not null default 0,
  total         numeric(12,2) not null default 0,
  observacao    text,
  motivo_cancelamento text,
  visto_em      timestamptz,
  prazo_em      date,
  criado_em     timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  unique (lojista_id, numero)
);
create index if not exists pedidos_loja_estado_idx on public.pedidos(lojista_id, estado);
create index if not exists pedidos_loja_data_idx  on public.pedidos(lojista_id, criado_em desc);
create index if not exists pedidos_nao_vistos_idx on public.pedidos(lojista_id) where visto_em is null;

create table if not exists public.pedido_itens (
  id          uuid primary key default gen_random_uuid(),
  pedido_id   uuid not null references public.pedidos(id) on delete cascade,
  produto_id  uuid references public.produtos(id) on delete set null,
  projeto_id  uuid references public.projetos(id) on delete set null,
  -- Congelados no momento da compra.
  descricao   text not null,
  quantidade  int not null default 1,
  preco_unit  numeric(12,2) not null default 0,
  paginas     int not null default 0,
  fotos       int not null default 0,
  total       numeric(12,2) not null default 0
);
create index if not exists pedido_itens_pedido_idx on public.pedido_itens(pedido_id);

-- ---------------------------------------------------------------------------
-- Produção e expedição
-- ---------------------------------------------------------------------------
create table if not exists public.producao (
  id          uuid primary key default gen_random_uuid(),
  pedido_id   uuid not null references public.pedidos(id) on delete cascade,
  etapa       text not null default 'fila',  -- fila | impressao | acabamento | revisao | pronto
  responsavel text,
  iniciada_em timestamptz,
  concluida_em timestamptz,
  observacao  text,
  atualizado_em timestamptz not null default now()
);
create index if not exists producao_pedido_idx on public.producao(pedido_id);
create index if not exists producao_etapa_idx  on public.producao(etapa);

create table if not exists public.expedicao (
  id           uuid primary key default gen_random_uuid(),
  pedido_id    uuid not null references public.pedidos(id) on delete cascade,
  transportadora text,
  rastreio     text,
  estado       text not null default 'aguardando', -- aguardando | postado | em_transito | entregue | devolvido
  endereco     jsonb,
  postado_em   timestamptz,
  entregue_em  timestamptz,
  atualizado_em timestamptz not null default now()
);
create index if not exists expedicao_pedido_idx on public.expedicao(pedido_id);

-- ---------------------------------------------------------------------------
-- Pagamentos
-- ---------------------------------------------------------------------------
create table if not exists public.lojista_gateways (
  id          uuid primary key default gen_random_uuid(),
  lojista_id  uuid not null references public.lojistas(id) on delete cascade,
  provedor    text not null,           -- mercadopago | asaas | pagseguro | stripe
  -- Cifrado no app. Nunca gravar chave em texto puro aqui.
  credenciais_cifradas text,
  aceita_pix     boolean not null default false,
  aceita_cartao  boolean not null default false,
  aceita_boleto  boolean not null default false,
  ativo       boolean not null default false,
  criado_em   timestamptz not null default now(),
  unique (lojista_id, provedor)
);

create table if not exists public.pagamentos (
  id          uuid primary key default gen_random_uuid(),
  pedido_id   uuid not null references public.pedidos(id) on delete cascade,
  lojista_id  uuid not null references public.lojistas(id) on delete cascade,
  provedor    text,
  metodo      text not null default 'pix',   -- pix | cartao | boleto | manual
  estado      text not null default 'pendente', -- pendente | aprovado | recusado | estornado | expirado
  valor       numeric(12,2) not null default 0,
  id_externo  text,
  pago_em     timestamptz,
  criado_em   timestamptz not null default now()
);
create index if not exists pagamentos_pedido_idx on public.pagamentos(pedido_id);
create index if not exists pagamentos_loja_idx   on public.pagamentos(lojista_id, estado);

-- ---------------------------------------------------------------------------
-- Auditoria: quem fez o quê
-- ---------------------------------------------------------------------------
create table if not exists public.auditoria (
  id         uuid primary key default gen_random_uuid(),
  lojista_id uuid references public.lojistas(id) on delete cascade,
  user_id    uuid references auth.users(id) on delete set null,
  acao       text not null,
  entidade   text,
  entidade_id uuid,
  detalhe    jsonb,
  criado_em  timestamptz not null default now()
);
create index if not exists auditoria_loja_idx on public.auditoria(lojista_id, criado_em desc);

-- ---------------------------------------------------------------------------
-- Suporte
-- ---------------------------------------------------------------------------
create table if not exists public.chamados (
  id          uuid primary key default gen_random_uuid(),
  lojista_id  uuid not null references public.lojistas(id) on delete cascade,
  cliente_id  uuid references public.clientes(id) on delete set null,
  pedido_id   uuid references public.pedidos(id) on delete set null,
  assunto     text not null,
  mensagem    text,
  estado      text not null default 'aberto',  -- aberto | respondido | resolvido
  prioridade  text not null default 'normal',
  criado_em   timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);
create index if not exists chamados_loja_idx on public.chamados(lojista_id, estado);

-- ---------------------------------------------------------------------------
-- Numeração por loja
-- ---------------------------------------------------------------------------
create or replace function public.proximo_numero_pedido(loja uuid)
returns int language sql volatile security definer set search_path = public as $$
  select coalesce(max(numero), 1000) + 1 from public.pedidos where lojista_id = loja;
$$;

-- ---------------------------------------------------------------------------
-- Isolamento
--
-- Reusa os auxiliares do schema `private` (0004): eles ficam fora do schema
-- exposto pelo PostgREST, senão qualquer um chamaria `is_super_admin` pela API.
--
-- Regra geral: a EQUIPE da loja vê e mexe em tudo dela; o CLIENTE vê só os
-- próprios pedidos, e não escreve.
-- ---------------------------------------------------------------------------
alter table public.produtos          enable row level security;
alter table public.vendedores        enable row level security;
alter table public.pedidos           enable row level security;
alter table public.pedido_itens      enable row level security;
alter table public.producao          enable row level security;
alter table public.expedicao         enable row level security;
alter table public.lojista_gateways  enable row level security;
alter table public.pagamentos        enable row level security;
alter table public.auditoria         enable row level security;
alter table public.chamados          enable row level security;

-- --- por loja: equipe manda, super admin também ---
do $$
declare t text;
begin
  foreach t in array array['produtos','vendedores','pedidos','lojista_gateways','pagamentos','auditoria','chamados']
  loop
    execute format('drop policy if exists %I_equipe on public.%I', t, t);
    execute format($f$
      create policy %I_equipe on public.%I for all
        using (private.is_membro_do_lojista(lojista_id) or private.is_super_admin())
        with check (private.is_membro_do_lojista(lojista_id) or private.is_super_admin())
    $f$, t, t);
  end loop;
end $$;

-- --- o produto ativo é público na loja: o cliente precisa ver o catálogo ---
drop policy if exists produtos_vitrine on public.produtos;
create policy produtos_vitrine on public.produtos for select
  using (ativo and private.is_cliente_do_lojista(lojista_id));

-- --- o cliente vê os próprios pedidos, e só ---
drop policy if exists pedidos_do_cliente on public.pedidos;
create policy pedidos_do_cliente on public.pedidos for select
  using (cliente_id in (select private.meus_clientes()));

drop policy if exists pagamentos_do_cliente on public.pagamentos;
create policy pagamentos_do_cliente on public.pagamentos for select
  using (pedido_id in (select id from public.pedidos where cliente_id in (select private.meus_clientes())));

drop policy if exists chamados_do_cliente on public.chamados;
create policy chamados_do_cliente on public.chamados for all
  using (cliente_id in (select private.meus_clientes()))
  with check (cliente_id in (select private.meus_clientes()));

-- --- tabelas penduradas no pedido: herdam a permissão dele ---
do $$
declare t text;
begin
  foreach t in array array['pedido_itens','producao','expedicao']
  loop
    execute format('drop policy if exists %I_pelo_pedido on public.%I', t, t);
    execute format($f$
      create policy %I_pelo_pedido on public.%I for all
        using (exists (select 1 from public.pedidos p where p.id = pedido_id))
        with check (exists (select 1 from public.pedidos p where p.id = pedido_id))
    $f$, t, t);
  end loop;
end $$;

-- As credenciais de gateway NÃO são legíveis pelo cliente em hipótese alguma:
-- a política acima já limita à equipe, e não há política de leitura para
-- cliente nesta tabela — o que a torna invisível para ele.
