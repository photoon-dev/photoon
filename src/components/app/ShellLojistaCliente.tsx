'use client';

import ShellLojistaDesign, { CSS_PSEUDO } from '@/components/design/ShellLojistaDesign';
import { useDashboardDesign, type PainelDaLoja } from '@/components/app/useDashboardDesign';
import MenuLojista from '@/components/app/MenuLojista';
import { ROTAS_LOJISTA } from '@/lib/rotas-lojista';

export type Identidade = {
  nome: string;
  email: string;
  lojaSub: string;
  planoResumo: string;
};

/**
 * Menu lateral, topbar e busca — tudo vindo de `Dashboard.dc.html`. O conteúdo
 * de cada tela entra no slot.
 *
 * `ativo` é o índice do módulo no menu; `ROTAS_LOJISTA` diz quais já têm tela.
 */
export default function ShellLojistaCliente({
  ativo,
  children,
  cartaoPlano,
  identidade,
  painel,
}: {
  ativo: number;
  children: React.ReactNode;
  cartaoPlano?: React.ReactNode;
  identidade: Identidade;
  /** Números da loja, para o selo do menu e o cartão de consumo. */
  painel?: PainelDaLoja;
}) {
  const v = useDashboardDesign({ ativo, rotas: ROTAS_LOJISTA, painel });

  return (
    <div className="om-app">
      <style dangerouslySetInnerHTML={{ __html: CSS_PSEUDO }} />
      <ShellLojistaDesign
        v={{
          ...v,
          conteudo: children,
          cartaoPlano,
          // O design trazia "Marta Reis", "marta@labcores.com.br" e
          // "Plano Pro · 8 usuários" fixos: todo lojista via o nome de outra
          // pessoa. E o "Sair" apontava para ./Login.dc.html — nao saia.
          usuarioNome: identidade.nome,
          usuarioEmail: identidade.email,
          lojaSub: identidade.lojaSub,
          planoResumo: identidade.planoResumo,
          hrefSair: '/auth/sair',
          // Substitui o módulo Suporte, que saiu do menu.
          abrirAjuda: () => { window.location.href = '/ajuda'; },
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
