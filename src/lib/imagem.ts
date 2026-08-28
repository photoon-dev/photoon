import type { Ajustes, Enq } from './album';

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
  if (a.pb) partes.push('grayscale(1)');
  return partes.length ? `filter:${partes.join(' ')};` : '';
}

/**
 * Estilo do `<img>` dentro do quadro (que tem `overflow:hidden`).
 *
 * A foto é um elemento de verdade, não um `background-image`: só assim `rot` e
 * `espelho` aparecem no render — `background` não gira — e só assim a conta
 * bate com o recorte do `sharp` na impressão, onde a foto também é girada antes
 * de ser encaixada.
 *
 * `escala` 1 = o mínimo que satisfaz o modo (cobrir ou caber). `dx`/`dy` vão de
 * −1 a 1 e deslocam dentro da sobra via `object-position`, então o
 * enquadramento não depende do tamanho em pixels do quadro na tela.
 *
 * Ressalva: com `rot` em 90°/270° e quadro não quadrado, `object-fit:cover`
 * encaixa antes de girar e sobra faixa. O recobrimento exato depende das
 * dimensões da foto — entra com `caixaFonte()` na Fase 4 (impressão).
 */
export function imagemCss(e: Enq | undefined, a?: Ajustes): string {
  const modo = e?.modo === 'encaixar' ? 'contain' : 'cover';
  // −1..1 → 0..100% da sobra
  const px = ((((e?.dx ?? 0) + 1) / 2) * 100).toFixed(1);
  const py = ((((e?.dy ?? 0) + 1) / 2) * 100).toFixed(1);
  const escala = e?.escala ?? 1;
  const rot = e?.rot ?? 0;

  const transform = ['translate(-50%,-50%)'];
  if (escala !== 1) transform.push(`scale(${escala.toFixed(3)})`);
  if (rot) transform.push(`rotate(${rot}deg)`);
  if (e?.espelho) transform.push('scaleX(-1)');

  return (
    'position:absolute;left:50%;top:50%;width:100%;height:100%;' +
    `object-fit:${modo};object-position:${px}% ${py}%;` +
    `transform:${transform.join(' ')};` +
    filtroCss(a)
  );
}
