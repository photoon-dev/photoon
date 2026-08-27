import Link from 'next/link';
import { IconSparkle, IconTique } from '@/components/icons';

const PROMESSAS = ['Respeita rostos e datas', 'Evita fotos repetidas', 'Você revisa antes de aplicar'];

/**
 * "Assistência inteligente" — o terceiro card da linha em Meus projetos.
 *
 * Leva para o painel de assistência dentro do editor, que é onde as ações
 * automáticas realmente rodam.
 */
export default function CardAssistencia({ projetoId }: { projetoId: string | null }) {
  return (
    <section className="flex flex-col rounded-control bg-[linear-gradient(150deg,#0B1220_0%,#1B2350_55%,#123F63_100%)] px-6 py-[22px] text-white">
      <span className="mb-4 inline-flex w-max items-center gap-2 rounded-full border border-white/20 bg-white/[.14] px-3 py-1.5 text-[11.5px] font-bold">
        <IconSparkle size={14} />
        Assistência inteligente
      </span>

      <h2 className="m-0 mb-2 text-[19px] font-extrabold leading-[1.2] tracking-[-.5px]">
        Deixe a Photoon montar seu álbum
      </h2>
      <p className="m-0 mb-4 text-[13.5px] leading-[1.55] text-white/70">
        Escolha as fotos e receba um álbum completo, diagramado e sem rostos cortados.
      </p>

      <ul className="m-0 mb-5 flex list-none flex-col gap-2 p-0">
        {PROMESSAS.map((p) => (
          <li key={p} className="flex items-center gap-2.5 text-[12.5px] text-white/80">
            <span className="flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full bg-white/[.16] text-cyan">
              <IconTique size={11} />
            </span>
            {p}
          </li>
        ))}
      </ul>

      {projetoId ? (
        <Link
          href={`/editor/${projetoId}?painel=assistencia`}
          className="mt-auto flex h-11 items-center justify-center gap-2 rounded-field bg-white text-[13.5px] font-bold text-ink hover:bg-cyan-surface"
        >
          <IconSparkle size={16} />
          Criar com IA
        </Link>
      ) : (
        <span className="mt-auto flex h-11 items-center justify-center rounded-field bg-white/10 text-[13.5px] font-semibold text-white/50">
          Nenhum álbum para montar ainda
        </span>
      )}
    </section>
  );
}
