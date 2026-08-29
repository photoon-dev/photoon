import Link from 'next/link';
import {
  ETAPAS_PRODUCAO,
  PROXIMA_ETAPA,
  dataCurta,
  dataHora,
  type EtapaProducao,
  type ItemDaFila,
  type PedidoDaLinha,
} from '@/lib/pedidos';
import { colocarNaFila, moverEtapaProducao } from '@/app/app/actions-pedidos';
import {
  BOTAO_PEQUENO,
  CARD,
  Cabecalho,
  NomeDoCliente,
  Selo,
  Vazio,
} from '@/components/app/PainelPedidosComuns';

/**
 * Fila de produção em cinco colunas — uma por etapa.
 *
 * Não há arrastar-e-soltar: cada cartão traz os botões das outras etapas, o
 * que funciona sem JavaScript e, no laboratório, com a mão suja de tinta.
 */
export default function PainelProducao({
  fila,
  foraDaFila,
}: {
  fila: Record<EtapaProducao, ItemDaFila[]>;
  foraDaFila: PedidoDaLinha[];
}) {
  const totalNaFila = ETAPAS_PRODUCAO.reduce((t, e) => t + (fila[e.id]?.length ?? 0), 0);

  return (
    <div className="flex flex-col gap-5">
      <Cabecalho
        trilha="Operação · Produção"
        titulo="Produção"
        descricao="Onde está cada pedido dentro do laboratório."
      />

      {/* Pedidos pagos que ninguém colocou na fila: é o furo mais comum. */}
      {foraDaFila.length > 0 && (
        <section className={`${CARD} p-6`}>
          <p className="m-0 mb-1 text-[15px] font-bold">Esperando entrar na fila</p>
          <p className="m-0 mb-4 text-[12.5px] text-muted">
            {foraDaFila.length} pedido(s) pago(s) sem ficha de produção aberta.
          </p>
          <div className="flex flex-col gap-2">
            {foraDaFila.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center gap-3 border-b border-line-2 pb-2 last:border-0">
                <Link href={`/pedidos/${p.id}`} className="text-[13.5px] font-extrabold text-ink">
                  #{p.numero}
                </Link>
                <span className="min-w-[160px] flex-1">
                  <NomeDoCliente cliente={p.clientes} />
                </span>
                <span className="text-[11.5px] text-muted-2">
                  {p.prazo_em ? `Prazo ${dataCurta(p.prazo_em)}` : 'Sem prazo'}
                </span>
                <form action={colocarNaFila}>
                  <input type="hidden" name="pedido_id" value={p.id} />
                  <button type="submit" className={BOTAO_PEQUENO}>
                    Colocar na fila
                  </button>
                </form>
              </div>
            ))}
          </div>
        </section>
      )}

      {totalNaFila === 0 ? (
        <Vazio
          titulo="Nada em produção"
          texto="Assim que um pedido for pago e entrar na fila, ele aparece aqui. Nenhum item é criado de exemplo."
        />
      ) : (
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(240px,1fr))]">
          {ETAPAS_PRODUCAO.map((etapa) => {
            const cartoes = fila[etapa.id] ?? [];
            const seguinte = PROXIMA_ETAPA[etapa.id];
            return (
              <section key={etapa.id} className={`${CARD} flex flex-col gap-3 p-4`}>
                <div className="flex items-center justify-between">
                  <Selo lista={ETAPAS_PRODUCAO} id={etapa.id} />
                  <span className="text-[12.5px] font-bold text-muted">{cartoes.length}</span>
                </div>

                {cartoes.length === 0 ? (
                  <p className="m-0 py-6 text-center text-[12.5px] text-muted-2">Vazia</p>
                ) : (
                  cartoes.map((c) => (
                    <article key={c.id} className="rounded-[14px] border border-line bg-surface-2 p-3">
                      <Link href={`/pedidos/${c.pedidos.id}`} className="text-[13.5px] font-extrabold text-ink">
                        #{c.pedidos.numero}
                      </Link>
                      <div className="mt-1">
                        <NomeDoCliente cliente={c.pedidos.clientes} />
                      </div>
                      <p className="m-0 mt-1.5 text-[11.5px] text-muted-2">
                        {c.pedidos.prazo_em ? `Prazo ${dataCurta(c.pedidos.prazo_em)}` : 'Sem prazo'} · desde{' '}
                        {dataHora(c.atualizado_em)}
                      </p>
                      {c.responsavel && (
                        <p className="m-0 mt-1 text-[11.5px] text-muted">Com {c.responsavel}</p>
                      )}

                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {seguinte && (
                          <form action={moverEtapaProducao}>
                            <input type="hidden" name="producao_id" value={c.id} />
                            <input type="hidden" name="etapa" value={seguinte} />
                            <button
                              type="submit"
                              className="flex h-8 items-center rounded-[10px] bg-lente px-3 text-[12px] font-bold text-white hover:brightness-[1.06]"
                            >
                              → {ETAPAS_PRODUCAO.find((e) => e.id === seguinte)?.rotulo}
                            </button>
                          </form>
                        )}
                        {ETAPAS_PRODUCAO.filter((e) => e.id !== etapa.id && e.id !== seguinte).map((e) => (
                          <form action={moverEtapaProducao} key={e.id}>
                            <input type="hidden" name="producao_id" value={c.id} />
                            <input type="hidden" name="etapa" value={e.id} />
                            <button
                              type="submit"
                              className="flex h-8 items-center rounded-[10px] border border-line bg-surface px-2.5 text-[12px] font-semibold text-ink-3 hover:border-[#D6E2FC] hover:text-blue"
                            >
                              {e.rotulo}
                            </button>
                          </form>
                        ))}
                      </div>
                    </article>
                  ))
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
