'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { lojaAtual } from '@/lib/lojista';
import { novaLamina } from '@/lib/album';

/**
 * Ações do painel do lojista.
 *
 * Todas passam pela RLS com a sessão do próprio lojista — nenhuma usa
 * service_role. Se a policy recusar, a ação falha, e é assim que deve ser.
 */

async function exigirLoja() {
  const loja = await lojaAtual();
  if (!loja) throw new Error('Sua conta não administra nenhuma loja.');
  return loja;
}

const texto = (fd: FormData, campo: string) => {
  const v = fd.get(campo);
  return typeof v === 'string' ? v.trim() : '';
};

// ---------------------------------------------------------------------------
// Clientes finais
// ---------------------------------------------------------------------------

/**
 * Cadastra o acesso de um cliente final.
 *
 * A conta de login não é criada aqui: criar usuário exige service_role. A
 * linha nasce sem `user_id` e é reivindicada quando alguém entra na loja com
 * esse e-mail (ver `garantirCliente`). O lojista compartilha o link da loja.
 */
export async function cadastrarCliente(fd: FormData) {
  const loja = await exigirLoja();
  const email = texto(fd, 'email').toLowerCase();
  if (!email) throw new Error('Informe o e-mail do cliente.');

  const supabase = await createClient();
  const { error } = await supabase.from('clientes').insert({
    lojista_id: loja.id,
    email,
    nome: texto(fd, 'nome') || null,
    telefone: texto(fd, 'telefone') || null,
  });

  if (error) {
    throw new Error(
      error.code === '23505'
        ? 'Já existe um cliente com esse e-mail nesta loja.'
        : error.message,
    );
  }

  revalidatePath('/clientes');
}

export async function removerCliente(fd: FormData) {
  await exigirLoja();
  const supabase = await createClient();
  const { error } = await supabase.from('clientes').delete().eq('id', texto(fd, 'cliente_id'));
  if (error) throw new Error(error.message);
  revalidatePath('/clientes');
}

// ---------------------------------------------------------------------------
// Galerias
// ---------------------------------------------------------------------------

/** Cria a galeria de um cliente. As fotos são enviadas em seguida, pelo navegador. */
export async function criarGaleria(fd: FormData) {
  const loja = await exigirLoja();
  const clienteId = texto(fd, 'cliente_id');
  const nome = texto(fd, 'nome') || 'Nova galeria';
  const maxAlbuns = Number(texto(fd, 'max_albuns')) || 4;

  // Regras do que o cliente pode escolher neste evento. Vazio = sem restrição.
  const permitidos = fd.getAll('templates_permitidos').filter((v) => typeof v === 'string');
  const inteiro = (campo: string) => {
    const v = texto(fd, campo);
    return v ? Number(v) : null;
  };

  const supabase = await createClient();
  const { error } = await supabase.from('galerias').insert({
    lojista_id: loja.id,
    cliente_id: clienteId,
    nome,
    max_albuns: maxAlbuns,
    templates_permitidos: permitidos.length ? permitidos : null,
    paginas_min: inteiro('paginas_min'),
    paginas_max: inteiro('paginas_max'),
    fotos_max: inteiro('fotos_max'),
    permite_paginas_extras: fd.get('permite_paginas_extras') !== null,
  });

  if (error) throw new Error(error.message);

  await supabase.from('notificacoes').insert({
    cliente_id: clienteId,
    tag: 'Galeria',
    titulo: `A galeria ${nome} foi criada`,
    corpo: 'Assim que as fotos forem liberadas, elas aparecem aqui.',
  });

  revalidatePath('/clientes');
}

/**
 * Registra no banco as fotos que o navegador acabou de enviar ao Storage.
 * O upload em si acontece no cliente, com a sessão do lojista.
 */
export async function registrarFotos(
  galeriaId: string,
  arquivos: { storage_path: string; largura?: number; altura?: number }[],
) {
  await exigirLoja();
  if (arquivos.length === 0) return;

  const supabase = await createClient();

  const { count } = await supabase
    .from('galeria_fotos')
    .select('id', { count: 'exact', head: true })
    .eq('galeria_id', galeriaId);

  const base = count ?? 0;
  const { error } = await supabase.from('galeria_fotos').insert(
    arquivos.map((a, i) => ({
      galeria_id: galeriaId,
      storage_path: a.storage_path,
      largura: a.largura ?? null,
      altura: a.altura ?? null,
      ordem: base + i,
    })),
  );
  if (error) throw new Error(error.message);

  const { data: g } = await supabase
    .from('galerias')
    .select('cliente_id, nome')
    .eq('id', galeriaId)
    .maybeSingle();

  if (g) {
    await supabase.from('galerias').update({ atualizada_em: new Date().toISOString() }).eq('id', galeriaId);
    await supabase.from('notificacoes').insert({
      cliente_id: g.cliente_id,
      tag: 'Galeria',
      titulo: `${arquivos.length} foto${arquivos.length === 1 ? '' : 's'} liberada${arquivos.length === 1 ? '' : 's'} para você`,
      corpo: `A galeria ${g.nome} foi atualizada. As fotos já estão disponíveis no editor.`,
    });
  }

  revalidatePath('/clientes');
}

// ---------------------------------------------------------------------------
// Projetos
// ---------------------------------------------------------------------------

/** Cria um álbum para o cliente a partir de um modelo. */
export async function criarProjetoParaCliente(fd: FormData) {
  const loja = await exigirLoja();
  const clienteId = texto(fd, 'cliente_id');
  const galeriaId = texto(fd, 'galeria_id');
  const templateId = texto(fd, 'template_id');

  const supabase = await createClient();

  const { data: tpl } = await supabase
    .from('templates')
    .select('nome, produto, largura_mm, altura_mm, paginas_min, preco_base')
    .eq('id', templateId)
    .maybeSingle();

  if (!tpl) throw new Error('Modelo não encontrado.');

  // As regras do evento mandam. Sem elas, vale o que o modelo define.
  const { data: galeria } = galeriaId
    ? await supabase
        .from('galerias')
        .select('templates_permitidos, paginas_min')
        .eq('id', galeriaId)
        .maybeSingle()
    : { data: null };

  const regras = galeria as {
    templates_permitidos: string[] | null;
    paginas_min: number | null;
  } | null;

  if (regras?.templates_permitidos?.length && !regras.templates_permitidos.includes(templateId)) {
    throw new Error('Este modelo não está liberado para o evento.');
  }

  // páginas_min é a contagem de páginas; cada lâmina é um par
  const paginas = regras?.paginas_min ?? tpl.paginas_min;
  const laminas = Array.from({ length: Math.max(1, Math.ceil(paginas / 2)) }, () => novaLamina());

  const { error } = await supabase.from('projetos').insert({
    lojista_id: loja.id,
    cliente_id: clienteId,
    galeria_id: galeriaId || null,
    template_id: templateId,
    titulo: texto(fd, 'titulo') || tpl.nome,
    produto_nome: tpl.produto,
    produto_tamanho: `${tpl.largura_mm / 10} × ${tpl.altura_mm / 10} cm`,
    preco_estimado: tpl.preco_base,
    paginas: laminas,
  });

  if (error) throw new Error(error.message);

  await supabase.from('notificacoes').insert({
    cliente_id: clienteId,
    tag: 'Galeria',
    titulo: 'Um novo álbum foi liberado para você',
    corpo: `${texto(fd, 'titulo') || tpl.nome} já está disponível para montar.`,
  });

  revalidatePath('/clientes');
}

// ---------------------------------------------------------------------------
// Configurações da loja
// ---------------------------------------------------------------------------

export async function salvarLoja(fd: FormData) {
  const loja = await exigirLoja();
  const slug = texto(fd, 'slug').toLowerCase();

  if (slug && !/^[a-z0-9](?:[a-z0-9-]{1,48}[a-z0-9])$/.test(slug)) {
    throw new Error('Endereço inválido: use letras minúsculas, números e hífen.');
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('lojistas')
    .update({
      nome: texto(fd, 'nome') || undefined,
      slug: slug || undefined,
      descricao: texto(fd, 'descricao') || null,
      logo_url: texto(fd, 'logo_url') || null,
      cor_primaria: texto(fd, 'cor_primaria') || null,
      cor_secundaria: texto(fd, 'cor_secundaria') || null,
      telefone_suporte: texto(fd, 'telefone_suporte') || null,
      email_suporte: texto(fd, 'email_suporte') || null,
      url_politica: texto(fd, 'url_politica') || null,
      url_contato: texto(fd, 'url_contato') || null,
    })
    .eq('id', loja.id);

  if (error) {
    throw new Error(
      error.code === '23505'
        ? 'Esse endereço já está em uso por outra loja.'
        : error.message,
    );
  }

  revalidatePath('/configuracoes');
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

const camposTemplate = (fd: FormData) => ({
  nome: texto(fd, 'nome'),
  produto: texto(fd, 'produto'),
  categoria: texto(fd, 'categoria') || 'fotolivro',
  largura_mm: Number(texto(fd, 'largura_mm')),
  altura_mm: Number(texto(fd, 'altura_mm')),
  paginas_min: Number(texto(fd, 'paginas_min')) || 20,
  paginas_max: Number(texto(fd, 'paginas_max')) || 100,
  sangria_mm: Number(texto(fd, 'sangria_mm')) || 3,
  area_segura_mm: Number(texto(fd, 'area_segura_mm')) || 8,
  preco_base: texto(fd, 'preco_base') ? Number(texto(fd, 'preco_base')) : null,
  publicado: fd.get('publicado') !== null,
});

export async function salvarTemplate(fd: FormData) {
  const loja = await exigirLoja();
  const id = texto(fd, 'template_id');
  const campos = camposTemplate(fd);

  if (!campos.nome || !campos.largura_mm || !campos.altura_mm) {
    throw new Error('Nome, largura e altura são obrigatórios.');
  }

  const supabase = await createClient();
  const { error } = id
    ? await supabase.from('templates').update(campos).eq('id', id)
    : await supabase.from('templates').insert({ ...campos, lojista_id: loja.id });

  if (error) throw new Error(error.message);
  revalidatePath('/templates');
}

/** Duplica um modelo (inclusive um padrão da plataforma) para a loja. */
export async function duplicarTemplate(fd: FormData) {
  const loja = await exigirLoja();
  const supabase = await createClient();

  const { data } = await supabase
    .from('templates')
    .select(
      'nome, produto, categoria, largura_mm, altura_mm, paginas_min, paginas_max, ' +
        'sangria_mm, area_segura_mm, preco_base',
    )
    .eq('id', texto(fd, 'template_id'))
    .maybeSingle();

  const base = data as unknown as Record<string, unknown> | null;
  if (!base) throw new Error('Modelo não encontrado.');

  const { error } = await supabase
    .from('templates')
    .insert({ ...base, nome: `${base.nome} (cópia)`, lojista_id: loja.id, publicado: false });

  if (error) throw new Error(error.message);
  revalidatePath('/templates');
}

export async function excluirTemplate(fd: FormData) {
  await exigirLoja();
  const supabase = await createClient();
  const { error } = await supabase.from('templates').delete().eq('id', texto(fd, 'template_id'));
  if (error) throw new Error(error.message);
  revalidatePath('/templates');
}
