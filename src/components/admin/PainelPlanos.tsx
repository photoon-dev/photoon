'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Plano } from '@/lib/lojista';
import { reais } from '@/lib/preco';
import { salvarPlano, excluirPlano } from '@/app/admin/actions';

const CARD = 'rounded-[18px] border border-line bg-surface';
const CAMPO =
  'h-11 w-full rounded-[14px] border border-line bg-surface px-3.5 text-[14px] text-ink outline-none focus:border-blue';
const ROTULO = 'text-[12.5px] font-semibold text-ink-3';
const AJUDA = 'text-[11.5px] text-muted-2';
const BOTAO_PRIMARIO =
  'flex h-11 items-center justify-center gap-2 rounded-[14px] bg-lente px-4 text-[13.5px] font-bold text-white shadow-card hover:brightness-[1.06]';
const BOTAO =
  'flex h-9 items-center justify-center rounded-[12px] border border-line bg-surface px-3 text-[12.5px] font-semibold text-ink-3 hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue';

/** Descreve em palavras como o plano cobra, para conferir o que foi montado. */
function comoCobra(p: Plano): string {
  const partes: string[] = [];
  if (p.valor_mensal > 0) partes.push(`${reais(p.valor_mensal)} por mês`);
  if (p.valor_por_projeto > 0) partes.push(`${reais(p.valor_por_projeto)} por projeto`);
  if (p.valor_por_lamina > 0) partes.push(`${reais(p.valor_por_lamina)} por lâmina`);
  return partes.length ? partes.join(' + ') : 'Gratuito';
}

export default function PainelPlanos({ planos }: { planos: Plano[] }) {
  const [editando, setEditando] = useState<Plano | null>(null);
  const [novo, setNovo] = useState(false);
  const form = editando;

  return (
    <div className="min-h-screen bg-page">
      <header className="flex min-h-[72px] flex-wrap items-center gap-4 border-b border-line bg-surface px-7 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-ink text-[13px] font-extrabold text-white">
            SA
          </span>
          <span>
            <span className="block text-[15px] font-extrabold tracking-[-.2px]">Photoon</span>
            <span className="block text-[11.5px] text-muted-2">super admin</span>
          </span>
        </Link>
        <nav className="ml-3 flex gap-1">
          <Link href="/" className="rounded-full px-4 py-2 text-sm font-medium text-ink-3 hover:bg-page hover:text-blue">
            Lojas
          </Link>
          <span className="rounded-full bg-blue-soft px-4 py-2 text-sm font-bold text-blue">
            Planos
          </span>
        </nav>
      </header>

      <main className="mx-auto flex max-w-[1100px] animate-riseIn flex-col gap-5 px-7 py-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="m-0 text-[26px] font-extrabold tracking-[-.9px]">Planos</h1>
            <p className="m-0 mt-1.5 max-w-[620px] text-[13.5px] leading-[1.6] text-muted">
              Os três valores convivem. Deixe em zero o que não quiser cobrar: só mensalidade, só
              por projeto, só por lâmina, ou qualquer combinação.
            </p>
          </div>
          <button
            onClick={() => {
              setEditando(null);
              setNovo(true);
            }}
            className={BOTAO_PRIMARIO}
          >
            Novo plano
          </button>
        </div>

        {(novo || form) && (
          <form action={salvarPlano} className={`${CARD} p-6`} key={form?.id ?? 'novo'}>
            <p className="m-0 mb-4 text-[15px] font-bold">
              {form ? `Editar ${form.nome}` : 'Novo plano'}
            </p>
            {form && <input type="hidden" name="plano_id" value={form.id} />}

            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-1.5">
                <span className={ROTULO}>Nome</span>
                <input name="nome" required defaultValue={form?.nome} className={CAMPO} />
              </label>
              <label className="flex flex-col gap-1.5 md:col-span-2">
                <span className={ROTULO}>Descrição</span>
                <input name="descricao" defaultValue={form?.descricao ?? ''} className={CAMPO} />
              </label>
            </div>

            <p className="m-0 mb-3 mt-6 text-[13px] font-bold uppercase tracking-[1.2px] text-muted-2">
              Cobrança
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-1.5">
                <span className={ROTULO}>Mensalidade (R$)</span>
                <input
                  name="valor_mensal"
                  type="number"
                  step="0.01"
                  min={0}
                  defaultValue={form?.valor_mensal ?? 0}
                  className={CAMPO}
                />
                <span className={AJUDA}>Zero = sem valor fixo</span>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={ROTULO}>Por projeto (R$)</span>
                <input
                  name="valor_por_projeto"
                  type="number"
                  step="0.01"
                  min={0}
                  defaultValue={form?.valor_por_projeto ?? 0}
                  className={CAMPO}
                />
                <span className={AJUDA}>Cobrado quando o álbum é criado</span>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={ROTULO}>Por lâmina (R$)</span>
                <input
                  name="valor_por_lamina"
                  type="number"
                  step="0.01"
                  min={0}
                  defaultValue={form?.valor_por_lamina ?? 0}
                  className={CAMPO}
                />
                <span className={AJUDA}>Cada folha do álbum</span>
              </label>
            </div>

            <p className="m-0 mb-3 mt-6 text-[13px] font-bold uppercase tracking-[1.2px] text-muted-2">
              Limites
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="flex flex-col gap-1.5">
                <span className={ROTULO}>Projetos</span>
                <input
                  name="limite_projetos"
                  type="number"
                  min={1}
                  defaultValue={form?.limite_projetos ?? ''}
                  placeholder="vazio = ilimitado"
                  className={CAMPO}
                />
                <span className={AJUDA}>Ao atingir, a loja não cria mais</span>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={ROTULO}>Clientes</span>
                <input
                  name="limite_clientes"
                  type="number"
                  min={1}
                  defaultValue={form?.limite_clientes ?? ''}
                  placeholder="vazio = ilimitado"
                  className={CAMPO}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className={ROTULO}>Armazenamento (GB)</span>
                <input
                  name="limite_armazenamento_gb"
                  type="number"
                  min={1}
                  defaultValue={form?.limite_armazenamento_gb ?? ''}
                  placeholder="vazio = ilimitado"
                  className={CAMPO}
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <label className="flex cursor-pointer items-center gap-2.5">
                <input
                  type="checkbox"
                  name="ativo"
                  defaultChecked={form?.ativo ?? true}
                  className="h-4 w-4 accent-[#2563EB]"
                />
                <span className="text-[13.5px] text-ink-3">Ativo</span>
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
                Salvar plano
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(320px,1fr))]">
          {planos.map((p) => (
            <div key={p.id} className={`${CARD} p-5`}>
              <div className="flex items-center gap-2">
                <p className="m-0 text-[16px] font-extrabold">{p.nome}</p>
                {!p.ativo && (
                  <span className="rounded-full bg-coral-surface px-2 py-0.5 text-[10.5px] font-bold text-coral">
                    inativo
                  </span>
                )}
              </div>
              {p.descricao && <p className="m-0 mt-1 text-[12.5px] text-muted">{p.descricao}</p>}

              <p className="m-0 mt-3 text-[13.5px] font-semibold text-blue">{comoCobra(p)}</p>

              <dl className="m-0 mt-3 flex flex-col gap-1.5">
                {[
                  ['Projetos', p.limite_projetos],
                  ['Clientes', p.limite_clientes],
                  ['Armazenamento', p.limite_armazenamento_gb],
                ].map(([rot, val]) => (
                  <div key={rot as string} className="flex justify-between gap-3">
                    <dt className="text-[12px] text-muted-2">{rot}</dt>
                    <dd className="m-0 text-[12px] font-semibold text-ink-3">
                      {val == null
                        ? 'ilimitado'
                        : rot === 'Armazenamento'
                          ? `${val} GB`
                          : (val as number).toLocaleString('pt-BR')}
                    </dd>
                  </div>
                ))}
              </dl>

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
                <form action={excluirPlano}>
                  <input type="hidden" name="plano_id" value={p.id} />
                  <button
                    type="submit"
                    className={`${BOTAO} text-[#E11D48] hover:bg-coral-surface hover:text-[#E11D48]`}
                  >
                    Excluir
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>

        <p className="m-0 text-[12px] leading-[1.6] text-muted-2">
          Excluir um plano não apaga as lojas que estavam nele — elas ficam sem plano, e sem plano
          não há limite de projetos.
        </p>
      </main>
    </div>
  );
}
