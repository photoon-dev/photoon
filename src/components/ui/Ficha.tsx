import { COR } from '@/components/ui/tokens';

/**
 * Lista de campo e valor, para as fichas de resumo.
 *
 * Campo vazio diz "—" em cinza em vez de sumir: um rótulo ausente faz a pessoa
 * pensar que aquele dado não existe no sistema, e não que ele está em branco
 * neste registro.
 */
export function Campo({ rotulo, children }: { rotulo: string; children?: React.ReactNode }) {
  const vazio = children === null || children === undefined || children === '';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 3, minWidth: 0 }}>
      <span style={{ fontSize: 11.5, color: COR.fraco }}>{rotulo}</span>
      <span
        style={{
          fontSize: 14,
          fontWeight: vazio ? 400 : 600,
          color: vazio ? COR.fraco : COR.tinta,
          overflowWrap: 'anywhere',
        }}
      >
        {vazio ? '—' : children}
      </span>
    </div>
  );
}

export default function Ficha({
  titulo,
  children,
  colunas = 3,
}: {
  titulo?: string;
  children: React.ReactNode;
  colunas?: number;
}) {
  return (
    <section
      style={{
        background: COR.papel,
        border: `1px solid ${COR.linha}`,
        borderRadius: 20,
        padding: '20px 22px',
        boxShadow: '0 2px 8px rgba(11,18,32,.03)',
      }}
    >
      {titulo && (
        <h2 style={{ margin: '0 0 16px', fontSize: 15, fontWeight: 700, color: COR.tinta }}>
          {titulo}
        </h2>
      )}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(auto-fit, minmax(${Math.max(150, Math.floor(680 / colunas))}px, 1fr))`,
          gap: '16px 22px',
        }}
      >
        {children}
      </div>
    </section>
  );
}
