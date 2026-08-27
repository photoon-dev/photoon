'use client';

import Link from 'next/link';
import { useState } from 'react';
import MarcaPhotoon from '@/components/MarcaPhotoon';
import { IconSeta, IconOlho, IconCheck, IconInfo } from '@/components/icons';

export type EstadoSalvamento = 'salvo' | 'salvando' | 'erro';

const ROTULO: Record<EstadoSalvamento, { texto: string; classe: string }> = {
  salvo: { texto: 'Salvo agora', classe: 'bg-green-surface text-[#059669]' },
  salvando: { texto: 'Salvando…', classe: 'bg-blue-surface text-blue' },
  erro: { texto: 'Sem conexão', classe: 'bg-coral-surface text-coral' },
};

export default function Topbar({
  projetoId,
  titulo,
  onTitulo,
  estado,
  zoom,
  onZoom,
  bloqueadores,
}: {
  projetoId: string;
  titulo: string;
  onTitulo: (t: string) => void;
  estado: EstadoSalvamento;
  zoom: number;
  onZoom: (z: number) => void;
  bloqueadores: number;
}) {
  const [editando, setEditando] = useState(false);
  const r = ROTULO[estado];

  return (
    <header className="flex h-16 flex-none items-center gap-3 border-b border-line bg-surface px-4">
      <Link
        href="/meus-projetos"
        className="flex h-10 items-center gap-2 rounded-xl border border-line px-3 text-[13px] font-semibold text-ink-3 hover:bg-blue-soft hover:text-blue"
      >
        <span className="rotate-180">
          <IconSeta size={16} />
        </span>
        Álbuns
      </Link>

      <MarcaPhotoon size={28} id="edt" />

      {editando ? (
        <input
          autoFocus
          value={titulo}
          onChange={(e) => onTitulo(e.target.value)}
          onBlur={() => setEditando(false)}
          onKeyDown={(e) => e.key === 'Enter' && setEditando(false)}
          className="h-9 min-w-0 max-w-[280px] flex-1 rounded-xl border border-blue bg-surface px-3 text-[14px] font-bold outline-none"
        />
      ) : (
        <button
          onClick={() => setEditando(true)}
          title="Renomear projeto"
          className="max-w-[280px] truncate rounded-xl px-2 py-1.5 text-[14px] font-bold hover:bg-page"
        >
          {titulo}
        </button>
      )}

      <span className={`rounded-full px-3 py-1.5 text-[11.5px] font-bold ${r.classe}`}>
        {r.texto}
      </span>

      <div className="flex-1" />

      <div className="flex items-center gap-1 rounded-xl border border-line px-1">
        {([
          ['−', () => onZoom(Math.max(40, zoom - 10))],
          [`${zoom}%`, () => onZoom(100)],
          ['+', () => onZoom(Math.min(200, zoom + 10))],
        ] as const).map(([r, fn], i) => (
          <button
            key={i}
            onClick={fn}
            className={`h-9 rounded-lg px-2.5 text-[13px] font-semibold text-ink-3 hover:bg-blue-soft hover:text-blue ${
              i === 1 ? 'min-w-[54px] tabular-nums' : 'w-8'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      <Link
        href={`/projetos/${projetoId}`}
        className="flex h-10 items-center gap-2 rounded-xl border border-line px-3.5 text-[13px] font-semibold text-ink-3 hover:bg-blue-soft hover:text-blue"
      >
        <IconOlho />
        Prévia
      </Link>

      <button
        disabled={bloqueadores > 0}
        title={
          bloqueadores > 0
            ? `Resolva ${bloqueadores} pendência(s) obrigatória(s) para finalizar`
            : undefined
        }
        className="flex h-10 items-center gap-2 rounded-xl bg-lente px-4 text-[13px] font-bold text-white shadow-card hover:brightness-[1.06] disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
      >
        {bloqueadores > 0 ? <IconInfo size={16} /> : <IconCheck size={16} />}
        Revisar e finalizar
      </button>
    </header>
  );
}
