'use client';

import type { Foto } from '@/lib/data';
import { PRESETS_TEXTO, layoutsDisponiveis, type PresetTexto } from '@/lib/album';
import { IconGaleria, IconSparkle } from '@/components/icons';

export type Aba = 'fotos' | 'layouts' | 'texto' | 'fundos' | 'assistencia';

const FUNDOS = [
  { rotulo: 'Branco', cor: '#FFFFFF' },
  { rotulo: 'Névoa', cor: '#F4F7FC' },
  { rotulo: 'Linho', cor: '#F3EFE7' },
  { rotulo: 'Azul claro', cor: '#EAF0FF' },
  { rotulo: 'Ciano claro', cor: '#E4F8FC' },
  { rotulo: 'Grafite', cor: '#0B1220' },
];

const TituloPainel = ({ titulo, sub }: { titulo: string; sub: string }) => (
  <div className="border-b border-line-2 px-4 py-3.5">
    <p className="m-0 text-[14.5px] font-bold">{titulo}</p>
    <p className="m-0 mt-0.5 text-[12px] text-muted">{sub}</p>
  </div>
);

export function PainelFotos({
  fotos,
  usadas,
  urlDe,
}: {
  fotos: Foto[];
  usadas: Set<string>;
  urlDe: (f: Foto) => string;
}) {
  return (
    <>
      <TituloPainel
        titulo="Fotos"
        sub={`${usadas.size} de ${fotos.length} · arraste para um quadro da lâmina`}
      />
      {fotos.length === 0 ? (
        <p className="px-4 py-6 text-[13px] text-muted">
          A empresa ainda não liberou fotos nesta galeria.
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-1.5 overflow-y-auto p-3">
          {fotos.map((f) => (
            <button
              key={f.id}
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/photoon-foto', f.id)}
              title={usadas.has(f.id) ? 'Já usada no álbum' : 'Arraste para um quadro'}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 ${
                usadas.has(f.id) ? 'border-blue' : 'border-transparent hover:border-line'
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={urlDe(f)} alt="" className="h-full w-full object-cover" draggable={false} />
              {usadas.has(f.id) && (
                <span className="absolute right-1 top-1 rounded-full bg-blue px-1.5 py-0.5 text-[9px] font-bold text-white">
                  usada
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </>
  );
}

export function PainelLayouts({ onAplicar }: { onAplicar: (n: number) => void }) {
  return (
    <>
      <TituloPainel titulo="Layouts" sub="Reorganiza os quadros da lâmina atual" />
      <div className="grid grid-cols-2 gap-2.5 p-3">
        {layoutsDisponiveis().map((n) => (
          <button
            key={n}
            onClick={() => onAplicar(n)}
            className="rounded-xl border border-line bg-surface p-2 hover:border-blue"
          >
            <div className="mb-1.5 grid aspect-[3/2] grid-cols-2 grid-rows-2 gap-1 rounded bg-page p-1">
              {Array.from({ length: n }).map((_, i) => (
                <span
                  key={i}
                  className={`rounded-sm bg-[#CBD5E6] ${n === 1 ? 'col-span-2 row-span-2' : ''} ${
                    n === 3 && i === 0 ? 'row-span-2' : ''
                  }`}
                />
              ))}
            </div>
            <span className="text-[12px] font-semibold text-ink-3">
              {n} {n === 1 ? 'foto' : 'fotos'}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}

export function PainelTexto({ onInserir }: { onInserir: (p: PresetTexto) => void }) {
  return (
    <>
      <TituloPainel titulo="Texto" sub="Clique para inserir na lâmina" />
      <div className="flex flex-col gap-2 p-3">
        {(Object.keys(PRESETS_TEXTO) as PresetTexto[]).map((p) => (
          <button
            key={p}
            onClick={() => onInserir(p)}
            className="rounded-xl border border-line bg-surface px-3.5 py-3 text-left hover:border-blue hover:bg-blue-soft"
          >
            <p className="m-0 text-[13.5px] font-bold">{PRESETS_TEXTO[p].rotulo}</p>
            <p className="m-0 mt-0.5 text-[11.5px] text-muted">{PRESETS_TEXTO[p].descricao}</p>
          </button>
        ))}
      </div>
      <p className="px-4 pb-4 text-[11.5px] leading-[1.55] text-muted">
        Depois de inserir, dê um duplo clique no texto na lâmina para editar o conteúdo. As demais
        opções ficam no inspetor, à direita.
      </p>
    </>
  );
}

export function PainelFundos({
  atual,
  onAplicar,
}: {
  atual: string;
  onAplicar: (cor: string, tudo: boolean) => void;
}) {
  return (
    <>
      <TituloPainel titulo="Fundos" sub="Aplique na lâmina atual ou no álbum inteiro" />
      <div className="grid grid-cols-3 gap-2 p-3">
        {FUNDOS.map((f) => (
          <button
            key={f.cor}
            onClick={() => onAplicar(f.cor, false)}
            title={f.rotulo}
            className={`aspect-square rounded-xl border-2 ${
              atual === f.cor ? 'border-blue' : 'border-line'
            }`}
            style={{ background: f.cor }}
          />
        ))}
      </div>
      <div className="px-3 pb-3">
        <button
          onClick={() => onAplicar(atual, true)}
          className="w-full rounded-xl border border-line px-3 py-2.5 text-[12.5px] font-semibold text-ink-3 hover:border-blue hover:bg-blue-soft hover:text-blue"
        >
          Aplicar em todo o álbum
        </button>
      </div>
    </>
  );
}

export function PainelAssistencia({
  vaziosNaLamina,
  onPreencher,
}: {
  vaziosNaLamina: number;
  onPreencher: () => void;
}) {
  return (
    <>
      <TituloPainel titulo="Assistência" sub="Ações automáticas para esta lâmina" />
      <div className="flex flex-col gap-2 p-3">
        <button
          onClick={onPreencher}
          disabled={vaziosNaLamina === 0}
          className="flex items-start gap-3 rounded-xl border border-line bg-surface px-3.5 py-3 text-left hover:border-blue hover:bg-blue-soft disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-line disabled:hover:bg-surface"
        >
          <span className="mt-0.5 flex-none text-blue">
            <IconGaleria size={17} />
          </span>
          <span className="min-w-0">
            <span className="block text-[13.5px] font-bold">Preencher quadros vazios</span>
            <span className="block text-[11.5px] text-muted">
              {vaziosNaLamina === 0
                ? 'Nenhum quadro vazio nesta lâmina'
                : `${vaziosNaLamina} quadro(s) com fotos ainda não usadas`}
            </span>
          </span>
        </button>

        {/* Ações restantes da spec (U17): melhor layout, equilibrar espaçamento,
            harmonizar fundo, preto e branco — dependem do motor de diagramação. */}
      </div>
      <p className="flex items-start gap-2 px-4 pb-4 text-[11.5px] leading-[1.55] text-muted">
        <span className="mt-0.5 flex-none text-blue">
          <IconSparkle size={14} />
        </span>
        Estas ações seguem regras fixas de diagramação — orientação das fotos, quadros livres e
        espaçamento.
      </p>
    </>
  );
}
