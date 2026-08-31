'use server';

/**
 * Acoes em massa na lista de pedidos.
 *
 *  - confirmarPagamento(pedidoIds)        — marca todos como 'pago'
 *  - enviarParaProducao(pedidoIds)        — 'em_producao' + abre ficha de producao
 *  - alterarStatus(pedidoIds, novoEstado) — estado arbitrario
 *  - exportar(pedidoIds)                  — CSV com os pedidos selecionados
 *
 * Cada acao passa por RLS + a checagem de loja do padrao do projeto.
 * Acoes sensiveis pedem confirmacao no cliente (via Modal/Confirmacao).
 */

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { lojaAtual } from '@/lib/lojista';
import { ESTADOS_PEDIDO, type EstadoPedido } from '@/lib/pedidos-termos';

async function exigirLoja() {
  const loja = await lojaAtual();
  if (!loja) throw new Error('Sua conta nao administra nenhuma loja.');
  return loja;
}

const texto = (fd: FormData, campo: string) => {
  const v = fd.get(campo);
  return typeof v === 'string' ? v.trim() : '';
};

const idsDoForm = (fd: FormData): string[] => {
  const ids: string[] = [];
  for (const [k, v] of fd.entries()) {
    if (k === 'pedido_id' && typeof v === 'string') ids.push(v);
  }
  return Array.from(new Set(ids));
};

async function validarPertenca(pedidoIds: string[]): Promise<string[]> {
  if (pedidoIds.length === 0) return [];
  const loja = await lojaAtual();
  if (!loja) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from('pedidos')
    .select('id')
    .eq('lojista_id', loja.id)
    .in('id', pedidoIds);
  // Mantem apenas os ids que existem E pertecem a loja.
  return (data ?? []).map((r) => r.id as string);
}

export async function confirmarPagamentoEmMassa(fd: FormData) {
  const loja = await exigirLoja();
  const ids = await validarPertenca(idsDoForm(fd));
  if (ids.length === 0) throw new Error('Nenhum pedido valido.');

  const supabase = await createClient();
  const { error } = await supabase
    .from('pedidos')
    .update({ estado: 'pago', atualizado_em: new Date().toISOString() })
    .eq('lojista_id', loja.id)
    .in('id', ids);
  if (error) throw new Error(error.message);
  revalidatePath('/pedidos');
  return { afetados: ids.length };
}

export async function enviarParaProducaoEmMassa(fd: FormData) {
  const loja = await exigirLoja();
  const ids = await validarPertenca(idsDoForm(fd));
  if (ids.length === 0) throw new Error('Nenhum pedido valido.');

  const supabase = await createClient();
  const agora = new Date().toISOString();
  const { error } = await supabase
    .from('pedidos')
    .update({ estado: 'em_producao', atualizado_em: agora })
    .eq('lojista_id', loja.id)
    .in('id', ids);
  if (error) throw new Error(error.message);

  // Abre ficha de producao para cada um.
  for (const id of ids) {
    const { data: existe } = await supabase
      .from('producao')
      .select('id')
      .eq('pedido_id', id)
      .limit(1);
    if (!(existe ?? []).length) {
      await supabase.from('producao').insert({ pedido_id: id, etapa: 'fila' });
    }
  }
  revalidatePath('/pedidos');
  revalidatePath('/producao');
  return { afetados: ids.length };
}

export async function alterarStatusEmMassa(fd: FormData) {
  const loja = await exigirLoja();
  const destino = texto(fd, 'estado') as EstadoPedido;
  if (!ESTADOS_PEDIDO.some((e) => e.id === destino)) {
    throw new Error('Estado invalido.');
  }
  const ids = await validarPertenca(idsDoForm(fd));
  if (ids.length === 0) throw new Error('Nenhum pedido valido.');

  const supabase = await createClient();
  const { error } = await supabase
    .from('pedidos')
    .update({ estado: destino, atualizado_em: new Date().toISOString() })
    .eq('lojista_id', loja.id)
    .in('id', ids);
  if (error) throw new Error(error.message);

  // Abre ficha de expedicao para 'pronto' / 'enviado'.
  if (destino === 'pronto' || destino === 'enviado') {
    for (const id of ids) {
      const { data: existe } = await supabase
        .from('expedicao')
        .select('id')
        .eq('pedido_id', id)
        .limit(1);
      if (!(existe ?? []).length) {
        await supabase.from('expedicao').insert({ pedido_id: id, estado: 'aguardando' });
      }
    }
  }
  revalidatePath('/pedidos');
  revalidatePath('/expedicao');
  return { afetados: ids.length };
}

/**
 * Exporta os pedidos selecionados em CSV (texto em memoria; navegador faz
 * download via blob). Por enquanto devolve o texto; o cliente monta o link.
 */
export async function exportarPedidosCSV(fd: FormData) {
  const ids = await validarPertenca(idsDoForm(fd));
  if (ids.length === 0) throw new Error('Nenhum pedido valido.');

  const supabase = await createClient();
  const { data } = await supabase
    .from('pedidos')
    .select('id, numero, codigo, estado, canal, total, prazo_em, criado_em, clientes(nome, email)')
    .in('id', ids)
    .order('numero', { ascending: false });

  const linhas = [
    'numero,codigo,estado,canal,cliente,email,total,prazo,criado_em',
  ];
  for (const p of (data ?? []) as any[]) {
    linhas.push(
      [
        p.numero,
        p.codigo ?? '',
        p.estado,
        p.canal,
        JSON.stringify(p.clientes?.nome ?? ''),
        JSON.stringify(p.clientes?.email ?? ''),
        p.total,
        p.prazo_em ?? '',
        p.criado_em,
      ].join(','),
    );
  }
  return { csv: linhas.join('\n'), quantidade: ids.length };
}
