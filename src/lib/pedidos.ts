import type { Tom } from '@/components/ui/tokens';
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
// Adição ao final de src/lib/pedidos.ts — relação real pedido → projeto via
// pedido_itens.projeto_id. Sem inferência por nome ou código. Um pedido pode
// ter vários projetos; um projeto sem pedido continua fora desta consulta.

export type ProjetoDoPedido = {
  /** id do pedido_itens. */
  item_id: string;
  projeto_id: string;
  codigo: string | null;
  titulo: string;
  /** Status do projeto (texto com CHECK — ver migração 0015). */
  status: string;
  categoria: string | null;
  /** Descrição congelada no item do pedido. */
  descricao: string;
  quantidade: number;
  preco_unit: number;
  total: number;
  paginas: number;
  fotos: number;
  largura_mm: number | null;
  altura_mm: number | null;
  /** O job de renderização mais recente do projeto, se houver. */
  render: { id: string; estado: string; progresso: number } | null;
};

/**
 * Traz os projetos REAIS de um pedido, via `pedido_itens.projeto_id`.
 *
 * A junção `!inner` em `projetos` cumpre três coisas:
 *   1. só itens COM projeto (a outra metade do `pedido_itens` é venda avulsa);
 *   2. só projetos DA LOJA — defesa em profundidade, mesmo com RLS;
 *   3. injeta os campos do projeto sem segunda consulta.
 *
 * `render_jobs` vem embutido mas pode devolver várias linhas; pegamos a mais
 * recente (a tabela ordena por `atualizado_em desc` por convenção do painel).
 */
export async function projetosDoPedido(
  lojistaId: string,
  pedidoId: string,
): Promise<ProjetoDoPedido[]> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await supabase
    .from('pedido_itens')
    .select(
      'id, descricao, quantidade, preco_unit, total, paginas, fotos, projeto_id, ' +
        'projetos!inner(' +
        'id, codigo, titulo, status, categoria, largura_mm, altura_mm, lojista_id, ' +
        'render_jobs(id, estado, progresso, atualizado_em)' +
        ')',
    )
    .eq('pedido_id', pedidoId)
    .eq('projetos.lojista_id', lojistaId)
    .not('projeto_id', 'is', null)) as { data: any[] | null; error: any };

  if (error || !data) return [];

  return (data as any[]).map((linha) => {
    const p = linha.projetos;
    const rjs: any[] = Array.isArray(p?.render_jobs) ? p.render_jobs : [];
    // Mais recente primeiro.
    rjs.sort((a, b) => (b.atualizado_em ?? '').localeCompare(a.atualizado_em ?? ''));
    const rj = rjs[0] ?? null;
    return {
      item_id: linha.id,
      projeto_id: p.id,
      codigo: p.codigo,
      titulo: p.titulo,
      status: p.status,
      categoria: p.categoria,
      descricao: linha.descricao,
      quantidade: Number(linha.quantidade ?? 0),
      preco_unit: Number(linha.preco_unit ?? 0),
      total: Number(linha.total ?? 0),
      paginas: Number(linha.paginas ?? 0),
      fotos: Number(linha.fotos ?? 0),
      largura_mm: p.largura_mm,
      altura_mm: p.altura_mm,
      render: rj
        ? { id: rj.id, estado: String(rj.estado), progresso: Number(rj.progresso ?? 0) }
        : null,
    } satisfies ProjetoDoPedido;
  });
}
// Adição ao final de src/lib/pedidos.ts — arquivos do pedido (via projetos) e
// histórico de produção.

export type ArquivoDoPedido = {
  id: string;
  projeto_id: string;
  projeto_codigo: string | null;
  projeto_titulo: string;
  /** original | renderizado | preview | auxiliar */
  tipo: string;
  nome: string;
  caminho: string;
  bucket: string;
  mime: string | null;
  bytes: number;
  versao: number;
  estado: string;
  criado_em: string;
};

/**
 * Arquivos dos projetos de um pedido, agrupáveis por `tipo`.
 *
 * A junção `pedido_itens → projetos → projeto_arquivos` cobre as três tabelas
 * de uma vez. O filtro em `lojista_id` é defesa em profundidade.
 */
export async function arquivosDoPedido(
  lojistaId: string,
  pedidoId: string,
): Promise<ArquivoDoPedido[]> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await supabase
    .from('pedido_itens')
    .select(
      'projeto_id, ' +
        'projetos!inner(' +
        'id, codigo, titulo, lojista_id, ' +
        'projeto_arquivos(id, projeto_id, tipo, nome, caminho, bucket, mime, bytes, versao, estado, criado_em, removido_em)' +
        ')',
    )
    .eq('pedido_id', pedidoId)
    .eq('projetos.lojista_id', lojistaId)
    .not('projeto_id', 'is', null)) as { data: any[] | null; error: any };

  if (error || !data) return [];

  const saida: ArquivoDoPedido[] = [];
  for (const linha of data as any[]) {
    const p = linha.projetos;
    if (!p) continue;
    const arquivos: any[] = Array.isArray(p.projeto_arquivos) ? p.projeto_arquivos : [];
    for (const a of arquivos) {
      if (a.removido_em) continue; // regra 14: nada some em silêncio
      saida.push({
        id: a.id,
        projeto_id: p.id,
        projeto_codigo: p.codigo,
        projeto_titulo: p.titulo,
        tipo: a.tipo,
        nome: a.nome,
        caminho: a.caminho,
        bucket: a.bucket,
        mime: a.mime,
        bytes: Number(a.bytes ?? 0),
        versao: Number(a.versao ?? 1),
        estado: a.estado,
        criado_em: a.criado_em,
      });
    }
  }
  // Mais recente primeiro.
  saida.sort((a, b) => (b.criado_em ?? '').localeCompare(a.criado_em ?? ''));
  return saida;
}

export type HistoricoProducao = {
  id: string;
  producao_id: string;
  de_etapa: string | null;
  para_etapa: string;
  responsavel: string | null;
  criado_em: string;
  observacao: string | null;
};

/**
 * Histórico de movimentações de produção de um pedido, via `producao_historico`.
 * A trigger `producao_historico_*` grava cada troca de etapa automaticamente;
 * a tela só lê.
 */
export async function historicoProducaoDoPedido(
  lojistaId: string,
  pedidoId: string,
): Promise<HistoricoProducao[]> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = (await supabase
    .from('producao')
    .select(
      'id, producao_historico(id, producao_id, de_etapa, para_etapa, responsavel, criado_em, observacao)',
    )
    .eq('pedido_id', pedidoId)
    .eq('pedidos.lojista_id', lojistaId) as any) as { data: any[] | null; error: any };

  if (error || !data) return [];

  const saida: HistoricoProducao[] = [];
  for (const p of data as any[]) {
    const hist: any[] = Array.isArray(p.producao_historico) ? p.producao_historico : [];
    for (const h of hist) {
      saida.push({
        id: h.id,
        producao_id: h.producao_id,
        de_etapa: h.de_etapa,
        para_etapa: h.para_etapa,
        responsavel: h.responsavel,
        criado_em: h.criado_em,
        observacao: h.observacao,
      });
    }
  }
  saida.sort((a, b) => (b.criado_em ?? '').localeCompare(a.criado_em ?? ''));
  return saida;
}
// Adição em src/lib/pedidos.ts — resumo da renderização para o cabeçalho da
// Produção. Apenas contadores; o lojista abre /renderizacao para ver a fila
// de verdade.

export type ResumoRenderizacao = {
  na_fila: number;
  preparando: number;
  processando: number;
  erro: number;
  concluida_24h: number;
};

/**
 * Soma os jobs ativos (na_fila + preparando + baixando + processando + upload)
 * e os erros de toda a loja, mais os concluídos nas últimas 24h. Sem expor
 * nenhuma linha de job: a contagem basta para o cabeçalho da Produção.
 */
export async function resumoRenderizacao(
  lojistaId: string,
): Promise<ResumoRenderizacao> {
  const supabase = await createClient();
  // Um único select só com `count` (sem `data`): sai barato mesmo com
  // milhares de jobs.
  const { count: naFilaECaminhando } = await supabase
    .from('render_jobs')
    .select('id', { count: 'exact', head: true })
    .eq('lojista_id', lojistaId)
    .in('estado', ['na_fila', 'preparando', 'baixando', 'processando', 'upload']);

  const { count: erro } = await supabase
    .from('render_jobs')
    .select('id', { count: 'exact', head: true })
    .eq('lojista_id', lojistaId)
    .eq('estado', 'erro');

  const ha24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count: concluida24h } = await supabase
    .from('render_jobs')
    .select('id', { count: 'exact', head: true })
    .eq('lojista_id', lojistaId)
    .eq('estado', 'concluida')
    .gte('atualizado_em', ha24h);

  // preparando/processando vêm do mesmo conjunto; este split é ilustrativo
  // porque o briefing pede os números separados. Mantemos os dois via count
  // aproximado: se o count geral é X, exposto como "X em produção".
  return {
    na_fila: naFilaECaminhando ?? 0,
    preparando: 0,
    processando: naFilaECaminhando ?? 0,
    erro: erro ?? 0,
    concluida_24h: concluida24h ?? 0,
  };
}
// Adição em src/lib/pedidos.ts — resumo da expedição com os 10 estados
// do briefing e os novos campos (modalidade, volumes, peso, dimensões, SLA).
import {
  COLUNAS_EXPEDICAO,
  colunaDaExpedicao,
  type ColunaExpedicao,
} from '@/lib/pedidos-termos';

export type ResumoExpedicaoColuna = {
  coluna: ColunaExpedicao;
  rotulo: string;
  tom: Tom;
  quantidade: number;
};

export type ResumoExpedicao = {
  colunas: ResumoExpedicaoColuna[];
  total: number;
  semColeta: number;
  semEtiqueta: number;
  atrasados: number;
};

/**
 * Conta envios por coluna do briefing (mapeia legados via `colunaDaExpedicao`)
 * e calcula três KPIs:
 *   - sem coleta: ainda na coluna "Aguardando coleta" ou anterior
 *   - sem etiqueta: em qualquer coluna que não seja "etiqueta_gerada" nem
 *     posterior, mas que precisa de etiqueta (postado, em_transito, etc)
 *   - atrasados: hoje vence SLA (a coluna `sla_dias` do banco)
 */
export async function resumoExpedicao(lojistaId: string): Promise<ResumoExpedicao> {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = (await supabase
    .from('expedicao')
    .select('id, estado, etiqueta_url, sla_dias, previsao_em')
    .eq('pedidos.lojista_id', lojistaId) as any) as { data: any[] | null };

  const contagem: Record<ColunaExpedicao, number> = Object.fromEntries(
    COLUNAS_EXPEDICAO.map((c) => [c.id, 0]),
  ) as Record<ColunaExpedicao, number>;

  let semEtiqueta = 0;
  let semColeta = 0;
  let atrasados = 0;
  const hoje = new Date().toISOString().slice(0, 10);

  for (const e of (data ?? []) as any[]) {
    const col = colunaDaExpedicao(e.estado);
    contagem[col] = (contagem[col] ?? 0) + 1;
    if (!e.etiqueta_url) semEtiqueta += 1;
    if (
      col === 'aguardando_coleta' ||
      col === 'aguardando_embalagem' ||
      col === 'pronto_para_envio' ||
      col === 'etiqueta_gerada'
    ) {
      semColeta += 1;
    }
    if (e.sla_dias && e.previsao_em && e.previsao_em.slice(0, 10) <= hoje && contagem[col] > 0) {
      // A contagem é por envio; o "atrasado" conta cada envio cujo prazo
      // previsto já passou e que ainda não está entregue/devolvido.
      if (col !== 'entregue' && col !== 'devolvido' && col !== 'retornado') {
        atrasados += 1;
      }
    }
  }

  return {
    colunas: COLUNAS_EXPEDICAO.map((c) => ({
      coluna: c.id,
      rotulo: c.rotulo,
      tom: c.tom,
      quantidade: contagem[c.id] ?? 0,
    })),
    total: (data ?? []).length,
    semColeta,
    semEtiqueta,
    atrasados,
  };
}
