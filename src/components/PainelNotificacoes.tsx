'use client';

import { useEffect, useRef, useState } from 'react';
import type { Notificacao } from '@/lib/data';
import { IconSino } from '@/components/icons';

const quando = (iso: string) => {
  const min = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (min < 1) return 'agora';
  if (min < 60) return `há ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `há ${h} h`;
  const d = Math.floor(h / 24);
  return d === 1 ? 'ontem' : `há ${d} dias`;
};

const COR_TAG: Record<string, string> = {
  Aviso: 'bg-amber-surface text-[#B45309]',
  Produção: 'bg-cyan-surface text-[#0891B2]',
  Concluído: 'bg-green-surface text-[#059669]',
};

/** Sino do cabeçalho: "Avisos da Photoon sobre seus projetos". */
export default function PainelNotificacoes({
  notificacoes,
  naoLidas,
}: {
  notificacoes: Notificacao[];
  naoLidas: number;
}) {
  const [aberto, setAberto] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    const fora = (e: MouseEvent) => {
      if (caixa.current && !caixa.current.contains(e.target as Node)) setAberto(false);
    };
    document.addEventListener('mousedown', fora);
    return () => document.removeEventListener('mousedown', fora);
  }, [aberto]);

  return (
    <div className="relative" ref={caixa}>
      <button
        onClick={() => setAberto((a) => !a)}
        aria-expanded={aberto}
        title="Notificações"
        className={`relative flex h-[42px] w-[42px] flex-none items-center justify-center rounded-control border text-ink-3 ${
          aberto ? 'border-[#D6E2FC] bg-blue-soft text-blue' : 'border-line bg-surface hover:bg-blue-soft hover:text-blue'
        }`}
      >
        <IconSino size={18} />
        {naoLidas > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
            {naoLidas}
          </span>
        )}
      </button>

      {aberto && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-[340px] overflow-hidden rounded-control border border-line bg-surface shadow-modal">
          <div className="border-b border-line-2 px-4 py-3.5">
            <p className="m-0 text-[14px] font-bold">Notificações</p>
            <p className="m-0 mt-0.5 text-[12px] text-muted">
              Avisos da Photoon sobre seus projetos
            </p>
          </div>

          {notificacoes.length === 0 ? (
            <p className="m-0 px-4 py-8 text-center text-[13px] text-muted">
              Nenhum aviso por enquanto.
            </p>
          ) : (
            <ul className="m-0 max-h-[360px] list-none overflow-y-auto p-0">
              {notificacoes.map((n) => (
                <li
                  key={n.id}
                  className={`border-b border-line-2 px-4 py-3 last:border-b-0 ${
                    n.lida ? '' : 'bg-surface-2'
                  }`}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold ${
                        COR_TAG[n.tag] ?? 'bg-blue-surface text-blue'
                      }`}
                    >
                      {n.tag}
                    </span>
                    <span className="text-[11px] text-muted-2">{quando(n.criada_em)}</span>
                  </div>
                  <p className="m-0 text-[13px] font-semibold">{n.titulo}</p>
                  {n.corpo && (
                    <p className="m-0 mt-1 text-[12px] leading-[1.5] text-muted">{n.corpo}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
