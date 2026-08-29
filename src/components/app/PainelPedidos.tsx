import Link from 'next/link';
import {
  ESTADOS_PEDIDO,
  PEDIDOS_POR_PAGINA,
  dataCurta,
  dataHora,
  moeda,
  type FiltrosPedidos,
  type PedidoResumo,
} from '@/lib/pedidos';
import { marcarPedidoVisto, marcarTodosVistos } from '@/app/app/actions-pedidos';
import {
  BOTAO,
  BOTAO_PEQUENO,
  CAMPO,
  CARD,
  Cabecalho,
  NomeDoCliente,
  ROTULO,
  Selo,
  Vazio,
} from '@/components/app/PainelPedidosComuns';

/** Monta a query string preservando os filtros em vigor. */
function comFiltros(f: Required<FiltrosPedidos>, muda: Partial<Record<string, string | number>>) {
  const p = new URLSearchParams();
  const campos: Record<string, string | number> = {
    estado: f.estado,
    de: f.de,
    ate: f.ate,
    q: f.busca,
    p: f.pagina,
    ...muda,
  };
  for (const [k, v] of Object.entries(campos)) if (v !== '' && v !== 0) p.set(k, String(v));
  const s = p.toString();
  return s ? `/pedidos?${s}` : '/pedidos';
}

export default function PainelPedidos({
  pedidos,
  total,
  naoVistos,
  filtros,
}: {
  pedidos: PedidoResumo[];
  total: number;
  naoVistos: number;
  filtros: Required<FiltrosPedidos>;
}) {
  const temFiltro = Boolean(filtros.estado || filtros.de || filtros.ate || filtros.busca);
  const ultimaPagina = Math.max(0, Math.ceil(total / PEDIDOS_POR_PAGINA) - 1);

  return (
    <div className="flex flex-col gap-5">
      <Cabecalho
        trilha="Operação · Pedidos"
        titulo="Pedidos"
        descricao="Tudo o que a loja vendeu, do rascunho à entrega."
        acao={
          naoVistos > 0 ? (
            <form action={marcarTodosVistos}>
              <button type="submit" className={BOTAO}>
                Marcar {naoVistos} como vistos
              </button>
            </form>
          ) : undefined
        }
      />

      {/* ---------------- filtros ---------------- */}
      <form method="get" className={`${CARD} flex flex-wrap items-end gap-3 px-5 py-4`}>
        <label className="flex min-w-[240px] flex-1 flex-col gap-1.5">
          <span className={ROTULO}>Buscar</span>
          <input
            name="q"
            defaultValue={filtros.busca}
            placeholder="Número do pedido (1042) ou nome do cliente"
            className={CAMPO}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={ROTULO}>Estado</span>
          <select name="estado" defaultValue={filtros.estado} className={`${CAMPO} min-w-[190px]`}>
            <option value="">Todos</option>
            {ESTADOS_PEDIDO.map((e) => (
              <option key={e.id} value={e.id}>
                {e.rotulo}
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
          <Link href="/pedidos" className="pb-3 text-[12.5px] font-semibold text-muted hover:text-blue">
            Limpar
          </Link>
        )}
      </form>

      {/* ---------------- lista ---------------- */}
      {pedidos.length === 0 ? (
        <Vazio
          titulo={temFiltro ? 'Nenhum pedido com esses filtros' : 'Nenhum pedido ainda'}
          texto={
            temFiltro
              ? 'Tente um período maior ou limpe os filtros.'
              : 'Os pedidos aparecem aqui assim que um cliente fechar uma compra na sua loja. Nada é preenchido de exemplo.'
          }
        />
      ) : (
        <div className="flex flex-col gap-3">
          {pedidos.map((p) => (
            <div
              key={p.id}
              className={`${CARD} flex flex-wrap items-center gap-4 px-6 py-4 ${
                p.visto_em ? '' : 'border-[#D6E2FC] bg-blue-soft'
              }`}
            >
              <Link href={`/pedidos/${p.id}`} className="min-w-[92px] text-[15px] font-extrabold text-ink">
                #{p.numero}
              </Link>

              {!p.visto_em && (
                <span className="rounded-full bg-blue px-2.5 py-1 text-[11px] font-bold text-white">Novo</span>
              )}

              <span className="min-w-[190px] flex-1">
                <NomeDoCliente cliente={p.clientes} />
              </span>

              <Selo lista={ESTADOS_PEDIDO} id={p.estado} />

              <span className="min-w-[150px] text-[12.5px] text-muted">
                <span className="block">Entrou {dataHora(p.criado_em)}</span>
                <span className="block text-muted-2">
                  {p.prazo_em ? `Prazo ${dataCurta(p.prazo_em)}` : 'Sem prazo definido'}
                </span>
              </span>

              <span className="min-w-[110px] text-right text-[15px] font-extrabold">{moeda(p.total)}</span>

              <span className="flex gap-2">
                {!p.visto_em && (
                  <form action={marcarPedidoVisto}>
                    <input type="hidden" name="pedido_id" value={p.id} />
                    <button type="submit" className={BOTAO_PEQUENO}>
                      Marcar visto
                    </button>
                  </form>
                )}
                <Link href={`/pedidos/${p.id}`} className={BOTAO_PEQUENO}>
                  Abrir
                </Link>
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ---------------- paginação ---------------- */}
      {total > PEDIDOS_POR_PAGINA && (
        <div className="flex items-center justify-center gap-3">
          <Link
            href={comFiltros(filtros, { p: filtros.pagina - 1 })}
            aria-disabled={filtros.pagina === 0}
            className={`${BOTAO} ${filtros.pagina === 0 ? 'pointer-events-none opacity-40' : ''}`}
          >
            Anterior
          </Link>
          <span className="text-[12.5px] text-muted">
            Página {filtros.pagina + 1} de {ultimaPagina + 1} · {total} pedidos
          </span>
          <Link
            href={comFiltros(filtros, { p: filtros.pagina + 1 })}
            aria-disabled={filtros.pagina >= ultimaPagina}
            className={`${BOTAO} ${filtros.pagina >= ultimaPagina ? 'pointer-events-none opacity-40' : ''}`}
          >
            Próxima
          </Link>
        </div>
      )}
    </div>
  );
}
