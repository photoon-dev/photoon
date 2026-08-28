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
  galerias: { id: string; nome: string; galeria_fotos: { count: number }[] }[];
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
        'galerias(id, nome, galeria_fotos(count)), ' +
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

export async function getLojistaPorId(id: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('lojistas')
    .select(
      'id, slug, nome, logo_url, cor_primaria, cor_secundaria, descricao, ' +
        'telefone_suporte, email_suporte, url_politica, url_contato, ativo',
    )
    .eq('id', id)
    .maybeSingle();
  return data;
}
