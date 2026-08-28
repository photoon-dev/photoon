'use client';

import { useState } from 'react';
import type { Template } from '@/lib/lojista';
import { salvarTemplate, duplicarTemplate, excluirTemplate } from '@/app/app/actions';

const CARD = 'rounded-[18px] border border-line bg-surface';
const CAMPO =
  'h-11 w-full rounded-[14px] border border-line bg-surface px-3.5 text-[14px] text-ink outline-none focus:border-blue';
const ROTULO = 'text-[12.5px] font-semibold text-ink-3';
const BOTAO_PRIMARIO =
  'flex h-11 items-center justify-center gap-2 rounded-[14px] bg-lente px-4 text-[13.5px] font-bold text-white shadow-card hover:brightness-[1.06]';
const BOTAO =
  'flex h-9 items-center justify-center rounded-[12px] border border-line bg-surface px-3 text-[12.5px] font-semibold text-ink-3 hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue';

const CATEGORIAS = ['fotolivro', 'revista', 'evento', 'quadro'];

/** Miniatura proporcional ao formato real do modelo. */
function Formato({ l, a }: { l: number; a: number }) {
  const max = 64;
  const esc = max / Math.max(l, a);
  return (
    <span
      className="flex-none rounded-[4px] border border-[#93B4FB] bg-[linear-gradient(140deg,#DCE6FA,#EAF0FF)]"
      style={{ width: Math.round(l * esc), height: Math.round(a * esc) }}
    />
  );
}

export default function PainelTemplates({ templates }: { templates: Template[] }) {
  const [editando, setEditando] = useState<Template | null>(null);
  const [novo, setNovo] = useState(false);

  const padroes = templates.filter((t) => !t.lojista_id);
  const meus = templates.filter((t) => t.lojista_id);
  const form = editando ?? null;

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="m-0 text-[12.5px] font-semibold uppercase tracking-[1.2px] text-muted-2">
            Loja e catálogo · Temas e templates
          </p>
          <h1 className="m-0 mt-1.5 text-[26px] font-extrabold tracking-[-.9px]">
            Modelos de álbum
          </h1>
          <p className="m-0 mt-1.5 text-[13.5px] text-muted">
            {padroes.length} modelos padrão · {meus.length} seu
            {meus.length === 1 ? '' : 's'} · os publicados aparecem para o cliente
          </p>
        </div>
        <button
          onClick={() => {
            setEditando(null);
            setNovo(true);
          }}
          className={BOTAO_PRIMARIO}
        >
          Novo modelo
        </button>
      </div>

      {/* ---------------- formulário ---------------- */}
      {(novo || form) && (
        <form
          action={salvarTemplate}
          className={`${CARD} p-6`}
          key={form?.id ?? 'novo'}
        >
          <p className="m-0 mb-4 text-[15px] font-bold">
            {form ? `Editar ${form.nome}` : 'Novo modelo'}
          </p>
          {form && <input type="hidden" name="template_id" value={form.id} />}

          <div className="grid gap-4 md:grid-cols-3">
            <label className="flex flex-col gap-1.5 md:col-span-2">
              <span className={ROTULO}>Nome</span>
              <input name="nome" required defaultValue={form?.nome} className={CAMPO} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ROTULO}>Categoria</span>
              <select name="categoria" defaultValue={form?.categoria ?? 'fotolivro'} className={CAMPO}>
                {CATEGORIAS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-1.5 md:col-span-3">
              <span className={ROTULO}>Produto</span>
              <input
                name="produto"
                required
                defaultValue={form?.produto}
                placeholder="Fotolivro capa dura"
                className={CAMPO}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={ROTULO}>Largura (mm)</span>
              <input name="largura_mm" type="number" required min={50} defaultValue={form?.largura_mm ?? 300} className={CAMPO} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ROTULO}>Altura (mm)</span>
              <input name="altura_mm" type="number" required min={50} defaultValue={form?.altura_mm ?? 300} className={CAMPO} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ROTULO}>Preço base (R$)</span>
              <input name="preco_base" type="number" step="0.01" min={0} defaultValue={form?.preco_base ?? ''} className={CAMPO} />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className={ROTULO}>Páginas mín.</span>
              <input name="paginas_min" type="number" min={1} defaultValue={form?.paginas_min ?? 20} className={CAMPO} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ROTULO}>Páginas máx.</span>
              <input name="paginas_max" type="number" min={1} defaultValue={form?.paginas_max ?? 100} className={CAMPO} />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className={ROTULO}>Sangria (mm)</span>
                <input name="sangria_mm" type="number" step="0.5" min={0} defaultValue={form?.sangria_mm ?? 3} className={CAMPO} />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={ROTULO}>Área segura</span>
                <input name="area_segura_mm" type="number" step="0.5" min={0} defaultValue={form?.area_segura_mm ?? 8} className={CAMPO} />
              </label>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <label className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                name="publicado"
                defaultChecked={form?.publicado ?? true}
                className="h-4 w-4 accent-[#2563EB]"
              />
              <span className="text-[13.5px] text-ink-3">
                Publicado — visível para os clientes
              </span>
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
              Salvar modelo
            </button>
          </div>
        </form>
      )}

      {/* ---------------- meus modelos ---------------- */}
      {meus.length > 0 && (
        <section>
          <p className="m-0 mb-3 text-[13px] font-bold uppercase tracking-[1.2px] text-muted-2">
            Modelos da sua loja
          </p>
          <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
            {meus.map((t) => (
              <div key={t.id} className={`${CARD} flex gap-4 p-5`}>
                <Formato l={t.largura_mm} a={t.altura_mm} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="m-0 truncate text-[14.5px] font-bold">{t.nome}</p>
                    {!t.publicado && (
                      <span className="flex-none rounded-full bg-amber-surface px-2 py-0.5 text-[10.5px] font-bold text-[#B45309]">
                        rascunho
                      </span>
                    )}
                  </div>
                  <p className="m-0 mt-1 text-[12.5px] text-muted">
                    {t.produto} · {t.largura_mm / 10}×{t.altura_mm / 10} cm
                  </p>
                  <p className="m-0 mt-0.5 text-[12px] text-muted-2">
                    {t.paginas_min}–{t.paginas_max} páginas
                    {t.preco_base != null &&
                      ` · ${t.preco_base.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                  </p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => {
                        setNovo(false);
                        setEditando(t);
                      }}
                      className={BOTAO}
                    >
                      Editar
                    </button>
                    <form action={duplicarTemplate}>
                      <input type="hidden" name="template_id" value={t.id} />
                      <button type="submit" className={BOTAO}>
                        Duplicar
                      </button>
                    </form>
                    <form action={excluirTemplate}>
                      <input type="hidden" name="template_id" value={t.id} />
                      <button
                        type="submit"
                        className={`${BOTAO} text-[#E11D48] hover:bg-coral-surface hover:text-[#E11D48]`}
                      >
                        Excluir
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- padrões ---------------- */}
      <section>
        <p className="m-0 mb-1 text-[13px] font-bold uppercase tracking-[1.2px] text-muted-2">
          Modelos padrão da plataforma
        </p>
        <p className="m-0 mb-3 text-[12.5px] text-muted">
          Já disponíveis para os seus clientes. Para mudar medidas ou preço, duplique — o padrão
          fica intacto para as outras lojas.
        </p>
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(300px,1fr))]">
          {padroes.map((t) => (
            <div key={t.id} className={`${CARD} flex gap-4 p-5`}>
              <Formato l={t.largura_mm} a={t.altura_mm} />
              <div className="min-w-0 flex-1">
                <p className="m-0 truncate text-[14.5px] font-bold">{t.nome}</p>
                <p className="m-0 mt-1 text-[12.5px] text-muted">
                  {t.produto} · {t.largura_mm / 10}×{t.altura_mm / 10} cm
                </p>
                <p className="m-0 mt-0.5 text-[12px] text-muted-2">
                  {t.paginas_min}–{t.paginas_max} páginas
                  {t.preco_base != null &&
                    ` · ${t.preco_base.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`}
                </p>
                <form action={duplicarTemplate} className="mt-3">
                  <input type="hidden" name="template_id" value={t.id} />
                  <button type="submit" className={BOTAO}>
                    Duplicar para editar
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
