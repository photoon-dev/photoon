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
