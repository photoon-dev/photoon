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
 * Como a foto se acomoda no quadro.
 *
 * `escala` 1 = o mínimo que satisfaz o modo (cobrir ou caber). `dx`/`dy` vão de
 * −1 a 1 e deslocam dentro da sobra, então o enquadramento não depende do
 * tamanho em pixels do quadro na tela — o que faz a conta valer igual na
 * impressão.
 */
export function enquadramentoCss(e: Enq | undefined): string {
  if (!e) return 'background-size:cover;background-position:center;';
  const base = e.modo === 'encaixar' ? 'contain' : 'cover';
  const tamanho =
    e.escala === 1 ? base : `${(e.escala * 100).toFixed(1)}% auto`;
  // −1..1 → 0..100% da sobra
  const px = (((e.dx + 1) / 2) * 100).toFixed(1);
  const py = (((e.dy + 1) / 2) * 100).toFixed(1);
  return (
    `background-size:${tamanho};background-position:${px}% ${py}%;` +
    'background-repeat:no-repeat;' +
    (e.espelho ? 'transform:scaleX(-1);' : '')
  );
}
