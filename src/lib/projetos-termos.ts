/**
 * O vocabulário de projetos.
 *
 * Módulo à parte de `projetos.ts` pelo mesmo motivo de `pedidos-termos.ts`:
 * as telas do lojista são componentes de navegador e precisam dos rótulos e
 * cores, mas `projetos.ts` importa `next/headers` pelo client do Supabase e
 * arrastar isso para o pacote do navegador quebra a compilação.
 *
 * PROJETO não é PEDIDO. O cliente cria um projeto; um pedido reúne um ou
 * vários projetos; a renderização é outra entidade ainda. Os status daqui
 * descrevem só a vida do projeto — se ele já foi comprado é outra coluna.
 */

import type { Tom } from '@/components/ui/tokens';

export type StatusProjeto =
  // os cinco que o banco já tinha
  | 'nao_iniciado'
  | 'em_edicao'
  | 'com_pendencias'
  | 'pronto'
  | 'finalizado'
  // os que a 0015 acrescenta
  | 'aguardando_cliente'
  | 'fechado'
  | 'em_renderizacao'
  | 'renderizado'
  | 'com_erro'
  | 'arquivado';

export type TermoProjeto = { id: StatusProjeto; rotulo: string; tom: Tom };

/**
 * `com_pendencias` e `com_erro` parecem a mesma coisa e não são: a primeira é
 * aviso de qualidade no documento (DPI baixo, foto fora da área segura), a
 * segunda é falha de processo (a renderização não terminou). Quem atende
 * precisa distinguir para saber a quem recorrer.
 */
export const STATUS_PROJETO: TermoProjeto[] = [
  { id: 'nao_iniciado',       rotulo: 'Rascunho',           tom: 'neutro' },
  { id: 'em_edicao',          rotulo: 'Em edição',          tom: 'azul' },
  { id: 'aguardando_cliente', rotulo: 'Aguardando cliente', tom: 'ambar' },
  { id: 'com_pendencias',     rotulo: 'Com pendência',      tom: 'ambar' },
  { id: 'pronto',             rotulo: 'Pronto',             tom: 'ciano' },
  { id: 'finalizado',         rotulo: 'Finalizado',         tom: 'verde' },
  { id: 'fechado',            rotulo: 'Fechado',            tom: 'verde' },
  { id: 'em_renderizacao',    rotulo: 'Em renderização',    tom: 'indigo' },
  { id: 'renderizado',        rotulo: 'Renderizado',        tom: 'ciano' },
  { id: 'com_erro',           rotulo: 'Com erro',           tom: 'coral' },
  { id: 'arquivado',          rotulo: 'Arquivado',          tom: 'neutro' },
];

export const termoProjeto = (id: string | null | undefined): TermoProjeto =>
  STATUS_PROJETO.find((t) => t.id === id) ??
  { id: (id ?? 'nao_iniciado') as StatusProjeto, rotulo: id ?? '—', tom: 'neutro' };

/** Estado do último job de renderização, para a coluna Renderização. */
export type EstadoRender =
  | 'na_fila' | 'preparando' | 'validando' | 'renderizando' | 'compactando'
  | 'enviando' | 'pronto' | 'baixando' | 'entregue' | 'erro' | 'cancelado';

export const ESTADOS_RENDER: { id: EstadoRender; rotulo: string; tom: Tom }[] = [
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

export const termoRender = (id: string | null | undefined) =>
  ESTADOS_RENDER.find((t) => t.id === id) ??
  { id: 'na_fila' as EstadoRender, rotulo: '—', tom: 'neutro' as Tom };

export const PROJETOS_POR_PAGINA = 25;

/** Uma linha da Central de Projetos. */
export type ProjetoDaLista = {
  id: string;
  codigo: string | null;
  titulo: string;
  status: string;
  produto_nome: string | null;
  produto_tamanho: string | null;
  total_paginas: number | null;
  fotos_enviadas: number | null;
  fotos_usadas: number | null;
  capa_url: string | null;
  bytes_total: number | null;
  criado_em: string;
  atualizado_em: string;
  arquivado_em: string | null;
  clientes: { id: string; nome: string | null; email: string | null } | null;
  /** Pedido em que este projeto entrou, se já entrou em algum. */
  pedido: { id: string; codigo: string | null; numero: number } | null;
  /** Estado do job de renderização mais recente, se houver algum. */
  render: EstadoRender | null;
};

/**
 * Lâmina é a folha física: duas páginas do documento, esquerda e direita.
 *
 * `projetos.paginas` guarda `Lamina[]` — é o que o editor grava
 * (`paginas: [novaLamina(), novaLamina()]`). Mas `total_paginas` NÃO é o
 * comprimento desse array: a migration 0010 a redefiniu como
 * `jsonb_array_length(paginas) * 2`, justamente porque antes ela contava
 * lâminas e o preço saía pela metade — as páginas excedentes são cobradas do
 * cliente, e todo álbum estava sendo subfaturado.
 *
 * Ou seja: a coluna conta PÁGINAS, o array conta LÂMINAS, e a razão entre elas
 * é 2. Confirmado contra o banco real (array=5 → total_paginas=10).
 *
 * A armadilha é ler só a 0001, onde a coluna nasceu como
 * `jsonb_array_length(paginas)`, e concluir que ela conta lâminas. Não conta
 * mais desde a 0010. **Não inverta estes dois helpers.**
 */
export const paginasDoProjeto = (totalPaginasDaColuna: number | null | undefined) =>
  Math.max(0, totalPaginasDaColuna ?? 0);

export const laminasDoProjeto = (totalPaginasDaColuna: number | null | undefined) =>
  Math.ceil(paginasDoProjeto(totalPaginasDaColuna) / 2);

export const tamanho = (bytes: number | null | undefined) => {
  const b = bytes ?? 0;
  if (b <= 0) return '—';
  const u = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(u.length - 1, Math.floor(Math.log(b) / Math.log(1024)));
  const v = b / 1024 ** i;
  return `${v.toLocaleString('pt-BR', { maximumFractionDigits: v < 10 && i > 0 ? 1 : 0 })} ${u[i]}`;
};

/** O mesmo fuso de `pedidos-termos`; ver a nota lá. */
export const FUSO_DA_LOJA = 'America/Sao_Paulo';

export const dataCurta = (v: string | null | undefined) =>
  v
    ? new Date(v).toLocaleDateString('pt-BR', {
        day: '2-digit', month: 'short', timeZone: FUSO_DA_LOJA,
      })
    : '—';

export const dataHora = (v: string | null | undefined) =>
  v
    ? new Date(v).toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', timeZone: FUSO_DA_LOJA,
      })
    : '—';
