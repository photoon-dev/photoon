'use client';

import DashboardDesign, { CSS_PSEUDO } from '@/components/design/DashboardDesign';
import { useDashboardDesign, type PainelDaLoja } from '@/components/app/useDashboardDesign';

/**
 * Conteúdo do dashboard do lojista.
 *
 * Menu e cabeçalho vêm do `ShellLojista`, como em todas as outras telas — antes
 * esta usava a tela inteira do design e trazia a vigésima segunda cópia do menu.
 */
export default function DashboardLojista({
  painel,
}: {
  painel: PainelDaLoja;
}) {
  const v = useDashboardDesign({ painel });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS_PSEUDO }} />
      <DashboardDesign
        v={{
          ...v,
        }}
      />
    </>
  );
}
