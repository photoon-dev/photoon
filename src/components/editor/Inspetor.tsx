'use client';

import type { Quadro } from '@/lib/album';
import { PRESETS_TEXTO } from '@/lib/album';

/** Inspetor direito: aparece so quando ha objeto selecionado (U08/U14). */
export default function Inspetor({
  quadro,
  onAtualizar,
  onRemover,
}: {
  quadro: Quadro | null;
  onAtualizar: (mudanca: Partial<Quadro>) => void;
  onRemover: () => void;
}) {
  if (!quadro) {
    return (
      <aside className="hidden w-72 flex-none border-l border-line bg-surface p-4 lg:block">
        <p className="m-0 text-[13.5px] font-bold">Nada selecionado</p>
        <p className="m-0 mt-1 text-[12px] leading-[1.55] text-muted">
          Clique em uma foto ou texto da lâmina para editar aqui.
        </p>
      </aside>
    );
  }

  const rotulo = 'text-[11.5px] font-semibold text-ink-3';
  const campo =
    'h-9 w-full rounded-lg border border-line bg-surface px-2.5 text-[13px] text-ink outline-none focus:border-blue';

  return (
    <aside className="hidden w-72 flex-none overflow-y-auto border-l border-line bg-surface lg:block">
      <div className="flex items-center justify-between gap-2 border-b border-line-2 px-4 py-3.5">
        <p className="m-0 text-[14px] font-bold">
          {quadro.tipo === 'foto' ? 'Foto' : PRESETS_TEXTO[quadro.preset].rotulo}
        </p>
        <button
          onClick={onRemover}
          className="rounded-lg px-2 py-1 text-[11.5px] font-semibold text-[#E11D48] hover:bg-coral-surface"
        >
          Remover
        </button>
      </div>

      <div className="flex flex-col gap-4 p-4">
        {quadro.tipo === 'foto' ? (
          <>
            <div>
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className={rotulo}>Zoom</span>
                <span className="text-[11.5px] tabular-nums text-muted">{quadro.zoom}%</span>
              </div>
              <input
                type="range"
                min={100}
                max={250}
                value={quadro.zoom}
                onChange={(e) => onAtualizar({ zoom: Number(e.target.value) } as Partial<Quadro>)}
                className="w-full accent-[#2563EB]"
              />
            </div>

            <div>
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className={rotulo}>Rotação</span>
                <span className="text-[11.5px] tabular-nums text-muted">{quadro.rotacao}°</span>
              </div>
              <input
                type="range"
                min={-180}
                max={180}
                value={quadro.rotacao}
                onChange={(e) => onAtualizar({ rotacao: Number(e.target.value) } as Partial<Quadro>)}
                className="w-full accent-[#2563EB]"
              />
            </div>

            <label className="flex cursor-pointer items-center justify-between gap-2">
              <span className={rotulo}>Preto e branco</span>
              <input
                type="checkbox"
                checked={quadro.pb}
                onChange={(e) => onAtualizar({ pb: e.target.checked } as Partial<Quadro>)}
                className="h-4 w-4 accent-[#2563EB]"
              />
            </label>

            <p className="m-0 text-[11px] leading-[1.5] text-muted-2">
              Enquadramento com guia de rosto e correção inteligente (U14) entram junto com a
              detecção de rostos.
            </p>
          </>
        ) : (
          <>
            <div>
              <span className={`${rotulo} mb-1.5 block`}>Estilo</span>
              <select
                value={quadro.preset}
                onChange={(e) => onAtualizar({ preset: e.target.value } as Partial<Quadro>)}
                className={campo}
              >
                {Object.entries(PRESETS_TEXTO).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.rotulo}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <span className={`${rotulo} mb-1.5 block`}>Cor</span>
              <input
                type="color"
                value={quadro.cor}
                onChange={(e) => onAtualizar({ cor: e.target.value } as Partial<Quadro>)}
                className="h-9 w-full cursor-pointer rounded-lg border border-line bg-surface"
              />
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
