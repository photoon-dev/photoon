'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { lojaAtual } from '@/lib/lojista';
import { CANCELAVEIS } from '@/lib/render';

/**
 * Ações da fila de renderização.
 *
 * Nenhuma delas renderiza coisa alguma: elas só mexem na fila. Regra 9 do
 * briefing — renderização pesada não roda dentro da requisição HTTP. Quem
 * renderiza é o worker (`tools/worker-render.mjs`), que puxa daqui.
 *
 * Toda mudança de estado registra em `render_logs`, para que o detalhe do job
 * conte a história inteira mesmo quando alguém interveio pelo painel.
 */

async function contexto() {
  const loja = await lojaAtual();
  if (!loja) throw new Error('Sem loja no contexto.');
  const supabase = await createClient();
  return { loja, supabase };
}

async function registrar(
  supabase: Awaited<ReturnType<typeof createClient>>,
  jobId: string,
  mensagem: string,
  severidade = 'info',
) {
  await supabase.from('render_logs').insert({ job_id: jobId, mensagem, severidade });
}

/**
 * Põe um projeto na fila.
 *
 * O job nasce em `na_fila` e é só isso: o worker é quem o tira de lá. Se já
 * houver um job em andamento para o mesmo projeto, não cria outro — dois
 * workers escrevendo o mesmo arquivo é como um PDF sai pela metade.
 */
export async function enfileirarProjeto(projetoId: string, pedidoId?: string | null) {
  const { loja, supabase } = await contexto();

  const { data: emAndamento } = await supabase
    .from('render_jobs')
    .select('id')
    .eq('projeto_id', projetoId)
    .in('estado', ['na_fila', 'preparando', 'validando', 'renderizando', 'compactando', 'enviando'])
    .limit(1);

  if (emAndamento?.length) {
    return { ok: false, erro: 'Este projeto já está na fila.' as const };
  }

  const { data, error } = await supabase
    .from('render_jobs')
    .insert({
      lojista_id: loja.id,
      projeto_id: projetoId,
      pedido_id: pedidoId ?? null,
      estado: 'na_fila',
      etapa: 'preflight',
    })
    .select('id')
    .single();

  if (error) return { ok: false, erro: error.message };

  await registrar(supabase, data.id, 'Job criado pelo painel e colocado na fila.');
  await supabase.from('projetos').update({ status: 'em_renderizacao' }).eq('id', projetoId);

  revalidatePath('/renderizacao');
  revalidatePath(`/projetos/${projetoId}`);
  return { ok: true, id: data.id };
}

/**
 * Reprocessa um job que falhou.
 *
 * Cria um job NOVO com `tentativa` somada, em vez de reabrir o antigo: regra
 * 32 do briefing — a renderização registra tentativas e erros, e apagar a
 * falha anterior apagaria a informação de que ela existiu.
 */
export async function reprocessar(jobId: string) {
  const { loja, supabase } = await contexto();

  const { data: antigo } = await supabase
    .from('render_jobs')
    .select('id, projeto_id, pedido_id, tentativa, destino')
    .eq('lojista_id', loja.id)
    .eq('id', jobId)
    .maybeSingle();

  if (!antigo) return { ok: false, erro: 'Job não encontrado.' };

  const { data, error } = await supabase
    .from('render_jobs')
    .insert({
      lojista_id: loja.id,
      projeto_id: antigo.projeto_id,
      pedido_id: antigo.pedido_id,
      destino: antigo.destino,
      tentativa: (antigo.tentativa ?? 1) + 1,
      estado: 'na_fila',
      etapa: 'preflight',
    })
    .select('id')
    .single();

  if (error) return { ok: false, erro: error.message };

  await registrar(supabase, antigo.id, `Reprocessado pelo painel: nova tentativa em ${data.id}.`);
  await registrar(supabase, data.id, `Tentativa ${(antigo.tentativa ?? 1) + 1}, a partir do job ${antigo.id}.`);
  await supabase.from('projetos').update({ status: 'em_renderizacao' }).eq('id', antigo.projeto_id);

  revalidatePath('/renderizacao');
  return { ok: true, id: data.id };
}

/** Cancela um job que ainda não terminou. */
export async function cancelarJob(jobId: string, motivo: string) {
  const { loja, supabase } = await contexto();

  const { data: job } = await supabase
    .from('render_jobs')
    .select('id, estado, projeto_id')
    .eq('lojista_id', loja.id)
    .eq('id', jobId)
    .maybeSingle();

  if (!job) return { ok: false, erro: 'Job não encontrado.' };
  if (!CANCELAVEIS.includes(job.estado as never)) {
    return { ok: false, erro: 'Este job já terminou; não há o que cancelar.' };
  }

  const { error } = await supabase
    .from('render_jobs')
    .update({ estado: 'cancelado', concluido_em: new Date().toISOString() })
    .eq('id', jobId);

  if (error) return { ok: false, erro: error.message };

  await registrar(supabase, jobId, `Cancelado pelo painel. Motivo: ${motivo}`, 'aviso');

  // O projeto volta ao que era: cancelar a renderização não o deixa "em
  // renderização" para sempre.
  await supabase.from('projetos').update({ status: 'pronto' }).eq('id', job.projeto_id);

  revalidatePath('/renderizacao');
  return { ok: true };
}
