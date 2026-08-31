import { COR, RAIO, SOMBRA, TOM, type Tom } from '@/components/ui/tokens';

/**
 * Um número em destaque, com rótulo e nota.
 *
 * `tom` colore só o número — o cartão continua branco. Um painel onde cada
 * cartão tem um fundo diferente vira um arco-íris que não hierarquiza nada.
 *
 * `href` transforma o cartão em atalho: "3 renderizações com erro" que não leva
 * às três renderizações com erro é um número que obriga a procurar de novo.
 */
export default function CartaoKPI({
  rotulo,
  valor,
  nota,
  tom = 'neutro',
  href,
}: {
  rotulo: string;
  valor: string | number;
  nota?: string;
  tom?: Tom;
  href?: string;
}) {
  const Envolucro = (href ? 'a' : 'div') as 'a';
  return (
    <Envolucro
      href={href}
      style={{
        display: 'block',
        padding: '18px 20px',
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
          margin: '0 0 6px',
          fontSize: 11,
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
          fontSize: 29,
          fontWeight: 800,
          letterSpacing: '-0.8px',
          fontVariantNumeric: 'tabular-nums',
          color: tom === 'neutro' ? COR.tinta : TOM[tom].texto,
        }}
      >
        {valor}
      </p>
      {nota && <p style={{ margin: '4px 0 0', fontSize: 12.5, color: COR.apagado }}>{nota}</p>}
    </Envolucro>
  );
}
