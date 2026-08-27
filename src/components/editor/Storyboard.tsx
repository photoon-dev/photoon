'use client';

import type { Lamina } from '@/lib/album';
import { IconMais, IconAlerta } from '@/components/icons';

/** Barra inferior com as laminas e o aviso de quadros vazios (U15). */
export default function Storyboard({
  laminas,
  atual,
  onIr,
  onAdicionar,
  onRemover,
}: {
  laminas: Lamina[];
  atual: number;
  onIr: (i: number) => void;
  onAdicionar: () => void;
  onRemover: (i: number) => void;
}) {
  const vazias = laminas.filter((l) => l.quadros.some((q) => q.tipo === 'foto' && !q.fotoId)).length;

  return (
    <footer className="flex h-28 flex-none items-center gap-3 border-t border-line bg-surface px-4">
      <div className="flex flex-none flex-col">
        <span className="text-[12.5px] font-bold">Páginas</span>
        {vazias > 0 && (
          <span className="flex items-center gap-1 text-[11px] font-semibold text-[#B45309]">
            <IconAlerta size={13} />
            {vazias} sem foto
          </span>
        )}
      </div>

      <div className="flex flex-1 items-center gap-2.5 overflow-x-auto py-2">
        {laminas.map((l, i) => {
          const vazia = l.quadros.some((q) => q.tipo === 'foto' && !q.fotoId);
          return (
            <button
              key={l.id}
              onClick={() => onIr(i)}
              onDoubleClick={() => laminas.length > 1 && onRemover(i)}
              title={`Lâmina ${i + 1}${laminas.length > 1 ? ' · duplo clique remove' : ''}`}
              className={`relative flex-none rounded-lg border-2 p-1 ${
                i === atual ? 'border-blue' : 'border-line hover:border-[#CBD5E6]'
              }`}
            >
              <div
                className="relative flex aspect-[2/1] w-[104px] gap-px"
                style={{ background: l.fundo }}
              >
                {l.quadros
                  .filter((q) => q.tipo === 'foto')
                  .map((q) => (
                    <span
                      key={q.id}
                      className="absolute bg-[#CBD5E6]"
                      style={{
                        left: `${q.x}%`,
                        top: `${q.y}%`,
                        width: `${q.w}%`,
                        height: `${q.h}%`,
                        background: q.tipo === 'foto' && q.fotoId ? '#2563EB' : '#DCE3EF',
                      }}
                    />
                  ))}
              </div>
              <span className="mt-1 block text-[10.5px] font-semibold text-muted">{i + 1}</span>
              {vazia && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-amber" />
              )}
            </button>
          );
        })}

        <button
          onClick={onAdicionar}
          className="flex aspect-[2/1] w-[104px] flex-none flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-line text-muted hover:border-blue hover:text-blue"
        >
          <IconMais size={18} />
          <span className="text-[11px] font-semibold">Adicionar</span>
        </button>
      </div>
    </footer>
  );
}
