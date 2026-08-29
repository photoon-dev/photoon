import 'server-only';
import { createClient } from '@/lib/supabase/server';
import { decifrar, temChaveDeCifragem, ultimos4 } from '@/lib/cripto';

/**
 * Leituras das telas de sistema e financeiro do lojista: Carteira, Relatórios,
 * Integrações, Auditoria e Suporte.
 *
 * Tudo aqui sai do banco com a sessão do próprio lojista — a RLS de 0012 é o
 * que garante o isolamento por loja. Nenhuma função inventa valor: quando não
 * há linha, o retorno é zero/vazio e a tela explica o que fazer, porque o
 * dashboard antigo já mostrava R$ 184 mil que não eram de ninguém.
 */

// ---------------------------------------------------------------------------
// Período
// ---------------------------------------------------------------------------

export type Periodo = {
  /** Começo do intervalo, inclusive (ISO). */
  de: string;
  /** Fim do intervalo, inclusive (ISO). */
  ate: string;
  /** O que veio na URL, para a tela remarcar o botão certo. */
  dias: number | null;
  deISO: string;
  ateISO: string;
};

/**
 * Resolve o período pedido na URL.
 *
 * Aceita atalho (`dias=7|30|90`) ou intervalo (`de`/`ate` em AAAA-MM-DD). Os
 * limites são fixados em UTC de propósito: o servidor pode rodar em qualquer
 * fuso, e um relatório que muda de valor conforme a máquina é pior que um
 * relatório deslocado em três horas — este ao menos é reprodutível.
 */
export function resolverPeriodo({
  dias,
  de,
  ate,
}: { dias?: string; de?: string; ate?: string } = {}): Periodo {
  const dataValida = (s?: string) => (s && /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null);
  const d1 = dataValida(de);
  const d2 = dataValida(ate);

  if (d1 && d2 && d1 <= d2) {
    return { de: d1, ate: d2, dias: null, deISO: `${d1}T00:00:00.000Z`, ateISO: `${d2}T23:59:59.999Z` };
  }

  const n = [7, 30, 90].includes(Number(dias)) ? Number(dias) : 30;
  const fim = new Date();
  const inicio = new Date(fim.getTime() - (n - 1) * 24 * 60 * 60 * 1000);
  const dia = (d: Date) => d.toISOString().slice(0, 10);
  return {
    de: dia(inicio),
    ate: dia(fim),
    dias: n,
    deISO: `${dia(inicio)}T00:00:00.000Z`,
    ateISO: `${dia(fim)}T23:59:59.999Z`,
  };
}

/** Teto de linhas lidas por consulta. Acima disso a tela avisa que o recorte foi truncado. */
const TETO = 2000;

const num = (v: unknown) => Number(v ?? 0);

// ---------------------------------------------------------------------------
// Carteira
// ---------------------------------------------------------------------------

export type LinhaExtrato = {
  id: string;
  data: string;
  metodo: string;
  estado: string;
  provedor: string | null;
  valor: number;
  idExterno: string | null;
  pedidoNumero: number | null;
  cliente: string | null;
};

export type Carteira = {
  recebido: number;
  aReceber: number;
  estornado: number;
  naoConcretizado: number;
  quantidade: { recebido: number; aReceber: number; estornado: number; naoConcretizado: number };
  /** Recebido por dia, para a barra de evolução. */
  porDia: { dia: string; valor: number }[];
  porMetodo: { metodo: string; valor: number; quantidade: number }[];
  extrato: LinhaExtrato[];
  truncado: boolean;
  /** Existe algum pagamento na loja, fora do período? Distingue "sem venda ainda" de "nada neste recorte". */
  temAlgumPagamento: boolean;
};

/**
 * Faturamento do período e extrato de pagamentos.
 *
 * A data de referência é `pago_em` quando existe e `criado_em` quando não —
 * é o que faz "recebido em agosto" significar dinheiro que entrou em agosto,
 * e não cobrança emitida em agosto. Limitação conhecida: `pagamentos` não tem
 * `estornado_em`, então um estorno aparece no mês do pagamento original.
 */
export async function carteiraDaLoja(lojistaId: string, p: Periodo): Promise<Carteira> {
  const supabase = await createClient();

  const { data, count } = await supabase
    .from('pagamentos')
    .select(
      'id, metodo, estado, provedor, valor, id_externo, pago_em, criado_em, ' +
        'pedidos(numero, clientes(nome))',
      { count: 'exact' },
    )
    .eq('lojista_id', lojistaId)
    .or(
      `and(pago_em.gte.${p.deISO},pago_em.lte.${p.ateISO}),` +
        `and(pago_em.is.null,criado_em.gte.${p.deISO},criado_em.lte.${p.ateISO})`,
    )
    .order('criado_em', { ascending: false })
    .limit(TETO);

  const linhas = (data ?? []) as unknown as {
    id: string;
    metodo: string;
    estado: string;
    provedor: string | null;
    valor: number;
    id_externo: string | null;
    pago_em: string | null;
    criado_em: string;
    pedidos: { numero: number; clientes: { nome: string | null } | null } | null;
  }[];

  // Se o período não trouxe nada, ainda é preciso saber se a loja já vendeu
  // alguma vez: "nenhuma venda ainda" e "nenhuma venda neste recorte" pedem
  // textos diferentes na tela.
  let temAlgumPagamento = linhas.length > 0;
  if (!temAlgumPagamento) {
    const { count: total } = await supabase
      .from('pagamentos')
      .select('id', { count: 'exact', head: true })
      .eq('lojista_id', lojistaId);
    temAlgumPagamento = (total ?? 0) > 0;
  }

  const acc = {
    recebido: 0,
    aReceber: 0,
    estornado: 0,
    naoConcretizado: 0,
    quantidade: { recebido: 0, aReceber: 0, estornado: 0, naoConcretizado: 0 },
  };
  const porDia = new Map<string, number>();
  const porMetodo = new Map<string, { valor: number; quantidade: number }>();

  for (const l of linhas) {
    const v = num(l.valor);
    const grupo =
      l.estado === 'aprovado'
        ? 'recebido'
        : l.estado === 'pendente'
          ? 'aReceber'
          : l.estado === 'estornado'
            ? 'estornado'
            : 'naoConcretizado'; // recusado, expirado e o que vier depois
    acc[grupo] += v;
    acc.quantidade[grupo] += 1;

    if (grupo === 'recebido') {
      const dia = (l.pago_em ?? l.criado_em).slice(0, 10);
      porDia.set(dia, (porDia.get(dia) ?? 0) + v);
      const m = porMetodo.get(l.metodo) ?? { valor: 0, quantidade: 0 };
      porMetodo.set(l.metodo, { valor: m.valor + v, quantidade: m.quantidade + 1 });
    }
  }

  return {
    ...acc,
    porDia: [...porDia.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([dia, valor]) => ({ dia, valor })),
    porMetodo: [...porMetodo.entries()]
      .map(([metodo, m]) => ({ metodo, ...m }))
      .sort((a, b) => b.valor - a.valor),
    extrato: linhas.map((l) => ({
      id: l.id,
      data: l.pago_em ?? l.criado_em,
      metodo: l.metodo,
      estado: l.estado,
      provedor: l.provedor,
      valor: num(l.valor),
      idExterno: l.id_externo,
      pedidoNumero: l.pedidos?.numero ?? null,
      cliente: l.pedidos?.clientes?.nome ?? null,
    })),
    truncado: (count ?? 0) > linhas.length,
    temAlgumPagamento,
  };
}

// ---------------------------------------------------------------------------
// Relatórios
// ---------------------------------------------------------------------------

/** Pedido em rascunho não é venda; cancelado deixou de ser. Os dois entram só no relatório por estado. */
const ESTADOS_DE_VENDA = ['aguardando_pagamento', 'pago', 'em_producao', 'pronto', 'enviado', 'entregue'];

export type Relatorios = {
  vendas: number;
  pedidos: number;
  ticketMedio: number;
  itens: number;
  porDia: { dia: string; valor: number; pedidos: number }[];
  porProduto: { nome: string; quantidade: number; valor: number }[];
  porVendedor: { nome: string; pedidos: number; valor: number; comissao: number }[];
  porEstado: { estado: string; pedidos: number; valor: number }[];
  truncado: boolean;
  temAlgumPedido: boolean;
};

/**
 * Vendas do período abertas por dia, produto, vendedor e estado.
 *
 * Uma consulta só, agregada em memória: são no máximo `TETO` pedidos e quatro
 * cortes do mesmo conjunto — quatro idas ao banco custariam mais e poderiam
 * divergir entre si se um pedido mudasse de estado no meio.
 */
export async function relatoriosDaLoja(lojistaId: string, p: Periodo): Promise<Relatorios> {
  const supabase = await createClient();

  const { data, count } = await supabase
    .from('pedidos')
    .select(
      'id, estado, total, criado_em, ' +
        'vendedores(nome, comissao_pct), ' +
        'pedido_itens(descricao, quantidade, total, produtos(nome))',
      { count: 'exact' },
    )
    .eq('lojista_id', lojistaId)
    .gte('criado_em', p.deISO)
    .lte('criado_em', p.ateISO)
    .order('criado_em', { ascending: false })
    .limit(TETO);

  const pedidos = (data ?? []) as unknown as {
    id: string;
    estado: string;
    total: number;
    criado_em: string;
    vendedores: { nome: string; comissao_pct: number } | null;
    pedido_itens: { descricao: string; quantidade: number; total: number; produtos: { nome: string } | null }[];
  }[];

  let temAlgumPedido = pedidos.length > 0;
  if (!temAlgumPedido) {
    const { count: total } = await supabase
      .from('pedidos')
      .select('id', { count: 'exact', head: true })
      .eq('lojista_id', lojistaId);
    temAlgumPedido = (total ?? 0) > 0;
  }

  const porDia = new Map<string, { valor: number; pedidos: number }>();
  const porProduto = new Map<string, { quantidade: number; valor: number }>();
  const porVendedor = new Map<string, { pedidos: number; valor: number; comissao: number }>();
  const porEstado = new Map<string, { pedidos: number; valor: number }>();

  let vendas = 0;
  let contaVendas = 0;
  let itens = 0;

  for (const pe of pedidos) {
    const v = num(pe.total);

    const e = porEstado.get(pe.estado) ?? { pedidos: 0, valor: 0 };
    porEstado.set(pe.estado, { pedidos: e.pedidos + 1, valor: e.valor + v });

    if (!ESTADOS_DE_VENDA.includes(pe.estado)) continue;

    vendas += v;
    contaVendas += 1;

    const dia = pe.criado_em.slice(0, 10);
    const d = porDia.get(dia) ?? { valor: 0, pedidos: 0 };
    porDia.set(dia, { valor: d.valor + v, pedidos: d.pedidos + 1 });

    // Sem vendedor não é erro: pedido pela loja online não tem quem atenda.
    const nomeVend = pe.vendedores?.nome ?? 'Sem vendedor';
    const w = porVendedor.get(nomeVend) ?? { pedidos: 0, valor: 0, comissao: 0 };
    porVendedor.set(nomeVend, {
      pedidos: w.pedidos + 1,
      valor: w.valor + v,
      comissao: w.comissao + (v * num(pe.vendedores?.comissao_pct)) / 100,
    });

    for (const it of pe.pedido_itens ?? []) {
      // O nome do produto pode ter mudado (ou o produto ter sido apagado):
      // a descrição congelada no item é o que o cliente comprou.
      const nome = it.produtos?.nome ?? it.descricao;
      const q = Number(it.quantidade ?? 0);
      itens += q;
      const a = porProduto.get(nome) ?? { quantidade: 0, valor: 0 };
      porProduto.set(nome, { quantidade: a.quantidade + q, valor: a.valor + num(it.total) });
    }
  }

  return {
    vendas,
    pedidos: contaVendas,
    ticketMedio: contaVendas ? vendas / contaVendas : 0,
    itens,
    porDia: [...porDia.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([dia, x]) => ({ dia, ...x })),
    porProduto: [...porProduto.entries()]
      .map(([nome, x]) => ({ nome, ...x }))
      .sort((a, b) => b.valor - a.valor),
    porVendedor: [...porVendedor.entries()]
      .map(([nome, x]) => ({ nome, ...x }))
      .sort((a, b) => b.valor - a.valor),
    porEstado: [...porEstado.entries()]
      .map(([estado, x]) => ({ estado, ...x }))
      .sort((a, b) => b.pedidos - a.pedidos),
    truncado: (count ?? 0) > pedidos.length,
    temAlgumPedido,
  };
}

// ---------------------------------------------------------------------------
// Integrações
// ---------------------------------------------------------------------------

export type GatewayConectado = {
  provedor: string;
  ativo: boolean;
  aceitaPix: boolean;
  aceitaCartao: boolean;
  aceitaBoleto: boolean;
  criadoEm: string;
  /** Máscara do segredo principal, tipo `••••7f2a`. A credencial nunca sai do servidor. */
  mascara: string | null;
  /** `true` quando o cifrado não abre com a chave atual — trocaram `CHAVE_CIFRAGEM`. */
  ilegivel: boolean;
};

/**
 * Gateways da loja, já sem segredo.
 *
 * Decifra no servidor só para extrair os últimos quatro caracteres: é o
 * suficiente para o lojista reconhecer qual chave está lá, e nada além disso
 * atravessa a fronteira para o navegador.
 */
export async function gatewaysDaLoja(lojistaId: string): Promise<GatewayConectado[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('lojista_gateways')
    .select('provedor, ativo, aceita_pix, aceita_cartao, aceita_boleto, credenciais_cifradas, criado_em')
    .eq('lojista_id', lojistaId);

  return ((data ?? []) as unknown as {
    provedor: string;
    ativo: boolean;
    aceita_pix: boolean;
    aceita_cartao: boolean;
    aceita_boleto: boolean;
    credenciais_cifradas: string | null;
    criado_em: string;
  }[]).map((g) => {
    let mascara: string | null = null;
    let ilegivel = false;
    if (g.credenciais_cifradas && temChaveDeCifragem()) {
      try {
        const dados = JSON.parse(decifrar(g.credenciais_cifradas)) as {
          principal?: string;
          campos?: Record<string, string>;
        };
        const segredo = dados.campos?.[dados.principal ?? ''] ?? '';
        mascara = segredo ? ultimos4(segredo) : null;
      } catch {
        // Chave trocada ou linha adulterada: dizer isso é melhor que mostrar
        // "conectado" para uma credencial que vai falhar na primeira cobrança.
        ilegivel = true;
      }
    }
    return {
      provedor: g.provedor,
      ativo: g.ativo,
      aceitaPix: g.aceita_pix,
      aceitaCartao: g.aceita_cartao,
      aceitaBoleto: g.aceita_boleto,
      criadoEm: g.criado_em,
      mascara,
      ilegivel,
    };
  });
}

/** A tela precisa saber se dá para cifrar antes de oferecer o formulário. */
export function cifragemDisponivel(): boolean {
  return temChaveDeCifragem();
}

// ---------------------------------------------------------------------------
// Auditoria
// ---------------------------------------------------------------------------

export type LinhaAuditoria = {
  id: string;
  acao: string;
  entidade: string | null;
  entidadeId: string | null;
  detalhe: unknown;
  criadoEm: string;
};

export const AUDITORIA_POR_PAGINA = 50;

/**
 * Registro de ações da loja, filtrado por ação e período.
 *
 * As ações possíveis saem do próprio histórico, não de uma lista fixa: um
 * seletor com opções que nunca aconteceram só engana quem procura.
 */
export async function auditoriaDaLoja(
  lojistaId: string,
  p: Periodo,
  { acao = '', pagina = 0 }: { acao?: string; pagina?: number } = {},
): Promise<{ linhas: LinhaAuditoria[]; total: number; acoes: string[]; temAlgumRegistro: boolean }> {
  const supabase = await createClient();

  let q = supabase
    .from('auditoria')
    .select('id, acao, entidade, entidade_id, detalhe, criado_em', { count: 'exact' })
    .eq('lojista_id', lojistaId)
    .gte('criado_em', p.deISO)
    .lte('criado_em', p.ateISO);
  if (acao) q = q.eq('acao', acao);

  const de = pagina * AUDITORIA_POR_PAGINA;
  const [{ data, count }, distintas] = await Promise.all([
    q.order('criado_em', { ascending: false }).range(de, de + AUDITORIA_POR_PAGINA - 1),
    // Amostra recente para montar o seletor: distinct não existe no PostgREST,
    // e as ações que interessam ao lojista são as que ele acabou de fazer.
    supabase
      .from('auditoria')
      .select('acao')
      .eq('lojista_id', lojistaId)
      .order('criado_em', { ascending: false })
      .limit(500),
  ]);

  const linhas = (data ?? []) as unknown as {
    id: string;
    acao: string;
    entidade: string | null;
    entidade_id: string | null;
    detalhe: unknown;
    criado_em: string;
  }[];

  const acoes = [...new Set(((distintas.data ?? []) as { acao: string }[]).map((a) => a.acao))].sort();

  return {
    linhas: linhas.map((l) => ({
      id: l.id,
      acao: l.acao,
      entidade: l.entidade,
      entidadeId: l.entidade_id,
      detalhe: l.detalhe,
      criadoEm: l.criado_em,
    })),
    total: count ?? 0,
    acoes,
    temAlgumRegistro: acoes.length > 0,
  };
}

// ---------------------------------------------------------------------------
// Suporte
// ---------------------------------------------------------------------------

export type Chamado = {
  id: string;
  assunto: string;
  mensagem: string | null;
  estado: string;
  prioridade: string;
  criadoEm: string;
  atualizadoEm: string;
  cliente: string | null;
  clienteEmail: string | null;
  pedidoNumero: number | null;
};

export type PainelDeChamados = {
  chamados: Chamado[];
  /** Quantos há em cada estado, no total da loja — o filtro não pode esconder a fila. */
  porEstado: Record<string, number>;
  temAlgumChamado: boolean;
};

export async function chamadosDaLoja(
  lojistaId: string,
  { estado = '', prioridade = '' }: { estado?: string; prioridade?: string } = {},
): Promise<PainelDeChamados> {
  const supabase = await createClient();

  let q = supabase
    .from('chamados')
    .select(
      'id, assunto, mensagem, estado, prioridade, criado_em, atualizado_em, ' +
        'clientes(nome, email), pedidos(numero)',
    )
    .eq('lojista_id', lojistaId);
  if (estado) q = q.eq('estado', estado);
  if (prioridade) q = q.eq('prioridade', prioridade);

  const [{ data }, todos] = await Promise.all([
    q.order('atualizado_em', { ascending: false }).limit(200),
    supabase.from('chamados').select('estado').eq('lojista_id', lojistaId).limit(TETO),
  ]);

  const linhas = (data ?? []) as unknown as {
    id: string;
    assunto: string;
    mensagem: string | null;
    estado: string;
    prioridade: string;
    criado_em: string;
    atualizado_em: string;
    clientes: { nome: string | null; email: string | null } | null;
    pedidos: { numero: number } | null;
  }[];

  const porEstado: Record<string, number> = {};
  for (const c of (todos.data ?? []) as { estado: string }[]) {
    porEstado[c.estado] = (porEstado[c.estado] ?? 0) + 1;
  }

  return {
    chamados: linhas.map((c) => ({
      id: c.id,
      assunto: c.assunto,
      mensagem: c.mensagem,
      estado: c.estado,
      prioridade: c.prioridade,
      criadoEm: c.criado_em,
      atualizadoEm: c.atualizado_em,
      cliente: c.clientes?.nome ?? null,
      clienteEmail: c.clientes?.email ?? null,
      pedidoNumero: c.pedidos?.numero ?? null,
    })),
    porEstado,
    temAlgumChamado: Object.values(porEstado).reduce((t, n) => t + n, 0) > 0,
  };
}
