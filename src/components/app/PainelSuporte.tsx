'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { PainelDeChamados } from '@/lib/financeiro';
import {
  mudarEstadoChamado,
  mudarPrioridadeChamado,
  responderChamado,
} from '@/app/app/actions-sistema';

/**
 * Chamados de suporte da loja.
 *
 * A migração 0012 não criou tabela de respostas, então a conversa fica em
 * blocos datados dentro de `chamados.mensagem` (ver `responderChamado`). É a
 * limitação mais visível desta tela e está dita ao lojista, não escondida.
 */

const CARD = 'rounded-[18px] border border-line bg-surface';
const CAMPO =
  'w-full rounded-[14px] border border-line bg-surface px-3.5 py-3 text-[14px] text-ink outline-none focus:border-blue';
const BOTAO_PRIMARIO =
  'flex h-11 items-center justify-center gap-2 rounded-[14px] bg-lente px-4 text-[13.5px] font-bold text-white shadow-card hover:brightness-[1.06]';
const BOTAO =
  'flex h-11 items-center justify-center gap-2 rounded-[14px] border border-line bg-surface px-4 text-[13.5px] font-semibold text-ink hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue';

const ESTADOS: { valor: string; rotulo: string }[] = [
  { valor: '', rotulo: 'Todos' },
  { valor: 'aberto', rotulo: 'Abertos' },
  { valor: 'respondido', rotulo: 'Respondidos' },
  { valor: 'resolvido', rotulo: 'Resolvidos' },
];

const PRIORIDADES = ['baixa', 'normal', 'alta', 'urgente'];

const PRIORIDADE_COR: Record<string, string> = {
  urgente: 'bg-coral-surface text-coral',
  alta: 'bg-amber-surface text-[#B45309]',
  normal: 'bg-blue-soft text-blue',
  baixa: 'bg-line-2 text-muted',
};

const ESTADO_COR: Record<string, string> = {
  aberto: 'bg-amber-surface text-[#B45309]',
  respondido: 'bg-blue-soft text-blue',
  resolvido: 'bg-green-surface text-[#047857]',
};

const quando = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

export default function PainelSuporte({
  dados,
  estado,
  prioridade,
}: {
  dados: PainelDeChamados;
  estado: string;
  prioridade: string;
}) {
  const [respondendo, setRespondendo] = useState<string | null>(null);

  const url = (novoEstado: string, novaPrioridade: string) => {
    const q = new URLSearchParams();
    if (novoEstado) q.set('estado', novoEstado);
    if (novaPrioridade) q.set('prioridade', novaPrioridade);
    const s = q.toString();
    return s ? `/suporte?${s}` : '/suporte';
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="m-0 text-[12.5px] font-semibold uppercase tracking-[1.2px] text-muted-2">
          Sistema · Suporte
        </p>
        <h1 className="m-0 mt-1.5 text-[26px] font-extrabold tracking-[-.9px]">Chamados</h1>
        <p className="m-0 mt-1.5 text-[13.5px] text-muted">
          O que os seus clientes pediram, por estado e prioridade.
        </p>
      </div>

      <div className={`${CARD} flex flex-wrap items-center gap-2 p-4`}>
        {ESTADOS.map((e) => (
          <Link
            key={e.valor || 'todos'}
            href={url(e.valor, prioridade)}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold ${
              estado === e.valor
                ? 'bg-lente text-white shadow-card'
                : 'border border-line bg-surface text-ink-3 hover:text-blue'
            }`}
          >
            {e.rotulo}
            {e.valor && dados.porEstado[e.valor] ? ` · ${dados.porEstado[e.valor]}` : ''}
          </Link>
        ))}

        <span className="mx-2 h-6 w-px bg-line" />

        <Link
          href={url(estado, '')}
          className={`rounded-full px-4 py-2 text-[13px] font-semibold ${
            !prioridade
              ? 'bg-ink text-white'
              : 'border border-line bg-surface text-ink-3 hover:text-blue'
          }`}
        >
          Qualquer prioridade
        </Link>
        {PRIORIDADES.map((p) => (
          <Link
            key={p}
            href={url(estado, p)}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold capitalize ${
              prioridade === p
                ? 'bg-ink text-white'
                : 'border border-line bg-surface text-ink-3 hover:text-blue'
            }`}
          >
            {p}
          </Link>
        ))}
      </div>

      {!dados.temAlgumChamado ? (
        <section className={`${CARD} p-8 text-center`}>
          <p className="m-0 text-[15px] font-bold">Nenhum chamado aberto</p>
          <p className="m-0 mx-auto mt-2 max-w-[520px] text-[13px] leading-[1.6] text-muted">
            Os chamados nascem do painel do cliente. Enquanto ninguém pedir ajuda, esta fila fica
            vazia — o que é uma boa notícia.
          </p>
        </section>
      ) : dados.chamados.length === 0 ? (
        <section className={`${CARD} p-8 text-center`}>
          <p className="m-0 text-[15px] font-bold">Nada com este filtro</p>
          <p className="m-0 mt-2 text-[13px] text-muted">
            Há chamados nesta loja, mas nenhum neste estado e prioridade.
          </p>
        </section>
      ) : (
        dados.chamados.map((c) => (
          <section key={c.id} className={`${CARD} p-6`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-[240px]">
                <div className="flex flex-wrap items-center gap-2.5">
                  <p className="m-0 text-[15px] font-bold">{c.assunto}</p>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11.5px] font-bold ${
                      ESTADO_COR[c.estado] ?? 'bg-line-2 text-muted'
                    }`}
                  >
                    {c.estado}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11.5px] font-bold capitalize ${
                      PRIORIDADE_COR[c.prioridade] ?? 'bg-line-2 text-muted'
                    }`}
                  >
                    {c.prioridade}
                  </span>
                </div>
                <p className="m-0 mt-1.5 text-[12.5px] text-muted">
                  {c.cliente ?? c.clienteEmail ?? 'Cliente não identificado'}
                  {c.pedidoNumero ? ` · pedido #${c.pedidoNumero}` : ''} · aberto em{' '}
                  {quando(c.criadoEm)}
                  {c.atualizadoEm !== c.criadoEm ? ` · mexido em ${quando(c.atualizadoEm)}` : ''}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <form action={mudarPrioridadeChamado} className="flex gap-2">
                  <input type="hidden" name="id" value={c.id} />
                  <select
                    name="prioridade"
                    defaultValue={c.prioridade}
                    className="h-11 rounded-[14px] border border-line bg-surface px-3 text-[13px] capitalize text-ink outline-none focus:border-blue"
                  >
                    {PRIORIDADES.map((p) => (
                      <option key={p} value={p} className="capitalize">
                        {p}
                      </option>
                    ))}
                  </select>
                  <button type="submit" className={BOTAO}>
                    Priorizar
                  </button>
                </form>

                <form action={mudarEstadoChamado}>
                  <input type="hidden" name="id" value={c.id} />
                  <input
                    type="hidden"
                    name="estado"
                    value={c.estado === 'resolvido' ? 'aberto' : 'resolvido'}
                  />
                  <button type="submit" className={BOTAO}>
                    {c.estado === 'resolvido' ? 'Reabrir' : 'Resolver'}
                  </button>
                </form>

                <button
                  type="button"
                  onClick={() => setRespondendo(respondendo === c.id ? null : c.id)}
                  className={BOTAO_PRIMARIO}
                >
                  {respondendo === c.id ? 'Fechar' : 'Responder'}
                </button>
              </div>
            </div>

            {c.mensagem && (
              // `whitespace-pre-wrap` porque a conversa vive em blocos datados
              // dentro do texto: sem isso as respostas viram um parágrafo só.
              <p className="m-0 mt-4 whitespace-pre-wrap rounded-[14px] bg-surface-2 px-4 py-3 text-[13px] leading-[1.6] text-ink-3">
                {c.mensagem}
              </p>
            )}

            {respondendo === c.id && (
              <form action={responderChamado} className="mt-4 flex flex-col gap-3">
                <input type="hidden" name="id" value={c.id} />
                <textarea
                  name="resposta"
                  rows={4}
                  required
                  placeholder="O que você quer dizer ao cliente"
                  className={CAMPO}
                />
                <div className="flex flex-wrap items-center gap-3">
                  <button type="submit" className={BOTAO_PRIMARIO}>
                    Enviar resposta
                  </button>
                  <span className="text-[11.5px] leading-[1.45] text-muted-2">
                    A resposta entra no histórico do chamado e o marca como respondido. O envio por
                    e-mail ao cliente ainda não existe.
                  </span>
                </div>
              </form>
            )}
          </section>
        ))
      )}
    </div>
  );
}
