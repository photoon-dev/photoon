/**
 * Os valores do Design System do Photoon, em um lugar só.
 *
 * Saem de `design/extraido/Design System.dc.html` — a mesma paleta que as telas
 * transliteradas usam inline. Aqui eles existem para o código escrito à mão:
 * sem isto, cada componente novo repete `#E6EAF2` de memória e uma hora erra.
 *
 * Cor com função (seção 05 do Design System):
 *   azul = ação · ciano = dado · verde = feito · âmbar = atenção · coral = risco
 */
export const COR = {
  // superfícies e traços
  fundo: '#F4F7FC',
  papel: '#FFFFFF',
  papelSuave: '#F8FAFE',
  linha: '#E6EAF2',
  linhaClara: '#F1F4FA',

  // texto
  tinta: '#0B1220',
  tinta2: '#34405A',
  texto: '#46536A',
  apagado: '#6B7A90',
  fraco: '#9AA7BC',

  // marca
  azul: '#2563EB',
  azulEscuro: '#1D4FD7',
  ciano: '#06B6D4',
  gradiente: 'linear-gradient(135deg,#2563EB,#06B6D4)',

  // Semânticas, na versão TEXTO — a escura, para ler sobre a superfície
  // tingida correspondente em `SUPERFICIE`.
  //
  // O Design System tem duas famílias para a mesma função, e as duas estão
  // certas. Aqui ficam as de texto (#059669 sobre #E6F8F1, #B45309 sobre
  // #FEF3E2, #E11D48 sobre #FFF1F3); as de PREENCHIMENTO — barra, ponto,
  // traço de gráfico — são mais claras e vivem em `tailwind.config.ts`
  // (`green: #10B981`, `amber: #F59E0B`, `coral: #F43F5E`).
  //
  // Ou seja: `COR.verde` e o `green` do Tailwind são cores diferentes de
  // propósito. Não iguale os dois — usar o claro como texto perde contraste, e
  // usar o escuro como preenchimento apaga o gráfico.
  verde: '#059669',
  ambar: '#B45309',
  coral: '#E11D48',
  indigo: '#4F46E5',

  // Versões de preenchimento, para quando o código do kit precisa delas sem
  // passar pelo Tailwind (barra de progresso, ponto de estado, série de SVG).
  verdeVivo: '#10B981',
  ambarVivo: '#F59E0B',
  coralVivo: '#F43F5E',
} as const;

/** Superfícies das cores semânticas — o fundo do selo, não o texto. */
export const SUPERFICIE = {
  azul: '#EAF0FF',
  ciano: '#E4F8FC',
  verde: '#E6F8F1',
  ambar: '#FEF3E2',
  coral: '#FFF1F3',
  indigo: '#EDEBFE',
  neutro: '#EEF1F7',
} as const;

export const RAIO = { selo: 999, campo: 14, cartao: 20, botao: 12 } as const;

export const SOMBRA = {
  cartao: '0 2px 8px rgba(11,18,32,.03)',
  alto: '0 14px 30px rgba(11,18,32,.09)',
  menu: '0 24px 50px rgba(11,18,32,.16)',
  acao: '0 8px 20px rgba(37,99,235,.28)',
} as const;

/** As seis tonalidades que um selo pode ter. */
export type Tom = 'neutro' | 'azul' | 'ciano' | 'verde' | 'ambar' | 'coral' | 'indigo';

export const TOM: Record<Tom, { fundo: string; texto: string }> = {
  neutro: { fundo: SUPERFICIE.neutro, texto: COR.apagado },
  azul: { fundo: SUPERFICIE.azul, texto: COR.azul },
  ciano: { fundo: SUPERFICIE.ciano, texto: '#0891B2' },
  verde: { fundo: SUPERFICIE.verde, texto: COR.verde },
  ambar: { fundo: SUPERFICIE.ambar, texto: COR.ambar },
  coral: { fundo: SUPERFICIE.coral, texto: COR.coral },
  indigo: { fundo: SUPERFICIE.indigo, texto: COR.indigo },
};
