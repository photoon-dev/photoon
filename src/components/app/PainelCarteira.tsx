import Link from 'next/link';
import type { Carteira, Periodo } from '@/lib/financeiro';
import { reais } from '@/lib/preco';

/**
 * Carteira: o que entrou, o que ainda vai entrar e o que voltou.
 *
 * Não é componente de cliente: os filtros são navegação (links e um form GET),
 * então a tela inteira é HTML — nada de estado no navegador para mostrar
 * número que já veio pronto do banco.
 */

const CARD = 'rounded-[18px] border border-line bg-surface';
const CAMPO =
  'h-11 w-full rounded-[14px] border border-line bg-surface px-3.5 text-[14px] text-ink outline-none focus:border-blue';
const ROTULO = 'text-[12.5px] font-semibold text-ink-3';
const BOTAO =
  'flex h-11 items-center justify-center rounded-[14px] border border-line bg-surface px-4 text-[13.5px] font-semibold text-ink hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue';

const ESTADO_ROTULO: Record<string, string> = {
  aprovado: 'Aprovado',
  pendente: 'Pendente',
  estornado: 'Estornado',
  recusado: 'Recusado',
  expirado: 'Expirado',
};

const ESTADO_COR: Record<string, string> = {
  aprovado: 'bg-green-surface text-[#047857]',
  pendente: 'bg-amber-surface text-[#B45309]',
  estornado: 'bg-indigo-surface text-[#5B21B6]',
  recusado: 'bg-coral-surface text-coral',
  expirado: 'bg-line-2 text-muted',
};

const METODO_ROTULO: Record<string, string> = {
  pix: 'Pix',
  cartao: 'Cartão',
  boleto: 'Boleto',
  manual: 'Manual',
};

const dataCurta = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' });

/**
 * Barra de período compartilhada pela Carteira e pelos Relatórios em espírito,
 * mas duplicada de propósito: cada tela tem a sua rota base e um texto de
 * ajuda diferente.
 */
function FiltroPeriodo({ periodo, base }: { periodo: Periodo; base: string }) {
  const atalho = (n: number, rot: string) => {
    const on = periodo.dias === n;
    return (
      <Link
        key={n}
        href={`${base}?dias=${n}`}
        className={`rounded-full px-4 py-2 text-[13px] font-semibold ${
          on ? 'bg-lente text-white shadow-card' : 'border border-line bg-surface text-ink-3 hover:text-blue'
        }`}
      >
        {rot}
      </Link>
    );
  };

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

export default function PainelCarteira({
  carteira,
  periodo,
}: {
  carteira: Carteira;
  periodo: Periodo;
}) {
  const kpis: { rotulo: string; valor: number; quantidade: number; nota: string; cor: string }[] = [
    {
      rotulo: 'Recebido',
      valor: carteira.recebido,
      quantidade: carteira.quantidade.recebido,
      nota: 'pagamentos aprovados',
      cor: 'text-[#047857]',
    },
    {
      rotulo: 'A receber',
      valor: carteira.aReceber,
      quantidade: carteira.quantidade.aReceber,
      nota: 'cobranças ainda pendentes',
      cor: 'text-[#B45309]',
    },
    {
      rotulo: 'Estornado',
      valor: carteira.estornado,
      quantidade: carteira.quantidade.estornado,
      nota: 'devolvido ao cliente',
      cor: 'text-[#5B21B6]',
    },
    {
      rotulo: 'Não concretizado',
      valor: carteira.naoConcretizado,
      quantidade: carteira.quantidade.naoConcretizado,
      nota: 'recusado ou expirado',
      cor: 'text-coral',
    },
  ];

  const pico = Math.max(1, ...carteira.porDia.map((d) => d.valor));

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="m-0 text-[12.5px] font-semibold uppercase tracking-[1.2px] text-muted-2">
          Financeiro · Carteira
        </p>
        <h1 className="m-0 mt-1.5 text-[26px] font-extrabold tracking-[-.9px]">Carteira</h1>
        <p className="m-0 mt-1.5 text-[13.5px] text-muted">
          O que a loja recebeu de verdade. Pagamento aprovado conta pela data em que foi pago;
          cobrança em aberto, pela data em que foi criada.
        </p>
      </div>

      <FiltroPeriodo periodo={periodo} base="/carteira" />

      {!carteira.temAlgumPagamento ? (
        <section className={`${CARD} p-8 text-center`}>
          <p className="m-0 text-[15px] font-bold">Nenhum pagamento registrado ainda</p>
          <p className="m-0 mx-auto mt-2 max-w-[520px] text-[13px] leading-[1.6] text-muted">
            A carteira se enche sozinha quando os pedidos começam a ser pagos. Para isso, conecte um
            gateway em Integrações e escolha quais métodos a loja aceita.
          </p>
          <Link
            href="/integracoes"
            className="mt-4 inline-flex h-11 items-center rounded-[14px] bg-lente px-5 text-[13.5px] font-bold text-white shadow-card hover:brightness-[1.06]"
          >
            Conectar gateway
          </Link>
        </section>
      ) : (
        <>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(210px,1fr))]">
            {kpis.map((k) => (
              <div key={k.rotulo} className={`${CARD} px-5 py-4`}>
                <p className="m-0 text-[12.5px] text-muted-2">{k.rotulo}</p>
                <p className={`m-0 mt-1 text-[25px] font-extrabold tracking-[-1px] ${k.cor}`}>
                  {reais(k.valor)}
                </p>
                <p className="m-0 mt-1 text-[11.5px] text-muted">
                  {k.quantidade.toLocaleString('pt-BR')} {k.nota}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
            <section className={`${CARD} p-6`}>
              <p className="m-0 mb-4 text-[15px] font-bold">Recebido por dia</p>
              {carteira.porDia.length === 0 ? (
                <p className="m-0 text-[13px] text-muted">
                  Nenhum pagamento aprovado neste período.
                </p>
              ) : (
                <div className="flex h-[180px] items-end gap-1.5">
                  {carteira.porDia.map((d) => (
                    <div
                      key={d.dia}
                      title={`${dataCurta(`${d.dia}T12:00:00Z`)} · ${reais(d.valor)}`}
                      className="flex-1 rounded-t-[6px] bg-lente"
                      style={{ height: `${Math.max(3, (d.valor / pico) * 100)}%` }}
                    />
                  ))}
                </div>
              )}
            </section>

            <section className={`${CARD} p-6`}>
              <p className="m-0 mb-4 text-[15px] font-bold">Por método</p>
              {carteira.porMetodo.length === 0 ? (
                <p className="m-0 text-[13px] text-muted">Sem recebimento no período.</p>
              ) : (
                <dl className="m-0 flex flex-col gap-3">
                  {carteira.porMetodo.map((m) => (
                    <div key={m.metodo}>
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-[13px] text-ink-3">
                          {METODO_ROTULO[m.metodo] ?? m.metodo}
                          <span className="ml-2 text-[11.5px] text-muted-2">
                            {m.quantidade.toLocaleString('pt-BR')}×
                          </span>
                        </dt>
                        <dd className="m-0 text-[13.5px] font-semibold">{reais(m.valor)}</dd>
                      </div>
                      <div className="mt-1.5 h-2 rounded-full bg-[#EEF1F7]">
                        <div
                          className="h-full rounded-full bg-lente"
                          style={{
                            width: `${carteira.recebido ? (m.valor / carteira.recebido) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </dl>
              )}
            </section>
          </div>

          <section className={`${CARD} overflow-hidden`}>
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
              <p className="m-0 text-[15px] font-bold">Extrato de pagamentos</p>
              <span className="text-[12px] text-muted-2">
                {carteira.extrato.length.toLocaleString('pt-BR')} lançamentos
                {carteira.truncado ? ' (recorte limitado — estreite o período)' : ''}
              </span>
            </div>

            {carteira.extrato.length === 0 ? (
              <p className="m-0 px-6 py-8 text-center text-[13px] text-muted">
                Nenhum lançamento neste período. Amplie o intervalo acima.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-surface-2 text-[11.5px] uppercase tracking-[.6px] text-muted-2">
                      <th className="px-6 py-3 font-semibold">Data</th>
                      <th className="px-3 py-3 font-semibold">Pedido</th>
                      <th className="px-3 py-3 font-semibold">Cliente</th>
                      <th className="px-3 py-3 font-semibold">Método</th>
                      <th className="px-3 py-3 font-semibold">Gateway</th>
                      <th className="px-3 py-3 font-semibold">Estado</th>
                      <th className="px-6 py-3 text-right font-semibold">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carteira.extrato.map((l) => (
                      <tr key={l.id} className="border-t border-line-2">
                        <td className="whitespace-nowrap px-6 py-3 text-[13px] text-ink-3">
                          {dataCurta(l.data)}
                        </td>
                        <td className="px-3 py-3 text-[13px] font-semibold">
                          {l.pedidoNumero ? `#${l.pedidoNumero}` : '—'}
                        </td>
                        <td className="px-3 py-3 text-[13px] text-ink-3">{l.cliente ?? '—'}</td>
                        <td className="px-3 py-3 text-[13px] text-ink-3">
                          {METODO_ROTULO[l.metodo] ?? l.metodo}
                        </td>
                        <td className="px-3 py-3 text-[12.5px] text-muted">
                          {l.provedor ?? '—'}
                          {l.idExterno && (
                            <span className="ml-1.5 text-[11px] text-muted-2">{l.idExterno}</span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11.5px] font-bold ${
                              ESTADO_COR[l.estado] ?? 'bg-line-2 text-muted'
                            }`}
                          >
                            {ESTADO_ROTULO[l.estado] ?? l.estado}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-3 text-right text-[13.5px] font-semibold">
                          {reais(l.valor)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
