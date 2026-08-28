/**
 * Conversões de cor para o seletor de fundo.
 *
 * O painel do design desenha a área de saturação/brilho, a barra de matiz e o
 * campo hex, mas nenhum deles estava ligado a nada. Para ligá-los é preciso ir
 * e voltar entre hex e HSV — é só isso que mora aqui.
 */

const lim = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export type HSV = { h: number; s: number; v: number };

/** `#RGB`, `#RRGGBB` (e `#RRGGBBAA`, cujo alfa é descartado) → HSV. */
export function hexParaHsv(hex: string): HSV {
  const m = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(hex.trim());
  if (!m) return { h: 0, s: 0, v: 100 };
  let c = m[1];
  if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;

  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : (d / max) * 100, v: max * 100 };
}

/** HSV → `#RRGGBB`. */
export function hsvParaHex({ h, s, v }: HSV): string {
  const hh = ((h % 360) + 360) % 360;
  const ss = lim(s, 0, 100) / 100;
  const vv = lim(v, 0, 100) / 100;

  const c = vv * ss;
  const x = c * (1 - Math.abs(((hh / 60) % 2) - 1));
  const m = vv - c;

  const [r, g, b] =
    hh < 60 ? [c, x, 0]
    : hh < 120 ? [x, c, 0]
    : hh < 180 ? [0, c, x]
    : hh < 240 ? [0, x, c]
    : hh < 300 ? [x, 0, c]
    : [c, 0, x];

  const byte = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
  return `#${byte(r)}${byte(g)}${byte(b)}`.toUpperCase();
}

/** Aceita com ou sem `#`, 3 ou 6 dígitos. Devolve `null` se não for cor. */
export function normalizarHex(bruto: string): string | null {
  const t = bruto.trim().replace(/^#/, '');
  if (!/^([0-9a-f]{3}|[0-9a-f]{6})$/i.test(t)) return null;
  const c = t.length === 3 ? t.split('').map((x) => x + x).join('') : t;
  return `#${c.toUpperCase()}`;
}

/**
 * Preto ou branco, o que ler melhor sobre `hex`.
 *
 * Luminância relativa (WCAG). Sem isto, o rótulo do seletor some quando o
 * cliente escolhe um fundo escuro.
 */
export function contrasteSobre(hex: string): '#0B1220' | '#FFFFFF' {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim().replace(/^#/, '#'));
  if (!m) return '#0B1220';
  const c = m[1];
  const canal = (i: number) => {
    const n = parseInt(c.slice(i, i + 2), 16) / 255;
    return n <= 0.03928 ? n / 12.92 : Math.pow((n + 0.055) / 1.055, 2.4);
  };
  const l = 0.2126 * canal(0) + 0.7152 * canal(2) + 0.0722 * canal(4);
  return l > 0.4 ? '#0B1220' : '#FFFFFF';
}
