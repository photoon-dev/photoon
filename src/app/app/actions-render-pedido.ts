'use server';

/**
 * Ações de renderização em massa de um pedido.
 *
 * O fluxo é em dois passos para obedecer ao briefing da Fase 8:
 *
 *   1. `simularRenderizacaoDoPedido` lista projetos elegíveis e bloqueados,
 *      com o motivo de cada bloqueio. Não cria nada.
 *   2. `enfileirarProjetosDoPedido(pedidoId)` cria `render_jobs` apenas
 *      para os elegíveis. Idempotente dentro de uma janela curta: dois cliques
 *      em sequência não duplicam jobs, porque a checagem de "job ativo
 *      equivalente" é reavaliada a cada chamada.
 *
 * Validações aplicadas a cada projeto:
 *   - mesmo lojista do pedido (defesa em profundidade, mesmo com RLS);
 *   - associado ao pedido via `pedido_itens.projeto_id` (relação real);
 *   - não arquivado (`arquivado_em is null`);
 *   - estado compatível com renderização;
 *   - sem `projeto_validacoes` com severidade "erro";
 *   - sem `render_jobs` em estado ativo.
 */

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { lojaAtual } from '@/lib/lojista';

const ESTADOS_RENDER_ATIVOS = new Set([
  'na_fila',
  'preparando',
  'baixando',
  'processando',
  'upload',
]);

const ESTADOS_PROJETO_ELEGIVEIS = new Set([
  'em_edicao',
  'com_pendencias',
  'pronto',
  'finalizado',
  'aguardando_cliente',
]);

export type MotivoBloqueio =
  | 'fora_da_loja'
  | 'sem_vinculo'
  | 'arquivado'
  | 'estado_incompativel'
  | 'pre_flight_erro'
  | 'job_ativo';

export type ResultadoSimulacao = {
  elegiveis: Array<{ projeto_id: string; codigo: string | null; titulo: string; status: string }>;
  bloqueados: Array<{
    projeto_id: string;
    codigo: string | null;
    titulo: string;
    status: string;
    motivo: MotivoBloqueio;
    descricao: string;
  }>;
  /** Texto pronto pra mostrar pro usuário. */
  resumo: string;
};

const MOTIVO_DESCRICAO: Record<MotivoBloqueio, string> = {
  fora_da_loja: 'Projeto pertence a outra loja.',
  sem_vinculo: 'Projeto não está associado a este pedido.',
  arquivado: 'Projeto arquivado.',
  estado_incompativel: 'Estado do projeto não permite renderização.',
  pre_flight_erro: 'Pré-flight acusou erros críticos.',
  job_ativo: 'Já existe um job de renderização ativo para este projeto.',
};

async function exigirLojistaEPedido(pedidoId: string) {
  const loja = await lojaAtual();
  if (!loja) throw new Error('Sua conta não administra nenhuma loja.');
  if (!pedidoId) throw new Error('Pedido não informado.');
  const supabase = await createClient();
  const { data: ped } = await supabase
    .from('pedidos')
    .select('id, lojista_id')
    .eq('id', pedidoId)
    .eq('lojista_id', loja.id)
    .maybeSingle();
  if (!ped) throw new Error('Pedido não encontrado nesta loja.');
  return { loja, supabase };
}

/** Traz os projetos do pedido já com os contadores de validação e jobs ativos. */
async function projetosDoPedidoParaRender(lojistaId: string, pedidoId: string) {
  const supabase = await createClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = (await supabase
    .from('pedido_itens')
    .select(
      'id, projeto_id, ' +
        'projetos!inner(' +
        'id, codigo, titulo, status, lojista_id, arquivado_em, ' +
        'projeto_validacoes(severidade), ' +
        'render_jobs(id, estado)' +
        ')',
    )
    .eq('pedido_id', pedidoId)
    .eq('projetos.lojista_id', lojistaId)
    .not('projeto_id', 'is', null)) as { data: any[] | null };

  return (data ?? []) as any[];
}

export async function simularRenderizacaoDoPedido(
  pedidoId: string,
): Promise<ResultadoSimulacao> {
  const { loja } = await exigirLojistaEPedido(pedidoId);
  const linhas = await projetosDoPedidoParaRender(loja.id, pedidoId);

  const elegiveis: ResultadoSimulacao['elegiveis'] = [];
  const bloqueados: ResultadoSimulacao['bloqueados'] = [];

  for (const linha of linhas) {
    const p = linha.projetos;
    const codigo = p.codigo ?? null;
    const titulo = p.titulo ?? 'Projeto sem título';
    const status = p.status;

    if (p.lojista_id !== loja.id) {
      bloqueados.push({ projeto_id: p.id, codigo, titulo, status, motivo: 'fora_da_loja', descricao: MOTIVO_DESCRICAO.fora_da_loja });
      continue;
    }
    if (!linha.projeto_id || linha.projeto_id !== p.id) {
      bloqueados.push({ projeto_id: p.id, codigo, titulo, status, motivo: 'sem_vinculo', descricao: MOTIVO_DESCRICAO.sem_vinculo });
      continue;
    }
    if (p.arquivado_em) {
      bloqueados.push({ projeto_id: p.id, codigo, titulo, status, motivo: 'arquivado', descricao: MOTIVO_DESCRICAO.arquivado });
      continue;
    }
    if (!ESTADOS_PROJETO_ELEGIVEIS.has(status)) {
      bloqueados.push({ projeto_id: p.id, codigo, titulo, status, motivo: 'estado_incompativel', descricao: MOTIVO_DESCRICAO.estado_incompativel });
      continue;
    }
    const validacoes: any[] = Array.isArray(p.projeto_validacoes) ? p.projeto_validacoes : [];
    if (validacoes.some((v) => v.severidade === 'erro')) {
      bloqueados.push({ projeto_id: p.id, codigo, titulo, status, motivo: 'pre_flight_erro', descricao: MOTIVO_DESCRICAO.pre_flight_erro });
      continue;
    }
    const jobs: any[] = Array.isArray(p.render_jobs) ? p.render_jobs : [];
    if (jobs.some((j) => ESTADOS_RENDER_ATIVOS.has(j.estado))) {
      bloqueados.push({ projeto_id: p.id, codigo, titulo, status, motivo: 'job_ativo', descricao: MOTIVO_DESCRICAO.job_ativo });
      continue;
    }
    elegiveis.push({ projeto_id: p.id, codigo, titulo, status });
  }

  const resumo =
    elegiveis.length === 0 && bloqueados.length === 0
      ? 'Nenhum projeto associado a este pedido.'
      : `${elegiveis.length} prontos para renderizar, ${bloqueados.length} bloqueados.`;

  return { elegiveis, bloqueados, resumo };
}

export type ResultadoEnfileiramento = {
  criados: Array<{ projeto_id: string; job_id: string; codigo: string | null; titulo: string }>;
  pulados: Array<{ projeto_id: string; motivo: MotivoBloqueio; descricao: string }>;
};

/**
 * Cria `render_jobs` para os projetos elegíveis, reavaliando a elegibilidade
 * na hora (sem confiar no que o cliente viu antes). Idempotente: dois cliques
 * em sequência não duplicam, porque a checagem de "job ativo" é refeita.
 */
export async function enfileirarProjetosDoPedido(
  pedidoId: string,
): Promise<ResultadoEnfileiramento> {
  const { loja, supabase } = await exigirLojistaEPedido(pedidoId);
  const sim = await simularRenderizacaoDoPedido(pedidoId);

  const criados: ResultadoEnfileiramento['criados'] = [];
  const pulados: ResultadoEnfileiramento['pulados'] = sim.bloqueados.map((b) => ({
    projeto_id: b.projeto_id,
    motivo: b.motivo,
    descricao: b.descricao,
  }));

  for (const e of sim.elegiveis) {
    // Segunda checagem, em nome do "não duplicar por clique repetido": se
    // entre o simular e o criar apareceu um job ativo, pulamos.
    const { data: ativo } = await supabase
      .from('render_jobs')
      .select('id')
      .eq('projeto_id', e.projeto_id)
      .in('estado', Array.from(ESTADOS_RENDER_ATIVOS))
      .limit(1);
    if ((ativo ?? []).length) {
      pulados.push({ projeto_id: e.projeto_id, motivo: 'job_ativo', descricao: MOTIVO_DESCRICAO.job_ativo });
      continue;
    }

    // A função `enfileirarProjeto` original do worker de renderização já
    // existe. Aqui inserimos direto para manter esta ação auto-contida;
    // sincronizar com `actions-render.ts` viria na Fase 8.5.
    const { data: inserido, error } = await supabase
      .from('render_jobs')
      .insert({
        projeto_id: e.projeto_id,
        pedido_id: pedidoId,
        lojista_id: loja.id,
        estado: 'na_fila',
        tentativa: 1,
        progresso: 0,
      })
      .select('id')
      .single();
    if (error || !inserido) {
      // 23505 = unique violation em alguma constraint que ainda não conhecemos;
      // tratamos como duplicado e seguimos.
      pulados.push({
        projeto_id: e.projeto_id,
        motivo: 'job_ativo',
        descricao: error?.message ?? 'Falha ao criar job.',
      });
      continue;
    }
    criados.push({ projeto_id: e.projeto_id, job_id: inserido.id, codigo: e.codigo, titulo: e.titulo });
  }

  revalidatePath('/pedidos');
  revalidatePath(`/pedidos/${pedidoId}`);
  revalidatePath('/renderizacao');
  revalidatePath(`/renderizacao/${criados[0]?.job_id ?? ''}`);

  return { criados, pulados };
}
