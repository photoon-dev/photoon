/**
 * Catálogo de elementos gráficos do editor.
 *
 * O design trazia doze formas soltas, sem categoria e sem identidade — davam
 * para desenhar o painel, não para montar um álbum. Aqui elas viram um catálogo
 * de verdade: cada forma tem `id` estável (é o que vai gravado no documento,
 * então NÃO pode ser o índice do array), categoria e traço próprio.
 *
 * Todas as formas são desenhadas num `viewBox` de 48×48, só com traço
 * (`fill:none; stroke:currentColor`), para herdarem a cor do quadro e
 * crescerem sem perder qualidade na impressão.
 */

export type CategoriaElemento =
  | 'molduras'
  | 'florais'
  | 'fitas'
  | 'selos'
  | 'formas'
  | 'linhas';

export type Elemento = {
  /** Estável e gravado no documento. Nunca reaproveitar um id para outra forma. */
  id: string;
  nome: string;
  cat: CategoriaElemento;
  /** Um ou mais `d` de <path>, desenhados em 48×48. */
  d: string[];
  /** Espessura do traço. */
  sw: number;
  /** Proporção natural, para nascer com a caixa certa na lâmina. */
  proporcao?: number;
};

/**
 * Categorias mostradas no painel.
 *
 * As antigas "Molduras", "Florais", "Fitas" e "Selos" eram rabiscos de traço
 * que não se sustentavam ao lado da biblioteca colorida — saíram da vista.
 * Continuam no catálogo abaixo, e não por descuido: `zod` exige que o `forma`
 * de todo elemento exista, e apagá-las invalidaria álbuns já gravados que as
 * usam. Ficam "Formas" e "Linhas", que são primitivas de desenho e servem
 * para emoldurar e dividir.
 */
export const CATEGORIAS: { id: CategoriaElemento | 'todos'; rotulo: string }[] = [
  { id: 'formas', rotulo: 'Formas' },
  { id: 'linhas', rotulo: 'Linhas' },
];

export const ELEMENTOS: Elemento[] = [
  /* ------------------------------- formas ------------------------------- */
  { id: 'f-circulo', nome: 'Círculo', cat: 'formas', sw: 2, d: ['M24 8a16 16 0 1 0 .01 0'] },
  { id: 'f-quadrado', nome: 'Quadrado', cat: 'formas', sw: 2, d: ['M10 10h28v28H10z'] },
  { id: 'f-losango', nome: 'Losango', cat: 'formas', sw: 2, d: ['M24 8 40 24 24 40 8 24z'] },
  { id: 'f-triangulo', nome: 'Triângulo', cat: 'formas', sw: 2, d: ['M24 9 41 38H7z'] },
  { id: 'f-hexagono', nome: 'Hexágono', cat: 'formas', sw: 2, d: ['M24 7 39 15.5v17L24 41 9 32.5v-17z'] },
  { id: 'f-pentagono', nome: 'Pentágono', cat: 'formas', sw: 2, d: ['M24 7 41 19.5 34.5 40h-21L7 19.5z'] },
  { id: 'f-estrela', nome: 'Estrela', cat: 'formas', sw: 2, d: ['M24 6l5.5 12.5L43 20l-10 8.5L36 42l-12-7-12 7 3-13.5L5 20l13.5-1.5z'] },
  { id: 'f-coracao', nome: 'Coração', cat: 'formas', sw: 2.4, d: ['M24 40C24 40 8 30 8 20a8 8 0 0 1 16-4 8 8 0 0 1 16 4c0 10-16 20-16 20z'] },
  { id: 'f-gota', nome: 'Gota', cat: 'formas', sw: 2, d: ['M24 7c7 9 12 14 12 20a12 12 0 0 1-24 0c0-6 5-11 12-20z'] },
  { id: 'f-raio', nome: 'Raio', cat: 'formas', sw: 2, d: ['M27 6 13 27h9l-3 15 16-22h-9z'] },
  { id: 'f-lua', nome: 'Lua', cat: 'formas', sw: 2, d: ['M31 8a16 16 0 1 0 9 16 13 13 0 0 1-9-16z'] },
  { id: 'f-sol', nome: 'Sol', cat: 'formas', sw: 2, d: ['M24 15a9 9 0 1 0 .01 0', 'M24 4v5M24 39v5M4 24h5M39 24h5M10 10l3.5 3.5M34.5 34.5 38 38M38 10l-3.5 3.5M13.5 34.5 10 38'] },
  { id: 'f-nuvem', nome: 'Nuvem', cat: 'formas', sw: 2, d: ['M15 34a7 7 0 0 1 .8-14A11 11 0 0 1 37 22a6 6 0 0 1-1 12z'] },
  { id: 'f-balao', nome: 'Balão', cat: 'formas', sw: 2, d: ['M10 12h28v20H26l-7 7v-7h-9z'] },

  /* ------------------------------- linhas ------------------------------- */
  { id: 'l-reta', nome: 'Linha', cat: 'linhas', sw: 2, proporcao: 6, d: ['M6 24h36'] },
  { id: 'l-dupla', nome: 'Linha dupla', cat: 'linhas', sw: 2, proporcao: 6, d: ['M6 20h36M6 28h36'] },
  { id: 'l-onda', nome: 'Onda', cat: 'linhas', sw: 2, proporcao: 5, d: ['M6 28c6-14 12-14 18 0s12 14 18 0'] },
  { id: 'l-zigue', nome: 'Zigue-zague', cat: 'linhas', sw: 2, proporcao: 5, d: ['M6 30l6-12 6 12 6-12 6 12 6-12 6 12'] },
  { id: 'l-pontos', nome: 'Pontilhado', cat: 'linhas', sw: 3, proporcao: 6, d: ['M8 24h1M16 24h1M24 24h1M32 24h1M40 24h1'] },
  { id: 'l-arco', nome: 'Arco', cat: 'linhas', sw: 2, proporcao: 3, d: ['M6 32a18 18 0 0 1 36 0'] },
  { id: 'l-canto', nome: 'Canto', cat: 'linhas', sw: 2, d: ['M8 40V14a6 6 0 0 1 6-6h26'] },
  { id: 'l-divisor', nome: 'Divisor', cat: 'linhas', sw: 2, proporcao: 5, d: ['M6 24h13M29 24h13', 'M24 19l4 5-4 5-4-5z'] },
  { id: 'l-seta', nome: 'Seta', cat: 'linhas', sw: 2, proporcao: 4, d: ['M6 24h34M32 16l8 8-8 8'] },
  { id: 'l-seta-curva', nome: 'Seta curva', cat: 'linhas', sw: 2, d: ['M8 36c0-14 10-22 30-22', 'M30 8l8 6-8 6'] },

  /* ------------------------------ molduras ------------------------------ */
  { id: 'm-simples', nome: 'Moldura', cat: 'molduras', sw: 2, d: ['M6 6h36v36H6z'] },
  { id: 'm-dupla', nome: 'Moldura dupla', cat: 'molduras', sw: 1.8, d: ['M5 5h38v38H5z', 'M10 10h28v28H10z'] },
  { id: 'm-arredondada', nome: 'Arredondada', cat: 'molduras', sw: 2, d: ['M14 6h20a8 8 0 0 1 8 8v20a8 8 0 0 1-8 8H14a8 8 0 0 1-8-8V14a8 8 0 0 1 8-8z'] },
  { id: 'm-cantos', nome: 'Só os cantos', cat: 'molduras', sw: 2.2, d: ['M6 16V6h10M32 6h10v10M42 32v10H32M16 42H6V32'] },
  { id: 'm-oval', nome: 'Oval', cat: 'molduras', sw: 2, d: ['M24 6c9 0 15 8 15 18s-6 18-15 18S9 34 9 24 15 6 24 6z'] },
  { id: 'm-arco', nome: 'Arco', cat: 'molduras', sw: 2, d: ['M9 42V22a15 15 0 0 1 30 0v20z'] },
  { id: 'm-recorte', nome: 'Cantos vazados', cat: 'molduras', sw: 2, d: ['M14 6h20l8 8v20l-8 8H14l-8-8V14z'] },
  { id: 'm-ornamental', nome: 'Ornamental', cat: 'molduras', sw: 1.8, d: ['M8 8h32v32H8z', 'M8 8c6 0 6 6 12 6s6-6 12-6M8 40c6 0 6-6 12-6s6 6 12 6'] },
  { id: 'm-filme', nome: 'Filme', cat: 'molduras', sw: 1.8, d: ['M6 12h36v24H6z', 'M11 12v24M37 12v24', 'M6 18h5M6 24h5M6 30h5M37 18h5M37 24h5M37 30h5'] },
  { id: 'm-polaroide', nome: 'Polaroide', cat: 'molduras', sw: 2, d: ['M9 6h30v36H9z', 'M13 10h22v20H13z'] },

  /* ------------------------------- florais ------------------------------ */
  { id: 'fl-folha', nome: 'Folha', cat: 'florais', sw: 2, d: ['M10 38C10 20 22 8 38 8c0 16-12 30-28 30z', 'M14 34C20 24 28 16 36 12'] },
  { id: 'fl-ramo', nome: 'Ramo', cat: 'florais', sw: 2, d: ['M24 42V10', 'M24 18c-6 0-9-3-9-8 5 0 9 3 9 8zM24 18c6 0 9-3 9-8-5 0-9 3-9 8z', 'M24 30c-6 0-9-3-9-8 5 0 9 3 9 8zM24 30c6 0 9-3 9-8-5 0-9 3-9 8z'] },
  { id: 'fl-flor5', nome: 'Flor', cat: 'florais', sw: 1.9, d: ['M24 21a3 3 0 1 0 .01 0', 'M24 20c0-6-3-9-8-9 0 5 3 9 8 9zM24 20c0-6 3-9 8-9 0 5-3 9-8 9zM23 25c-5 3-6 7-4 12 5-3 7-7 4-12zM25 25c5 3 6 7 4 12-5-3-7-7-4-12zM22 23c-5-3-9-2-12 2 4 4 9 4 12-2z'] },
  { id: 'fl-margarida', nome: 'Margarida', cat: 'florais', sw: 1.9, d: ['M24 20a4 4 0 1 0 .01 0', 'M24 8v8M24 32v8M8 24h8M32 24h8M13 13l6 6M29 29l6 6M35 13l-6 6M19 29l-6 6'] },
  { id: 'fl-tulipa', nome: 'Tulipa', cat: 'florais', sw: 2, d: ['M24 26v16', 'M14 12c0 8 4 14 10 14s10-6 10-14c-4 3-6 5-10 5s-6-2-10-5z', 'M24 34c-5 0-8-3-9-8 5 0 9 3 9 8z'] },
  { id: 'fl-coroa', nome: 'Coroa de folhas', cat: 'florais', sw: 1.9, d: ['M24 40C13 36 8 28 8 18c6 2 10 6 12 12', 'M24 40c11-4 16-12 16-22-6 2-10 6-12 12'] },
  { id: 'fl-galho', nome: 'Galho', cat: 'florais', sw: 1.9, d: ['M8 40C18 34 30 22 40 8', 'M20 28c-3-4-3-8 0-11 3 3 3 7 0 11zM28 20c4-2 8-1 10 2-4 2-8 1-10-2z'] },
  { id: 'fl-lavanda', nome: 'Lavanda', cat: 'florais', sw: 1.9, d: ['M24 42V22', 'M24 22c-4 0-6-3-6-7s2-9 6-13c4 4 6 9 6 13s-2 7-6 7z', 'M24 30c-4 1-7 0-9-3M24 30c4 1 7 0 9-3'] },

  /* -------------------------------- fitas ------------------------------- */
  { id: 'ft-faixa', nome: 'Faixa', cat: 'fitas', sw: 2, proporcao: 3, d: ['M6 16h36v16H6z', 'M6 16l6 8-6 8M42 16l-6 8 6 8'] },
  { id: 'ft-banner', nome: 'Banner', cat: 'fitas', sw: 2, proporcao: 2.4, d: ['M8 12h32v18l-16 8-16-8z'] },
  { id: 'ft-laco', nome: 'Laço', cat: 'fitas', sw: 2, d: ['M24 24a5 5 0 1 0 .01 0', 'M21 21c-4-6-9-9-14-7 1 6 6 9 14 7zM27 21c4-6 9-9 14-7-1 6-6 9-14 7z', 'M22 28l-6 14M26 28l6 14'] },
  { id: 'ft-dupla', nome: 'Fita dupla', cat: 'fitas', sw: 2, proporcao: 3.5, d: ['M6 18h36M6 30h36', 'M6 18l5 6-5 6M42 18l-5 6 5 6'] },
  { id: 'ft-pendente', nome: 'Pendente', cat: 'fitas', sw: 2, proporcao: 0.8, d: ['M16 6h16v30l-8-7-8 7z'] },
  { id: 'ft-etiqueta', nome: 'Etiqueta', cat: 'fitas', sw: 2, proporcao: 2, d: ['M8 14h24l8 10-8 10H8z', 'M14 24h.01'] },

  /* -------------------------------- selos ------------------------------- */
  { id: 's-circulo', nome: 'Selo', cat: 'selos', sw: 1.8, d: ['M24 6a18 18 0 1 0 .01 0', 'M24 12a12 12 0 1 0 .01 0'] },
  { id: 's-estrela', nome: 'Selo estrela', cat: 'selos', sw: 1.8, d: ['M24 6a18 18 0 1 0 .01 0', 'M24 15l3 6.5 7 .8-5.2 4.6L30.3 34 24 30.3 17.7 34l1.5-7.1L14 22.3l7-.8z'] },
  { id: 's-medalha', nome: 'Medalha', cat: 'selos', sw: 1.9, d: ['M24 6a12 12 0 1 0 .01 0', 'M17 27l-5 15 12-6 12 6-5-15'] },
  { id: 's-escudo', nome: 'Escudo', cat: 'selos', sw: 2, d: ['M24 6l16 6v12c0 10-7 16-16 18-9-2-16-8-16-18V12z'] },
  { id: 's-louros', nome: 'Louros', cat: 'selos', sw: 1.9, d: ['M18 40C10 34 8 24 12 12c8 4 11 12 8 22', 'M30 40c8-6 10-16 6-28-8 4-11 12-8 22'] },
  { id: 's-rosacea', nome: 'Rosácea', cat: 'selos', sw: 1.7, d: ['M24 8a16 16 0 1 0 .01 0', 'M24 8v32M8 24h32M13 13l22 22M35 13 13 35'] },
  { id: 's-denteado', nome: 'Denteado', cat: 'selos', sw: 1.8, d: ['M24 5l3.4 3.6 4.8-1.3 1.4 4.8 4.8 1.4-1.3 4.8L41 22l-3.9 3.7 1.3 4.8-4.8 1.4-1.4 4.8-4.8-1.3L24 39l-3.4-3.6-4.8 1.3-1.4-4.8-4.8-1.4 1.3-4.8L7 22l3.9-3.7-1.3-4.8 4.8-1.4 1.4-4.8 4.8 1.3z'] },
  { id: 's-coroa', nome: 'Coroa', cat: 'selos', sw: 2, d: ['M8 34V14l8 7 8-11 8 11 8-7v20z', 'M8 38h32'] },
];

const POR_ID = new Map(ELEMENTOS.map((e) => [e.id, e]));

/** Elemento pelo id gravado; nunca devolve `undefined` para não derrubar o editor. */
export function elemento(id: string | undefined | null): Elemento {
  return (id ? POR_ID.get(id) : undefined) ?? ELEMENTOS[0];
}

export const existeElemento = (id: string) => POR_ID.has(id);

/** Formas de uma categoria; `todos` devolve o catálogo inteiro. */
export function porCategoria(cat: CategoriaElemento | 'todos'): Elemento[] {
  return cat === 'todos' ? ELEMENTOS : ELEMENTOS.filter((e) => e.cat === cat);
}
