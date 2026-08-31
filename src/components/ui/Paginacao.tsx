'use client';

import { COR, RAIO } from '@/components/ui/tokens';

/**
 * Paginação do rodapé de uma tabela.
 *
 * Diz sempre o intervalo e o total ("26–50 de 312"): só "página 2 de 13" não
 * responde quantos registros existem, que é o que o lojista quer saber.
 */
export default function Paginacao({
  pagina,
  porPagina,
  total,
  aoIr,
}: {
  /** Base zero, como as consultas já usam. */
  pagina: number;
  porPagina: number;
  total: number;
  aoIr: (pagina: number) => void;
}) {
  const ultima = Math.max(0, Math.ceil(total / porPagina) - 1);
  if (total === 0) return null;

  const de = pagina * porPagina + 1;
  const ate = Math.min(total, (pagina + 1) * porPagina);

  const botao = (ativo: boolean): React.CSSProperties => ({
    minWidth: 36,
    height: 36,
    padding: '0 12px',
    borderRadius: RAIO.botao,
    border: `1px solid ${COR.linha}`,
    background: COR.papel,
    fontFamily: 'inherit',
    fontSize: 13.5,
    color: ativo ? COR.texto : COR.fraco,
    cursor: ativo ? 'pointer' : 'default',
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
        padding: '14px 26px',
        borderTop: `1px solid ${COR.linhaClara}`,
      }}
    >
      <span style={{ fontSize: 12.5, color: COR.apagado, fontVariantNumeric: 'tabular-nums' }}>
        {de}–{ate} de {total.toLocaleString('pt-BR')}
      </span>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
        <button
          type="button"
          onClick={() => pagina > 0 && aoIr(pagina - 1)}
          disabled={pagina === 0}
          style={botao(pagina > 0)}
          aria-label="Página anterior"
        >
          ‹
        </button>
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0 10px',
            fontSize: 13,
            color: COR.apagado,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {pagina + 1} / {ultima + 1}
        </span>
        <button
          type="button"
          onClick={() => pagina < ultima && aoIr(pagina + 1)}
          disabled={pagina >= ultima}
          style={botao(pagina < ultima)}
          aria-label="Próxima página"
        >
          ›
        </button>
      </div>
    </div>
  );
}
