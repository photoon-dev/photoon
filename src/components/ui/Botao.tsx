'use client';

import { COR, RAIO, SOMBRA } from '@/components/ui/tokens';

/**
 * Os quatro botões do Design System: primário, secundário, suave e de risco.
 *
 * O de risco é vermelho de propósito e nunca é o botão padrão de um formulário
 * — quem apaga precisa mirar.
 */
export type Variante = 'primario' | 'secundario' | 'suave' | 'risco';

const ESTILO: Record<Variante, React.CSSProperties> = {
  primario: {
    background: COR.gradiente,
    color: '#FFFFFF',
    border: 0,
    boxShadow: SOMBRA.acao,
  },
  secundario: {
    background: COR.papel,
    color: COR.texto,
    border: `1px solid ${COR.linha}`,
  },
  suave: {
    background: 'transparent',
    color: COR.apagado,
    border: 0,
  },
  risco: {
    background: COR.coral,
    color: '#FFFFFF',
    border: 0,
  },
};

export default function Botao({
  variante = 'secundario',
  children,
  ocupado = false,
  ...resto
}: {
  variante?: Variante;
  children: React.ReactNode;
  /** Operação em andamento: desabilita e troca o rótulo por "Aguarde…". */
  ocupado?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...resto}
      disabled={resto.disabled || ocupado}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        height: 42,
        padding: '0 18px',
        borderRadius: RAIO.campo,
        fontFamily: 'inherit',
        fontSize: 14,
        fontWeight: 600,
        cursor: resto.disabled || ocupado ? 'default' : 'pointer',
        opacity: resto.disabled || ocupado ? 0.6 : 1,
        whiteSpace: 'nowrap',
        ...ESTILO[variante],
        ...resto.style,
      }}
    >
      {ocupado ? 'Aguarde…' : children}
    </button>
  );
}
