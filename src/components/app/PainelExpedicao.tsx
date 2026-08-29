import Link from 'next/link';
import {
  ESTADOS_EXPEDICAO,
  dataCurta,
  dataHora,
  moeda,
  type EnvioDaLista,
  type PedidoDaLinha,
} from '@/lib/pedidos';
import { abrirExpedicao, definirEstadoExpedicao } from '@/app/app/actions-pedidos';
import {
  BOTAO_PEQUENO,
  CAMPO,
  CARD,
  Cabecalho,
  NomeDoCliente,
  ROTULO,
  Selo,
  Vazio,
} from '@/components/app/PainelPedidosComuns';

export default function PainelExpedicao({
  envios,
  porEstado,
  semEnvio,
  estado,
}: {
  envios: EnvioDaLista[];
  porEstado: Record<string, number>;
  semEnvio: PedidoDaLinha[];
  estado: string;
}) {
  const totalGeral = Object.values(porEstado).reduce((t, n) => t + n, 0);

  const aba = (id: string, rotulo: string, quantidade: number) => (
    <Link
      key={id || 'todos'}
      href={id ? `/expedicao?estado=${id}` : '/expedicao'}
      className={`rounded-full px-4 py-2 text-[13px] font-semibold ${
        estado === id ? 'bg-blue-soft text-blue' : 'text-ink-3 hover:bg-page hover:text-blue'
      }`}
    >
      {rotulo} <span className="text-muted-2">{quantidade}</span>
    </Link>
  );

  return (
    <div className="flex flex-col gap-5">
      <Cabecalho
        trilha="Operação · Expedição"
        titulo="Expedição"
        descricao="Envios da loja: transportadora, rastreio e o que já chegou."
      />

      <nav className={`${CARD} flex flex-wrap gap-1 px-3 py-2.5`}>
        {aba('', 'Todos', totalGeral)}
        {ESTADOS_EXPEDICAO.map((e) => aba(e.id, e.rotulo, porEstado[e.id] ?? 0))}
      </nav>

      {/* Pedido pronto sem envio aberto: a caixa está na bancada e ninguém sabe. */}
      {semEnvio.length > 0 && (
        <section className={`${CARD} p-6`}>
          <p className="m-0 mb-1 text-[15px] font-bold">Prontos sem envio aberto</p>
          <p className="m-0 mb-4 text-[12.5px] text-muted">
            {semEnvio.length} pedido(s) pronto(s) que ainda não têm ficha de expedição.
          </p>
          <div className="flex flex-col gap-2">
            {semEnvio.map((p) => (
              <div key={p.id} className="flex flex-wrap items-center gap-3 border-b border-line-2 pb-2 last:border-0">
                <Link href={`/pedidos/${p.id}`} className="text-[13.5px] font-extrabold text-ink">
                  #{p.numero}
                </Link>
                <span className="min-w-[160px] flex-1">
                  <NomeDoCliente cliente={p.clientes} />
                </span>
                <form action={abrirExpedicao}>
                  <input type="hidden" name="pedido_id" value={p.id} />
                  <button type="submit" className={BOTAO_PEQUENO}>
                    Abrir envio
                  </button>
                </form>
              </div>
            ))}
          </div>
        </section>
      )}

      {envios.length === 0 ? (
        <Vazio
          titulo={estado ? 'Nenhum envio nesse estado' : 'Nenhum envio ainda'}
          texto={
            estado
              ? 'Escolha outra aba para ver os demais envios.'
              : 'O envio nasce quando o pedido fica pronto. Nada aqui é preenchido de exemplo.'
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {envios.map((e) => (
            <div key={e.id} className={`${CARD} flex flex-wrap items-center gap-4 px-6 py-4`}>
              <Link href={`/pedidos/${e.pedidos.id}`} className="min-w-[80px] text-[15px] font-extrabold text-ink">
                #{e.pedidos.numero}
              </Link>

              <span className="min-w-[170px] flex-1">
                <NomeDoCliente cliente={e.pedidos.clientes} />
              </span>

              <Selo lista={ESTADOS_EXPEDICAO} id={e.estado} />

              <span className="min-w-[170px] text-[12.5px]">
                <span className="block font-semibold">
                  {e.transportadora ?? <span className="text-muted-2">Sem transportadora</span>}
                </span>
                <span className="block text-muted-2">
                  {e.rastreio ?? 'sem rastreio'}
                  {e.postado_em ? ` · postado ${dataCurta(e.postado_em)}` : ''}
                  {e.entregue_em ? ` · entregue ${dataCurta(e.entregue_em)}` : ''}
                </span>
              </span>

              <span className="min-w-[100px] text-right text-[13.5px] font-bold">{moeda(e.pedidos.total)}</span>

              {/* Postar pede transportadora e rastreio no mesmo gesto. */}
              {e.estado === 'aguardando' ? (
                <form action={definirEstadoExpedicao} className="flex flex-wrap items-end gap-2">
                  <input type="hidden" name="expedicao_id" value={e.id} />
                  <input type="hidden" name="estado" value="postado" />
                  <label className="flex flex-col gap-1">
                    <span className={ROTULO}>Transportadora</span>
                    <input
                      name="transportadora"
                      defaultValue={e.transportadora ?? ''}
                      className={`${CAMPO} h-9 w-[150px] text-[13px]`}
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className={ROTULO}>Rastreio</span>
                    <input
                      name="rastreio"
                      defaultValue={e.rastreio ?? ''}
                      className={`${CAMPO} h-9 w-[160px] text-[13px]`}
                    />
                  </label>
                  <button
                    type="submit"
                    className="flex h-9 items-center rounded-[12px] bg-lente px-3.5 text-[12.5px] font-bold text-white hover:brightness-[1.06]"
                  >
                    Postar
                  </button>
                </form>
              ) : (
                <span className="flex flex-wrap gap-2">
                  {ESTADOS_EXPEDICAO.filter((s) => s.id !== e.estado && s.id !== 'aguardando').map((s) => (
                    <form action={definirEstadoExpedicao} key={s.id}>
                      <input type="hidden" name="expedicao_id" value={e.id} />
                      <input type="hidden" name="estado" value={s.id} />
                      <button type="submit" className={BOTAO_PEQUENO}>
                        {s.rotulo}
                      </button>
                    </form>
                  ))}
                </span>
              )}

              <span className="w-full text-[11px] text-muted-2">
                Atualizado {dataHora(e.atualizado_em)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
