'use client';

import ShellLojistaDesign, { CSS_PSEUDO } from '@/components/design/ShellLojistaDesign';
import { useDashboardDesign } from '@/components/app/useDashboardDesign';

/**
 * Moldura do painel do lojista: menu lateral, cabeçalho e busca, tudo vindo
 * de Dashboard.dc.html. O conteúdo de cada tela entra no slot.
 *
 * `ativo` é o índice do módulo no menu; `rotas` diz quais já têm tela.
 */
export const ROTAS_LOJISTA: Record<number, string> = {
  0: '/',
  8: '/clientes',
  19: '/configuracoes',
  7: '/templates',
};

export default function ShellLojista({
  ativo,
  children,
}: {
  ativo: number;
  children: React.ReactNode;
}) {
  const v = useDashboardDesign({ ativo, rotas: ROTAS_LOJISTA });

  return (
    <div className="om-app">
      <style dangerouslySetInnerHTML={{ __html: CSS_PSEUDO }} />
      <ShellLojistaDesign v={{ ...v, conteudo: children }} />
    </div>
  );
}
