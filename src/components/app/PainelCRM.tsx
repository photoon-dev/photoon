'use client';

import { useMemo, useState } from 'react';
import type { DadosCRM, EstadoCliente } from '@/lib/comercial';
import { reais } from '@/lib/preco';

const CARD = 'rounded-[18px] border border-line bg-surface';
const CAMPO =
  'h-11 w-full rounded-[14px] border border-line bg-surface px-3.5 text-[14px] text-ink outline-none focus:border-blue';
const BOTAO =
  'flex h-9 items-center justify-center rounded-[12px] border border-line bg-surface px-3 text-[12.5px] font-semibold text-ink-3 hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue disabled:opacity-40';
const TH = 'px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-[1px] text-muted-2';
const TD = 'px-3 py-3 align-middle text-[13px]';

/** Rótulo e cor de cada estado. Cor com função: âmbar = atenção, verde = feito. */
const ESTADOS: Record<EstadoCliente, { rotulo: string; chip: string; explica: string }> = {
  sem_acesso: {
    rotulo: 'Nunca entrou',
    chip: 'bg-coral-surface text-coral',
    explica: 'Foi convidado e nunca abriu a loja.',
  },
  sem_pedido: {
    rotulo: 'Sem pedido',
    chip: 'bg-amber-surface text-[#B45309]',
    explica: 'Já entrou na loja, mas nunca fechou um pedido.',
  },
  ativo: {
    rotulo: 'Ativo',
    chip: 'bg-green-surface text-[#059669]',
    explica: 'Comprou nos últimos 180 dias.',
  },
  inativo: {
    rotulo: 'Inativo',
    chip: 'bg-blue-soft text-muted',
    explica: 'Já comprou, mas não nos últimos 180 dias.',
  },
};

const ORDEM: EstadoCliente[] = ['ativo', 'inativo', 'sem_pedido', 'sem_acesso'];

const POR_PAGINA = 25;

const data = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';

type Ordenacao = 'gasto' | 'pedidos' | 'recente' | 'nome';

export default function PainelCRM({ dados }: { dados: DadosCRM }) {
  const [busca, setBusca] = useState('');
  const [estado, setEstado] = useState<EstadoCliente | 'todos'>('todos');
  const [ordem, setOrdem] = useState<Ordenacao>('gasto');
  const [pagina, setPagina] = useState(0);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    const lista = dados.clientes.filter((c) => {
      if (estado !== 'todos' && c.estado !== estado) return false;
      if (!termo) return true;
      return (
        (c.nome ?? '').toLowerCase().includes(termo) ||
        (c.email ?? '').toLowerCase().includes(termo) ||
        (c.telefone ?? '').toLowerCase().includes(termo)
      );
    });

    return [...lista].sort((a, b) => {
      if (ordem === 'gasto') return b.totalGasto - a.totalGasto;
      if (ordem === 'pedidos') return b.pedidos - a.pedidos;
      if (ordem === 'recente')
        return (b.ultimoPedidoEm ?? b.convidado_em ?? '').localeCompare(
          a.ultimoPedidoEm ?? a.convidado_em ?? '',
        );
      return (a.nome ?? a.email ?? '').localeCompare(b.nome ?? b.email ?? '');
    });
  }, [dados.clientes, busca, estado, ordem]);

  const paginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const p = Math.min(pagina, paginas - 1);
  const visiveis = filtrados.slice(p * POR_PAGINA, (p + 1) * POR_PAGINA);

  const trocar = (fn: () => void) => {
    fn();
    setPagina(0);
  };

  const kpis = [
    { rotulo: 'Clientes', valor: dados.clientes.length.toLocaleString('pt-BR') },
    { rotulo: 'Receita', valor: reais(dados.receita) },
    { rotulo: 'Ticket médio', valor: reais(dados.ticketMedio) },
    { rotulo: 'Compraram', valor: (dados.porEstado.ativo + dados.porEstado.inativo).toLocaleString('pt-BR') },
  ];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="m-0 text-[12.5px] font-semibold uppercase tracking-[1.2px] text-muted-2">
            Vendas · CRM
          </p>
          <h1 className="m-0 mt-1.5 text-[26px] font-extrabold tracking-[-.9px]">
            Seus clientes
          </h1>
          <p className="m-0 mt-1.5 text-[13.5px] text-muted">
            O que cada cliente já gastou, quantos pedidos fez e quando foi o último.
          </p>
        </div>
        <a
          href="/clientes"
          className="flex h-11 items-center justify-center gap-2 rounded-[14px] border border-line bg-surface px-4 text-[13.5px] font-semibold text-ink hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue"
        >
          Cadastrar cliente
        </a>
      </div>

      {dados.truncado && (
        <p className="m-0 rounded-[14px] bg-amber-surface px-4 py-3 text-[13px] font-semibold text-[#B45309]">
          Sua loja passou do volume que esta tela consegue somar de uma vez. Os totais abaixo cobrem
          apenas parte dos registros — não use como fechamento contábil.
        </p>
      )}

      {dados.clientes.length === 0 ? (
        <div className={`${CARD} p-8 text-center`}>
          <p className="m-0 text-[15px] font-bold">Nenhum cliente ainda</p>
          <p className="mx-auto m-0 mt-2 max-w-[520px] text-[13.5px] text-muted">
            O CRM mede o que os seus clientes compraram. Cadastre o primeiro em Clientes, libere as
            fotos dele e as métricas começam a aparecer aqui sozinhas.
          </p>
          <a
            href="/clientes"
            className="mx-auto mt-5 flex h-11 w-fit items-center justify-center gap-2 rounded-[14px] bg-lente px-4 text-[13.5px] font-bold text-white shadow-card hover:brightness-[1.06]"
          >
            Ir para Clientes
          </a>
        </div>
      ) : (
        <>
          {/* ---------------- números ---------------- */}
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(180px,1fr))]">
            {kpis.map((k) => (
              <div key={k.rotulo} className={`${CARD} p-5`}>
                <p className="m-0 text-[12px] font-semibold uppercase tracking-[1px] text-muted-2">
                  {k.rotulo}
                </p>
                <p className="m-0 mt-1.5 text-[22px] font-extrabold tracking-[-.7px]">{k.valor}</p>
              </div>
            ))}
          </div>

          {/* ---------------- filtros ---------------- */}
          <div className="flex flex-wrap items-center gap-3">
            <input
              value={busca}
              onChange={(e) => trocar(() => setBusca(e.target.value))}
              placeholder="Buscar por nome, e-mail ou telefone"
              className={`${CAMPO} max-w-[320px]`}
            />
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => trocar(() => setEstado('todos'))}
                className={
                  estado === 'todos'
                    ? 'rounded-full bg-lente px-4 py-2 text-[12.5px] font-bold text-white shadow-card'
                    : 'rounded-full border border-line bg-surface px-4 py-2 text-[12.5px] font-semibold text-muted hover:border-[#D6E2FC] hover:text-blue'
                }
              >
                Todos
              </button>
              {ORDEM.map((e) => (
                <button
                  key={e}
                  title={ESTADOS[e].explica}
                  onClick={() => trocar(() => setEstado(e))}
                  className={
                    estado === e
                      ? 'rounded-full bg-lente px-4 py-2 text-[12.5px] font-bold text-white shadow-card'
                      : 'rounded-full border border-line bg-surface px-4 py-2 text-[12.5px] font-semibold text-muted hover:border-[#D6E2FC] hover:text-blue'
                  }
                >
                  {ESTADOS[e].rotulo} ({dados.porEstado[e]})
                </button>
              ))}
            </div>
            <select
              value={ordem}
              onChange={(e) => trocar(() => setOrdem(e.target.value as Ordenacao))}
              className={`${CAMPO} w-auto`}
            >
              <option value="gasto">Ordenar por total gasto</option>
              <option value="pedidos">Ordenar por nº de pedidos</option>
              <option value="recente">Ordenar por atividade recente</option>
              <option value="nome">Ordenar por nome</option>
            </select>
          </div>

          {/* ---------------- tabela ---------------- */}
          <section className={`${CARD} overflow-x-auto`}>
            <table className="w-full min-w-[880px] border-collapse">
              <thead>
                <tr className="border-b border-line bg-surface-2">
                  <th className={TH}>Cliente</th>
                  <th className={TH}>Estado</th>
                  <th className={`${TH} text-right`}>Pedidos</th>
                  <th className={`${TH} text-right`}>Total gasto</th>
                  <th className={`${TH} text-right`}>Ticket médio</th>
                  <th className={`${TH} text-right`}>Último pedido</th>
                  <th className={`${TH} text-right`}>Álbuns · fotos</th>
                </tr>
              </thead>
              <tbody>
                {visiveis.map((c) => (
                  <tr key={c.id} className="border-b border-line-2">
                    <td className={TD}>
                      <span className="block font-semibold">{c.nome ?? c.email ?? 'Sem nome'}</span>
                      <span className="block text-[11.5px] text-muted-2">
                        {c.email}
                        {c.telefone && ` · ${c.telefone}`}
                      </span>
                    </td>
                    <td className={TD}>
                      <span
                        title={ESTADOS[c.estado].explica}
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${ESTADOS[c.estado].chip}`}
                      >
                        {ESTADOS[c.estado].rotulo}
                      </span>
                    </td>
                    <td className={`${TD} text-right`}>
                      {c.pedidos}
                      {c.pedidosEmAberto > 0 && (
                        <span className="block text-[11px] font-semibold text-[#B45309]">
                          {c.pedidosEmAberto} em aberto
                        </span>
                      )}
                    </td>
                    <td className={`${TD} text-right font-extrabold`}>{reais(c.totalGasto)}</td>
                    <td className={`${TD} text-right`}>
                      {c.pedidosPagos > 0 ? reais(c.ticketMedio) : '—'}
                    </td>
                    <td className={`${TD} text-right`}>{data(c.ultimoPedidoEm)}</td>
                    <td className={`${TD} text-right text-muted`}>
                      {c.albuns} · {c.fotos}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {visiveis.length === 0 && (
              <p className="m-0 p-8 text-center text-[13.5px] text-muted">
                Nenhum cliente casa com esse filtro.
              </p>
            )}
          </section>

          {paginas > 1 && (
            <div className="flex items-center justify-center gap-3">
              <button disabled={p === 0} onClick={() => setPagina(p - 1)} className={BOTAO}>
                Anterior
              </button>
              <span className="text-[12.5px] text-muted">
                {p + 1} de {paginas} · {filtrados.length} clientes
              </span>
              <button disabled={p >= paginas - 1} onClick={() => setPagina(p + 1)} className={BOTAO}>
                Próxima
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
