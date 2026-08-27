'use client';

import { useState } from 'react';
import type { Foto } from '@/lib/data';
import { IconGaleria, IconFechar } from '@/components/icons';

/**
 * "Ver a galeria" — mostra as fotos que a empresa liberou.
 *
 * É um modal, e não uma rota nova, porque a tela cheia de galeria (U04, com
 * filtros e seleção) ainda não existe. Aqui o cliente só confere o que
 * recebeu; escolher foto continua sendo no editor.
 */
export default function ModalGaleria({ fotos, nome }: { fotos: Foto[]; nome: string }) {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className="mt-auto flex h-11 items-center justify-center gap-2 rounded-field border border-line text-[13.5px] font-semibold text-ink hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue"
      >
        <IconGaleria size={16} />
        Ver a galeria
      </button>

      {aberto && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-[3px]"
            onClick={() => setAberto(false)}
          />
          <div className="fixed inset-0 z-[61] flex items-center justify-center p-6">
            <div className="flex max-h-[86vh] w-[min(900px,100%)] flex-col overflow-hidden rounded-card bg-surface shadow-modal">
              <div className="flex items-start justify-between gap-5 border-b border-line-2 px-6 py-4">
                <div className="min-w-0">
                  <h2 className="m-0 text-[17px] font-extrabold tracking-[-.4px]">{nome}</h2>
                  <p className="m-0 mt-1 text-[12.5px] text-muted">
                    {fotos.length} {fotos.length === 1 ? 'foto liberada' : 'fotos liberadas'} pela
                    empresa
                  </p>
                </div>
                <button
                  onClick={() => setAberto(false)}
                  aria-label="Fechar"
                  className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-xl border border-line text-muted hover:bg-blue-soft hover:text-blue"
                >
                  <IconFechar />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 overflow-y-auto p-4 sm:grid-cols-4 md:grid-cols-5">
                {fotos.map((f) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={f.id}
                    src={f.url}
                    alt=""
                    loading="lazy"
                    className="aspect-square w-full rounded-xl object-cover"
                  />
                ))}
              </div>

              <p className="border-t border-line-2 bg-surface-2 px-6 py-3.5 text-[12.5px] text-muted">
                As fotos são enviadas pela empresa. Para usá-las, abra um álbum e arraste para os
                quadros da lâmina.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
