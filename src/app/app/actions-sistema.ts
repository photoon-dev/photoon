'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { lojaAtual } from '@/lib/lojista';
import { cifrar, temChaveDeCifragem } from '@/lib/cripto';

/**
 * Ações das telas de sistema do lojista: integrações de pagamento, auditoria
 * e suporte.
 *
 * Como em `actions.ts`, tudo passa pela RLS com a sessão do próprio lojista —
 * nada usa service_role. Se a policy recusar, a ação falha, e é assim que
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

/** Checkbox ausente no FormData significa desmarcado — `on` é o valor que o HTML manda. */
const marcado = (fd: FormData, campo: string) => fd.get(campo) === 'on' || fd.get(campo) === 'true';

/**
 * Grava uma linha no histórico da loja.
 *
 * Fica aqui, e não num gatilho do banco, porque só o app sabe a intenção
 * ("conectou o Mercado Pago") — o banco veria apenas um UPDATE. Falhar ao
 * auditar não pode derrubar a ação em si: o lojista perderia a operação por
 * causa do registro dela.
 */
async function registrar(
  lojistaId: string,
  acao: string,
  entidade: string,
  detalhe: Record<string, unknown> = {},
  entidadeId?: string,
) {
  try {
    const supabase = await createClient();
    const { data: sessao } = await supabase.auth.getUser();
    await supabase.from('auditoria').insert({
      lojista_id: lojistaId,
      user_id: sessao.user?.id ?? null,
      acao,
      entidade,
      entidade_id: entidadeId ?? null,
      detalhe,
    });
  } catch {
    // silêncio proposital: ver comentário acima
  }
}

// ---------------------------------------------------------------------------
// Integrações de pagamento
// ---------------------------------------------------------------------------

/** Só estes têm implementação prevista; recusar o resto evita linha órfã na tabela. */
const PROVEDORES_ACEITOS = ['mercadopago', 'asaas', 'pagseguro', 'stripe'];

/**
 * Conecta (ou reconecta) um gateway da loja.
 *
 * As credenciais chegam em campos `cred_<nome>` e são cifradas antes de tocar
 * o banco — `credenciais_cifradas` nunca recebe texto puro. O campo
 * `principal` diz qual delas é o segredo que a tela mascara depois.
 */
export async function conectarGateway(fd: FormData) {
  const loja = await exigirLoja();

  if (!temChaveDeCifragem()) {
    throw new Error(
      'CHAVE_CIFRAGEM não está definida no servidor. Sem ela a credencial ficaria em texto puro no banco, e isso não é aceitável.',
    );
  }

  const provedor = texto(fd, 'provedor');
  if (!PROVEDORES_ACEITOS.includes(provedor)) throw new Error('Gateway desconhecido.');

  const campos: Record<string, string> = {};
  for (const [chave, valor] of fd.entries()) {
    if (chave.startsWith('cred_') && typeof valor === 'string' && valor.trim()) {
      campos[chave.slice(5)] = valor.trim();
    }
  }
  if (!Object.keys(campos).length) throw new Error('Informe as credenciais do gateway.');

  const principal = texto(fd, 'principal') || Object.keys(campos)[0];

  const supabase = await createClient();
  const { error } = await supabase.from('lojista_gateways').upsert(
    {
      lojista_id: loja.id,
      provedor,
      credenciais_cifradas: cifrar(JSON.stringify({ principal, campos })),
      aceita_pix: marcado(fd, 'aceita_pix'),
      aceita_cartao: marcado(fd, 'aceita_cartao'),
      aceita_boleto: marcado(fd, 'aceita_boleto'),
      ativo: true,
    },
    { onConflict: 'lojista_id,provedor' },
  );
  if (error) throw new Error(error.message);

  // O detalhe guarda só o NOME dos campos enviados. Valor de credencial em
  // `auditoria.detalhe` seria o mesmo vazamento pela porta dos fundos.
  await registrar(loja.id, 'gateway.conectado', 'lojista_gateways', {
    provedor,
    campos: Object.keys(campos),
  });
  revalidatePath('/integracoes');
}

/** Liga/desliga um método de pagamento (Pix, cartão, boleto) num gateway já conectado. */
export async function alternarMetodoGateway(fd: FormData) {
  const loja = await exigirLoja();
  const provedor = texto(fd, 'provedor');
  const metodo = texto(fd, 'metodo');
  const coluna = { pix: 'aceita_pix', cartao: 'aceita_cartao', boleto: 'aceita_boleto' }[metodo];
  if (!coluna || !PROVEDORES_ACEITOS.includes(provedor)) throw new Error('Método desconhecido.');

  const ligar = texto(fd, 'ligar') === '1';

  const supabase = await createClient();
  const { error } = await supabase
    .from('lojista_gateways')
    .update({ [coluna]: ligar })
    .eq('lojista_id', loja.id)
    .eq('provedor', provedor);
  if (error) throw new Error(error.message);

  await registrar(loja.id, 'gateway.metodo', 'lojista_gateways', { provedor, metodo, ligado: ligar });
  revalidatePath('/integracoes');
}

/** Suspende o gateway sem apagar a credencial — dá para religar sem redigitar a chave. */
export async function alternarGateway(fd: FormData) {
  const loja = await exigirLoja();
  const provedor = texto(fd, 'provedor');
  if (!PROVEDORES_ACEITOS.includes(provedor)) throw new Error('Gateway desconhecido.');
  const ativo = texto(fd, 'ativo') === '1';

  const supabase = await createClient();
  const { error } = await supabase
    .from('lojista_gateways')
    .update({ ativo })
    .eq('lojista_id', loja.id)
    .eq('provedor', provedor);
  if (error) throw new Error(error.message);

  await registrar(loja.id, ativo ? 'gateway.ativado' : 'gateway.suspenso', 'lojista_gateways', {
    provedor,
  });
  revalidatePath('/integracoes');
}

/** Desconecta de vez: apaga a linha, e com ela a credencial cifrada. */
export async function desconectarGateway(fd: FormData) {
  const loja = await exigirLoja();
  const provedor = texto(fd, 'provedor');
  if (!PROVEDORES_ACEITOS.includes(provedor)) throw new Error('Gateway desconhecido.');

  const supabase = await createClient();
  const { error } = await supabase
    .from('lojista_gateways')
    .delete()
    .eq('lojista_id', loja.id)
    .eq('provedor', provedor);
  if (error) throw new Error(error.message);

  await registrar(loja.id, 'gateway.desconectado', 'lojista_gateways', { provedor });
  revalidatePath('/integracoes');
}

// ---------------------------------------------------------------------------
// Suporte
// ---------------------------------------------------------------------------

/**
 * Responde um chamado.
 *
 * A migração 0012 não criou tabela de respostas, então a conversa vive na
 * coluna `mensagem`, em blocos datados. É pouco, mas é honesto: inventar uma
 * tabela aqui colidiria com a numeração de migrações de outras frentes, e
 * jogar a resposta fora seria pior.
 */
export async function responderChamado(fd: FormData) {
  const loja = await exigirLoja();
  const id = texto(fd, 'id');
  const resposta = texto(fd, 'resposta');
  if (!id) throw new Error('Chamado não informado.');
  if (!resposta) throw new Error('Escreva a resposta antes de enviar.');

  const supabase = await createClient();
  const { data: atual, error: erroLeitura } = await supabase
    .from('chamados')
    .select('mensagem')
    .eq('id', id)
    .eq('lojista_id', loja.id)
    .maybeSingle();
  if (erroLeitura) throw new Error(erroLeitura.message);
  if (!atual) throw new Error('Chamado não encontrado nesta loja.');

  const carimbo = new Date().toISOString();
  const bloco = `\n\n--- resposta da loja em ${carimbo} ---\n${resposta}`;

  const { error } = await supabase
    .from('chamados')
    .update({
      mensagem: `${(atual as { mensagem: string | null }).mensagem ?? ''}${bloco}`.trim(),
      estado: 'respondido',
      atualizado_em: carimbo,
    })
    .eq('id', id)
    .eq('lojista_id', loja.id);
  if (error) throw new Error(error.message);

  await registrar(loja.id, 'chamado.respondido', 'chamados', {}, id);
  revalidatePath('/suporte');
}

/** Move o chamado entre aberto, respondido e resolvido. Reabrir é o mesmo caminho de volta. */
export async function mudarEstadoChamado(fd: FormData) {
  const loja = await exigirLoja();
  const id = texto(fd, 'id');
  const estado = texto(fd, 'estado');
  if (!id) throw new Error('Chamado não informado.');
  if (!['aberto', 'respondido', 'resolvido'].includes(estado)) throw new Error('Estado inválido.');

  const supabase = await createClient();
  const { error } = await supabase
    .from('chamados')
    .update({ estado, atualizado_em: new Date().toISOString() })
    .eq('id', id)
    .eq('lojista_id', loja.id);
  if (error) throw new Error(error.message);

  await registrar(loja.id, `chamado.${estado}`, 'chamados', {}, id);
  revalidatePath('/suporte');
}

/** Prioridade define a ordem de atendimento na fila; é a única edição que a tela permite. */
export async function mudarPrioridadeChamado(fd: FormData) {
  const loja = await exigirLoja();
  const id = texto(fd, 'id');
  const prioridade = texto(fd, 'prioridade');
  if (!id) throw new Error('Chamado não informado.');
  if (!['baixa', 'normal', 'alta', 'urgente'].includes(prioridade)) {
    throw new Error('Prioridade inválida.');
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('chamados')
    .update({ prioridade, atualizado_em: new Date().toISOString() })
    .eq('id', id)
    .eq('lojista_id', loja.id);
  if (error) throw new Error(error.message);

  await registrar(loja.id, 'chamado.prioridade', 'chamados', { prioridade }, id);
  revalidatePath('/suporte');
}
