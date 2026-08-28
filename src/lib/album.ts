import { z } from 'zod';
import { LAYOUTS, LAYOUT_PADRAO, layout, type Ret } from './layouts';
import { ELEMENTOS, existeElemento } from './elementos';

/**
 * Documento do álbum, persistido em `projetos.paginas`.
 *
 * v2. A v1 guardava x/y/w/h em cada quadro, em % da lâmina inteira, e não tinha
 * onde registrar enquadramento nem ajustes de imagem — por isso o inspetor não
 * tinha objeto onde escrever. Agora:
 *
 *   - a POSIÇÃO do quadro de foto vem do layout da página, pelo índice. Existe
 *     um só desenho, compartilhado por seletor, miniatura e página;
 *   - `enq` (enquadramento) e `ajustes` (cor) são coisas distintas e ficam
 *     separados: mexer no brilho não pode mover a foto;
 *   - o quadro de texto continua livre, com retângulo próprio.
 *
 * `migrarLamina` aceita documentos v1 e lixo parcial sem derrubar o editor:
 * álbum de cliente não pode virar tela branca por causa de um campo faltando.
 */

export type PresetTexto = 'titulo' | 'subtitulo' | 'legenda' | 'data';

/** Como a foto se acomoda dentro do quadro. */
export type Enq = {
  /** `preencher` corta o que sobra; `encaixar` mostra a foto inteira. */
  modo: 'preencher' | 'encaixar';
  /** 1 = ajuste mínimo que satisfaz o modo. */
  escala: number;
  /** Deslocamento do centro, em fração da sobra (-1..1). */
  dx: number;
  dy: number;
  /** Graus. */
  rot: number;
  espelho: boolean;
};

/** Correções de imagem. Valores em -100..100, exceto `pb`. */
export type Ajustes = {
  brilho: number;
  contraste: number;
  saturacao: number;
  pb: boolean;
};

export type QuadroFoto = {
  id: string;
  tipo: 'foto';
  fotoId: string | null;
  enq: Enq;
  ajustes: Ajustes;
};

export type QuadroTexto = {
  id: string;
  tipo: 'texto';
  texto: string;
  preset: PresetTexto;
  cor: string;
  /** O texto não segue o layout: fica onde o usuário largou. */
  ret: Ret;
};

/**
 * Enfeite gráfico (moldura, folha, fita, selo…).
 *
 * Guarda o `forma` do catálogo (`src/lib/elementos.ts`), não o `d` do SVG: o
 * desenho pode ser corrigido depois sem reescrever o álbum de ninguém. Como o
 * texto, tem retângulo próprio — não entra na contagem do layout.
 */
export type QuadroElemento = {
  id: string;
  tipo: 'elemento';
  forma: string;
  cor: string;
  rot: number;
  ret: Ret;
};

export type Quadro = QuadroFoto | QuadroTexto | QuadroElemento;

export type Pagina = {
  layoutId: string;
  quadros: Quadro[];
};

export type Lamina = {
  id: string;
  fundo: string;
  esquerda: Pagina;
  direita: Pagina;
  /**
   * Fotos deslocadas ao trocar para um layout menor. Sair de 9 quadros para 2
   * e voltar não pode perder as escolhas do cliente.
   */
  reserva: string[];
};

export const ENQ_PADRAO: Enq = { modo: 'preencher', escala: 1, dx: 0, dy: 0, rot: 0, espelho: false };
export const AJUSTES_PADRAO: Ajustes = { brilho: 0, contraste: 0, saturacao: 0, pb: false };

export const PRESETS_TEXTO: Record<
  PresetTexto,
  { rotulo: string; descricao: string; classe: string }
> = {
  titulo: { rotulo: 'Título', descricao: '48 pt, peso forte', classe: 'text-[2.6cqw] font-extrabold tracking-[-.03em]' },
  subtitulo: { rotulo: 'Subtítulo', descricao: 'Médio, discreto', classe: 'text-[1.5cqw] font-medium' },
  legenda: { rotulo: 'Legenda', descricao: 'Pequena, em caixa alta', classe: 'text-[1cqw] font-bold uppercase tracking-[.18em]' },
  data: { rotulo: 'Data', descricao: 'Para marcar o momento', classe: 'text-[1.2cqw] font-semibold tracking-[.1em]' },
};

/* ---------------------------------------------------------------------------
   Validação

   `salvarLaminas` grava o que o navegador mandar. Sem esquema, um bug no
   cliente — ou a resposta de uma IA — vira lixo persistido que só aparece na
   impressão. O parse é estrito na escrita e tolerante na leitura.
   --------------------------------------------------------------------------- */

const zEnq = z.object({
  modo: z.enum(['preencher', 'encaixar']),
  escala: z.number().min(0.05).max(20),
  dx: z.number().min(-1).max(1),
  dy: z.number().min(-1).max(1),
  rot: z.number().min(-360).max(360),
  espelho: z.boolean(),
});

const zAjustes = z.object({
  brilho: z.number().min(-100).max(100),
  contraste: z.number().min(-100).max(100),
  saturacao: z.number().min(-100).max(100),
  pb: z.boolean(),
});

const zRet = z.object({
  x: z.number().min(-50).max(150),
  y: z.number().min(-50).max(150),
  w: z.number().min(0.5).max(200),
  h: z.number().min(0.5).max(200),
});

const zQuadro: z.ZodType<Quadro> = z.union([
  z.object({
    id: z.string().min(1),
    tipo: z.literal('foto'),
    fotoId: z.string().min(1).nullable(),
    enq: zEnq,
    ajustes: zAjustes,
  }),
  z.object({
    id: z.string().min(1),
    tipo: z.literal('texto'),
    texto: z.string().max(2000),
    preset: z.enum(['titulo', 'subtitulo', 'legenda', 'data']),
    cor: z.string().regex(/^#[0-9A-Fa-f]{3,8}$/),
    ret: zRet,
  }),
  z.object({
    id: z.string().min(1),
    tipo: z.literal('elemento'),
    // Só formas que existem no catálogo: um id inventado renderizaria vazio.
    forma: z.string().min(1).refine(existeElemento, 'forma fora do catálogo'),
    cor: z.string().regex(/^#[0-9A-Fa-f]{3,8}$/),
    rot: z.number().min(-360).max(360),
    ret: zRet,
  }),
]);

const IDS = LAYOUTS.map((l) => l.id) as [string, ...string[]];

const zPagina = z.object({
  layoutId: z.enum(IDS),
  quadros: z.array(zQuadro).max(60),
});

export const zLamina = z.object({
  id: z.string().min(1),
  fundo: z.string().regex(/^#[0-9A-Fa-f]{3,8}$/),
  esquerda: zPagina,
  direita: zPagina,
  reserva: z.array(z.string().min(1)).max(500),
});

export const zLaminas = z.array(zLamina).max(200);

/* ---------------------------------------------------------------------------
   Construção e migração
   --------------------------------------------------------------------------- */

const uid = () =>
  typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now().toString(36);

export function novoQuadroFoto(fotoId: string | null = null): QuadroFoto {
  return { id: uid(), tipo: 'foto', fotoId, enq: { ...ENQ_PADRAO }, ajustes: { ...AJUSTES_PADRAO } };
}

/**
 * Elemento novo, no meio da página, com a caixa proporcional à forma.
 *
 * Nasce em 22% de largura: grande o bastante para o cliente ver o que inseriu
 * e pequeno o bastante para não tapar a foto.
 */
export function novoQuadroElemento(forma: string, cor = '#2563EB'): QuadroElemento {
  const e = ELEMENTOS.find((x) => x.id === forma) ?? ELEMENTOS[0];
  const w = 22;
  const h = w / (e.proporcao ?? 1);
  return {
    id: uid(),
    tipo: 'elemento',
    forma: e.id,
    cor,
    rot: 0,
    ret: { x: 50 - w / 2, y: 50 - h / 2, w, h },
  };
}

export function novaPagina(layoutId = LAYOUT_PADRAO): Pagina {
  return {
    layoutId,
    quadros: layout(layoutId).quadros.map(() => novoQuadroFoto()),
  };
}

export function novaLamina(layoutId = LAYOUT_PADRAO): Lamina {
  return {
    id: uid(),
    fundo: '#FFFFFF',
    esquerda: novaPagina(layoutId),
    direita: novaPagina(layoutId),
    reserva: [],
  };
}

/**
 * Troca o layout de uma página preservando as fotos.
 *
 * Ao encolher, o excedente vai para a reserva da lâmina; ao crescer, os quadros
 * novos puxam de lá antes de nascer vazios. Assim ir de 9 para 2 e voltar
 * devolve exatamente o que estava.
 */
export function aplicarLayout(lamina: Lamina, lado: 'esquerda' | 'direita', layoutId: string): Lamina {
  const pagina = lamina[lado];
  const alvo = layout(layoutId).quadros.length;
  const fotos = pagina.quadros.filter((q): q is QuadroFoto => q.tipo === 'foto');
  // Texto e elemento têm retângulo próprio: o layout não os posiciona, então
  // atravessam a troca intactos. Filtrar só por 'texto' apagava os elementos.
  const livres = pagina.quadros.filter((q) => q.tipo !== 'foto');
  const reserva = [...lamina.reserva];

  const mantidos = fotos.slice(0, alvo);
  for (const q of fotos.slice(alvo)) if (q.fotoId) reserva.push(q.fotoId);

  const novos: QuadroFoto[] = [];
  for (let i = mantidos.length; i < alvo; i++) {
    novos.push(novoQuadroFoto(reserva.shift() ?? null));
  }

  return {
    ...lamina,
    reserva,
    [lado]: { layoutId, quadros: [...mantidos, ...novos, ...livres] },
  };
}

/** Retângulo do quadro de foto de índice `i` na página. */
export function retDoQuadro(pagina: Pagina, quadroId: string): Ret | null {
  const fotos = pagina.quadros.filter((q) => q.tipo === 'foto');
  const i = fotos.findIndex((q) => q.id === quadroId);
  if (i < 0) {
    const t = pagina.quadros.find((q) => q.id === quadroId);
    return t && t.tipo !== 'foto' ? t.ret : null;
  }
  return layout(pagina.layoutId).quadros[i] ?? null;
}

/* --------------------------- migração tolerante --------------------------- */

const num = (v: unknown, padrao: number) => (typeof v === 'number' && Number.isFinite(v) ? v : padrao);
const str = (v: unknown, padrao: string) => (typeof v === 'string' && v ? v : padrao);

function migrarEnq(q: Record<string, unknown>): Enq {
  const e = (q.enq ?? {}) as Record<string, unknown>;
  return {
    modo: e.modo === 'encaixar' ? 'encaixar' : 'preencher',
    // v1 guardava `zoom` em percentual (100 = natural).
    escala: Math.min(20, Math.max(0.05, num(e.escala, num(q.zoom, 100) / 100 || 1))),
    dx: Math.min(1, Math.max(-1, num(e.dx, 0))),
    dy: Math.min(1, Math.max(-1, num(e.dy, 0))),
    rot: num(e.rot, num(q.rotacao, 0)),
    espelho: e.espelho === true,
  };
}

function migrarAjustes(q: Record<string, unknown>): Ajustes {
  const a = (q.ajustes ?? {}) as Record<string, unknown>;
  const lim = (v: unknown) => Math.min(100, Math.max(-100, num(v, 0)));
  return {
    brilho: lim(a.brilho),
    contraste: lim(a.contraste),
    saturacao: lim(a.saturacao),
    pb: a.pb === true || q.pb === true,
  };
}

/**
 * Retângulo de um quadro livre (texto, elemento).
 *
 * O v2 grava em `q.ret`; o v1 gravava x/y/w/h soltos no quadro. Ler só o
 * formato antigo devolvia o padrão a CADA carregamento — o texto que o cliente
 * posicionou voltava sozinho para o canto ao reabrir o álbum.
 */
function migrarRet(q: Record<string, unknown>, padrao: Ret): Ret {
  const r = (q.ret ?? q) as Record<string, unknown>;
  return {
    x: num(r.x, padrao.x),
    y: num(r.y, padrao.y),
    w: num(r.w, padrao.w),
    h: num(r.h, padrao.h),
  };
}

function migrarQuadro(bruto: unknown): Quadro | null {
  if (!bruto || typeof bruto !== 'object') return null;
  const q = bruto as Record<string, unknown>;

  if (q.tipo === 'elemento') {
    const forma = str(q.forma, '');
    // Forma desconhecida (catálogo mudou, documento adulterado): descarta o
    // quadro em vez de renderizar um buraco. Nunca lança.
    if (!existeElemento(forma)) return null;
    return {
      id: str(q.id, uid()),
      tipo: 'elemento',
      forma,
      cor: /^#[0-9A-Fa-f]{3,8}$/.test(String(q.cor)) ? String(q.cor) : '#2563EB',
      rot: Math.min(360, Math.max(-360, num(q.rot, 0))),
      ret: migrarRet(q, { x: 39, y: 39, w: 22, h: 22 }),
    };
  }

  if (q.tipo === 'texto') {
    const preset = str(q.preset, 'legenda') as PresetTexto;
    return {
      id: str(q.id, uid()),
      tipo: 'texto',
      texto: typeof q.texto === 'string' ? q.texto.slice(0, 2000) : '',
      preset: preset in PRESETS_TEXTO ? preset : 'legenda',
      cor: /^#[0-9A-Fa-f]{3,8}$/.test(String(q.cor)) ? String(q.cor) : '#0B1220',
      ret: migrarRet(q, { x: 10, y: 10, w: 40, h: 12 }),
    };
  }

  return {
    id: str(q.id, uid()),
    tipo: 'foto',
    fotoId: typeof q.fotoId === 'string' && q.fotoId ? q.fotoId : null,
    enq: migrarEnq(q),
    ajustes: migrarAjustes(q),
  };
}

/** Escolhe o layout cujo número de quadros bate com o que o documento tinha. */
function layoutPara(n: number): string {
  if (n <= 0) return LAYOUT_PADRAO;
  const exato = LAYOUTS.find((l) => l.n === n);
  if (exato) return exato.id;
  return LAYOUTS.reduce((a, b) => (Math.abs(b.n - n) < Math.abs(a.n - n) ? b : a)).id;
}

function migrarPagina(bruto: unknown, fallback: Quadro[] = []): Pagina {
  const p = (bruto ?? {}) as Record<string, unknown>;
  const brutos = Array.isArray(p.quadros) ? p.quadros : fallback;
  const quadros = brutos.map(migrarQuadro).filter((q): q is Quadro => q !== null);
  const nFotos = quadros.filter((q) => q.tipo === 'foto').length;

  const id = str(p.layoutId, '');
  const layoutId = LAYOUTS.some((l) => l.id === id) ? id : layoutPara(nFotos);

  // O layout manda na quantidade de quadros: um documento com 3 fotos e layout
  // de 4 renderizaria um quadro fantasma sem posição.
  const alvo = layout(layoutId).quadros.length;
  const fotos = quadros.filter((q): q is QuadroFoto => q.tipo === 'foto').slice(0, alvo);
  while (fotos.length < alvo) fotos.push(novoQuadroFoto());

  // Tudo que não é foto tem retângulo próprio e sobrevive à migração.
  return { layoutId, quadros: [...fotos, ...quadros.filter((q) => q.tipo !== 'foto')] };
}

/**
 * Aceita v2, v1 e documento parcial. Nunca lança: um campo estranho vira o
 * padrão, e o cliente continua com o álbum aberto.
 */
export function migrarLamina(bruto: unknown): Lamina {
  const l = (bruto ?? {}) as Record<string, unknown>;

  // v1: uma lista única de quadros para a lâmina toda, sem lados. Divide ao
  // meio, que é a leitura mais próxima do que estava desenhado.
  if (!l.esquerda && !l.direita && Array.isArray(l.quadros)) {
    const meio = Math.ceil(l.quadros.length / 2);
    return {
      id: str(l.id, uid()),
      fundo: /^#[0-9A-Fa-f]{3,8}$/.test(String(l.fundo)) ? String(l.fundo) : '#FFFFFF',
      esquerda: migrarPagina(null, l.quadros.slice(0, meio).map(migrarQuadro).filter(Boolean) as Quadro[]),
      direita: migrarPagina(null, l.quadros.slice(meio).map(migrarQuadro).filter(Boolean) as Quadro[]),
      reserva: [],
    };
  }

  return {
    id: str(l.id, uid()),
    fundo: /^#[0-9A-Fa-f]{3,8}$/.test(String(l.fundo)) ? String(l.fundo) : '#FFFFFF',
    esquerda: migrarPagina(l.esquerda),
    direita: migrarPagina(l.direita),
    reserva: Array.isArray(l.reserva) ? l.reserva.filter((r): r is string => typeof r === 'string') : [],
  };
}

export function migrarLaminas(bruto: unknown): Lamina[] {
  if (!Array.isArray(bruto)) return [];
  return bruto.slice(0, 200).map(migrarLamina);
}

/* ------------------------------- indicadores ------------------------------ */

const todosQuadros = (l: Lamina) => [...l.esquerda.quadros, ...l.direita.quadros];

/** Lâminas com algum quadro de foto vazio — alimenta o aviso do editor. */
export function laminasSemFoto(laminas: Lamina[]): number[] {
  return laminas
    .map((l, i) => (todosQuadros(l).some((q) => q.tipo === 'foto' && !q.fotoId) ? i + 1 : 0))
    .filter(Boolean);
}

/** Progresso = quadros de foto preenchidos / total. */
export function calcularProgresso(laminas: Lamina[]): number {
  const quadros = laminas.flatMap(todosQuadros).filter((q): q is QuadroFoto => q.tipo === 'foto');
  if (quadros.length === 0) return 0;
  return Math.round((quadros.filter((q) => q.fotoId).length / quadros.length) * 100);
}

/** Fotos usadas no álbum, sem repetir. */
export function fotosUsadas(laminas: Lamina[]): Set<string> {
  const s = new Set<string>();
  for (const l of laminas)
    for (const q of todosQuadros(l)) if (q.tipo === 'foto' && q.fotoId) s.add(q.fotoId);
  return s;
}

/** Uma lâmina = duas páginas. A capa conta como uma. */
export function totalPaginas(laminas: Lamina[]): number {
  return Math.max(0, laminas.length * 2);
}
