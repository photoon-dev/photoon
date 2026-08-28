'use client';

import DashboardDesign, { CSS_PSEUDO } from '@/components/design/DashboardDesign';
import { useDashboardDesign } from '@/components/app/useDashboardDesign';
import { ROTAS_LOJISTA } from '@/lib/rotas-lojista';
import MenuLojista from '@/components/app/MenuLojista';
import type { IdentidadeLojista } from '@/lib/lojista';

/**
 * Dashboard do lojista — app.photoon.com.br
 *
 * Usa a tela inteira do design (menu + cabeçalho + conteúdo), porque os cards
 * de KPI fazem parte dela. As outras telas montam sobre ShellLojista.
 */
export default function DashboardLojista({ identidade }: { identidade: IdentidadeLojista }) {
  const v = useDashboardDesign({ ativo: 0, rotas: ROTAS_LOJISTA });

  return (
    <div className="om-app">
      <style dangerouslySetInnerHTML={{ __html: CSS_PSEUDO }} />
      <DashboardDesign
        v={{
          ...v,
          usuarioNome: identidade.nome,
          usuarioEmail: identidade.email,
          lojaSub: identidade.lojaSub,
          planoResumo: identidade.planoResumo,
          hrefSair: '/auth/sair',
          // Um link nao encerra sessao: o /auth/sair espera POST.
          sair: (e: React.MouseEvent) => {
            e.preventDefault();
            const f = document.createElement('form');
            f.method = 'post';
            f.action = '/auth/sair';
            document.body.appendChild(f);
            f.submit();
          },
        }}
      />
      <MenuLojista />
    </div>
  );
}
