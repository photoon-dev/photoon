import { createClient } from '@/lib/supabase/server';

export type PerfilCliente = {
  id: string;
  nome: string | null;
  telefone: string | null;
  avatar_url: string | null;
  email: string;
  loja: { id: string; nome: string; slug: string } | null;
  desde: string;
};

/**
 * Perfil do cliente na loja atual.
 *
 * A pessoa pode ser cliente de várias lojas com o mesmo e-mail — a linha em
 * `clientes` é por loja, e é dela que vem nome, telefone e foto. O e-mail vem
 * da sessão, porque é ele que autentica.
 */
export async function perfilDoCliente(lojistaId: string): Promise<PerfilCliente | null> {
  const supabase = await createClient();
  const { data: sessao } = await supabase.auth.getUser();
  if (!sessao.user) return null;

  /*
   * A foto de perfil depende da migração 0011. Enquanto ela não roda, pedir a
   * coluna faz a consulta inteira falhar e a tela de conta cai — por causa de
   * um campo opcional. Aqui a segunda tentativa vem sem ele.
   */
  const campos = 'id, nome, telefone, criado_em, lojistas(id, nome, slug)';
  let { data, error } = await supabase
    .from('clientes')
    .select(`${campos}, avatar_url`)
    .eq('lojista_id', lojistaId)
    .eq('user_id', sessao.user.id)
    .maybeSingle();

  if (error) {
    ({ data } = await supabase
      .from('clientes')
      .select(campos)
      .eq('lojista_id', lojistaId)
      .eq('user_id', sessao.user.id)
      .maybeSingle());
  }

  if (!data) return null;
  const l = (data as unknown as { lojistas: { id: string; nome: string; slug: string } | null }).lojistas;

  return {
    id: data.id as string,
    nome: (data.nome as string | null) ?? null,
    telefone: (data.telefone as string | null) ?? null,
    avatar_url: ((data as Record<string, unknown>).avatar_url as string | null) ?? null,
    email: sessao.user.email ?? '',
    loja: l ? { id: l.id, nome: l.nome, slug: l.slug } : null,
    desde: data.criado_em as string,
  };
}

/** Números do cliente nesta loja, para a tela de conta. */
export async function resumoDoCliente(clienteId: string) {
  const supabase = await createClient();
  const [projetos, galerias] = await Promise.all([
    supabase.from('projetos').select('id, status, progresso').eq('cliente_id', clienteId),
    supabase.from('galerias').select('id').eq('cliente_id', clienteId),
  ]);
  const lista = projetos.data ?? [];
  return {
    projetos: lista.length,
    prontos: lista.filter((p) => p.status === 'pronto').length,
    emAndamento: lista.filter((p) => p.status !== 'pronto').length,
    galerias: (galerias.data ?? []).length,
  };
}

// ---------------------------------------------------------------------------
// Minha conta — tudo o que a tela do design precisa
// ---------------------------------------------------------------------------

export type EnderecoCliente = {
  cep?: string;
  rua?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  quem_recebe?: string;
};

export type DocumentosCliente = {
  cpf: string | null;
  rg: string | null;
  orgao_emissor: string | null;
  nome_mae: string | null;
};

export type CompraDoCliente = {
  id: string;
  numero: number;
  estado: string;
  total: number;
  criado_em: string;
  descricao: string;
};

export type SessaoDoCliente = {
  id: string;
  criada_em: string;
  atualizada_em: string;
  agente: string | null;
  ip: string | null;
  esta_sessao: boolean;
};

export type ContaDoCliente = {
  apelido: string | null;
  nascimento: string | null;
  turma: string | null;
  endereco: EnderecoCliente;
  documentos: DocumentosCliente | null;
  compras: CompraDoCliente[];
  sessoes: SessaoDoCliente[];
  /** true enquanto a migração 0013 não tiver rodado. */
  faltaMigracao: boolean;
};

/**
 * O resto da conta: campos novos, documentos, compras e sessões.
 *
 * Tudo aqui depende da migração 0013 — menos as compras. Como em
 * `perfilDoCliente`, um campo que ainda não existe não pode derrubar a tela
 * inteira: cada pedaço falha sozinho e a tela mostra o que tem, avisando o que
 * falta. É o mesmo cuidado que a 0011 já pedia para a foto de perfil.
 */
export async function contaDoCliente(clienteId: string): Promise<ContaDoCliente> {
  const supabase = await createClient();

  const [extras, docs, pedidos, sessoes] = await Promise.all([
    supabase.from('clientes').select('apelido, nascimento, turma, endereco').eq('id', clienteId).maybeSingle(),
    supabase.from('cliente_documentos').select('cpf, rg, orgao_emissor, nome_mae').eq('cliente_id', clienteId).maybeSingle(),
    supabase
      .from('pedidos')
      .select('id, numero, estado, total, criado_em, pedido_itens(descricao)')
      .eq('cliente_id', clienteId)
      .order('criado_em', { ascending: false })
      .limit(50),
    supabase.rpc('minhas_sessoes'),
  ]);

  const linhas = (pedidos.data ?? []) as unknown as (CompraDoCliente & {
    pedido_itens: { descricao: string }[] | null;
  })[];

  return {
    apelido: (extras.data?.apelido as string | null) ?? null,
    nascimento: (extras.data?.nascimento as string | null) ?? null,
    turma: (extras.data?.turma as string | null) ?? null,
    endereco: ((extras.data?.endereco as EnderecoCliente | null) ?? {}) as EnderecoCliente,
    documentos: (docs.data as DocumentosCliente | null) ?? null,
    compras: linhas.map((p) => ({
      id: p.id,
      numero: p.numero,
      estado: p.estado,
      total: Number(p.total) || 0,
      criado_em: p.criado_em,
      // Sem item legível (o cliente não lê `pedido_itens` em toda loja), o
      // número do pedido já diz o suficiente para ele achar a compra.
      descricao: p.pedido_itens?.map((i) => i.descricao).filter(Boolean).join(' · ') || 'Pedido da loja',
    })),
    sessoes: ((sessoes.data ?? []) as SessaoDoCliente[]).map((s) => ({ ...s })),
    faltaMigracao: Boolean(extras.error),
  };
}
