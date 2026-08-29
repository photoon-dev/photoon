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
  template_id: string | null;
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

export type Cliente = {
  id: string;
  nome: string | null;
  email: string;
  /** Foto de perfil nesta loja; nula quando não há. */
  avatarUrl?: string | null;
};

export type Foto = {
  id: string;
  storage_path: string;
  largura: number | null;
  altura: number | null;
  /** URL assinada (bucket privado), valida por algumas horas. */
  url: string;
};

/** Rosto detectado numa foto, sem o descritor biométrico. */
export type RostoDaFoto = {
  id: string;
  fotoId: string;
  /** Caixa 0–1 sobre a foto original. */
  caixa: { x: number; y: number; w: number; h: number };
  pessoaId: string | null;
  conf: number;
};

export type PessoaDaGaleria = {
  id: string;
  nome: string | null;
  rostoCapaId: string | null;
};

const CAMPOS_PROJETO =
  'id, titulo, status, produto_nome, produto_tamanho, preco_estimado, progresso, avisos, ' +
  'capa_url, total_paginas, atualizado_em, galeria_id, template_id, paginas, projeto_fotos(count)';

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

  // 1. já vinculado?
  const { data: existente } = await supabase
    .from('clientes')
    .select('id, nome, avatar_url')
    .eq('user_id', user.id)
    .eq('lojista_id', lojistaId)
    .maybeSingle();

  if (existente) {
    const { avatar_url, ...resto } = existente as { id: string; nome: string | null; avatar_url?: string | null };
    return { ...resto, email, avatarUrl: avatar_url ?? null };
  }

  // 2. o lojista deixou um convite com este e-mail?
  //
  //    A linha do convite tem user_id nulo, então nenhuma policy do cliente
  //    a alcança — nem para ler, nem para atualizar. Quem reivindica é a
  //    função `reivindicar_convite`, SECURITY DEFINER, que confere o e-mail
  //    do próprio auth.uid() antes de gravar.
  if (email) {
    const { data: idReivindicado } = await supabase.rpc('reivindicar_convite', {
      p_lojista: lojistaId,
    });

    if (idReivindicado) {
      const { data: agora } = await supabase
        .from('clientes')
        .select('id, nome')
        .eq('id', idReivindicado as string)
        .maybeSingle();
      if (agora) return { ...agora, email };
    }
  }

  // 3. sem convite: cria o vínculo direto (loja de acesso aberto)
  const { data: criado } = await supabase
    .from('clientes')
    .insert({
      user_id: user.id,
      lojista_id: lojistaId,
      email: email || null,
      nome: (user.user_metadata?.nome as string) ?? null,
      primeiro_acesso_em: new Date().toISOString(),
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

/**
 * Galerias liberadas para este cliente, da mais recente para a mais antiga.
 *
 * Uma galeria por evento: o mesmo cliente pode ter o casamento e o batizado
 * na mesma loja, cada um com suas fotos. Cada álbum aponta para a galeria do
 * seu evento, então as fotos de um evento nunca aparecem no álbum do outro.
 */
export async function listarGalerias(clienteId: string): Promise<Galeria[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('galerias')
    .select('id, nome, max_albuns, atualizada_em, galeria_fotos(count)')
    .eq('cliente_id', clienteId)
    .order('atualizada_em', { ascending: false });

  return ((data ?? []) as unknown as (Galeria & { galeria_fotos: { count: number }[] | null })[]).map(
    ({ galeria_fotos, ...g }) => ({ ...g, total_fotos: galeria_fotos?.[0]?.count ?? 0 }),
  );
}

export type Notificacao = {
  id: string;
  tag: string;
  titulo: string;
  corpo: string | null;
  lida: boolean;
  criada_em: string;
};

/** Avisos da empresa sobre os projetos deste cliente. */
export async function listarNotificacoes(
  clienteId: string,
  limite = 8,
): Promise<Notificacao[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('notificacoes')
    .select('id, tag, titulo, corpo, lida, criada_em')
    .eq('cliente_id', clienteId)
    .order('criada_em', { ascending: false })
    .limit(limite);
  return data ?? [];
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

/**
 * Rostos das fotos da galeria, para o editor.
 *
 * Vem SEM o vetor de 128 dimensões: o editor só precisa da caixa e de quem é a
 * pessoa. O descritor é dado biométrico e não tem por que trafegar até o
 * navegador do cliente final — quem o usa é o agrupamento, no servidor.
 */
export async function listarRostosGaleria(galeriaId: string): Promise<RostoDaFoto[]> {
  const supabase = await createClient();

  const { data: fotos } = await supabase
    .from('galeria_fotos')
    .select('id')
    .eq('galeria_id', galeriaId);
  const ids = (fotos ?? []).map((f) => f.id);
  if (ids.length === 0) return [];

  const { data } = await supabase
    .from('rostos')
    .select('id, galeria_foto_id, caixa, pessoa_id, conf')
    .in('galeria_foto_id', ids);

  return (data ?? []).map((r) => ({
    id: r.id,
    fotoId: r.galeria_foto_id,
    caixa: r.caixa as { x: number; y: number; w: number; h: number },
    pessoaId: r.pessoa_id,
    conf: r.conf ?? 0,
  }));
}

/** Pessoas da galeria, com quantas fotos cada uma aparece. */
export async function listarPessoasGaleria(galeriaId: string): Promise<PessoaDaGaleria[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('pessoas')
    .select('id, nome, rosto_capa_id')
    .eq('galeria_id', galeriaId)
    .order('criado_em');

  return (data ?? []).map((p) => ({
    id: p.id,
    nome: p.nome,
    rostoCapaId: p.rosto_capa_id,
  }));
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

/** Preço vigente do modelo de um álbum, para o orçamento no editor. */
export async function getPrecoDoModelo(templateId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from('templates')
    .select('preco_base, paginas_incluidas, fotos_incluidas, preco_pagina_extra, preco_foto_extra')
    .eq('id', templateId)
    .maybeSingle();
  return (data as unknown as import('@/lib/preco').PrecoModelo) ?? null;
}
