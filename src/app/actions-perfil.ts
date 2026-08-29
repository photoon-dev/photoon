'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

/**
 * Salva o perfil do cliente na loja atual.
 *
 * A RLS já limita a linha ao próprio usuário; o `eq('id')` é só para escolher
 * qual delas, quando a pessoa é cliente de mais de uma loja.
 */
export async function salvarPerfil(clienteId: string, dados: FormData) {
  const supabase = await createClient();
  const { data: sessao } = await supabase.auth.getUser();
  if (!sessao.user) throw new Error('sem sessão');

  const nome = String(dados.get('nome') ?? '').trim().slice(0, 120);
  const telefone = String(dados.get('telefone') ?? '').trim().slice(0, 40);

  const { error } = await supabase
    .from('clientes')
    .update({ nome: nome || null, telefone: telefone || null })
    .eq('id', clienteId)
    .eq('user_id', sessao.user.id);

  if (error) throw new Error(error.message);
  revalidatePath('/minha-conta');
  revalidatePath('/meus-projetos');
}

/** Grava o endereço do avatar depois do envio, feito no navegador. */
export async function salvarAvatar(clienteId: string, url: string | null) {
  const supabase = await createClient();
  const { data: sessao } = await supabase.auth.getUser();
  if (!sessao.user) throw new Error('sem sessão');

  const { error } = await supabase
    .from('clientes')
    .update({ avatar_url: url })
    .eq('id', clienteId)
    .eq('user_id', sessao.user.id);

  // Mensagem clara em vez do erro cru do Postgres: sem a migração 0011 a
  // coluna não existe, e o cliente veria "column does not exist".
  if (error) {
    throw new Error(
      /avatar_url/.test(error.message)
        ? 'A foto de perfil ainda não foi liberada nesta loja.'
        : error.message,
    );
  }
  revalidatePath('/minha-conta');
  revalidatePath('/meus-projetos');
}
