'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Foto } from '@/lib/data';
import { calcularPreco, reais, type PrecoModelo } from '@/lib/preco';

/**
 * Porte da classe `Component extends DCLogic` de `Cliente Editor.dc.html`.
 *
 * Mantém os mesmos nomes, os mesmos valores calculados e as mesmas strings de
 * estilo do design. O que muda é a origem dos dados: onde o design usava
 * gradientes de mentira, aqui entram as fotos reais da galeria.
 */

export type EstadoEditor = {
  hover: number | null;
  turning: 'next' | 'prev' | null;
  tool: number;
  panel: boolean;
  insp: boolean;
  modal: number | null;
  zoom: number;
  count: number;
  lay: number;
  photoTab: number;
  bgTab: number;
  bgCat: number;
  elCat: number;
  bw: boolean;
};

// O catálogo de layouts virou `src/lib/layouts.ts`, compartilhado com a página
// e a miniatura. Havia quatro modelos incompatíveis aqui — era por isso que o
// botão mostrava três colunas e a página entregava duas empilhadas mais uma
// inteira.

/** Rótulo da lâmina: a primeira é a capa, as demais são o par de páginas. */
const rotuloLamina = (i: number) => (i === 0 ? 'Capa' : `${i * 2 - 1}–${i * 2}`);

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

import { LAYOUTS as CATALOGO, contagens, layout as layoutPorId } from '@/lib/layouts';
import { curvaturaPagina, luzPagina, estiloPalco, estiloLivro, limitarZoom, ZOOM_PASSO, ZOOM_PADRAO } from '@/lib/livro';
import type { Documento, Lado } from '@/components/editor/useDocumento';
import type { Pagina, QuadroFoto } from '@/lib/album';
import { imagemCss } from '@/lib/imagem';

/** Serializa um objeto de estilo para a string que o markup do design espera. */
function estilo(o: React.CSSProperties): string {
  return Object.entries(o)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase())}:${typeof v === 'number' && !/^(zIndex|opacity|flex|order|fontWeight|lineHeight)$/.test(k) ? v + 'px' : v}`)
    .join(';');
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
  doc,
  modelo,
  laminas,
  fotosUsadas,
  bloqueadores,
  onTitulo,
}: {
  fotos: Foto[];
  titulo: string;
  rotas: Rotas;
  /** O documento do álbum. Sem ele o editor não tem onde escrever. */
  doc: Documento;
  /** Preço vigente do modelo do álbum; nulo esconde o orçamento. */
  modelo?: PrecoModelo | null;
  /** Lâminas e fotos do projeto, para calcular o valor. */
  laminas: number;
  fotosUsadas: number;
  /** Lâminas com quadro vazio: travam a finalização. */
  bloqueadores: number;
  onTitulo?: (t: string) => void;
}) {
  const [s, setS] = useState<EstadoEditor>({
    hover: null, turning: null,
    tool: 0, panel: true, insp: false, modal: null, zoom: ZOOM_PADRAO,
    count: 0, lay: 2, photoTab: 1, bgTab: 0, bgCat: 0, elCat: 0, bw: false,
  });

  const ac = useRef<AudioContext | null>(null);
  // Espelho do estado para os ouvintes de evento, que são registrados uma vez
  // e capturariam o `s` da primeira renderização.
  const sRef = useRef(s);
  sRef.current = s;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const set = useCallback((p: Partial<EstadoEditor>) => setS((a) => ({ ...a, ...p })), []);

  const totalLaminas = doc.laminas.length;
  const laminaAtual = doc.atual;
  const limparSelecao = useCallback(() => doc.setSelecao(null), [doc]);
  const irParaLamina = doc.setAtual;
  const irPara = useCallback(
    (destino: number) => {
      setS((a) => {
        // O limite era 9 fixo, do storyboard de dez posições do design.
        if (a.turning || destino === laminaAtual || destino < 0 || destino >= totalLaminas) return a;
        tocarPapel(ac);
        if (timer.current) clearTimeout(timer.current);
        // A lâmina só muda no fim da animação; até lá a folha que vira mostra
        // a página que sai numa face e a que chega na outra.
        timer.current = setTimeout(() => {
          set({ turning: null });
          irParaLamina(destino);
        }, 880);
        limparSelecao();
        return { ...a, turning: destino > laminaAtual ? 'next' : 'prev' };
      });
    },
    [set, totalLaminas, laminaAtual, irParaLamina, limparSelecao],
  );

  // Selecionar abre o inspetor. Antes o painel ficava recolhido e o cliente
  // precisava descobrir a abinha na borda para ver que havia o que editar.
  useEffect(() => {
    if (doc.selecao) set({ insp: true });
  }, [doc.selecao, set]);

  // --- teclado: setas viram página, +/- dão zoom ---------------------------
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement | null;
      if (alvo && /^(INPUT|TEXTAREA|SELECT)$/.test(alvo.tagName)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); irPara(doc.atual + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); irPara(doc.atual - 1); }
      else if (e.key === '+' || e.key === '=') { e.preventDefault(); set({ zoom: limitarZoom(sRef.current.zoom + ZOOM_PASSO) }); }
      else if (e.key === '-' || e.key === '_') { e.preventDefault(); set({ zoom: limitarZoom(sRef.current.zoom - ZOOM_PASSO) }); }
      else if (e.key === 'Escape') doc.setSelecao(null);
      else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (doc.selecao) { e.preventDefault(); doc.limparQuadro(); }
      }
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [irPara, set, doc]);

  const v = useMemo(() => {
    const lista = (rotulos: string[], chave: keyof EstadoEditor, atual: number) =>
      rotulos.map((label, i) => ({
        label,
        style: chip(atual === i),
        pick: () => set({ [chave]: i } as Partial<EstadoEditor>),
      }));

    const lamina = doc.lamina;
    const porId = new Map(fotos.map((f) => [f.id, f]));

    // O que está selecionado, segundo o documento — não segundo um segundo
    // estado paralelo que ninguém mantinha em dia.
    const qSel = doc.quadroSelecionado;
    const selTipo: 'foto' | 'texto' | null = doc.selecao
      ? (qSel ? 'foto' : 'texto')
      : null;
    const fotoSel = qSel?.fotoId ? porId.get(qSel.fotoId) : undefined;

    /**
     * Retângulo do layout, como string de estilo absoluto.
     *
     * Miniatura, seletor e página chamam ESTA função. É a garantia mecânica de
     * que o desenho do botão é o desenho da página: não há segunda conta que
     * possa divergir.
     */
    const ret = (r: { x: number; y: number; w: number; h: number }, escalaX = 1, deslocaX = 0) =>
      `position:absolute;left:${(r.x * escalaX + deslocaX).toFixed(3)}%;top:${r.y}%;` +
      `width:${(r.w * escalaX).toFixed(3)}%;height:${r.h}%`;

    /**
     * Caixa do quadro de foto: recorta (`overflow:hidden`) o `<img>` que mora
     * dentro. O quadro vazio ganha o tracejado; a foto entra pelo `<img>`.
     */
    const quadroEstilo = (q: QuadroFoto, r: { x: number; y: number; w: number; h: number }, sel: boolean) => {
      const cheio = q.fotoId && porId.has(q.fotoId);
      return (
        ret(r) +
        `;border-radius:2px;overflow:hidden;cursor:pointer;` +
        (cheio
          ? ''
          : // Quadro vazio agora é vazio de verdade. Antes, `fotos[n % fotos.length]`
            // preenchia tudo com fotos que não estavam no documento.
            `background:#F8FAFE;border:1.5px dashed #CBD5E6;display:flex;align-items:center;` +
            `justify-content:center;color:#9AA7BC;`) +
        (sel ? 'box-shadow:0 0 0 2px #2563EB, 0 6px 18px rgba(37,99,235,.28);' : '')
      );
    };

    /** `<img>` do quadro: fonte e estilo (enquadramento + ajustes de cor). */
    const quadroImg = (q: QuadroFoto): { src: string | undefined; imgStyle: string } => {
      const f = q.fotoId ? porId.get(q.fotoId) : undefined;
      return f
        ? { src: f.url, imgStyle: imagemCss(q.enq, q.ajustes) }
        : { src: undefined, imgStyle: 'display:none' };
    };

    const SEM_IMG = { src: undefined as string | undefined, imgStyle: 'display:none' };

    /** Quadros de uma página, prontos para o markup. */
    const framesDe = (pagina: Pagina, lado: Lado) =>
      doc.quadrosDe(pagina).map(({ q, ret: r }) => {
        const sel = doc.selecao?.quadro === q.id;
        const img = q.tipo === 'foto' ? quadroImg(q) : SEM_IMG;
        return {
          id: q.id,
          vazio: q.tipo === 'foto' && !q.fotoId,
          style: q.tipo === 'foto' && r ? quadroEstilo(q, r, sel) : 'display:none',
          src: img.src,
          imgStyle: img.imgStyle,
          iconStyle: q.tipo === 'foto' && !q.fotoId ? 'opacity:.6' : 'display:none',
          onClick: () => doc.setSelecao({ lamina: doc.atual, lado, quadro: q.id }),
        };
      });

    /** Botão do enquadramento: mesma caixa do design, marcada quando ativo. */
    const botaoEnq = (ativo: boolean) =>
      `height:38px;display:flex;align-items:center;justify-content:center;gap:7px;` +
      `border:1px solid ${ativo ? '#2563EB' : '#E6EAF2'};border-radius:10px;` +
      `background:${ativo ? '#F1F5FD' : '#FFFFFF'};color:${ativo ? '#2563EB' : '#46536A'};` +
      `font-size:12px;font-weight:${ativo ? 700 : 600};cursor:pointer`;

    const framesEsq = framesDe(lamina.esquerda, 'esquerda');
    const framesDir = framesDe(lamina.direita, 'direita');

    // O lado que o seletor altera: o da seleção, ou os dois quando nada está
    // selecionado. Antes trocava um índice global que a página nem lia.
    const ladoAlvo: Lado | 'ambos' = doc.selecao?.lado ?? 'ambos';
    const layoutAtual =
      ladoAlvo === 'ambos' ? lamina.esquerda.layoutId : lamina[ladoAlvo].layoutId;

    const layouts = CATALOGO.filter((l) => s.count === 0 || l.n === s.count).map((l) => {
      const on = layoutAtual === l.id;
      return {
        title: `${l.nome} — ${l.n} ${l.n === 1 ? 'foto' : 'fotos'} por página`,
        style: `flex:0 0 auto;width:54px;height:30px;padding:3px;border-radius:9px;` +
          `border:${on ? '2px solid #2563EB' : '1px solid #E6EAF2'};background:#FFFFFF;cursor:pointer;` +
          (on ? 'box-shadow:0 4px 12px rgba(37,99,235,.2);' : ''),
        // Mesma função de retângulo da página: o botão não pode divergir.
        grid: 'position:relative;width:100%;height:100%;border-radius:4px;background:#FFFFFF',
        cells: l.quadros.map((r) => ({
          style: ret(r) + `;border-radius:1.5px;background:${on ? '#93B4FB' : '#DCE6FA'}`,
        })),
        pick: () => doc.trocarLayout(l.id, ladoAlvo),
      };
    });

    const counts = ['Todos', ...contagens().map(String)].map((label, i) => {
      const n = i === 0 ? 0 : Number(label);
      const on = s.count === n;
      return {
        label,
        style: `min-width:${i === 0 ? '52px' : '28px'};height:28px;padding:0 ${i === 0 ? 12 : 8}px;` +
          `display:flex;align-items:center;justify-content:center;border-radius:999px;font-size:12px;` +
          `font-weight:${on ? 700 : 600};cursor:pointer;background:${on ? '#0B1220' : 'transparent'};` +
          `color:${on ? '#FFFFFF' : '#6B7A90'}`,
        pick: () => set({ count: n }),
      };
    });

    // O painel do design tinha 12 gradientes; aqui são as fotos reais da galeria.
    const photos = fotos.map((f, i) => ({
      style: `position:relative;aspect-ratio:3 / 4;border-radius:10px;` +
        `background-image:url('${f.url}');background-size:cover;background-position:center;` +
        `cursor:grab;transition:box-shadow .15s, transform .15s;` +
        (s.hover === i ? 'box-shadow:0 0 0 2px #2563EB;transform:scale(1.04);' : '') +
        (doc.usadas.has(f.id) ? 'outline:3px solid #10B981;outline-offset:-3px;' : ''),
      enter: () => set({ hover: i }),
      leave: () => setS((a) => (a.hover === i ? { ...a, hover: null } : a)),
      // Clicar coloca a foto no quadro selecionado; sem seleção, no primeiro
      // quadro vazio da lâmina. Antes o painel só tinha `hover`: a única forma
      // de usar uma foto era arrastar, e nem o arrasto gravava.
      pick: () => doc.definirFoto(f.id),
      title: doc.selecao
        ? 'Colocar no quadro selecionado'
        : doc.usadas.has(f.id)
          ? 'Já usada — clique para pôr no próximo quadro vazio'
          : 'Clique para pôr no próximo quadro vazio',
    }));

    const fotoHover = s.hover === null ? fotos[0] : fotos[s.hover];

    const painelW = 'clamp(240px, 24vw, 316px)';

    const conta = calcularPreco(modelo, { paginas: laminas * 2, fotos: fotosUsadas });
    const detalhe = [
      conta.paginasExtras > 0 &&
        `${conta.paginasExtras} pág. extra${conta.paginasExtras === 1 ? '' : 's'}`,
      conta.fotosExtras > 0 && `${conta.fotosExtras} foto${conta.fotosExtras === 1 ? '' : 's'} extra`,
    ]
      .filter(Boolean)
      .join(' · ');

    const orcamento = modelo ? (
      <span
        title={detalhe || 'Valor do álbum'}
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: '6px',
          padding: '5px 11px',
          borderRadius: '999px',
          background: '#EAF0FF',
          color: '#2563EB',
          fontSize: '11.5px',
          fontWeight: 700,
          flex: '0 0 auto',
          whiteSpace: 'nowrap',
        }}
      >
        {reais(conta.total)}
        {detalhe && <span style={{ fontWeight: 500, opacity: 0.75 }}>{detalhe}</span>}
      </span>
    ) : null;

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

      // Eram três valores literais (+4, 0, −6) sem nenhum manipulador: o
      // slider desenhava, não ajustava nada.
      sliders: ([
        { label: 'Brilho', campo: 'brilho' as const },
        { label: 'Contraste', campo: 'contraste' as const },
        { label: 'Saturação', campo: 'saturacao' as const },
      ]).map((c) => {
        const bruto = qSel?.ajustes[c.campo] ?? 0;
        const x = {
          label: c.label,
          value: (bruto > 0 ? '+' : '') + bruto,
          pct: (bruto + 100) / 2,   // −100..100 → 0..100
          active: bruto !== 0,
        };
        return {
        min: -100,
        max: 100,
        raw: bruto,
        set: (e: React.ChangeEvent<HTMLInputElement>) =>
          doc.mudarAjustes({ [c.campo]: Number(e.target.value) }),
        label: x.label,
        value: x.value,
        fill: `width:${x.pct}%;height:100%;border-radius:999px;` +
          `background:${x.active ? 'linear-gradient(90deg,#2563EB,#06B6D4)' : '#CBD5E6'}`,
        knob: `position:absolute;left:${x.pct}%;top:50%;transform:translate(-50%,-50%);width:15px;` +
          `height:15px;border-radius:999px;background:#FFFFFF;border:2px solid #2563EB;` +
          `box-shadow:0 2px 5px rgba(11,18,32,.18)`,
        };
      }),

      /* ------------------------ inspetor: enquadramento ------------------ */

      // O aviso de rosto era um retângulo fixo em 16%/20%/36%/40%: mentia em
      // toda foto. Sem análise de rosto (Fase 5) o bloco fica ESCONDIDO, que é
      // melhor que informar o que não se sabe.
      blocoRosto: 'display:none',
      textoRosto: '',
      corrigirRosto: () => {},
      manterRosto: () => {},

      enqPreencher: {
        style: botaoEnq(qSel?.enq.modo === 'preencher'),
        pick: () => doc.mudarEnq({ modo: 'preencher' }),
      },
      enqEncaixar: {
        style: botaoEnq(qSel?.enq.modo === 'encaixar'),
        pick: () => doc.mudarEnq({ modo: 'encaixar' }),
      },
      enqGirar: {
        style: botaoEnq(!!qSel && qSel.enq.rot % 360 !== 0),
        // Gira de 90 em 90, que é o que se espera de um botão sem campo.
        pick: () => doc.mudarEnq({ rot: ((qSel?.enq.rot ?? 0) + 90) % 360 }),
      },
      enqEspelhar: {
        style: botaoEnq(!!qSel?.enq.espelho),
        pick: () => doc.mudarEnq({ espelho: !qSel?.enq.espelho }),
      },

      zoomFoto: Math.round((qSel?.enq.escala ?? 1) * 100),
      setZoomFoto: (e: React.ChangeEvent<HTMLInputElement>) => {
        const n = Number(e.target.value);
        if (Number.isFinite(n)) doc.mudarEnq({ escala: Math.min(20, Math.max(0.05, n / 100)) });
      },
      rotFoto: Math.round(qSel?.enq.rot ?? 0),
      setRotFoto: (e: React.ChangeEvent<HTMLInputElement>) => {
        const n = Number(e.target.value);
        if (Number.isFinite(n)) doc.mudarEnq({ rot: Math.min(360, Math.max(-360, n)) });
      },

      // O storyboard vinha de dez rótulos fixos; agora sai do documento.
      spreads: doc.laminas.map((l, i) => {
        const on = i === laminaAtual;
        const esq = layoutPorId(l.esquerda.layoutId);
        const dir = layoutPorId(l.direita.layoutId);
        const n = esq.n + dir.n;
        const cheias = new Set(
          [...l.esquerda.quadros, ...l.direita.quadros]
            .filter((q) => q.tipo === 'foto' && q.fotoId)
            .map((q) => q.id),
        );
        // A miniatura mostra a lâmina inteira, com as duas páginas na mesma
        // escala da página renderizada — meia largura para cada.
        const cells = [
          ...esq.quadros.map((r, k) => ({
            style: ret(r, 0.5, 0) + `;border-radius:1.5px;background:${
              cheias.has(l.esquerda.quadros[k]?.id) ? (on ? '#5C8FF6' : '#AFC6F7') : '#E8EDF7'}`,
          })),
          ...dir.quadros.map((r, k) => ({
            style: ret(r, 0.5, 50) + `;border-radius:1.5px;background:${
              cheias.has(l.direita.quadros[k]?.id) ? (on ? '#5C8FF6' : '#AFC6F7') : '#E8EDF7'}`,
          })),
        ];
        return {
          label: rotuloLamina(i),
          grid: 'position:relative;flex:1;background:#FFFFFF',
          cells,
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

      inspTitle: selTipo === 'texto' ? 'Texto selecionado' : selTipo ? 'Foto selecionada' : 'Inspetor',
      inspTag:
        selTipo === 'texto'
          ? 'Título'
          : selTipo
            ? (fotos[0]?.storage_path.split('/').pop() ?? 'foto')
            : 'lâmina ' + (laminaAtual + 1),
      spreadTitle:
        laminaAtual === 0
          ? 'Capa · frente e verso'
          : `Lâmina ${laminaAtual + 1} · páginas ${laminaAtual * 2 - 1} e ${laminaAtual * 2}`,
      spreadNav: `Lâmina ${laminaAtual + 1} de ${doc.laminas.length}`,

      // Estes três botões existiam no design sem nenhuma ação ligada.
      addSpread: () => doc.adicionarLamina(),
      undo: () => doc.desfazer(),
      redo: () => doc.refazer(),
      undoStyle: `width:34px;height:34px;border-radius:9px;display:flex;align-items:center;` +
        `justify-content:center;color:${doc.podeDesfazer ? '#46536A' : '#C4CDDB'};` +
        `cursor:${doc.podeDesfazer ? 'pointer' : 'default'}`,
      redoStyle: `width:34px;height:34px;border-radius:9px;display:flex;align-items:center;` +
        `justify-content:center;color:${doc.podeRefazer ? '#46536A' : '#C4CDDB'};` +
        `cursor:${doc.podeRefazer ? 'pointer' : 'default'}`,
      inspEmpty: selTipo ? 'display:none' : 'display:flex;flex-direction:column;align-items:center;gap:10px;padding:34px 22px',
      inspBody: selTipo ? 'display:block' : 'display:none',

      // Os quadros posicionam-se sozinhos pelo retângulo do layout; o
      // contêiner deixa de ser grade. É o mesmo desenho do seletor.
      // A curvatura vai no CONTÊINER dos quadros: assim a foto inclina junto
      // com o papel, que é o que dá o efeito de livro real. O design curvava
      // só a camada de papel, por baixo, e as fotos ficavam num plano reto.
      pageGrid: 'position:absolute;inset:0;' + estilo(curvaturaPagina('esquerda')),
      pageLuz: estilo(luzPagina('esquerda')),
      // O markup do design desenha o primeiro quadro à parte (é o que carrega a
      // marcação de rosto), e mapeia o resto.
      pageFrames: framesEsq.slice(1),
      legendaEsquerda: lamina.esquerda.quadros.find((q) => q.tipo === 'texto')?.texto ?? '',
      legendaDireita: lamina.direita.quadros.find((q) => q.tipo === 'texto')?.texto ?? '',
      rightGrid: 'position:absolute;inset:0;' + estilo(curvaturaPagina('direita')),
      rightLuz: estilo(luzPagina('direita')),
      rightFrames: framesDir,

      // Curvatura e luz — o que faz a foto acompanhar a dobra do papel.
      pageSkew: estilo(curvaturaPagina('esquerda')),
      rightSkew: estilo(curvaturaPagina('direita')),
      pageLight: estilo(luzPagina('esquerda')),
      rightLight: estilo(luzPagina('direita')),

      // Clicar num quadro seleciona AQUELE quadro. Antes marcava um `sel`
      // genérico que não apontava para objeto nenhum — daí o inspetor não
      // conseguir editar a foto escolhida.
      selectFrame: framesEsq[0]?.onClick ?? (() => {}),
      selectText: () => {},
      frameA: framesEsq[0] ?? { style: 'display:none', onClick: () => {}, src: undefined, imgStyle: 'display:none' },
      // A marcação de rosto só aparece quando houver análise de verdade
      // (Fase 5). Um retângulo fixo em 16%/20% mentia sobre a foto.
      faceBox: 'display:none',
      faceTag: `display:none;position:absolute;top:6px;left:6px;` +
        `max-width:calc(100% - 12px);overflow:hidden;text-overflow:ellipsis;padding:3px 7px;` +
        `border-radius:6px;background:rgba(11,18,32,.68);color:#FFFFFF;font-size:10px;font-weight:700;white-space:nowrap`,
      floatBar: `display:${selTipo ? 'flex' : 'none'};position:absolute;left:50%;bottom:50px;` +
        `transform:translateX(-50%);z-index:30;align-items:center;gap:3px;padding:5px;border-radius:12px;` +
        `background:#FFFFFF;border:1px solid #E6EAF2;box-shadow:0 10px 24px rgba(11,18,32,.14);white-space:nowrap`,
      bwTrack: `width:40px;height:24px;border-radius:999px;background:${qSel?.ajustes.pb ? '#2563EB' : '#E6EAF2'};` +
        `padding:3px;display:flex;justify-content:${qSel?.ajustes.pb ? 'flex-end' : 'flex-start'};cursor:pointer;flex:0 0 auto`,
      // O botão animava, mas `s.bw` não era lido por ninguém.
      toggleBw: () => doc.mudarAjustes({ pb: !qSel?.ajustes.pb }),

      goNext: () => irPara(laminaAtual + 1),
      goPrev: () => irPara(laminaAtual - 1),
      turnSheet: s.turning
        ? `position:absolute;top:0;bottom:0;` +
          (s.turning === 'next' ? 'left:50%;transform-origin:left center;' : 'left:0;transform-origin:right center;') +
          `width:50%;z-index:20;transform-style:preserve-3d;pointer-events:none;` +
          `animation:${s.turning === 'next' ? 'flipNext' : 'flipPrev'} 880ms cubic-bezier(.56,.08,.18,.96) both`
        : 'display:none',
      // O design tinha dois retângulos chapados aqui — roxo/azul de um lado,
      // ciano do outro — que nunca foram ligados a nada. Era a "tela azul" no
      // meio da virada. Agora mostram a foto da página que sai e da que entra.
      // Quadros das duas faces: a página que sai e a que entra.
      turnFrontFrames: (() => {
        const alvo = s.turning === 'next' ? lamina.direita : lamina.esquerda;
        return doc.quadrosDe(alvo).map(({ q, ret: r }) => {
          const img = q.tipo === 'foto' ? quadroImg(q) : SEM_IMG;
          return {
            style: q.tipo === 'foto' && r ? quadroEstilo(q, r, false) : 'display:none',
            src: img.src,
            imgStyle: img.imgStyle,
          };
        });
      })(),
      turnBackFrames: (() => {
        const destino = s.turning === 'next' ? doc.laminas[laminaAtual + 1] : doc.laminas[laminaAtual - 1];
        const alvo = s.turning === 'next' ? destino?.esquerda : destino?.direita;
        if (!alvo) return [];
        return doc.quadrosDe(alvo).map(({ q, ret: r }) => {
          const img = q.tipo === 'foto' ? quadroImg(q) : SEM_IMG;
          return {
            style: q.tipo === 'foto' && r ? quadroEstilo(q, r, false) : 'display:none',
            src: img.src,
            imgStyle: img.imgStyle,
          };
        });
      })(),
      turnFrontFoto: (() => {
        const alvo = s.turning === 'next' ? lamina.direita : lamina.esquerda;
        const q = alvo.quadros.find((x) => x.tipo === 'foto' && x.fotoId) as QuadroFoto | undefined;
        const f = q?.fotoId ? porId.get(q.fotoId) : undefined;
        return `position:absolute;inset:8% 10% 14%;border-radius:2px;` +
          (f ? `background-image:url('${f.url}');background-size:cover;background-position:center;`
             : 'background:#F2EFE7;');
      })(),
      turnBackFoto: (() => {
        const destino = s.turning === 'next' ? doc.laminas[laminaAtual + 1] : doc.laminas[laminaAtual - 1];
        const alvo = s.turning === 'next' ? destino?.esquerda : destino?.direita;
        const q = alvo?.quadros.find((x) => x.tipo === 'foto' && x.fotoId) as QuadroFoto | undefined;
        const f = q?.fotoId ? porId.get(q.fotoId) : undefined;
        return `position:absolute;inset:8% 10% 14%;border-radius:2px;` +
          (f ? `background-image:url('${f.url}');background-size:cover;background-position:center;`
             : 'background:#F2EFE7;');
      })(),
      // O brilho gira JUNTO com a folha (é filho dela); a sombra fica sobre a
      // página de baixo (é irmã), senão giraria junto e não leria como sombra.
      turnBrilho: s.turning
        ? 'position:absolute;inset:0;pointer-events:none;z-index:3;border-radius:2px;' +
          'background:linear-gradient(105deg, rgba(255,255,255,0) 28%, rgba(255,255,255,.62) 46%, ' +
          'rgba(255,255,255,.9) 52%, rgba(255,255,255,.5) 58%, rgba(255,255,255,0) 76%);' +
          'background-size:260% 100%;mix-blend-mode:screen;' +
          'animation:brilhoFolha 880ms cubic-bezier(.56,.08,.18,.96) both'
        : 'display:none',
      turnSombra: s.turning
        ? `position:absolute;top:2%;bottom:2%;${s.turning === 'next' ? 'left:50%' : 'right:50%'};` +
          `width:50%;z-index:15;pointer-events:none;mix-blend-mode:multiply;` +
          `transform-origin:${s.turning === 'next' ? 'left' : 'right'} center;` +
          `background:linear-gradient(${s.turning === 'next' ? 'to right' : 'to left'}, ` +
          `rgba(40,30,18,.42), rgba(40,30,18,.14) 45%, rgba(40,30,18,0) 85%);` +
          `animation:sombraFolha 880ms cubic-bezier(.56,.08,.18,.96) both`
        : 'display:none',
      turnFront: 'position:absolute;inset:0;overflow:hidden;' +
        'background:linear-gradient(90deg,#FFFFFF,#FFFEFB);box-shadow:-10px 0 25px rgba(0,0,0,.12)',
      turnBack: 'position:absolute;inset:0;overflow:hidden;' +
        'background:linear-gradient(270deg,#FFFFFF,#FFFEFB);box-shadow:10px 0 25px rgba(0,0,0,.12);' +
        `transform:rotateY(${s.turning === 'prev' ? '-180deg' : '180deg'})`,
      stageStyle: estilo(estiloPalco()),
      bookStyle: estilo(estiloLivro(s.zoom)),

      layPrev: () => document.querySelector('.om-laycar')?.scrollBy({ left: -190, behavior: 'smooth' }),
      layNext: () => document.querySelector('.om-laycar')?.scrollBy({ left: 190, behavior: 'smooth' }),
      zoomIn: () => set({ zoom: limitarZoom(s.zoom + ZOOM_PASSO) }),
      zoomOut: () => set({ zoom: limitarZoom(s.zoom - ZOOM_PASSO) }),
      openModal: () => set({ modal: 1 }),
      closeModal: () => set({ modal: null }),
      ov: `position:fixed;inset:0;background:rgba(11,18,32,.5);z-index:60;${s.modal ? '' : 'display:none'}`,
      sh: `position:fixed;inset:0;z-index:61;display:flex;align-items:center;justify-content:center;` +
        `padding:24px;pointer-events:none;${s.modal ? '' : 'display:none'}`,

      titulo,
      bloqueadores,
      onTitulo: onTitulo
        ? (e: { target: { value: string } }) => onTitulo(e.target.value)
        : undefined,

      // O total sobe conforme o cliente adiciona lâmina ou foto. O valor é
      // sempre o da tabela vigente do modelo.
      orcamento: orcamento,
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
        (selTipo === 'foto' ? '' : 'display:none;') +
        `position:absolute;width:11px;height:11px;border-radius:3px;background:#FFFFFF;` +
        `border:1.5px solid #2563EB;${POS[i - 1]};z-index:9`;
    }

    return v;
  }, [s, fotos, titulo, rotas, modelo, laminas, fotosUsadas, bloqueadores, onTitulo, set, irPara]);

  return v;
}
