'use client';

import { useState } from 'react';
import { IconFechar, IconCheck } from '@/components/icons';

const ETAPAS = [
  {
    titulo: 'Você resolve as pendências obrigatórias',
    texto: 'Lâminas sem foto e rostos cortados bloqueiam o envio. Avisos de qualidade não.',
  },
  {
    titulo: 'A Photoon revisa o arquivo',
    texto: 'Conferimos resolução, margem de corte e área segura de cada lâmina.',
  },
  {
    titulo: 'O álbum vai para produção',
    texto: 'Depois do envio o álbum fica travado para edição, e a empresa assume o prazo.',
  },
];

/** "Como funciona a finalização" — explica o que trava e o que não trava o envio. */
export default function ModalFinalizacao() {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        onClick={() => setAberto(true)}
        className="mt-auto flex h-11 items-center justify-center gap-2 rounded-field border border-line text-[13.5px] font-semibold text-ink hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue"
      >
        Como funciona a finalização
      </button>

      {aberto && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-ink/50 backdrop-blur-[3px]"
            onClick={() => setAberto(false)}
          />
          <div className="fixed inset-0 z-[61] flex items-center justify-center p-6">
            <div className="max-h-[86vh] w-[min(520px,100%)] overflow-y-auto rounded-card bg-surface shadow-modal">
              <div className="flex items-start justify-between gap-5 border-b border-line-2 px-6 py-4">
                <h2 className="m-0 text-[17px] font-extrabold tracking-[-.4px]">
                  Como funciona a finalização
                </h2>
                <button
                  onClick={() => setAberto(false)}
                  aria-label="Fechar"
                  className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-xl border border-line text-muted hover:bg-blue-soft hover:text-blue"
                >
                  <IconFechar />
                </button>
              </div>

              <ol className="m-0 flex list-none flex-col gap-4 p-6">
                {ETAPAS.map((e, i) => (
                  <li key={e.titulo} className="flex items-start gap-3.5">
                    <span className="flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-blue-surface text-[12px] font-extrabold text-blue">
                      {i + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="m-0 text-[13.5px] font-bold">{e.titulo}</p>
                      <p className="m-0 mt-1 text-[12.5px] leading-[1.55] text-muted">{e.texto}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <div className="flex items-start gap-3 border-t border-line-2 bg-surface-2 px-6 py-4">
                <span className="mt-0.5 flex-none text-green">
                  <IconCheck size={16} />
                </span>
                <p className="m-0 text-[12.5px] leading-[1.55] text-ink-3">
                  Dá para finalizar vários álbuns de uma vez. Enquanto não enviar, tudo continua
                  editável e salvo automaticamente.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
