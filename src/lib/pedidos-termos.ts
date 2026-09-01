import type { Tom } from '@/components/ui/tokens';
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

export type EtapaProducao =
  // legados (0012 e anteriores) — preservados sem renomear
  | 'fila' | 'impressao' | 'acabamento' | 'revisao' | 'pronto'
  // do briefing da Fase 9 (alguns já estavam na 0015)
  | 'aguardando' | 'preflight' | 'arquivos_prontos' | 'qualidade' | 'embalagem';
export type EstadoExpedicao =
  // legados (0012 e anteriores) — preservados sem renomear
  | 'aguardando' | 'postado' | 'em_transito' | 'entregue' | 'devolvido'
  // do briefing da Fase 10 (alguns já estavam na 0015)
  | 'aguardando_embalagem' | 'pronto_para_envio' | 'etiqueta_gerada'
  | 'aguardando_coleta' | 'problema_na_entrega' | 'retornado';
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
  // legados
  { id: 'fila', rotulo: 'Na fila', classe: NEUTRO },
  { id: 'impressao', rotulo: 'Impressão', classe: AZUL },
  { id: 'acabamento', rotulo: 'Acabamento', classe: ROXO },
  { id: 'revisao', rotulo: 'Revisão', classe: AMBAR },
  { id: 'pronto', rotulo: 'Pronto', classe: VERDE },
  // Fase 9 (alguns já estavam na 0015, re-listados para clareza)
  { id: 'aguardando', rotulo: 'Aguardando', classe: NEUTRO },
  { id: 'preflight', rotulo: 'Pré-flight', classe: AZUL },
  { id: 'arquivos_prontos', rotulo: 'Arquivos prontos', classe: AZUL },
  { id: 'qualidade', rotulo: 'Qualidade', classe: AMBAR },
  { id: 'embalagem', rotulo: 'Embalagem', classe: ROXO },
];

export const ESTADOS_EXPEDICAO: Termo<EstadoExpedicao>[] = [
  // legados
  { id: 'aguardando', rotulo: 'Aguardando postagem', classe: NEUTRO },
  { id: 'postado', rotulo: 'Postado', classe: AZUL },
  { id: 'em_transito', rotulo: 'Em trânsito', classe: CIANO },
  { id: 'entregue', rotulo: 'Entregue', classe: VERDE },
  { id: 'devolvido', rotulo: 'Devolvido', classe: CORAL },
  // Fase 10
  { id: 'aguardando_embalagem', rotulo: 'Aguardando embalagem', classe: NEUTRO },
  { id: 'pronto_para_envio', rotulo: 'Pronto para envio', classe: CIANO },
  { id: 'etiqueta_gerada', rotulo: 'Etiqueta gerada', classe: AZUL },
  { id: 'aguardando_coleta', rotulo: 'Aguardando coleta', classe: AZUL },
  { id: 'problema_na_entrega', rotulo: 'Problema na entrega', classe: CORAL },
  { id: 'retornado', rotulo: 'Retornado', classe: CORAL },
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

/**
 * O caminho de volta. Existe porque a loja erra: marca "enviado" no pedido
 * errado, adianta um estado sem querer. Voltar um passo é operação normal de
 * balcão, e sem isto o único jeito seria mexer no banco.
 */
export const ESTADO_ANTERIOR: Partial<Record<EstadoPedido, EstadoPedido>> = Object.fromEntries(
  Object.entries(PROXIMO_ESTADO).map(([de, para]) => [para, de as EstadoPedido]),
) as Partial<Record<EstadoPedido, EstadoPedido>>;

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

/**
 * Fuso fixo da loja.
 *
 * Sem isto, `toLocaleString` usa o fuso de quem formata: o container roda em
 * UTC e o navegador do lojista em UTC-3. A mesma data saía com TRÊS HORAS de
 * diferença entre o HTML do servidor e o do cliente — um pedido aberto às 23h
 * aparecia como do dia seguinte na primeira pintura, e o React ainda acusava
 * divergência de hidratação. Fixar o fuso faz os dois lados concordarem e
 * mostra a hora que o operador tem no relógio da bancada.
 */
export const FUSO_DA_LOJA = 'America/Sao_Paulo';

export const dataHora = (v: string | null | undefined) =>
  v
    ? new Date(v).toLocaleString('pt-BR', {
        dateStyle: 'short',
        timeStyle: 'short',
        timeZone: FUSO_DA_LOJA,
      })
    : '—';

export const dataCurta = (v: string | null | undefined) =>
  v ? new Date(v).toLocaleDateString('pt-BR', { timeZone: FUSO_DA_LOJA }) : '—';

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
  quem_recebe?: string;
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

// ---------------------------------------------------------------------------
// Fase 9 — Kanban de Produção
// ---------------------------------------------------------------------------

/**
 * As 8 colunas do Kanban, na ordem do briefing.
 *
 * O banco aceita 10 valores em `producao.etapa` (5 legados + 5 do briefing).
 * A regra de mapeamento é `colunaDoKanban(etapa)` abaixo: legados caem na
 * coluna adjacente (fila→Aguardando, revisao→Qualidade), sem renomear nada.
 */
export type ColunaKanban =
  | 'aguardando'
  | 'preflight'
  | 'arquivos_prontos'
  | 'impressao'
  | 'acabamento'
  | 'qualidade'
  | 'embalagem'
  | 'pronto';

export const COLUNAS_KANBAN: { id: ColunaKanban; rotulo: string; tom: Tom }[] = [
  { id: 'aguardando',       rotulo: 'Aguardando',       tom: 'neutro' },
  { id: 'preflight',        rotulo: 'Pré-flight',       tom: 'azul' },
  { id: 'arquivos_prontos', rotulo: 'Arquivos prontos', tom: 'azul' },
  { id: 'impressao',        rotulo: 'Impressão',        tom: 'azul' },
  { id: 'acabamento',       rotulo: 'Acabamento',       tom: 'indigo' },
  { id: 'qualidade',        rotulo: 'Qualidade',        tom: 'ambar' },
  { id: 'embalagem',        rotulo: 'Embalagem',        tom: 'indigo' },
  { id: 'pronto',           rotulo: 'Pronto',           tom: 'verde' },
];

export function colunaDoKanban(etapa: string | null | undefined): ColunaKanban {
  switch (etapa) {
    case 'fila':         return 'aguardando';  // legado
    case 'revisao':      return 'qualidade';   // legado
    case 'aguardando':   return 'aguardando';
    case 'preflight':    return 'preflight';
    case 'arquivos_prontos': return 'arquivos_prontos';
    case 'impressao':    return 'impressao';
    case 'acabamento':   return 'acabamento';
    case 'qualidade':    return 'qualidade';
    case 'embalagem':    return 'embalagem';
    case 'pronto':       return 'pronto';
    default:             return 'aguardando';
  }
}

export const PROXIMA_ETAPA_KANBAN: Record<ColunaKanban, ColunaKanban> = {
  aguardando: 'preflight',
  preflight: 'arquivos_prontos',
  arquivos_prontos: 'impressao',
  impressao: 'acabamento',
  acabamento: 'qualidade',
  qualidade: 'embalagem',
  embalagem: 'pronto',
  pronto: 'pronto',
};

export const ETAPA_ANTERIOR_KANBAN: Record<ColunaKanban, ColunaKanban> = {
  aguardando: 'aguardando',
  preflight: 'aguardando',
  arquivos_prontos: 'preflight',
  impressao: 'arquivos_prontos',
  acabamento: 'impressao',
  qualidade: 'acabamento',
  embalagem: 'qualidade',
  pronto: 'embalagem',
};

// ---------------------------------------------------------------------------
// Fase 10 — UI da Expedição
// ---------------------------------------------------------------------------

/** As 10 colunas da UI da expedição, na ordem do briefing. */
export type ColunaExpedicao =
  | 'aguardando_embalagem'
  | 'pronto_para_envio'
  | 'etiqueta_gerada'
  | 'aguardando_coleta'
  | 'postado'
  | 'em_transito'
  | 'entregue'
  | 'problema_na_entrega'
  | 'retornado'
  | 'devolvido';

export const COLUNAS_EXPEDICAO: { id: ColunaExpedicao; rotulo: string; tom: Tom }[] = [
  { id: 'aguardando_embalagem', rotulo: 'Aguardando embalagem', tom: 'neutro' },
  { id: 'pronto_para_envio',    rotulo: 'Pronto para envio',    tom: 'ciano' },
  { id: 'etiqueta_gerada',      rotulo: 'Etiqueta gerada',      tom: 'azul' },
  { id: 'aguardando_coleta',    rotulo: 'Aguardando coleta',    tom: 'azul' },
  { id: 'postado',              rotulo: 'Postado',              tom: 'azul' },
  { id: 'em_transito',          rotulo: 'Em trânsito',          tom: 'ciano' },
  { id: 'entregue',             rotulo: 'Entregue',             tom: 'verde' },
  { id: 'problema_na_entrega',  rotulo: 'Problema na entrega',  tom: 'coral' },
  { id: 'retornado',            rotulo: 'Retornado',            tom: 'coral' },
  { id: 'devolvido',            rotulo: 'Devolvido',            tom: 'coral' },
];

export function colunaDaExpedicao(estado: string | null | undefined): ColunaExpedicao {
  switch (estado) {
    case 'aguardando':           return 'aguardando_embalagem';  // legado
    case 'aguardando_embalagem': return 'aguardando_embalagem';
    case 'pronto_para_envio':    return 'pronto_para_envio';
    case 'etiqueta_gerada':      return 'etiqueta_gerada';
    case 'aguardando_coleta':    return 'aguardando_coleta';
    case 'postado':              return 'postado';
    case 'em_transito':          return 'em_transito';
    case 'entregue':             return 'entregue';
    case 'problema_na_entrega':  return 'problema_na_entrega';
    case 'retornado':            return 'retornado';
    case 'devolvido':            return 'devolvido';
    default:                     return 'aguardando_embalagem';
  }
}
