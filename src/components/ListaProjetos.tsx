'use client';

import { useMemo, useState } from 'react';
import type { Projeto, StatusProjeto } from '@/lib/data';
import { STATUS, ORDEM_STATUS } from '@/lib/status';
import CardProjeto from '@/components/CardProjeto';
import { IconBusca, IconFiltro, IconChevron } from '@/components/icons';

type Ordem = 'recentes' | 'nome' | 'progresso';

const ORDENACOES: Record<Ordem, { rotulo: string; cmp: (a: Projeto, b: Projeto) => number }> = {
  recentes: {
    rotulo: 'Alterado recentemente',
    cmp: (a, b) => b.atualizado_em.localeCompare(a.atualizado_em),
  },
  nome: { rotulo: 'Nome do projeto', cmp: (a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR') },
  progresso: { rotulo: 'Mais avançados', cmp: (a, b) => b.progresso - a.progresso },
};

export default function ListaProjetos({
  projetos,
  totalFotosGaleria,
  capas = [],
}: {
  projetos: Projeto[];
  totalFotosGaleria: number;
  /** URLs de fotos da galeria, usadas como capa provisória dos álbuns. */
  capas?: string[];
}) {
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState<StatusProjeto | null>(null);
  const [abertos, setAbertos] = useState(false);
  const [ordem, setOrdem] = useState<Ordem>('recentes');

  const contagem = useMemo(() => {
    const c = {} as Record<StatusProjeto, number>;
    for (const s of ORDEM_STATUS) c[s] = 0;
    for (const p of projetos) c[p.status] += 1;
    return c;
  }, [projetos]);

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return projetos
      .filter((p) => (filtro ? p.status === filtro : true))
      .filter((p) => (termo ? p.titulo.toLowerCase().includes(termo) : true))
      .sort(ORDENACOES[ordem].cmp);
  }, [projetos, filtro, busca, ordem]);

  const chip = (ativo: boolean) =>
    `flex cursor-pointer items-center gap-[7px] rounded-full border px-3.5 py-[9px] text-[13px] ${
      ativo
        ? 'border-[#D6E2FC] bg-blue-soft font-bold text-blue'
        : 'border-line bg-surface font-medium text-ink-3 hover:border-[#D6E2FC] hover:text-blue'
    }`;

  return (
    <>
      <div className="rounded-control border border-line bg-surface px-[18px] py-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex h-[46px] min-w-[240px] max-w-[400px] flex-1 items-center gap-2.5 rounded-field border border-line bg-surface px-4 focus-within:border-blue">
            <span className="flex-none text-muted-2">
              <IconBusca />
            </span>
            <input
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              placeholder="Buscar pelo nome do projeto"
              className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ink outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <label className="relative flex h-11 items-center">
              <select
                value={ordem}
                onChange={(e) => setOrdem(e.target.value as Ordem)}
                className="h-11 cursor-pointer appearance-none whitespace-nowrap rounded-field border border-line bg-surface pl-[18px] pr-10 text-sm font-semibold text-ink outline-none hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue"
              >
                {Object.entries(ORDENACOES).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.rotulo}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-3.5 text-muted-2">
                <IconChevron size={14} />
              </span>
            </label>

            <button
              onClick={() => setAbertos((a) => !a)}
              className={`flex h-11 items-center justify-center gap-[9px] whitespace-nowrap rounded-field border px-[18px] text-sm font-semibold ${
                abertos || filtro
                  ? 'border-[#D6E2FC] bg-blue-soft text-blue'
                  : 'border-line bg-surface text-ink hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue'
              }`}
            >
              <IconFiltro />
              Filtros
              <span className={abertos ? 'rotate-180 transition-transform' : 'transition-transform'}>
                <IconChevron size={14} />
              </span>
            </button>
          </div>
        </div>

        {abertos && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-[#EEF1F7] pt-4">
            <button onClick={() => setFiltro(null)} className={chip(filtro === null)}>
              Todos
              <span
                className={`rounded-full px-[7px] py-px text-[11px] font-bold ${
                  filtro === null ? 'bg-blue text-white' : 'bg-blue-soft text-muted'
                }`}
              >
                {projetos.length}
              </span>
            </button>
            {ORDEM_STATUS.map((s) => (
              <button key={s} onClick={() => setFiltro(s)} className={chip(filtro === s)}>
                {STATUS[s].filtro}
                <span
                  className={`rounded-full px-[7px] py-px text-[11px] font-bold ${
                    filtro === s ? 'bg-blue text-white' : 'bg-blue-soft text-muted'
                  }`}
                >
                  {contagem[s]}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {visiveis.length === 0 ? (
        <div className="rounded-control border border-dashed border-line bg-surface px-6 py-14 text-center">
          <p className="m-0 text-[15px] font-bold">Nenhum projeto por aqui</p>
          <p className="m-0 mt-1.5 text-[13.5px] text-muted">
            {busca || filtro
              ? 'Ajuste a busca ou os filtros para ver os outros álbuns.'
              : 'Assim que a empresa liberar suas fotos, seus álbuns aparecem aqui.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          {visiveis.map((p, i) => (
            <CardProjeto
              key={p.id}
              projeto={p}
              totalFotosGaleria={totalFotosGaleria}
              indice={i}
              capaAlternativa={capas[i % Math.max(capas.length, 1)]}
            />
          ))}
        </div>
      )}
    </>
  );
}
