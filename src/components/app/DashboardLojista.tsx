'use client';

import DashboardDesign, { CSS_PSEUDO } from '@/components/design/DashboardDesign';
import { useDashboardDesign } from '@/components/app/useDashboardDesign';

/**
 * Dashboard do lojista — app.photoon.com.br
 *
 * Markup transliterado de Dashboard.dc.html. Dos 20 módulos do menu, só o
 * Dashboard existe; os outros destacam o item sem navegar, porque as telas
 * ainda não foram construídas.
 */
export default function DashboardLojista() {
  const v = useDashboardDesign({ ativo: 0, rotas: { 0: '/' } });

  return (
    <div className="om-app">
      <style dangerouslySetInnerHTML={{ __html: CSS_PSEUDO }} />
      <DashboardDesign v={v} />
    </div>
  );
}
