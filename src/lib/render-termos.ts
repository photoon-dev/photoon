/**
 * O vocabulário da renderização.
 *
 * Módulo sem `next/headers`, pelo mesmo motivo de `pedidos-termos.ts`: as telas
 * são componentes de navegador e precisam dos rótulos e cores.
 *
 * RENDERIZAÇÃO é entidade própria. Não é um campo do pedido nem um estado do
 * projeto: é o job que pega um projeto e produz arquivos. Por isso ela tem
 * estado, etapa, tentativa, worker e log próprios.
 */

import type { Tom } from '@/components/ui/tokens';

export type EstadoJob =
  | 'na_fila' | 'preparando' | 'validando' | 'renderizando' | 'compactando'
  | 'enviando' | 'pronto' | 'baixando' | 'entregue' | 'erro' | 'cancelado';

export type EtapaJob =
  | 'preflight' | 'preparacao' | 'renderizacao' | 'validacao'
  | 'compactacao' | 'upload' | 'entrega';

export const ESTADOS_JOB: { id: EstadoJob; rotulo: string; tom: Tom }[] = [
  { id: 'na_fila',      rotulo: 'Na fila',      tom: 'neutro' },
  { id: 'preparando',   rotulo: 'Preparando',   tom: 'azul' },
  { id: 'validando',    rotulo: 'Validando',    tom: 'azul' },
  { id: 'renderizando', rotulo: 'Renderizando', tom: 'indigo' },
  { id: 'compactando',  rotulo: 'Compactando',  tom: 'indigo' },
  { id: 'enviando',     rotulo: 'Enviando',     tom: 'indigo' },
  { id: 'pronto',       rotulo: 'Pronto',       tom: 'verde' },
  { id: 'baixando',     rotulo: 'Baixando',     tom: 'ciano' },
  { id: 'entregue',     rotulo: 'Entregue',     tom: 'verde' },
  { id: 'erro',         rotulo: 'Erro',         tom: 'coral' },
  { id: 'cancelado',    rotulo: 'Cancelado',    tom: 'neutro' },
];

/** As sete etapas, na ordem em que o job passa por elas. */
export const ETAPAS_JOB: { id: EtapaJob; rotulo: string }[] = [
  { id: 'preflight',    rotulo: 'Pré-flight' },
  { id: 'preparacao',   rotulo: 'Preparação' },
  { id: 'renderizacao', rotulo: 'Renderização' },
  { id: 'validacao',    rotulo: 'Validação' },
  { id: 'compactacao',  rotulo: 'Compactação' },
  { id: 'upload',       rotulo: 'Upload' },
  { id: 'entrega',      rotulo: 'Entrega' },
];

/** Estados em que o job ainda está andando — não terminou nem falhou. */
export const EM_ANDAMENTO: EstadoJob[] = [
  'preparando', 'validando', 'renderizando', 'compactando', 'enviando', 'baixando',
];

export const TERMINADOS: EstadoJob[] = ['pronto', 'entregue'];

/** Estados que ainda aceitam cancelamento: depois disso não há o que parar. */
export const CANCELAVEIS: EstadoJob[] = ['na_fila', 'preparando', 'validando', 'renderizando'];

export const termoJob = (id: string | null | undefined) =>
  ESTADOS_JOB.find((t) => t.id === id) ??
  { id: 'na_fila' as EstadoJob, rotulo: id ?? '—', tom: 'neutro' as Tom };

export const rotuloEtapa = (id: string | null | undefined) =>
  ETAPAS_JOB.find((e) => e.id === id)?.rotulo ?? id ?? '—';

export const JOBS_POR_PAGINA = 25;

/** Duração legível entre dois instantes. */
export function duracao(de: string | null, ate: string | null): string {
  if (!de) return '—';
  const fim = ate ? new Date(ate).getTime() : Date.now();
  const s = Math.max(0, Math.round((fim - new Date(de).getTime()) / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}min ${s % 60}s`;
  return `${Math.floor(m / 60)}h ${m % 60}min`;
}

export type JobDaLista = {
  id: string;
  estado: EstadoJob;
  etapa: EtapaJob;
  progresso: number;
  tentativa: number;
  destino: string | null;
  erro_codigo: string | null;
  erro_mensagem: string | null;
  criado_em: string;
  iniciado_em: string | null;
  concluido_em: string | null;
  projetos: {
    id: string;
    codigo: string | null;
    titulo: string;
    produto_nome: string | null;
    clientes: { id: string; nome: string | null } | null;
  } | null;
  pedidos: { id: string; codigo: string | null; numero: number } | null;
  render_workers: { id: string; nome: string } | null;
};
