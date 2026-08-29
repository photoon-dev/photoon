/**
 * Índice de cada módulo no menu lateral do lojista e a rota correspondente.
 *
 * Módulo próprio porque tanto o menu (cliente) quanto a moldura (servidor)
 * precisam disto: reexportar a partir do componente de servidor arrastava
 * `next/headers` para o pacote do navegador e quebrava a compilação.
 */
export const ROTAS_LOJISTA: Record<number, string> = {
  0: '/',
  1: '/pedidos',
  2: '/producao',
  3: '/expedicao',
  4: '/loja',
  5: '/catalogo',
  6: '/precos',
  7: '/templates',
  8: '/clientes',
  9: '/crm',
  10: '/vendedores',
  11: '/marketing',
  12: '/pagamentos',
  13: '/carteira',
  14: '/relatorios',
  16: '/integracoes',
  17: '/auditoria',
  18: '/suporte',
  19: '/configuracoes',
};
