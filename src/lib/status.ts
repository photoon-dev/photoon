import type { StatusProjeto } from '@/lib/data';

/**
 * Cor com funcao (Design System, 05): azul = acao, ciano = dados,
 * verde = feito, ambar = atencao, coral = risco.
 */
export const STATUS: Record<
  StatusProjeto,
  { rotulo: string; chip: string; acao: string; filtro: string }
> = {
  nao_iniciado: {
    rotulo: 'Não iniciado',
    chip: 'bg-blue-soft text-muted',
    acao: 'Começar',
    filtro: 'Não iniciados',
  },
  em_edicao: {
    rotulo: 'Em edição',
    chip: 'bg-blue-surface text-blue',
    acao: 'Continuar',
    filtro: 'Em edição',
  },
  com_pendencias: {
    rotulo: 'Com pendências',
    chip: 'bg-amber-surface text-[#B45309]',
    acao: 'Corrigir',
    filtro: 'Com pendências',
  },
  pronto: {
    rotulo: 'Pronto para finalizar',
    chip: 'bg-green-surface text-[#059669]',
    acao: 'Editar',
    filtro: 'Prontos para finalizar',
  },
  finalizado: {
    rotulo: 'Finalizado',
    chip: 'bg-cyan-surface text-[#0891B2]',
    acao: 'Ver álbum',
    filtro: 'Finalizados',
  },
};

export const ORDEM_STATUS: StatusProjeto[] = [
  'nao_iniciado',
  'em_edicao',
  'com_pendencias',
  'pronto',
  'finalizado',
];
