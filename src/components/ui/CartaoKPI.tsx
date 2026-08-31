import { COR, RAIO, SOMBRA, TOM, type Tom } from '@/components/ui/tokens';

/**
 * Um número em destaque, com rótulo e nota.
 *
 * `tom` colore só o número — o cartão continua branco. Um painel onde cada
 * cartão tem um fundo diferente vira um arco-íris que não hierarquiza nada.
 *
 * `href` transforma o cartão em atalho: "3 renderizações com erro" que não leva
 * às três renderizações com erro é um número que obriga a procurar de novo.
 *
 * `compacto` reduz padding e fontSize do valor para alinhar densidade com
 * a lista que vem logo abaixo (KPI com altura ~88px em vez de ~96px).
 */
export default function CartaoKPI({
  rotulo,
  valor,
  nota,
  tom = 'neutro',
  href,
  compacto = false,
}: {
  rotulo: string;
  valor: string | number;
  nota?: string;
  tom?: Tom;
  href?: string;
  /** Versão densa: padding 14x16, valor 24px. Use quando há ≥4 KPIs na linha. */
  compacto?: boolean;
}) {
  const Envolucro = (href ? 'a' : 'div') as 'a';
  return (
    <Envolucro
      href={href}
      style={{
        display: 'block',
        padding: compacto ? '14px 16px' : '18px 20px',
        borderRadius: RAIO.cartao,
        background: COR.papel,
        border: `1px solid ${COR.linha}`,
        boxShadow: SOMBRA.cartao,
        color: 'inherit',
        textDecoration: 'none',
      }}
    >
      <p
        style={{
          margin: '0 0 4px',
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: '1.2px',
          textTransform: 'uppercase',
          color: COR.fraco,
        }}
      >
        {rotulo}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: compacto ? 24 : 29,
          fontWeight: 800,
          letterSpacing: '-0.6px',
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1.1,
          color: tom === 'neutro' ? COR.tinta : TOM[tom].texto,
        }}
      >
        {valor}
      </p>
      {nota && (
        <p style={{ margin: '4px 0 0', fontSize: 12, color: COR.apagado, lineHeight: 1.3 }}>
          {nota}
        </p>
      )}
    </Envolucro>
  );
}
