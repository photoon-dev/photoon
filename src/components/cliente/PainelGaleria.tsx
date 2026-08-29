'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Foto, PessoaDaGaleria, RostoDaFoto } from '@/lib/data';

/**
 * Galeria de fotos do cliente — a tela U04.
 *
 * Não veio no zip do design: o `.dc.html` é referenciado pelo projeto mas não
 * está no pacote. Construída a partir da especificação, no mesmo sistema visual
 * das demais telas do cliente.
 *
 * O filtro por pessoa usa os rostos já agrupados: cada bolinha é um recorte de
 * um rosto real da galeria, como no Google Fotos. É o que resolve o problema de
 * achar "as fotos da vovó" num acervo de centenas.
 */

type Filtro = 'todas' | 'verticais' | 'horizontais' | 'com-pessoas' | 'sem-pessoas';

const FILTROS: [Filtro, string][] = [
  ['todas', 'Todas'],
  ['com-pessoas', 'Com pessoas'],
  ['sem-pessoas', 'Sem pessoas'],
  ['verticais', 'Verticais'],
  ['horizontais', 'Horizontais'],
];

export default function PainelGaleria({
  fotos,
  rostos,
  pessoas,
  galeriaNome,
}: {
  fotos: Foto[];
  rostos: RostoDaFoto[];
  pessoas: PessoaDaGaleria[];
  galeriaNome: string;
}) {
  const [filtro, setFiltro] = useState<Filtro>('todas');
  const [pessoa, setPessoa] = useState<string | null>(null);
  const [aberta, setAberta] = useState<number | null>(null);

  const porFoto = useMemo(() => {
    const m = new Map<string, RostoDaFoto[]>();
    for (const r of rostos) m.set(r.fotoId, [...(m.get(r.fotoId) ?? []), r]);
    return m;
  }, [rostos]);

  const porId = useMemo(() => new Map(fotos.map((f) => [f.id, f])), [fotos]);

  /** Recorte quadrado do rosto de capa, para a bolinha. */
  const capa = (p: PessoaDaGaleria) => {
    const r = rostos.find((x) => x.id === p.rostoCapaId) ?? rostos.find((x) => x.pessoaId === p.id);
    const f = r ? porId.get(r.fotoId) : undefined;
    if (!r || !f) return null;
    // A caixa vem em fração da foto; ampliar em 2,2x deixa o rosto centrado com
    // um pouco de cabelo e ombro, que é o que faz reconhecer a pessoa.
    const zoom = 2.2;
    return {
      backgroundImage: `url('${f.url}')`,
      backgroundSize: `${(1 / r.caixa.w) * 100 * (1 / zoom) * zoom}% auto`,
      backgroundPosition: `${((r.caixa.x + r.caixa.w / 2) * 100).toFixed(1)}% ${((r.caixa.y + r.caixa.h / 2) * 100).toFixed(1)}%`,
    } as React.CSSProperties;
  };

  const visiveis = useMemo(() => {
    let lista = fotos;
    if (pessoa) {
      const ids = new Set(rostos.filter((r) => r.pessoaId === pessoa).map((r) => r.fotoId));
      lista = lista.filter((f) => ids.has(f.id));
    }
    switch (filtro) {
      case 'verticais':
        return lista.filter((f) => f.largura && f.altura && f.altura > f.largura);
      case 'horizontais':
        return lista.filter((f) => f.largura && f.altura && f.largura >= f.altura);
      case 'com-pessoas':
        return lista.filter((f) => (porFoto.get(f.id)?.length ?? 0) > 0);
      case 'sem-pessoas':
        return lista.filter((f) => (porFoto.get(f.id)?.length ?? 0) === 0);
      default:
        return lista;
    }
  }, [fotos, rostos, filtro, pessoa, porFoto]);

  const nomePessoa = pessoas.find((p) => p.id === pessoa)?.nome;

  return (
    <div className="mx-auto flex max-w-[1180px] flex-col gap-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="m-0 text-[26px] font-extrabold tracking-[-.9px]">Galeria</h1>
          <p className="m-0 mt-1.5 text-[13.5px] text-muted">
            {galeriaNome} · {fotos.length} {fotos.length === 1 ? 'foto' : 'fotos'}
            {visiveis.length !== fotos.length && ` · ${visiveis.length} nesta seleção`}
          </p>
        </div>
        <Link
          href="/meus-projetos"
          className="flex h-11 items-center rounded-[14px] bg-lente px-5 text-[13.5px] font-bold text-white shadow-card hover:brightness-[1.06]"
        >
          Montar um álbum
        </Link>
      </div>

      {/* ---------------------------- pessoas ---------------------------- */}
      {pessoas.length > 0 && (
        <section className="rounded-[18px] border border-line bg-surface p-5">
          <p className="m-0 mb-3 text-[11px] font-bold uppercase tracking-[1.2px] text-muted-2">
            Pessoas nesta galeria
          </p>
          <div className="flex flex-wrap gap-4">
            {pessoas.map((p) => {
              const est = capa(p);
              const on = pessoa === p.id;
              const quantas = rostos.filter((r) => r.pessoaId === p.id).length;
              return (
                <button
                  key={p.id}
                  onClick={() => setPessoa(on ? null : p.id)}
                  className="flex w-[76px] flex-col items-center gap-1.5"
                  title={`${p.nome ?? 'Sem nome'} · ${quantas} ${quantas === 1 ? 'foto' : 'fotos'}`}
                >
                  <span
                    style={est ?? undefined}
                    className={`h-[62px] w-[62px] rounded-full bg-blue-soft bg-cover bg-center transition-all ${
                      on ? 'ring-[3px] ring-blue ring-offset-2' : 'ring-1 ring-line'
                    }`}
                  />
                  <span
                    className={`w-full truncate text-center text-[11.5px] ${
                      on ? 'font-bold text-blue' : 'text-muted'
                    }`}
                  >
                    {p.nome ?? 'Sem nome'}
                  </span>
                </button>
              );
            })}
          </div>
          {pessoa && (
            <button
              onClick={() => setPessoa(null)}
              className="mt-3 text-[12.5px] font-semibold text-blue hover:underline"
            >
              Mostrar todas de novo
            </button>
          )}
        </section>
      )}

      {/* ---------------------------- filtros ---------------------------- */}
      <div className="flex flex-wrap gap-2">
        {FILTROS.map(([id, rot]) => (
          <button
            key={id}
            onClick={() => setFiltro(id)}
            className={`h-9 rounded-full px-4 text-[12.5px] ${
              filtro === id
                ? 'bg-ink font-bold text-white'
                : 'border border-line bg-surface font-medium text-ink-3 hover:border-[#D6E2FC] hover:text-blue'
            }`}
          >
            {rot}
          </button>
        ))}
      </div>

      {/* ----------------------------- grade ----------------------------- */}
      {visiveis.length === 0 ? (
        <p className="m-0 rounded-[18px] border border-line bg-surface px-6 py-14 text-center text-[13.5px] text-muted">
          {fotos.length === 0
            ? 'A loja ainda não liberou fotos para você.'
            : nomePessoa
              ? `Nenhuma foto de ${nomePessoa} com este filtro.`
              : 'Nenhuma foto com este filtro.'}
        </p>
      ) : (
        <div className="grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(160px,1fr))]">
          {visiveis.map((f, i) => {
            const n = porFoto.get(f.id)?.length ?? 0;
            return (
              <button
                key={f.id}
                onClick={() => setAberta(i)}
                className="group relative aspect-[3/4] overflow-hidden rounded-[14px] bg-page"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={f.url}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform group-hover:scale-[1.04]"
                />
                {n > 0 && (
                  <span
                    title={`${n} ${n === 1 ? 'rosto' : 'rostos'}`}
                    className="absolute right-2 top-2 flex h-6 items-center gap-1 rounded-full bg-ink/65 px-2 text-[11px] font-bold text-white backdrop-blur-[2px]"
                  >
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth={2.2}>
                      <circle cx="12" cy="9" r="3.4" />
                      <path d="M5 20c1-3.6 3.7-5.4 7-5.4s6 1.8 7 5.4" strokeLinecap="round" />
                    </svg>
                    {n}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ----------------------------- visor ----------------------------- */}
      {aberta !== null && visiveis[aberta] && (
        <div
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/80 p-6 backdrop-blur-[3px]"
          onClick={() => setAberta(null)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={visiveis[aberta].url}
            alt=""
            className="max-h-full max-w-full rounded-[10px] object-contain shadow-[0_30px_80px_rgba(0,0,0,.5)]"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setAberta((a) => (a === null ? null : Math.max(0, a - 1)));
            }}
            className="absolute left-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-ink"
            aria-label="Anterior"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M14 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setAberta((a) => (a === null ? null : Math.min(visiveis.length - 1, a + 1)));
            }}
            className="absolute right-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-ink"
            aria-label="Próxima"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M10 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span className="absolute bottom-5 rounded-full bg-ink/70 px-4 py-2 text-[12.5px] font-semibold text-white">
            {aberta + 1} de {visiveis.length}
          </span>
        </div>
      )}
    </div>
  );
}
