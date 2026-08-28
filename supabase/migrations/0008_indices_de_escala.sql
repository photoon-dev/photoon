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
