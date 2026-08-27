import Link from 'next/link';
import type { Projeto } from '@/lib/data';
import { STATUS } from '@/lib/status';
import { IconGaleria, IconAlerta, IconOlho, IconSeta } from '@/components/icons';

/** Capa gerada quando o album ainda nao tem imagem escolhida. */
const GRADIENTES = [
  'linear-gradient(140deg,#7C3AED,#2563EB)',
  'linear-gradient(140deg,#2563EB,#06B6D4)',
  'linear-gradient(140deg,#0EA5E9,#22D3EE)',
  'linear-gradient(140deg,#6366F1,#8B5CF6)',
];

export default function CardProjeto({
  projeto,
  totalFotosGaleria,
  indice = 0,
}: {
  projeto: Projeto;
  totalFotosGaleria: number;
  indice?: number;
}) {
  const s = STATUS[projeto.status];
  const primeiroAviso = projeto.avisos[0]?.titulo;

  return (
    <article className="flex flex-col overflow-hidden rounded-control border border-line bg-surface transition-[box-shadow,transform] duration-[180ms] hover:-translate-y-[3px] hover:shadow-[0_16px_34px_rgba(11,18,32,.1)]">
      <div
        className="relative h-[150px] overflow-hidden"
        style={
          projeto.capa_url
            ? undefined
            : { background: GRADIENTES[indice % GRADIENTES.length] }
        }
      >
        {projeto.capa_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={projeto.capa_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0 grid grid-cols-[2fr_1fr] grid-rows-2 gap-[3px] p-[3px] opacity-[.92]">
            <span className="row-span-2 rounded bg-white/[.26]" />
            <span className="rounded bg-white/20" />
            <span className="rounded bg-white/[.14]" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3.5 p-[18px]">
        <div className="min-w-0">
          <h3 className="m-0 truncate text-[15.5px] font-bold tracking-[-.2px]">{projeto.titulo}</h3>
          <p className="m-0 mt-1 text-[12.5px] text-muted-2">
            {[
              [projeto.produto_nome, projeto.produto_tamanho].filter(Boolean).join(' '),
              `${projeto.total_paginas} páginas`,
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>
        </div>

        <div className="flex items-center justify-between gap-2.5">
          <span
            className={`whitespace-nowrap rounded-full px-[11px] py-[5px] text-xs font-bold ${s.chip}`}
          >
            {s.rotulo}
          </span>
          <span className="text-[12.5px] font-bold text-ink-3">{projeto.progresso}%</span>
        </div>

        <div className="h-1.5 rounded-full bg-[#EEF1F7]">
          <div
            className="h-full rounded-full bg-[linear-gradient(90deg,#2563EB,#06B6D4)]"
            style={{ width: `${projeto.progresso}%` }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-[7px] text-[12.5px] text-muted">
            <span className="flex text-muted-2">
              <IconGaleria size={15} />
            </span>
            {projeto.fotos_usadas} de {totalFotosGaleria} fotos
          </span>
          {primeiroAviso && (
            <span className="flex items-center gap-[7px] text-[12.5px] text-muted">
              <span className="flex text-muted-2">
                <IconAlerta size={15} />
              </span>
              {primeiroAviso}
            </span>
          )}
        </div>

        <div className="mt-auto flex gap-2.5 pt-1">
          <Link
            href={`/editor/${projeto.id}`}
            className="flex h-11 min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-field bg-lente px-3.5 text-[13.5px] font-bold text-white hover:brightness-[1.06]"
          >
            <IconSeta size={16} />
            {s.acao}
          </Link>
          <Link
            href={`/projetos/${projeto.id}`}
            className="flex h-11 min-w-0 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-field border border-line bg-surface px-3.5 text-[13.5px] font-semibold text-ink hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue"
          >
            <IconOlho />
            Visualizar
          </Link>
        </div>
      </div>
    </article>
  );
}
