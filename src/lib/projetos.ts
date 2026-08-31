import { createClient } from '@/lib/supabase/server';
import {
  PROJETOS_POR_PAGINA,
  type EstadoRender,
  type ProjetoDaLista,
} from '@/lib/projetos-termos';

/**
 * Leitura de projetos (migrações 0001, 0014 e 0015).
 *
 * PROJETO é entidade própria: existe sem pedido, sobrevive ao pedido e pode
 * entrar em mais de um. Por isso nada aqui parte de `pedidos` — parte de
 * `projetos`, e o pedido entra como junção opcional.
 *
 * Como em `pedidos.ts`, tudo passa pela sessão do lojista, então a RLS já
 * limita à loja dele; o `.eq('lojista_id', …)` continua explícito porque a
 * mesma conta pode ser membro de mais de uma loja.
 *
 * Nenhuma função inventa linha. Sem dado, a lista volta vazia e a tela explica.
 */

export * from '@/lib/projetos-termos';

/**
 * PostgREST monta `or=(…)` numa lista separada por vírgula, e `%` é curinga do
 * ilike. Um termo com vírgula ou parêntese quebraria a expressão inteira — o
 * que, além de errar a busca, é injeção de filtro.
 */
const limpar = (s: string) => s.replace(/[,()%*\\]/g, ' ').trim();

/**
 * Teto das leituras que precisam da lista inteira, não de uma contagem.
 * Mesmo número que `comercial.ts` usa: uma loja com mais projetos que isso vai
 * precisar de um agregado no banco, e é melhor descobrir isso por um número
 * redondo do que por uma página que demora dez segundos.
 */
const TETO_PROJETOS = 5000;

export type FiltrosProjetos = {
  busca?: string;
  status?: string;
  cliente?: string;
  produto?: string;
  filial?: string;
  criadoDe?: string;
  criadoAte?: string;
  editadoDe?: string;
  /** 'com' | 'sem' — projeto que já entrou num pedido, ou ainda não. */
  pedido?: string;
  /** 'com' | 'sem' */
  capa?: string;
  /** 'sim' | 'nao' | 'erro' */
  render?: string;
  /** Projeto arquivado fica fora por padrão; 'sim' traz só os arquivados. */
  arquivados?: string;
  ordem?: string;
  pagina?: number;
};

/** Colunas que a tabela deixa ordenar. Lista fechada: `order` vai para o SQL. */
const ORDENAVEIS: Record<string, string> = {
  codigo: 'codigo',
  titulo: 'titulo',
  criado: 'criado_em',
  editado: 'atualizado_em',
  paginas: 'total_paginas',
  status: 'status',
};

export type PainelProjetos = {
  projetos: ProjetoDaLista[];
  total: number;
  cards: {
    abertos: number;
    aguardandoFinalizacao: number;
    finalizadosHoje: number;
    comProblema: number;
    semPedido: number;
    bytes: number;
  };
  /** Existe algum projeto na loja, fora deste recorte? Distingue "não há
   *  nenhum" de "nenhum neste filtro". */
  temAlgum: boolean;
};

export async function listarProjetos(
  lojistaId: string,
  f: FiltrosProjetos = {},
): Promise<PainelProjetos> {
  const supabase = await createClient();
  const texto = f.busca ? limpar(f.busca) : '';

  /* A busca é universal: um campo só que acha por código, nome do projeto,
   * cliente, e-mail, pedido ou produto. Isso é um OU entre colunas de tabelas
   * diferentes, e o PostgREST não monta `or` atravessando um recurso embutido
   * — dois `.or()` viram um E e devolvem quase nada. A função `projetos_busca`
   * resolve no banco e devolve os ids, e a consulta principal continua
   * paginando normalmente. */
  let idsDaBusca: string[] | null = null;
  if (texto) {
    const { data } = await supabase.rpc('projetos_busca', { loja: lojistaId, termo: texto });
    idsDaBusca = ((data ?? []) as string[]) ?? [];
    // Nenhum id: a lista é vazia e nem vale ir ao banco de novo.
    if (idsDaBusca.length === 0) {
      return {
        projetos: [],
        total: 0,
        cards: await cardsDeProjetos(lojistaId),
        temAlgum: true,
      };
    }
  }

  const selecao =
    'id, codigo, titulo, status, produto_nome, produto_tamanho, total_paginas, ' +
    'fotos_enviadas, fotos_usadas, capa_url, bytes_total, criado_em, atualizado_em, ' +
    'arquivado_em, clientes(id, nome, email)';

  let q = supabase
    .from('projetos')
    .select(selecao, { count: 'exact' })
    .eq('lojista_id', lojistaId);

  // Arquivado é soft delete: fica fora a menos que se peça.
  q = f.arquivados === 'sim' ? q.not('arquivado_em', 'is', null) : q.is('arquivado_em', null);

  if (f.status) q = q.eq('status', f.status);
  if (f.cliente) q = q.eq('cliente_id', f.cliente);
  if (f.filial) q = q.eq('filial_id', f.filial);
  if (f.produto) q = q.eq('produto_nome', f.produto);
  if (f.criadoDe) q = q.gte('criado_em', f.criadoDe);
  // A coluna é timestamp e o filtro é uma data: sem o fim do dia, "até hoje"
  // descartaria tudo o que entrou hoje.
  if (f.criadoAte) q = q.lte('criado_em', `${f.criadoAte}T23:59:59.999`);
  if (f.editadoDe) q = q.gte('atualizado_em', f.editadoDe);
  if (f.capa === 'com') q = q.not('capa_url', 'is', null);
  if (f.capa === 'sem') q = q.is('capa_url', null);

  if (idsDaBusca) q = q.in('id', idsDaBusca);

  const coluna = ORDENAVEIS[(f.ordem ?? '').replace(/^-/, '')] ?? 'atualizado_em';
  const desc = (f.ordem ?? '').startsWith('-') || !f.ordem;

  const pagina = Math.max(0, f.pagina ?? 0);
  const inicio = pagina * PROJETOS_POR_PAGINA;

  const [lista, cards, algum] = await Promise.all([
    q.order(coluna, { ascending: !desc }).range(inicio, inicio + PROJETOS_POR_PAGINA - 1),
    cardsDeProjetos(lojistaId),
    supabase.from('projetos').select('id', { count: 'exact', head: true }).eq('lojista_id', lojistaId),
  ]);

  const linhas = (lista.data ?? []) as unknown as ProjetoDaLista[];

  // Pedido e renderização vêm em consultas próprias, pelos ids da página: são
  // relações de outras entidades e embutir tudo num único select faria o
  // PostgREST devolver uma árvore que a paginação não sabe contar.
  const ids = linhas.map((p) => p.id);
  const [pedidos, renders] = await Promise.all([
    pedidoDosProjetos(ids),
    renderDosProjetos(ids),
  ]);

  return {
    projetos: linhas.map((p) => ({
      ...p,
      pedido: pedidos[p.id] ?? null,
      render: renders[p.id] ?? null,
    })),
    total: lista.count ?? 0,
    cards,
    temAlgum: (algum.count ?? 0) > 0,
  };
}

/**
 * O pedido de cada projeto, quando existe.
 *
 * A ligação é `pedido_itens.projeto_id`, não uma coluna em `projetos` — é o
 * que permite um pedido ter vários projetos e um projeto existir sem nenhum.
 */
export async function pedidoDosProjetos(
  projetoIds: string[],
): Promise<Record<string, { id: string; codigo: string | null; numero: number }>> {
  if (!projetoIds.length) return {};
  const supabase = await createClient();
  const { data } = await supabase
    .from('pedido_itens')
    .select('projeto_id, pedidos(id, codigo, numero)')
    .in('projeto_id', projetoIds);

  const mapa: Record<string, { id: string; codigo: string | null; numero: number }> = {};
  for (const l of (data ?? []) as unknown as {
    projeto_id: string;
    pedidos: { id: string; codigo: string | null; numero: number } | null;
  }[]) {
    if (l.pedidos && !mapa[l.projeto_id]) mapa[l.projeto_id] = l.pedidos;
  }
  return mapa;
}

/** O estado do job de renderização mais recente de cada projeto. */
export async function renderDosProjetos(
  projetoIds: string[],
): Promise<Record<string, EstadoRender>> {
  if (!projetoIds.length) return {};
  const supabase = await createClient();
  const { data } = await supabase
    .from('render_jobs')
    .select('projeto_id, estado, criado_em')
    .in('projeto_id', projetoIds)
    .order('criado_em', { ascending: false });

  const mapa: Record<string, EstadoRender> = {};
  for (const j of (data ?? []) as unknown as { projeto_id: string; estado: EstadoRender }[]) {
    if (!mapa[j.projeto_id]) mapa[j.projeto_id] = j.estado;
  }
  return mapa;
}

/**
 * Os seis números do topo da Central.
 *
 * Contagens com `head: true` — o painel não precisa das linhas, só de quantas
 * são, e trazer 5.000 projetos para contar no navegador seria desperdício.
 */
async function cardsDeProjetos(lojistaId: string): Promise<PainelProjetos['cards']> {
  const supabase = await createClient();
  const conta = (aplicar: (q: ReturnType<typeof base>) => ReturnType<typeof base>) =>
    aplicar(base());
  const base = () =>
    supabase
      .from('projetos')
      .select('id', { count: 'exact', head: true })
      .eq('lojista_id', lojistaId)
      .is('arquivado_em', null);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const [abertos, aguardando, finalizados, comProblema, ativos, comPedido] =
    await Promise.all([
      conta((q) => q.in('status', ['nao_iniciado', 'em_edicao'])),
      conta((q) => q.in('status', ['aguardando_cliente', 'pronto', 'com_pendencias'])),
      conta((q) => q.in('status', ['finalizado', 'fechado']).gte('atualizado_em', hoje.toISOString())),
      conta((q) => q.eq('status', 'com_erro')),
      /* Ids e tamanho dos projetos vivos. Precisa da lista, não só da contagem,
       * porque "sem pedido" é uma diferença de conjuntos — e subtrair contagens
       * erraria: `pedido_itens` também aponta para projeto arquivado, que não
       * entra neste total. */
      supabase
        .from('projetos')
        .select('id, bytes_total')
        .eq('lojista_id', lojistaId)
        .is('arquivado_em', null)
        .limit(TETO_PROJETOS),
      supabase.from('pedido_itens').select('projeto_id').not('projeto_id', 'is', null),
    ]);

  const vivos = (ativos.data ?? []) as { id: string; bytes_total: number | null }[];
  // A RLS já limitou `pedido_itens` à loja, então o que sobrou é desta loja.
  const comPedidoIds = new Set(
    ((comPedido.data ?? []) as { projeto_id: string | null }[])
      .map((l) => l.projeto_id)
      .filter(Boolean) as string[],
  );

  return {
    abertos: abertos.count ?? 0,
    aguardandoFinalizacao: aguardando.count ?? 0,
    finalizadosHoje: finalizados.count ?? 0,
    comProblema: comProblema.count ?? 0,
    semPedido: vivos.filter((p) => !comPedidoIds.has(p.id)).length,
    bytes: vivos.reduce((t, p) => t + (p.bytes_total ?? 0), 0),
  };
}

/** Clientes e produtos que aparecem nos projetos — alimenta os filtros. */
export async function opcoesDeFiltro(lojistaId: string): Promise<{
  clientes: { valor: string; rotulo: string }[];
  produtos: { valor: string; rotulo: string }[];
  filiais: { valor: string; rotulo: string }[];
}> {
  const supabase = await createClient();
  const [projetos, filiais] = await Promise.all([
    supabase
      .from('projetos')
      .select('produto_nome, clientes(id, nome)')
      .eq('lojista_id', lojistaId)
      .is('arquivado_em', null)
      .limit(2000),
    supabase.from('filiais').select('id, nome').eq('lojista_id', lojistaId).eq('ativo', true),
  ]);

  const clientes = new Map<string, string>();
  const produtos = new Set<string>();
  for (const p of (projetos.data ?? []) as unknown as {
    produto_nome: string | null;
    clientes: { id: string; nome: string | null } | null;
  }[]) {
    if (p.clientes?.id) clientes.set(p.clientes.id, p.clientes.nome ?? 'sem nome');
    if (p.produto_nome) produtos.add(p.produto_nome);
  }

  const ordenar = (a: { rotulo: string }, b: { rotulo: string }) =>
    a.rotulo.localeCompare(b.rotulo, 'pt-BR');

  return {
    clientes: [...clientes].map(([valor, rotulo]) => ({ valor, rotulo })).sort(ordenar),
    produtos: [...produtos].map((v) => ({ valor: v, rotulo: v })).sort(ordenar),
    filiais: ((filiais.data ?? []) as { id: string; nome: string }[])
      .map((f) => ({ valor: f.id, rotulo: f.nome }))
      .sort(ordenar),
  };
}

// ---------------------------------------------------------------------------
// Detalhe do projeto — /projetos/:id
// ---------------------------------------------------------------------------

export type ArquivoDoProjeto = {
  id: string;
  tipo: string;
  nome: string;
  caminho: string;
  bucket: string;
  mime: string | null;
  bytes: number;
  checksum: string | null;
  versao: number;
  estado: string;
  criado_em: string;
};

export type VersaoDoProjeto = {
  id: string;
  versao: number;
  motivo: string | null;
  bytes: number;
  criado_em: string;
};

export type ValidacaoDoProjeto = {
  id: string;
  regra: string;
  severidade: 'informacao' | 'aviso' | 'erro';
  pagina: number | null;
  elemento: string | null;
  descricao: string;
  recomendacao: string | null;
};

export type EventoDoProjeto = {
  id: string;
  descricao: string;
  autor: string | null;
  criado_em: string;
};

export type JobDoProjeto = {
  id: string;
  estado: string;
  etapa: string;
  progresso: number;
  tentativa: number;
  erro_mensagem: string | null;
  criado_em: string;
  concluido_em: string | null;
};

export type ProjetoCompleto = {
  projeto: {
    id: string;
    codigo: string | null;
    titulo: string;
    status: string;
    produto_nome: string | null;
    produto_tamanho: string | null;
    formato_aberto: string | null;
    formato_fechado: string | null;
    largura_mm: number | null;
    altura_mm: number | null;
    total_paginas: number | null;
    fotos_enviadas: number | null;
    fotos_usadas: number | null;
    capa_url: string | null;
    capa_tipo: string | null;
    dorso_mm: number | null;
    bytes_total: number | null;
    progresso: number | null;
    avisos: unknown;
    criado_em: string;
    atualizado_em: string;
    finalizado_em: string | null;
    fechado_em: string | null;
    arquivado_em: string | null;
    clientes: { id: string; nome: string | null; email: string | null } | null;
    galerias: { id: string; nome: string | null } | null;
    filiais: { id: string; nome: string } | null;
  };
  pedido: { id: string; codigo: string | null; numero: number; estado: string } | null;
  arquivos: ArquivoDoProjeto[];
  versoes: VersaoDoProjeto[];
  validacoes: ValidacaoDoProjeto[];
  eventos: EventoDoProjeto[];
  jobs: JobDoProjeto[];
};

/**
 * Tudo o que a tela de detalhe mostra, em uma ida só.
 *
 * As seis abas leem de tabelas diferentes de propósito: arquivo, versão,
 * validação e job de renderização são entidades próprias, não campos do
 * projeto. Buscar tudo junto aqui evita seis viagens ao banco quando o lojista
 * troca de aba.
 */
export async function getProjeto(
  lojistaId: string,
  id: string,
): Promise<ProjetoCompleto | null> {
  const supabase = await createClient();

  const { data: projeto } = await supabase
    .from('projetos')
    .select(
      'id, codigo, titulo, status, produto_nome, produto_tamanho, formato_aberto, ' +
        'formato_fechado, largura_mm, altura_mm, total_paginas, fotos_enviadas, ' +
        'fotos_usadas, capa_url, capa_tipo, dorso_mm, bytes_total, progresso, avisos, ' +
        'criado_em, atualizado_em, finalizado_em, fechado_em, arquivado_em, ' +
        'clientes(id, nome, email), galerias(id, nome), filiais(id, nome)',
    )
    .eq('lojista_id', lojistaId)
    .eq('id', id)
    .maybeSingle();

  // A RLS já limita ao projeto da própria loja; ausente aqui significa 404.
  if (!projeto) return null;

  const [arquivos, versoes, validacoes, eventos, jobs, pedidos] = await Promise.all([
    supabase
      .from('projeto_arquivos')
      .select('id, tipo, nome, caminho, bucket, mime, bytes, checksum, versao, estado, criado_em')
      .eq('projeto_id', id)
      .is('removido_em', null)
      .order('criado_em', { ascending: false }),
    supabase
      .from('projeto_versoes')
      .select('id, versao, motivo, bytes, criado_em')
      .eq('projeto_id', id)
      .order('versao', { ascending: false }),
    supabase
      .from('projeto_validacoes')
      .select('id, regra, severidade, pagina, elemento, descricao, recomendacao')
      .eq('projeto_id', id)
      .order('severidade', { ascending: true }),
    supabase
      .from('projeto_eventos')
      .select('id, descricao, autor, criado_em')
      .eq('projeto_id', id)
      .order('criado_em', { ascending: false })
      .limit(200),
    supabase
      .from('render_jobs')
      .select('id, estado, etapa, progresso, tentativa, erro_mensagem, criado_em, concluido_em')
      .eq('projeto_id', id)
      .order('criado_em', { ascending: false }),
    pedidoDosProjetosComEstado([id]),
  ]);

  return {
    projeto: projeto as unknown as ProjetoCompleto['projeto'],
    pedido: pedidos[id] ?? null,
    arquivos: (arquivos.data ?? []) as unknown as ArquivoDoProjeto[],
    versoes: (versoes.data ?? []) as unknown as VersaoDoProjeto[],
    validacoes: (validacoes.data ?? []) as unknown as ValidacaoDoProjeto[],
    eventos: (eventos.data ?? []) as unknown as EventoDoProjeto[],
    jobs: (jobs.data ?? []) as unknown as JobDoProjeto[],
  };
}

/** Como `pedidoDosProjetos`, mas trazendo o estado — o detalhe mostra. */
async function pedidoDosProjetosComEstado(
  projetoIds: string[],
): Promise<Record<string, { id: string; codigo: string | null; numero: number; estado: string }>> {
  if (!projetoIds.length) return {};
  const supabase = await createClient();
  const { data } = await supabase
    .from('pedido_itens')
    .select('projeto_id, pedidos(id, codigo, numero, estado)')
    .in('projeto_id', projetoIds);

  const mapa: Record<string, { id: string; codigo: string | null; numero: number; estado: string }> = {};
  for (const l of (data ?? []) as unknown as {
    projeto_id: string;
    pedidos: { id: string; codigo: string | null; numero: number; estado: string } | null;
  }[]) {
    if (l.pedidos && !mapa[l.projeto_id]) mapa[l.projeto_id] = l.pedidos;
  }
  return mapa;
}

/**
 * URL assinada de um arquivo do projeto.
 *
 * Regra 21: o bucket é privado e a URL vale por uma hora. Nada de link
 * permanente — um endereço que nunca expira é um vazamento com data marcada.
 */
export async function urlAssinada(
  bucket: string,
  caminho: string,
  segundos = 3600,
): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.storage.from(bucket).createSignedUrl(caminho, segundos);
  return data?.signedUrl ?? null;
}
