/**
 * Catálogo único de layouts de página.
 *
 * Fonte de verdade para o seletor, a miniatura do storyboard e a página
 * renderizada. Antes existiam quatro modelos incompatíveis — o seletor descrevia
 * a lâmina inteira (`1fr 1fr 1fr`), a página re-derivava a grade com metade das
 * celas, a miniatura fazia uma terceira conta e o `album.ts` uma quarta. Por
 * isso o botão mostrava três colunas e a página entregava duas empilhadas mais
 * uma inteira.
 *
 * Aqui um layout descreve UMA página, em porcentagem dela. Cada página da
 * lâmina guarda o seu layout, que é como o software de álbum de verdade
 * funciona: a esquerda pode ser uma foto sangrada e a direita um mosaico.
 * Nenhum quadro atravessa a dobra.
 */

export type Ret = { x: number; y: number; w: number; h: number };

export type Layout = {
  id: string;
  nome: string;
  /** Quantidade de quadros — alimenta o filtro por número de fotos. */
  n: number;
  quadros: Ret[];
};

/** Margem da página, em % — a área branca que emoldura as fotos. */
const MX = 8;
const MY = 7;
/** Respiro entre quadros, em %. */
const G = 2.5;

/** Grade regular dentro da margem. */
function grade(cols: number, linhas: number, n = cols * linhas): Ret[] {
  const w = (100 - 2 * MX - (cols - 1) * G) / cols;
  const h = (100 - 2 * MY - (linhas - 1) * G) / linhas;
  return Array.from({ length: n }, (_, i) => ({
    x: +(MX + (i % cols) * (w + G)).toFixed(2),
    y: +(MY + Math.floor(i / cols) * (h + G)).toFixed(2),
    w: +w.toFixed(2),
    h: +h.toFixed(2),
  }));
}

/** Um quadro grande ocupando `fracao` da altura, com `n` menores embaixo. */
function destaqueTopo(n: number, fracao = 0.62): Ret[] {
  const alturaUtil = 100 - 2 * MY;
  const hGrande = +(alturaUtil * fracao).toFixed(2);
  const hPeq = +(alturaUtil - hGrande - G).toFixed(2);
  const w = (100 - 2 * MX - (n - 1) * G) / n;
  return [
    { x: MX, y: MY, w: 100 - 2 * MX, h: hGrande },
    ...Array.from({ length: n }, (_, i) => ({
      x: +(MX + i * (w + G)).toFixed(2),
      y: +(MY + hGrande + G).toFixed(2),
      w: +w.toFixed(2),
      h: hPeq,
    })),
  ];
}

/** Um quadro alto à esquerda e `n` empilhados à direita. */
function destaqueLado(n: number, fracao = 0.56): Ret[] {
  const larguraUtil = 100 - 2 * MX;
  const alturaUtil = 100 - 2 * MY;
  const wGrande = +(larguraUtil * fracao).toFixed(2);
  const wPeq = +(larguraUtil - wGrande - G).toFixed(2);
  const h = (alturaUtil - (n - 1) * G) / n;
  return [
    { x: MX, y: MY, w: wGrande, h: alturaUtil },
    ...Array.from({ length: n }, (_, i) => ({
      x: +(MX + wGrande + G).toFixed(2),
      y: +(MY + i * (h + G)).toFixed(2),
      w: wPeq,
      h: +h.toFixed(2),
    })),
  ];
}

export const LAYOUTS: Layout[] = [
  { id: 'cheia', nome: 'Página inteira', n: 1, quadros: [{ x: 0, y: 0, w: 100, h: 100 }] },
  { id: 'unica', nome: 'Uma foto', n: 1, quadros: grade(1, 1) },
  { id: 'dupla-h', nome: 'Duas lado a lado', n: 2, quadros: grade(2, 1) },
  { id: 'dupla-v', nome: 'Duas empilhadas', n: 2, quadros: grade(1, 2) },
  { id: 'destaque-3', nome: 'Destaque e duas', n: 3, quadros: destaqueLado(2) },
  { id: 'tripla-v', nome: 'Três em coluna', n: 3, quadros: grade(1, 3) },
  { id: 'quadro-4', nome: 'Quatro em grade', n: 4, quadros: grade(2, 2) },
  { id: 'destaque-5', nome: 'Destaque e quatro', n: 5, quadros: destaqueTopo(4) },
  { id: 'grade-6', nome: 'Seis em grade', n: 6, quadros: grade(3, 2) },
  { id: 'destaque-7', nome: 'Destaque e seis', n: 7, quadros: destaqueTopo(6, 0.58) },
  { id: 'grade-8', nome: 'Oito em grade', n: 8, quadros: grade(4, 2) },
  { id: 'mosaico-9', nome: 'Mosaico de nove', n: 9, quadros: grade(3, 3) },
];

export const LAYOUT_PADRAO = 'dupla-h';

const PORID = new Map(LAYOUTS.map((l) => [l.id, l]));

/** Nunca devolve indefinido: um id desconhecido cai no padrão. */
export function layout(id: string | undefined | null): Layout {
  return (id ? PORID.get(id) : undefined) ?? PORID.get(LAYOUT_PADRAO)!;
}

/** Quantidades de foto oferecidas no filtro do seletor. */
export function contagens(): number[] {
  return [...new Set(LAYOUTS.map((l) => l.n))].sort((a, b) => a - b);
}

/** Estilo de um quadro — o MESMO cálculo na miniatura e na página. */
export function estiloQuadro(r: Ret): React.CSSProperties {
  return {
    position: 'absolute',
    left: `${r.x}%`,
    top: `${r.y}%`,
    width: `${r.w}%`,
    height: `${r.h}%`,
  };
}
