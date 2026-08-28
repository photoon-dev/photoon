'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Foto, PessoaDaGaleria, RostoDaFoto } from '@/lib/data';
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
  espacoAberto: boolean;
  paginarAberto: boolean;
  escopoPaginar: 'vazias' | 'recomecar';
  escopoEspaco: 'album' | 'lamina';
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
  /**
   * Matiz corrente do seletor de fundo.
   *
   * A cor aplicada mora no documento (`lamina.fundo`) — isto NÃO é uma segunda
   * cópia dela. É só a memória do matiz, que o hex não consegue devolver
   * quando o cliente arrasta o brilho até o branco ou o preto: sem guardar,
   * a barra de matiz saltaria para o vermelho sozinha.
   */
  bgHue: number;
  /** Cor com que os elementos novos nascem. */
  elCor: string;
  /** Quadros em que o cliente escolheu "Manter" apesar do aviso de rosto. */
  rostoIgnorado: string[];
  /** Pessoa selecionada na aba Pessoas; filtra a galeria. */
  pessoaAtiva: string | null;
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

// As doze formas soltas do design viraram `src/lib/elementos.ts`, com id
// estável, categoria e proporção — o painel filtra por categoria de verdade.

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

import { contagens, layout as layoutPorId, layoutsCom } from '@/lib/layouts';

/** Respiro de fábrica, em mm — o que a maioria dos álbuns usa. */
const ESPACO_MM_PADRAO = 3;

/** Cartão de opção do diálogo de paginação, marcado quando escolhido. */
const opcaoPaginar = (on: boolean) =>
  `display:flex;align-items:flex-start;gap:11px;padding:13px 14px;margin-bottom:10px;` +
  `border-radius:12px;cursor:pointer;` +
  `border:1px solid ${on ? '#2563EB' : '#E6EAF2'};background:${on ? '#F1F5FD' : '#FFFFFF'}`;
import { curvaturaPagina, luzPagina, estiloPalco, estiloLivro, limitarZoom, PAGINA_AR, ZOOM_PASSO, ZOOM_PADRAO } from '@/lib/livro';
import type { Documento, Lado } from '@/components/editor/useDocumento';
import type { Enq, Pagina, QuadroFoto } from '@/lib/album';
import { imagemCss } from '@/lib/imagem';
import {
  ESCALA_MAX, ESCALA_MIN, ROT_MAX, ROT_MIN,
  escalarEnq, girarEnq, limitarEscala, limitarRot, moverEnq, zoomEnq, zoomParaEscala,
  normalizarRot,
  type GestoInicio,
} from '@/lib/manipulacao';
import { CATEGORIAS, elemento as formaPorId, porCategoria } from '@/lib/elementos';
import { useBiblioteca, svgDaPeca } from '@/components/editor/useBiblioteca';
import { corrigirEnq, diagnosticar, envolver, rostoNoQuadro } from '@/lib/rostos';
import { contrasteSobre, hexParaHsv, hsvParaHex, normalizarHex } from '@/lib/cor';

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
  rostos,
  pessoas,
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
  /** Rostos detectados no envio (Fase 5); vazio em galeria antiga. */
  rostos: RostoDaFoto[];
  pessoas: PessoaDaGaleria[];
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
    hover: null, turning: null, espacoAberto: false, escopoEspaco: 'album', paginarAberto: false, escopoPaginar: 'vazias',
    tool: 0, panel: true, insp: false, modal: null, zoom: ZOOM_PADRAO,
    count: 0, lay: 2, photoTab: 0, bgTab: 0, bgCat: 0, elCat: 0, bw: false,
    bgHue: 220, elCor: '#2563EB', rostoIgnorado: [], pessoaAtiva: null,
  });

  const ac = useRef<AudioContext | null>(null);
  // Espelho do estado para os ouvintes de evento, que são registrados uma vez
  // e capturariam o `s` da primeira renderização.
  // As abas da biblioteca vêm depois das formas de traço; `elCat` continua
  // sendo o índice único, e aqui decidimos qual dos dois acervos ele aponta.
  const catsTraco = CATEGORIAS.length;
  const [catsBib, setCatsBib] = useState<string[]>([]);
  const catAberta = s.elCat >= catsTraco ? catsBib[s.elCat - catsTraco] ?? null : null;
  const bib = useBiblioteca(catAberta);
  useEffect(() => {
    setCatsBib(bib.categorias.map((c) => c.id));
  }, [bib.categorias]);

  const sRef = useRef(s);
  sRef.current = s;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Junta uma sequência de rodadas do mouse num só passo de desfazer.
  const rodaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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

  /**
   * Fecha o gesto da roda por EVENTO, não só por tempo.
   *
   * Qualquer outra ação — clicar, teclar, trocar de seleção, sair da janela —
   * encerra a sequência de zoom, então o passo de desfazer fecha no momento
   * certo mesmo que o cliente gire a roda devagar.
   */
  // Depende de `doc.fimGesto` (estável), NÃO de `doc` — `doc` é objeto novo a
  // cada render, e com ele o efeito abaixo disparava depois de cada evento de
  // roda, fechando o gesto que ele deveria manter aberto. Era por isso que o
  // Ctrl+Z continuava desfazendo um clique de roda por vez.
  const fimGesto = doc.fimGesto;
  const fecharGestoRoda = useCallback(() => {
    if (!rodaTimer.current) return;
    clearTimeout(rodaTimer.current);
    rodaTimer.current = null;
    fimGesto();
  }, [fimGesto]);

  useEffect(() => {
    const eventos = ['pointerdown', 'keydown', 'blur'] as const;
    for (const n of eventos) window.addEventListener(n, fecharGestoRoda);
    return () => {
      for (const n of eventos) window.removeEventListener(n, fecharGestoRoda);
    };
  }, [fecharGestoRoda]);

  // Trocar de seleção também fecha.
  useEffect(() => { fecharGestoRoda(); }, [doc.selecao, fecharGestoRoda]);

  // Fios soltos no desmonte: os dois temporizadores ficavam a escrever em refs
  // de um componente que já saiu da tela.
  useEffect(
    () => () => {
      if (rodaTimer.current) clearTimeout(rodaTimer.current);
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

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
        if (!doc.selecao) return;
        e.preventDefault();
        // Numa foto, Delete esvazia o quadro — o quadro faz parte do layout e
        // some sozinho só ao trocar de layout. Num elemento ou texto, que o
        // usuário inseriu, Delete apaga de verdade: antes chamava
        // `limparQuadro`, que não faz nada nesses tipos, e a tecla parecia
        // quebrada.
        if (doc.quadroSel?.tipo === 'foto') doc.limparQuadro();
        else doc.removerQuadro();
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

    /**
     * URL dentro de `url('…')`.
     *
     * Uma aspa simples na URL fecha a string antes da hora e o navegador
     * descarta a declaração inteira EM SILÊNCIO — a foto some e nada avisa.
     */
    const urlCss = (u: string) => `url('${u.replace(/['\\]/g, '\\$&')}')`;

    // O que está selecionado, segundo o documento — não segundo um segundo
    // estado paralelo que ninguém mantinha em dia.
    const qSel = doc.quadroSelecionado;
    // Genérico: foto, texto OU elemento. A caixa de seleção lia só o de foto,
    // então elemento e texto não ganhavam alça nenhuma — nem superfície de
    // mover, nem canto de redimensionar. Era por isso que não dava para
    // posicionar nem apagar um elemento.
    const qualquerSel = doc.quadroSel;
    const selTipo: 'foto' | 'texto' | 'elemento' | null = qualquerSel?.tipo ?? null;
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

    /**
     * `<img>` do quadro: fonte e estilo (enquadramento + ajustes de cor).
     *
     * Precisa do retângulo do layout para saber a proporção da CAIXA — sem ela
     * não dá para dimensionar a foto sem esticá-la.
     */
    const quadroImg = (
      q: QuadroFoto,
      r?: { w: number; h: number } | null,
    ): { src: string | undefined; imgStyle: string } => {
      const f = q.fotoId ? porId.get(q.fotoId) : undefined;
      if (!f) return { src: undefined, imgStyle: 'display:none' };
      const arFoto = f.largura && f.altura ? f.largura / f.altura : null;
      const arCaixa = r && r.h ? (r.w / r.h) * PAGINA_AR : null;
      return { src: f.url, imgStyle: imagemCss(q.enq, q.ajustes, arFoto, arCaixa) };
    };

    const SEM_IMG = { src: undefined as string | undefined, imgStyle: 'display:none' };

    /** Quadros de uma página, prontos para o markup. */
    const framesDe = (pagina: Pagina, lado: Lado) =>
      doc.quadrosDe(pagina).map(({ q, ret: r }) => {
        const sel = doc.selecao?.quadro === q.id;
        const img = q.tipo === 'foto' ? quadroImg(q, r) : SEM_IMG;
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

    /**
     * Elementos gráficos de uma página.
     *
     * Saem em lista própria, não misturados aos quadros de foto: o quadro de
     * foto é um `<div>` com `<img>` recortada, e o elemento é um `<svg>` que
     * herda a cor. Misturar obrigaria o markup a adivinhar o tipo.
     */
    const elementosDe = (pagina: Pagina, lado: Lado) =>
      pagina.quadros
        .filter((q) => q.tipo === 'elemento')
        .map((q) => {
          const sel = doc.selecao?.quadro === q.id;
          const forma = formaPorId(q.forma);
          // Peça da biblioteca (colorida) vira imagem de fundo; a lista de
          // traços fica vazia e o <svg> do markup não desenha nada. Assim as
          // duas famílias convivem sem mexer no markup do design.
          const daBiblioteca = !!q.svg;
          return {
            id: q.id,
            title: forma.nome,
            sw: forma.sw,
            paths: daBiblioteca ? [] : forma.d.map((d) => ({ d })),
            style:
              ret(q.ret) +
              `;color:${q.cor};cursor:pointer;z-index:6;` +
              (daBiblioteca
                ? `background-image:url("data:image/svg+xml,${encodeURIComponent(q.svg!)}");` +
                  'background-size:contain;background-position:center;background-repeat:no-repeat;'
                : '') +
              (q.rot ? `transform:rotate(${q.rot}deg);` : '') +
              (sel ? 'outline:2px solid #2563EB;outline-offset:3px;border-radius:2px;' : ''),
            pick: () => doc.setSelecao({ lamina: doc.atual, lado, quadro: q.id }),
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

    /* --------- manipulação direta no palco: mover, girar, ampliar --------- */

    /** Retângulo do quadro selecionado, na página dele (em %). */
    const retSel =
      qualquerSel && doc.selecao
        ? doc.quadrosDe(lamina[doc.selecao.lado]).find((x) => x.q.id === qualquerSel.id)?.ret ?? null
        : null;

    /**
     * Começa um gesto de arrasto: captura o estado e devolve o controle a
     * `passo`. Um gesto inteiro = um passo de desfazer (ver `doc.iniciarGesto`).
     *
     * Usa `setPointerCapture` e escuta `pointercancel`: só com `pointerup` os
     * ouvintes ficavam pendurados na janela para sempre quando o navegador
     * assumia o gesto (rolagem no toque) ou o botão era solto fora da janela —
     * e a foto passava a seguir o cursor sem nenhum botão pressionado.
     */
    const arrastar = (
      e: React.PointerEvent<HTMLElement>,
      passo: (ini: GestoInicio, x: number, y: number, ev: PointerEvent) => Partial<Enq>,
    ) => {
      if (!qSel) return;
      e.preventDefault();
      const alvo = e.currentTarget;
      const caixa = (alvo.closest('[data-om-selbox]') as HTMLElement | null) ?? alvo;
      const r = caixa.getBoundingClientRect();
      const f = qSel.fotoId ? porId.get(qSel.fotoId) : undefined;
      const ini: GestoInicio = {
        x: e.clientX,
        y: e.clientY,
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2,
        larguraBox: r.width || 1,
        alturaBox: r.height || 1,
        // Sem as dimensões da foto não dá para saber quanto ela transborda, e
        // o arrasto deixa de acompanhar o cursor.
        proporcao: f?.largura && f?.altura ? f.largura / f.altura : 1,
        enq: { ...qSel.enq },
      };

      const id = e.pointerId;
      try { alvo.setPointerCapture(id); } catch { /* ponteiro já solto */ }

      // O gesto (e o passo de desfazer) só começa quando o ponteiro anda de
      // fato — um clique seco na foto não deve entrar no histórico.
      let ativo = false;
      const mover = (ev: PointerEvent) => {
        // Um segundo dedo não pode disputar o mesmo gesto.
        if (ev.pointerId !== id) return;
        if (!ativo) {
          if (Math.hypot(ev.clientX - ini.x, ev.clientY - ini.y) < 3) return;
          ativo = true;
          doc.iniciarGesto();
        }
        doc.mudarEnq(passo(ini, ev.clientX, ev.clientY, ev));
      };
      const soltar = (ev: PointerEvent) => {
        if (ev.pointerId !== id) return;
        if (ativo) doc.fimGesto();
        try { alvo.releasePointerCapture(id); } catch { /* já liberado */ }
        window.removeEventListener('pointermove', mover);
        window.removeEventListener('pointerup', soltar);
        window.removeEventListener('pointercancel', soltar);
      };
      window.addEventListener('pointermove', mover);
      window.addEventListener('pointerup', soltar);
      window.addEventListener('pointercancel', soltar);
    };

    /* ---------------------------------------------------------------------
     * Gesto sobre quadro LIVRE (elemento e texto).
     *
     * `arrastar` acima mexe no ENQUADRAMENTO — quanto a foto desliza dentro de
     * um quadro cujo lugar quem manda é o layout. Elemento e texto não têm
     * layout: eles têm um retângulo próprio, e mover significa mudar `ret`.
     * Por isso o gesto antigo simplesmente não começava para eles (`qSel` é
     * nulo), e nada arrastava, escalava ou girava.
     * ------------------------------------------------------------------- */
    const arrastarLivre = (
      e: React.PointerEvent<HTMLElement>,
      modo: 'mover' | 'escalar' | 'girar',
    ) => {
      const q = qualquerSel;
      if (!q || q.tipo === 'foto') return;
      e.preventDefault();
      const alvo = e.currentTarget;
      // A página é a referência: `ret` está em % dela.
      const pagina = alvo.closest('section') as HTMLElement | null;
      const rp = pagina?.getBoundingClientRect();
      if (!rp || !rp.width || !rp.height) return;

      const ini = {
        x: e.clientX,
        y: e.clientY,
        ret: { ...q.ret },
        rot: q.tipo === 'elemento' ? q.rot : 0,
        // Centro do quadro em pixels, para o giro.
        cx: rp.left + ((q.ret.x + q.ret.w / 2) / 100) * rp.width,
        cy: rp.top + ((q.ret.y + q.ret.h / 2) / 100) * rp.height,
      };

      const id = e.pointerId;
      try { alvo.setPointerCapture(id); } catch { /* ponteiro já solto */ }

      let ativo = false;
      const mover = (ev: PointerEvent) => {
        if (ev.pointerId !== id) return;
        if (!ativo) {
          if (Math.hypot(ev.clientX - ini.x, ev.clientY - ini.y) < 3) return;
          ativo = true;
          doc.iniciarGesto();
        }
        const dx = ((ev.clientX - ini.x) / rp.width) * 100;
        const dy = ((ev.clientY - ini.y) / rp.height) * 100;

        if (modo === 'mover') {
          // Deixa sair um pouco da página: elemento na borda é decisão de
          // design, não erro. Sair de vez, não — some e o cliente não acha.
          doc.mudarRet({
            x: Math.min(100 - ini.ret.w / 2, Math.max(-ini.ret.w / 2, ini.ret.x + dx)),
            y: Math.min(100 - ini.ret.h / 2, Math.max(-ini.ret.h / 2, ini.ret.y + dy)),
          });
        } else if (modo === 'escalar') {
          // Mantém a proporção e o canto oposto parado, que é o que se espera
          // ao puxar um canto.
          const fator = Math.max(0.15, 1 + (dx + dy) / Math.max(ini.ret.w, ini.ret.h) / 2);
          const w = Math.min(200, Math.max(2, ini.ret.w * fator));
          const h = Math.min(200, Math.max(2, ini.ret.h * fator));
          doc.mudarRet({ w, h });
        } else {
          const a0 = Math.atan2(ini.y - ini.cy, ini.x - ini.cx);
          const a1 = Math.atan2(ev.clientY - ini.cy, ev.clientX - ini.cx);
          let g = ini.rot + ((a1 - a0) * 180) / Math.PI;
          // Shift trava de 15 em 15: alinhar no olho nunca sai reto.
          if (ev.shiftKey) g = Math.round(g / 15) * 15;
          doc.mudarElemento({ rot: Math.round(g) });
        }
      };
      const soltar = (ev: PointerEvent) => {
        if (ev.pointerId !== id) return;
        if (ativo) doc.fimGesto();
        try { alvo.releasePointerCapture(id); } catch { /* já liberado */ }
        window.removeEventListener('pointermove', mover);
        window.removeEventListener('pointerup', soltar);
        window.removeEventListener('pointercancel', soltar);
      };
      window.addEventListener('pointermove', mover);
      window.addEventListener('pointerup', soltar);
      window.addEventListener('pointercancel', soltar);
    };

    type PDown = React.PointerEvent<HTMLElement>;
    /** Encaminha para o gesto certo conforme o que está selecionado. */
    const livre = () => !!qualquerSel && qualquerSel.tipo !== 'foto';
    const selMoverDown = (e: PDown) =>
      livre() ? arrastarLivre(e, 'mover') : arrastar(e, (ini, x, y) => moverEnq(ini, x, y));
    // Os cantos AMPLIAM (é o que todo editor faz num canto); girar é o botão
    // redondo. Antes os cantos giravam e o botão de girar ficava recortado pelo
    // `overflow:hidden` da página — ou seja, nada escalava no palco.
    const selEscalarDown = (e: PDown) =>
      livre() ? arrastarLivre(e, 'escalar') : arrastar(e, (ini, x, y) => escalarEnq(ini, x, y));
    const selGirarDown = (e: PDown) =>
      livre() ? arrastarLivre(e, 'girar') : arrastar(e, (ini, x, y, ev) => girarEnq(ini, x, y, ev.shiftKey));

    /* ------------------------------- rostos ------------------------------- */

    const rostosPorFoto = new Map<string, RostoDaFoto[]>();
    for (const r of rostos) {
      const lista = rostosPorFoto.get(r.fotoId);
      if (lista) lista.push(r);
      else rostosPorFoto.set(r.fotoId, [r]);
    }

    /** Proporção da caixa do quadro selecionado, na página. */
    const arCaixaSel = retSel && retSel.h ? (retSel.w / retSel.h) * PAGINA_AR : null;
    const arFotoSel =
      fotoSel?.largura && fotoSel?.altura ? fotoSel.largura / fotoSel.altura : null;

    const rostosDoSel = qSel?.fotoId ? rostosPorFoto.get(qSel.fotoId) ?? [] : [];

    /**
     * Onde cada rosto caiu DENTRO do quadro, com o enquadramento atual.
     *
     * Só existe quando se sabe a proporção da foto e da caixa. Sem isso não há
     * como localizar o rosto, e o bloco continua escondido — que é a regra: não
     * mostrar o que não se sabe.
     */
    const rostosNoQuadro =
      qSel && arFotoSel && arCaixaSel
        ? rostosDoSel.map((r) => ({
            id: r.id,
            caixa: r.caixa,
            noQuadro: rostoNoQuadro(r.caixa, qSel.enq, arFotoSel, arCaixaSel),
          }))
        : [];

    const envolvido = envolver(rostosNoQuadro.map((r) => r.noQuadro));
    const diag = envolvido ? diagnosticar(envolvido) : null;
    const ignorado = qSel ? s.rostoIgnorado.includes(qSel.id) : false;
    const avisarRosto = !!diag && diag.perto && !ignorado;

    const correcao =
      avisarRosto && qSel && arFotoSel && arCaixaSel
        ? corrigirEnq(rostosNoQuadro.map((r) => r.caixa), qSel.enq, arFotoSel, arCaixaSel)
        : null;

    /* ------------------------- seletor de cor do fundo -------------------- */

    /** A cor da lâmina atual — o documento é a fonte, não um estado paralelo. */
    const fundoAtual = lamina.fundo || '#FFFFFF';
    const hsvFundo = hexParaHsv(fundoAtual);

    /**
     * Arrasto sobre uma superfície do seletor: entrega a posição do ponteiro
     * normalizada (0..1) dentro do retângulo do elemento, do `pointerdown` até
     * o `pointerup`. Um arrasto inteiro = um passo de desfazer.
     */
    const arrastarEm = (e: PDown, aplicarPos: (u: number, w: number) => void) => {
      e.preventDefault();
      const r = e.currentTarget.getBoundingClientRect();
      const pos = (x: number, y: number) =>
        aplicarPos(
          Math.min(1, Math.max(0, (x - r.left) / (r.width || 1))),
          Math.min(1, Math.max(0, (y - r.top) / (r.height || 1))),
        );
      doc.iniciarGesto();
      pos(e.clientX, e.clientY);
      const mover = (ev: PointerEvent) => pos(ev.clientX, ev.clientY);
      const soltar = () => {
        doc.fimGesto();
        window.removeEventListener('pointermove', mover);
        window.removeEventListener('pointerup', soltar);
      };
      window.addEventListener('pointermove', mover);
      window.addEventListener('pointerup', soltar);
    };

    const arrastarArea = (e: PDown) =>
      arrastarEm(e, (u, w) =>
        doc.mudarFundo(hsvParaHex({ h: sRef.current.bgHue, s: u * 100, v: (1 - w) * 100 })),
      );

    const arrastarMatiz = (e: PDown) =>
      arrastarEm(e, (u) => {
        const h = u * 360;
        set({ bgHue: h });
        // Mantém saturação e brilho: mover o matiz não pode clarear a cor.
        doc.mudarFundo(hsvParaHex({ h, s: hsvFundo.s, v: hsvFundo.v }));
      });

    /**
     * Alça de canto.
     *
     * Fica DENTRO do quadro (`inset` positivo). Em −8px ela era recortada pelo
     * `overflow:hidden` da página nos quadros da linha de cima e invadia 8px do
     * quadro vizinho — com o respiro do layout em 2,5% (~7px) as alças de dois
     * quadros chegavam a se tocar, e o clique ia para a errada.
     */
    const alcaCanto = (pos: string, cursor: string) =>
      // Quadradinho pequeno e reto, no lugar do losango arredondado de 13px com
      // borda de 2px: aquele competia com a foto. Este é o formato que os
      // editores usam há décadas e some da vista quando não se precisa dele.
      `position:absolute;${pos};width:9px;height:9px;border-radius:1px;background:#FFFFFF;` +
      `border:1px solid #2563EB;box-shadow:0 0 0 .5px rgba(255,255,255,.9);cursor:${cursor};` +
      `pointer-events:auto;touch-action:none;z-index:10`;

    const caixaSel = (lado: Lado) => {
      const on = !!selTipo && doc.selecao?.lado === lado && !!retSel;
      return {
        // Contorno fino em volta do que está selecionado: é o que diz onde
        // termina o objeto, e dispensa alça grossa para isso.
        box: on
          ? ret(retSel!) + ';z-index:9;pointer-events:none;outline:1px solid #2563EB;outline-offset:-1px'
          : 'display:none',
        // Contorno de cada rosto, no lugar em que ele realmente está. Verde
        // quando dentro da área segura, âmbar quando toca a margem de corte.
        rostos: on
          ? rostosNoQuadro.map((r) => {
              const d = diagnosticar(r.noQuadro);
              const cor = d.perto ? '#F59E0B' : '#10B981';
              return {
                style:
                  `position:absolute;left:${(r.noQuadro.x * 100).toFixed(2)}%;` +
                  `top:${(r.noQuadro.y * 100).toFixed(2)}%;` +
                  `width:${(r.noQuadro.w * 100).toFixed(2)}%;` +
                  `height:${(r.noQuadro.h * 100).toFixed(2)}%;` +
                  `border:1.5px solid ${cor};border-radius:6px;pointer-events:none;` +
                  `box-shadow:0 0 0 1px rgba(255,255,255,.55);z-index:8`,
              };
            })
          : [],
        // Superfície de mover: cobre o quadro, só quando selecionado.
        // `touch-action:none` impede o navegador de assumir o gesto como
        // rolagem no toque — sem isso, arrastar a foto num tablet rola a página.
        mover: 'position:absolute;inset:0;pointer-events:auto;cursor:move;touch-action:none',
        cantoNO: alcaCanto('top:3px;left:3px', 'nwse-resize'),
        cantoNE: alcaCanto('top:3px;right:3px', 'nesw-resize'),
        cantoSO: alcaCanto('bottom:3px;left:3px', 'nesw-resize'),
        // O canto inferior-direito é o de girar: fica no lugar mais afastado do
        // vinco e da barra flutuante, e continua dentro do recorte.
        cantoSE: alcaCanto('bottom:3px;right:3px', 'nwse-resize'),
        girar:
          // Menor e mais claro que a versão anterior de 26px com borda de 2px.
          'position:absolute;bottom:4px;left:50%;transform:translateX(-50%);width:18px;height:18px;' +
          'border-radius:999px;background:#FFFFFF;border:1px solid #2563EB;display:flex;align-items:center;' +
          'justify-content:center;color:#2563EB;cursor:grab;pointer-events:auto;touch-action:none;' +
          'box-shadow:0 1px 3px rgba(11,18,32,.2);z-index:11',
      };
    };

    // O lado que o seletor altera: o da seleção, ou os dois quando nada está
    // selecionado. Antes trocava um índice global que a página nem lia.
    const ladoAlvo: Lado | 'ambos' = doc.selecao?.lado ?? 'ambos';
    const layoutAtual =
      ladoAlvo === 'ambos' ? lamina.esquerda.layoutId : lamina[ladoAlvo].layoutId;

    const layouts = layoutsCom(doc.respiro).filter((l) => s.count === 0 || l.n === s.count).map((l) => {
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

    /* ------------------- filtros do painel de fotos (7.4) ------------------ */

    // Eram cinco pastilhas decorativas: clicar trocava o realce e a lista
    // continuava a mesma. `Favoritas` fica de fora até existir a coluna no
    // banco — melhor não oferecer um filtro que não filtra.
    const FILTROS: { rotulo: string; testa: (f: Foto) => boolean }[] = [
      { rotulo: 'Todas', testa: () => true },
      { rotulo: 'Não usadas', testa: (f) => !doc.usadas.has(f.id) },
      { rotulo: 'Verticais', testa: (f) => !!f.largura && !!f.altura && f.altura > f.largura },
      { rotulo: 'Horizontais', testa: (f) => !!f.largura && !!f.altura && f.largura > f.altura },
    ];
    const filtroAtivo = FILTROS[s.photoTab] ?? FILTROS[0];

    // Aba Pessoas: quando há alguém escolhido, a galeria mostra só as fotos em
    // que essa pessoa aparece. É o filtro "Uma pessoa" que a spec já previa.
    const fotosDaPessoa = s.pessoaAtiva
      ? new Set(rostos.filter((r) => r.pessoaId === s.pessoaAtiva).map((r) => r.fotoId))
      : null;

    const fotosVisiveis = fotos.filter(
      (f) => filtroAtivo.testa(f) && (!fotosDaPessoa || fotosDaPessoa.has(f.id)),
    );

    // O painel do design tinha 12 gradientes; aqui são as fotos reais da galeria.
    const photos = fotosVisiveis.map((f, i) => ({
      style: `position:relative;aspect-ratio:3 / 4;border-radius:10px;` +
        `background-image:${urlCss(f.url)};background-size:cover;background-position:center;` +
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

    // A prévia acompanha a LISTA VISÍVEL: com um filtro ligado, o índice do
    // hover não aponta mais para a mesma posição em `fotos`.
    const fotoHover = s.hover === null ? fotosVisiveis[0] : fotosVisiveis[s.hover];

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

      photoTabs: FILTROS.map((f, i) => ({
        label: f.rotulo,
        style: chip(s.photoTab === i),
        pick: () => set({ photoTab: i, hover: null }),
      })),
      // Quantas fotos o filtro deixou passar — o design trazia "38 de 120"
      // escrito à mão.
      photoConta: `${fotosVisiveis.length} de ${fotos.length}`,

      /* ----------------------------- pessoas ----------------------------- */

      // Bolinhas estilo Google Fotos. Cada uma recorta o rosto de capa da
      // própria foto, com `background-size/position` — não precisa de miniatura
      // gerada no servidor.
      pessoasTitulo: pessoas.length
        ? s.pessoaAtiva
          ? 'Mostrando só as fotos desta pessoa'
          : 'Pessoas nesta galeria'
        : '',
      pessoasBloco: pessoas.length ? 'padding:10px 18px 12px;border-bottom:1px solid #F0F3F9' : 'display:none',
      pessoas: pessoas.map((p) => {
        const capa =
          rostos.find((r) => r.id === p.rostoCapaId) ??
          rostos.find((r) => r.pessoaId === p.id);
        const foto = capa ? fotos.find((f) => f.id === capa.fotoId) : undefined;
        const n = rostos.filter((r) => r.pessoaId === p.id).length;
        const on = s.pessoaAtiva === p.id;

        // Recorte do rosto: amplia a foto pelo inverso do tamanho da caixa e
        // desloca para o rosto ficar no meio do círculo.
        const c = capa?.caixa;
        const zoom = c
          ? `background-size:${(100 / Math.max(c.w, 0.02)).toFixed(1)}% ${(100 / Math.max(c.h, 0.02)).toFixed(1)}%;` +
            `background-position:${((c.x / Math.max(1 - c.w, 0.001)) * 100).toFixed(1)}% ` +
            `${((c.y / Math.max(1 - c.h, 0.001)) * 100).toFixed(1)}%;`
          : 'background-size:cover;background-position:center;';

        return {
          nome: p.nome || 'Sem nome',
          conta: `${n} foto${n === 1 ? '' : 's'}`,
          style:
            // `display:block` é obrigatório: o markup usa <span>, que é inline,
            // e largura/altura de elemento inline são simplesmente ignoradas.
            `display:block;width:46px;height:46px;border-radius:999px;flex:0 0 auto;cursor:pointer;` +
            (foto ? `background-image:${urlCss(foto.url)};${zoom}` : 'background:#EEF1F7;') +
            (on
              ? 'box-shadow:0 0 0 2px #2563EB, 0 0 0 4px #FFFFFF;'
              : 'box-shadow:0 0 0 1px #E6EAF2;'),
          rotulo: `display:block;max-width:52px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;` +
            `text-align:center;font-size:10.5px;margin-top:4px;font-weight:${on ? 700 : 500};` +
            `color:${on ? '#2563EB' : '#6B7A90'}`,
          // Clicar de novo na mesma pessoa desfaz o filtro.
          pick: () => set({ pessoaAtiva: on ? null : p.id, hover: null }),
        };
      }),
      photoVazio:
        fotosVisiveis.length === 0
          ? 'padding:22px 4px;text-align:center;font-size:12px;color:#9AA7BC'
          : 'display:none',
      photoVazioTexto:
        s.photoTab === 1
          ? 'Todas as fotos já estão no álbum.'
          : 'Nenhuma foto neste filtro.',

      bgTabs: lista(['Texturas', 'Cores', 'Gradientes'], 'bgTab', s.bgTab),
      bgCats: lista(['Suaves', 'Matelassê', 'Arabescos', 'Geométricos', 'Delicados'], 'bgCat', s.bgCat),
      elCats: [
        ...CATEGORIAS.map((c) => ({ rotulo: c.rotulo ?? c.id })),
        ...bib.categorias.map((c) => ({ rotulo: c.rotulo })),
      ].map((c, i) => ({
        label: c.rotulo,
        style: chip(s.elCat === i),
        pick: () => set({ elCat: i }),
      })),

      /* ------------------------------ fundos ----------------------------- */

      bgSwatches: BG_SW.map((c) => ({
        style: `aspect-ratio:1 / 1;border-radius:10px;background:${c};` +
          `border:${fundoAtual.toUpperCase() === c.toUpperCase() ? '2px solid #2563EB' : '1px solid #E6EAF2'};cursor:pointer`,
        pick: () => doc.mudarFundo(c),
      })),
      colorChips: CHIPS.map((c) => ({
        style: `aspect-ratio:1 / 1;border-radius:7px;background:${c};cursor:pointer;` +
          `border:${fundoAtual.toUpperCase() === c.toUpperCase() ? '2px solid #2563EB' : '1px solid rgba(11,18,32,.1)'}`,
        pick: () => doc.mudarFundo(c),
      })),

      // Área de saturação/brilho: o gradiente do design, agora com o matiz
      // corrente por baixo e um alvo na posição real da cor da lâmina.
      bgArea:
        'position:relative;height:96px;border-radius:10px;cursor:crosshair;' +
        `background:linear-gradient(to top,#000000,transparent),` +
        `linear-gradient(to right,#FFFFFF,${hsvParaHex({ h: s.bgHue, s: 100, v: 100 })})`,
      bgAlvo:
        `position:absolute;top:${(100 - hsvFundo.v).toFixed(1)}%;left:${hsvFundo.s.toFixed(1)}%;` +
        'width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:999px;border:2px solid #FFFFFF;' +
        'box-shadow:0 1px 4px rgba(11,18,32,.4);pointer-events:none',
      bgAreaDown: (e: React.PointerEvent<HTMLElement>) => arrastarArea(e),

      bgHueDown: (e: React.PointerEvent<HTMLElement>) => arrastarMatiz(e),
      bgHueKnob:
        `position:absolute;top:50%;left:${((s.bgHue / 360) * 100).toFixed(1)}%;` +
        `transform:translate(-50%,-50%);width:14px;height:14px;border-radius:999px;` +
        `background:${hsvParaHex({ h: s.bgHue, s: 100, v: 100 })};border:2px solid #FFFFFF;` +
        'box-shadow:0 1px 4px rgba(11,18,32,.4);pointer-events:none',

      bgHex: fundoAtual.replace('#', ''),
      setBgHex: (e: React.ChangeEvent<HTMLInputElement>) => {
        const c = normalizarHex(e.target.value);
        if (c) doc.mudarFundo(c);
      },
      bgAmostra: `width:38px;height:38px;border-radius:10px;background:${fundoAtual};` +
        'border:1px solid #E6EAF2;flex:0 0 auto',
      bgPonto: `width:22px;height:22px;border-radius:999px;background:${fundoAtual};` +
        'border:1px solid #D6E2FC;flex:0 0 auto',
      bgSoEsta: () => doc.mudarFundo(fundoAtual),
      bgTudo: () => doc.mudarFundoTudo(fundoAtual),

      /* ----------------------------- elementos --------------------------- */

      // Clicar insere na página do lado selecionado; o elemento já nasce
      // selecionado, para o cliente poder arrastá-lo em seguida.
      // Duas famílias na mesma grade: as formas de traço, que herdam a cor
      // escolhida, e as peças da biblioteca, que já vêm coloridas e entram
      // como imagem SVG. `paths` vazio faz o <svg> do markup não desenhar nada.
      elements:
        catAberta !== null
          ? bib.pecas.map((pc) => ({
              id: pc.id,
              title: pc.nome,
              sw: 0,
              paths: [] as { d: string }[],
              style:
                `aspect-ratio:1 / 1;border-radius:10px;border:1px solid #E6EAF2;cursor:pointer;` +
                `background-image:url("data:image/svg+xml,${encodeURIComponent(svgDaPeca(pc))}");` +
                `background-size:62%;background-position:center;background-repeat:no-repeat;background-color:#FFFFFF`,
              pick: () => doc.adicionarElemento(pc.id, s.elCor, svgDaPeca(pc)),
            }))
          : porCategoria(CATEGORIAS[s.elCat]?.id ?? 'todos').map((el) => ({
              id: el.id,
              title: el.nome,
              sw: el.sw,
              paths: el.d.map((d) => ({ d })),
              // Mesma caixa do design; a forma de traço é desenhada pelo <svg>.
              style:
                'aspect-ratio:1 / 1;border-radius:12px;border:1px solid #E6EAF2;background:#FFFFFF;' +
                'display:flex;align-items:center;justify-content:center;color:#2563EB;cursor:pointer',
              pick: () => doc.adicionarElemento(el.id, s.elCor),
            })),
      elCorAmostra: `width:26px;height:26px;border-radius:8px;background:${s.elCor};flex:0 0 auto`,
      elCorHex: s.elCor,
      elCorChips: CHIPS.map((c) => ({
        style: `aspect-ratio:1 / 1;border-radius:7px;background:${c};cursor:pointer;` +
          `border:${s.elCor.toUpperCase() === c.toUpperCase() ? '2px solid #2563EB' : '1px solid rgba(11,18,32,.1)'}`,
        // Muda a cor dos próximos e, se houver um elemento selecionado, a dele.
        pick: () => {
          set({ elCor: c });
          if (doc.elementoSel) doc.mudarElemento({ cor: c });
        },
      })),

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

      // O aviso era um retângulo fixo em 16%/20%/36%/40%, que mentia em toda
      // foto. Agora sai da análise real: `rostoNoQuadro` refaz exatamente a
      // conta do `imagemCss`, então o aviso e o desenho concordam sempre.
      blocoRosto: avisarRosto ? 'padding:16px 18px 0' : 'display:none',
      tituloRosto: diag?.cortado ? 'Rosto cortado' : 'Rosto perto do corte',
      // Sem correção possível o botão some. Oferecer "Corrigir" e não corrigir
      // nada é pior do que não oferecer.
      botaoCorrigir: correcao
        ? 'flex:1;height:38px;display:flex;align-items:center;justify-content:center;gap:7px;' +
          'border-radius:10px;background:linear-gradient(135deg,#2563EB,#06B6D4);color:#FFFFFF;' +
          'font-size:12.5px;font-weight:700;cursor:pointer'
        : 'display:none',
      textoRosto: (() => {
        if (!diag) return '';
        const n = rostosNoQuadro.length;
        const quem = n === 1 ? 'Um rosto' : `${n} rostos`;
        return diag.cortado
          ? `${quem} ${n === 1 ? 'está' : 'estão'} saindo do quadro. Na impressão, essa parte é perdida.`
          : `${quem} ${n === 1 ? 'está' : 'estão'} muito perto da margem de corte.`;
      })(),
      // Determinístico: desloca o mínimo necessário e, só se não bastar, reduz
      // a ampliação. Não é IA e não inventa enquadramento.
      corrigirRosto: () => {
        if (correcao) doc.mudarEnq(correcao);
      },
      manterRosto: () => {
        if (qSel) set({ rostoIgnorado: [...s.rostoIgnorado, qSel.id] });
      },

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
        pick: () => doc.mudarEnq((enq) => ({ rot: limitarRot(normalizarRot(enq.rot + 90)) })),
      },
      enqEspelhar: {
        style: botaoEnq(!!qSel?.enq.espelho),
        pick: () => doc.mudarEnq({ espelho: !qSel?.enq.espelho }),
      },

      zoomFoto: Math.round((qSel?.enq.escala ?? 1) * 100),
      setZoomFoto: (e: React.ChangeEvent<HTMLInputElement>) => {
        const n = Number(e.target.value);
        if (Number.isFinite(n)) doc.mudarEnq(zoomParaEscala(n));
      },
      rotFoto: Math.round(qSel?.enq.rot ?? 0),
      setRotFoto: (e: React.ChangeEvent<HTMLInputElement>) => {
        const n = Number(e.target.value);
        if (Number.isFinite(n)) doc.mudarEnq({ rot: limitarRot(n) });
      },

      // Barras de arrasto do inspetor: giram/ampliam de forma contínua, com
      // um único passo de desfazer por varredura (pointerdown → pointerup).
      // Faixa ÚNICA por grandeza, vinda de `manipulacao.ts` — campo, slider e
      // roda concordam. Antes o slider cortava em ±180/400% enquanto o campo
      // aceitava ±360/2000%: o rótulo dizia "800%" com o botão encostado no fim
      // da trilha, e o primeiro arrasto derrubava a escala sem aviso.
      rotSlider: (() => {
        const rot = Math.round(qSel?.enq.rot ?? 0);
        const pct = ((limitarRot(rot) - ROT_MIN) / (ROT_MAX - ROT_MIN)) * 100;
        return {
          min: ROT_MIN,
          max: ROT_MAX,
          raw: limitarRot(rot),
          value: rot + '°',
          down: () => doc.iniciarGesto(),
          up: () => doc.fimGesto(),
          set: (e: React.ChangeEvent<HTMLInputElement>) =>
            doc.mudarEnq({ rot: limitarRot(Number(e.target.value)) }),
          fill: `width:${pct.toFixed(1)}%;height:100%;border-radius:999px;` +
            `background:${rot !== 0 ? 'linear-gradient(90deg,#2563EB,#06B6D4)' : '#CBD5E6'}`,
          knob: `position:absolute;left:${pct.toFixed(1)}%;top:50%;transform:translate(-50%,-50%);` +
            `width:15px;height:15px;border-radius:999px;background:#FFFFFF;border:2px solid #2563EB;` +
            `box-shadow:0 2px 5px rgba(11,18,32,.18)`,
        };
      })(),
      zoomSlider: (() => {
        const escala = qSel?.enq.escala ?? 1;
        const pct = Math.round(escala * 100);
        const min = ESCALA_MIN * 100;
        const max = ESCALA_MAX * 100;
        const t = ((limitarEscala(escala) * 100 - min) / (max - min)) * 100;
        return {
          min,
          max,
          raw: Math.round(limitarEscala(escala) * 100),
          value: pct + '%',
          down: () => doc.iniciarGesto(),
          up: () => doc.fimGesto(),
          set: (e: React.ChangeEvent<HTMLInputElement>) =>
            doc.mudarEnq(zoomParaEscala(Number(e.target.value))),
          fill: `width:${t.toFixed(1)}%;height:100%;border-radius:999px;` +
            `background:${pct !== 100 ? 'linear-gradient(90deg,#2563EB,#06B6D4)' : '#CBD5E6'}`,
          knob: `position:absolute;left:${t.toFixed(1)}%;top:50%;transform:translate(-50%,-50%);` +
            `width:15px;height:15px;border-radius:999px;background:#FFFFFF;border:2px solid #2563EB;` +
            `box-shadow:0 2px 5px rgba(11,18,32,.18)`,
        };
      })(),

      // Roda do mouse sobre o palco: amplia a foto selecionada; sem seleção,
      // aproxima a visualização (o mesmo que +/- no teclado).
      palcoWheel: (e: React.WheelEvent) => {
        // A roda só amplia a FOTO quando o cursor está sobre ela (ou com
        // Ctrl/⌘). Antes, ter uma foto selecionada mudava o significado da roda
        // em todo o palco — mesmo a 300px da foto —, que é o inverso da
        // convenção e foi como a edição às cegas apareceu.
        const sobreFoto =
          !!qSel &&
          (e.ctrlKey ||
            e.metaKey ||
            !!(document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null)?.closest(
              '[data-om-selbox]',
            ));

        if (!sobreFoto) {
          set({ zoom: limitarZoom(sRef.current.zoom + (e.deltaY < 0 ? ZOOM_PASSO : -ZOOM_PASSO)) });
          return;
        }
        doc.iniciarGesto();
        // Parte sempre do valor corrente, não do capturado no memo.
        doc.mudarEnq((enq) => zoomEnq(enq, e.deltaY));
        // O fim do gesto por tempo agrupava só quem varria a roda depressa:
        // com 500ms entre cliques — o ritmo de quem ajusta com cuidado — cada
        // clique virava um passo de desfazer. A janela agora é folgada, e
        // qualquer outra ação fecha o gesto na hora (ver `fecharGestoRoda`).
        if (rodaTimer.current) clearTimeout(rodaTimer.current);
        rodaTimer.current = setTimeout(() => doc.fimGesto(), 1500);
      },

      // O storyboard vinha de dez rótulos fixos; agora sai do documento.
      spreads: doc.laminas.map((l, i) => {
        const on = i === laminaAtual;
        const esq = layoutPorId(l.esquerda.layoutId, doc.respiro);
        const dir = layoutPorId(l.direita.layoutId, doc.respiro);
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
        ? `width:100%;flex:1 1 auto;min-height:0;aspect-ratio:3 / 4;background-image:${urlCss(fotoHover.url)};background-size:cover;background-position:center`
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

      inspTitle:
        selTipo === 'texto'
          ? 'Texto selecionado'
          : selTipo === 'elemento'
            ? 'Elemento selecionado'
            : selTipo
              ? 'Foto selecionada'
              : 'Inspetor',
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

      /* ---------------------- paginação automática -----------------------
       * Distribuir as fotos uma a uma é o trabalho mais chato do editor, e o
       * concorrente resolve com um diálogo. As duas opções existem porque
       * "recomeçar" destrói o que o cliente montou: tem de ser escolha
       * explícita, nunca o padrão.
       * ------------------------------------------------------------------ */
      abrirPaginar: () => set({ paginarAberto: true }),
      fecharPaginar: () => set({ paginarAberto: false }),
      ovPaginar: s.paginarAberto
        ? 'position:fixed;inset:0;z-index:60;background:rgba(11,18,32,.42);backdrop-filter:blur(2px)'
        : 'display:none',
      shPaginar: s.paginarAberto
        ? 'position:fixed;z-index:61;top:50%;left:50%;transform:translate(-50%,-50%);' +
          'width:min(440px, calc(100vw - 32px));padding:24px;background:#FFFFFF;' +
          'border-radius:18px;box-shadow:0 30px 70px rgba(11,18,32,.32)'
        : 'display:none',
      paginarVazias: s.escopoPaginar === 'vazias',
      paginarRecomecar: s.escopoPaginar === 'recomecar',
      setPaginarVazias: () => set({ escopoPaginar: 'vazias' }),
      setPaginarRecomecar: () => set({ escopoPaginar: 'recomecar' }),
      opcaoVazias: opcaoPaginar(s.escopoPaginar === 'vazias'),
      opcaoRecomecar: opcaoPaginar(s.escopoPaginar === 'recomecar'),
      resumoPaginar: (() => {
        const sobrando = fotos.length - doc.usadas.size;
        return s.escopoPaginar === 'recomecar'
          ? `${fotos.length} foto${fotos.length === 1 ? '' : 's'} na galeria · o que está montado será desfeito`
          : `${doc.quadrosVazios} quadro${doc.quadrosVazios === 1 ? '' : 's'} vazio${
              doc.quadrosVazios === 1 ? '' : 's'
            } · ${sobrando} foto${sobrando === 1 ? '' : 's'} ainda não usada${sobrando === 1 ? '' : 's'}`;
      })(),
      paginar: () => {
        doc.paginarAutomatico(fotos.map((f) => f.id), s.escopoPaginar);
        set({ paginarAberto: false });
      },

      /* --------------------- espaçamento entre as fotos -------------------
       * Em milímetros porque é a unidade do produto impresso: o cliente pensa
       * "3 mm entre as fotos", não "2,5% da largura da página". A conversão
       * usa a largura do template.
       * ------------------------------------------------------------------ */
      abrirEspaco: () => set({ espacoAberto: !s.espacoAberto }),
      botaoEspaco:
        `width:28px;height:28px;border-radius:9px;flex:0 0 auto;display:flex;` +
        `align-items:center;justify-content:center;cursor:pointer;` +
        `border:1px solid ${s.espacoAberto ? '#2563EB' : '#E6EAF2'};` +
        `background:${s.espacoAberto ? '#F1F5FD' : '#FFFFFF'};` +
        `color:${s.espacoAberto ? '#2563EB' : '#46536A'}`,
      painelEspaco: s.espacoAberto
        ? 'position:absolute;top:52px;right:18px;z-index:45;width:280px;padding:14px 16px;' +
          'background:#FFFFFF;border:1px solid #E6EAF2;border-radius:14px;' +
          'box-shadow:0 18px 40px rgba(11,18,32,.18)'
        : 'display:none',
      espacoMm: doc.espacoMm ?? ESPACO_MM_PADRAO,
      setEspaco: (e: React.ChangeEvent<HTMLInputElement>) => {
        const n = Number(e.target.value);
        if (Number.isFinite(n)) doc.mudarEspaco(n, s.escopoEspaco);
      },
      escopoAlbum: s.escopoEspaco === 'album',
      escopoLamina: s.escopoEspaco === 'lamina',
      setEscopoAlbum: () => set({ escopoEspaco: 'album' }),
      setEscopoLamina: () => set({ escopoEspaco: 'lamina' }),

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

      // O fundo da lâmina era gravado e NUNCA desenhado: o cliente escolhia uma
      // cor e a página continuava branca. Fica sob os quadros, sobre o papel.
      pageFundo: `position:absolute;inset:0;background:${fundoAtual};z-index:0`,
      rightFundo: `position:absolute;inset:0;background:${fundoAtual};z-index:0`,

      pageElementos: elementosDe(lamina.esquerda, 'esquerda'),
      rightElementos: elementosDe(lamina.direita, 'direita'),

      // Alças de manipulação sobre o quadro selecionado (uma por página; só a do
      // lado da seleção aparece). Cantos e botão de cima giram arrastando; o
      // meio move o recorte. Zoom fica na roda do mouse e no inspetor.
      selEsq: caixaSel('esquerda'),
      selDir: caixaSel('direita'),
      selMoverDown,
      selGirarDown,
      selEscalarDown,
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
          const img = q.tipo === 'foto' ? quadroImg(q, r) : SEM_IMG;
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
          const img = q.tipo === 'foto' ? quadroImg(q, r) : SEM_IMG;
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

    // As alças de canto do primeiro quadro saíram: a caixa de seleção
    // (`selEsq`/`selDir`) agora desenha as alças sobre QUALQUER quadro
    // selecionado, não só o primeiro.
    for (let i = 1; i <= 4; i++) v['h' + i] = 'display:none';

    return v;
    // `doc` PRECISA estar aqui: o corpo lê `doc.lamina`, `doc.selecao`,
    // `doc.quadroSel`… e `arrastar()` fecha sobre `qSel`. Sem ele o memo só
    // recalculava por acidente — `rotas` chega como objeto literal e `irPara`
    // depende de `doc` —, e bastava alguém estabilizar qualquer um dos dois
    // para o editor inteiro congelar: alça no quadro errado, inspetor com a
    // foto anterior, arrasto partindo de um enquadramento velho.
  }, [s, fotos, rostos, pessoas, titulo, rotas, modelo, laminas, fotosUsadas, bloqueadores, onTitulo, set, irPara, doc]);

  return v;
}
