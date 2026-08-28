'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { lojaAtual } from '@/lib/lojista';
import { novaLamina } from '@/lib/album';
import { agrupar } from '@/lib/rostos';

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

/** Rosto detectado no navegador, pronto para gravar. */
export type RostoEnviado = {
  caixa: { x: number; y: number; w: number; h: number };
  vetor: number[];
  conf: number;
};

/**
 * Registra no banco as fotos que o navegador acabou de enviar ao Storage.
 * O upload em si acontece no cliente, com a sessão do lojista.
 *
 * `rostos` vem da análise feita no próprio navegador (`src/lib/faceapi.ts`).
 * É opcional: se a análise falhar ou estiver desligada, a foto entra na galeria
 * como sempre entrou.
 */
export async function registrarFotos(
  galeriaId: string,
  arquivos: {
    storage_path: string;
    largura?: number | null;
    altura?: number | null;
    rostos?: RostoEnviado[];
  }[],
) {
  await exigirLoja();
  if (arquivos.length === 0) return;

  const supabase = await createClient();

  const { count } = await supabase
    .from('galeria_fotos')
    .select('id', { count: 'exact', head: true })
    .eq('galeria_id', galeriaId);

  const base = count ?? 0;
  // `select()` devolve os ids na MESMA ordem do insert, que é o que liga cada
  // foto aos rostos que vieram com ela.
  const { data: inseridas, error } = await supabase
    .from('galeria_fotos')
    .insert(
      arquivos.map((a, i) => ({
        galeria_id: galeriaId,
        storage_path: a.storage_path,
        largura: a.largura ?? null,
        altura: a.altura ?? null,
        ordem: base + i,
      })),
    )
    .select('id, storage_path');
  if (error) throw new Error(error.message);

  // ------------------------------------------------------------------------
  // Rostos. Falha aqui não derruba o envio: a galeria vale mais que a análise.
  // ------------------------------------------------------------------------
  try {
    const porCaminho = new Map((inseridas ?? []).map((f) => [f.storage_path, f.id]));
    const linhas = arquivos.flatMap((a) => {
      const fotoId = porCaminho.get(a.storage_path);
      if (!fotoId || !a.rostos?.length) return [];
      return a.rostos
        .filter((r) => Array.isArray(r.vetor) && r.vetor.length === 128)
        .map((r) => ({
          galeria_foto_id: fotoId,
          caixa: r.caixa,
          vetor: r.vetor,
          conf: r.conf,
        }));
    });
    if (linhas.length) {
      await supabase.from('rostos').insert(linhas);
      await reagruparPessoas(galeriaId);
    }
  } catch {
    // sem rostos desta vez; o lojista pode reprocessar pela tela de Pessoas
  }

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

/**
 * Fotos da galeria que ainda não passaram pela detecção de rosto.
 *
 * A detecção acontece no envio. Toda galeria enviada antes dessa função
 * existir ficaria sem rosto para sempre, e nenhum lojista vai reenviar a
 * galeria inteira — daí o reprocessamento.
 *
 * Devolve a URL assinada porque a análise roda no navegador do lojista: o
 * servidor não baixa nem decodifica imagem nenhuma.
 */
export async function fotosSemAnalise(galeriaId: string, limite = 40) {
  await exigirLoja();
  const supabase = await createClient();

  const { data: fotos } = await supabase
    .from('galeria_fotos')
    .select('id, storage_path')
    .eq('galeria_id', galeriaId)
    .is('analisada_em', null)
    .limit(limite);

  if (!fotos?.length) return [];

  const { data: assinadas } = await supabase.storage
    .from('galerias')
    .createSignedUrls(fotos.map((f) => f.storage_path), 60 * 30);

  const porCaminho = new Map((assinadas ?? []).map((a) => [a.path, a.signedUrl]));
  return fotos
    .map((f) => ({ id: f.id, url: porCaminho.get(f.storage_path) ?? null }))
    .filter((f): f is { id: string; url: string } => !!f.url);
}

/**
 * Grava os rostos de fotos que já estavam na galeria.
 *
 * Marca `analisada_em` mesmo quando não achou rosto nenhum: sem isso a foto
 * sem gente voltaria em toda passagem e o reprocessamento nunca terminaria.
 */
export async function salvarRostosExistentes(
  galeriaId: string,
  resultados: { fotoId: string; largura?: number | null; altura?: number | null; rostos: RostoEnviado[] }[],
) {
  await exigirLoja();
  if (resultados.length === 0) return { rostos: 0 };
  const supabase = await createClient();

  const linhas = resultados.flatMap((r) =>
    r.rostos
      .filter((x) => Array.isArray(x.vetor) && x.vetor.length === 128)
      .map((x) => ({
        galeria_foto_id: r.fotoId,
        caixa: x.caixa,
        vetor: x.vetor,
        conf: x.conf ?? 0,
      })),
  );

  if (linhas.length) await supabase.from('rostos').insert(linhas);

  for (const r of resultados) {
    await supabase
      .from('galeria_fotos')
      .update({
        analisada_em: new Date().toISOString(),
        ...(r.largura ? { largura: r.largura, altura: r.altura } : {}),
      })
      .eq('id', r.fotoId);
  }

  await reagruparPessoas(galeriaId);
  revalidatePath('/clientes');
  return { rostos: linhas.length };
}

/**
 * Reagrupa os rostos da galeria em pessoas.
 *
 * DBSCAN sobre os descritores de 128 dimensões — matemática pura, sem IA e sem
 * chamada externa; alguns milissegundos para uma galeria típica. Roda sempre
 * sobre a galeria INTEIRA porque um envio novo pode unir dois grupos que antes
 * pareciam pessoas diferentes.
 *
 * Os nomes que o lojista já deu são preservados: cada grupo herda o nome da
 * pessoa que mais aparecia nele.
 */
export async function reagruparPessoas(galeriaId: string) {
  await exigirLoja();
  const supabase = await createClient();

  const { data: fotos } = await supabase
    .from('galeria_fotos')
    .select('id')
    .eq('galeria_id', galeriaId);
  const ids = (fotos ?? []).map((f) => f.id);
  if (ids.length === 0) return;

  const { data: rostos } = await supabase
    .from('rostos')
    .select('id, galeria_foto_id, vetor, pessoa_id')
    .in('galeria_foto_id', ids);

  const lista = (rostos ?? []).filter(
    (r): r is typeof r & { vetor: number[] } =>
      Array.isArray(r.vetor) && r.vetor.length === 128,
  );
  if (lista.length === 0) return;

  const grupos = agrupar(lista.map((r) => r.vetor));
  // `Math.max(0, ...)` criava o grupo 0 mesmo quando TODOS os rostos eram
  // ruído (−1): nascia uma pessoa sem nenhum rosto, e a aba enchia de bolinha
  // vazia. Com −1 como piso, ruído puro não gera pessoa nenhuma.
  const total = Math.max(-1, ...grupos) + 1;

  // Nome herdado: para cada grupo, a pessoa antiga mais frequente nele.
  const { data: antigas } = await supabase
    .from('pessoas')
    .select('id, nome')
    .eq('galeria_id', galeriaId);
  const nomePorId = new Map((antigas ?? []).map((p) => [p.id, p.nome]));

  const novos: string[] = [];
  for (let g = 0; g < total; g++) {
    const membros = lista.filter((_, i) => grupos[i] === g);
    const contagem = new Map<string, number>();
    for (const m of membros) {
      if (m.pessoa_id) contagem.set(m.pessoa_id, (contagem.get(m.pessoa_id) ?? 0) + 1);
    }
    const maisComum = [...contagem.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
    const nome = maisComum ? nomePorId.get(maisComum) ?? null : null;

    const { data: nova } = await supabase
      .from('pessoas')
      .insert({ galeria_id: galeriaId, nome, rosto_capa_id: membros[0]?.id ?? null })
      .select('id')
      .single();
    if (nova) novos.push(nova.id);
  }

  // Aponta cada rosto para o grupo novo; ruído (−1) fica sem pessoa.
  await Promise.all(
    lista.map((r, i) => {
      const g = grupos[i];
      return supabase
        .from('rostos')
        .update({ pessoa_id: g >= 0 ? novos[g] ?? null : null })
        .eq('id', r.id);
    }),
  );

  // As pessoas antigas ficaram sem rosto; some com elas para a aba não encher
  // de bolinhas vazias a cada reagrupamento.
  const idsAntigos = (antigas ?? []).map((p) => p.id);
  if (idsAntigos.length) {
    await supabase.from('pessoas').delete().in('id', idsAntigos);
  }
}

/** Renomeia uma pessoa — é o que transforma a bolinha em alguém. */
export async function renomearPessoa(pessoaId: string, nome: string) {
  await exigirLoja();
  const supabase = await createClient();
  const limpo = nome.trim().slice(0, 80);
  const { error } = await supabase
    .from('pessoas')
    .update({ nome: limpo || null })
    .eq('id', pessoaId);
  if (error) throw new Error(error.message);
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
