'use client';

import { useMemo, useState } from 'react';
import type { Produto, ModeloDoProduto } from '@/lib/comercial';
import { reais } from '@/lib/preco';
import { salvarProduto, alternarProduto } from '@/app/app/actions-comercial';

const CARD = 'rounded-[18px] border border-line bg-surface';
const CAMPO =
  'h-11 w-full rounded-[14px] border border-line bg-surface px-3.5 text-[14px] text-ink outline-none focus:border-blue';
const ROTULO = 'text-[12.5px] font-semibold text-ink-3';
const AJUDA = 'text-[11.5px] text-muted-2';
const BOTAO_PRIMARIO =
  'flex h-11 items-center justify-center gap-2 rounded-[14px] bg-lente px-4 text-[13.5px] font-bold text-white shadow-card hover:brightness-[1.06]';
const BOTAO =
  'flex h-9 items-center justify-center rounded-[12px] border border-line bg-surface px-3 text-[12.5px] font-semibold text-ink-3 hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue';

/**
 * Categorias sugeridas. A coluna é texto livre — estas são só um ponto de
 * partida, e as que já existem no catálogo entram na lista automaticamente.
 */
const CATEGORIAS_SUGERIDAS = ['album', 'revista', 'quadro', 'impressao', 'caixa', 'brinde'];

export default function PainelCatalogo({
  produtos,
  modelos,
}: {
  produtos: Produto[];
  modelos: ModeloDoProduto[];
}) {
  const [editando, setEditando] = useState<Produto | null>(null);
  const [novo, setNovo] = useState(false);
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('todas');

  const categorias = useMemo(
    () => Array.from(new Set([...CATEGORIAS_SUGERIDAS, ...produtos.map((p) => p.categoria)])).sort(),
    [produtos],
  );

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return produtos.filter((p) => {
      if (categoria !== 'todas' && p.categoria !== categoria) return false;
      if (!termo) return true;
      return (
        p.nome.toLowerCase().includes(termo) ||
        (p.sku ?? '').toLowerCase().includes(termo) ||
        (p.descricao ?? '').toLowerCase().includes(termo)
      );
    });
  }, [produtos, busca, categoria]);

  const ativos = produtos.filter((p) => p.ativo).length;
  const form = editando;
  const modeloDe = (id: string | null) => modelos.find((m) => m.id === id) ?? null;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="m-0 text-[12.5px] font-semibold uppercase tracking-[1.2px] text-muted-2">
            Loja e catálogo · Catálogo
          </p>
          <h1 className="m-0 mt-1.5 text-[26px] font-extrabold tracking-[-.9px]">
            Produtos da loja
          </h1>
          <p className="m-0 mt-1.5 text-[13.5px] text-muted">
            {produtos.length} produto{produtos.length === 1 ? '' : 's'} · {ativos} na vitrine · os
            ativos aparecem para o cliente
          </p>
        </div>
        <button
          onClick={() => {
            setEditando(null);
            setNovo(true);
          }}
          className={BOTAO_PRIMARIO}
        >
          Novo produto
        </button>
      </div>

      {/* ---------------- formulário ---------------- */}
      {(novo || form) && (
        <form action={salvarProduto} className={`${CARD} p-6`} key={form?.id ?? 'novo'}>
          <p className="m-0 mb-4 text-[15px] font-bold">
            {form ? `Editar ${form.nome}` : 'Novo produto'}
          </p>
          {form && <input type="hidden" name="produto_id" value={form.id} />}

          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-1.5 md:col-span-2">
              <span className={ROTULO}>Nome</span>
              <input
                name="nome"
                required
                defaultValue={form?.nome}
                placeholder="Fotolivro 30×30 capa dura"
                className={CAMPO}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ROTULO}>Categoria</span>
              <input
                name="categoria"
                list="categorias-produto"
                defaultValue={form?.categoria ?? 'album'}
                className={CAMPO}
              />
              <datalist id="categorias-produto">
                {categorias.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </label>

            <label className="flex flex-col gap-1.5 md:col-span-2">
              <span className={ROTULO}>Descrição</span>
              <input
                name="descricao"
                defaultValue={form?.descricao ?? ''}
                placeholder="O que o cliente lê na vitrine"
                className={CAMPO}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ROTULO}>SKU</span>
              <input name="sku" defaultValue={form?.sku ?? ''} className={CAMPO} />
            </label>

            <label className="flex flex-col gap-1.5 md:col-span-2">
              <span className={ROTULO}>Modelo de álbum</span>
              <select name="template_id" defaultValue={form?.template_id ?? ''} className={CAMPO}>
                <option value="">Sem modelo — produto avulso</option>
                {modelos.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome} · {m.largura_mm / 10}×{m.altura_mm / 10} cm
                  </option>
                ))}
              </select>
              <span className={AJUDA}>
                O modelo dá o formato e quantas páginas e fotos já vêm incluídas no preço base.
              </span>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ROTULO}>Ordem na vitrine</span>
              <input name="ordem" type="number" min={0} defaultValue={form?.ordem ?? 0} className={CAMPO} />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={ROTULO}>Preço base (R$)</span>
              <input name="preco_base" defaultValue={form?.preco_base ?? ''} placeholder="0,00" className={CAMPO} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ROTULO}>Página extra (R$)</span>
              <input
                name="preco_pagina_extra"
                defaultValue={form?.preco_pagina_extra ?? ''}
                placeholder="0,00"
                className={CAMPO}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ROTULO}>Foto extra (R$)</span>
              <input
                name="preco_foto_extra"
                defaultValue={form?.preco_foto_extra ?? ''}
                placeholder="0,00"
                className={CAMPO}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={ROTULO}>Prazo de produção (dias)</span>
              <input
                name="prazo_producao_dias"
                type="number"
                min={0}
                defaultValue={form?.prazo_producao_dias ?? 7}
                className={CAMPO}
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                name="ativo"
                defaultChecked={form?.ativo ?? true}
                className="h-4 w-4 accent-[#2563EB]"
              />
              <span className="text-[13.5px] text-ink-3">Ativo — aparece na vitrine da loja</span>
            </label>
            <div className="flex-1" />
            <button
              type="button"
              onClick={() => {
                setEditando(null);
                setNovo(false);
              }}
              className={BOTAO}
            >
              Cancelar
            </button>
            <button type="submit" className={BOTAO_PRIMARIO}>
              Salvar produto
            </button>
          </div>
        </form>
      )}

      {/* ---------------- filtros ---------------- */}
      {produtos.length > 0 && (
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, SKU ou descrição"
            className={`${CAMPO} max-w-[340px]`}
          />
          <div className="flex flex-wrap gap-1.5">
            {['todas', ...categorias.filter((c) => produtos.some((p) => p.categoria === c))].map((c) => (
              <button
                key={c}
                onClick={() => setCategoria(c)}
                className={
                  categoria === c
                    ? 'rounded-full bg-lente px-4 py-2 text-[12.5px] font-bold text-white shadow-card'
                    : 'rounded-full border border-line bg-surface px-4 py-2 text-[12.5px] font-semibold text-muted hover:border-[#D6E2FC] hover:text-blue'
                }
              >
                {c === 'todas' ? 'Todas' : c}
              </button>
            ))}
          </div>
          <span className="text-[12.5px] text-muted-2">
            {filtrados.length} de {produtos.length}
          </span>
        </div>
      )}

      {/* ---------------- lista ---------------- */}
      {produtos.length === 0 ? (
        <div className={`${CARD} p-8 text-center`}>
          <p className="m-0 text-[15px] font-bold">Seu catálogo ainda está vazio</p>
          <p className="mx-auto m-0 mt-2 max-w-[520px] text-[13.5px] text-muted">
            Produto é o que o cliente compra: um fotolivro 30×30, uma revista, um quadro. Cadastre o
            primeiro e ele passa a aparecer na vitrine da loja e na tabela de preços.
          </p>
          <button
            onClick={() => {
              setEditando(null);
              setNovo(true);
            }}
            className={`${BOTAO_PRIMARIO} mx-auto mt-5`}
          >
            Cadastrar o primeiro produto
          </button>
        </div>
      ) : filtrados.length === 0 ? (
        <div className={`${CARD} p-8 text-center`}>
          <p className="m-0 text-[13.5px] text-muted">Nenhum produto casa com esse filtro.</p>
        </div>
      ) : (
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]">
          {filtrados.map((p) => {
            const m = modeloDe(p.template_id);
            return (
              <div key={p.id} className={`${CARD} flex flex-col p-5`}>
                <div className="flex items-start gap-2">
                  <p className="m-0 min-w-0 flex-1 text-[14.5px] font-bold">{p.nome}</p>
                  <span
                    className={
                      p.ativo
                        ? 'flex-none rounded-full bg-green-surface px-2 py-0.5 text-[10.5px] font-bold text-[#059669]'
                        : 'flex-none rounded-full bg-amber-surface px-2 py-0.5 text-[10.5px] font-bold text-[#B45309]'
                    }
                  >
                    {p.ativo ? 'na vitrine' : 'oculto'}
                  </span>
                </div>

                <p className="m-0 mt-1 text-[12.5px] text-muted">
                  {p.categoria}
                  {p.sku && ` · ${p.sku}`}
                  {m && ` · ${m.largura_mm / 10}×${m.altura_mm / 10} cm`}
                </p>
                {p.descricao && (
                  <p className="m-0 mt-1.5 text-[12.5px] text-muted-2">{p.descricao}</p>
                )}

                <p className="m-0 mt-3 text-[18px] font-extrabold tracking-[-.5px]">
                  {reais(p.preco_base)}
                </p>
                <p className="m-0 mt-0.5 text-[12px] text-muted-2">
                  página extra {reais(p.preco_pagina_extra)} · foto extra {reais(p.preco_foto_extra)}
                  {' · '}
                  {p.prazo_producao_dias} dia{p.prazo_producao_dias === 1 ? '' : 's'} de produção
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setNovo(false);
                      setEditando(p);
                    }}
                    className={BOTAO}
                  >
                    Editar
                  </button>
                  <form action={alternarProduto}>
                    <input type="hidden" name="produto_id" value={p.id} />
                    <input type="hidden" name="ativo" value={p.ativo ? 'nao' : 'sim'} />
                    <button type="submit" className={BOTAO}>
                      {p.ativo ? 'Tirar da vitrine' : 'Publicar'}
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
