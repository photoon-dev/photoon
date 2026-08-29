'use client';

import { useState } from 'react';
import type { DadosVendedores, VendedorComVendas } from '@/lib/comercial';
import { reais } from '@/lib/preco';
import { salvarVendedor, alternarVendedor } from '@/app/app/actions-comercial';

const CARD = 'rounded-[18px] border border-line bg-surface';
const CAMPO =
  'h-11 w-full rounded-[14px] border border-line bg-surface px-3.5 text-[14px] text-ink outline-none focus:border-blue';
const ROTULO = 'text-[12.5px] font-semibold text-ink-3';
const AJUDA = 'text-[11.5px] text-muted-2';
const BOTAO_PRIMARIO =
  'flex h-11 items-center justify-center gap-2 rounded-[14px] bg-lente px-4 text-[13.5px] font-bold text-white shadow-card hover:brightness-[1.06]';
const BOTAO =
  'flex h-9 items-center justify-center rounded-[12px] border border-line bg-surface px-3 text-[12.5px] font-semibold text-ink-3 hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue';

/** Rótulo dos estados de pedido que aparecem na lista de vendas. */
const ESTADO_PEDIDO: Record<string, string> = {
  rascunho: 'Rascunho',
  aguardando_pagamento: 'Aguardando pagamento',
  pago: 'Pago',
  em_producao: 'Em produção',
  pronto: 'Pronto',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

const data = (iso: string) =>
  new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: '2-digit' });

export default function PainelVendedores({ dados }: { dados: DadosVendedores }) {
  const [editando, setEditando] = useState<VendedorComVendas | null>(null);
  const [novo, setNovo] = useState(false);
  const [aberto, setAberto] = useState<string | null>(null);

  const form = editando;
  const ativos = dados.vendedores.filter((v) => v.ativo).length;
  const comissaoTotal = dados.vendedores.reduce((t, v) => t + v.comissao, 0);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="m-0 text-[12.5px] font-semibold uppercase tracking-[1.2px] text-muted-2">
            Vendas · Vendedores
          </p>
          <h1 className="m-0 mt-1.5 text-[26px] font-extrabold tracking-[-.9px]">
            Equipe de vendas
          </h1>
          <p className="m-0 mt-1.5 text-[13.5px] text-muted">
            {dados.vendedores.length} cadastrado{dados.vendedores.length === 1 ? '' : 's'} · {ativos}{' '}
            ativo{ativos === 1 ? '' : 's'}
            {comissaoTotal > 0 && ` · ${reais(comissaoTotal)} de comissão sobre vendas pagas`}
          </p>
        </div>
        <button
          onClick={() => {
            setEditando(null);
            setNovo(true);
          }}
          className={BOTAO_PRIMARIO}
        >
          Novo vendedor
        </button>
      </div>

      {dados.truncado && (
        <p className="m-0 rounded-[14px] bg-amber-surface px-4 py-3 text-[13px] font-semibold text-[#B45309]">
          Há mais pedidos do que esta tela consegue somar de uma vez. As comissões abaixo cobrem só
          parte deles.
        </p>
      )}

      {/* ---------------- formulário ---------------- */}
      {(novo || form) && (
        <form action={salvarVendedor} className={`${CARD} p-6`} key={form?.id ?? 'novo'}>
          <p className="m-0 mb-4 text-[15px] font-bold">
            {form ? `Editar ${form.nome}` : 'Novo vendedor'}
          </p>
          {form && <input type="hidden" name="vendedor_id" value={form.id} />}

          <div className="grid gap-4 md:grid-cols-4">
            <label className="flex flex-col gap-1.5 md:col-span-2">
              <span className={ROTULO}>Nome</span>
              <input name="nome" required defaultValue={form?.nome} className={CAMPO} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ROTULO}>E-mail</span>
              <input name="email" type="email" defaultValue={form?.email ?? ''} className={CAMPO} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ROTULO}>Telefone</span>
              <input name="telefone" defaultValue={form?.telefone ?? ''} className={CAMPO} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ROTULO}>Comissão (%)</span>
              <input
                name="comissao_pct"
                defaultValue={form?.comissao_pct ?? 0}
                placeholder="10"
                className={CAMPO}
              />
              <span className={AJUDA}>Aplicada sobre o total dos pedidos pagos dele.</span>
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
              <span className="text-[13.5px] text-ink-3">Ativo — pode receber pedidos novos</span>
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
              Salvar vendedor
            </button>
          </div>
        </form>
      )}

      {/* ---------------- lista ---------------- */}
      {dados.vendedores.length === 0 ? (
        <div className={`${CARD} p-8 text-center`}>
          <p className="m-0 text-[15px] font-bold">Nenhum vendedor cadastrado</p>
          <p className="mx-auto m-0 mt-2 max-w-[540px] text-[13.5px] text-muted">
            Cadastre quem atende os seus clientes. A partir daí, todo pedido atribuído a essa pessoa
            entra na conta de comissão dela — sem atribuição, a receita fica toda sem dono.
          </p>
          <button
            onClick={() => {
              setEditando(null);
              setNovo(true);
            }}
            className={`${BOTAO_PRIMARIO} mx-auto mt-5`}
          >
            Cadastrar o primeiro
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {dados.vendedores.map((v) => (
            <div key={v.id} className={`${CARD} p-5`}>
              <div className="flex flex-wrap items-start gap-4">
                <span className="flex h-11 w-11 flex-none items-center justify-center rounded-[14px] bg-blue-surface text-[14px] font-extrabold text-blue">
                  {v.nome.slice(0, 2).toUpperCase()}
                </span>

                <div className="min-w-[180px] flex-1">
                  <div className="flex items-center gap-2">
                    <p className="m-0 text-[14.5px] font-bold">{v.nome}</p>
                    {!v.ativo && (
                      <span className="rounded-full bg-amber-surface px-2 py-0.5 text-[10.5px] font-bold text-[#B45309]">
                        inativo
                      </span>
                    )}
                  </div>
                  <p className="m-0 mt-1 text-[12.5px] text-muted">
                    {v.email ?? 'sem e-mail'}
                    {v.telefone && ` · ${v.telefone}`} · comissão {v.comissao_pct}%
                  </p>
                </div>

                <div className="flex flex-wrap gap-6">
                  {[
                    ['Vendido', reais(v.vendido), `${v.pedidosPagos} pedido(s) pago(s)`],
                    ['Comissão', reais(v.comissao), `${v.comissao_pct}% do vendido`],
                    [
                      'Em aberto',
                      v.emAberto > 0 ? reais(v.valorEmAberto) : '—',
                      `${v.emAberto} pedido(s) sem pagamento`,
                    ],
                  ].map(([r, valor, sub]) => (
                    <span key={r} className="min-w-[110px]">
                      <span className="block text-[11px] font-bold uppercase tracking-[1px] text-muted-2">
                        {r}
                      </span>
                      <span className="block text-[17px] font-extrabold tracking-[-.5px]">{valor}</span>
                      <span className="block text-[11px] text-muted-2">{sub}</span>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setNovo(false);
                      setEditando(v);
                    }}
                    className={BOTAO}
                  >
                    Editar
                  </button>
                  <form action={alternarVendedor}>
                    <input type="hidden" name="vendedor_id" value={v.id} />
                    <input type="hidden" name="ativo" value={v.ativo ? 'nao' : 'sim'} />
                    <button type="submit" className={BOTAO}>
                      {v.ativo ? 'Desativar' : 'Reativar'}
                    </button>
                  </form>
                  {v.vendas.length > 0 && (
                    <button
                      onClick={() => setAberto(aberto === v.id ? null : v.id)}
                      className={BOTAO}
                    >
                      {aberto === v.id ? 'Fechar vendas' : `Vendas (${v.vendas.length})`}
                    </button>
                  )}
                </div>
              </div>

              {v.vendas.length === 0 ? (
                <p className="m-0 mt-4 border-t border-line-2 pt-4 text-[12.5px] text-muted-2">
                  Nenhum pedido atribuído a este vendedor ainda.
                </p>
              ) : (
                aberto === v.id && (
                  <table className="mt-4 w-full border-collapse border-t border-line-2">
                    <tbody>
                      {v.vendas.map((s) => (
                        <tr key={s.id} className="border-b border-line-2">
                          <td className="px-1 py-2.5 text-[13px] font-semibold">#{s.numero}</td>
                          <td className="px-1 py-2.5 text-[13px] text-muted">
                            {s.cliente ?? 'sem cliente'}
                          </td>
                          <td className="px-1 py-2.5 text-[12.5px] text-muted-2">
                            {ESTADO_PEDIDO[s.estado] ?? s.estado}
                          </td>
                          <td className="px-1 py-2.5 text-right text-[12.5px] text-muted-2">
                            {data(s.criado_em)}
                          </td>
                          <td className="px-1 py-2.5 text-right text-[13px] font-bold">
                            {reais(s.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )
              )}
            </div>
          ))}

          {dados.semVendedor.pedidos > 0 && (
            <p className="m-0 rounded-[14px] bg-blue-soft px-4 py-3 text-[13px] text-ink-3">
              {dados.semVendedor.pedidos} pedido(s) pago(s), somando{' '}
              <strong>{reais(dados.semVendedor.valor)}</strong>, não têm vendedor atribuído — essa
              receita não entra em nenhuma comissão.
            </p>
          )}
        </div>
      )}
    </>
  );
}
