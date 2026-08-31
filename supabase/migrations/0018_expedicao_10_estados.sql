-- ===========================================================================
-- 0018 — Expedição: 10 estados do briefing, com compatibilidade para os antigos
--
-- O CHECK de `expedicao.estado` na 0015 já previa os 11 valores:
--   - 5 antigos (aguardando, postado, em_transito, entregue, devolvido)
--   - 6 novos da 0015 (aguardando_embalagem, pronto_para_envio, etiqueta_gerada,
--                         aguardando_coleta, problema_na_entrega, retornado)
--
-- A Fase 10 do briefing lista 10 estados. O legado `aguardando` (sem
-- sufixo) vira o mesmo estado que `aguardando_embalagem` na UI — são a
-- mesma coisa, só que `aguardando` é o valor que existia antes da 0015.
--
-- A 0018 não apaga nem renomeia nenhum valor. Aditiva e idempotente.
-- ===========================================================================

alter table public.expedicao drop constraint if exists expedicao_estado_valido;
alter table public.expedicao add constraint expedicao_estado_valido check (estado in (
  -- legados (0012 e anteriores): preservados, sem renomear
  'aguardando',
  'postado',
  'em_transito',
  'entregue',
  'devolvido',
  -- do briefing (alguns já estavam desde a 0015, re-listados para clareza)
  'aguardando_embalagem',
  'pronto_para_envio',
  'etiqueta_gerada',
  'aguardando_coleta',
  'problema_na_entrega',
  'retornado'
));

comment on constraint expedicao_estado_valido on public.expedicao is
  '11 valores: 5 legados (aguardando, postado, em_transito, entregue, '
  'devolvido) e 6 do briefing da Fase 10 (aguardando_embalagem, '
  'pronto_para_envio, etiqueta_gerada, aguardando_coleta, problema_na_entrega, '
  'retornado). A UI mapeia `aguardando` legado para a coluna "Aguardando '
  'embalagem" — ver ESTADOS_EXPEDICAO em src/lib/pedidos-termos.ts.';

-- Função pura: recebe o valor de `estado` e devolve a coluna da UI.
-- Mapeia `aguardando` legado para `aguardando_embalagem` e mantém os outros
-- como estão.
create or replace function public.coluna_da_expedicao(estado text)
returns text language sql immutable as $$
  select case estado
    when 'aguardando'             then 'aguardando_embalagem'  -- legado
    when 'aguardando_embalagem'   then 'aguardando_embalagem'
    when 'pronto_para_envio'      then 'pronto_para_envio'
    when 'etiqueta_gerada'        then 'etiqueta_gerada'
    when 'aguardando_coleta'      then 'aguardando_coleta'
    when 'postado'                then 'postado'
    when 'em_transito'            then 'em_transito'
    when 'entregue'               then 'entregue'
    when 'problema_na_entrega'    then 'problema_na_entrega'
    when 'retornado'              then 'retornado'
    when 'devolvido'              then 'devolvido'
    else 'aguardando_embalagem'                                -- fallback
  end;
$$;

revoke execute on function public.coluna_da_expedicao(text) from public;
grant  execute on function public.coluna_da_expedicao(text) to service_role;

-- Os 11 campos que `expedicao` precisa (incluindo modalidade, volumes,
-- peso_kg, dimensões, coleta_em, previsao_em, sla_dias, responsavel,
-- etiqueta_url) já existem desde a 0015. Esta migration não cria colunas
-- novas: a Fase 10 apenas amplia a UI para usar tudo o que já estava lá.
