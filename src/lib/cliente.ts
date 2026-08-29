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
