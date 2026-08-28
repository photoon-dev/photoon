-- 0010 — documento v2: páginas corretas e espaço para os rostos.

-- ---------------------------------------------------------------------------
-- 1. total_paginas contava lâminas.
--
-- A coluna era `jsonb_array_length(paginas)`, mas `paginas` guarda LÂMINAS, e
-- cada lâmina são duas páginas. O número aparecia pela metade no card, no
-- detalhe do projeto e — o que importa — no cálculo do preço, onde as páginas
-- excedentes são cobradas do cliente. Todo álbum estava sendo subfaturado.
-- ---------------------------------------------------------------------------
alter table public.projetos drop column if exists total_paginas;
alter table public.projetos
  add column total_paginas int
  generated always as (coalesce(jsonb_array_length(paginas), 0) * 2) stored;

-- ---------------------------------------------------------------------------
-- 2. Rostos detectados no navegador do lojista, no envio da foto.
--
-- Tabela própria, não um campo em `galeria_fotos`: o agrupamento por pessoa
-- precisa varrer os vetores, e um jsonb aninhado não aceita índice útil.
-- Caixas normalizadas 0–1 sobre a foto ORIGINAL, para não depender de
-- miniatura nem de recorte.
-- ---------------------------------------------------------------------------
create table if not exists public.pessoas (
  id uuid primary key default gen_random_uuid(),
  galeria_id uuid not null references public.galerias(id) on delete cascade,
  nome text,
  rosto_capa_id uuid,
  criado_em timestamptz not null default now()
);

create table if not exists public.rostos (
  id uuid primary key default gen_random_uuid(),
  galeria_foto_id uuid not null references public.galeria_fotos(id) on delete cascade,
  -- {x,y,w,h} em fração da foto original
  caixa jsonb not null,
  -- descritor de 128 dimensões do face-api; o agrupamento é distância euclidiana
  vetor real[] not null,
  pessoa_id uuid references public.pessoas(id) on delete set null,
  conf real not null default 0,
  criado_em timestamptz not null default now(),
  constraint rostos_vetor_dim check (array_length(vetor, 1) = 128)
);

create index if not exists rostos_foto_idx on public.rostos(galeria_foto_id);
create index if not exists rostos_pessoa_idx on public.rostos(pessoa_id);
create index if not exists pessoas_galeria_idx on public.pessoas(galeria_id);

alter table public.pessoas enable row level security;
alter table public.rostos enable row level security;

-- Mesma fronteira da galeria: quem enxerga a galeria enxerga os rostos dela.
-- Nada de política permissiva — os vetores são dado biométrico.
drop policy if exists pessoas_leitura on public.pessoas;
create policy pessoas_leitura on public.pessoas for select
  using (exists (select 1 from public.galerias g where g.id = galeria_id));

drop policy if exists pessoas_escrita on public.pessoas;
create policy pessoas_escrita on public.pessoas for all
  using (exists (select 1 from public.galerias g where g.id = galeria_id))
  with check (exists (select 1 from public.galerias g where g.id = galeria_id));

drop policy if exists rostos_leitura on public.rostos;
create policy rostos_leitura on public.rostos for select
  using (exists (select 1 from public.galeria_fotos f where f.id = galeria_foto_id));

drop policy if exists rostos_escrita on public.rostos;
create policy rostos_escrita on public.rostos for all
  using (exists (select 1 from public.galeria_fotos f where f.id = galeria_foto_id))
  with check (exists (select 1 from public.galeria_fotos f where f.id = galeria_foto_id));
