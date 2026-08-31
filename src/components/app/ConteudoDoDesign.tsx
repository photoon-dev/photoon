'use client';

import { useDashboardDesign, type PainelDaLoja } from '@/components/app/useDashboardDesign';

/**
 * O conteúdo de uma tela que veio inteira do design.
 *
 * Substitui o antigo `TelaDoDesign`, que renderizava a tela com a moldura
 * junto — cada `.dc.html` trazia sua própria cópia do menu. Agora a moldura é
 * `ShellLojista` e isto aqui é só o miolo.
 *
 * O hook continua sendo chamado porque parte dos bindings do design é do
 * conteúdo, não da moldura: os botões de período, os KPIs e as listas.
 *
 * `dados` é o que a tela específica acrescenta.
 */
export default function ConteudoDoDesign({
  Design,
  cssPseudo,
  painel,
  dados,
}: {
  Design: (p: { v: Record<string, unknown> }) => React.ReactNode;
  cssPseudo?: string;
  painel?: PainelDaLoja;
  dados?: Record<string, unknown>;
}) {
  const v = useDashboardDesign({ painel });

  return (
    <>
      {cssPseudo && <style dangerouslySetInnerHTML={{ __html: cssPseudo }} />}
      <Design v={{ ...v, ...(dados ?? {}) }} />
    </>
  );
}
