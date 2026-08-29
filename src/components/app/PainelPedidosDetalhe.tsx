import Link from 'next/link';
import {
  ESTADOS_EXPEDICAO,
  ESTADOS_PAGAMENTO,
  ESTADOS_PEDIDO,
  ETAPAS_PRODUCAO,
  METODOS_PAGAMENTO,
  PROXIMO_ESTADO,
  dataCurta,
  dataHora,
  moeda,
  termo,
  type PedidoDetalhado,
} from '@/lib/pedidos';
import {
  abrirExpedicao,
  avancarEstadoPedido,
  cancelarPedido,
  colocarNaFila,
  definirEstadoExpedicao,
  marcarPedidoVisto,
  moverEtapaProducao,
  salvarRastreio,
} from '@/app/app/actions-pedidos';
import {
  BOTAO,
  BOTAO_PEQUENO,
  BOTAO_PRIMARIO,
  CAMPO,
  CARD,
  Cabecalho,
  NomeDoCliente,
  ROTULO,
  Selo,
} from '@/components/app/PainelPedidosComuns';

const SECAO = 'm-0 mb-4 text-[15px] font-bold';

export default function PainelPedidosDetalhe({
  dados,
}: {
  dados: PedidoDetalhado;
}) {
  const { pedido, itens, producao, expedicao, pagamentos } = dados;
  const proximo = PROXIMO_ESTADO[pedido.estado];
  const ficha = producao[0] ?? null;
  const envio = expedicao[0] ?? null;
  const aprovado = pagamentos
    .filter((p) => p.estado === 'aprovado')
    .reduce((t, p) => t + Number(p.valor || 0), 0);

  return (
    <div className="flex flex-col gap-5">
      <Cabecalho
        trilha="Operação · Pedidos"
        titulo={`Pedido #${pedido.numero}`}
        descricao={`Aberto em ${dataHora(pedido.criado_em)} · canal ${pedido.canal}`}
        acao={
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/pedidos" className={BOTAO}>
              Voltar
            </Link>
            {!pedido.visto_em && (
              <form action={marcarPedidoVisto}>
                <input type="hidden" name="pedido_id" value={pedido.id} />
                <button type="submit" className={BOTAO}>
                  Marcar visto
                </button>
              </form>
            )}
            {proximo && (
              <form action={avancarEstadoPedido}>
                <input type="hidden" name="pedido_id" value={pedido.id} />
                <input type="hidden" name="estado" value={proximo} />
                <button type="submit" className={BOTAO_PRIMARIO}>
                  Avançar para {termo(ESTADOS_PEDIDO, proximo).rotulo.toLowerCase()}
                </button>
              </form>
            )}
          </div>
        }
      />

      {/* ---------------- resumo ---------------- */}
      <div className={`${CARD} flex flex-wrap items-center gap-6 px-6 py-5`}>
        <span className="flex flex-col gap-1.5">
          <span className={ROTULO}>Estado</span>
          <Selo lista={ESTADOS_PEDIDO} id={pedido.estado} />
        </span>
        <span className="flex flex-col gap-1">
          <span className={ROTULO}>Cliente</span>
          <NomeDoCliente cliente={pedido.clientes} />
        </span>
        <span className="flex flex-col gap-1">
          <span className={ROTULO}>Vendedor</span>
          <span className="text-[13.5px]">
            {pedido.vendedores?.nome ?? <span className="text-muted-2">Sem vendedor</span>}
          </span>
        </span>
        <span className="flex flex-col gap-1">
          <span className={ROTULO}>Prazo</span>
          <span className="text-[13.5px]">
            {pedido.prazo_em ? dataCurta(pedido.prazo_em) : <span className="text-muted-2">Não definido</span>}
          </span>
        </span>
        <span className="ml-auto text-right">
          <span className={ROTULO}>Total</span>
          <span className="block text-[26px] font-extrabold tracking-[-1px]">{moeda(pedido.total)}</span>
        </span>
      </div>

      {pedido.estado === 'cancelado' && (
        <p className="m-0 rounded-[14px] bg-coral-surface px-4 py-3 text-[13px] font-semibold text-coral">
          Cancelado: {pedido.motivo_cancelamento ?? 'sem motivo registrado'}
        </p>
      )}

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* ---------------- itens e totais ---------------- */}
        <section className={`${CARD} p-6`}>
          <p className={SECAO}>Itens</p>
          {itens.length === 0 ? (
            <p className="m-0 text-[13.5px] text-muted">
              Este pedido não tem item gravado. Nada é somado por conta própria.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {itens.map((i) => (
                <div
                  key={i.id}
                  className="flex flex-wrap items-center gap-3 border-b border-line-2 pb-2 last:border-0"
                >
                  <span className="min-w-[200px] flex-1">
                    <span className="block text-[13.5px] font-semibold">{i.descricao}</span>
                    <span className="block text-[11.5px] text-muted-2">
                      {i.paginas > 0 ? `${i.paginas} páginas` : 'sem páginas'} ·{' '}
                      {i.fotos > 0 ? `${i.fotos} fotos` : 'sem fotos'}
                      {i.projeto_id ? ' · álbum vinculado' : ''}
                    </span>
                  </span>
                  <span className="text-[12.5px] text-muted">
                    {i.quantidade} × {moeda(i.preco_unit)}
                  </span>
                  <span className="min-w-[100px] text-right text-[13.5px] font-bold">{moeda(i.total)}</span>
                </div>
              ))}
            </div>
          )}

          <dl className="mt-5 flex flex-col gap-1.5 text-[13.5px]">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd className="m-0 font-semibold">{moeda(pedido.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Desconto</dt>
              <dd className="m-0 font-semibold">− {moeda(pedido.desconto)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Frete</dt>
              <dd className="m-0 font-semibold">{moeda(pedido.frete)}</dd>
            </div>
            <div className="flex justify-between border-t border-line-2 pt-2 text-[15px]">
              <dt className="font-bold">Total</dt>
              <dd className="m-0 font-extrabold">{moeda(pedido.total)}</dd>
            </div>
          </dl>

          {pedido.observacao && (
            <p className="m-0 mt-4 rounded-[14px] bg-surface-2 px-4 py-3 text-[13px] text-ink-3">
              {pedido.observacao}
            </p>
          )}
        </section>

        <div className="flex flex-col gap-5">
          {/* ---------------- pagamento ---------------- */}
          <section className={`${CARD} p-6`}>
            <p className={SECAO}>Pagamento</p>
            {pagamentos.length === 0 ? (
              <p className="m-0 text-[13.5px] text-muted">
                Nenhuma cobrança registrada para este pedido.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {pagamentos.map((p) => (
                  <div key={p.id} className="flex flex-wrap items-center gap-2.5">
                    <Selo lista={ESTADOS_PAGAMENTO} id={p.estado} />
                    <Selo lista={METODOS_PAGAMENTO} id={p.metodo} />
                    <span className="ml-auto text-[13.5px] font-bold">{moeda(p.valor)}</span>
                    <span className="w-full text-[11.5px] text-muted-2">
                      {p.provedor ? `${p.provedor} · ` : ''}
                      {p.pago_em ? `pago em ${dataHora(p.pago_em)}` : `criado em ${dataHora(p.criado_em)}`}
                      {p.id_externo ? ` · ${p.id_externo}` : ''}
                    </span>
                  </div>
                ))}
                <p className="m-0 border-t border-line-2 pt-2 text-[13px]">
                  Aprovado: <span className="font-extrabold">{moeda(aprovado)}</span>
                  {aprovado < Number(pedido.total) && (
                    <span className="text-muted"> · falta {moeda(Number(pedido.total) - aprovado)}</span>
                  )}
                </p>
              </div>
            )}
          </section>

          {/* ---------------- produção ---------------- */}
          <section className={`${CARD} p-6`}>
            <p className={SECAO}>Produção</p>
            {!ficha ? (
              <div className="flex flex-col gap-3">
                <p className="m-0 text-[13.5px] text-muted">Este pedido ainda não entrou na produção.</p>
                <form action={colocarNaFila}>
                  <input type="hidden" name="pedido_id" value={pedido.id} />
                  <button type="submit" className={BOTAO}>
                    Colocar na fila
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <span className="flex items-center gap-2.5">
                  <Selo lista={ETAPAS_PRODUCAO} id={ficha.etapa} />
                  <span className="text-[11.5px] text-muted-2">
                    atualizado {dataHora(ficha.atualizado_em)}
                  </span>
                </span>
                {ficha.responsavel && (
                  <p className="m-0 text-[12.5px] text-muted">Responsável: {ficha.responsavel}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {ETAPAS_PRODUCAO.filter((e) => e.id !== ficha.etapa).map((e) => (
                    <form action={moverEtapaProducao} key={e.id}>
                      <input type="hidden" name="producao_id" value={ficha.id} />
                      <input type="hidden" name="etapa" value={e.id} />
                      <button type="submit" className={BOTAO_PEQUENO}>
                        {e.rotulo}
                      </button>
                    </form>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* ---------------- expedição ---------------- */}
          <section className={`${CARD} p-6`}>
            <p className={SECAO}>Expedição</p>
            {!envio ? (
              <div className="flex flex-col gap-3">
                <p className="m-0 text-[13.5px] text-muted">Nenhum envio aberto para este pedido.</p>
                <form action={abrirExpedicao}>
                  <input type="hidden" name="pedido_id" value={pedido.id} />
                  <button type="submit" className={BOTAO}>
                    Abrir envio
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <span className="flex items-center gap-2.5">
                  <Selo lista={ESTADOS_EXPEDICAO} id={envio.estado} />
                  <span className="text-[11.5px] text-muted-2">
                    {envio.postado_em ? `postado ${dataHora(envio.postado_em)}` : 'ainda não postado'}
                    {envio.entregue_em ? ` · entregue ${dataHora(envio.entregue_em)}` : ''}
                  </span>
                </span>

                <form action={salvarRastreio} className="flex flex-col gap-2">
                  <input type="hidden" name="expedicao_id" value={envio.id} />
                  <label className="flex flex-col gap-1.5">
                    <span className={ROTULO}>Transportadora</span>
                    <input name="transportadora" defaultValue={envio.transportadora ?? ''} className={CAMPO} />
                  </label>
                  <label className="flex flex-col gap-1.5">
                    <span className={ROTULO}>Rastreio</span>
                    <input name="rastreio" defaultValue={envio.rastreio ?? ''} className={CAMPO} />
                  </label>
                  <button type="submit" className={BOTAO}>
                    Salvar rastreio
                  </button>
                </form>

                <div className="flex flex-wrap gap-2">
                  {ESTADOS_EXPEDICAO.filter((e) => e.id !== envio.estado).map((e) => (
                    <form action={definirEstadoExpedicao} key={e.id}>
                      <input type="hidden" name="expedicao_id" value={envio.id} />
                      <input type="hidden" name="estado" value={e.id} />
                      <button type="submit" className={BOTAO_PEQUENO}>
                        {e.rotulo}
                      </button>
                    </form>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* ---------------- cancelamento ---------------- */}
      {pedido.estado !== 'cancelado' && (
        <details className={`${CARD} p-6`}>
          <summary className="cursor-pointer text-[15px] font-bold">Cancelar pedido</summary>
          <form action={cancelarPedido} className="mt-4 flex flex-wrap items-end gap-3">
            <input type="hidden" name="pedido_id" value={pedido.id} />
            <label className="flex min-w-[280px] flex-1 flex-col gap-1.5">
              <span className={ROTULO}>Motivo</span>
              <input
                name="motivo"
                required
                placeholder="Por que o pedido foi cancelado"
                className={CAMPO}
              />
            </label>
            <button
              type="submit"
              className="flex h-11 items-center rounded-[14px] border border-line px-4 text-[13.5px] font-semibold text-ink-3 hover:bg-coral-surface hover:text-coral"
            >
              Cancelar pedido
            </button>
          </form>
        </details>
      )}
    </div>
  );
}
