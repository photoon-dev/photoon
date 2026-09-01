/**
 * O menu do painel do lojista: um item, um índice, uma rota.
 *
 * Módulo próprio porque tanto o menu (cliente) quanto a moldura (servidor)
 * precisam disto: reexportar a partir do componente de servidor arrastava
 * `next/headers` para o pacote do navegador e quebrava a compilação.
 *
 * O índice casa com o `pick<n>`/`nav<n>` de `design/extraido/Dashboard.dc.html`,
 * que é o ÚNICO lugar onde o menu é desenhado. Mudou a ordem aqui? Mude lá, e
 * rode `./tools/gerar.sh lojista`.
 *
 * `pronto: false` marca o módulo que já está no menu combinado mas ainda não
 * tem tela. O item aparece esmaecido e não navega — em vez de virar link morto.
 */
export type ItemDoMenu = {
  indice: number;
  rotulo: string;
  rota: string;
  pronto: boolean;
};

export const MENU_LOJISTA: ItemDoMenu[] = [
  { indice: 0,  rotulo: 'Dashboard',          rota: '/',                     pronto: true },
  { indice: 1,  rotulo: 'Pedidos',            rota: '/pedidos',              pronto: true },
  { indice: 2,  rotulo: 'Projetos',           rota: '/projetos',             pronto: true  },
  { indice: 3,  rotulo: 'Produção',           rota: '/producao',             pronto: true },
  { indice: 4,  rotulo: 'Renderização',       rota: '/renderizacao',         pronto: true  },
  { indice: 5,  rotulo: 'Expedição',          rota: '/expedicao',            pronto: true },
  { indice: 6,  rotulo: 'Loja',               rota: '/loja',                 pronto: true },
  { indice: 7,  rotulo: 'Catálogo',           rota: '/catalogo',             pronto: true },
  { indice: 8,  rotulo: 'Preços',             rota: '/precos',               pronto: true },
  { indice: 9,  rotulo: 'Templates e Design', rota: '/templates',            pronto: true },
  { indice: 10, rotulo: 'Cupons',             rota: '/loja/cupons',          pronto: false },
  { indice: 11, rotulo: 'Clientes',           rota: '/clientes',             pronto: true },
  { indice: 12, rotulo: 'Importações',        rota: '/clientes/importacoes', pronto: false },
  { indice: 13, rotulo: 'Financeiro',         rota: '/financeiro',           pronto: true  },
  { indice: 14, rotulo: 'Relatórios',         rota: '/relatorios',           pronto: true },
  { indice: 15, rotulo: 'Integrações',        rota: '/integracoes',          pronto: true },
  { indice: 16, rotulo: 'Configurações',      rota: '/configuracoes',        pronto: true },
];

/** Índice do módulo -> rota, apenas para os módulos que já têm tela. */
export const ROTAS_LOJISTA: Record<number, string> = Object.fromEntries(
  MENU_LOJISTA.filter((m) => m.pronto).map((m) => [m.indice, m.rota]),
);

/** Índice do módulo, pelo rótulo. Evita número mágico espalhado nas páginas. */
export const MODULO = Object.fromEntries(
  MENU_LOJISTA.map((m) => [m.rotulo, m.indice]),
) as Record<string, number>;

/**
 * Rotas que existiam e saíram do menu, e para onde a funcionalidade foi.
 *
 * Regra 17 do briefing: migrar a funcionalidade primeiro, remover a página
 * depois. Enquanto `migrado` for false a página antiga continua respondendo
 * (fora do menu, com um aviso no topo); quando o destino existir, ela vira
 * redirect permanente. Nenhum link antigo — e-mail, favorito, anotação —
 * chega a quebrar.
 */
export type RotaLegada = {
  de: string;
  para: string;
  /** Para onde a funcionalidade foi, em uma frase, para o aviso na tela. */
  destino: string;
  migrado: boolean;
};

export const ROTAS_LEGADAS: RotaLegada[] = [
  { de: '/crm',         para: '/clientes',                destino: 'a ficha de cada cliente',                    migrado: false },
  { de: '/marketing',   para: '/loja/cupons',             destino: 'Loja > Cupons e Configurações > Comunicação', migrado: false },
  { de: '/vendedores',  para: '/configuracoes?aba=equipe', destino: 'Configurações > Equipe',                     migrado: false },
  { de: '/carteira',    para: '/financeiro?aba=recebimentos', destino: 'Financeiro > Carteira',                      migrado: false },
  { de: '/pagamentos',  para: '/financeiro',              destino: 'Financeiro',                                 migrado: false },
  { de: '/auditoria',   para: '/configuracoes?aba=auditoria',  destino: 'Configurações > Segurança > Auditoria',  migrado: false },
  { de: '/suporte',     para: '/ajuda',                   destino: 'o botão Ajuda, no topo da tela',             migrado: true },
];

export const rotaLegada = (caminho: string): RotaLegada | undefined =>
  ROTAS_LEGADAS.find((r) => r.de === caminho);
