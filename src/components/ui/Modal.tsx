'use client';

import { useEffect, useRef } from 'react';
import { COR, RAIO, SOMBRA } from '@/components/ui/tokens';

/**
 * Caixa modal e gaveta lateral, no mesmo componente.
 *
 * São a mesma coisa com apoio diferente: a modal decide algo curto e some; a
 * gaveta mostra um registro inteiro ao lado da lista, sem perder a lista de
 * vista. Separar em dois componentes duplicaria foco, Esc, fundo e rolagem.
 *
 * `<dialog>` nativo porque ele já traz o foco preso dentro, o Esc e a camada
 * de topo — reimplementar isso à mão é onde a acessibilidade costuma se perder.
 */
export default function Modal({
  aberto,
  aoFechar,
  titulo,
  descricao,
  children,
  rodape,
  lado = false,
  largura = 560,
}: {
  aberto: boolean;
  aoFechar: () => void;
  titulo: string;
  descricao?: string;
  children?: React.ReactNode;
  rodape?: React.ReactNode;
  /** true = gaveta encostada à direita; false = caixa no centro. */
  lado?: boolean;
  largura?: number;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (aberto && !d.open) d.showModal();
    if (!aberto && d.open) d.close();
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      onClose={aoFechar}
      onClick={(e) => {
        // Clique no fundo fecha; clique no conteúdo, não.
        if (e.target === ref.current) aoFechar();
      }}
      aria-label={titulo}
      style={{
        padding: 0,
        border: 0,
        background: 'transparent',
        maxWidth: '100vw',
        maxHeight: '100vh',
        width: '100%',
        height: lado ? '100%' : 'auto',
        margin: lado ? '0 0 0 auto' : 'auto',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: lado ? Math.max(largura, 420) : largura,
          maxWidth: 'calc(100vw - 24px)',
          maxHeight: lado ? '100vh' : 'calc(100vh - 48px)',
          margin: lado ? 0 : '0 auto',
          background: COR.papel,
          borderRadius: lado ? `${RAIO.cartao}px 0 0 ${RAIO.cartao}px` : RAIO.cartao,
          boxShadow: SOMBRA.menu,
          overflow: 'hidden',
        }}
      >
        <header
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 16,
            padding: '20px 24px 16px',
            borderBottom: `1px solid ${COR.linhaClara}`,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: COR.tinta }}>{titulo}</h2>
            {descricao && (
              <p style={{ margin: '4px 0 0', fontSize: 13.5, color: COR.apagado }}>{descricao}</p>
            )}
          </div>
          <button
            type="button"
            onClick={aoFechar}
            aria-label="Fechar"
            style={{
              marginLeft: 'auto',
              width: 34,
              height: 34,
              flex: '0 0 auto',
              borderRadius: RAIO.botao,
              border: `1px solid ${COR.linha}`,
              background: COR.papel,
              color: COR.apagado,
              fontFamily: 'inherit',
              fontSize: 16,
              lineHeight: 1,
              cursor: 'pointer',
            }}
          >
            ×
          </button>
        </header>

        <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>{children}</div>

        {rodape && (
          <footer
            style={{
              display: 'flex',
              gap: 10,
              justifyContent: 'flex-end',
              padding: '16px 24px',
              borderTop: `1px solid ${COR.linhaClara}`,
              background: COR.papelSuave,
            }}
          >
            {rodape}
          </footer>
        )}
      </div>
    </dialog>
  );
}
