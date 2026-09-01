import Link from 'next/link';
import { Kpi, ICONES, type Tom as TomPadrao } from '@/components/app/padroes';
import type { Tom } from '@/components/ui/tokens';

/**
 * Cartão de número em destaque.
 *
 * Passou a delegar ao `Kpi` de `components/app/padroes`, que é o padrão do
 * painel — as medidas vieram da tela de Pedidos. Antes este componente tinha o
 * próprio desenho (rótulo em maiúsculas de 10,5px, sem ícone, sem gráfico), e o
 * painel tinha dois estilos de cartão convivendo: Pedidos de um jeito, Projetos
 * e Renderização de outro.
 *
 * A interface foi mantida para não mexer nas seis telas que já o usam.
 */

/** `indigo` não existe no padrão; `roxo` é o equivalente. */
const EQUIV: Record<Tom, TomPadrao> = {
  neutro: 'neutro',
  azul: 'azul',
  ciano: 'ciano',
  verde: 'verde',
  ambar: 'ambar',
  coral: 'coral',
  indigo: 'roxo',
};

export default function CartaoKPI({
  rotulo,
  valor,
  nota,
  tom = 'neutro',
  href,
  icone,
  serie,
}: {
  rotulo: string;
  valor: string | number;
  nota?: string;
  tom?: Tom;
  href?: string;
  icone?: React.ReactNode;
  /** Série para o gráfico do cartão; sem ela o gráfico não é desenhado. */
  serie?: number[];
  /** Aceito e ignorado: o padrão tem uma altura só, para a fileira alinhar. */
  compacto?: boolean;
}) {
    // Ícone por tom quando quem chama não escolhe um: cartão sem ícone ao lado
  // de cartão com ícone deixa a fileira torta.
  const PADRAO: Record<TomPadrao, React.ReactNode> = {
    azul: ICONES.grafico,
    verde: ICONES.estrela,
    ambar: ICONES.alerta,
    coral: ICONES.alerta,
    roxo: ICONES.caixa,
    ciano: ICONES.relogio,
    neutro: ICONES.caixa,
  };
  const t = EQUIV[tom];
  const cartao = (
    <Kpi rotulo={rotulo} valor={valor} nota={nota} tom={t} icone={icone ?? PADRAO[t]} serie={serie} />
  );

  // O cartão vira atalho quando há destino: "3 com erro" que não leva às três
  // obriga a procurar de novo.
  return href ? (
    <Link href={href} className="block text-ink no-underline hover:no-underline">
      {cartao}
    </Link>
  ) : (
    cartao
  );
}
