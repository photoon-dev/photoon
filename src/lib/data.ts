import 'server-only';
import { createClient } from '@/lib/supabase/server';

export type Lojista = {
  id: string;
  slug: string;
  nome: string;
  logo_url: string | null;
  cor_primaria: string | null;
};

export type Projeto = {
  id: string;
  titulo: string;
  status: 'rascunho' | 'em_edicao' | 'enviado' | 'em_producao' | 'concluido';
  capa_url: string | null;
  total_paginas: number;
  atualizado_em: string;
};

/** Dados publicos do lojista dono do subdominio. */
export async function getLojista(slug: string): Promise<Lojista | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('lojistas')
    .select('id, slug, nome, logo_url, cor_primaria')
    .eq('slug', slug)
    .eq('ativo', true)
    .maybeSingle();
  return data;
}

/**
 * Garante que o usuario logado tem vinculo de cliente com este lojista.
 * Chamado ao entrar em /meus-projetos. Devolve o cliente.id.
 */
export async function garantirCliente(lojistaId: string): Promise<string | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: existente } = await supabase
    .from('clientes')
    .select('id')
    .eq('user_id', user.id)
    .eq('lojista_id', lojistaId)
    .maybeSingle();
  if (existente) return existente.id;

  const { data: criado } = await supabase
    .from('clientes')
    .insert({
      user_id: user.id,
      lojista_id: lojistaId,
      nome: (user.user_metadata?.nome as string) ?? null,
    })
    .select('id')
    .single();
  return criado?.id ?? null;
}

export async function listarProjetos(clienteId: string): Promise<Projeto[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('projetos')
    .select('id, titulo, status, capa_url, total_paginas, atualizado_em')
    .eq('cliente_id', clienteId)
    .order('atualizado_em', { ascending: false });
  return data ?? [];
}

export async function getProjeto(id: string): Promise<Projeto | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('projetos')
    .select('id, titulo, status, capa_url, total_paginas, atualizado_em')
    .eq('id', id)
    .maybeSingle();
  return data;
}
