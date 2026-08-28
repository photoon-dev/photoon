/**
 * Preço do álbum para o cliente final.
 *
 *   base + (páginas acima do incluído × preço da página extra)
 *        + (fotos acima do incluído  × preço da foto extra)
 *
 * O valor é sempre o da tabela vigente do modelo, por decisão do produto:
 * se o lojista reajustar, álbuns em andamento passam a valer o preço novo.
 */

export type PrecoModelo = {
  preco_base: number | null;
  paginas_incluidas: number;
  fotos_incluidas: number;
  preco_pagina_extra: number;
  preco_foto_extra: number;
};

export type Orcamento = {
  base: number;
  paginasExtras: number;
  valorPaginas: number;
  fotosExtras: number;
  valorFotos: number;
  total: number;
};

export function calcularPreco(
  modelo: PrecoModelo | null | undefined,
  { paginas, fotos }: { paginas: number; fotos: number },
): Orcamento {
  const vazio: Orcamento = {
    base: 0,
    paginasExtras: 0,
    valorPaginas: 0,
    fotosExtras: 0,
    valorFotos: 0,
    total: 0,
  };
  if (!modelo) return vazio;

  const base = Number(modelo.preco_base ?? 0);

  const paginasExtras = Math.max(0, paginas - (modelo.paginas_incluidas ?? 0));
  const valorPaginas = paginasExtras * Number(modelo.preco_pagina_extra ?? 0);

  // fotos_incluidas = 0 significa "sem cobrança por foto", não "todas extras"
  const cobraFoto = Number(modelo.preco_foto_extra ?? 0) > 0;
  const fotosExtras = cobraFoto ? Math.max(0, fotos - (modelo.fotos_incluidas ?? 0)) : 0;
  const valorFotos = fotosExtras * Number(modelo.preco_foto_extra ?? 0);

  return {
    base,
    paginasExtras,
    valorPaginas,
    fotosExtras,
    valorFotos,
    total: base + valorPaginas + valorFotos,
  };
}

export const reais = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/**
 * Quanto a plataforma cobra do lojista numa competência.
 * Mesma forma do nível de cima: fixo mais componentes por unidade.
 */
export function calcularMensalidade(
  plano: { valor_mensal: number; valor_por_projeto: number; valor_por_lamina: number } | null,
  uso: { projetos: number; laminas: number },
) {
  if (!plano) return { fixo: 0, projetos: 0, laminas: 0, total: 0 };

  const fixo = Number(plano.valor_mensal ?? 0);
  const projetos = uso.projetos * Number(plano.valor_por_projeto ?? 0);
  const laminas = uso.laminas * Number(plano.valor_por_lamina ?? 0);

  return { fixo, projetos, laminas, total: fixo + projetos + laminas };
}
