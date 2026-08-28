'use client';

/**
 * Prévia do editor SEM login, para fotografar o render localmente.
 *
 * Monta o <EditorCliente> com dados de mentira (fotos em SVG, um documento v2
 * cravado à mão). Existe porque `tools/tirar-foto.mjs` depende de `SENHA_TESTE`
 * e do site publicado; aqui o editor renderiza direto de `next dev`.
 *
 *   npm run dev
 *   node tools/tirar-foto.mjs  → precisa de senha
 *   -- ou, sem senha --
 *   http://localhost:3000/dev-preview/editor
 *
 * Só existe em desenvolvimento: em build de produção devolve 404.
 */

import { notFound } from 'next/navigation';
import EditorCliente from '@/components/editor/EditorCliente';
import type { Foto } from '@/lib/data';

/** Foto de mentira: assimétrica de propósito, para girar/espelhar saltar aos olhos. */
function fotoSvg(bg: string, glyph: string): string {
  const svg =
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>` +
    `<rect width='800' height='600' fill='${bg}'/>` +
    `<path d='M0 0 H240 L0 150 Z' fill='rgba(255,255,255,.9)'/>` +
    `<text x='400' y='80' font-family='sans-serif' font-size='64' font-weight='bold' fill='#fff' text-anchor='middle'>&#9650; TOPO</text>` +
    `<text x='40' y='560' font-family='sans-serif' font-size='52' fill='#fff'>&#9664; ESQ</text>` +
    `<text x='400' y='390' font-family='sans-serif' font-size='260' font-weight='bold' fill='rgba(255,255,255,.85)' text-anchor='middle'>${glyph}</text>` +
    `</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const FOTOS: Foto[] = [
  { id: 'f1', storage_path: 'demo/f1.jpg', largura: 800, altura: 600, url: fotoSvg('#2563EB', 'R') },
  { id: 'f2', storage_path: 'demo/f2.jpg', largura: 800, altura: 600, url: fotoSvg('#059669', 'F') },
  { id: 'f3', storage_path: 'demo/f3.jpg', largura: 800, altura: 600, url: fotoSvg('#B45309', 'Q') },
];

const enq = (over: Partial<{ rot: number; espelho: boolean; modo: 'preencher' | 'encaixar'; escala: number }> = {}) => ({
  modo: 'preencher' as const,
  escala: 1,
  dx: 0,
  dy: 0,
  rot: 0,
  espelho: false,
  ...over,
});

const ajustes = { brilho: 0, contraste: 0, saturacao: 0, pb: false };

const quadro = (id: string, fotoId: string, over = {}) => ({
  id,
  tipo: 'foto' as const,
  fotoId,
  enq: enq(over),
  ajustes: { ...ajustes },
});

const PAGINAS = [
  {
    id: 'lam-1',
    fundo: '#FFFFFF',
    esquerda: {
      layoutId: 'dupla-v',
      quadros: [quadro('q1', 'f1', { rot: 0 }), quadro('q2', 'f2', { rot: 90 })],
    },
    direita: {
      layoutId: 'dupla-h',
      quadros: [quadro('q3', 'f3', { espelho: true }), quadro('q4', 'f1', { rot: 180 })],
    },
    reserva: [],
  },
  {
    id: 'lam-2',
    fundo: '#FFFFFF',
    esquerda: {
      layoutId: 'quadro-4',
      quadros: [
        quadro('q5', 'f2', { modo: 'encaixar' }),
        quadro('q6', 'f3', { rot: 270 }),
        quadro('q7', 'f1', { escala: 1.6 }),
        quadro('q8', null as unknown as string),
      ],
    },
    direita: {
      layoutId: 'cheia',
      quadros: [quadro('q9', 'f2', { espelho: true, rot: 90 })],
    },
    reserva: [],
  },
];

export default function DevEditorPreview() {
  if (process.env.NODE_ENV === 'production') notFound();
  return (
    <div className="h-screen">
      <EditorCliente
        projetoId="dev-preview"
        titulo="Prévia do editor (mock)"
        fotos={FOTOS}
        modelo={null}
        paginas={PAGINAS}
      />
    </div>
  );
}
