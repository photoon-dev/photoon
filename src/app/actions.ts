'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { currentTenantSlug } from '@/lib/tenant';
import { getLojista, garantirCliente } from '@/lib/data';

/** Cria um projeto vazio e leva direto para o editor. */
export async function criarProjeto() {
  const slug = await currentTenantSlug();
  if (!slug) throw new Error('Lojista não identificado.');

  const lojista = await getLojista(slug);
  if (!lojista) throw new Error('Lojista não encontrado.');

  const clienteId = await garantirCliente(lojista.id);
  if (!clienteId) redirect('/entrar');

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projetos')
    .insert({ lojista_id: lojista.id, cliente_id: clienteId, titulo: 'Novo projeto' })
    .select('id')
    .single();

  if (error || !data) throw new Error(error?.message ?? 'Não foi possível criar o projeto.');

  revalidatePath('/meus-projetos');
  redirect(`/projetos/${data.id}/editor`);
}

/** Renomeia um projeto (RLS garante que e do proprio cliente). */
export async function renomearProjeto(id: string, titulo: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('projetos').update({ titulo }).eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(`/projetos/${id}`);
  revalidatePath('/meus-projetos');
}
