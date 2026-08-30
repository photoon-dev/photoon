/**
 * O vocabulário de pedidos, produção, expedição e pagamentos.
 *
 * Vive num módulo à parte de `pedidos.ts` porque as telas do lojista são
 * componentes de navegador e precisam dos mesmos rótulos, cores e formatos.
 * `pedidos.ts` importa `next/headers` pelo client do Supabase, e importar
 * qualquer coisa de lá arrastava isso para o pacote do navegador — a
 * compilação quebra. Aqui não há consulta nenhuma, só nomes e formas.
 *
 * `pedidos.ts` reexporta tudo isto, então quem já importava de lá continua
 * funcionando.
 */

// ---------------------------------------------------------------------------
// Vocabulário — os mesmos valores gravados nas colunas `estado` / `etapa`
// ---------------------------------------------------------------------------

export type EstadoPedido =
  | 'rascunho'
  | 'aguardando_pagamento'
  | 'pago'
  | 'em_producao'
  | 'pronto'
  | 'enviado'
  | 'entregue'
  | 'cancelado';

export type EtapaProducao = 'fila' | 'impressao' | 'acabamento' | 'revisao' | 'pronto';
export type EstadoExpedicao = 'aguardando' | 'postado' | 'em_transito' | 'entregue' | 'devolvido';
export type EstadoPagamento = 'pendente' | 'aprovado' | 'recusado' | 'estornado' | 'expirado';

/** Rótulo e cor de cada valor. `classe` é o par fundo/texto do selo. */
type Termo<T extends string> = { id: T; rotulo: string; classe: string };

const NEUTRO = 'bg-line-2 text-ink-3';
const AZUL = 'bg-blue-surface text-blue';
const CIANO = 'bg-cyan-surface text-[#0E7490]';
const VERDE = 'bg-green-surface text-[#047857]';
const AMBAR = 'bg-amber-surface text-[#B45309]';
const CORAL = 'bg-coral-surface text-coral';
const ROXO = 'bg-indigo-surface text-[#5B21B6]';

export const ESTADOS_PEDIDO: Termo<EstadoPedido>[] = [
  { id: 'rascunho', rotulo: 'Rascunho', classe: NEUTRO },
  { id: 'aguardando_pagamento', rotulo: 'Aguardando pagamento', classe: AMBAR },
  { id: 'pago', rotulo: 'Pago', classe: VERDE },
  { id: 'em_producao', rotulo: 'Em produção', classe: AZUL },
  { id: 'pronto', rotulo: 'Pronto', classe: CIANO },
  { id: 'enviado', rotulo: 'Enviado', classe: ROXO },
  { id: 'entregue', rotulo: 'Entregue', classe: VERDE },
  { id: 'cancelado', rotulo: 'Cancelado', classe: CORAL },
];

export const ETAPAS_PRODUCAO: Termo<EtapaProducao>[] = [
  { id: 'fila', rotulo: 'Na fila', classe: NEUTRO },
  { id: 'impressao', rotulo: 'Impressão', classe: AZUL },
  { id: 'acabamento', rotulo: 'Acabamento', classe: ROXO },
  { id: 'revisao', rotulo: 'Revisão', classe: AMBAR },
  { id: 'pronto', rotulo: 'Pronto', classe: VERDE },
];

export const ESTADOS_EXPEDICAO: Termo<EstadoExpedicao>[] = [
  { id: 'aguardando', rotulo: 'Aguardando postagem', classe: NEUTRO },
  { id: 'postado', rotulo: 'Postado', classe: AZUL },
  { id: 'em_transito', rotulo: 'Em trânsito', classe: CIANO },
  { id: 'entregue', rotulo: 'Entregue', classe: VERDE },
  { id: 'devolvido', rotulo: 'Devolvido', classe: CORAL },
];

/**
 * `expirado` não estava no pedido da tela, mas está no banco: um pix que vence
 * grava esse estado. Omiti-lo esconderia pagamento real do lojista.
 */
export const ESTADOS_PAGAMENTO: Termo<EstadoPagamento>[] = [
  { id: 'pendente', rotulo: 'Pendente', classe: AMBAR },
  { id: 'aprovado', rotulo: 'Aprovado', classe: VERDE },
  { id: 'recusado', rotulo: 'Recusado', classe: CORAL },
  { id: 'estornado', rotulo: 'Estornado', classe: ROXO },
  { id: 'expirado', rotulo: 'Expirado', classe: NEUTRO },
];

export const METODOS_PAGAMENTO: Termo<string>[] = [
  { id: 'pix', rotulo: 'Pix', classe: CIANO },
  { id: 'cartao', rotulo: 'Cartão', classe: AZUL },
  { id: 'boleto', rotulo: 'Boleto', classe: NEUTRO },
  { id: 'manual', rotulo: 'Manual', classe: NEUTRO },
];

/**
 * O caminho normal do pedido. Serve ao botão "avançar": o lojista não precisa
 * escolher o próximo estado numa lista, o fluxo já diz qual é.
 */
export const PROXIMO_ESTADO: Partial<Record<EstadoPedido, EstadoPedido>> = {
  rascunho: 'aguardando_pagamento',
  aguardando_pagamento: 'pago',
  pago: 'em_producao',
  em_producao: 'pronto',
  pronto: 'enviado',
  enviado: 'entregue',
};

export const PROXIMA_ETAPA: Partial<Record<EtapaProducao, EtapaProducao>> = {
  fila: 'impressao',
  impressao: 'acabamento',
  acabamento: 'revisao',
  revisao: 'pronto',
};

export function termo<T extends string>(lista: Termo<T>[], id: string | null | undefined) {
  return lista.find((t) => t.id === id) ?? { id: (id ?? '') as T, rotulo: id ?? '—', classe: NEUTRO };
}

export const moeda = (v: number | null | undefined) =>
  (v ?? 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const dataHora = (v: string | null | undefined) =>
  v ? new Date(v).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : '—';

export const dataCurta = (v: string | null | undefined) =>
  v ? new Date(v).toLocaleDateString('pt-BR') : '—';

// ---------------------------------------------------------------------------
// Formas
// ---------------------------------------------------------------------------

export type ClienteDoPedido = { id: string; nome: string | null; email: string | null } | null;

export type PedidoResumo = {
  id: string;
  numero: number;
  estado: EstadoPedido;
  canal: string;
  total: number;
  visto_em: string | null;
  prazo_em: string | null;
  criado_em: string;
  clientes: ClienteDoPedido;
};

export type ItemDoPedido = {
  id: string;
  descricao: string;
  quantidade: number;
  preco_unit: number;
  paginas: number;
  fotos: number;
  total: number;
  projeto_id: string | null;
};

export type LinhaProducao = {
  id: string;
  pedido_id: string;
  etapa: EtapaProducao;
  responsavel: string | null;
  iniciada_em: string | null;
  concluida_em: string | null;
  observacao: string | null;
  atualizado_em: string;
};

/** O endereço é `jsonb`: o que o seed grava e o que a etiqueta lê. */
export type EnderecoEnvio = {
  rua?: string;
  numero?: string | number;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  cep?: string;
};

export type LinhaExpedicao = {
  id: string;
  pedido_id: string;
  transportadora: string | null;
  rastreio: string | null;
  estado: EstadoExpedicao;
  endereco: EnderecoEnvio | null;
  postado_em: string | null;
  entregue_em: string | null;
  atualizado_em: string;
};

export type LinhaPagamento = {
  id: string;
  pedido_id: string;
  provedor: string | null;
  metodo: string;
  estado: EstadoPagamento;
  valor: number;
  id_externo: string | null;
  pago_em: string | null;
  criado_em: string;
};

/** Pedido reduzido, para as telas que giram em torno de outra tabela. */
export type PedidoDaLinha = {
  id: string;
  numero: number;
  estado: EstadoPedido;
  total: number;
  prazo_em: string | null;
  criado_em: string;
  clientes: ClienteDoPedido;
};

export const PEDIDOS_POR_PAGINA = 25;

