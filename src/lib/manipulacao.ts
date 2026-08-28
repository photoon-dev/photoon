import type { Enq } from './album';
import { medidasPorcento } from './imagem';

/**
 * Contas dos gestos de arrasto no palco (mover, girar, ampliar a foto).
 *
 * Puras e isoladas do React: recebem o estado capturado no início do gesto e a
 * posição atual do ponteiro, devolvem o pedaço de `enq` que muda. O editor só
 * cola isto em `doc.mudarEnq()`.
 */

const limitar = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/* --------------------------------------------------------------------------
   Faixas — uma só por grandeza.

   Os sliders novos limitavam a [-180,180] e [50,400] enquanto o campo numérico
   ia a ±360 e 2000%. O inspetor mostrava "800%" com o botão encostado no fim da
   trilha, e o primeiro arrasto derrubava a escala para 400% sem aviso.
   -------------------------------------------------------------------------- */

export const ROT_MIN = -180;
export const ROT_MAX = 180;
export const ESCALA_MIN = 0.5;
export const ESCALA_MAX = 4;

export const limitarRot = (g: number) => limitar(g, ROT_MIN, ROT_MAX);
export const limitarEscala = (s: number) => limitar(s, ESCALA_MIN, ESCALA_MAX);

/** Normaliza um ângulo para (−180, 180], para o slider nunca travar no fim. */
export function normalizarRot(g: number): number {
  let r = ((g + 180) % 360 + 360) % 360 - 180;
  if (r <= -180) r += 360;
  return r;
}

/** Fotografia do momento em que o ponteiro desceu sobre uma alça. */
export type GestoInicio = {
  /** Ponteiro na tela, em px. */
  x: number;
  y: number;
  /** Centro do quadro selecionado na tela, em px. */
  cx: number;
  cy: number;
  /** Tamanho do quadro na tela, em px. */
  larguraBox: number;
  alturaBox: number;
  /** Proporção natural da foto (largura/altura); 1 quando desconhecida. */
  proporcao: number;
  /** Enquadramento no instante do clique — a conta é sempre relativa a ele. */
  enq: Enq;
};

/**
 * Tamanho da imagem na tela, em px, com o MESMO modelo do `imagemCss`.
 *
 * Devolve duas medidas porque elas divergem quando a foto está girada:
 *
 *   - `unidade`: o tamanho antes do `rotate`. É contra ele que a percentagem
 *     do `translate` do CSS resolve, então é o que converte pixel de cursor
 *     em `dx`/`dy`;
 *   - `pegada`: o retângulo que a imagem ocupa na tela depois de girar. É o
 *     que decide quanta sobra existe para deslocar sem abrir faixa branca.
 */
export function tamanhoImagem(
  larguraBox: number,
  alturaBox: number,
  proporcao: number,
  enq: Enq,
): { unidade: { w: number; h: number }; pegada: { w: number; h: number } } {
  const arCaixa = larguraBox / (alturaBox || 1);
  const { w, h } = medidasPorcento(enq, proporcao > 0 ? proporcao : 1, arCaixa);
  const pw = (w / 100) * larguraBox * enq.escala;
  const ph = (h / 100) * alturaBox * enq.escala;

  const quartos = Math.round(((enq.rot ?? 0) % 360) / 90);
  const trocado = Math.abs(quartos) % 2 === 1;
  return {
    unidade: { w: pw, h: ph },
    pegada: trocado ? { w: ph, h: pw } : { w: pw, h: ph },
  };
}

/**
 * Arrastar o meio da foto: desloca o recorte, acompanhando o cursor.
 *
 * `dx`/`dy` são fração de MEIA imagem, então converter o deslocamento do
 * ponteiro exige o tamanho da imagem — não o do quadro. Com o tamanho do quadro
 * o arrasto ficava 1,78× mais rápido que o cursor numa paisagem em quadro
 * retrato, e ~0,1× numa foto quase quadrada.
 *
 * No modo `preencher` o deslocamento trava onde a foto deixaria de cobrir o
 * quadro: nunca aparece faixa branca. No `encaixar` a foto flutua livre.
 */
export function moverEnq(ini: GestoInicio, x: number, y: number): Partial<Enq> {
  const { unidade, pegada } = tamanhoImagem(
    ini.larguraBox,
    ini.alturaBox,
    ini.proporcao,
    ini.enq,
  );
  const dx = ini.enq.dx + (2 * (x - ini.x)) / (unidade.w || 1);
  const dy = ini.enq.dy + (2 * (y - ini.y)) / (unidade.h || 1);

  if (ini.enq.modo === 'encaixar') {
    return { dx: limitar(dx, -1, 1), dy: limitar(dy, -1, 1) };
  }
  // Sobra disponível na tela, convertida para a unidade do `dx` (meia imagem
  // antes de girar).
  const folga = (pegadaLado: number, box: number, uni: number) =>
    pegadaLado > box && uni > 0 ? (pegadaLado - box) / uni : 0;
  const folgaX = folga(pegada.w, ini.larguraBox, unidade.w);
  const folgaY = folga(pegada.h, ini.alturaBox, unidade.h);
  return {
    dx: limitar(dx, -folgaX, folgaX),
    dy: limitar(dy, -folgaY, folgaY),
  };
}

/**
 * Arrastar um canto: amplia/reduz pela razão entre a distância do ponteiro ao
 * centro agora e no início. É o gesto que todo editor tem nos cantos.
 */
export function escalarEnq(ini: GestoInicio, x: number, y: number): Partial<Enq> {
  const r0 = Math.hypot(ini.x - ini.cx, ini.y - ini.cy) || 1;
  const r1 = Math.hypot(x - ini.cx, y - ini.cy);
  return { escala: Number(limitarEscala(ini.enq.escala * (r1 / r0)).toFixed(4)) };
}

/**
 * Girar em torno do centro, pelo ângulo que o ponteiro varreu.
 * `passo` (Shift) trava de 15 em 15 graus.
 */
export function girarEnq(ini: GestoInicio, x: number, y: number, passo = false): Partial<Enq> {
  const a0 = Math.atan2(ini.y - ini.cy, ini.x - ini.cx);
  const a1 = Math.atan2(y - ini.cy, x - ini.cx);
  let g = ini.enq.rot + ((a1 - a0) * 180) / Math.PI;
  if (passo) g = Math.round(g / 15) * 15;
  // Normaliza antes de limitar: sem isso um giro que passa de 180° travava no
  // fim da faixa em vez de dar a volta.
  return { rot: Math.round(normalizarRot(g)) };
}

/** Roda do mouse sobre a foto selecionada: amplia ou reduz o recorte. */
export function zoomEnq(enq: Enq, deltaY: number): Partial<Enq> {
  const fator = deltaY < 0 ? 1.08 : 1 / 1.08;
  return { escala: Number(limitarEscala(enq.escala * fator).toFixed(4)) };
}

/** Valor do campo/slider de zoom (em %) para `escala`. */
export function zoomParaEscala(pct: number): Partial<Enq> {
  return { escala: limitarEscala(pct / 100) };
}
