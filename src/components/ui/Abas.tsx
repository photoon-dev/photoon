'use client';

import { COR } from '@/components/ui/tokens';

/**
 * Abas de uma tela de detalhe.
 *
 * A aba ativa vive na URL, não em estado local: o lojista manda "olha a aba de
 * arquivos deste projeto" por mensagem e o link abre onde deveria. É a mesma
 * decisão dos filtros.
 *
 * `contagem` aparece quando existe e não é zero — "Validação 3" diz que há o
 * que olhar antes de a pessoa clicar; "Validação 0" só ocupa espaço.
 */
export type Aba = { chave: string; rotulo: string; contagem?: number; alerta?: boolean };

export default function Abas({
  abas,
  ativa,
  aoTrocar,
}: {
  abas: Aba[];
  ativa: string;
  aoTrocar: (chave: string) => void;
}) {
  return (
    <div
      role="tablist"
      style={{
        display: 'flex',
        gap: 4,
        overflowX: 'auto',
        borderBottom: `1px solid ${COR.linha}`,
        margin: '0 0 20px',
      }}
    >
      {abas.map((a) => {
        const on = a.chave === ativa;
        return (
          <button
            key={a.chave}
            role="tab"
            aria-selected={on}
            type="button"
            onClick={() => aoTrocar(a.chave)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              padding: '11px 15px',
              border: 0,
              borderBottom: `2px solid ${on ? COR.azul : 'transparent'}`,
              background: 'transparent',
              fontFamily: 'inherit',
              fontSize: 14,
              fontWeight: on ? 700 : 500,
              color: on ? COR.azul : COR.apagado,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {a.rotulo}
            {!!a.contagem && (
              <span
                style={{
                  padding: '1px 7px',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                  background: a.alerta ? '#FFE4E9' : on ? '#EAF0FF' : COR.linha,
                  color: a.alerta ? COR.coral : on ? COR.azul : COR.apagado,
                }}
              >
                {a.contagem}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
