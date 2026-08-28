'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { souSuperAdmin } from '@/lib/data';

/**
 * Ações do super admin.
 *
 * A RLS é quem realmente autoriza (policy `lojistas_super_admin`); a checagem
 * aqui existe para devolver um erro claro em vez de uma falha silenciosa.
 */
async function exigirSuperAdmin() {
  if (!(await souSuperAdmin())) throw new Error('Acesso restrito ao super admin.');
}

const texto = (fd: FormData, campo: string) => {
  const v = fd.get(campo);
  return typeof v === 'string' ? v.trim() : '';
};

export async function criarLoja(fd: FormData) {
  await exigirSuperAdmin();

  const slug = texto(fd, 'slug').toLowerCase();
  if (!/^[a-z0-9](?:[a-z0-9-]{1,48}[a-z0-9])$/.test(slug)) {
    throw new Error('Endereço inválido: use letras minúsculas, números e hífen.');
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('lojistas')
    .insert({ nome: texto(fd, 'nome'), slug });

  if (error) {
    throw new Error(
      error.code === '23505' ? 'Esse endereço já está em uso.' : error.message,
    );
  }

  revalidatePath('/');
}

export async function alternarLoja(fd: FormData) {
  await exigirSuperAdmin();

  const supabase = await createClient();
  const { error } = await supabase
    .from('lojistas')
    .update({ ativo: texto(fd, 'ativo') === 'true' })
    .eq('id', texto(fd, 'lojista_id'));

  if (error) throw new Error(error.message);
  revalidatePath('/');
}

// ---------------------------------------------------------------------------
// Planos
// ---------------------------------------------------------------------------

const numero = (fd: FormData, campo: string) => {
  const v = texto(fd, campo);
  return v ? Number(v.replace(',', '.')) : 0;
};

const inteiroOuNulo = (fd: FormData, campo: string) => {
  const v = texto(fd, campo);
  return v ? Number(v) : null;
};

export async function salvarPlano(fd: FormData) {
  await exigirSuperAdmin();

  const campos = {
    nome: texto(fd, 'nome'),
    descricao: texto(fd, 'descricao') || null,
    valor_mensal: numero(fd, 'valor_mensal'),
    valor_por_projeto: numero(fd, 'valor_por_projeto'),
    valor_por_lamina: numero(fd, 'valor_por_lamina'),
    limite_projetos: inteiroOuNulo(fd, 'limite_projetos'),
    limite_clientes: inteiroOuNulo(fd, 'limite_clientes'),
    limite_armazenamento_gb: inteiroOuNulo(fd, 'limite_armazenamento_gb'),
    ativo: fd.get('ativo') !== null,
  };

  if (!campos.nome) throw new Error('O plano precisa de um nome.');

  const id = texto(fd, 'plano_id');
  const supabase = await createClient();
  const { error } = id
    ? await supabase.from('planos').update(campos).eq('id', id)
    : await supabase.from('planos').insert(campos);

  if (error) throw new Error(error.message);
  revalidatePath('/planos');
}

export async function excluirPlano(fd: FormData) {
  await exigirSuperAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from('planos').delete().eq('id', texto(fd, 'plano_id'));
  if (error) throw new Error(error.message);
  revalidatePath('/planos');
}

/** Coloca uma loja num plano. */
export async function definirPlanoDaLoja(fd: FormData) {
  await exigirSuperAdmin();
  const planoId = texto(fd, 'plano_id');

  const supabase = await createClient();
  const { error } = await supabase
    .from('lojistas')
    .update({ plano_id: planoId || null, plano_desde: planoId ? new Date().toISOString() : null })
    .eq('id', texto(fd, 'lojista_id'));

  if (error) throw new Error(error.message);
  revalidatePath('/');
}
