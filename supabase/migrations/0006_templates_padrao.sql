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

select nome, produto, largura_mm || '×' || altura_mm as formato,
       paginas_min || '–' || paginas_max as paginas, preco_base
from public.templates
where lojista_id is null
order by ordem;
