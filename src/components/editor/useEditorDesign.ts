'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import type { Foto } from '@/lib/data';

/**
 * Porte da classe `Component extends DCLogic` de `Cliente Editor.dc.html`.
 *
 * Mantém os mesmos nomes, os mesmos valores calculados e as mesmas strings de
 * estilo do design. O que muda é a origem dos dados: onde o design usava
 * gradientes de mentira, aqui entram as fotos reais da galeria.
 */

export type EstadoEditor = {
  hover: number | null;
  spread: number;
  spreadLay: number[];
  turning: 'next' | 'prev' | null;
  tool: number;
  panel: boolean;
  insp: boolean;
  modal: number | null;
  zoom: number;
  sel: 'foto' | 'texto' | null;
  count: number;
  lay: number;
  photoTab: number;
  bgTab: number;
  bgCat: number;
  elCat: number;
  bw: boolean;
};

const LAYOUTS = [
  { n: 1, grid: '1fr', rows: '1fr', cells: 1, span: false },
  { n: 2, grid: '1fr 1fr', rows: '1fr', cells: 2, span: false },
  { n: 2, grid: '1fr', rows: '1fr 1fr', cells: 2, span: false },
  { n: 3, grid: '1.2fr 1fr', rows: '1fr 1fr', cells: 3, span: true },
  { n: 3, grid: '1fr 1fr 1fr', rows: '1fr', cells: 3, span: false },
  { n: 4, grid: '1fr 1fr', rows: '1fr 1fr', cells: 4, span: false },
  { n: 5, grid: '1fr 1fr 1fr', rows: '1fr 1fr', cells: 5, span: false },
  { n: 6, grid: '1fr 1fr 1fr', rows: '1fr 1fr', cells: 6, span: false },
  { n: 7, grid: '1fr 1fr 1fr 1fr', rows: '1fr 1fr', cells: 7, span: false },
  { n: 8, grid: '1fr 1fr 1fr 1fr', rows: '1fr 1fr', cells: 8, span: false },
  { n: 9, grid: '1fr 1fr 1fr', rows: '1fr 1fr 1fr', cells: 9, span: false },
];

const ROTULOS_LAMINA = ['Capa', '1–2', '3–4', '5–6', '7–8', '9–10', '11–12', '13–14', '15–16', '17–18'];

const BG_SW = ['#EAF0FF', '#E4F8FC', '#F1F5FD', '#E6F8F1', '#FEF3E2', '#F8FAFE', '#DCE6FA', '#EEF1F7', '#F4F7FC'];
const CHIPS = ['#FFFFFF', '#F4F7FC', '#9AA7BC', '#46536A', '#0B1220', '#2563EB', '#06B6D4', '#7C3AED',
  '#E11D48', '#F59E0B', '#059669', '#EC4899', '#93C5FD', '#A5B4FC', '#67E8F9', '#FDE68A'];

const EL = [
  { d: 'M24 40C24 40 8 30 8 20a8 8 0 0 1 16-4 8 8 0 0 1 16 4c0 10-16 20-16 20z', sw: 2.4 },
  { d: 'M10 10h28v28H10z', sw: 2 },
  { d: 'M24 8 40 24 24 40 8 24z', sw: 2 },
  { d: 'M8 24h32M24 8v32', sw: 2 },
  { d: 'M8 30c6-14 12-14 16 0s10 14 16 0', sw: 2 },
  { d: 'M12 12h24v24H12zM12 20h24M20 12v24', sw: 2 },
  { d: 'M24 6l5 12 13 1-10 8 3 13-11-7-11 7 3-13-10-8 13-1z', sw: 2 },
  { d: 'M10 34c8 0 8-20 14-20s6 20 14 20', sw: 2 },
  { d: 'M14 12h20v24a4 4 0 0 1-4 4H18a4 4 0 0 1-4-4z', sw: 2 },
  { d: 'M24 10a14 14 0 1 0 .01 0M18 24h12', sw: 2 },
  { d: 'M8 18h32v12H8zM8 24h32', sw: 2 },
  { d: 'M12 36V16l12-6 12 6v20', sw: 2 },
];

const chip = (on: boolean) =>
  `white-space:nowrap;padding:7px 12px;border-radius:999px;border:1px solid ${on ? '#0B1220' : '#E6EAF2'};` +
  `background:${on ? '#0B1220' : '#FFFFFF'};color:${on ? '#FFFFFF' : '#46536A'};font-size:12px;` +
  `font-weight:${on ? 700 : 500};cursor:pointer;`;

/** Som de papel virando, do design (WebAudio, sem arquivo). */
function tocarPapel(ref: React.MutableRefObject<AudioContext | null>) {
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ref.current = ref.current ?? new AC();
    const ac = ref.current;
    if (ac.state === 'suspended') void ac.resume();

    const dur = 0.55, sr = ac.sampleRate, len = Math.floor(sr * dur);
    const buf = ac.createBuffer(1, len, sr);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const t = i / len;
      const burst =
        Math.exp(-Math.pow((t - 0.12) / 0.14, 2)) + 0.7 * Math.exp(-Math.pow((t - 0.55) / 0.2, 2));
      d[i] = (Math.random() * 2 - 1) * burst * 0.5;
    }
    const src = ac.createBufferSource(); src.buffer = buf;
    const hp = ac.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1400;
    const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 3600; bp.Q.value = 0.6;
    const g = ac.createGain(); g.gain.value = 0.18;
    src.connect(hp); hp.connect(bp); bp.connect(g); g.connect(ac.destination);
    src.start();
  } catch {
    // sem áudio disponível: a virada continua funcionando
  }
}

export type Rotas = {
  hrefProjetos: string;
  hrefPreview: string;
  hrefRevisao: string;
};

export function useEditorDesign({
  fotos,
  titulo,
  rotas,
}: {
  fotos: Foto[];
  titulo: string;
  rotas: Rotas;
}) {
  const [s, setS] = useState<EstadoEditor>({
    hover: null, spread: 5, spreadLay: [0, 3, 5, 1, 6, 3, 2, 5, 4, 7], turning: null,
    tool: 0, panel: true, insp: false, modal: null, zoom: 64, sel: null,
    count: 0, lay: 2, photoTab: 1, bgTab: 0, bgCat: 0, elCat: 0, bw: false,
  });

  const ac = useRef<AudioContext | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const set = useCallback((p: Partial<EstadoEditor>) => setS((a) => ({ ...a, ...p })), []);

  const irPara = useCallback(
    (destino: number) => {
      setS((a) => {
        if (a.turning || destino === a.spread || destino < 0 || destino > 9) return a;
        tocarPapel(ac);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => set({ turning: null, spread: destino }), 880);
        return { ...a, turning: destino > a.spread ? 'next' : 'prev', sel: null };
      });
    },
    [set],
  );

  const v = useMemo(() => {
    const lista = (rotulos: string[], chave: keyof EstadoEditor, atual: number) =>
      rotulos.map((label, i) => ({
        label,
        style: chip(atual === i),
        pick: () => set({ [chave]: i } as Partial<EstadoEditor>),
      }));

    const curLay = s.spreadLay[s.spread] ?? s.lay;
    const total = (LAYOUTS[curLay] ?? LAYOUTS[0]).cells;
    const split = { left: Math.ceil(total / 2), right: Math.max(1, Math.floor(total / 2)) };

    /** Foto da galeria para o quadro n; volta ao início quando acabam. */
    const fotoDe = (n: number): Foto | undefined =>
      fotos.length ? fotos[n % fotos.length] : undefined;

    const fundoQuadro = (n: number) => {
      const f = fotoDe(n);
      return f
        ? `background-image:url('${f.url}');background-size:cover;background-position:center;`
        : 'background:linear-gradient(140deg,#DCE6FA,#EAF0FF);';
    };

    const gridDe = (k: number) => {
      const cols = k <= 1 ? 1 : k === 2 ? 1 : k <= 4 ? 2 : k <= 6 ? 2 : 3;
      return { cols, rows: Math.ceil(k / cols) };
    };
    const estiloGrid = (k: number) => {
      const g = gridDe(k);
      return `position:absolute;top:7%;left:8%;right:8%;bottom:34px;display:grid;` +
        `grid-template-columns:repeat(${g.cols}, minmax(0, 1fr));` +
        `grid-template-rows:repeat(${g.rows}, minmax(0, 1fr));gap:${k > 4 ? 7 : 11}px`;
    };

    const miniCells = (i: number, on: boolean) => {
      const n = (LAYOUTS[i] ?? LAYOUTS[0]).cells;
      const metade = Math.ceil(n / 2);
      const cols = metade <= 1 ? 1 : metade === 2 ? 1 : metade <= 4 ? 2 : 3;
      return {
        grid: `flex:1;display:grid;grid-template-columns:repeat(${cols}, minmax(0, 1fr));` +
          `grid-template-rows:repeat(${Math.ceil(metade / cols)}, minmax(0, 1fr));gap:1.5px;` +
          `padding:4px;background:linear-gradient(140deg,#DCE6FA,#EAF0FF)`,
        cells: Array.from({ length: metade }, () => ({
          style: `border-radius:1.5px;background:${on ? '#5C8FF6' : '#AFC6F7'}`,
        })),
      };
    };

    const layouts = LAYOUTS.map((l, i) => ({ l, i }))
      .filter(({ l }) => s.count === 0 || l.n === s.count)
      .map(({ l, i }) => {
        const on = curLay === i;
        return {
          title: l.n + (l.n === 1 ? ' foto na lâmina' : ' fotos na lâmina — divididas entre as duas páginas'),
          style: `flex:0 0 auto;width:54px;height:30px;padding:3px;border-radius:9px;` +
            `border:${on ? '2px solid #2563EB' : '1px solid #E6EAF2'};background:#FFFFFF;cursor:pointer;` +
            (on ? 'box-shadow:0 4px 12px rgba(37,99,235,.2);' : ''),
          grid: `display:grid;grid-template-columns:${l.grid};grid-template-rows:${l.rows};gap:2px;width:100%;height:100%`,
          cells: Array.from({ length: l.cells }, (_, k) => ({
            style: `border-radius:2px;background:${on ? '#93B4FB' : '#DCE6FA'};` +
              (l.span && k === 0 ? 'grid-row:1 / 3;' : ''),
          })),
          pick: () =>
            setS((a) => {
              const arr = a.spreadLay.slice();
              arr[a.spread] = i;
              return { ...a, spreadLay: arr, lay: i };
            }),
        };
      });

    const counts = ['Todos', '1', '2', '3', '4', '5', '6', '7', '8', '9'].map((label, i) => {
      const on = s.count === i;
      return {
        label,
        style: `min-width:${i === 0 ? '52px' : '28px'};height:28px;padding:0 ${i === 0 ? 12 : 8}px;` +
          `display:flex;align-items:center;justify-content:center;border-radius:999px;font-size:12px;` +
          `font-weight:${on ? 700 : 600};cursor:pointer;background:${on ? '#0B1220' : 'transparent'};` +
          `color:${on ? '#FFFFFF' : '#6B7A90'}`,
        pick: () => set({ count: i }),
      };
    });

    // O painel do design tinha 12 gradientes; aqui são as fotos reais da galeria.
    const photos = fotos.map((f, i) => ({
      style: `position:relative;aspect-ratio:3 / 4;border-radius:10px;` +
        `background-image:url('${f.url}');background-size:cover;background-position:center;` +
        `cursor:grab;transition:box-shadow .15s, transform .15s;` +
        (s.hover === i ? 'box-shadow:0 0 0 2px #2563EB;transform:scale(1.04);' : ''),
      enter: () => set({ hover: i }),
      leave: () => setS((a) => (a.hover === i ? { ...a, hover: null } : a)),
    }));

    const fotoHover = s.hover === null ? fotos[0] : fotos[s.hover];

    const painelW = 'clamp(240px, 24vw, 316px)';

    const v: Record<string, unknown> = {
      ...rotas,

      zoomLabel: s.zoom + '%',
      counts, layouts, photos,

      photoTabs: lista(['Todas', 'Não usadas', 'Favoritas', 'Verticais', 'Horizontais'], 'photoTab', s.photoTab),
      bgTabs: lista(['Texturas', 'Cores', 'Gradientes'], 'bgTab', s.bgTab),
      bgCats: lista(['Suaves', 'Matelassê', 'Arabescos', 'Geométricos', 'Delicados'], 'bgCat', s.bgCat),
      elCats: lista(['Todos', 'Molduras', 'Florais', 'Fitas', 'Selos', 'Formas', 'Linhas'], 'elCat', s.elCat),

      bgSwatches: BG_SW.map((c, i) => ({
        style: `aspect-ratio:1 / 1;border-radius:10px;background:${c};` +
          `border:${i === 0 ? '2px solid #2563EB' : '1px solid #E6EAF2'};cursor:pointer`,
        pick: () => {},
      })),
      colorChips: CHIPS.map((c) => ({
        style: `aspect-ratio:1 / 1;border-radius:7px;background:${c};border:1px solid rgba(11,18,32,.1);cursor:pointer`,
      })),
      elements: EL,

      sliders: [
        { label: 'Brilho', value: '+4', pct: 56, active: true },
        { label: 'Contraste', value: '0', pct: 50, active: false },
        { label: 'Saturação', value: '-6', pct: 44, active: false },
      ].map((x) => ({
        label: x.label,
        value: x.value,
        fill: `width:${x.pct}%;height:100%;border-radius:999px;` +
          `background:${x.active ? 'linear-gradient(90deg,#2563EB,#06B6D4)' : '#CBD5E6'}`,
        knob: `position:absolute;left:${x.pct}%;top:50%;transform:translate(-50%,-50%);width:15px;` +
          `height:15px;border-radius:999px;background:#FFFFFF;border:2px solid #2563EB;` +
          `box-shadow:0 2px 5px rgba(11,18,32,.18)`,
      })),

      spreads: ROTULOS_LAMINA.map((label, i) => {
        const on = i === s.spread;
        const li = s.spreadLay[i] ?? 0;
        const mini = miniCells(li, on);
        const n = (LAYOUTS[li] ?? LAYOUTS[0]).n;
        return {
          label,
          grid: mini.grid,
          cells: mini.cells,
          layText: n + (n === 1 ? ' foto' : ' fotos'),
          layLabel: `font-size:9.5px;font-weight:600;color:${on ? '#2563EB' : '#B5C0D0'};text-align:center`,
          cls: 'om-pagethumb',
          style: `position:relative;width:96px;height:52px;border-radius:8px;background:#FFFFFF;` +
            `border:${on ? '2px solid #2563EB' : '1px solid #E6EAF2'};display:flex;overflow:hidden;` +
            (on ? 'box-shadow:0 6px 14px rgba(37,99,235,.2);' : ''),
          labelStyle: `font-size:10.5px;font-weight:${on ? 700 : 500};color:${on ? '#2563EB' : '#9AA7BC'};text-align:center`,
          badge: on
            ? 'display:none'
            : `position:absolute;top:4px;right:4px;width:9px;height:9px;border-radius:999px;background:#10B981`,
          pick: () => irPara(i),
        };
      }),

      previewStyle:
        s.panel && s.tool === 0 && s.hover !== null
          ? 'position:fixed;top:78px;left:calc(76px + clamp(240px, 24vw, 316px) + 14px);width:min(280px, 26vw);' +
            'max-height:calc(100vh - 100px);display:flex;flex-direction:column;z-index:40;background:#FFFFFF;' +
            'border:1px solid #E6EAF2;border-radius:14px;overflow:hidden;box-shadow:0 24px 50px rgba(11,18,32,.24);' +
            'pointer-events:none;animation:menuIn .14s ease both'
          : 'display:none',
      previewImg: fotoHover
        ? `width:100%;flex:1 1 auto;min-height:0;aspect-ratio:3 / 4;background-image:url('${fotoHover.url}');background-size:cover;background-position:center`
        : 'display:none',
      previewName: fotoHover
        ? (fotoHover.storage_path.split('/').pop() ?? 'foto')
        : 'sem foto',

      panelStyle: s.panel
        ? `width:${painelW};flex:0 0 auto;min-width:0;display:flex;flex-direction:column;min-height:0;` +
          `background:#FFFFFF;border-right:1px solid #E6EAF2;animation:menuIn .18s ease both`
        : 'display:none',
      panelHandle: s.panel
        ? 'display:none'
        : 'width:20px;flex:0 0 auto;align-self:center;height:78px;margin-left:-1px;display:flex;' +
          'align-items:center;justify-content:center;border-radius:0 12px 12px 0;background:#FFFFFF;' +
          'border:1px solid #E6EAF2;border-left:0;color:#6B7A90;cursor:pointer;box-shadow:4px 0 12px rgba(11,18,32,.06);z-index:3',
      togglePanel: () => set({ panel: !s.panel }),
      railToggle: 'width:56px;height:44px;display:flex;align-items:center;justify-content:center;' +
        'border-radius:13px;background:#F4F7FC;border:1px solid #E6EAF2;color:#46536A;cursor:pointer',
      railArrow: s.panel ? 'M14 6l-6 6 6 6' : 'M10 6l6 6-6 6',

      inspectorStyle: s.insp
        ? 'width:clamp(238px, 23vw, 306px);flex:0 0 auto;min-width:0;display:flex;flex-direction:column;' +
          'min-height:0;background:#FFFFFF;border-left:1px solid #E6EAF2;animation:menuInR .18s ease both'
        : 'display:none',
      inspHandle: s.insp
        ? 'display:none'
        : 'width:20px;flex:0 0 auto;align-self:center;height:78px;margin-right:-1px;display:flex;' +
          'align-items:center;justify-content:center;border-radius:12px 0 0 12px;background:#FFFFFF;' +
          'border:1px solid #E6EAF2;border-right:0;color:#6B7A90;cursor:pointer;box-shadow:-4px 0 12px rgba(11,18,32,.06);z-index:3',
      toggleInsp: () => set({ insp: !s.insp }),

      inspTitle: s.sel === 'texto' ? 'Texto selecionado' : s.sel ? 'Foto selecionada' : 'Inspetor',
      inspTag:
        s.sel === 'texto'
          ? 'Título'
          : s.sel
            ? (fotos[0]?.storage_path.split('/').pop() ?? 'foto')
            : 'lâmina ' + (s.spread + 1),
      spreadTitle:
        s.spread === 0
          ? 'Capa · frente e verso'
          : `Lâmina ${s.spread + 1} · páginas ${s.spread * 2 - 1} e ${s.spread * 2}`,
      spreadNav: `Lâmina ${s.spread + 1} de 10`,
      inspEmpty: s.sel ? 'display:none' : 'display:flex;flex-direction:column;align-items:center;gap:10px;padding:34px 22px',
      inspBody: s.sel ? 'display:block' : 'display:none',

      pageGrid: estiloGrid(split.left),
      pageFrames: Array.from({ length: Math.max(0, split.left - 1) }, (_, k) => ({
        style: `border-radius:2px;${fundoQuadro(k + 1)}cursor:pointer`,
      })),
      rightGrid: estiloGrid(split.right),
      rightFrames: Array.from({ length: split.right }, (_, k) => {
        const vazio = k === split.right - 1 && split.right > 1;
        return {
          style: vazio
            ? 'border-radius:2px;border:1.5px dashed #CBD5E6;background:#F8FAFE;display:flex;' +
              'align-items:center;justify-content:center;color:#9AA7BC;overflow:hidden;cursor:pointer'
            : `border-radius:2px;${fundoQuadro(k + split.left)}cursor:pointer`,
          iconStyle: vazio ? 'flex:0 0 auto' : 'display:none',
        };
      }),

      selectFrame: () => set({ sel: 'foto', insp: true }),
      selectText: () => set({ sel: 'texto', insp: true }),
      frameA: `position:relative;border-radius:2px;${fundoQuadro(0)}cursor:pointer;` +
        (s.sel === 'foto' ? 'box-shadow:0 0 0 2px #2563EB;' : ''),
      faceBox: `display:${s.sel === 'foto' ? 'block' : 'none'};position:absolute;top:16%;left:20%;` +
        `width:36%;height:40%;border:1.5px solid rgba(255,255,255,.9);border-radius:5px`,
      faceTag: `display:${s.sel === 'foto' ? 'block' : 'none'};position:absolute;top:6px;left:6px;` +
        `max-width:calc(100% - 12px);overflow:hidden;text-overflow:ellipsis;padding:3px 7px;` +
        `border-radius:6px;background:rgba(11,18,32,.68);color:#FFFFFF;font-size:10px;font-weight:700;white-space:nowrap`,
      floatBar: `display:${s.sel ? 'flex' : 'none'};position:absolute;left:50%;bottom:50px;` +
        `transform:translateX(-50%);z-index:30;align-items:center;gap:3px;padding:5px;border-radius:12px;` +
        `background:#FFFFFF;border:1px solid #E6EAF2;box-shadow:0 10px 24px rgba(11,18,32,.14);white-space:nowrap`,
      bwTrack: `width:40px;height:24px;border-radius:999px;background:${s.bw ? '#2563EB' : '#E6EAF2'};` +
        `padding:3px;display:flex;justify-content:${s.bw ? 'flex-end' : 'flex-start'};cursor:pointer;flex:0 0 auto`,
      toggleBw: () => set({ bw: !s.bw }),

      goNext: () => irPara(s.spread + 1),
      goPrev: () => irPara(s.spread - 1),
      turnSheet: s.turning
        ? `position:absolute;top:0;bottom:0;` +
          (s.turning === 'next' ? 'left:50%;transform-origin:left center;' : 'left:0;transform-origin:right center;') +
          `width:50%;z-index:20;transform-style:preserve-3d;pointer-events:none;` +
          `animation:${s.turning === 'next' ? 'flipNext' : 'flipPrev'} 880ms cubic-bezier(.56,.08,.18,.96) both`
        : 'display:none',
      turnFront: 'position:absolute;inset:0;backface-visibility:hidden;overflow:hidden;' +
        'background:linear-gradient(90deg,#FFFFFF,#FFFEFB);box-shadow:-10px 0 25px rgba(0,0,0,.12)',
      turnBack: 'position:absolute;inset:0;backface-visibility:hidden;overflow:hidden;' +
        'background:linear-gradient(270deg,#FFFFFF,#FFFEFB);box-shadow:10px 0 25px rgba(0,0,0,.12);' +
        `transform:rotateY(${s.turning === 'prev' ? '-180deg' : '180deg'})`,
      stageStyle: 'flex:1 1 auto;min-height:150px;width:100%;display:flex;align-items:center;' +
        'justify-content:center;perspective:2200px',
      bookStyle: `position:relative;height:100%;max-height:min(100%, ${Math.round((440 * s.zoom) / 64)}px);` +
        `aspect-ratio:2.04 / 1;max-width:min(100%, ${Math.round((900 * s.zoom) / 64)}px);` +
        `filter:drop-shadow(0 24px 34px rgba(30,45,75,.18));transition:max-height .2s ease`,

      layPrev: () => document.querySelector('.om-laycar')?.scrollBy({ left: -190, behavior: 'smooth' }),
      layNext: () => document.querySelector('.om-laycar')?.scrollBy({ left: 190, behavior: 'smooth' }),
      zoomIn: () => set({ zoom: Math.min(160, s.zoom + 12) }),
      zoomOut: () => set({ zoom: Math.max(28, s.zoom - 12) }),
      openModal: () => set({ modal: 1 }),
      closeModal: () => set({ modal: null }),
      ov: `position:fixed;inset:0;background:rgba(11,18,32,.5);z-index:60;${s.modal ? '' : 'display:none'}`,
      sh: `position:fixed;inset:0;z-index:61;display:flex;align-items:center;justify-content:center;` +
        `padding:24px;pointer-events:none;${s.modal ? '' : 'display:none'}`,

      titulo,
    };

    for (let i = 0; i < 5; i++) {
      const on = s.tool === i;
      v['tool' + i] =
        'width:60px;height:58px;display:flex;flex-direction:column;align-items:center;' +
        'justify-content:center;gap:4px;border-radius:14px;cursor:pointer;transition:all .15s;' +
        (on
          ? 'background:linear-gradient(135deg,#2563EB,#06B6D4);color:#FFFFFF;box-shadow:0 8px 16px rgba(37,99,235,.24);'
          : 'background:transparent;color:#46536A;');
      v['setTool' + i] = () => set({ tool: i, panel: true });
      v['p' + i] = s.tool === i ? 'flex:1 1 auto;min-height:0;display:flex;flex-direction:column' : 'display:none';
    }

    const POS = ['top:-6px;left:-6px', 'top:-6px;right:-6px', 'bottom:-6px;left:-6px', 'bottom:-6px;right:-6px'];
    for (let i = 1; i <= 4; i++) {
      v['h' + i] =
        (s.sel === 'foto' ? '' : 'display:none;') +
        `position:absolute;width:11px;height:11px;border-radius:3px;background:#FFFFFF;` +
        `border:1.5px solid #2563EB;${POS[i - 1]};z-index:9`;
    }

    return v;
  }, [s, fotos, titulo, rotas, set, irPara]);

  return v;
}
