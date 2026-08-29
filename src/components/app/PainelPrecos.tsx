'use client';

import { useState } from 'react';
import type { Produto, ModeloDoProduto } from '@/lib/comercial';
import { calcularPreco, reais } from '@/lib/preco';
import { salvarPrecoDoProduto } from '@/app/app/actions-comercial';

const CARD = 'rounded-[18px] border border-line bg-surface';
const CAMPO =
  'h-11 w-full rounded-[14px] border border-line bg-surface px-3.5 text-[14px] text-ink outline-none focus:border-blue';
const CAMPO_LINHA =
  'h-9 w-full rounded-[10px] border border-line bg-surface px-2.5 text-right text-[13px] text-ink outline-none focus:border-blue';
const ROTULO = 'text-[12.5px] font-semibold text-ink-3';
const BOTAO_PRIMARIO =
  'flex h-9 items-center justify-center gap-2 rounded-[12px] bg-lente px-3.5 text-[12.5px] font-bold text-white shadow-card hover:brightness-[1.06]';
const BOTAO =
  'flex h-9 items-center justify-center rounded-[12px] border border-line bg-surface px-3 text-[12.5px] font-semibold text-ink-3 hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue';
const TH = 'px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-[1px] text-muted-2';
const TD = 'px-3 py-3 align-middle text-[13px]';

/**
 * Tabela de preços por produto.
 *
 * O total NÃO é recalculado aqui: `calcularPreco` de `src/lib/preco.ts` é a
 * mesma função que o cliente vê no orçamento e que congela o valor no item do
 * pedido. Duplicar a conta nesta tela seria a segunda fonte de verdade que já
 * custou caro neste projeto.
 */
export default function PainelPrecos({
  produtos,
  modelos,
}: {
  produtos: Produto[];
  modelos: ModeloDoProduto[];
}) {
  const [editando, setEditando] = useState<string | null>(null);
  // Cenário da simulação: um álbum concreto para ver o preço final de cada linha.
  const [paginas, setPaginas] = useState(40);
  const [fotos, setFotos] = useState(80);

  const modeloDe = (id: string | null) => modelos.find((m) => m.id === id) ?? null;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="m-0 text-[12.5px] font-semibold uppercase tracking-[1.2px] text-muted-2">
            Loja e catálogo · Preços
          </p>
          <h1 className="m-0 mt-1.5 text-[26px] font-extrabold tracking-[-.9px]">
            Tabela de preços
          </h1>
          <p className="m-0 mt-1.5 text-[13.5px] text-muted">
            Preço base, extras e prazo de cada produto. O que você mudar aqui vale para os álbuns em
            andamento — o valor só congela quando o pedido é fechado.
          </p>
        </div>
      </div>

      {produtos.length === 0 ? (
        <div className={`${CARD} p-8 text-center`}>
          <p className="m-0 text-[15px] font-bold">Não há preço para editar</p>
          <p className="mx-auto m-0 mt-2 max-w-[520px] text-[13.5px] text-muted">
            A tabela de preços é a lista do seu catálogo. Cadastre um produto em{' '}
            <a href="/catalogo" className="font-semibold text-blue">
              Catálogo
            </a>{' '}
            e ele aparece aqui.
          </p>
        </div>
      ) : (
        <>
          {/* ---------------- simulação ---------------- */}
          <section className={`${CARD} p-5`}>
            <p className="m-0 mb-1 text-[15px] font-bold">Simular um álbum</p>
            <p className="m-0 mb-4 text-[12.5px] text-muted">
              Escolha um tamanho de álbum e veja quanto cada produto custaria ao cliente. É a mesma
              conta do orçamento dele.
            </p>
            <div className="flex flex-wrap gap-4">
              <label className="flex w-[160px] flex-col gap-1.5">
                <span className={ROTULO}>Páginas</span>
                <input
                  type="number"
                  min={0}
                  value={paginas}
                  onChange={(e) => setPaginas(Math.max(0, Number(e.target.value) || 0))}
                  className={CAMPO}
                />
              </label>
              <label className="flex w-[160px] flex-col gap-1.5">
                <span className={ROTULO}>Fotos</span>
                <input
                  type="number"
                  min={0}
                  value={fotos}
                  onChange={(e) => setFotos(Math.max(0, Number(e.target.value) || 0))}
                  className={CAMPO}
                />
              </label>
            </div>
          </section>

          {/* ---------------- tabela ---------------- */}
          <section className={`${CARD} overflow-x-auto`}>
            <table className="w-full min-w-[860px] border-collapse">
              <thead>
                <tr className="border-b border-line bg-surface-2">
                  <th className={TH}>Produto</th>
                  <th className={`${TH} text-right`}>Preço base</th>
                  <th className={`${TH} text-right`}>Página extra</th>
                  <th className={`${TH} text-right`}>Foto extra</th>
                  <th className={`${TH} text-right`}>Prazo</th>
                  <th className={`${TH} text-right`}>
                    {paginas} pág · {fotos} fotos
                  </th>
                  <th className={TH} />
                </tr>
              </thead>
              <tbody>
                {produtos.map((p) => {
                  const m = modeloDe(p.template_id);
                  const orcamento = calcularPreco(
                    {
                      preco_base: p.preco_base,
                      // O que já vem incluído é do MODELO, não do produto: a
                      // tabela `produtos` não tem essas colunas. Sem modelo,
                      // zero incluído — tudo é extra, e a tela avisa.
                      paginas_incluidas: m?.paginas_incluidas ?? 0,
                      fotos_incluidas: m?.fotos_incluidas ?? 0,
                      preco_pagina_extra: p.preco_pagina_extra,
                      preco_foto_extra: p.preco_foto_extra,
                    },
                    { paginas, fotos },
                  );
                  const aberto = editando === p.id;

                  if (aberto) {
                    return (
                      <tr key={p.id} className="border-b border-line-2 bg-blue-soft">
                        <td className={TD} colSpan={7}>
                          <form
                            action={async (fd) => {
                              await salvarPrecoDoProduto(fd);
                              setEditando(null);
                            }}
                            className="flex flex-wrap items-end gap-3"
                          >
                            <input type="hidden" name="produto_id" value={p.id} />
                            <span className="mr-2 self-center text-[13.5px] font-bold">{p.nome}</span>
                            <label className="flex w-[130px] flex-col gap-1">
                              <span className={ROTULO}>Preço base</span>
                              <input name="preco_base" defaultValue={p.preco_base} className={CAMPO_LINHA} />
                            </label>
                            <label className="flex w-[130px] flex-col gap-1">
                              <span className={ROTULO}>Página extra</span>
                              <input
                                name="preco_pagina_extra"
                                defaultValue={p.preco_pagina_extra}
                                className={CAMPO_LINHA}
                              />
                            </label>
                            <label className="flex w-[130px] flex-col gap-1">
                              <span className={ROTULO}>Foto extra</span>
                              <input
                                name="preco_foto_extra"
                                defaultValue={p.preco_foto_extra}
                                className={CAMPO_LINHA}
                              />
                            </label>
                            <label className="flex w-[110px] flex-col gap-1">
                              <span className={ROTULO}>Prazo (dias)</span>
                              <input
                                name="prazo_producao_dias"
                                type="number"
                                min={0}
                                defaultValue={p.prazo_producao_dias}
                                className={CAMPO_LINHA}
                              />
                            </label>
                            <div className="flex-1" />
                            <button type="button" onClick={() => setEditando(null)} className={BOTAO}>
                              Cancelar
                            </button>
                            <button type="submit" className={BOTAO_PRIMARIO}>
                              Salvar
                            </button>
                          </form>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr key={p.id} className="border-b border-line-2">
                      <td className={TD}>
                        <span className="block font-semibold">{p.nome}</span>
                        <span className="block text-[11.5px] text-muted-2">
                          {m
                            ? `${m.nome} · ${m.paginas_incluidas} páginas e ${m.fotos_incluidas} fotos incluídas`
                            : 'Sem modelo — nada incluído, tudo entra como extra'}
                          {!p.ativo && ' · fora da vitrine'}
                        </span>
                      </td>
                      <td className={`${TD} text-right font-semibold`}>{reais(p.preco_base)}</td>
                      <td className={`${TD} text-right`}>{reais(p.preco_pagina_extra)}</td>
                      <td className={`${TD} text-right`}>
                        {p.preco_foto_extra > 0 ? reais(p.preco_foto_extra) : '—'}
                      </td>
                      <td className={`${TD} text-right`}>{p.prazo_producao_dias} d</td>
                      <td className={`${TD} text-right`}>
                        <span className="block font-extrabold">{reais(orcamento.total)}</span>
                        <span className="block text-[11px] text-muted-2">
                          {orcamento.paginasExtras} pág + {orcamento.fotosExtras} fotos extras
                        </span>
                      </td>
                      <td className={`${TD} text-right`}>
                        <button onClick={() => setEditando(p.id)} className={`${BOTAO} ml-auto`}>
                          Editar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
        </>
      )}
    </>
  );
}
