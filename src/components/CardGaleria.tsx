import type { Foto, Galeria } from '@/lib/data';
import { IconGaleria, IconRelogio } from '@/components/icons';
import ModalGaleria from '@/components/ModalGaleria';
import ModalFinalizacao from '@/components/ModalFinalizacao';

function haQuanto(iso: string): string {
  const dias = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (dias <= 0) return 'hoje';
  if (dias === 1) return 'ontem';
  return `há ${dias} dias`;
}

export function CardGaleria({
  galeria,
  fotosSelecionadas,
  amostras = [],
}: {
  galeria: Galeria;
  fotosSelecionadas: number;
  /** Primeiras fotos da galeria, para a tira de miniaturas. */
  amostras?: Foto[];
}) {
  return (
    <div className="flex flex-col rounded-control border border-line bg-surface px-6 py-[22px]">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl bg-[#F1EBFE] text-[#7C3AED]">
          <IconGaleria />
        </span>
        <div className="min-w-0">
          <p className="m-0 text-[14.5px] font-bold">Galeria liberada</p>
          <p className="m-0 mt-0.5 truncate text-[12.5px] text-muted">{galeria.nome}</p>
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-[9px]">
        {[
          ['Fotos disponíveis', String(galeria.total_fotos)],
          ['Selecionadas', String(fotosSelecionadas)],
          ['Atualizada', haQuanto(galeria.atualizada_em)],
        ].map(([r, v]) => (
          <div key={r} className="flex items-center justify-between gap-2.5">
            <span className="text-[12.5px] text-muted-2">{r}</span>
            <span className="text-[12.5px] font-semibold text-ink-3">{v}</span>
          </div>
        ))}
      </div>

      {amostras.length > 0 && (
        <div className="mb-4 grid grid-cols-6 gap-[5px]">
          {amostras.slice(0, 6).map((f) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={f.id}
              src={f.url}
              alt=""
              loading="lazy"
              className="aspect-square w-full rounded-[7px] object-cover"
            />
          ))}
        </div>
      )}

      <ModalGaleria fotos={amostras} nome={galeria.nome} />
    </div>
  );
}

export function CardProximosPassos({ passos }: { passos: { titulo: string; sub: string }[] }) {
  const cores = ['bg-blue-surface text-blue', 'bg-cyan-surface text-[#0891B2]', 'bg-green-surface text-[#059669]'];

  return (
    <div className="flex flex-col rounded-control border border-line bg-surface px-6 py-[22px]">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl bg-amber-surface text-[#B45309]">
          <IconRelogio />
        </span>
        <div className="min-w-0">
          <p className="m-0 text-[14.5px] font-bold">Próximos passos</p>
          <p className="m-0 mt-0.5 text-[12.5px] text-muted">na ordem recomendada</p>
        </div>
      </div>

      {passos.length === 0 ? (
        <p className="m-0 text-[13px] text-muted">
          Tudo em dia por aqui. Nenhuma pendência nos seus álbuns.
        </p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {passos.map((p, i) => (
            <div
              key={p.titulo}
              className="flex items-center gap-3 rounded-field border border-[#EEF1F7] bg-surface-2 px-3 py-[11px]"
            >
              <span
                className={`flex h-[26px] w-[26px] flex-none items-center justify-center rounded-lg text-xs font-extrabold ${cores[i % cores.length]}`}
              >
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="m-0 text-[13px] font-semibold">{p.titulo}</p>
                <p className="m-0 mt-0.5 text-[11.5px] text-muted-2">{p.sub}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <ModalFinalizacao />
    </div>
  );
}
