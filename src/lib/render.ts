import { createClient } from '@/lib/supabase/server';
import {
  EM_ANDAMENTO,
  JOBS_POR_PAGINA,
  type JobDaLista,
} from '@/lib/render-termos';

/**
 * Leitura da fila de renderização (migração 0015).
 *
 * RENDERIZAÇÃO é entidade própria: o job aponta para o PROJETO, e o pedido é
 * opcional — projeto sem pedido também se renderiza (prévia, prova de capa).
 * Por isso nada aqui parte de `pedidos`.
 *
 * A tela não executa renderização nenhuma: ela lê a fila e enfileira. Quem
 * renderiza é o worker, fora da requisição HTTP (regra 9 do briefing).
 */

export * from '@/lib/render-termos';

export type FiltrosRender = {
  busca?: string;
  estado?: string;
  projeto?: string;
  pedido?: string;
  worker?: string;
  de?: string;
  ate?: string;
  ordem?: string;
  pagina?: number;
};

const limpar = (s: string) => s.replace(/[,()%*\\]/g, ' ').trim();

const ORDENAVEIS: Record<string, string> = {
  criado: 'criado_em',
  iniciado: 'iniciado_em',
  estado: 'estado',
  progresso: 'progresso',
  tentativa: 'tentativa',
};

const SELECAO =
  'id, estado, etapa, progresso, tentativa, destino, erro_codigo, erro_mensagem, ' +
  'criado_em, iniciado_em, concluido_em, ' +
  'projetos(id, codigo, titulo, produto_nome, clientes(id, nome)), ' +
  'pedidos(id, codigo, numero), render_workers(id, nome)';

export type ServicoDeRender = {
  /** Um worker que deu sinal nos últimos dois minutos está vivo. */
  online: boolean;
  ativos: number;
  total: number;
  ultimaFalha: string | null;
  ultimoConcluido: string | null;
};

export type PainelRender = {
  jobs: JobDaLista[];
  total: number;
  cards: {
    naFila: number;
    processando: number;
    prontos: number;
    comErro: number;
    /** Segundos, mediana dos jobs concluídos nas últimas 24 h. */
    tempoMedio: number | null;
    ultimas24h: number;
  };
  servico: ServicoDeRender;
  temAlgum: boolean;
};

export async function listarJobs(
  lojistaId: string,
  f: FiltrosRender = {},
): Promise<PainelRender> {
  const supabase = await createClient();

  let q = supabase
    .from('render_jobs')
    .select(SELECAO, { count: 'exact' })
    .eq('lojista_id', lojistaId);

  if (f.estado === 'erro') q = q.eq('estado', 'erro');
  else if (f.estado === 'andamento') q = q.in('estado', EM_ANDAMENTO);
  else if (f.estado) q = q.eq('estado', f.estado);

  if (f.projeto) q = q.eq('projeto_id', f.projeto);
  if (f.pedido) q = q.eq('pedido_id', f.pedido);
  if (f.worker) q = q.eq('worker_id', f.worker);
  if (f.de) q = q.gte('criado_em', f.de);
  if (f.ate) q = q.lte('criado_em', `${f.ate}T23:59:59.999`);

  // A busca aqui é por código do projeto: é o que o operador tem à mão quando
  // alguém liga perguntando de um arquivo.
  const texto = f.busca ? limpar(f.busca) : '';
  if (texto) {
    q = q.ilike('projetos.codigo', `${texto}%`);
  }

  const coluna = ORDENAVEIS[(f.ordem ?? '').replace(/^-/, '')] ?? 'criado_em';
  const desc = (f.ordem ?? '').startsWith('-') || !f.ordem;
  const pagina = Math.max(0, f.pagina ?? 0);
  const inicio = pagina * JOBS_POR_PAGINA;

  const [lista, cards, servico, algum] = await Promise.all([
    q.order(coluna, { ascending: !desc }).range(inicio, inicio + JOBS_POR_PAGINA - 1),
    cardsDeRender(lojistaId),
    estadoDoServico(lojistaId),
    supabase.from('render_jobs').select('id', { count: 'exact', head: true }).eq('lojista_id', lojistaId),
  ]);

  return {
    jobs: (lista.data ?? []) as unknown as JobDaLista[],
    total: lista.count ?? 0,
    cards,
    servico,
    temAlgum: (algum.count ?? 0) > 0,
  };
}

async function cardsDeRender(lojistaId: string): Promise<PainelRender['cards']> {
  const supabase = await createClient();
  const base = () =>
    supabase.from('render_jobs').select('id', { count: 'exact', head: true }).eq('lojista_id', lojistaId);

  const ontem = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const [naFila, processando, prontos, comErro, ultimas24h, concluidos] = await Promise.all([
    base().eq('estado', 'na_fila'),
    base().in('estado', EM_ANDAMENTO),
    base().in('estado', ['pronto', 'entregue']),
    base().eq('estado', 'erro'),
    base().gte('criado_em', ontem),
    supabase
      .from('render_jobs')
      .select('iniciado_em, concluido_em')
      .eq('lojista_id', lojistaId)
      .not('concluido_em', 'is', null)
      .not('iniciado_em', 'is', null)
      .gte('concluido_em', ontem)
      .limit(500),
  ]);

  /* Mediana, não média: um job travado de duas horas puxa a média para um
   * número que não descreve nenhuma renderização real. */
  const duracoes = ((concluidos.data ?? []) as { iniciado_em: string; concluido_em: string }[])
    .map((j) => (new Date(j.concluido_em).getTime() - new Date(j.iniciado_em).getTime()) / 1000)
    .filter((s) => s >= 0)
    .sort((a, b) => a - b);

  return {
    naFila: naFila.count ?? 0,
    processando: processando.count ?? 0,
    prontos: prontos.count ?? 0,
    comErro: comErro.count ?? 0,
    tempoMedio: duracoes.length ? Math.round(duracoes[Math.floor(duracoes.length / 2)]) : null,
    ultimas24h: ultimas24h.count ?? 0,
  };
}

/**
 * Estado do serviço de renderização.
 *
 * "Online" é medido, não declarado: um worker que não dá sinal há dois minutos
 * está fora, mesmo que a coluna `estado` ainda diga outra coisa — processo
 * morto não atualiza a própria linha.
 */
export async function estadoDoServico(lojistaId: string): Promise<ServicoDeRender> {
  const supabase = await createClient();
  const limite = new Date(Date.now() - 2 * 60 * 1000).toISOString();

  const [workers, falha, concluido] = await Promise.all([
    supabase.from('render_workers').select('id, estado, visto_em'),
    supabase
      .from('render_jobs')
      .select('criado_em')
      .eq('lojista_id', lojistaId)
      .eq('estado', 'erro')
      .order('criado_em', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('render_jobs')
      .select('concluido_em')
      .eq('lojista_id', lojistaId)
      .not('concluido_em', 'is', null)
      .order('concluido_em', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const lista = (workers.data ?? []) as { id: string; estado: string; visto_em: string }[];
  const vivos = lista.filter((w) => w.visto_em >= limite);

  return {
    online: vivos.length > 0,
    ativos: vivos.length,
    total: lista.length,
    ultimaFalha: (falha.data as { criado_em: string } | null)?.criado_em ?? null,
    ultimoConcluido: (concluido.data as { concluido_em: string } | null)?.concluido_em ?? null,
  };
}

// ---------------------------------------------------------------------------
// Detalhe do job — /renderizacao/:id
// ---------------------------------------------------------------------------

export type LinhaDeLog = {
  id: string;
  etapa: string | null;
  severidade: string;
  mensagem: string;
  criado_em: string;
};

export type JobCompleto = {
  job: JobDaLista & { erro_stack: string | null; lojista_id: string; projeto_id: string };
  logs: LinhaDeLog[];
  arquivos: {
    id: string;
    tipo: string;
    nome: string;
    bytes: number;
    checksum: string | null;
    estado: string;
    bucket: string;
    caminho: string;
  }[];
};

export async function getJob(lojistaId: string, id: string): Promise<JobCompleto | null> {
  const supabase = await createClient();

  const { data: job } = await supabase
    .from('render_jobs')
    .select(`${SELECAO}, erro_stack, lojista_id, projeto_id`)
    .eq('lojista_id', lojistaId)
    .eq('id', id)
    .maybeSingle();

  if (!job) return null;
  const j = job as unknown as JobCompleto['job'];

  const [logs, arquivos] = await Promise.all([
    supabase
      .from('render_logs')
      .select('id, etapa, severidade, mensagem, criado_em')
      .eq('job_id', id)
      .order('criado_em', { ascending: true })
      .limit(500),
    supabase
      .from('projeto_arquivos')
      .select('id, tipo, nome, bytes, checksum, estado, bucket, caminho')
      .eq('projeto_id', j.projeto_id)
      .eq('tipo', 'renderizado')
      .is('removido_em', null)
      .order('criado_em', { ascending: false }),
  ]);

  return {
    job: j,
    logs: (logs.data ?? []) as unknown as LinhaDeLog[],
    arquivos: (arquivos.data ?? []) as unknown as JobCompleto['arquivos'],
  };
}

/** Workers cadastrados, para o filtro. */
export async function listarWorkers(): Promise<{ valor: string; rotulo: string }[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('render_workers').select('id, nome').order('nome');
  return ((data ?? []) as { id: string; nome: string }[]).map((w) => ({
    valor: w.id,
    rotulo: w.nome,
  }));
}
