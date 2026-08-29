import Link from 'next/link';
import {
  ESTADOS_PAGAMENTO,
  METODOS_PAGAMENTO,
  dataHora,
  moeda,
  type ResumoPagamentos,
} from '@/lib/pedidos';
import {
  BOTAO,
  CAMPO,
  CARD,
  Cabecalho,
  NomeDoCliente,
  ROTULO,
  Selo,
  Vazio,
} from '@/components/app/PainelPedidosComuns';

export default function PainelPagamentos({
  dados,
  filtros,
}: {
  dados: ResumoPagamentos;
  filtros: { estado: string; metodo: string; de: string; ate: string };
}) {
  const { pagamentos, porEstado, porMetodo, recebido } = dados;
  const temFiltro = Boolean(filtros.estado || filtros.metodo || filtros.de || filtros.ate);
  const temMovimento = Object.keys(porEstado).length > 0;

  return (
    <div className="flex flex-col gap-5">
      <Cabecalho
        trilha="Financeiro · Pagamentos"
        titulo="Pagamentos"
        descricao="Cobranças da loja por estado e por método, com o que já entrou."
      />

      {/* ---------------- totais ---------------- */}
      {temMovimento && (
        <>
          <div className={`${CARD} px-6 py-5`}>
            <p className="m-0 text-[12.5px] text-muted-2">
              Aprovado no período{filtros.de || filtros.ate ? ' filtrado' : ''}
            </p>
            <p className="m-0 mt-1 text-[29px] font-extrabold tracking-[-1px]">{moeda(recebido)}</p>
          </div>

          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(190px,1fr))]">
            {ESTADOS_PAGAMENTO.map((e) => {
              const t = porEstado[e.id];
              return (
                <div key={e.id} className={`${CARD} px-5 py-4`}>
                  <Selo lista={ESTADOS_PAGAMENTO} id={e.id} />
                  <p className="m-0 mt-2 text-[21px] font-extrabold tracking-[-.6px]">
                    {moeda(t?.valor ?? 0)}
                  </p>
                  <p className="m-0 text-[12px] text-muted-2">{t?.qtd ?? 0} cobrança(s)</p>
                </div>
              );
            })}
          </div>

          <div className={`${CARD} flex flex-wrap gap-6 px-6 py-4`}>
            {METODOS_PAGAMENTO.map((m) => {
              const t = porMetodo[m.id];
              return (
                <span key={m.id} className="flex flex-col gap-1.5">
                  <Selo lista={METODOS_PAGAMENTO} id={m.id} />
                  <span className="text-[15px] font-bold">{moeda(t?.valor ?? 0)}</span>
                  <span className="text-[11.5px] text-muted-2">{t?.qtd ?? 0} cobrança(s)</span>
                </span>
              );
            })}
          </div>
        </>
      )}

      {/* ---------------- filtros ---------------- */}
      <form method="get" className={`${CARD} flex flex-wrap items-end gap-3 px-5 py-4`}>
        <label className="flex flex-col gap-1.5">
          <span className={ROTULO}>Estado</span>
          <select name="estado" defaultValue={filtros.estado} className={`${CAMPO} min-w-[170px]`}>
            <option value="">Todos</option>
            {ESTADOS_PAGAMENTO.map((e) => (
              <option key={e.id} value={e.id}>
                {e.rotulo}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={ROTULO}>Método</span>
          <select name="metodo" defaultValue={filtros.metodo} className={`${CAMPO} min-w-[150px]`}>
            <option value="">Todos</option>
            {METODOS_PAGAMENTO.map((m) => (
              <option key={m.id} value={m.id}>
                {m.rotulo}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={ROTULO}>De</span>
          <input type="date" name="de" defaultValue={filtros.de} className={`${CAMPO} min-w-[150px]`} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={ROTULO}>Até</span>
          <input type="date" name="ate" defaultValue={filtros.ate} className={`${CAMPO} min-w-[150px]`} />
        </label>
        <button type="submit" className={BOTAO}>
          Filtrar
        </button>
        {temFiltro && (
          <Link href="/pagamentos" className="pb-3 text-[12.5px] font-semibold text-muted hover:text-blue">
            Limpar
          </Link>
        )}
      </form>

      {/* ---------------- lista ---------------- */}
      {pagamentos.length === 0 ? (
        <Vazio
          titulo={temFiltro ? 'Nenhuma cobrança com esses filtros' : 'Nenhuma cobrança ainda'}
          texto={
            temFiltro
              ? 'Tente outro estado, outro método ou um período maior.'
              : 'As cobranças aparecem aqui quando um pedido for pago pela loja. Nenhum valor é estimado.'
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {pagamentos.map((p) => (
            <div key={p.id} className={`${CARD} flex flex-wrap items-center gap-4 px-6 py-4`}>
              {p.pedidos ? (
                <Link
                  href={`/pedidos/${p.pedidos.id}`}
                  className="min-w-[80px] text-[15px] font-extrabold text-ink"
                >
                  #{p.pedidos.numero}
                </Link>
              ) : (
                <span className="min-w-[80px] text-[13px] text-muted-2">sem pedido</span>
              )}

              <span className="min-w-[170px] flex-1">
                <NomeDoCliente cliente={p.pedidos?.clientes ?? null} />
              </span>

              <Selo lista={ESTADOS_PAGAMENTO} id={p.estado} />
              <Selo lista={METODOS_PAGAMENTO} id={p.metodo} />

              <span className="min-w-[190px] text-[12px] text-muted-2">
                {p.provedor ? `${p.provedor} · ` : ''}
                {p.pago_em ? `pago ${dataHora(p.pago_em)}` : `criado ${dataHora(p.criado_em)}`}
                {p.id_externo ? ` · ${p.id_externo}` : ''}
              </span>

              <span className="min-w-[110px] text-right text-[15px] font-extrabold">{moeda(p.valor)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
