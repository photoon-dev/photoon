import { createClient } from '@/lib/supabase/server';
import {
  ETAPAS_PRODUCAO,
  PEDIDOS_POR_PAGINA,
  type EstadoPedido,
  type EtapaProducao,
  type ItemDoPedido,
  type LinhaExpedicao,
  type LinhaPagamento,
  type LinhaProducao,
  type PedidoDaLinha,
  type PedidoResumo,
} from '@/lib/pedidos-termos';

/**
 * Leitura de pedidos, produção, expedição e pagamentos (migração 0012).
 *
 * Tudo aqui passa pela sessão do próprio lojista, então a RLS já limita à loja
 * dele; o `.eq('lojista_id', …)` continua explícito porque a mesma conta pode
 * ser membro de mais de uma loja e o painel mostra uma de cada vez.
 *
 * Nenhuma função inventa linha: quando não há dado, a lista volta vazia e a
 * tela explica o que fazer. O painel antigo mostrava faturamento de mentira e
 * isso é pior que uma tela vazia.
 */


/** Rótulos, cores e formatos moram no módulo sem `next/headers`. */
export * from '@/lib/pedidos-termos';

// ---------------------------------------------------------------------------
// Pedidos
// ---------------------------------------------------------------------------

/**
 * PostgREST monta `or=(…)` numa lista separada por vírgula, e `%` é curinga do
 * ilike. Um termo com vírgula ou parêntese quebraria a expressão inteira — o
 * que, além de errar a busca, é injeção de filtro.
 */
const limparBusca = (s: string) => s.replace(/[,()%*\\]/g, ' ').trim();

/** Busca só por número quando o termo é `1042` ou `#1042`. */
const comoNumero = (s: string) => {
  const m = /^#?\s*(\d{1,9})$/.exec(s.trim());
  return m ? Number(m[1]) : null;
};

export type FiltrosPedidos = {
  estado?: string;
  de?: string;
  ate?: string;
  busca?: string;
  pagina?: number;
};

export async function listarPedidos(
  lojistaId: string,
  { estado = '', de = '', ate = '', busca = '', pagina = 0 }: FiltrosPedidos = {},
): Promise<{ pedidos: PedidoResumo[]; total: number; naoVistos: number }> {
  const supabase = await createClient();

  const numero = busca ? comoNumero(busca) : null;
  const texto = busca && numero === null ? limparBusca(busca) : '';

  // Buscar por nome do cliente exige junção interna; sem busca, a junção
  // precisa continuar externa, senão o pedido sem cliente sumiria da lista.
  const selecao =
    'id, numero, estado, canal, total, visto_em, prazo_em, criado_em, ' +
    `clientes${texto ? '!inner' : ''}(id, nome, email)`;

  let q = supabase
    .from('pedidos')
    .select(selecao, { count: 'exact' })
    .eq('lojista_id', lojistaId);

  if (estado) q = q.eq('estado', estado);
  if (de) q = q.gte('criado_em', de);
  // O campo é uma data e a coluna é timestamp: sem o fim do dia, filtrar
  // "até hoje" descartaria tudo o que entrou hoje.
  if (ate) q = q.lte('criado_em', `${ate}T23:59:59.999`);
  if (numero !== null) q = q.eq('numero', numero);
  if (texto) {
    q = q.or(`nome.ilike.%${texto}%,email.ilike.%${texto}%`, { referencedTable: 'clientes' });
  }

  const inicio = pagina * PEDIDOS_POR_PAGINA;
  const [lista, naoVistos] = await Promise.all([
    q.order('criado_em', { ascending: false }).range(inicio, inicio + PEDIDOS_POR_PAGINA - 1),
    supabase
      .from('pedidos')
      .select('id', { count: 'exact', head: true })
      .eq('lojista_id', lojistaId)
      .is('visto_em', null),
  ]);

  return {
    pedidos: (lista.data ?? []) as unknown as PedidoResumo[],
    total: lista.count ?? 0,
    naoVistos: naoVistos.count ?? 0,
  };
}

export type PedidoDetalhado = {
  pedido: PedidoResumo & {
    subtotal: number;
    desconto: number;
    frete: number;
    observacao: string | null;
    motivo_cancelamento: string | null;
    atualizado_em: string;
    vendedores: { id: string; nome: string } | null;
  };
  itens: ItemDoPedido[];
  producao: LinhaProducao[];
  expedicao: LinhaExpedicao[];
  pagamentos: LinhaPagamento[];
};

export async function getPedido(lojistaId: string, id: string): Promise<PedidoDetalhado | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('pedidos')
    .select(
      'id, numero, estado, canal, subtotal, desconto, frete, total, observacao, ' +
        'motivo_cancelamento, visto_em, prazo_em, criado_em, atualizado_em, ' +
        'clientes(id, nome, email), vendedores(id, nome)',
    )
    .eq('lojista_id', lojistaId)
    .eq('id', id)
    .maybeSingle();

  if (!data) return null;

  const [itens, producao, expedicao, pagamentos] = await Promise.all([
    supabase
      .from('pedido_itens')
      .select('id, descricao, quantidade, preco_unit, paginas, fotos, total, projeto_id')
      .eq('pedido_id', id),
    supabase.from('producao').select('*').eq('pedido_id', id).order('atualizado_em', { ascending: false }),
    supabase.from('expedicao').select('*').eq('pedido_id', id).order('atualizado_em', { ascending: false }),
    supabase.from('pagamentos').select('*').eq('pedido_id', id).order('criado_em', { ascending: false }),
  ]);

  return {
    pedido: data as unknown as PedidoDetalhado['pedido'],
    itens: (itens.data ?? []) as unknown as ItemDoPedido[],
    producao: (producao.data ?? []) as unknown as LinhaProducao[],
    expedicao: (expedicao.data ?? []) as unknown as LinhaExpedicao[],
    pagamentos: (pagamentos.data ?? []) as unknown as LinhaPagamento[],
  };
}

// ---------------------------------------------------------------------------
// Produção
// ---------------------------------------------------------------------------

const PEDIDO_EMBUTIDO =
  'pedidos!inner(id, numero, estado, total, prazo_em, criado_em, clientes(id, nome, email))';

export type ItemDaFila = LinhaProducao & { pedidos: PedidoDaLinha };

/**
 * A fila inteira, já separada por etapa — são cinco colunas na tela e uma
 * consulta só: a produção de uma loja é da ordem de dezenas de linhas, não
 * compensa uma ida ao banco por coluna.
 */
export async function filaDeProducao(
  lojistaId: string,
): Promise<Record<EtapaProducao, ItemDaFila[]>> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('producao')
    .select(`id, pedido_id, etapa, responsavel, iniciada_em, concluida_em, observacao, atualizado_em, ${PEDIDO_EMBUTIDO}`)
    .eq('pedidos.lojista_id', lojistaId)
    .order('atualizado_em', { ascending: true });

  const linhas = (data ?? []) as unknown as ItemDaFila[];
  const fila = {} as Record<EtapaProducao, ItemDaFila[]>;
  for (const e of ETAPAS_PRODUCAO) fila[e.id] = [];
  for (const l of linhas) (fila[l.etapa] ?? (fila[l.etapa] = [])).push(l);
  return fila;
}

/**
 * Pedidos pagos ou em produção que ainda não têm ficha de produção. Sem isto a
 * fila nasceria vazia e o lojista não teria por onde começar.
 */
export async function pedidosForaDaFila(lojistaId: string): Promise<PedidoDaLinha[]> {
  const supabase = await createClient();

  const [pedidos, fichas] = await Promise.all([
    supabase
      .from('pedidos')
      .select('id, numero, estado, total, prazo_em, criado_em, clientes(id, nome, email)')
      .eq('lojista_id', lojistaId)
      .in('estado', ['pago', 'em_producao'])
      .order('criado_em', { ascending: true }),
    supabase.from('producao').select('pedido_id, pedidos!inner(lojista_id)').eq('pedidos.lojista_id', lojistaId),
  ]);

  const comFicha = new Set(
    ((fichas.data ?? []) as unknown as { pedido_id: string }[]).map((f) => f.pedido_id),
  );
  return ((pedidos.data ?? []) as unknown as PedidoDaLinha[]).filter((p) => !comFicha.has(p.id));
}

// ---------------------------------------------------------------------------
// Expedição
// ---------------------------------------------------------------------------

export type EnvioDaLista = LinhaExpedicao & { pedidos: PedidoDaLinha };

export async function listarEnvios(
  lojistaId: string,
  estado = '',
): Promise<{ envios: EnvioDaLista[]; porEstado: Record<string, number> }> {
  const supabase = await createClient();

  let q = supabase
    .from('expedicao')
    .select(`id, pedido_id, transportadora, rastreio, estado, endereco, postado_em, entregue_em, atualizado_em, ${PEDIDO_EMBUTIDO}`)
    .eq('pedidos.lojista_id', lojistaId);

  if (estado) q = q.eq('estado', estado);

  const [lista, todos] = await Promise.all([
    q.order('atualizado_em', { ascending: false }),
    // A contagem de cada aba não pode depender do filtro em vigor.
    supabase.from('expedicao').select('estado, pedidos!inner(lojista_id)').eq('pedidos.lojista_id', lojistaId),
  ]);

  const porEstado: Record<string, number> = {};
  for (const l of (todos.data ?? []) as unknown as { estado: string }[]) {
    porEstado[l.estado] = (porEstado[l.estado] ?? 0) + 1;
  }

  return { envios: (lista.data ?? []) as unknown as EnvioDaLista[], porEstado };
}

/**
 * Os itens de vários pedidos de uma vez.
 *
 * A tela de expedição confere os itens do envio em foco, e o foco muda a cada
 * clique. Uma consulta por clique seria uma ida ao banco por gesto; como a
 * lista de envios já está em memória, os itens de todos eles cabem numa
 * consulta só.
 */
export async function itensDosPedidos(pedidoIds: string[]): Promise<Record<string, ItemDoPedido[]>> {
  if (!pedidoIds.length) return {};
  const supabase = await createClient();

  const { data } = await supabase
    .from('pedido_itens')
    .select('id, pedido_id, descricao, quantidade, preco_unit, paginas, fotos, total, projeto_id')
    .in('pedido_id', pedidoIds);

  const porPedido: Record<string, ItemDoPedido[]> = {};
  for (const i of (data ?? []) as unknown as (ItemDoPedido & { pedido_id: string })[]) {
    (porPedido[i.pedido_id] ??= []).push(i);
  }
  return porPedido;
}

/** Pedidos prontos ou enviados sem ficha de expedição: é onde o envio nasce. */
export async function pedidosSemEnvio(lojistaId: string): Promise<PedidoDaLinha[]> {
  const supabase = await createClient();

  const [pedidos, fichas] = await Promise.all([
    supabase
      .from('pedidos')
      .select('id, numero, estado, total, prazo_em, criado_em, clientes(id, nome, email)')
      .eq('lojista_id', lojistaId)
      .in('estado', ['pronto', 'enviado'])
      .order('criado_em', { ascending: true }),
    supabase.from('expedicao').select('pedido_id, pedidos!inner(lojista_id)').eq('pedidos.lojista_id', lojistaId),
  ]);

  const comFicha = new Set(
    ((fichas.data ?? []) as unknown as { pedido_id: string }[]).map((f) => f.pedido_id),
  );
  return ((pedidos.data ?? []) as unknown as PedidoDaLinha[]).filter((p) => !comFicha.has(p.id));
}

// ---------------------------------------------------------------------------
// Pagamentos
// ---------------------------------------------------------------------------

export type PagamentoDaLista = LinhaPagamento & { pedidos: PedidoDaLinha | null };

export type ResumoPagamentos = {
  pagamentos: PagamentoDaLista[];
  /** Quantidade e soma por estado, sobre o período filtrado. */
  porEstado: Record<string, { qtd: number; valor: number }>;
  porMetodo: Record<string, { qtd: number; valor: number }>;
  recebido: number;
};

export async function listarPagamentos(
  lojistaId: string,
  { estado = '', metodo = '', de = '', ate = '' } = {},
): Promise<ResumoPagamentos> {
  const supabase = await createClient();

  const selecao =
    'id, pedido_id, provedor, metodo, estado, valor, id_externo, pago_em, criado_em, ' +
    'pedidos(id, numero, estado, total, prazo_em, criado_em, clientes(id, nome, email))';

  // A coluna é timestamp e o campo do formulário é data: sem o fim do dia,
  // "até hoje" descartaria o que entrou hoje.
  const ateFim = ate ? `${ate}T23:59:59.999` : '';

  let lista = supabase.from('pagamentos').select(selecao).eq('lojista_id', lojistaId);
  if (estado) lista = lista.eq('estado', estado);
  if (metodo) lista = lista.eq('metodo', metodo);
  if (de) lista = lista.gte('criado_em', de);
  if (ateFim) lista = lista.lte('criado_em', ateFim);

  // Os totais varrem o período inteiro, não só o recorte filtrado: o cartão
  // "aprovado" tem de continuar somando quando o lojista olha os recusados.
  let totais = supabase.from('pagamentos').select('estado, metodo, valor').eq('lojista_id', lojistaId);
  if (de) totais = totais.gte('criado_em', de);
  if (ateFim) totais = totais.lte('criado_em', ateFim);

  const [linhas, soma] = await Promise.all([
    lista.order('criado_em', { ascending: false }).limit(300),
    totais,
  ]);

  const porEstado: ResumoPagamentos['porEstado'] = {};
  const porMetodo: ResumoPagamentos['porMetodo'] = {};
  for (const p of (soma.data ?? []) as unknown as { estado: string; metodo: string; valor: number }[]) {
    const valor = Number(p.valor) || 0;
    const e = (porEstado[p.estado] ??= { qtd: 0, valor: 0 });
    e.qtd += 1;
    e.valor += valor;
    const m = (porMetodo[p.metodo] ??= { qtd: 0, valor: 0 });
    m.qtd += 1;
    m.valor += valor;
  }

  return {
    pagamentos: (linhas.data ?? []) as unknown as PagamentoDaLista[],
    porEstado,
    porMetodo,
    recebido: porEstado.aprovado?.valor ?? 0,
  };
}
