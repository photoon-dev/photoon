'use client';

import { useDashboardDesign, type PainelDaLoja } from '@/components/app/useDashboardDesign';
import { ROTAS_LOJISTA } from '@/lib/rotas-lojista';
import MenuLojista from '@/components/app/MenuLojista';

/**
 * Moldura para as telas que vêm inteiras do design.
 *
 * Cada `.dc.html` exportado traz sua própria cópia do menu e do cabeçalho, com
 * "Lab Cores", "Marta Reis" e "1,44 TB de 2 TB" escritos à mão. Esta moldura
 * injeta os valores reais nos mesmos bindings, em qualquer uma delas.
 *
 * `dados` é o que a tela específica acrescenta — o conteúdo dela.
 */
export default function TelaDoDesign({
  Design,
  cssPseudo,
  ativo,
  painel,
  dados,
}: {
  Design: (p: { v: Record<string, unknown> }) => React.ReactNode;
  cssPseudo?: string;
  /** Índice do módulo no menu, para marcar o item ativo. */
  ativo: number;
  painel: PainelDaLoja;
  dados?: Record<string, unknown>;
}) {
  const v = useDashboardDesign({ ativo, rotas: ROTAS_LOJISTA, painel });

  return (
    <div className="om-app">
      {cssPseudo && <style dangerouslySetInnerHTML={{ __html: cssPseudo }} />}
      <Design v={{ ...v, ...(dados ?? {}) }} />
      <MenuLojista />
    </div>
  );
}
