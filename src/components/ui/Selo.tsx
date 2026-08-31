import { RAIO, TOM, type Tom } from '@/components/ui/tokens';

/**
 * Selo de estado. Um estado, um tom — e o mesmo tom em todas as telas.
 *
 * Antes cada tela montava a sua string de estilo à mão, e o mesmo "Em produção"
 * saía azul numa e ciano na outra.
 */
export default function Selo({
  children,
  tom = 'neutro',
  titulo,
}: {
  children: React.ReactNode;
  tom?: Tom;
  /** Texto do `title`, quando o rótulo é curto demais para explicar. */
  titulo?: string;
}) {
  const { fundo, texto } = TOM[tom];
  return (
    <span
      title={titulo}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '6px 11px',
        borderRadius: RAIO.selo,
        background: fundo,
        color: texto,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        width: 'max-content',
      }}
    >
      {children}
    </span>
  );
}
