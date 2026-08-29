import Link from 'next/link';
import type { Periodo, Relatorios } from '@/lib/financeiro';
import { reais } from '@/lib/preco';

/**
 * Relatórios de venda: por período, por produto, por vendedor e por estado do
 * pedido. Os quatro cortes saem do MESMO conjunto de pedidos lido uma vez, para
 * que as tabelas não se contradigam entre si.
 */

const CARD = 'rounded-[18px] border border-line bg-surface';
const CAMPO =
  'h-11 w-full rounded-[14px] border border-line bg-surface px-3.5 text-[14px] text-ink outline-none focus:border-blue';
const ROTULO = 'text-[12.5px] font-semibold text-ink-3';
const BOTAO =
  'flex h-11 items-center justify-center rounded-[14px] border border-line bg-surface px-4 text-[13.5px] font-semibold text-ink hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue';
const TH = 'px-3 py-3 font-semibold';

/** Os mesmos nomes de estado da migração 0012, escritos como o lojista fala. */
const ESTADO_ROTULO: Record<string, string> = {
  rascunho: 'Rascunho',
  aguardando_pagamento: 'Aguardando pagamento',
  pago: 'Pago',
  em_producao: 'Em produção',
  pronto: 'Pronto',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

const dataCurta = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });

const n = (v: number) => v.toLocaleString('pt-BR');

function FiltroPeriodo({ periodo, base }: { periodo: Periodo; base: string }) {
  const atalho = (dias: number, rot: string) => (
    <Link
      key={dias}
      href={`${base}?dias=${dias}`}
      className={`rounded-full px-4 py-2 text-[13px] font-semibold ${
        periodo.dias === dias
          ? 'bg-lente text-white shadow-card'
          : 'border border-line bg-surface text-ink-3 hover:text-blue'
      }`}
    >
      {rot}
    </Link>
  );

  return (
    <div className={`${CARD} flex flex-wrap items-end gap-3 p-4`}>
      <div className="flex flex-wrap gap-2">
        {atalho(7, '7 dias')}
        {atalho(30, '30 dias')}
        {atalho(90, '90 dias')}
      </div>
      <form method="get" action={base} className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1.5">
          <span className={ROTULO}>De</span>
          <input type="date" name="de" defaultValue={periodo.de} className={`${CAMPO} w-[160px]`} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={ROTULO}>Até</span>
          <input type="date" name="ate" defaultValue={periodo.ate} className={`${CAMPO} w-[160px]`} />
        </label>
        <button type="submit" className={BOTAO}>
          Aplicar
        </button>
      </form>
      <p className="m-0 ml-auto max-w-[280px] text-[11.5px] leading-[1.45] text-muted-2">
        {periodo.dias
          ? `Últimos ${periodo.dias} dias, até hoje.`
          : `De ${dataCurta(periodo.deISO)} a ${dataCurta(periodo.ateISO)}.`}
      </p>
    </div>
  );
}

/** Tabela com barra proporcional ao maior valor da coluna. */
function Ranking({
  titulo,
  vazio,
  colunas,
  linhas,
}: {
  titulo: string;
  vazio: string;
  colunas: string[];
  linhas: { chave: string; nome: string; celulas: string[]; proporcao: number }[];
}) {
  return (
    <section className={`${CARD} overflow-hidden`}>
      <p className="m-0 border-b border-line px-6 py-4 text-[15px] font-bold">{titulo}</p>
      {linhas.length === 0 ? (
        <p className="m-0 px-6 py-8 text-center text-[13px] text-muted">{vazio}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-surface-2 text-[11.5px] uppercase tracking-[.6px] text-muted-2">
                <th className={`px-6 py-3 font-semibold`}>{colunas[0]}</th>
                {colunas.slice(1).map((c) => (
                  <th key={c} className={`${TH} text-right last:pr-6`}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {linhas.map((l) => (
                <tr key={l.chave} className="border-t border-line-2">
                  <td className="px-6 py-3">
                    <span className="block text-[13px] font-semibold">{l.nome}</span>
                    <span className="mt-1.5 block h-1.5 max-w-[220px] rounded-full bg-[#EEF1F7]">
                      <span
                        className="block h-full rounded-full bg-lente"
                        style={{ width: `${Math.max(2, l.proporcao * 100)}%` }}
                      />
                    </span>
                  </td>
                  {l.celulas.map((c, i) => (
                    <td
                      key={i}
                      className="whitespace-nowrap px-3 py-3 text-right text-[13px] text-ink-3 last:pr-6 last:font-semibold last:text-ink"
                    >
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function PainelRelatorios({
  dados,
  periodo,
}: {
  dados: Relatorios;
  periodo: Periodo;
}) {
  const picoDia = Math.max(1, ...dados.porDia.map((d) => d.valor));
  const maiorProduto = Math.max(1, ...dados.porProduto.map((p) => p.valor));
  const maiorVendedor = Math.max(1, ...dados.porVendedor.map((v) => v.valor));
  const maiorEstado = Math.max(1, ...dados.porEstado.map((e) => e.pedidos));

  const kpis = [
    { rotulo: 'Vendas', valor: reais(dados.vendas), nota: 'pedidos confirmados no período' },
    { rotulo: 'Pedidos', valor: n(dados.pedidos), nota: 'fora rascunho e cancelado' },
    { rotulo: 'Ticket médio', valor: reais(dados.ticketMedio), nota: 'por pedido confirmado' },
    { rotulo: 'Itens vendidos', valor: n(dados.itens), nota: 'álbuns e extras somados' },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="m-0 text-[12.5px] font-semibold uppercase tracking-[1.2px] text-muted-2">
          Financeiro · Relatórios
        </p>
        <h1 className="m-0 mt-1.5 text-[26px] font-extrabold tracking-[-.9px]">Relatórios</h1>
        <p className="m-0 mt-1.5 text-[13.5px] text-muted">
          Vendas do período abertas por dia, produto, vendedor e estado do pedido. O período recorta
          pela data de criação do pedido.
        </p>
      </div>

      <FiltroPeriodo periodo={periodo} base="/relatorios" />

      {!dados.temAlgumPedido ? (
        <section className={`${CARD} p-8 text-center`}>
          <p className="m-0 text-[15px] font-bold">Ainda não há pedidos nesta loja</p>
          <p className="m-0 mx-auto mt-2 max-w-[520px] text-[13px] leading-[1.6] text-muted">
            O relatório é o retrato dos pedidos: enquanto nenhum for fechado, não há o que somar.
            Cadastre o catálogo e libere um álbum para o cliente comprar.
          </p>
        </section>
      ) : (
        <>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(210px,1fr))]">
            {kpis.map((k) => (
              <div key={k.rotulo} className={`${CARD} px-5 py-4`}>
                <p className="m-0 text-[12.5px] text-muted-2">{k.rotulo}</p>
                <p className="m-0 mt-1 text-[25px] font-extrabold tracking-[-1px]">{k.valor}</p>
                <p className="m-0 mt-1 text-[11.5px] text-muted">{k.nota}</p>
              </div>
            ))}
          </div>

          {dados.truncado && (
            <p className="m-0 rounded-[14px] bg-amber-surface px-4 py-3 text-[12.5px] font-semibold text-[#B45309]">
              O período tem mais pedidos do que cabe numa leitura. Os números abaixo cobrem apenas os
              mais recentes — estreite o intervalo para um total exato.
            </p>
          )}

          <section className={`${CARD} p-6`}>
            <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
              <p className="m-0 text-[15px] font-bold">Vendas por dia</p>
              <span className="text-[12px] text-muted-2">
                {dados.porDia.length} dias com venda no período
              </span>
            </div>
            {dados.porDia.length === 0 ? (
              <p className="m-0 text-[13px] text-muted">
                Nenhuma venda confirmada neste período. Os pedidos existentes podem estar em
                rascunho ou cancelados — veja a tabela por estado.
              </p>
            ) : (
              <div className="flex h-[200px] items-end gap-1.5">
                {dados.porDia.map((d) => (
                  <div
                    key={d.dia}
                    title={`${dataCurta(`${d.dia}T12:00:00Z`)} · ${reais(d.valor)} · ${n(d.pedidos)} pedidos`}
                    className="flex-1 rounded-t-[6px] bg-lente"
                    style={{ height: `${Math.max(3, (d.valor / picoDia) * 100)}%` }}
                  />
                ))}
              </div>
            )}
          </section>

          <div className="grid gap-4 xl:grid-cols-2">
            <Ranking
              titulo="Por produto"
              vazio="Nenhum item vendido no período."
              colunas={['Produto', 'Qtd.', 'Valor']}
              linhas={dados.porProduto.map((p) => ({
                chave: p.nome,
                nome: p.nome,
                celulas: [n(p.quantidade), reais(p.valor)],
                proporcao: p.valor / maiorProduto,
              }))}
            />

            <Ranking
              titulo="Por vendedor"
              vazio="Nenhuma venda atribuída no período."
              colunas={['Vendedor', 'Pedidos', 'Comissão', 'Valor']}
              linhas={dados.porVendedor.map((v) => ({
                chave: v.nome,
                nome: v.nome,
                celulas: [n(v.pedidos), reais(v.comissao), reais(v.valor)],
                proporcao: v.valor / maiorVendedor,
              }))}
            />
          </div>

          <Ranking
            titulo="Por estado do pedido"
            vazio="Nenhum pedido criado no período."
            colunas={['Estado', 'Pedidos', 'Valor']}
            linhas={dados.porEstado.map((e) => ({
              chave: e.estado,
              nome: ESTADO_ROTULO[e.estado] ?? e.estado,
              celulas: [n(e.pedidos), reais(e.valor)],
              proporcao: e.pedidos / maiorEstado,
            }))}
          />
        </>
      )}
    </div>
  );
}
