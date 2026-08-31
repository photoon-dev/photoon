-- ===========================================================================
-- 0017 — Produção: 8 estágios do briefing, com compatibilidade para os antigos
--
-- O CHECK de `producao.etapa` na 0015 já previa os 10 valores possíveis:
--   - 5 antigos (fila, impressao, acabamento, revisao, pronto)
--   - 5 novos da 0015 (aguardando, preflight, arquivos_prontos, qualidade, embalagem)
--
-- A Fase 9 do Kanban usa 8 desses, mapeando os legados:
--   Aguardando        ← fila (legado) | aguardando
--   Pré-flight        ← preflight
--   Arquivos prontos  ← arquivos_prontos
--   Impressão         ← impressao
--   Acabamento        ← acabamento
--   Qualidade         ← revisao (legado) | qualidade
--   Embalagem         ← embalagem
--   Pronto            ← pronto
--
-- A 0017 não apaga nem renomeia nenhum valor: o dado antigo continua válido
-- e legível, só passa a ser exibido na coluna certa do Kanban. Aditiva e
-- idempotente — roda quantas vezes quiser, o resultado é o mesmo.
-- ===========================================================================

-- Re-assert do CHECK com a lista consolidada (mesma lista da 0015, com
-- comentário de mapeamento para os legados).
alter table public.producao drop constraint if exists producao_etapa_valida;
alter table public.producao add constraint producao_etapa_valida check (etapa in (
  -- legados (0012 e versões anteriores): preservados, sem renomear
  'fila',
  'impressao',
  'acabamento',
  'revisao',
  'pronto',
  -- do briefing (alguns já estavam desde a 0015, re-listados para clareza)
  'aguardando',
  'preflight',
  'arquivos_prontos',
  'qualidade',
  'embalagem'
));

comment on constraint producao_etapa_valida on public.producao is
  '10 valores: 5 legados (fila, impressao, acabamento, revisao, pronto) e 5 do '
  'briefing da Fase 9 (aguardando, preflight, arquivos_prontos, qualidade, '
  'embalagem). O Kanban mapeia legados para colunas adjacentes — ver '
  'ETAPAS_PRODUCAO em src/lib/pedidos-termos.ts.';

-- Função pura: recebe o valor de `etapa` e devolve a coluna do Kanban.
-- Centraliza a regra de mapeamento legado → briefing. Usada pela tela
-- (KanbanDoPedido) e por qualquer SELECT que precise agrupar por coluna.
create or replace function public.coluna_do_kanban(etapa text)
returns text language sql immutable as $$
  select case etapa
    when 'fila'         then 'aguardando'    -- legado
    when 'revisao'      then 'qualidade'     -- legado
    when 'aguardando'   then 'aguardando'
    when 'preflight'    then 'preflight'
    when 'arquivos_prontos' then 'arquivos_prontos'
    when 'impressao'    then 'impressao'
    when 'acabamento'   then 'acabamento'
    when 'qualidade'    then 'qualidade'
    when 'embalagem'    then 'embalagem'
    when 'pronto'       then 'pronto'
    else 'aguardando'                          -- fallback conservador
  end;
$$;

-- A função é determinística e não toca dados: `grant execute` só para o
-- service_role. O PostgREST não precisa dela — a tela agrupa em JS para
-- manter o agrupamento fora do banco. Se quiser usar via RPC, o service_role
-- já é o suficiente.
revoke execute on function public.coluna_do_kanban(text) from public;
grant  execute on function public.coluna_do_kanban(text) to service_role;

-- Não apaga nada. Não migra dados. Não cria colunas novas: as 13 que a
-- `producao` precisa (incluindo `entrou_na_etapa_em` e `prioridade`) já
-- existem desde a 0015.
