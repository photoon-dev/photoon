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

/** Efeito de cor aplicado por cima das correções. */
export type Efeito = 'nenhum' | 'pb' | 'sepia' | 'vintage' | 'frio' | 'quente' | 'desbotado';

export const EFEITOS: { id: Efeito; rotulo: string }[] = [
  { id: 'nenhum', rotulo: 'Original' },
  { id: 'pb', rotulo: 'Preto e branco' },
  { id: 'sepia', rotulo: 'Sépia' },
  { id: 'vintage', rotulo: 'Vintage' },
  { id: 'desbotado', rotulo: 'Desbotado' },
  { id: 'quente', rotulo: 'Quente' },
  { id: 'frio', rotulo: 'Frio' },
];

/** Correções de imagem. Valores em -100..100. */
export type Ajustes = {
  brilho: number;
  contraste: number;
  saturacao: number;
  /**
   * Era um booleano `pb`. Virou lista porque um álbum pede mais que preto e
   * branco — sépia num casamento antigo, desbotado numa sessão de praia.
   * `migrarAjustes` converte `pb: true` em `efeito: 'pb'`.
   */
  efeito: Efeito;
};

/** Moldura da foto, em pontos da página. */
export type Borda = { px: number; cor: string };

export type QuadroFoto = {
  id: string;
  tipo: 'foto';
  fotoId: string | null;
  enq: Enq;
  ajustes: Ajustes;
  /** Ausente = sem moldura. */
  borda?: Borda;
};

/**
 * Famílias tipográficas oferecidas.
 *
 * Poucas e de propósito: todas existem nos sistemas comuns, então o que o
 * cliente vê na tela é o que sai na impressão. Fonte bonita que só existe na
 * máquina de quem desenhou vira Times New Roman no papel.
 */
export const FONTES = [
  { id: 'sistema', rotulo: 'Padrão', css: "'Inter','Helvetica Neue',Arial,sans-serif" },
  { id: 'serifa', rotulo: 'Serifa', css: "Georgia,'Times New Roman',serif" },
  { id: 'display', rotulo: 'Display', css: "'Trebuchet MS','Segoe UI',sans-serif" },
  { id: 'mono', rotulo: 'Máquina', css: "'Courier New',monospace" },
  { id: 'manuscrita', rotulo: 'Manuscrita', css: "'Brush Script MT','Segoe Script',cursive" },
] as const;

export type FonteId = (typeof FONTES)[number]['id'];

export type QuadroTexto = {
  id: string;
  tipo: 'texto';
  texto: string;
  preset: PresetTexto;
  cor: string;
  /** Sobrepõem o preset quando presentes. */
  fonte?: FonteId;
  /** Tamanho em `cqw` — % da largura da página. */
  tamanho?: number;
  peso?: number;
  alinhamento?: 'left' | 'center' | 'right';
  italico?: boolean;
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
  /**
   * SVG da peça, quando ela vem da biblioteca (Noto/Fluent, coloridas).
   *
   * As formas antigas são de traço monocromático e desenhadas por `forma` +
   * `cor`. As da biblioteca já trazem as próprias cores, então guardam o
   * desenho: assim o álbum não depende de a biblioteca continuar existindo com
   * aquele id — o que quebraria álbuns antigos a cada atualização do acervo.
   */
  svg?: string;
};

export type Quadro = QuadroFoto | QuadroTexto | QuadroElemento;

export type Pagina = {
  layoutId: string;
  /**
   * Foto usada como fundo da página inteira.
   *
   * Camada distinta do quadro: a foto que virou fundo continua aparecendo no
   * quadro por cima. `opacidade` permite clarear, para o fundo não competir
   * com as fotos da frente.
   */
  fundoFoto?: { fotoId: string; opacidade: number };
  quadros: Quadro[];
};

export type Lamina = {
  id: string;
  fundo: string;
  /**
   * Respiro entre as fotos, em MILÍMETROS do produto impresso.
   *
   * Em mm, e não em %, porque é a unidade do produto: o cliente pensa "3 mm
   * entre as fotos". A conversão para % usa a largura da página do template.
   * Ausente = padrão do sistema.
   */
  espacoMm?: number;
  esquerda: Pagina;
  direita: Pagina;
  /**
   * Fotos deslocadas ao trocar para um layout menor. Sair de 9 quadros para 2
   * e voltar não pode perder as escolhas do cliente.
   */
  reserva: string[];
};

export const ENQ_PADRAO: Enq = { modo: 'preencher', escala: 1, dx: 0, dy: 0, rot: 0, espelho: false };
export const AJUSTES_PADRAO: Ajustes = { brilho: 0, contraste: 0, saturacao: 0, efeito: 'nenhum' };
export const BORDA_PADRAO: Borda = { px: 6, cor: '#FFFFFF' };

export const PRESETS_TEXTO: Record<
  PresetTexto,
  {
    rotulo: string;
    descricao: string;
    exemplo: string;
    /**
     * Tamanho em `cqw` — porcentagem da largura da PÁGINA.
     *
     * Não em px: o mesmo documento é desenhado a 64% de zoom na tela e a 300
     * dpi na impressão. Em px o título sairia minúsculo no papel.
     */
    tamanhoCqw: number;
    peso: number;
    espacamento: string;
    caixa: 'none' | 'uppercase';
  }
> = {
  titulo: {
    rotulo: 'Título', descricao: '48 pt, peso forte', exemplo: 'Nosso dia',
    tamanhoCqw: 7.2, peso: 800, espacamento: '-.03em', caixa: 'none',
  },
  subtitulo: {
    rotulo: 'Subtítulo', descricao: 'Médio, discreto', exemplo: 'Um dia para lembrar',
    tamanhoCqw: 4, peso: 500, espacamento: '0', caixa: 'none',
  },
  legenda: {
    rotulo: 'Legenda', descricao: 'Pequena, em caixa alta', exemplo: 'Legenda',
    tamanhoCqw: 2.4, peso: 700, espacamento: '.18em', caixa: 'uppercase',
  },
  data: {
    rotulo: 'Data', descricao: 'Para marcar o momento', exemplo: '12 · dezembro · 2026',
    tamanhoCqw: 3, peso: 600, espacamento: '.1em', caixa: 'none',
  },
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
  efeito: z.enum(['nenhum', 'pb', 'sepia', 'vintage', 'frio', 'quente', 'desbotado']),
});

const zBorda = z.object({
  px: z.number().min(0).max(60),
  cor: z.string().regex(/^#[0-9A-Fa-f]{3,8}$/),
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
    borda: zBorda.optional(),
  }),
  z.object({
    id: z.string().min(1),
    tipo: z.literal('texto'),
    texto: z.string().max(2000),
    preset: z.enum(['titulo', 'subtitulo', 'legenda', 'data']),
    cor: z.string().regex(/^#[0-9A-Fa-f]{3,8}$/),
    fonte: z.enum(['sistema', 'serifa', 'display', 'mono', 'manuscrita']).optional(),
    tamanho: z.number().min(0.5).max(40).optional(),
    peso: z.number().min(100).max(900).optional(),
    alinhamento: z.enum(['left', 'center', 'right']).optional(),
    italico: z.boolean().optional(),
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
    svg: z.string().max(200000).optional(),
  }),
]);

const IDS = LAYOUTS.map((l) => l.id) as [string, ...string[]];

const zPagina = z.object({
  layoutId: z.enum(IDS),
  fundoFoto: z.object({ fotoId: z.string().min(1), opacidade: z.number().min(0).max(1) }).optional(),
  quadros: z.array(zQuadro).max(60),
});

export const zLamina = z.object({
  id: z.string().min(1),
  // Cor pura (`#RRGGBB`) ou padrão (`id|papel|traco`). O formato antigo
  // continua válido: documento já gravado não pode virar inválido.
  fundo: z.string().regex(/^(#[0-9A-Fa-f]{3,8}|[a-z-]+\|#[0-9A-Fa-f]{3,8}\|#[0-9A-Fa-f]{3,8})$/),
  espacoMm: z.number().min(0).max(50).optional(),
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
/** Texto novo, no meio da página, com o tamanho do preset. */
export function novoQuadroTexto(preset: PresetTexto = 'titulo'): QuadroTexto {
  // Altura por preset: um título ocupa mais linha que uma legenda, e nascer
  // com a caixa certa evita o texto sair cortado antes do primeiro ajuste.
  const h = preset === 'titulo' ? 14 : preset === 'subtitulo' ? 10 : 7;
  const w = 60;
  return {
    id: uid(),
    tipo: 'texto',
    texto: PRESETS_TEXTO[preset].exemplo,
    preset,
    cor: '#0B1220',
    ret: { x: 50 - w / 2, y: 50 - h / 2, w, h },
  };
}

export function novoQuadroElemento(forma: string, cor = '#2563EB', svg?: string): QuadroElemento {
  const e = ELEMENTOS.find((x) => x.id === forma) ?? ELEMENTOS[0];
  const w = 22;
  // Peça da biblioteca é quadrada; forma de traço tem a proporção do catálogo.
  const h = svg ? w : w / (e.proporcao ?? 1);
  return {
    id: uid(),
    tipo: 'elemento',
    // Sem `svg`, o id tem de existir no catálogo de formas — a validação exige.
    // Com `svg`, o desenho vem junto e `forma` fica só como rótulo de origem.
    forma: svg ? ELEMENTOS[0].id : e.id,
    cor,
    rot: 0,
    ret: { x: 50 - w / 2, y: 50 - h / 2, w, h },
    ...(svg ? { svg } : {}),
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
  const listados = EFEITOS.map((e) => e.id) as string[];
  const efeito = listados.includes(String(a.efeito))
    ? (a.efeito as Efeito)
    : // v1 e v2 antigos guardavam o booleano.
      a.pb === true || q.pb === true
      ? 'pb'
      : 'nenhum';
  return { brilho: lim(a.brilho), contraste: lim(a.contraste), saturacao: lim(a.saturacao), efeito };
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
      ...(FONTES.some((f) => f.id === q.fonte) ? { fonte: q.fonte as FonteId } : {}),
      ...(typeof q.tamanho === 'number' && Number.isFinite(q.tamanho)
        ? { tamanho: Math.min(40, Math.max(0.5, q.tamanho)) }
        : {}),
      ...(typeof q.peso === 'number' ? { peso: Math.min(900, Math.max(100, q.peso)) } : {}),
      ...(['left', 'center', 'right'].includes(String(q.alinhamento))
        ? { alinhamento: q.alinhamento as 'left' | 'center' | 'right' }
        : {}),
      ...(q.italico === true ? { italico: true } : {}),
      ret: migrarRet(q, { x: 10, y: 10, w: 40, h: 12 }),
    };
  }

  const bd = (q.borda ?? null) as Record<string, unknown> | null;
  const b =
    bd && typeof bd.px === 'number'
      ? {
          px: Math.min(60, Math.max(0, bd.px)),
          cor: /^#[0-9A-Fa-f]{3,8}$/.test(String(bd.cor)) ? String(bd.cor) : '#FFFFFF',
        }
      : null;

  return {
    id: str(q.id, uid()),
    tipo: 'foto',
    fotoId: typeof q.fotoId === 'string' && q.fotoId ? q.fotoId : null,
    enq: migrarEnq(q),
    ajustes: migrarAjustes(q),
    ...(b ? { borda: b } : {}),
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
  const ff = (p.fundoFoto ?? null) as Record<string, unknown> | null;
  const fundoFoto =
    ff && typeof ff.fotoId === 'string' && ff.fotoId
      ? { fotoId: ff.fotoId, opacidade: Math.min(1, Math.max(0, num(ff.opacidade, 0.35))) }
      : undefined;

  return {
    layoutId,
    ...(fundoFoto ? { fundoFoto } : {}),
    quadros: [...fotos, ...quadros.filter((q) => q.tipo !== 'foto')],
  };
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
      fundo: /^(#[0-9A-Fa-f]{3,8}|[a-z-]+\|#[0-9A-Fa-f]{3,8}\|#[0-9A-Fa-f]{3,8})$/.test(String(l.fundo)) ? String(l.fundo) : '#FFFFFF',
      esquerda: migrarPagina(null, l.quadros.slice(0, meio).map(migrarQuadro).filter(Boolean) as Quadro[]),
      direita: migrarPagina(null, l.quadros.slice(meio).map(migrarQuadro).filter(Boolean) as Quadro[]),
      reserva: [],
    };
  }

  return {
    id: str(l.id, uid()),
    fundo: /^(#[0-9A-Fa-f]{3,8}|[a-z-]+\|#[0-9A-Fa-f]{3,8}\|#[0-9A-Fa-f]{3,8})$/.test(String(l.fundo)) ? String(l.fundo) : '#FFFFFF',
    espacoMm:
      typeof l.espacoMm === 'number' && Number.isFinite(l.espacoMm)
        ? Math.min(50, Math.max(0, l.espacoMm))
        : undefined,
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

/**
 * Tipografia efetiva de um texto: o que o usuário escolheu, ou o preset.
 *
 * Uma função só, usada pelo canvas, pelo inspetor e (adiante) pela impressão —
 * senão cada um chega a um tamanho diferente para o mesmo texto.
 */
export function tipografia(q: QuadroTexto) {
  const p = PRESETS_TEXTO[q.preset];
  const f = FONTES.find((x) => x.id === (q.fonte ?? 'sistema')) ?? FONTES[0];
  return {
    tamanho: q.tamanho ?? p.tamanhoCqw,
    peso: q.peso ?? p.peso,
    espacamento: p.espacamento,
    caixa: p.caixa,
    alinhamento: q.alinhamento ?? 'center',
    familia: f.css,
    italico: !!q.italico,
  };
}
