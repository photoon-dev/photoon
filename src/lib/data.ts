import 'server-only';
import { createClient } from '@/lib/supabase/server';

export type Lojista = {
  id: string;
  slug: string;
  nome: string;
  logo_url: string | null;
  cor_primaria: string | null;
  telefone_suporte: string | null;
  email_suporte: string | null;
  url_politica: string | null;
  url_contato: string | null;
};

export type StatusProjeto =
  | 'nao_iniciado'
  | 'em_edicao'
  | 'com_pendencias'
  | 'pronto'
  | 'finalizado';

export type Aviso = {
  titulo: string;
  descricao?: string;
  nivel?: 'obrigatoria' | 'recomendacao';
  acao?: string;
};

export type Evento = { id: string; descricao: string; autor: string | null; criado_em: string };

export type Projeto = {
  id: string;
  titulo: string;
  status: StatusProjeto;
  produto_nome: string | null;
  produto_tamanho: string | null;
  preco_estimado: number | null;
  progresso: number;
  avisos: Aviso[];
  capa_url: string | null;
  total_paginas: number;
  atualizado_em: string;
  galeria_id: string | null;
  paginas: unknown[];
  fotos_usadas: number;
};

export type Galeria = {
  id: string;
  nome: string;
  max_albuns: number;
  atualizada_em: string;
  total_fotos: number;
};

export type Cliente = { id: string; nome: string | null; email: string };

export type Foto = {
  id: string;
  storage_path: string;
  largura: number | null;
  altura: number | null;
  /** URL assinada (bucket privado), valida por algumas horas. */
  url: string;
};

const CAMPOS_PROJETO =
  'id, titulo, status, produto_nome, produto_tamanho, preco_estimado, progresso, avisos, ' +
  'capa_url, total_paginas, atualizado_em, galeria_id, paginas, projeto_fotos(count)';

type LinhaProjeto = Omit<Projeto, 'avisos' | 'fotos_usadas'> & {
  avisos: Aviso[] | null;
  projeto_fotos: { count: number }[] | null;
};

function normalizaProjeto(linha: LinhaProjeto): Projeto {
  return {
    ...linha,
    avisos: linha.avisos ?? [],
    fotos_usadas: linha.projeto_fotos?.[0]?.count ?? 0,
  };
}

/** Dados publicos do lojista dono do subdominio (lidos antes do login). */
export async function getLojista(slug: string): Promise<Lojista | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('lojistas')
    .select(
      'id, slug, nome, logo_url, cor_primaria, telefone_suporte, email_suporte, url_politica, url_contato',
    )
    .eq('slug', slug)
    .eq('ativo', true)
    .maybeSingle();
  return data;
}

/**
 * Garante o vinculo cliente <-> lojista do usuario logado.
 * E o que faz o link compartilhado pelo lojista funcionar no primeiro acesso.
 */
export async function garantirCliente(lojistaId: string): Promise<Cliente | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const email = user.email ?? '';

  const { data: existente } = await supabase
    .from('clientes')
    .select('id, nome')
    .eq('user_id', user.id)
    .eq('lojista_id', lojistaId)
    .maybeSingle();
  if (existente) return { ...existente, email };

  const { data: criado } = await supabase
    .from('clientes')
    .insert({
      user_id: user.id,
      lojista_id: lojistaId,
      nome: (user.user_metadata?.nome as string) ?? null,
    })
    .select('id, nome')
    .single();

  return criado ? { ...criado, email } : null;
}

export async function listarProjetos(clienteId: string): Promise<Projeto[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('projetos')
    .select(CAMPOS_PROJETO)
    .eq('cliente_id', clienteId)
    .order('atualizado_em', { ascending: false });
  return ((data ?? []) as unknown as LinhaProjeto[]).map(normalizaProjeto);
}

export async function getProjeto(id: string): Promise<Projeto | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('projetos').select(CAMPOS_PROJETO).eq('id', id).maybeSingle();
  return data ? normalizaProjeto(data as unknown as LinhaProjeto) : null;
}

/** Galeria liberada pelo lojista para este cliente (a mais recente). */
export async function getGaleria(clienteId: string): Promise<Galeria | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('galerias')
    .select('id, nome, max_albuns, atualizada_em, galeria_fotos(count)')
    .eq('cliente_id', clienteId)
    .order('atualizada_em', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data) return null;
  const { galeria_fotos, ...resto } = data as typeof data & {
    galeria_fotos: { count: number }[] | null;
  };
  return { ...resto, total_fotos: galeria_fotos?.[0]?.count ?? 0 };
}

export async function contarNaoLidas(clienteId: string): Promise<number> {
  const supabase = await createClient();
  const { count } = await supabase
    .from('notificacoes')
    .select('id', { count: 'exact', head: true })
    .eq('cliente_id', clienteId)
    .eq('lida', false);
  return count ?? 0;
}

export async function listarEventos(projetoId: string, limite = 5): Promise<Evento[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('projeto_eventos')
    .select('id, descricao, autor, criado_em')
    .eq('projeto_id', projetoId)
    .order('criado_em', { ascending: false })
    .limit(limite);
  return data ?? [];
}

/** Galeria vinculada a um projeto especifico. */
export async function getGaleriaPorId(id: string): Promise<Galeria | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('galerias')
    .select('id, nome, max_albuns, atualizada_em, galeria_fotos(count)')
    .eq('id', id)
    .maybeSingle();

  if (!data) return null;
  const { galeria_fotos, ...resto } = data as typeof data & {
    galeria_fotos: { count: number }[] | null;
  };
  return { ...resto, total_fotos: galeria_fotos?.[0]?.count ?? 0 };
}

/**
 * Fotos da galeria com URL assinada. O bucket e privado: a RLS ja garante
 * que so o dono ve as linhas, e a assinatura da acesso temporario ao binario.
 */
export async function listarFotosGaleria(galeriaId: string): Promise<Foto[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('galeria_fotos')
    .select('id, storage_path, largura, altura')
    .eq('galeria_id', galeriaId)
    .order('ordem');

  if (!data || data.length === 0) return [];

  const { data: assinadas } = await supabase.storage
    .from('galerias')
    .createSignedUrls(data.map((f) => f.storage_path), 60 * 60 * 6);

  const porCaminho = new Map((assinadas ?? []).map((a) => [a.path, a.signedUrl]));

  return data.map((f) => ({ ...f, url: porCaminho.get(f.storage_path) ?? '' }));
}

export type LojaAdministrada = {
  lojista_id: string;
  slug: string;
  nome: string;
  papel: 'admin' | 'operador';
};

/** Lojas que o usuário logado administra (painel em app.photoon.com.br). */
export async function minhasLojas(): Promise<LojaAdministrada[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('lojista_membros')
    .select('lojista_id, papel, lojistas(slug, nome)');

  return ((data ?? []) as unknown as {
    lojista_id: string;
    papel: 'admin' | 'operador';
    lojistas: { slug: string; nome: string } | null;
  }[])
    .filter((m) => m.lojistas)
    .map((m) => ({
      lojista_id: m.lojista_id,
      papel: m.papel,
      slug: m.lojistas!.slug,
      nome: m.lojistas!.nome,
    }));
}

/** O usuário logado é super admin da plataforma? */
export async function souSuperAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data } = await supabase.from('super_admins').select('user_id').limit(1);
  return (data?.length ?? 0) > 0;
}
