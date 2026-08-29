import 'server-only';
import { createClient } from '@/lib/supabase/server';

/**
 * Leituras das telas comerciais do lojista: catálogo, preços, vitrine, CRM,
 * vendedores e marketing.
 *
 * Regra que vale para o arquivo inteiro: **nada aqui inventa número**. Onde a
 * plataforma ainda não mede alguma coisa, a função devolve vazio e a tela
 * explica o que fazer — o dashboard antigo mostrava R$ 184 mil de faturamento
 * que não era de ninguém, e isso é pior que uma tela vazia.
 */

// ---------------------------------------------------------------------------
// Estados de pedido
//
// Repetidos aqui de propósito: `src/lib/pedidos.ts` pertence à tela de Pedidos
// e ainda pode mudar de forma. Importar dela acoplaria as telas comerciais ao
// ritmo de outra parte do sistema por causa de duas listas de strings.
// ---------------------------------------------------------------------------

/** Pedido cujo dinheiro já entrou — é o que conta como receita. */
export const ESTADOS_PAGOS = ['pago', 'em_producao', 'pronto', 'enviado', 'entregue'] as const;

/** Pedido em aberto: existe, ainda não foi pago, ainda pode ser resgatado. */
export const ESTADOS_ABERTOS = ['rascunho', 'aguardando_pagamento'] as const;

const pago = (estado: string) => (ESTADOS_PAGOS as readonly string[]).includes(estado);
const aberto = (estado: string) => (ESTADOS_ABERTOS as readonly string[]).includes(estado);

/**
 * Teto das leituras que agregam em memória (CRM, vendedores, marketing).
 *
 * Agregar no Postgres exigiria uma view por tela; enquanto o volume real é de
 * dezenas a centenas de linhas, ler e somar aqui é mais simples e dá ordenação
 * global correta. O teto existe para que uma loja grande degrade de forma
 * visível — as telas mostram um aviso quando ele é atingido — em vez de
 * silenciosamente mentir na soma.
 */
export const TETO_LEITURA = 5000;

// ---------------------------------------------------------------------------
// Catálogo
// ---------------------------------------------------------------------------

export type Produto = {
  id: string;
  lojista_id: string;
  template_id: string | null;
  nome: string;
  descricao: string | null;
  categoria: string;
  sku: string | null;
  preco_base: number;
  preco_pagina_extra: number;
  preco_foto_extra: number;
  prazo_producao_dias: number;
  ativo: boolean;
  ordem: number;
  criado_em: string;
};

const CAMPOS_PRODUTO =
  'id, lojista_id, template_id, nome, descricao, categoria, sku, preco_base, ' +
  'preco_pagina_extra, preco_foto_extra, prazo_producao_dias, ativo, ordem, criado_em';

/** Modelo de álbum ligado a um produto: dá o formato e o que já vem incluído. */
export type ModeloDoProduto = {
  id: string;
  nome: string;
  produto: string;
  largura_mm: number;
  altura_mm: number;
  paginas_incluidas: number;
  fotos_incluidas: number;
  publicado: boolean;
  lojista_id: string | null;
};

export async function listarProdutos(lojistaId: string): Promise<Produto[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('produtos')
    .select(CAMPOS_PRODUTO)
    .eq('lojista_id', lojistaId)
    .order('ordem')
    .order('criado_em', { ascending: false });

  // O Postgres devolve `numeric` como string no PostgREST; sem o Number() a
  // soma de preços viraria concatenação de texto.
  return (data ?? []).map((linha) => {
    const p = linha as unknown as Record<string, unknown>;
    return {
      ...(p as unknown as Produto),
      preco_base: Number(p.preco_base ?? 0),
      preco_pagina_extra: Number(p.preco_pagina_extra ?? 0),
      preco_foto_extra: Number(p.preco_foto_extra ?? 0),
    };
  });
}

/** Modelos que a loja pode amarrar a um produto: os padrões mais os próprios. */
export async function listarModelos(lojistaId: string): Promise<ModeloDoProduto[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('templates')
    .select(
      'id, nome, produto, largura_mm, altura_mm, paginas_incluidas, fotos_incluidas, publicado, lojista_id',
    )
    .order('lojista_id', { nullsFirst: true })
    .order('ordem');

  const todos = (data ?? []) as unknown as ModeloDoProduto[];
  return todos.filter((t) => !t.lojista_id || t.lojista_id === lojistaId);
}

// ---------------------------------------------------------------------------
// CRM
// ---------------------------------------------------------------------------

/** Como o cliente está em relação à loja. Derivado, não é coluna do banco. */
export type EstadoCliente = 'sem_acesso' | 'sem_pedido' | 'ativo' | 'inativo';

export type ClienteCRM = {
  id: string;
  nome: string | null;
  email: string | null;
  telefone: string | null;
  convidado_em: string | null;
  primeiro_acesso_em: string | null;
  /** Pedidos que não foram cancelados. */
  pedidos: number;
  pedidosPagos: number;
  pedidosEmAberto: number;
  totalGasto: number;
  ticketMedio: number;
  ultimoPedidoEm: string | null;
  albuns: number;
  fotos: number;
  estado: EstadoCliente;
};

/** Um cliente é "ativo" se comprou dentro desta janela. */
const DIAS_PARA_INATIVO = 180;

export type DadosCRM = {
  clientes: ClienteCRM[];
  /** Contagem por estado, sobre TODOS os clientes — não só a página. */
  porEstado: Record<EstadoCliente, number>;
  receita: number;
  ticketMedio: number;
  truncado: boolean;
};

/**
 * Clientes da loja com o que a plataforma realmente sabe sobre cada um.
 *
 * A agregação é feita aqui, e não no banco, porque a ordenação pedida é por
 * total gasto — um valor derivado de `pedidos`. Ordenar por ele no Postgres
 * exigiria uma view materializada; ver `TETO_LEITURA`.
 */
export async function dadosCRM(lojistaId: string): Promise<DadosCRM> {
  const supabase = await createClient();

  const [clientesRes, pedidosRes, projetosRes, fotosRes] = await Promise.all([
    supabase
      .from('clientes')
      .select('id, nome, email, telefone, convidado_em, primeiro_acesso_em')
      .eq('lojista_id', lojistaId)
      .order('convidado_em', { ascending: false })
      .limit(TETO_LEITURA),
    supabase
      .from('pedidos')
      .select('id, cliente_id, estado, total, criado_em')
      .eq('lojista_id', lojistaId)
      .limit(TETO_LEITURA),
    supabase
      .from('projetos')
      .select('id, cliente_id')
      .eq('lojista_id', lojistaId)
      .limit(TETO_LEITURA),
    supabase
      .from('galerias')
      .select('cliente_id, galeria_fotos(count)')
      .eq('lojista_id', lojistaId)
      .limit(TETO_LEITURA),
  ]);

  const clientes = (clientesRes.data ?? []) as unknown as {
    id: string;
    nome: string | null;
    email: string | null;
    telefone: string | null;
    convidado_em: string | null;
    primeiro_acesso_em: string | null;
  }[];

  const pedidos = (pedidosRes.data ?? []) as unknown as {
    id: string;
    cliente_id: string | null;
    estado: string;
    total: unknown;
    criado_em: string;
  }[];

  const albunsPorCliente = new Map<string, number>();
  for (const p of (projetosRes.data ?? []) as unknown as { cliente_id: string }[]) {
    albunsPorCliente.set(p.cliente_id, (albunsPorCliente.get(p.cliente_id) ?? 0) + 1);
  }

  const fotosPorCliente = new Map<string, number>();
  for (const g of (fotosRes.data ?? []) as unknown as {
    cliente_id: string;
    galeria_fotos: { count: number }[];
  }[]) {
    const n = g.galeria_fotos?.[0]?.count ?? 0;
    fotosPorCliente.set(g.cliente_id, (fotosPorCliente.get(g.cliente_id) ?? 0) + n);
  }

  type Acumulado = {
    pedidos: number;
    pagos: number;
    abertos: number;
    gasto: number;
    ultimo: string | null;
  };
  const porCliente = new Map<string, Acumulado>();
  for (const pd of pedidos) {
    if (!pd.cliente_id) continue;
    const a =
      porCliente.get(pd.cliente_id) ??
      { pedidos: 0, pagos: 0, abertos: 0, gasto: 0, ultimo: null as string | null };

    if (pd.estado !== 'cancelado') a.pedidos += 1;
    if (pago(pd.estado)) {
      a.pagos += 1;
      a.gasto += Number(pd.total ?? 0);
    }
    if (aberto(pd.estado)) a.abertos += 1;
    if (pd.estado !== 'cancelado' && (!a.ultimo || pd.criado_em > a.ultimo)) a.ultimo = pd.criado_em;

    porCliente.set(pd.cliente_id, a);
  }

  const limite = Date.now() - DIAS_PARA_INATIVO * 24 * 60 * 60 * 1000;
  const porEstado: Record<EstadoCliente, number> = {
    sem_acesso: 0,
    sem_pedido: 0,
    ativo: 0,
    inativo: 0,
  };

  const lista: ClienteCRM[] = clientes.map((c) => {
    const a = porCliente.get(c.id);
    const estado: EstadoCliente = !a || a.pedidos === 0
      ? c.primeiro_acesso_em
        ? 'sem_pedido'
        : 'sem_acesso'
      : a.ultimo && new Date(a.ultimo).getTime() >= limite
        ? 'ativo'
        : 'inativo';

    porEstado[estado] += 1;

    return {
      id: c.id,
      nome: c.nome,
      email: c.email,
      telefone: c.telefone,
      convidado_em: c.convidado_em,
      primeiro_acesso_em: c.primeiro_acesso_em,
      pedidos: a?.pedidos ?? 0,
      pedidosPagos: a?.pagos ?? 0,
      pedidosEmAberto: a?.abertos ?? 0,
      totalGasto: a?.gasto ?? 0,
      ticketMedio: a && a.pagos > 0 ? a.gasto / a.pagos : 0,
      ultimoPedidoEm: a?.ultimo ?? null,
      albuns: albunsPorCliente.get(c.id) ?? 0,
      fotos: fotosPorCliente.get(c.id) ?? 0,
      estado,
    };
  });

  const receita = lista.reduce((t, c) => t + c.totalGasto, 0);
  const pagosTotais = lista.reduce((t, c) => t + c.pedidosPagos, 0);

  return {
    clientes: lista,
    porEstado,
    receita,
    ticketMedio: pagosTotais ? receita / pagosTotais : 0,
    truncado: clientes.length >= TETO_LEITURA || pedidos.length >= TETO_LEITURA,
  };
}

// ---------------------------------------------------------------------------
// Vendedores
// ---------------------------------------------------------------------------

export type Vendedor = {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  comissao_pct: number;
  ativo: boolean;
  criado_em: string;
};

export type VendaDoVendedor = {
  id: string;
  numero: number;
  estado: string;
  total: number;
  criado_em: string;
  cliente: string | null;
};

export type VendedorComVendas = Vendedor & {
  vendas: VendaDoVendedor[];
  /** Somente os pedidos pagos entram — comissão sobre venda não fechada é ficção. */
  vendido: number;
  pedidosPagos: number;
  emAberto: number;
  valorEmAberto: number;
  comissao: number;
};

export type DadosVendedores = {
  vendedores: VendedorComVendas[];
  /** Pedidos pagos sem vendedor: o quanto da receita não está atribuído. */
  semVendedor: { pedidos: number; valor: number };
  truncado: boolean;
};

export async function dadosVendedores(lojistaId: string): Promise<DadosVendedores> {
  const supabase = await createClient();

  const [vendRes, pedRes] = await Promise.all([
    supabase
      .from('vendedores')
      .select('id, nome, email, telefone, comissao_pct, ativo, criado_em')
      .eq('lojista_id', lojistaId)
      .order('ativo', { ascending: false })
      .order('nome'),
    supabase
      .from('pedidos')
      .select('id, numero, vendedor_id, estado, total, criado_em, clientes(nome)')
      .eq('lojista_id', lojistaId)
      .order('criado_em', { ascending: false })
      .limit(TETO_LEITURA),
  ]);

  const pedidos = (pedRes.data ?? []) as unknown as {
    id: string;
    numero: number;
    vendedor_id: string | null;
    estado: string;
    total: unknown;
    criado_em: string;
    clientes: { nome: string | null } | null;
  }[];

  const porVendedor = new Map<string, VendaDoVendedor[]>();
  let semPedidos = 0;
  let semValor = 0;

  for (const p of pedidos) {
    const venda: VendaDoVendedor = {
      id: p.id,
      numero: p.numero,
      estado: p.estado,
      total: Number(p.total ?? 0),
      criado_em: p.criado_em,
      cliente: p.clientes?.nome ?? null,
    };
    if (!p.vendedor_id) {
      if (pago(p.estado)) {
        semPedidos += 1;
        semValor += venda.total;
      }
      continue;
    }
    const lista = porVendedor.get(p.vendedor_id) ?? [];
    lista.push(venda);
    porVendedor.set(p.vendedor_id, lista);
  }

  const vendedores = ((vendRes.data ?? []) as unknown as Vendedor[]).map((v) => {
    const vendas = porVendedor.get(v.id) ?? [];
    const pagos = vendas.filter((x) => pago(x.estado));
    const abertos = vendas.filter((x) => aberto(x.estado));
    const vendido = pagos.reduce((t, x) => t + x.total, 0);
    const pct = Number(v.comissao_pct ?? 0);

    return {
      ...v,
      comissao_pct: pct,
      vendas,
      vendido,
      pedidosPagos: pagos.length,
      emAberto: abertos.length,
      valorEmAberto: abertos.reduce((t, x) => t + x.total, 0),
      comissao: (vendido * pct) / 100,
    };
  });

  return {
    vendedores,
    semVendedor: { pedidos: semPedidos, valor: semValor },
    truncado: pedidos.length >= TETO_LEITURA,
  };
}

// ---------------------------------------------------------------------------
// Vitrine (tela "Loja")
// ---------------------------------------------------------------------------

export type DadosVitrine = {
  loja: {
    id: string;
    slug: string;
    nome: string;
    logo_url: string | null;
    cor_primaria: string | null;
    cor_secundaria: string | null;
    descricao: string | null;
    telefone_suporte: string | null;
    email_suporte: string | null;
    ativo: boolean;
  };
  /** O que o cliente encontra na loja hoje. */
  produtosPublicados: Produto[];
  produtosOcultos: number;
  modelosPublicados: ModeloDoProduto[];
  modelosOcultos: number;
  clientes: number;
  clientesQueEntraram: number;
};

export async function dadosVitrine(lojistaId: string): Promise<DadosVitrine | null> {
  const supabase = await createClient();

  const [lojaRes, produtos, modelos, clientesRes, acessaramRes] = await Promise.all([
    supabase
      .from('lojistas')
      .select(
        'id, slug, nome, logo_url, cor_primaria, cor_secundaria, descricao, ' +
          'telefone_suporte, email_suporte, ativo',
      )
      .eq('id', lojistaId)
      .maybeSingle(),
    listarProdutos(lojistaId),
    listarModelos(lojistaId),
    supabase.from('clientes').select('id', { count: 'exact', head: true }).eq('lojista_id', lojistaId),
    supabase
      .from('clientes')
      .select('id', { count: 'exact', head: true })
      .eq('lojista_id', lojistaId)
      .not('primeiro_acesso_em', 'is', null),
  ]);

  if (!lojaRes.data) return null;

  const publicados = produtos.filter((p) => p.ativo);
  const modelosPub = modelos.filter((m) => m.publicado);

  return {
    loja: lojaRes.data as unknown as DadosVitrine['loja'],
    produtosPublicados: publicados,
    produtosOcultos: produtos.length - publicados.length,
    modelosPublicados: modelosPub,
    modelosOcultos: modelos.length - modelosPub.length,
    clientes: clientesRes.count ?? 0,
    clientesQueEntraram: acessaramRes.count ?? 0,
  };
}

// ---------------------------------------------------------------------------
// Marketing — oportunidades medidas, não campanhas inventadas
// ---------------------------------------------------------------------------

export type Oportunidade = {
  id: string;
  titulo: string;
  detalhe: string;
  /** Há quantos dias esta linha está parada. `null` quando não dá para medir. */
  diasParado: number | null;
  cliente: string | null;
  contato: string | null;
  valor: number | null;
};

export type Funil = {
  clientes: number;
  comFotos: number;
  comAlbumMontado: number;
  comPedido: number;
  comPedidoPago: number;
  receita: number;
};

export type DadosMarketing = {
  funil: Funil;
  /** Galeria com foto liberada e nenhum álbum montado. */
  naoMontados: Oportunidade[];
  /** Álbum montado que nunca virou pedido. */
  semPedido: Oportunidade[];
  /** Pedido criado e não pago. */
  naoPagos: Oportunidade[];
  /** Convidado que nunca entrou na loja. */
  nuncaEntraram: Oportunidade[];
  truncado: boolean;
};

const dias = (desde: string | null) =>
  desde ? Math.max(0, Math.floor((Date.now() - new Date(desde).getTime()) / 86_400_000)) : null;

/**
 * Onde a loja está perdendo venda, medido no dado que existe.
 *
 * Marketing de painel costuma ser uma lista de campanhas fictícias. Aqui não
 * há campanha nenhuma: há quatro vazamentos que a própria plataforma consegue
 * enxergar, cada um com as linhas reais que o lojista pode ligar hoje.
 */
export async function dadosMarketing(lojistaId: string): Promise<DadosMarketing> {
  const supabase = await createClient();

  const [galeriasRes, projetosRes, pedidosRes, clientesRes] = await Promise.all([
    supabase
      .from('galerias')
      .select('id, nome, cliente_id, criada_em, galeria_fotos(count)')
      .eq('lojista_id', lojistaId)
      .limit(TETO_LEITURA),
    supabase
      .from('projetos')
      .select('id, titulo, cliente_id, galeria_id, status, total_paginas, atualizado_em')
      .eq('lojista_id', lojistaId)
      .limit(TETO_LEITURA),
    supabase
      .from('pedidos')
      .select('id, numero, cliente_id, estado, total, criado_em, pedido_itens(projeto_id)')
      .eq('lojista_id', lojistaId)
      .limit(TETO_LEITURA),
    supabase
      .from('clientes')
      .select('id, nome, email, telefone, convidado_em, primeiro_acesso_em')
      .eq('lojista_id', lojistaId)
      .limit(TETO_LEITURA),
  ]);

  const galerias = (galeriasRes.data ?? []) as unknown as {
    id: string;
    nome: string;
    cliente_id: string;
    criada_em: string;
    galeria_fotos: { count: number }[];
  }[];

  const projetos = (projetosRes.data ?? []) as unknown as {
    id: string;
    titulo: string;
    cliente_id: string;
    galeria_id: string | null;
    status: string;
    total_paginas: number | null;
    atualizado_em: string;
  }[];

  const pedidos = (pedidosRes.data ?? []) as unknown as {
    id: string;
    numero: number;
    cliente_id: string | null;
    estado: string;
    total: unknown;
    criado_em: string;
    pedido_itens: { projeto_id: string | null }[];
  }[];

  const clientes = (clientesRes.data ?? []) as unknown as {
    id: string;
    nome: string | null;
    email: string | null;
    telefone: string | null;
    convidado_em: string | null;
    primeiro_acesso_em: string | null;
  }[];

  const nomeDoCliente = new Map(clientes.map((c) => [c.id, c.nome ?? c.email ?? null]));
  const contatoDoCliente = new Map(clientes.map((c) => [c.id, c.email ?? c.telefone ?? null]));

  // "Montado" = tem lâmina gravada. Álbum criado e vazio não é venda a ganhar,
  // é o passo anterior — por isso a contagem usa `total_paginas`, não `status`.
  const montados = projetos.filter((p) => (p.total_paginas ?? 0) > 0);
  const galeriasComAlbum = new Set(montados.map((p) => p.galeria_id).filter(Boolean) as string[]);

  const projetosVendidos = new Set<string>();
  for (const pd of pedidos) {
    if (pd.estado === 'cancelado') continue;
    for (const it of pd.pedido_itens ?? []) if (it.projeto_id) projetosVendidos.add(it.projeto_id);
  }

  // --- 1. fotos liberadas, álbum não montado ---
  const naoMontados: Oportunidade[] = galerias
    .filter((g) => (g.galeria_fotos?.[0]?.count ?? 0) > 0 && !galeriasComAlbum.has(g.id))
    .map((g) => ({
      id: g.id,
      titulo: g.nome,
      detalhe: `${g.galeria_fotos[0].count} fotos liberadas · nenhum álbum montado`,
      diasParado: dias(g.criada_em),
      cliente: nomeDoCliente.get(g.cliente_id) ?? null,
      contato: contatoDoCliente.get(g.cliente_id) ?? null,
      valor: null,
    }))
    .sort((a, b) => (b.diasParado ?? 0) - (a.diasParado ?? 0));

  // --- 2. álbum montado, nenhum pedido ---
  const semPedido: Oportunidade[] = montados
    .filter((p) => !projetosVendidos.has(p.id))
    .map((p) => ({
      id: p.id,
      titulo: p.titulo,
      detalhe: `${Math.round((p.total_paginas ?? 0) / 2)} lâminas montadas · sem pedido`,
      diasParado: dias(p.atualizado_em),
      cliente: nomeDoCliente.get(p.cliente_id) ?? null,
      contato: contatoDoCliente.get(p.cliente_id) ?? null,
      valor: null,
    }))
    .sort((a, b) => (b.diasParado ?? 0) - (a.diasParado ?? 0));

  // --- 3. pedido criado, não pago ---
  const naoPagos: Oportunidade[] = pedidos
    .filter((p) => aberto(p.estado))
    .map((p) => ({
      id: p.id,
      titulo: `Pedido #${p.numero}`,
      detalhe: p.estado === 'rascunho' ? 'Rascunho não fechado' : 'Aguardando pagamento',
      diasParado: dias(p.criado_em),
      cliente: p.cliente_id ? nomeDoCliente.get(p.cliente_id) ?? null : null,
      contato: p.cliente_id ? contatoDoCliente.get(p.cliente_id) ?? null : null,
      valor: Number(p.total ?? 0),
    }))
    .sort((a, b) => (b.diasParado ?? 0) - (a.diasParado ?? 0));

  // --- 4. convidado que nunca entrou ---
  const nuncaEntraram: Oportunidade[] = clientes
    .filter((c) => !c.primeiro_acesso_em)
    .map((c) => ({
      id: c.id,
      titulo: c.nome ?? c.email ?? 'Cliente sem nome',
      detalhe: 'Convite enviado, nunca acessou a loja',
      diasParado: dias(c.convidado_em),
      cliente: c.nome ?? null,
      contato: c.email ?? c.telefone ?? null,
      valor: null,
    }))
    .sort((a, b) => (b.diasParado ?? 0) - (a.diasParado ?? 0));

  // --- funil, por CLIENTE (é o que o lojista liga, não a galeria) ---
  const comFotos = new Set(
    galerias.filter((g) => (g.galeria_fotos?.[0]?.count ?? 0) > 0).map((g) => g.cliente_id),
  );
  const comAlbum = new Set(montados.map((p) => p.cliente_id));
  const comPedido = new Set(
    pedidos.filter((p) => p.estado !== 'cancelado' && p.cliente_id).map((p) => p.cliente_id!),
  );
  const comPago = new Set(pedidos.filter((p) => pago(p.estado) && p.cliente_id).map((p) => p.cliente_id!));

  return {
    funil: {
      clientes: clientes.length,
      comFotos: comFotos.size,
      comAlbumMontado: comAlbum.size,
      comPedido: comPedido.size,
      comPedidoPago: comPago.size,
      receita: pedidos.filter((p) => pago(p.estado)).reduce((t, p) => t + Number(p.total ?? 0), 0),
    },
    naoMontados,
    semPedido,
    naoPagos,
    nuncaEntraram,
    truncado:
      galerias.length >= TETO_LEITURA ||
      projetos.length >= TETO_LEITURA ||
      pedidos.length >= TETO_LEITURA ||
      clientes.length >= TETO_LEITURA,
  };
}
