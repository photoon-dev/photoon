'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { Foto, Projeto } from '@/lib/data';
import {
  aplicarLayout,
  calcularProgresso,
  laminasSemFoto,
  novaLamina,
  type Lamina,
  type PresetTexto,
  type Quadro,
} from '@/lib/album';
import { salvarLaminas, renomearProjeto } from '@/app/actions';
import Topbar, { type EstadoSalvamento } from '@/components/editor/Topbar';
import Canvas from '@/components/editor/Canvas';
import Storyboard from '@/components/editor/Storyboard';
import Inspetor from '@/components/editor/Inspetor';
import {
  PainelFotos,
  PainelLayouts,
  PainelTexto,
  PainelFundos,
  PainelAssistencia,
  type Aba,
} from '@/components/editor/Paineis';
import { IconGaleria, IconGrade, IconLapis, IconSparkle, IconFoto } from '@/components/icons';

const ABAS: { id: Aba; rotulo: string; Icone: typeof IconGaleria }[] = [
  { id: 'fotos', rotulo: 'Fotos', Icone: IconGaleria },
  { id: 'layouts', rotulo: 'Layouts', Icone: IconGrade },
  { id: 'texto', rotulo: 'Texto', Icone: IconLapis },
  { id: 'fundos', rotulo: 'Fundos', Icone: IconFoto },
  { id: 'assistencia', rotulo: 'Assistência', Icone: IconSparkle },
];

const ATRASO_AUTOSAVE = 1200;

export default function EditorShell({
  projeto,
  fotos,
}: {
  projeto: Projeto;
  fotos: Foto[];
}) {
  const [laminas, setLaminas] = useState<Lamina[]>(
    () => ((projeto.paginas as Lamina[] | undefined)?.length
      ? (projeto.paginas as Lamina[])
      : [novaLamina(2)]),
  );
  const [atual, setAtual] = useState(0);
  const [aba, setAba] = useState<Aba | null>('fotos');
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [titulo, setTitulo] = useState(projeto.titulo);
  const [estado, setEstado] = useState<EstadoSalvamento>('salvo');

  const porId = useMemo(() => new Map(fotos.map((f) => [f.id, f])), [fotos]);
  const lamina = laminas[Math.min(atual, laminas.length - 1)];

  const usadas = useMemo(() => {
    const s = new Set<string>();
    for (const l of laminas)
      for (const q of l.quadros) if (q.tipo === 'foto' && q.fotoId) s.add(q.fotoId);
    return s;
  }, [laminas]);

  const bloqueadores = laminasSemFoto(laminas).length;

  // --- autosave com debounce ---------------------------------------------
  const primeiraRenderizacao = useRef(true);
  useEffect(() => {
    if (primeiraRenderizacao.current) {
      primeiraRenderizacao.current = false;
      return;
    }
    setEstado('salvando');
    const t = setTimeout(() => {
      salvarLaminas(projeto.id, laminas)
        .then(() => setEstado('salvo'))
        .catch(() => setEstado('erro'));
    }, ATRASO_AUTOSAVE);
    return () => clearTimeout(t);
  }, [laminas, projeto.id]);

  const tituloInicial = useRef(projeto.titulo);
  useEffect(() => {
    if (titulo === tituloInicial.current) return;
    const t = setTimeout(() => {
      renomearProjeto(projeto.id, titulo).catch(() => setEstado('erro'));
      tituloInicial.current = titulo;
    }, ATRASO_AUTOSAVE);
    return () => clearTimeout(t);
  }, [titulo, projeto.id]);

  // --- edicao da lamina atual --------------------------------------------
  const mudarLamina = useCallback(
    (fn: (l: Lamina) => Lamina) => {
      setLaminas((antes) => antes.map((l, i) => (i === atual ? fn(l) : l)));
    },
    [atual],
  );

  const mudarQuadro = useCallback(
    (quadroId: string, mudanca: Partial<Quadro>) => {
      mudarLamina((l) => ({
        ...l,
        quadros: l.quadros.map((q) => (q.id === quadroId ? ({ ...q, ...mudanca } as Quadro) : q)),
      }));
    },
    [mudarLamina],
  );

  const soltarFoto = useCallback(
    (quadroId: string, fotoId: string) => mudarQuadro(quadroId, { fotoId } as Partial<Quadro>),
    [mudarQuadro],
  );

  const inserirTexto = useCallback(
    (preset: PresetTexto) => {
      mudarLamina((l) => ({
        ...l,
        quadros: [
          ...l.quadros,
          {
            id: crypto.randomUUID(),
            tipo: 'texto',
            texto: 'Um dia para lembrar',
            preset,
            cor: '#0B1220',
            x: 28,
            y: 44,
            w: 44,
            h: 12,
          },
        ],
      }));
    },
    [mudarLamina],
  );

  /** Preenche os quadros vazios da lamina com fotos ainda nao usadas. */
  const preencherVazios = useCallback(() => {
    const disponiveis = fotos.filter((f) => !usadas.has(f.id));
    let i = 0;
    mudarLamina((l) => ({
      ...l,
      quadros: l.quadros.map((q) =>
        q.tipo === 'foto' && !q.fotoId && disponiveis[i]
          ? { ...q, fotoId: disponiveis[i++].id }
          : q,
      ),
    }));
  }, [fotos, usadas, mudarLamina]);

  const removerSelecionado = useCallback(() => {
    if (!selecionado) return;
    mudarLamina((l) => ({ ...l, quadros: l.quadros.filter((q) => q.id !== selecionado) }));
    setSelecionado(null);
  }, [selecionado, mudarLamina]);

  // Delete remove o objeto selecionado (U08, atalhos).
  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      const alvo = e.target as HTMLElement;
      if (alvo.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(alvo.tagName)) return;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        removerSelecionado();
      }
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [removerSelecionado]);

  const quadroSelecionado = lamina.quadros.find((q) => q.id === selecionado) ?? null;
  const vaziosNaLamina = lamina.quadros.filter((q) => q.tipo === 'foto' && !q.fotoId).length;

  return (
    <>
      <Topbar
        projetoId={projeto.id}
        titulo={titulo}
        onTitulo={setTitulo}
        estado={estado}
        zoom={zoom}
        onZoom={setZoom}
        bloqueadores={bloqueadores}
      />

      <div className="flex min-h-0 flex-1">
        {/* barra de ferramentas, 72px */}
        <nav className="flex w-[72px] flex-none flex-col items-center gap-1 border-r border-line bg-surface py-3">
          {ABAS.map(({ id, rotulo, Icone }) => (
            <button
              key={id}
              onClick={() => setAba((a) => (a === id ? null : id))}
              title={rotulo}
              className={`flex w-14 flex-col items-center gap-1 rounded-xl py-2 text-[10.5px] font-semibold ${
                aba === id ? 'bg-blue-soft text-blue' : 'text-ink-3 hover:bg-page hover:text-blue'
              }`}
            >
              <Icone size={22} />
              {rotulo}
            </button>
          ))}
        </nav>

        {/* painel contextual, 328px */}
        {aba && (
          <aside className="flex w-[328px] flex-none flex-col overflow-y-auto border-r border-line bg-surface">
            {aba === 'fotos' && (
              <PainelFotos fotos={fotos} usadas={usadas} urlDe={(f) => f.url} />
            )}
            {aba === 'layouts' && (
              <PainelLayouts onAplicar={(n) => mudarLamina((l) => aplicarLayout(l, n))} />
            )}
            {aba === 'texto' && <PainelTexto onInserir={inserirTexto} />}
            {aba === 'fundos' && (
              <PainelFundos
                atual={lamina.fundo}
                onAplicar={(cor, tudo) =>
                  tudo
                    ? setLaminas((antes) => antes.map((l) => ({ ...l, fundo: cor })))
                    : mudarLamina((l) => ({ ...l, fundo: cor }))
                }
              />
            )}
            {aba === 'assistencia' && (
              <PainelAssistencia vaziosNaLamina={vaziosNaLamina} onPreencher={preencherVazios} />
            )}
          </aside>
        )}

        <Canvas
          lamina={lamina}
          indice={atual}
          total={laminas.length}
          zoom={zoom}
          fotos={porId}
          selecionado={selecionado}
          onSelecionar={setSelecionado}
          onSoltarFoto={soltarFoto}
          onEditarTexto={(id, texto) => mudarQuadro(id, { texto } as Partial<Quadro>)}
          guias
        />

        <Inspetor
          quadro={quadroSelecionado}
          onAtualizar={(m) => selecionado && mudarQuadro(selecionado, m)}
          onRemover={removerSelecionado}
        />
      </div>

      <Storyboard
        laminas={laminas}
        atual={atual}
        onIr={(i) => {
          setAtual(i);
          setSelecionado(null);
        }}
        onAdicionar={() => {
          setLaminas((antes) => [...antes, novaLamina(2)]);
          setAtual(laminas.length);
        }}
        onRemover={(i) => {
          setLaminas((antes) => antes.filter((_, j) => j !== i));
          setAtual((a) => Math.max(0, Math.min(a, laminas.length - 2)));
        }}
      />
    </>
  );
}
