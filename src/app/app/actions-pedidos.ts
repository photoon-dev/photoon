'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { lojaAtual } from '@/lib/lojista';
import {
  ESTADOS_EXPEDICAO,
  ESTADOS_PEDIDO,
  ESTADO_ANTERIOR,
  ETAPAS_PRODUCAO,
  type EstadoExpedicao,
  type EstadoPedido,
  type EtapaProducao,
} from '@/lib/pedidos';

/**
 * Ações de pedidos, produção e expedição.
 *
 * Como no resto do painel, tudo passa pela RLS com a sessão do lojista —
 * nenhuma usa service_role. Mesmo assim cada ação confere que o pedido é da
 * loja em curso antes de escrever: a conta pode ser membro de duas lojas, e a
 * RLS sozinha deixaria uma ação mexer na outra loja se o id viesse trocado no
 * formulário.
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

/** Confere que o pedido existe e pertence à loja em curso. Devolve o estado. */
async function pedidoDaLoja(pedidoId: string) {
  const loja = await exigirLoja();
  if (!pedidoId) throw new Error('Pedido não informado.');

  const supabase = await createClient();
  const { data } = await supabase
    .from('pedidos')
    .select('id, estado, numero')
    .eq('id', pedidoId)
    .eq('lojista_id', loja.id)
    .maybeSingle();

  if (!data) throw new Error('Pedido não encontrado nesta loja.');
  return { loja, supabase, pedido: data as unknown as { id: string; estado: EstadoPedido; numero: number } };
}

/** As quatro telas leem as mesmas linhas; mudar uma desatualiza as outras. */
function revalidarTudo(pedidoId?: string) {
  revalidatePath('/pedidos');
  if (pedidoId) revalidatePath(`/pedidos/${pedidoId}`);
  revalidatePath('/producao');
  revalidatePath('/expedicao');
  revalidatePath('/pagamentos');
}

// ---------------------------------------------------------------------------
// Pedidos
// ---------------------------------------------------------------------------

/** Marca um pedido como visto. `visto_em` nulo é o que gera o selo da lista. */
export async function marcarPedidoVisto(fd: FormData) {
  const { supabase, pedido } = await pedidoDaLoja(texto(fd, 'pedido_id'));
  const { error } = await supabase
    .from('pedidos')
    .update({ visto_em: new Date().toISOString() })
    .eq('id', pedido.id);
  if (error) throw new Error(error.message);
  revalidarTudo(pedido.id);
}

export async function marcarTodosVistos() {
  const loja = await exigirLoja();
  const supabase = await createClient();
  const { error } = await supabase
    .from('pedidos')
    .update({ visto_em: new Date().toISOString() })
    .eq('lojista_id', loja.id)
    .is('visto_em', null);
  if (error) throw new Error(error.message);
  revalidarTudo();
}

/**
 * Move o pedido para o estado pedido no formulário.
 *
 * Dois efeitos que existem para as telas não se contradizerem: entrar em
 * produção abre a ficha de produção, e ficar pronto abre a de expedição. Sem
 * isso o pedido apareceria "em produção" e a fila de produção estaria vazia.
 */
export async function avancarEstadoPedido(fd: FormData) {
  const { supabase, pedido } = await pedidoDaLoja(texto(fd, 'pedido_id'));
  const destino = texto(fd, 'estado') as EstadoPedido;

  if (!ESTADOS_PEDIDO.some((e) => e.id === destino)) throw new Error('Estado inválido.');
  if (pedido.estado === 'cancelado') throw new Error('Pedido cancelado não avança de estado.');

  // "Enviado" sem código é o que faz o cliente ligar perguntando onde está a
  // caixa. O código pode vir no formulário ou já estar gravado no envio; sem
  // nenhum dos dois o pedido não passa.
  if (destino === 'enviado') {
    const informado = texto(fd, 'rastreio');
    const { data: envio } = await supabase
      .from('expedicao')
      .select('id, rastreio')
      .eq('pedido_id', pedido.id)
      .maybeSingle();
    const codigo = informado || envio?.rastreio || '';
    if (!codigo) throw new Error('Informe o código de rastreio antes de marcar o pedido como enviado.');
    if (informado && envio) {
      await supabase
        .from('expedicao')
        .update({
          rastreio: informado,
          transportadora: texto(fd, 'transportadora') || undefined,
          estado: 'postado',
          postado_em: new Date().toISOString(),
          atualizado_em: new Date().toISOString(),
        })
        .eq('id', envio.id);
    }
  }

  const agora = new Date().toISOString();
  const { error } = await supabase
    .from('pedidos')
    .update({ estado: destino, atualizado_em: agora })
    .eq('id', pedido.id);
  if (error) throw new Error(error.message);

  if (destino === 'em_producao') await garantirProducao(pedido.id);
  if (destino === 'pronto' || destino === 'enviado') await garantirExpedicao(pedido.id);

  revalidarTudo(pedido.id);
}

/**
 * Volta o pedido um passo no fluxo.
 *
 * Nada é desfeito além do estado: a ficha de produção e a de expedição ficam
 * onde estão, porque a caixa não desmonta sozinha. Quem voltou o pedido por
 * engano de digitação quer só o rótulo certo; quem voltou de verdade vai
 * mexer nas duas fichas na mão, e é melhor que isso seja explícito.
 */
export async function voltarEstadoPedido(fd: FormData) {
  const { supabase, pedido } = await pedidoDaLoja(texto(fd, 'pedido_id'));
  const destino = (texto(fd, 'estado') || ESTADO_ANTERIOR[pedido.estado as EstadoPedido]) as EstadoPedido;

  if (!destino) throw new Error('Este pedido já está no começo do fluxo.');
  if (!ESTADOS_PEDIDO.some((e) => e.id === destino)) throw new Error('Estado inválido.');
  if (pedido.estado === 'cancelado') throw new Error('Pedido cancelado não volta de estado.');

  const ordem = ESTADOS_PEDIDO.map((e) => e.id);
  if (ordem.indexOf(destino) >= ordem.indexOf(pedido.estado as EstadoPedido)) {
    throw new Error('Para adiantar o pedido use "avançar".');
  }

  const { error } = await supabase
    .from('pedidos')
    .update({ estado: destino, atualizado_em: new Date().toISOString() })
    .eq('id', pedido.id);
  if (error) throw new Error(error.message);

  revalidarTudo(pedido.id);
}

/** Cancela com motivo. O motivo é obrigatório: é o que o cliente vai ouvir. */
export async function cancelarPedido(fd: FormData) {
  const { supabase, pedido } = await pedidoDaLoja(texto(fd, 'pedido_id'));
  const motivo = texto(fd, 'motivo');
  if (!motivo) throw new Error('Informe o motivo do cancelamento.');

  const { error } = await supabase
    .from('pedidos')
    .update({
      estado: 'cancelado',
      motivo_cancelamento: motivo,
      atualizado_em: new Date().toISOString(),
    })
    .eq('id', pedido.id);
  if (error) throw new Error(error.message);
  revalidarTudo(pedido.id);
}

// ---------------------------------------------------------------------------
// Produção
// ---------------------------------------------------------------------------

/** Abre a ficha de produção se ainda não houver uma. Idempotente. */
async function garantirProducao(pedidoId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from('producao').select('id').eq('pedido_id', pedidoId).limit(1);
  if ((data ?? []).length) return;
  await supabase.from('producao').insert({ pedido_id: pedidoId, etapa: 'fila' });
}

async function garantirExpedicao(pedidoId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from('expedicao').select('id').eq('pedido_id', pedidoId).limit(1);
  if ((data ?? []).length) return;
  await supabase.from('expedicao').insert({ pedido_id: pedidoId, estado: 'aguardando' });
}

/** Coloca na fila um pedido pago que ainda não tinha ficha. */
export async function colocarNaFila(fd: FormData) {
  const { pedido } = await pedidoDaLoja(texto(fd, 'pedido_id'));
  await garantirProducao(pedido.id);
  revalidarTudo(pedido.id);
}

/**
 * Move a ficha de etapa.
 *
 * Registra `iniciada_em` na saída da fila e `concluida_em` na chegada ao
 * pronto — são os dois instantes que dão o tempo real de produção; deixar para
 * calcular depois seria perder o dado.
 */
export async function moverEtapaProducao(fd: FormData) {
  const loja = await exigirLoja();
  const producaoId = texto(fd, 'producao_id');
  const etapa = texto(fd, 'etapa') as EtapaProducao;
  if (!ETAPAS_PRODUCAO.some((e) => e.id === etapa)) throw new Error('Etapa inválida.');

  const supabase = await createClient();
  const { data } = await supabase
    .from('producao')
    .select('id, etapa, iniciada_em, pedido_id, pedidos!inner(lojista_id, estado)')
    .eq('id', producaoId)
    .eq('pedidos.lojista_id', loja.id)
    .maybeSingle();

  const ficha = data as unknown as
    | { id: string; etapa: EtapaProducao; iniciada_em: string | null; pedido_id: string; pedidos: { estado: EstadoPedido } }
    | null;
  if (!ficha) throw new Error('Ficha de produção não encontrada nesta loja.');

  const agora = new Date().toISOString();
  const mudanca: Record<string, unknown> = { etapa, atualizado_em: agora };
  if (etapa !== 'fila' && !ficha.iniciada_em) mudanca.iniciada_em = agora;
  mudanca.concluida_em = etapa === 'pronto' ? agora : null;
  if (fd.has('responsavel')) mudanca.responsavel = texto(fd, 'responsavel') || null;

  const { error } = await supabase.from('producao').update(mudanca).eq('id', ficha.id);
  if (error) throw new Error(error.message);

  // O estado do pedido acompanha a produção; senão a lista de pedidos diria
  // "pago" com a peça já saindo do acabamento.
  if (etapa === 'pronto' && ficha.pedidos.estado === 'em_producao') {
    await supabase.from('pedidos').update({ estado: 'pronto', atualizado_em: agora }).eq('id', ficha.pedido_id);
    await garantirExpedicao(ficha.pedido_id);
  } else if (etapa !== 'pronto' && ['pago', 'pronto'].includes(ficha.pedidos.estado)) {
    await supabase.from('pedidos').update({ estado: 'em_producao', atualizado_em: agora }).eq('id', ficha.pedido_id);
  }

  revalidarTudo(ficha.pedido_id);
}

// ---------------------------------------------------------------------------
// Expedição
// ---------------------------------------------------------------------------

/** Abre a ficha de expedição de um pedido pronto que ainda não tinha uma. */
export async function abrirExpedicao(fd: FormData) {
  const { pedido } = await pedidoDaLoja(texto(fd, 'pedido_id'));
  await garantirExpedicao(pedido.id);
  revalidarTudo(pedido.id);
}

async function fichaDeExpedicao(expedicaoId: string) {
  const loja = await exigirLoja();
  const supabase = await createClient();
  const { data } = await supabase
    .from('expedicao')
    .select('id, estado, rastreio, pedido_id, pedidos!inner(lojista_id, estado)')
    .eq('id', expedicaoId)
    .eq('pedidos.lojista_id', loja.id)
    .maybeSingle();

  const ficha = data as unknown as
    | { id: string; estado: EstadoExpedicao; rastreio: string | null; pedido_id: string; pedidos: { estado: EstadoPedido } }
    | null;
  if (!ficha) throw new Error('Envio não encontrado nesta loja.');
  return { supabase, ficha };
}

/** Grava transportadora e código de rastreio. */
export async function salvarRastreio(fd: FormData) {
  const { supabase, ficha } = await fichaDeExpedicao(texto(fd, 'expedicao_id'));
  const { error } = await supabase
    .from('expedicao')
    .update({
      transportadora: texto(fd, 'transportadora') || null,
      rastreio: texto(fd, 'rastreio') || null,
      atualizado_em: new Date().toISOString(),
    })
    .eq('id', ficha.id);
  if (error) throw new Error(error.message);
  revalidarTudo(ficha.pedido_id);
}

/**
 * Muda o estado do envio e leva o pedido junto.
 *
 * Postar carimba `postado_em` e entregar carimba `entregue_em`; devolução
 * limpa a entrega, porque a caixa voltou e a data anterior passaria a mentir.
 */
export async function definirEstadoExpedicao(fd: FormData) {
  const { supabase, ficha } = await fichaDeExpedicao(texto(fd, 'expedicao_id'));
  const destino = texto(fd, 'estado') as EstadoExpedicao;
  if (!ESTADOS_EXPEDICAO.some((e) => e.id === destino)) throw new Error('Estado inválido.');

  const agora = new Date().toISOString();
  const mudanca: Record<string, unknown> = { estado: destino, atualizado_em: agora };

  // Mesma regra do pedido: postar é o momento em que o código passa a existir
  // para o cliente. Sem ele, a tela dele não teria o que mostrar.
  if (destino === 'postado' || destino === 'em_transito') {
    const codigo = fd.has('rastreio') ? texto(fd, 'rastreio') : ficha.rastreio;
    if (!codigo) throw new Error('Informe o código de rastreio antes de postar o envio.');
  }
  if (destino === 'postado') mudanca.postado_em = agora;
  if (destino === 'entregue') mudanca.entregue_em = agora;
  if (destino === 'devolvido') mudanca.entregue_em = null;

  // Transportadora e rastreio chegam no mesmo formulário do botão "Postar":
  // exigir dois cliques para postar seria atrito sem ganho.
  if (fd.has('transportadora')) mudanca.transportadora = texto(fd, 'transportadora') || null;
  if (fd.has('rastreio')) mudanca.rastreio = texto(fd, 'rastreio') || null;

  const { error } = await supabase.from('expedicao').update(mudanca).eq('id', ficha.id);
  if (error) throw new Error(error.message);

  const doPedido: Partial<Record<EstadoExpedicao, EstadoPedido>> = {
    postado: 'enviado',
    em_transito: 'enviado',
    entregue: 'entregue',
  };
  const novo = doPedido[destino];
  if (novo && ficha.pedidos.estado !== 'cancelado' && ficha.pedidos.estado !== novo) {
    await supabase.from('pedidos').update({ estado: novo, atualizado_em: agora }).eq('id', ficha.pedido_id);
  }

  revalidarTudo(ficha.pedido_id);
}
