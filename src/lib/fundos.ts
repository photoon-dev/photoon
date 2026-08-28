/**
 * Padrões de fundo para as páginas do álbum.
 *
 * Vetoriais, e não imagens: um fundo rasterizado que serve na tela vira borrão
 * ao imprimir em 300 dpi numa página de 30 cm. O padrão em SVG é nítido em
 * qualquer tamanho, pesa menos de 1 KB e aceita a cor que o cliente escolher —
 * o que, com a paleta abaixo, dá centenas de combinações sem armazenar nada.
 */

export type Padrao = {
  id: string;
  nome: string;
  /** Lado do ladrilho, em unidades do SVG. */
  lado: number;
  /** Desenho do ladrilho. `COR` é trocado pela cor escolhida. */
  desenho: string;
};

export const PADROES: Padrao[] = [
  { id: 'liso', nome: 'Liso', lado: 8, desenho: '' },
  {
    id: 'coracoes', nome: 'Corações', lado: 40,
    desenho:
      '<path d="M20 28c-6-4-11-8-11-13a5.5 5.5 0 0 1 11-2 5.5 5.5 0 0 1 11 2c0 5-5 9-11 13z" fill="COR"/>',
  },
  {
    id: 'bolinhas', nome: 'Bolinhas', lado: 24,
    desenho: '<circle cx="6" cy="6" r="2.2" fill="COR"/><circle cx="18" cy="18" r="2.2" fill="COR"/>',
  },
  {
    id: 'losangos', nome: 'Losangos', lado: 32,
    desenho:
      '<path d="M16 2 30 16 16 30 2 16z" fill="none" stroke="COR" stroke-width="1.1"/>' +
      '<circle cx="16" cy="16" r="1.6" fill="COR"/>',
  },
  {
    id: 'listras', nome: 'Listras finas', lado: 16,
    desenho: '<path d="M-4 20 20 -4" stroke="COR" stroke-width="2.4"/><path d="M4 28 28 4" stroke="COR" stroke-width="2.4"/>',
  },
  {
    id: 'arabesco', nome: 'Arabescos', lado: 48,
    desenho:
      '<path d="M0 24c8-14 16-14 24 0s16 14 24 0" fill="none" stroke="COR" stroke-width="1.3"/>' +
      '<path d="M0 48c8-14 16-14 24 0" fill="none" stroke="COR" stroke-width="1.3"/>',
  },
  {
    id: 'escamas', nome: 'Escamas', lado: 40,
    desenho:
      '<path d="M0 20a20 20 0 0 1 40 0" fill="none" stroke="COR" stroke-width="1.2"/>' +
      '<path d="M-20 40a20 20 0 0 1 40 0M20 40a20 20 0 0 1 40 0" fill="none" stroke="COR" stroke-width="1.2"/>',
  },
  {
    id: 'chevron', nome: 'Chevron', lado: 32,
    desenho: '<path d="M0 20 16 6l16 14" fill="none" stroke="COR" stroke-width="2"/>' +
             '<path d="M0 36 16 22l16 14" fill="none" stroke="COR" stroke-width="2"/>',
  },
  {
    id: 'estrelas', nome: 'Estrelas', lado: 44,
    desenho:
      '<path d="M22 12l2.2 5.4 5.8.4-4.4 3.8 1.4 5.6-5-3-5 3 1.4-5.6-4.4-3.8 5.8-.4z" fill="COR"/>',
  },
  {
    id: 'floral', nome: 'Floral', lado: 46,
    desenho:
      '<g fill="none" stroke="COR" stroke-width="1.2">' +
      '<circle cx="23" cy="23" r="4"/><circle cx="23" cy="14" r="4"/><circle cx="23" cy="32" r="4"/>' +
      '<circle cx="14" cy="23" r="4"/><circle cx="32" cy="23" r="4"/></g>',
  },
  {
    id: 'grade', nome: 'Grade', lado: 28,
    desenho: '<path d="M0 0h28M0 0v28" stroke="COR" stroke-width="1"/>',
  },
  {
    id: 'confete', nome: 'Confete', lado: 52,
    desenho:
      '<g fill="COR">' +
      '<rect x="6" y="10" width="6" height="2.4" rx="1.2" transform="rotate(28 9 11)"/>' +
      '<rect x="32" y="6" width="6" height="2.4" rx="1.2" transform="rotate(-40 35 7)"/>' +
      '<rect x="18" y="30" width="6" height="2.4" rx="1.2" transform="rotate(65 21 31)"/>' +
      '<rect x="40" y="38" width="6" height="2.4" rx="1.2" transform="rotate(-15 43 39)"/></g>',
  },
  {
    id: 'linho', nome: 'Linho', lado: 12,
    desenho:
      '<path d="M0 3h12M0 9h12" stroke="COR" stroke-width=".7"/>' +
      '<path d="M3 0v12M9 0v12" stroke="COR" stroke-width=".7" opacity=".6"/>',
  },
  {
    id: 'ondas', nome: 'Ondas', lado: 40,
    desenho: '<path d="M0 20q10-8 20 0t20 0" fill="none" stroke="COR" stroke-width="1.3"/>',
  },

  /* ------------------------- os mais elegantes -------------------------- */
  {
    id: 'art-deco', nome: 'Art déco', lado: 44,
    desenho:
      '<g fill="none" stroke="COR" stroke-width="1.1">' +
      '<path d="M22 4 40 22 22 40 4 22z"/><path d="M22 12 32 22 22 32 12 22z"/>' +
      '<path d="M0 0h4M40 0h4M0 44h4M40 44h4"/></g>',
  },
  {
    id: 'damasco', nome: 'Damasco', lado: 56,
    desenho:
      '<g fill="none" stroke="COR" stroke-width="1.1">' +
      '<path d="M28 8c7 6 7 14 0 20-7-6-7-14 0-20z"/>' +
      '<path d="M28 28c7 6 7 14 0 20-7-6-7-14 0-20z"/>' +
      '<path d="M8 18c6 5 6 12 0 17M48 18c-6 5-6 12 0 17"/></g>',
  },
  {
    id: 'leque', nome: 'Leques', lado: 36,
    desenho:
      '<g fill="none" stroke="COR" stroke-width="1"><path d="M0 36a18 18 0 0 1 36 0"/>' +
      '<path d="M6 36a12 12 0 0 1 24 0"/><path d="M12 36a6 6 0 0 1 12 0"/></g>',
  },
  {
    id: 'entrelacado', nome: 'Entrelaçado', lado: 40,
    desenho:
      '<g fill="none" stroke="COR" stroke-width="1.1">' +
      '<circle cx="10" cy="10" r="9"/><circle cx="30" cy="10" r="9"/>' +
      '<circle cx="10" cy="30" r="9"/><circle cx="30" cy="30" r="9"/></g>',
  },
  {
    id: 'espinha', nome: 'Espinha de peixe', lado: 24,
    desenho:
      '<g fill="none" stroke="COR" stroke-width="1.4">' +
      '<path d="M0 0 6 6 0 12M12 0l6 6-6 6M0 12l6 6-6 6M12 12l6 6-6 6"/></g>',
  },
  {
    id: 'trelica', nome: 'Treliça', lado: 30,
    desenho:
      '<g fill="none" stroke="COR" stroke-width="1"><path d="M15 0 30 15 15 30 0 15z"/>' +
      '<circle cx="15" cy="15" r="2.4"/><circle cx="0" cy="15" r="1.4"/><circle cx="30" cy="15" r="1.4"/></g>',
  },
  {
    id: 'ramos', nome: 'Ramos', lado: 50,
    desenho:
      '<g fill="none" stroke="COR" stroke-width="1"><path d="M25 4v42"/>' +
      '<path d="M25 12c-6-2-9-6-9-6M25 12c6-2 9-6 9-6"/>' +
      '<path d="M25 24c-6-2-9-6-9-6M25 24c6-2 9-6 9-6"/>' +
      '<path d="M25 36c-6-2-9-6-9-6M25 36c6-2 9-6 9-6"/></g>',
  },
  {
    id: 'pontilhado', nome: 'Pontilhado fino', lado: 10,
    desenho: '<circle cx="5" cy="5" r=".9" fill="COR"/>',
  },
  {
    id: 'micro-grade', nome: 'Micro grade', lado: 8,
    desenho: '<path d="M0 0h8M0 0v8" stroke="COR" stroke-width=".5"/>',
  },
  {
    id: 'gotas', nome: 'Gotas', lado: 34,
    desenho:
      '<path d="M17 8c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z" fill="none" stroke="COR" stroke-width="1.1"/>',
  },
  {
    id: 'triangulos', nome: 'Triângulos', lado: 30,
    desenho: '<path d="M15 6 27 26H3z" fill="none" stroke="COR" stroke-width="1.1"/>',
  },
  {
    id: 'hexagonos', nome: 'Hexágonos', lado: 34,
    desenho:
      '<path d="M17 3 30 10.5v15L17 33 4 25.5v-15z" fill="none" stroke="COR" stroke-width="1"/>',
  },
  {
    id: 'plumas', nome: 'Plumas', lado: 46,
    desenho:
      '<g fill="none" stroke="COR" stroke-width="1"><path d="M23 6v34"/>' +
      '<path d="M23 10q-8 3-8 9M23 10q8 3 8 9M23 22q-8 3-8 9M23 22q8 3 8 9"/></g>',
  },
  {
    id: 'malha', nome: 'Malha diagonal', lado: 20,
    desenho:
      '<g stroke="COR" stroke-width=".8"><path d="M-5 5 5 -5M0 20 20 0M15 25 25 15"/>' +
      '<path d="M-5 15 5 25M0 0 20 20M15 -5 25 5"/></g>',
  },
  {
    id: 'lacos', nome: 'Laços', lado: 48,
    desenho:
      '<g fill="none" stroke="COR" stroke-width="1.1">' +
      '<path d="M24 24c-10-10-10-18 0-18s10 8 0 18z"/>' +
      '<path d="M24 24c10 10 10 18 0 18s-10-8 0-18z"/></g>',
  },
  {
    id: 'estrelinhas', nome: 'Estrelinhas', lado: 26,
    desenho:
      '<path d="M13 7v12M7 13h12" stroke="COR" stroke-width="1"/>' +
      '<path d="M9 9l8 8M17 9l-8 8" stroke="COR" stroke-width=".7"/>',
  },
];

/**
 * Paleta dos fundos.
 *
 * Tons claros de propósito: o fundo emoldura a foto, não disputa com ela. Um
 * fundo saturado atrás de um retrato estraga a foto impressa, e o cliente só
 * descobre quando o álbum chega.
 */
export const CORES_FUNDO = [
  { papel: '#FFFFFF', traco: '#E8ECF5', nome: 'Branco' },
  { papel: '#FCFAF5', traco: '#E4DCC9', nome: 'Marfim' },
  { papel: '#FDF2F4', traco: '#F0C7D2', nome: 'Rosé' },
  { papel: '#F1F7F5', traco: '#BFDED4', nome: 'Menta' },
  { papel: '#F2F5FC', traco: '#C6D4F0', nome: 'Azul sereno' },
  { papel: '#FBF4EC', traco: '#E7CDAE', nome: 'Areia' },
  { papel: '#F7F3FA', traco: '#D6C6E6', nome: 'Lavanda' },
  { papel: '#F5F7F2', traco: '#CEDCC2', nome: 'Sálvia' },
  { papel: '#FDF6E9', traco: '#EBD59B', nome: 'Champanhe' },
  { papel: '#F3F4F6', traco: '#CBD0D8', nome: 'Cinza claro' },
  { papel: '#1F2937', traco: '#3E4B60', nome: 'Grafite' },
  { papel: '#22303F', traco: '#3D566E', nome: 'Azul noite' },
];

/** SVG do padrão, como data URI pronto para `background-image`. */
export function fundoCss(padraoId: string, papel: string, traco: string): string {
  const p = PADROES.find((x) => x.id === padraoId) ?? PADROES[0];
  if (!p.desenho) return papel;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${p.lado}" height="${p.lado}" ` +
    `viewBox="0 0 ${p.lado} ${p.lado}">` +
    `<rect width="${p.lado}" height="${p.lado}" fill="${papel}"/>` +
    p.desenho.replace(/COR/g, traco) +
    '</svg>';

  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

/** Valor guardado no documento: `padrao|papel|traco`, ou só a cor. */
export function serializar(padraoId: string, papel: string, traco: string): string {
  return padraoId === 'liso' ? papel : `${padraoId}|${papel}|${traco}`;
}

/** Lê o valor guardado. Cor pura continua valendo — documentos antigos. */
export function interpretar(valor: string): { padrao: string; papel: string; traco: string } {
  if (!valor.includes('|')) return { padrao: 'liso', papel: valor || '#FFFFFF', traco: '#E8ECF5' };
  const [padrao, papel, traco] = valor.split('|');
  return { padrao, papel: papel || '#FFFFFF', traco: traco || '#E8ECF5' };
}

/** Estilo de fundo pronto, a partir do que está no documento. */
export function estiloFundo(valor: string): string {
  const { padrao, papel, traco } = interpretar(valor);
  const css = fundoCss(padrao, papel, traco);
  return css.startsWith('url(')
    ? `background-color:${papel};background-image:${css};background-repeat:repeat;`
    : `background-color:${papel};`;
}
