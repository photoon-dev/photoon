import type { Ajustes, Efeito, Enq } from './album';

/**
 * Os efeitos, em filtros CSS.
 *
 * Combinações e não filtros únicos: "sépia" puro do CSS lava a imagem, então
 * vem com uma pitada de contraste e saturação. `sepia(.75)` em vez de 1 mantém
 * algum resquício da cor original, que é o que separa a foto envelhecida da
 * foto pintada de marrom.
 */
const EFEITO_CSS: Record<Efeito, string> = {
  nenhum: '',
  pb: 'grayscale(1) contrast(1.06)',
  sepia: 'sepia(.75) saturate(1.25) contrast(1.05)',
  vintage: 'sepia(.35) saturate(.85) contrast(.92) brightness(1.06)',
  desbotado: 'saturate(.6) contrast(.88) brightness(1.1)',
  quente: 'sepia(.22) saturate(1.2) brightness(1.03)',
  frio: 'hue-rotate(-12deg) saturate(1.1) brightness(1.02)',
};

/**
 * Ajustes de imagem e enquadramento, em CSS.
 *
 * A mesma fórmula precisa valer na impressão (`sharp`), senão o cliente aprova
 * uma coisa e recebe outra. Por isso as contas ficam aqui, isoladas, e não
 * espalhadas no estilo do quadro.
 *
 * Ressalva conhecida: `filter: contrast()` do CSS opera em sRGB não-linear e a
 * saturação usa matriz Rec.601, enquanto `sharp.modulate()` usa HSL. Divergem
 * em cores muito saturadas. O objetivo é tolerância documentada, não igualdade
 * matemática.
 */

/** −100..100 → multiplicador em torno de 1. */
const mult = (v: number, faixa = 0.5) => 1 + (v / 100) * faixa;

export function filtroCss(a: Ajustes | undefined): string {
  if (!a) return '';
  const partes: string[] = [];
  if (a.brilho) partes.push(`brightness(${mult(a.brilho).toFixed(3)})`);
  if (a.contraste) partes.push(`contrast(${mult(a.contraste).toFixed(3)})`);
  if (a.saturacao) partes.push(`saturate(${mult(a.saturacao, 1).toFixed(3)})`);
  // O efeito entra depois das correções: primeiro acerta a foto, depois dá o
  // acabamento. Inverter a ordem faz o brilho lavar o sépia.
  const efeito = EFEITO_CSS[a.efeito];
  if (efeito) partes.push(efeito);
  return partes.length ? `filter:${partes.join(' ')};` : '';
}

/**
 * Estilo do `<img>` dentro do quadro (que tem `overflow:hidden`).
 *
 * A foto é um elemento de verdade, não um `background-image`: só assim `rot` e
 * `espelho` aparecem no render — `background` não gira.
 *
 * **Por que não `object-fit` + `object-position`.** Com `object-fit:cover` a
 * imagem só transborda em UM eixo; no outro ela preenche a caixa exatamente e
 * `object-position` não tem curso nenhum. Arrastar a foto no eixo sem sobra não
 * movia um pixel — mas gravava, entrava no desfazer e disparava a gravação.
 * Ampliar não resolvia: `scale()` amplia o recorte já feito.
 *
 * O modelo aqui é o mesmo que o `sharp` vai precisar na impressão:
 *
 *   - o `<img>` é dimensionado pelo MÍNIMO que satisfaz o modo, com a proporção
 *     natural preservada (`min-width/min-height` para cobrir, `max-*` para
 *     caber). É o "escala = 1";
 *   - `escala` amplia esse mínimo;
 *   - `dx`/`dy` (−1..1) deslocam em fração de MEIA imagem, e valem nos dois
 *     eixos sempre, porque a imagem é um elemento maior que a caixa;
 *   - o deslocamento entra multiplicado por `escala` e ANTES de `rotate`, para
 *     o arrasto seguir o cursor na tela e não no eixo girado da foto.
 */
export function imagemCss(
  e: Enq | undefined,
  a?: Ajustes,
  /** Proporção natural da foto (largura/altura). */
  proporcaoFoto?: number | null,
  /** Proporção do quadro na página (largura/altura). */
  proporcaoCaixa?: number | null,
): string {
  const escala = e?.escala ?? 1;
  const rot = e?.rot ?? 0;
  const dx = e?.dx ?? 0;
  const dy = e?.dy ?? 0;

  // Percentagem do translate resolve contra a caixa da própria imagem; o fator
  // `escala` compensa o `scale()` que vem depois, para o deslocamento na tela
  // ser exatamente `dx · metade da imagem já ampliada`.
  const px = (dx * 50 * escala).toFixed(3);
  const py = (dy * 50 * escala).toFixed(3);

  const transform = [`translate(calc(-50% + ${px}%), calc(-50% + ${py}%))`];
  if (escala !== 1) transform.push(`scale(${escala.toFixed(4)})`);
  if (rot) transform.push(`rotate(${rot}deg)`);
  if (e?.espelho) transform.push('scaleX(-1)');

  const comum =
    // `max-width:none;max-height:none` é obrigatório: o preflight do Tailwind
    // aplica `img { max-width:100%; height:auto }`, que truncava a largura
    // calculada de volta ao tamanho do quadro. A foto era desenhada esmagada e
    // o arrasto horizontal andava um terço do cursor.
    'position:absolute;left:50%;top:50%;max-width:none;max-height:none;' +
    `transform:${transform.join(' ')};` +
    filtroCss(a);

  // Sem as dimensões da foto não dá para dimensionar preservando a proporção.
  // `object-fit` não deforma, então é o refúgio seguro — perde-se só o
  // deslocamento no eixo sem sobra.
  if (!proporcaoFoto || !proporcaoCaixa) {
    const fit = e?.modo === 'encaixar' ? 'contain' : 'cover';
    return `width:100%;height:100%;object-fit:${fit};` + comum;
  }

  const { w, h } = medidasPorcento(e, proporcaoFoto, proporcaoCaixa);
  return `width:${w.toFixed(3)}%;height:${h.toFixed(3)}%;` + comum;
}

/**
 * Tamanho da imagem em % do quadro, preservando a proporção da foto.
 *
 * `min-width:100%` + `min-height:100%` parecia resolver, mas o algoritmo de
 * mínimos do CSS satisfaz as duas restrições ESTICANDO o elemento substituído:
 * uma foto 800×600 era renderizada em 121×250. Aqui as duas medidas saem
 * calculadas, então a proporção é exata por construção.
 */
export function medidasPorcento(
  e: Enq | undefined,
  proporcaoFoto: number,
  proporcaoCaixa: number,
): { w: number; h: number } {
  // Girar 90°/270° troca os eixos: para cobrir DEPOIS de girar, a imagem tem
  // de cobrir uma caixa de proporção invertida.
  const quartos = Math.round(((e?.rot ?? 0) % 360) / 90);
  const trocado = Math.abs(quartos) % 2 === 1;
  const k = proporcaoCaixa || 1;
  const kEfetivo = trocado ? 1 / k : k;

  const razao = proporcaoFoto / kEfetivo;
  const cobrir = e?.modo !== 'encaixar';
  // Fatores no referencial da imagem: quanto ela mede em relação à caixa
  // EFETIVA. Cobrir cresce no eixo folgado; caber encolhe no apertado.
  const fw = cobrir ? Math.max(1, razao) : Math.min(1, razao);
  const fh = cobrir ? Math.max(1, 1 / razao) : Math.min(1, 1 / razao);

  // `width:%` do CSS resolve contra a LARGURA da caixa e `height:%` contra a
  // ALTURA dela. Quando a caixa efetiva está girada, os fatores acima estão no
  // eixo trocado e precisam da razão da caixa para voltar — dividindo na
  // largura e multiplicando na altura. Invertido, a foto saía com proporção
  // 23:1 em vez de 4:3.
  return trocado
    ? { w: (fw * 100) / k, h: fh * 100 * k }
    : { w: fw * 100, h: fh * 100 };
}

/** Moldura da foto, em CSS. Vale também na impressão, pela mesma medida. */
export function bordaCss(b: { px: number; cor: string } | undefined): string {
  if (!b || b.px <= 0) return '';
  // `inset` e não `border`: a borda por fora mudaria o tamanho do quadro e
  // desalinharia a grade do layout.
  return `box-shadow:inset 0 0 0 ${b.px}px ${b.cor};`;
}
