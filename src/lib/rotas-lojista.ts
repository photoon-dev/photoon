/**
 * Índice de cada módulo no menu lateral do lojista e a rota correspondente.
 *
 * Módulo próprio porque tanto o menu (cliente) quanto a moldura (servidor)
 * precisam disto: reexportar a partir do componente de servidor arrastava
 * `next/headers` para o pacote do navegador e quebrava a compilação.
 */
export const ROTAS_LOJISTA: Record<number, string> = {
  0: '/',
  8: '/clientes',
  19: '/configuracoes',
  7: '/templates',
};
