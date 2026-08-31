import 'server-only';
import { createClient } from '@/lib/supabase/server';

export type Template = {
  id: string;
  lojista_id: string | null;
  nome: string;
  produto: string;
  categoria: string;
  largura_mm: number;
  altura_mm: number;
  paginas_min: number;
  paginas_max: number;
  sangria_mm: number;
  area_segura_mm: number;
  preco_base: number | null;
  publicado: boolean;
  ordem: number;
};

export type ClienteDaLoja = {
  id: string;
  nome: string | null;
  email: string | null;
  telefone: string | null;
  user_id: string | null;
  convidado_em: string | null;
  primeiro_acesso_em: string | null;
  /** Uma galeria por evento: casamento, batizado, formatura… */
  galerias: {
    id: string;
    nome: string;
    templates_permitidos: string[] | null;
    paginas_min: number | null;
    paginas_max: number | null;
    fotos_max: number | null;
    permite_paginas_extras: boolean;
    galeria_fotos: { count: number }[];
    /** Pessoas reconhecidas nas fotos (Fase 5), com quantos rostos cada uma. */
    pessoas: { id: string; nome: string | null; rostos: { count: number }[] }[];
  }[];
  projetos: { id: string; titulo: string; status: string; progresso: number; galeria_id: string | null }[];
};

export const CLIENTES_POR_PAGINA = 25;

const CAMPOS_TEMPLATE =
  'id, lojista_id, nome, produto, categoria, largura_mm, altura_mm, paginas_min, ' +
  'paginas_max, sangria_mm, area_segura_mm, preco_base, publicado, ordem';

/** Modelos visíveis para a loja: os padrões da plataforma mais os próprios. */
export async function listarTemplates(lojistaId?: string): Promise<Template[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('templates')
    .select(CAMPOS_TEMPLATE)
    .order('lojista_id', { nullsFirst: true })
    .order('ordem');

  const todos = (data ?? []) as unknown as Template[];
  return lojistaId ? todos.filter((t) => !t.lojista_id || t.lojista_id === lojistaId) : todos;
}

export async function getTemplate(id: string): Promise<Template | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('templates').select(CAMPOS_TEMPLATE).eq('id', id).maybeSingle();
  return (data as unknown as Template) ?? null;
}

/**
 * Clientes finais da loja, paginados.
 *
 * Uma loja pode ter centenas de milhares de clientes, então a listagem nunca
 * é completa: vem por página e com busca por nome ou e-mail.
 */
export async function listarClientesDaLoja(
  lojistaId: string,
  { busca = '', pagina = 0 }: { busca?: string; pagina?: number } = {},
): Promise<{ clientes: ClienteDaLoja[]; total: number }> {
  const supabase = await createClient();

  let q = supabase
    .from('clientes')
    .select(
      'id, nome, email, telefone, user_id, convidado_em, primeiro_acesso_em, ' +
        'galerias(id, nome, templates_permitidos, paginas_min, paginas_max, fotos_max, ' +
        'permite_paginas_extras, galeria_fotos(count), pessoas(id, nome, rostos(count))), ' +
        'projetos(id, titulo, status, progresso, galeria_id)',
      { count: 'exact' },
    )
    .eq('lojista_id', lojistaId);

  const termo = busca.trim();
  if (termo) {
    const escapado = termo.replace(/[%,()]/g, '');
    q = q.or(`nome.ilike.%${escapado}%,email.ilike.%${escapado}%`);
  }

  const de = pagina * CLIENTES_POR_PAGINA;
  const { data, count } = await q
    .order('convidado_em', { ascending: false })
    .range(de, de + CLIENTES_POR_PAGINA - 1);

  return { clientes: (data ?? []) as unknown as ClienteDaLoja[], total: count ?? 0 };
}

/** A loja que o usuário logado administra (a primeira, se houver várias). */
export async function lojaAtual(): Promise<{ id: string; slug: string; nome: string } | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('lojista_membros')
    .select('lojistas(id, slug, nome)')
    .limit(1)
    .maybeSingle();

  const l = (data as { lojistas: { id: string; slug: string; nome: string } | null } | null)?.lojistas;
  return l ?? null;
}

export type LojistaCompleto = {
  id: string;
  slug: string;
  nome: string;
  logo_url: string | null;
  cor_primaria: string | null;
  cor_secundaria: string | null;
  descricao: string | null;
  telefone_suporte: string | null;
  email_suporte: string | null;
  url_politica: string | null;
  url_contato: string | null;
  ativo: boolean;
};

export async function getLojistaPorId(id: string): Promise<LojistaCompleto | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('lojistas')
    .select(
      'id, slug, nome, logo_url, cor_primaria, cor_secundaria, descricao, ' +
        'telefone_suporte, email_suporte, url_politica, url_contato, ativo',
    )
    .eq('id', id)
    .maybeSingle();
  return (data as LojistaCompleto | null) ?? null;
}

// ---------------------------------------------------------------------------
// Super admin
// ---------------------------------------------------------------------------

export type LojaResumo = {
  id: string;
  slug: string;
  nome: string;
  ativo: boolean;
  criado_em: string;
  logo_url: string | null;
  plano_id: string | null;
  clientes: { count: number }[];
  projetos: { count: number }[];
  lojista_membros: { count: number }[];
};

/**
 * Todas as lojas da plataforma. Só o super admin enxerga — a policy
 * `lojistas_super_admin` é o que permite; para os demais isto volta apenas
 * o que eles já podiam ver.
 */
export async function listarTodasAsLojas(): Promise<LojaResumo[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('lojistas')
    .select(
      'id, slug, nome, ativo, criado_em, logo_url, plano_id, ' +
        'clientes(count), projetos(count), lojista_membros(count)',
    )
    .order('criado_em', { ascending: false });

  return (data ?? []) as unknown as LojaResumo[];
}

export type NumerosDaPlataforma = {
  lojas: number;
  clientes: number;
  projetos: number;
  fotos: number;
};

export async function numerosDaPlataforma(): Promise<NumerosDaPlataforma> {
  const supabase = await createClient();
  const conta = async (tabela: string) => {
    const { count } = await supabase.from(tabela).select('id', { count: 'exact', head: true });
    return count ?? 0;
  };
  const [lojas, clientes, projetos, fotos] = await Promise.all([
    conta('lojistas'),
    conta('clientes'),
    conta('projetos'),
    conta('galeria_fotos'),
  ]);
  return { lojas, clientes, projetos, fotos };
}

export type Plano = {
  id: string;
  nome: string;
  descricao: string | null;
  valor_mensal: number;
  valor_por_projeto: number;
  valor_por_lamina: number;
  limite_projetos: number | null;
  limite_clientes: number | null;
  limite_armazenamento_gb: number | null;
  ativo: boolean;
  ordem: number;
};

export async function listarPlanos(): Promise<Plano[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('planos')
    .select(
      'id, nome, descricao, valor_mensal, valor_por_projeto, valor_por_lamina, ' +
        'limite_projetos, limite_clientes, limite_armazenamento_gb, ativo, ordem',
    )
    .order('ordem');
  return (data ?? []) as unknown as Plano[];
}

/** Consumo da loja na competência atual, para mostrar o quanto já foi usado. */
export async function usoAtual(lojistaId: string): Promise<{ projetos: number; laminas: number }> {
  const supabase = await createClient();
  const inicioDoMes = new Date();
  inicioDoMes.setUTCDate(1);
  const competencia = inicioDoMes.toISOString().slice(0, 10);

  const { data } = await supabase
    .from('uso_lojista')
    .select('projetos, laminas')
    .eq('lojista_id', lojistaId)
    .eq('competencia', competencia)
    .maybeSingle();

  return (data as { projetos: number; laminas: number } | null) ?? { projetos: 0, laminas: 0 };
}

/** Plano da loja mais o consumo do mês — para o cartão de plano. */
export async function planoDaLoja(lojistaId: string): Promise<Plano | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('lojistas')
    .select(
      'planos(id, nome, descricao, valor_mensal, valor_por_projeto, valor_por_lamina, ' +
        'limite_projetos, limite_clientes, limite_armazenamento_gb, ativo, ordem)',
    )
    .eq('id', lojistaId)
    .maybeSingle();

  const p = (data as { planos: Plano | null } | null)?.planos;
  return p ?? null;
}

export type IdentidadeLojista = {
  nome: string;
  email: string;
  lojaSub: string;
  planoResumo: string;
};

/**
 * Quem está logado, para o cabeçalho do painel do lojista.
 *
 * Existe porque o design trazia "Marta Reis", "marta@labcores.com.br" e
 * "Plano Pro · 8 usuários" escritos à mão: todo lojista via o nome de outra
 * pessoa. Fica aqui para o dashboard e a moldura das demais telas usarem a
 * mesma fonte.
 */
export async function identidadeLojista(): Promise<IdentidadeLojista> {
  const supabase = await createClient();
  const [{ data: sessao }, loja] = await Promise.all([supabase.auth.getUser(), lojaAtual()]);
  const plano = loja ? await planoDaLoja(loja.id) : null;
  const email = sessao.user?.email ?? '';

  return {
    // Sem nome no perfil, a parte antes do @ é melhor que um espaço vazio.
    nome:
      (sessao.user?.user_metadata?.nome as string | undefined) ||
      (email ? email.split('@')[0] : 'Minha conta'),
    email,
    lojaSub: [loja?.nome, plano?.nome && `Plano ${plano.nome}`].filter(Boolean).join(' · '),
    planoResumo: plano ? `Plano ${plano.nome}` : 'Sem plano',
  };
}

export type NumerosDaLoja = {
  clientes: number;
  projetos: number;
  emEdicao: number;
  prontos: number;
  comPendencia: number;
  fotos: number;
  laminas: number;
  progressoMedio: number;
  /** Pedidos que ninguém da loja abriu ainda. Selo do menu. */
  pedidosNaoVistos: number;
  /**
   * Jobs de renderização com erro. Ausente enquanto a Central de Renderização
   * não existir — selo ausente é melhor que selo zerado que não mede nada.
   */
  rendersComErro?: number;
  /** Álbuns criados e concluídos por dia, últimos 30 dias. */
  serieCriados: number[];
  serieProntos: number[];
  recentes: {
    id: string;
    titulo: string;
    cliente: string | null;
    progresso: number;
    laminas: number;
    status: string;
    atualizado_em: string;
  }[];
};

/**
 * Números reais da loja, para o painel.
 *
 * O dashboard do design vinha com GMV, ticket médio e conversão preenchidos à
 * mão — R$ 184.320 de faturamento que não é de ninguém. Não há pedido nem
 * pagamento no sistema ainda, então esses três não podem ser calculados: em vez
 * de trocar um número inventado por outro, o painel passa a mostrar o que a
 * plataforma mede de verdade — clientes, álbuns, fotos e o andamento deles.
 */
export async function numerosDaLoja(lojistaId: string): Promise<NumerosDaLoja> {
  const supabase = await createClient();

  const [clientes, projetos, fotos, naoVistos] = await Promise.all([
    supabase.from('clientes').select('id', { count: 'exact', head: true }).eq('lojista_id', lojistaId),
    supabase
      .from('projetos')
      .select('id, titulo, progresso, status, atualizado_em, total_paginas, clientes(nome)')
      .eq('lojista_id', lojistaId)
      .order('atualizado_em', { ascending: false })
      .limit(200),
    supabase.from('galeria_fotos').select('id', { count: 'exact', head: true }),
    supabase
      .from('pedidos')
      .select('id', { count: 'exact', head: true })
      .eq('lojista_id', lojistaId)
      .is('visto_em', null),
  ]);

  const lista = (projetos.data ?? []) as unknown as {
    id: string;
    titulo: string;
    progresso: number | null;
    status: string | null;
    atualizado_em: string;
    total_paginas: number | null;
    clientes: { nome: string | null } | null;
  }[];

  const conta = (s: string) => lista.filter((p) => p.status === s).length;
  const soma = lista.reduce((t, p) => t + (p.progresso ?? 0), 0);

  return {
    clientes: clientes.count ?? 0,
    projetos: lista.length,
    emEdicao: conta('em_edicao') + conta('nao_iniciado'),
    prontos: conta('pronto'),
    comPendencia: conta('com_pendencias'),
    fotos: fotos.count ?? 0,
    laminas: 0,
    progressoMedio: lista.length ? Math.round(soma / lista.length) : 0,
    pedidosNaoVistos: naoVistos.count ?? 0,
    ...(() => {
      // 30 baldes de um dia. Um álbum entra no dia em que foi mexido pela
      // última vez — é a informação que temos sem uma tabela de eventos.
      const dia = 24 * 60 * 60 * 1000;
      const hoje = Date.now();
      const criados = new Array(30).fill(0);
      const prontos = new Array(30).fill(0);
      for (const p of lista) {
        const i = 29 - Math.floor((hoje - new Date(p.atualizado_em).getTime()) / dia);
        if (i < 0 || i > 29) continue;
        criados[i] += 1;
        if (p.status === 'pronto') prontos[i] += 1;
      }
      return { serieCriados: criados, serieProntos: prontos };
    })(),
    recentes: lista.slice(0, 6).map((p) => ({
      id: p.id,
      titulo: p.titulo,
      cliente: p.clientes?.nome ?? null,
      progresso: p.progresso ?? 0,
      laminas: Math.round((p.total_paginas ?? 0) / 2),
      status: p.status ?? 'nao_iniciado',
      atualizado_em: p.atualizado_em,
    })),
  };
}
