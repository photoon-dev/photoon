import { molduraDaLoja } from '@/lib/painel-loja';
import { identidadeLojista } from '@/lib/lojista';
import ShellLojistaCliente from '@/components/app/ShellLojistaCliente';

/**
 * A moldura do painel do lojista. Uma só, para as vinte e tantas telas.
 *
 * Antes cada `.dc.html` trazia sua própria cópia da sidebar e da topbar —
 * vinte e duas cópias do mesmo menu, com "Marta Reis" e "1,44 TB" escritos à
 * mão. Agora a moldura vem de um arquivo (`Dashboard.dc.html`, via
 * `ShellLojistaDesign`) e cada tela é só o conteúdo que entra no slot.
 *
 * É componente de servidor porque busca quem está logado e os números da loja:
 * o selo do menu e o cartão de consumo são iguais em todas as telas, então não
 * faz sentido cada página buscá-los de novo.
 */
export default async function ShellLojista({
  ativo,
  children,
  cartaoPlano,
}: {
  /** Índice do módulo no menu. Use `MODULO['Pedidos']`, não o número solto. */
  ativo: number;
  children: React.ReactNode;
  /** Cartão de consumo, no rodapé do menu lateral. */
  cartaoPlano?: React.ReactNode;
}) {
  const [identidade, moldura] = await Promise.all([identidadeLojista(), molduraDaLoja()]);

  return (
    <ShellLojistaCliente
      ativo={ativo}
      cartaoPlano={cartaoPlano}
      identidade={identidade}
      painel={moldura?.painel}
    >
      {children}
    </ShellLojistaCliente>
  );
}
