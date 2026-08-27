import type { CSSProperties } from 'react';

/**
 * Converte uma string CSS ("color:red;font-size:12px") no objeto de estilo do
 * React. Os valores dinâmicos do design vêm nesse formato, vindos do
 * renderVals() original — converter em runtime mantém a fidelidade sem
 * reescrever cada regra à mão.
 */
export function css(texto: string | undefined | null): CSSProperties {
  if (!texto) return {};
  const estilo: Record<string, string> = {};

  for (const decl of texto.split(/;(?![^(]*\))/)) {
    const corte = decl.indexOf(':');
    if (corte < 0) continue;
    const prop = decl.slice(0, corte).trim();
    const valor = decl.slice(corte + 1).trim();
    if (!prop || !valor) continue;

    const chave = prop.startsWith('--')
      ? prop
      : prop.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());
    estilo[chave] = valor;
  }

  return estilo as CSSProperties;
}
