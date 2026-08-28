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
/** Respiro padrão entre quadros, em % da página. */
export const G_PADRAO = 2.5;

/**
 * Espaçamento em milímetros convertido para % da página.
 *
 * O concorrente oferece o controle em mm, que é a unidade do produto impresso —
 * o cliente pensa "3 mm entre as fotos", não "2,5% da largura". A conversão
 * precisa da largura física da página, que vem do template.
 */
/**
 * Largura suposta da página quando o projeto não tem template, em mm.
 *
 * Devolver o padrão e ignorar o valor em mm faria o controle nascer morto em
 * todo projeto sem template — que é o caso da maioria hoje. Uma suposição
 * razoável é melhor: 30 cm é a página de um álbum 30x30, o formato mais comum.
 * Quando houver template, a conta usa a medida de verdade.
 */
const LARGURA_SUPOSTA_MM = 300;

export function espacoEmPorcento(mm: number | undefined, larguraMm?: number): number {
  if (mm == null) return G_PADRAO;
  const largura = larguraMm && larguraMm > 0 ? larguraMm : LARGURA_SUPOSTA_MM;
  return Math.min(20, Math.max(0, (mm / largura) * 100));
}

/** Grade regular dentro da margem. */
function grade(cols: number, linhas: number, n = cols * linhas, G = G_PADRAO): Ret[] {
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
function destaqueTopo(n: number, fracao = 0.62, G = G_PADRAO): Ret[] {
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
function destaqueLado(n: number, fracao = 0.56, G = G_PADRAO): Ret[] {
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

type Molde = { id: string; nome: string; n: number; constroi: (g: number) => Ret[] };

const MOLDES: Molde[] = [
  { id: 'cheia', nome: 'Página inteira', n: 1, constroi: () => [{ x: 0, y: 0, w: 100, h: 100 }] },
  { id: 'unica', nome: 'Uma foto', n: 1, constroi: (g) => grade(1, 1, 1, g) },
  { id: 'dupla-h', nome: 'Duas lado a lado', n: 2, constroi: (g) => grade(2, 1, 2, g) },
  { id: 'dupla-v', nome: 'Duas empilhadas', n: 2, constroi: (g) => grade(1, 2, 2, g) },
  { id: 'destaque-3', nome: 'Destaque e duas', n: 3, constroi: (g) => destaqueLado(2, 0.56, g) },
  { id: 'tripla-v', nome: 'Três em coluna', n: 3, constroi: (g) => grade(1, 3, 3, g) },
  { id: 'quadro-4', nome: 'Quatro em grade', n: 4, constroi: (g) => grade(2, 2, 4, g) },
  { id: 'destaque-5', nome: 'Destaque e quatro', n: 5, constroi: (g) => destaqueTopo(4, 0.62, g) },
  { id: 'grade-6', nome: 'Seis em grade', n: 6, constroi: (g) => grade(3, 2, 6, g) },
  { id: 'destaque-7', nome: 'Destaque e seis', n: 7, constroi: (g) => destaqueTopo(6, 0.58, g) },
  { id: 'grade-8', nome: 'Oito em grade', n: 8, constroi: (g) => grade(4, 2, 8, g) },
  { id: 'mosaico-9', nome: 'Mosaico de nove', n: 9, constroi: (g) => grade(3, 3, 9, g) },
];

const materializar = (m: Molde, g: number): Layout => ({
  id: m.id,
  nome: m.nome,
  n: m.n,
  quadros: m.constroi(g),
});

export const LAYOUTS: Layout[] = MOLDES.map((m) => materializar(m, G_PADRAO));

export const LAYOUT_PADRAO = 'dupla-h';

const PORID = new Map(MOLDES.map((m) => [m.id, m]));

// Recalcular a cada chamada seria desperdício: a página redesenha a cada
// movimento do cursor e o respiro muda raramente.
const cache = new Map<string, Layout>();

/**
 * Nunca devolve indefinido: um id desconhecido cai no padrão.
 *
 * `g` é o respiro entre quadros, em % da página. Sem ele vale o padrão — é o
 * que mantém o seletor e a miniatura idênticos à página quando o cliente não
 * mexeu no espaçamento.
 */
export function layout(id: string | undefined | null, g = G_PADRAO): Layout {
  const m = (id ? PORID.get(id) : undefined) ?? PORID.get(LAYOUT_PADRAO)!;
  const chave = `${m.id}@${g.toFixed(3)}`;
  let pronto = cache.get(chave);
  if (!pronto) {
    pronto = materializar(m, g);
    cache.set(chave, pronto);
  }
  return pronto;
}

/** Todos os layouts com um respiro específico — para o seletor não mentir. */
export function layoutsCom(g = G_PADRAO): Layout[] {
  return MOLDES.map((m) => layout(m.id, g));
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
