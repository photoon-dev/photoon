'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { lojaAtual } from '@/lib/lojista';

/**
 * Ações das telas comerciais: catálogo, preços e vendedores.
 *
 * Como em `actions.ts`, tudo passa pela RLS com a sessão do próprio lojista —
 * nenhuma usa service_role. Se a policy recusar, a ação falha, e é assim que
 * deve ser.
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

/** Campo de dinheiro do formulário. Aceita "1.234,56" e "1234.56". */
const dinheiro = (fd: FormData, campo: string) => {
  const bruto = texto(fd, campo);
  if (!bruto) return 0;
  // Vírgula decimal é o que o teclado brasileiro produz; sem esta troca,
  // "89,90" viraria NaN e o produto seria gravado com preço zero.
  const n = Number(bruto.replace(/\./g, '').replace(',', '.'));
  return Number.isFinite(n) && n >= 0 ? n : 0;
};

const inteiro = (fd: FormData, campo: string, padrao: number) => {
  const n = Number(texto(fd, campo));
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : padrao;
};

/** As telas comerciais se leem entre si: preço mexido aparece na vitrine. */
function revalidarComercial() {
  for (const r of ['/catalogo', '/precos', '/loja', '/marketing']) revalidatePath(r);
}

// ---------------------------------------------------------------------------
// Catálogo
// ---------------------------------------------------------------------------

export async function salvarProduto(fd: FormData) {
  const loja = await exigirLoja();
  const nome = texto(fd, 'nome');
  if (!nome) throw new Error('Dê um nome ao produto.');

  const supabase = await createClient();
  const campos = {
    nome,
    descricao: texto(fd, 'descricao') || null,
    categoria: texto(fd, 'categoria') || 'album',
    sku: texto(fd, 'sku') || null,
    template_id: texto(fd, 'template_id') || null,
    preco_base: dinheiro(fd, 'preco_base'),
    preco_pagina_extra: dinheiro(fd, 'preco_pagina_extra'),
    preco_foto_extra: dinheiro(fd, 'preco_foto_extra'),
    prazo_producao_dias: inteiro(fd, 'prazo_producao_dias', 7),
    ativo: fd.get('ativo') !== null,
    ordem: inteiro(fd, 'ordem', 0),
  };

  const id = texto(fd, 'produto_id');
  const { error } = id
    ? await supabase.from('produtos').update(campos).eq('id', id).eq('lojista_id', loja.id)
    : await supabase.from('produtos').insert({ ...campos, lojista_id: loja.id });

  if (error) throw new Error(error.message);
  revalidarComercial();
}

/**
 * Liga e desliga o produto na vitrine.
 *
 * Nunca apaga: a policy `produtos_vitrine` só mostra ativo ao cliente, e o
 * pedido antigo referencia o produto. Excluir deixaria pedido órfão.
 */
export async function alternarProduto(fd: FormData) {
  const loja = await exigirLoja();
  const id = texto(fd, 'produto_id');
  const supabase = await createClient();

  const { error } = await supabase
    .from('produtos')
    .update({ ativo: texto(fd, 'ativo') === 'sim' })
    .eq('id', id)
    .eq('lojista_id', loja.id);

  if (error) throw new Error(error.message);
  revalidarComercial();
}

// ---------------------------------------------------------------------------
// Preços
// ---------------------------------------------------------------------------

/**
 * Edição em linha da tabela de preços: só os quatro campos comerciais.
 *
 * Separada de `salvarProduto` porque a tela de Preços não tem os demais campos
 * no formulário — reusar a outra ação gravaria nome e categoria vazios.
 */
export async function salvarPrecoDoProduto(fd: FormData) {
  const loja = await exigirLoja();
  const id = texto(fd, 'produto_id');
  if (!id) throw new Error('Produto não informado.');

  const supabase = await createClient();
  const { error } = await supabase
    .from('produtos')
    .update({
      preco_base: dinheiro(fd, 'preco_base'),
      preco_pagina_extra: dinheiro(fd, 'preco_pagina_extra'),
      preco_foto_extra: dinheiro(fd, 'preco_foto_extra'),
      prazo_producao_dias: inteiro(fd, 'prazo_producao_dias', 7),
    })
    .eq('id', id)
    .eq('lojista_id', loja.id);

  if (error) throw new Error(error.message);
  revalidarComercial();
}

// ---------------------------------------------------------------------------
// Vendedores
// ---------------------------------------------------------------------------

export async function salvarVendedor(fd: FormData) {
  const loja = await exigirLoja();
  const nome = texto(fd, 'nome');
  if (!nome) throw new Error('Informe o nome do vendedor.');

  const pct = dinheiro(fd, 'comissao_pct');
  // A coluna é numeric(5,2): acima de 100 o banco recusaria e o lojista veria
  // um erro do Postgres em vez de uma mensagem.
  if (pct > 100) throw new Error('A comissão não pode passar de 100%.');

  const supabase = await createClient();
  const campos = {
    nome,
    email: texto(fd, 'email').toLowerCase() || null,
    telefone: texto(fd, 'telefone') || null,
    comissao_pct: pct,
    ativo: fd.get('ativo') !== null,
  };

  const id = texto(fd, 'vendedor_id');
  const { error } = id
    ? await supabase.from('vendedores').update(campos).eq('id', id).eq('lojista_id', loja.id)
    : await supabase.from('vendedores').insert({ ...campos, lojista_id: loja.id });

  if (error) throw new Error(error.message);
  revalidatePath('/vendedores');
}

/**
 * Desliga o vendedor sem apagá-lo: `pedidos.vendedor_id` aponta para ele e a
 * comissão histórica precisa continuar atribuída a alguém.
 */
export async function alternarVendedor(fd: FormData) {
  const loja = await exigirLoja();
  const supabase = await createClient();

  const { error } = await supabase
    .from('vendedores')
    .update({ ativo: texto(fd, 'ativo') === 'sim' })
    .eq('id', texto(fd, 'vendedor_id'))
    .eq('lojista_id', loja.id);

  if (error) throw new Error(error.message);
  revalidatePath('/vendedores');
}
