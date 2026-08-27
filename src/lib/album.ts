/**
 * Modelo de uma lamina (spread) do album, persistido em projetos.paginas.
 * Coordenadas em % da lamina, para nao depender do zoom nem do tamanho fisico.
 */
export type Quadro = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
} & (
  | { tipo: 'foto'; fotoId: string | null; zoom: number; rotacao: number; pb: boolean }
  | { tipo: 'texto'; texto: string; preset: PresetTexto; cor: string }
);

export type PresetTexto = 'titulo' | 'subtitulo' | 'legenda' | 'data';

export type Lamina = {
  id: string;
  fundo: string;
  quadros: Quadro[];
};

export const PRESETS_TEXTO: Record<
  PresetTexto,
  { rotulo: string; descricao: string; classe: string }
> = {
  titulo: { rotulo: 'Título', descricao: '48 pt, peso forte', classe: 'text-[2.6cqw] font-extrabold tracking-[-.03em]' },
  subtitulo: { rotulo: 'Subtítulo', descricao: 'Médio, discreto', classe: 'text-[1.5cqw] font-medium' },
  legenda: { rotulo: 'Legenda', descricao: 'Pequena, em caixa alta', classe: 'text-[1cqw] font-bold uppercase tracking-[.18em]' },
  data: { rotulo: 'Data', descricao: 'Para marcar o momento', classe: 'text-[1.2cqw] font-semibold tracking-[.1em]' },
};

/** Layouts fixos: posicoes dos quadros conforme a quantidade de fotos. */
const LAYOUTS: Record<number, Array<Pick<Quadro, 'x' | 'y' | 'w' | 'h'>>> = {
  1: [{ x: 8, y: 10, w: 84, h: 80 }],
  2: [
    { x: 6, y: 12, w: 42, h: 76 },
    { x: 52, y: 12, w: 42, h: 76 },
  ],
  3: [
    { x: 6, y: 10, w: 44, h: 80 },
    { x: 54, y: 10, w: 40, h: 38 },
    { x: 54, y: 52, w: 40, h: 38 },
  ],
  4: [
    { x: 6, y: 10, w: 42, h: 38 },
    { x: 52, y: 10, w: 42, h: 38 },
    { x: 6, y: 52, w: 42, h: 38 },
    { x: 52, y: 52, w: 42, h: 38 },
  ],
};

export function novaLamina(quadros = 2): Lamina {
  const posicoes = LAYOUTS[quadros] ?? LAYOUTS[2];
  return {
    id: crypto.randomUUID(),
    fundo: '#FFFFFF',
    quadros: posicoes.map((p) => ({
      ...p,
      id: crypto.randomUUID(),
      tipo: 'foto' as const,
      fotoId: null,
      zoom: 100,
      rotacao: 0,
      pb: false,
    })),
  };
}

export function layoutsDisponiveis(): number[] {
  return Object.keys(LAYOUTS).map(Number);
}

/** Reaplica um layout mantendo as fotos ja escolhidas. */
export function aplicarLayout(lamina: Lamina, quantidade: number): Lamina {
  const posicoes = LAYOUTS[quantidade] ?? LAYOUTS[2];
  const fotos = lamina.quadros.filter((q) => q.tipo === 'foto');
  const textos = lamina.quadros.filter((q) => q.tipo === 'texto');

  return {
    ...lamina,
    quadros: [
      ...posicoes.map((p, i) => {
        const antigo = fotos[i];
        return antigo
          ? { ...antigo, ...p }
          : {
              ...p,
              id: crypto.randomUUID(),
              tipo: 'foto' as const,
              fotoId: null,
              zoom: 100,
              rotacao: 0,
              pb: false,
            };
      }),
      ...textos,
    ],
  };
}

/** Quadros de foto ainda vazios - alimenta o aviso "lâminas sem foto". */
export function laminasSemFoto(laminas: Lamina[]): number[] {
  return laminas
    .map((l, i) => (l.quadros.some((q) => q.tipo === 'foto' && !q.fotoId) ? i + 1 : 0))
    .filter(Boolean);
}

/** Progresso = quadros preenchidos / quadros totais. */
export function calcularProgresso(laminas: Lamina[]): number {
  const quadros = laminas.flatMap((l) => l.quadros).filter((q) => q.tipo === 'foto');
  if (quadros.length === 0) return 0;
  const cheios = quadros.filter((q) => q.tipo === 'foto' && q.fotoId).length;
  return Math.round((cheios / quadros.length) * 100);
}
