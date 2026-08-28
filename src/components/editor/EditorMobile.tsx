'use client';

import Link from 'next/link';
import { useState } from 'react';
import { css } from '@/lib/css';
import {
  IconSeta,
  IconGaleria,
  IconLapis,
  IconFoto,
  IconSparkle,
  IconGrade,
  IconCheck,
  IconFechar,
} from '@/components/icons';

/**
 * Editor em tela de celular.
 *
 * O layout do design é de desktop: barra de 76px, painel de 328px, canvas,
 * inspetor de 306px e storyboard. Em 390px nada disso cabe — espremer só
 * empurra o canvas para fora da tela.
 *
 * Aqui o canvas ocupa a tela inteira e todo o resto vira folha que sobe,
 * que é como Canva, Adobe Express e Picsart resolvem o mesmo problema:
 *
 *   topo 56px      voltar · nome · estado · revisar
 *   canvas         a lâmina, ocupando o que sobra
 *   páginas 64px   tira horizontal das lâminas
 *   ferramentas    Fotos · Layouts · Texto · Fundos · Assistência
 *   folha          conteúdo da ferramenta escolhida, até 62% da altura
 *
 * A lógica é a mesma do desktop: recebe o `v` do useEditorDesign.
 */

type Ferramenta = 'fotos' | 'layouts' | 'texto' | 'fundos' | 'assistencia' | null;

/**
 * Em pé, a lâmina inteira (2:1) só alcança ~180px de altura numa tela de
 * 390px — sobra metade do ecrã vazia e a foto fica minúscula para editar.
 * Ver uma página por vez usa a altura toda. A lâmina continua disponível
 * para conferir a virada, que é o que ela existe para mostrar.
 */
type Vista = 'lamina' | 'pagina';

const FERRAMENTAS: { id: Exclude<Ferramenta, null>; rotulo: string; icone: React.ReactNode }[] = [
  { id: 'fotos', rotulo: 'Fotos', icone: <IconGaleria size={24} /> },
  { id: 'layouts', rotulo: 'Layouts', icone: <IconGrade size={24} /> },
  { id: 'texto', rotulo: 'Texto', icone: <IconLapis size={24} /> },
  { id: 'fundos', rotulo: 'Fundos', icone: <IconFoto size={24} /> },
  { id: 'assistencia', rotulo: 'Assistência', icone: <IconSparkle size={24} /> },
];

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function EditorMobile({ v, projetoId }: { v: any; projetoId: string }) {
  const [ferramenta, setFerramenta] = useState<Ferramenta>(null);
  const [vista, setVista] = useState<Vista>('pagina');
  const [ladoDireito, setLadoDireito] = useState(false);

  const bloqueado = Number(v.bloqueadores ?? 0) > 0;

  /** Uma página do livro, com os quadros do layout atual. */
  const pagina = (grid: string, quadros: { style: string; iconStyle?: string }[], primeiro = false) => (
    <div style={{ position: 'relative', flex: 1, background: '#FFFFFF', overflow: 'hidden' }}>
      <div style={css(grid)}>
        {primeiro && (
          <div style={css(v.frameA)} onClick={v.selectFrame}>
            <span style={css(v.faceBox)} />
            <span style={css(v.faceTag)}>rosto detectado</span>
          </div>
        )}
        {quadros.map((q, i) => (
          <div key={i} style={css(q.style)} onClick={v.selectFrame}>
            {q.iconStyle && (
              <span style={css(q.iconStyle)}>
                <IconGaleria size={20} />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col bg-[#E8EDF5]">
      {/* ---------------- topo ---------------- */}
      <header className="flex h-14 flex-none items-center gap-2 border-b border-line bg-surface px-3">
        <Link
          href="/meus-projetos"
          aria-label="Voltar aos álbuns"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-line text-ink-3"
        >
          <span className="rotate-180">
            <IconSeta size={18} />
          </span>
        </Link>

        <div className="min-w-0 flex-1">
          <p className="m-0 truncate text-[14.5px] font-bold leading-tight">{v.titulo}</p>
          <p className="m-0 text-[11.5px] leading-tight text-green">Salvo agora</p>
        </div>

        {v.orcamento}

        <Link
          href={`/projetos/${projetoId}`}
          aria-label="Revisar e finalizar"
          className={`flex h-10 flex-none items-center gap-1.5 rounded-xl px-3 text-[13px] font-bold text-white ${
            bloqueado ? 'bg-muted-2' : 'bg-lente shadow-card'
          }`}
        >
          <IconCheck size={16} />
        </Link>
      </header>

      {/* ---------------- canvas ---------------- */}
      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center px-3 py-2">
        {vista === 'lamina' ? (
          <div
            className="relative flex overflow-hidden rounded-[6px] shadow-[0_10px_28px_rgba(30,45,75,.22)]"
            style={{ aspectRatio: '2.04 / 1', width: '100%', maxHeight: '100%' }}
          >
            {pagina(v.pageGrid, v.pageFrames, true)}
            <span className="w-px flex-none bg-ink/10" />
            {pagina(v.rightGrid, v.rightFrames)}
          </div>
        ) : (
          <div
            className="relative flex overflow-hidden rounded-[6px] shadow-[0_10px_28px_rgba(30,45,75,.22)]"
            // altura manda, mas a largura limita: sem maxWidth a página
            // transborda a tela em vez de encolher
            style={{ aspectRatio: '1.02 / 1', height: '100%', maxWidth: '100%' }}
          >
            {ladoDireito
              ? pagina(v.rightGrid, v.rightFrames)
              : pagina(v.pageGrid, v.pageFrames, true)}
          </div>
        )}

        {/* setas sobrepostas: não roubam largura do canvas */}
        <button
          onClick={() => {
            if (vista === 'pagina' && ladoDireito) return setLadoDireito(false);
            setLadoDireito(false);
            v.goPrev();
          }}
          aria-label="Anterior"
          className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink-3 shadow-[0_2px_10px_rgba(11,18,32,.18)] backdrop-blur active:scale-90"
        >
          <span className="rotate-180">
            <IconSeta size={17} />
          </span>
        </button>
        <button
          onClick={() => {
            if (vista === 'pagina' && !ladoDireito) return setLadoDireito(true);
            setLadoDireito(false);
            v.goNext();
          }}
          aria-label="Próxima"
          className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-surface/90 text-ink-3 shadow-[0_2px_10px_rgba(11,18,32,.18)] backdrop-blur active:scale-90"
        >
          <IconSeta size={17} />
        </button>

        <div className="mt-2 flex flex-none items-center gap-2">
          <p className="m-0 text-[12px] font-semibold text-muted">
            {vista === 'pagina'
              ? `${v.spreadTitle} · ${ladoDireito ? 'direita' : 'esquerda'}`
              : v.spreadTitle}
          </p>
          <button
            onClick={() => setVista(vista === 'pagina' ? 'lamina' : 'pagina')}
            className="rounded-full border border-line bg-surface px-3 py-1 text-[11.5px] font-semibold text-ink-3 active:bg-blue-soft"
          >
            {vista === 'pagina' ? 'ver lâmina' : 'ver página'}
          </button>
        </div>
      </div>

      {/* ---------------- tira de páginas ---------------- */}
      <div className="flex-none border-t border-line bg-surface/70 px-3 py-2">
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {(v.spreads ?? []).map((s: any, i: number) => (
            <button
              key={i}
              onClick={s.pick}
              className="flex flex-none flex-col items-center gap-1"
              aria-label={`Lâmina ${s.label}`}
            >
              <span style={css(s.style)} className="!h-[38px] !w-[64px]">
                <span style={css(s.grid)}>
                  {s.cells.map((c: any, k: number) => (
                    <span key={k} style={css(c.style)} />
                  ))}
                </span>
                <span style={css(s.badge)} />
              </span>
              <span style={css(s.labelStyle)} className="!text-[10px]">
                {s.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ---------------- ferramentas ---------------- */}
      <nav className="flex flex-none items-stretch border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]">
        {FERRAMENTAS.map((f) => {
          const on = ferramenta === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFerramenta(on ? null : f.id)}
              aria-pressed={on}
              className="flex h-[62px] flex-1 flex-col items-center justify-center gap-1"
            >
              <span
                className={`flex h-8 w-12 items-center justify-center rounded-xl ${
                  on ? 'bg-lente text-white' : 'text-ink-3'
                }`}
              >
                {f.icone}
              </span>
              <span className={`text-[10.5px] ${on ? 'font-bold text-blue' : 'text-muted'}`}>
                {f.rotulo}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ---------------- folha da ferramenta ---------------- */}
      {ferramenta && (
        <>
          <div
            className="fixed inset-0 z-[70] bg-ink/40"
            onClick={() => setFerramenta(null)}
          />
          <div className="fixed inset-x-0 bottom-0 z-[71] flex max-h-[62vh] animate-[subir_.22s_cubic-bezier(.2,.8,.2,1)_both] flex-col rounded-t-[26px] bg-surface pb-[env(safe-area-inset-bottom)] shadow-[0_-14px_36px_rgba(11,18,32,.2)]">
            <div className="flex flex-none items-center gap-3 border-b border-line-2 px-5 py-3">
              <span className="h-1.5 w-10 rounded-full bg-[#DCE3EF]" />
              <p className="m-0 flex-1 text-[15px] font-bold">
                {FERRAMENTAS.find((f) => f.id === ferramenta)?.rotulo}
              </p>
              <button
                onClick={() => setFerramenta(null)}
                aria-label="Fechar"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-line text-muted"
              >
                <IconFechar />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              {ferramenta === 'fotos' && (
                <>
                  <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {(v.photoTabs ?? []).map((t: any, i: number) => (
                      <span key={i} style={css(t.style)} onClick={t.pick} className="flex-none">
                        {t.label}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {(v.photos ?? []).map((p: any, i: number) => (
                      <span
                        key={i}
                        style={css(p.style)}
                        onClick={v.selectFrame}
                        className="!cursor-pointer"
                      />
                    ))}
                  </div>
                  <p className="m-0 mt-3 text-[12px] text-muted">
                    Toque numa foto para colocá-la no quadro selecionado.
                  </p>
                </>
              )}

              {ferramenta === 'layouts' && (
                <>
                  <div className="mb-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {(v.counts ?? []).map((c: any, i: number) => (
                      <span key={i} style={css(c.style)} onClick={c.pick} className="flex-none">
                        {c.label}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-4 gap-2.5">
                    {(v.layouts ?? []).map((l: any, i: number) => (
                      <button
                        key={i}
                        onClick={l.pick}
                        title={l.title}
                        style={css(l.style)}
                        className="!h-[44px] !w-full"
                      >
                        <span style={css(l.grid)}>
                          {l.cells.map((c: any, k: number) => (
                            <span key={k} style={css(c.style)} />
                          ))}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {ferramenta === 'texto' && (
                <div className="flex flex-col gap-2.5">
                  {['Título', 'Subtítulo', 'Legenda', 'Data'].map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        v.selectText?.();
                        setFerramenta(null);
                      }}
                      className="rounded-2xl border border-line px-4 py-3.5 text-left text-[14px] font-semibold active:bg-blue-soft"
                    >
                      {t}
                    </button>
                  ))}
                  <p className="m-0 text-[12px] leading-[1.5] text-muted">
                    Depois de inserir, toque duas vezes no texto da lâmina para editar.
                  </p>
                </div>
              )}

              {ferramenta === 'fundos' && (
                <div className="grid grid-cols-5 gap-2.5">
                  {(v.bgSwatches ?? []).map((s: any, i: number) => (
                    <span key={i} style={css(s.style)} onClick={s.pick} />
                  ))}
                </div>
              )}

              {ferramenta === 'assistencia' && (
                <div className="flex flex-col gap-2.5">
                  <button
                    onClick={() => setFerramenta(null)}
                    className="flex items-center gap-3 rounded-2xl border border-line px-4 py-3.5 text-left active:bg-blue-soft"
                  >
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-blue-soft text-blue">
                      <IconSparkle size={18} />
                    </span>
                    <span>
                      <span className="block text-[14px] font-bold">Preencher quadros vazios</span>
                      <span className="block text-[12px] text-muted">
                        Usa as fotos ainda não escolhidas
                      </span>
                    </span>
                  </button>
                  <p className="m-0 text-[12px] leading-[1.5] text-muted">
                    As demais ações da assistência entram junto com o motor de diagramação.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
