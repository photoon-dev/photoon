import Link from 'next/link';
import type { Aviso } from '@/lib/data';
import { IconAlerta, IconCheck, IconSparkle } from '@/components/icons';

/**
 * "Pendências para finalizar": obrigatorias bloqueiam a finalizacao,
 * recomendacoes o cliente pode ignorar.
 */
export default function PainelPendencias({
  avisos,
  projetoId,
}: {
  avisos: Aviso[];
  projetoId: string;
}) {
  const obrigatorias = avisos.filter((a) => a.nivel !== 'recomendacao');
  const recomendacoes = avisos.filter((a) => a.nivel === 'recomendacao');

  return (
    <section className="rounded-control border border-line bg-surface">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line-2 px-6 py-[18px]">
        <div className="min-w-0">
          <h2 className="m-0 text-[15.5px] font-bold tracking-[-.2px]">Pendências para finalizar</h2>
          <p className="m-0 mt-1 text-[12.5px] text-muted">
            Resolva os itens obrigatórios para liberar a finalização.
          </p>
        </div>
        <span className="whitespace-nowrap rounded-full bg-blue-soft px-3 py-1.5 text-[12px] font-bold text-muted">
          {obrigatorias.length} obrigatória{obrigatorias.length === 1 ? '' : 's'} ·{' '}
          {recomendacoes.length} recomendaç{recomendacoes.length === 1 ? 'ão' : 'ões'}
        </span>
      </div>

      {avisos.length === 0 ? (
        <div className="flex items-center gap-3 px-6 py-7">
          <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl bg-green-surface text-[#059669]">
            <IconCheck size={18} />
          </span>
          <div>
            <p className="m-0 text-[14px] font-bold">Nenhuma pendência</p>
            <p className="m-0 mt-0.5 text-[12.5px] text-muted">
              Este álbum está liberado para finalização.
            </p>
          </div>
        </div>
      ) : (
        <ul className="m-0 list-none p-0">
          {avisos.map((a, i) => {
            const obrigatoria = a.nivel !== 'recomendacao';
            return (
              <li
                key={`${a.titulo}-${i}`}
                className="flex flex-wrap items-start gap-3.5 border-b border-line-2 px-6 py-4 last:border-b-0"
              >
                <span
                  className={`flex h-[34px] w-[34px] flex-none items-center justify-center rounded-xl ${
                    obrigatoria ? 'bg-amber-surface text-[#B45309]' : 'bg-blue-surface text-blue'
                  }`}
                >
                  <IconAlerta size={17} />
                </span>
                <div className="min-w-[200px] flex-1">
                  <p className="m-0 text-[13.5px] font-bold">{a.titulo}</p>
                  {a.descricao && (
                    <p className="m-0 mt-1 text-[12.5px] leading-[1.55] text-muted">{a.descricao}</p>
                  )}
                </div>
                <Link
                  href={`/editor/${projetoId}`}
                  className="flex h-9 flex-none items-center rounded-xl border border-line px-3.5 text-[12.5px] font-semibold text-ink hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue"
                >
                  {a.acao ?? (obrigatoria ? 'Corrigir' : 'Revisar')}
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      {obrigatorias.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3.5 border-t border-line-2 bg-surface-2 px-6 py-4">
          <p className="m-0 max-w-[520px] text-[12.5px] leading-[1.55] text-ink-3">
            A assistência inteligente pode resolver as pendências obrigatórias em um passo, com
            prévia antes de aplicar.
          </p>
          <Link
            href={`/editor/${projetoId}?assistente=1`}
            className="flex h-11 flex-none items-center gap-2 rounded-field bg-lente px-4 text-[13.5px] font-bold text-white shadow-card hover:brightness-[1.06]"
          >
            <IconSparkle size={16} />
            Corrigir com IA
          </Link>
        </div>
      )}
    </section>
  );
}
