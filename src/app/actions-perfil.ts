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

// ---------------------------------------------------------------------------
// Minha conta — os três formulários da tela do design
// ---------------------------------------------------------------------------

/** Mensagem legível quando a migração 0013 ainda não rodou. */
function semMigracao(msg: string, campo: RegExp, aviso: string) {
  return campo.test(msg) ? aviso : msg;
}

async function clienteDaSessao(clienteId: string) {
  const supabase = await createClient();
  const { data: sessao } = await supabase.auth.getUser();
  if (!sessao.user) throw new Error('sem sessão');
  if (!clienteId) throw new Error('cliente não informado');
  return { supabase, userId: sessao.user.id };
}

const texto = (fd: FormData, campo: string, max = 120) =>
  String(fd.get(campo) ?? '').trim().slice(0, max);

/**
 * Dados pessoais.
 *
 * O e-mail não entra: ele é o login, vive em `auth.users` e trocá-lo é outro
 * fluxo (com confirmação no endereço novo). O campo aparece na tela só para a
 * pessoa saber com qual e-mail ela entra.
 */
export async function salvarDadosConta(clienteId: string, fd: FormData) {
  const { supabase, userId } = await clienteDaSessao(clienteId);

  const nascimento = texto(fd, 'nascimento', 10);
  const { error } = await supabase
    .from('clientes')
    .update({
      nome: texto(fd, 'nome') || null,
      telefone: texto(fd, 'telefone', 40) || null,
      apelido: texto(fd, 'apelido', 60) || null,
      // O campo chega como dd/mm/aaaa ou aaaa-mm-dd; a coluna é `date`.
      nascimento: emData(nascimento),
      turma: texto(fd, 'turma', 80) || null,
    })
    .eq('id', clienteId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(
      semMigracao(error.message, /apelido|nascimento|turma/,
        'Os campos novos do perfil dependem da migração 0013, ainda não aplicada.'),
    );
  }
  revalidatePath('/minha-conta');
}

/** dd/mm/aaaa (o que a pessoa digita) -> aaaa-mm-dd (o que a coluna guarda). */
function emData(v: string): string | null {
  if (!v) return null;
  const br = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v);
  if (br) return `${br[3]}-${br[2]}-${br[1]}`;
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : null;
}

/** Documentos: tabela à parte, para não viajarem em todo select de cliente. */
export async function salvarDocumentos(clienteId: string, fd: FormData) {
  const { supabase } = await clienteDaSessao(clienteId);

  const { error } = await supabase.from('cliente_documentos').upsert(
    {
      cliente_id: clienteId,
      cpf: texto(fd, 'cpf', 20) || null,
      rg: texto(fd, 'rg', 20) || null,
      orgao_emissor: texto(fd, 'orgao_emissor', 20) || null,
      nome_mae: texto(fd, 'nome_mae') || null,
      atualizado_em: new Date().toISOString(),
    },
    { onConflict: 'cliente_id' },
  );

  if (error) {
    throw new Error(
      semMigracao(error.message, /cliente_documentos/,
        'Os documentos dependem da migração 0013, ainda não aplicada.'),
    );
  }
  revalidatePath('/minha-conta');
}

/**
 * Endereço de entrega.
 *
 * Mesma forma de `expedicao.endereco`, para a etiqueta do envio ler direto sem
 * traduzir campo nenhum.
 */
export async function salvarEndereco(clienteId: string, fd: FormData) {
  const { supabase, userId } = await clienteDaSessao(clienteId);

  const endereco = {
    cep: texto(fd, 'cep', 12),
    rua: texto(fd, 'rua'),
    numero: texto(fd, 'numero', 12),
    complemento: texto(fd, 'complemento', 80),
    bairro: texto(fd, 'bairro'),
    cidade: texto(fd, 'cidade'),
    uf: texto(fd, 'uf', 2).toUpperCase(),
    quem_recebe: texto(fd, 'quem_recebe'),
  };

  // Endereço em branco volta a ser objeto vazio: é o que a tela lê como
  // "retirada no estúdio", e evita guardar oito strings vazias.
  const algum = Object.values(endereco).some(Boolean);

  const { error } = await supabase
    .from('clientes')
    .update({ endereco: algum ? endereco : {} })
    .eq('id', clienteId)
    .eq('user_id', userId);

  if (error) {
    throw new Error(
      semMigracao(error.message, /endereco/,
        'O endereço depende da migração 0013, ainda não aplicada.'),
    );
  }
  revalidatePath('/minha-conta');
}
