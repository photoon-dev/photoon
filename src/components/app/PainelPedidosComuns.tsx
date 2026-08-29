import { termo } from '@/lib/pedidos';

/**
 * Peças repetidas pelas telas de Pedidos, Produção, Expedição e Pagamentos.
 *
 * São componentes de servidor de propósito: nada aqui precisa de estado no
 * navegador — filtro é `<form method="get">` e ação é Server Action — e assim
 * as quatro telas não carregam JavaScript nenhum.
 */

export const CARD = 'rounded-[18px] border border-line bg-surface';
export const CAMPO =
  'h-11 w-full rounded-[14px] border border-line bg-surface px-3.5 text-[14px] text-ink outline-none focus:border-blue';
export const ROTULO = 'text-[12.5px] font-semibold text-ink-3';
export const BOTAO =
  'flex h-11 items-center justify-center gap-2 rounded-[14px] border border-line bg-surface px-4 text-[13.5px] font-semibold text-ink hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue disabled:opacity-50';
export const BOTAO_PEQUENO =
  'flex h-9 items-center justify-center rounded-[12px] border border-line bg-surface px-3 text-[12.5px] font-semibold text-ink-3 hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue';
export const BOTAO_PRIMARIO =
  'flex h-11 items-center justify-center gap-2 rounded-[14px] bg-lente px-4 text-[13.5px] font-bold text-white shadow-card hover:brightness-[1.06]';

/** Selo de estado. `lista` é uma das tabelas de vocabulário de `lib/pedidos`. */
export function Selo({
  lista,
  id,
}: {
  lista: Parameters<typeof termo>[0];
  id: string | null | undefined;
}) {
  const t = termo(lista, id);
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11.5px] font-bold ${t.classe}`}>
      {t.rotulo}
    </span>
  );
}

/** Cabeçalho padrão das telas do lojista. */
export function Cabecalho({
  trilha,
  titulo,
  descricao,
  acao,
}: {
  trilha: string;
  titulo: string;
  descricao: string;
  acao?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="m-0 text-[12.5px] font-semibold uppercase tracking-[1.2px] text-muted-2">{trilha}</p>
        <h1 className="m-0 mt-1.5 text-[26px] font-extrabold tracking-[-.9px]">{titulo}</h1>
        <p className="m-0 mt-1.5 text-[13.5px] text-muted">{descricao}</p>
      </div>
      {acao}
    </div>
  );
}

/**
 * Estado vazio. Diz o que fazer para a lista deixar de ser vazia — a auditoria
 * apontou que preencher a tela com exemplo inventado é pior que não ter nada.
 */
export function Vazio({ titulo, texto }: { titulo: string; texto: string }) {
  return (
    <div className={`${CARD} px-6 py-14 text-center`}>
      <p className="m-0 text-[15px] font-bold">{titulo}</p>
      <p className="mx-auto m-0 mt-2 max-w-[520px] text-[13.5px] text-muted">{texto}</p>
    </div>
  );
}

/** Nome do cliente, ou o e-mail, ou a verdade: o pedido não tem cliente ligado. */
export function NomeDoCliente({ cliente }: { cliente: { nome: string | null; email: string | null } | null }) {
  if (!cliente) return <span className="text-muted-2">Sem cliente vinculado</span>;
  return (
    <span>
      <span className="block text-[13.5px] font-semibold">{cliente.nome ?? cliente.email ?? 'Sem nome'}</span>
      {cliente.nome && cliente.email && (
        <span className="block text-[11.5px] text-muted-2">{cliente.email}</span>
      )}
    </span>
  );
}
