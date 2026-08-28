'use client';

import DashboardDesign, { CSS_PSEUDO } from '@/components/design/DashboardDesign';
import { useDashboardDesign } from '@/components/app/useDashboardDesign';
import { ROTAS_LOJISTA } from '@/components/app/ShellLojista';
import MenuLojista from '@/components/app/MenuLojista';

/**
 * Dashboard do lojista — app.photoon.com.br
 *
 * Usa a tela inteira do design (menu + cabeçalho + conteúdo), porque os cards
 * de KPI fazem parte dela. As outras telas montam sobre ShellLojista.
 */
export default function DashboardLojista() {
  const v = useDashboardDesign({ ativo: 0, rotas: ROTAS_LOJISTA });

  return (
    <div className="om-app">
      <style dangerouslySetInnerHTML={{ __html: CSS_PSEUDO }} />
      <DashboardDesign v={v} />
      <MenuLojista />
    </div>
  );
}
