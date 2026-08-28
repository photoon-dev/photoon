import type { Enq } from './album';
import { medidasPorcento } from './imagem';

/**
 * Rostos: geometria do enquadramento e agrupamento por pessoa.
 *
 * Tudo aqui é função pura, sem React e sem rede, porque as MESMAS contas
 * precisam valer em três lugares: no editor (aviso "rosto perto do corte" e
 * botão "Corrigir"), no servidor (agrupamento em pessoas) e, na Fase 4, na
 * impressão. A detecção em si roda no navegador do lojista (`faceapi.ts`);
 * aqui só entram os números que ela produziu.
 *
 * A caixa do rosto é normalizada 0–1 sobre a foto ORIGINAL, como está gravada
 * em `rostos.caixa` — não sobre miniatura nem sobre recorte.
 */

export type Caixa = { x: number; y: number; w: number; h: number };

export type Rosto = {
  id: string;
  fotoId: string;
  caixa: Caixa;
  vetor: number[];
  pessoaId: string | null;
  conf: number;
};

const limitar = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/* ---------------------------------------------------------------------------
   Onde o rosto cai dentro do quadro

   Espelha exatamente o que `imagemCss` desenha. Se esta conta divergir de lá,
   o aviso aponta para um lugar onde o rosto não está — que foi justamente o
   defeito do retângulo fixo em 16%/20% que este bloco substitui.
   --------------------------------------------------------------------------- */

/**
 * Converte a caixa do rosto (fração da foto) para fração do QUADRO.
 *
 * Devolve o retângulo alinhado aos eixos que envolve o rosto depois de
 * espelhar, ampliar, girar e deslocar. Valores fora de 0–1 significam que
 * aquela parte do rosto está fora do quadro — cortada.
 */
export function rostoNoQuadro(
  caixa: Caixa,
  enq: Enq,
  proporcaoFoto: number,
  proporcaoCaixa: number,
): Caixa {
  const { w: wPct, h: hPct } = medidasPorcento(enq, proporcaoFoto, proporcaoCaixa);

  // Caixa virtual: altura 1, largura = proporção. Rotação mistura os eixos,
  // então eles precisam da mesma unidade.
  const bw = proporcaoCaixa;
  const bh = 1;
  const iw = (wPct / 100) * bw * enq.escala;
  const ih = (hPct / 100) * bh * enq.escala;

  const cx = bw / 2 + (enq.dx * iw) / 2;
  const cy = bh / 2 + (enq.dy * ih) / 2;

  // `scaleX(-1)` é o último da lista de transformações, logo o PRIMEIRO a ser
  // aplicado: espelha dentro da própria imagem.
  const x0 = enq.espelho ? 1 - caixa.x - caixa.w : caixa.x;
  const y0 = caixa.y;

  const rad = ((enq.rot ?? 0) * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sen = Math.sin(rad);

  const xs: number[] = [];
  const ys: number[] = [];
  for (const u of [x0, x0 + caixa.w]) {
    for (const v of [y0, y0 + caixa.h]) {
      const lx = (u - 0.5) * iw;
      const ly = (v - 0.5) * ih;
      xs.push(cx + lx * cos - ly * sen);
      ys.push(cy + lx * sen + ly * cos);
    }
  }

  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  return {
    x: minX / bw,
    y: minY / bh,
    w: (Math.max(...xs) - minX) / bw,
    h: (Math.max(...ys) - minY) / bh,
  };
}

/**
 * Margem segura do quadro, em fração.
 *
 * O design desenha a margem de corte em `inset: 4%`. Um rosto que passa dessa
 * linha corre risco real na guilhotina.
 */
export const MARGEM_SEGURA = 0.04;

export type Diagnostico = {
  /** Alguma parte do rosto ficou fora do quadro. */
  cortado: boolean;
  /** O rosto entrou na faixa de sangria, mesmo sem sair do quadro. */
  perto: boolean;
  /** Quanto falta, em fração do quadro, para o rosto voltar à área segura. */
  folga: { esquerda: number; direita: number; topo: number; base: number };
};

export function diagnosticar(r: Caixa, margem = MARGEM_SEGURA): Diagnostico {
  const folga = {
    esquerda: margem - r.x,
    topo: margem - r.y,
    direita: r.x + r.w - (1 - margem),
    base: r.y + r.h - (1 - margem),
  };
  const cortado = r.x < 0 || r.y < 0 || r.x + r.w > 1 || r.y + r.h > 1;
  const perto =
    folga.esquerda > 0 || folga.direita > 0 || folga.topo > 0 || folga.base > 0;
  return { cortado, perto, folga };
}

/** Junta várias caixas numa só — o retângulo que envolve todos os rostos. */
export function envolver(caixas: Caixa[]): Caixa | null {
  if (caixas.length === 0) return null;
  const x = Math.min(...caixas.map((c) => c.x));
  const y = Math.min(...caixas.map((c) => c.y));
  const x2 = Math.max(...caixas.map((c) => c.x + c.w));
  const y2 = Math.max(...caixas.map((c) => c.y + c.h));
  return { x, y, w: x2 - x, h: y2 - y };
}

/* ---------------------------------------------------------------------------
   Correção — determinística, sem IA
   --------------------------------------------------------------------------- */

/**
 * Reenquadra para trazer os rostos de volta à área segura.
 *
 * Primeiro tenta só DESLOCAR, que é a correção que menos mexe na intenção do
 * cliente. Se o deslocamento não bastar (o rosto é grande demais para a
 * moldura), reduz a ampliação em degraus até caber, e desloca de novo.
 *
 * Devolve `null` quando não há nada a corrigir ou quando nem no menor zoom o
 * rosto cabe — nesse caso mentir com um "Corrigir" que não corrige é pior do
 * que não oferecer o botão.
 */
export function corrigirEnq(
  caixas: Caixa[],
  enq: Enq,
  proporcaoFoto: number,
  proporcaoCaixa: number,
  margem = MARGEM_SEGURA,
): Partial<Enq> | null {
  if (caixas.length === 0) return null;

  const cabe = (e: Enq) => {
    const alvo = envolver(caixas.map((c) => rostoNoQuadro(c, e, proporcaoFoto, proporcaoCaixa)));
    return alvo ? !diagnosticar(alvo, margem).perto : true;
  };
  if (cabe(enq)) return null;

  /** Deslocamento necessário, convertido para a unidade de `dx`/`dy`. */
  const ajustar = (e: Enq): Enq => {
    const { w: wPct, h: hPct } = medidasPorcento(e, proporcaoFoto, proporcaoCaixa);
    const iw = (wPct / 100) * e.escala;
    const ih = (hPct / 100) * e.escala;

    const alvo = envolver(caixas.map((c) => rostoNoQuadro(c, e, proporcaoFoto, proporcaoCaixa)));
    if (!alvo) return e;
    const d = diagnosticar(alvo, margem);

    // Empurra para dentro pelo lado que estourou. Estourando dos dois lados o
    // rosto é maior que a área segura: o deslocamento não resolve, o zoom sim.
    const moverX = d.folga.esquerda > 0 ? d.folga.esquerda : d.folga.direita > 0 ? -d.folga.direita : 0;
    const moverY = d.folga.topo > 0 ? d.folga.topo : d.folga.base > 0 ? -d.folga.base : 0;

    // `iw`/`ih` estão em fração da caixa, e o deslocamento na tela vale
    // `dx · iw / 2`. Daí a conversão de volta.
    const ddx = iw > 0 ? (2 * moverX) / iw : 0;
    const ddy = ih > 0 ? (2 * moverY) / ih : 0;

    // Não passa da sobra: a foto não pode descolar do quadro.
    const folgaX = iw > 1 ? (iw - 1) / iw : 0;
    const folgaY = ih > 1 ? (ih - 1) / ih : 0;
    return {
      ...e,
      dx: limitar(e.dx + ddx, -folgaX, folgaX),
      dy: limitar(e.dy + ddy, -folgaY, folgaY),
    };
  };

  let tentativa = ajustar(enq);
  if (cabe(tentativa)) return { dx: tentativa.dx, dy: tentativa.dy };

  // Reduz a ampliação em degraus de 5%, até o mínimo do editor.
  for (let escala = enq.escala - 0.05; escala >= 0.5; escala -= 0.05) {
    tentativa = ajustar({ ...enq, escala: Number(escala.toFixed(3)) });
    if (cabe(tentativa)) {
      return { dx: tentativa.dx, dy: tentativa.dy, escala: tentativa.escala };
    }
  }
  return null;
}

/* ---------------------------------------------------------------------------
   Agrupamento por pessoa — DBSCAN sobre os descritores

   Matemática pura, milissegundos, no servidor. Não é IA: é distância
   euclidiana entre vetores de 128 dimensões, o que o próprio face-api
   recomenda. `eps` 0,6 é o limiar clássico do modelo de reconhecimento.
   --------------------------------------------------------------------------- */

export const EPS_PADRAO = 0.6;
export // 1, e não 2, de propósito: quem aparece numa foto só continua sendo uma
// pessoa. Com `minPontos = 2` o DBSCAN classificava como ruído todo convidado
// que apareceu uma única vez — numa galeria de 24 fotos, TODOS os sete rostos
// viraram ruído e nenhum grupo se formou.
const MIN_PONTOS = 1;

export function distancia(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    s += d * d;
  }
  return Math.sqrt(s);
}

/**
 * DBSCAN. Devolve o índice do grupo de cada vetor, ou −1 para ruído.
 *
 * Escolhido em vez de k-médias porque o número de pessoas não se sabe de
 * antemão e há rostos avulsos (o convidado que apareceu em uma foto só) que
 * não devem forçar um grupo.
 */
export function agrupar(
  vetores: number[][],
  eps = EPS_PADRAO,
  minPontos = MIN_PONTOS,
): number[] {
  const n = vetores.length;
  const rotulo = new Array<number>(n).fill(-2); // -2 = não visitado, -1 = ruído
  let grupo = 0;

  const vizinhos = (i: number) => {
    const out: number[] = [];
    for (let j = 0; j < n; j++) {
      if (j !== i && distancia(vetores[i], vetores[j]) <= eps) out.push(j);
    }
    return out;
  };

  for (let i = 0; i < n; i++) {
    if (rotulo[i] !== -2) continue;
    const viz = vizinhos(i);
    if (viz.length + 1 < minPontos) {
      rotulo[i] = -1;
      continue;
    }
    rotulo[i] = grupo;
    const fila = [...viz];
    for (let k = 0; k < fila.length; k++) {
      const j = fila[k];
      if (rotulo[j] === -1) rotulo[j] = grupo; // ruído vira borda do grupo
      if (rotulo[j] !== -2) continue;
      rotulo[j] = grupo;
      const vj = vizinhos(j);
      if (vj.length + 1 >= minPontos) fila.push(...vj.filter((x) => !fila.includes(x)));
    }
    grupo++;
  }
  return rotulo;
}

/** Vetor médio de um grupo — serve de referência para agrupamentos futuros. */
export function centroide(vetores: number[][]): number[] {
  if (vetores.length === 0) return [];
  const soma = new Array<number>(vetores[0].length).fill(0);
  for (const v of vetores) for (let i = 0; i < v.length; i++) soma[i] += v[i];
  return soma.map((s) => s / vetores.length);
}
