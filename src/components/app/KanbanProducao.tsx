'use client';

/**
 * Kanban de Producao com 8 colunas explicitas:
 *   Aguardando | Pre-flight | Arquivos prontos | Impressao | Acabamento |
 *   Qualidade | Embalagem | Pronto
 *
 * Cada card mostra: pedido (numero), projeto (codigo), cliente, produto,
 * filial, prazo, prioridade, tempo no estagio, responsavel. A troca de
 * etapa usa a action `moverEtapaProducao` (revalidada por kanbanProducao).
 *
 * Substitui ProducaoDoDesign (que era gerado do Producao.dc.html com 5
 * colunas fixas). O design antigo permanece no repo como referencia, mas
 * o /producao agora consome este componente.
 */

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { COR, type Tom } from '@/components/ui/tokens';
import Selo from '@/components/ui/Selo';
import { moeda } from '@/lib/pedidos-termos';
import type { CardKanban, KanbanProducao } from '@/lib/pedidos';
import { moverEtapaProducao } from '@/app/app/actions-pedidos';

const TOM_COLUNA: Record<string, Tom> = {
  aguardando: 'neutro',
  preflight: 'azul',
  arquivos_prontos: 'azul',
  impressao: 'azul',
  acabamento: 'indigo',
  qualidade: 'ambar',
  embalagem: 'indigo',
  pronto: 'verde',
};

const TOM_PRIORIDADE: Record<number, Tom> = {
  0: 'neutro',
  1: 'azul',
  2: 'ambar',
  3: 'coral',
};

export default function KanbanProducao({ kanban }: { kanban: KanbanProducao }) {
  const [, iniciar] = useTransition();
  const router = useRouter();

  const mover = (producaoId: string, etapa: string) => {
    const fd = new FormData();
    fd.set('producao_id', producaoId);
    fd.set('etapa', etapa);
    iniciar(async () => {
      await moverEtapaProducao(fd);
      router.refresh();
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* KPIs no topo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: COR.tinta }}>
          Kanban de Producao
        </h2>
        <span style={{ fontSize: 12.5, color: COR.apagado }}>
          {kanban.total} fichas ativas · 8 etapas
        </span>
        {kanban.atrasados > 0 && (
          <Selo tom="coral">{kanban.atrasados} com prazo vencido</Selo>
        )}
        {kanban.semResponsavel > 0 && (
          <Selo tom="ambar">{kanban.semResponsavel} sem responsavel</Selo>
        )}
      </div>

      {/* 8 colunas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(8, minmax(160px, 1fr))',
          gap: 10,
          overflowX: 'auto',
        }}
      >
        {kanban.colunas.map((col) => (
          <div
            key={col.coluna}
            style={{
              background: '#FBFCFE',
              border: `1px solid ${COR.linha}`,
              borderRadius: 14,
              padding: 10,
              minHeight: 320,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 4px',
              }}
            >
              <Selo tom={col.tom}>{col.rotulo}</Selo>
              <span style={{ fontSize: 11, fontWeight: 700, color: COR.fraco }}>
                {col.cards.length}
              </span>
            </div>
            {col.cards.map((c) => (
              <Card key={c.id} card={c} aoMover={mover} />
            ))}
            {col.cards.length === 0 && (
              <p style={{ margin: '12px 4px', fontSize: 11.5, color: COR.fraco, textAlign: 'center' }}>
                Nenhuma ficha
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Card({
  card,
  aoMover,
}: {
  card: CardKanban;
  aoMover: (producaoId: string, etapa: string) => void;
}) {
  const tempoNaEtapa = minutosNaEtapa(card.entrou_na_etapa_em);
  return (
    <article
      style={{
        background: COR.papel,
        border: `1px solid ${COR.linha}`,
        borderRadius: 12,
        padding: 10,
        boxShadow: '0 1px 2px rgba(11,18,32,.04)',
        display: 'flex',
        flexDirection: 'column',
        gap: 5,
        fontSize: 11.5,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, justifyContent: 'space-between' }}>
        <Link
          href={`/pedidos/${card.pedido_id}`}
          style={{ fontFamily: 'monospace', fontWeight: 700, color: COR.azul, textDecoration: 'none', fontSize: 12 }}
        >
          #{card.pedido_numero}
        </Link>
        {card.prioridade > 0 && (
          <Selo tom={TOM_PRIORIDADE[card.prioridade] ?? 'neutro'}>P{card.prioridade}</Selo>
        )}
      </div>
      <Link
        href={card.projeto_id ? `/projetos/${card.projeto_id}` : '#'}
        style={{ color: COR.tinta, fontWeight: 600, textDecoration: 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        title={card.projeto_titulo}
      >
        {card.projeto_codigo ?? '—'}
      </Link>
      <span style={{ color: COR.apagado, fontSize: 10.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={card.cliente_nome ?? ''}>
        {card.cliente_nome ?? 'Sem cliente'}
      </span>
      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
        {card.categoria && (
          <Selo tom="azul">{card.categoria}</Selo>
        )}
        {card.filial_nome && (
          <Selo tom="neutro">{card.filial_nome}</Selo>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
        <span style={{ color: COR.fraco, fontVariantNumeric: 'tabular-nums' }} title="Tempo no estagio">
          {tempoNaEtapa}
        </span>
        {card.responsavel ? (
          <span
            style={{
              maxWidth: 80,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: COR.texto,
              fontWeight: 600,
            }}
            title={card.responsavel}
          >
            {card.responsavel}
          </span>
        ) : (
          <span style={{ color: COR.coral, fontWeight: 600, fontSize: 10.5 }}>sem resp.</span>
        )}
      </div>
      {card.pedido_prazo && (
        <span style={{ fontSize: 10.5, color: COR.apagado, fontVariantNumeric: 'tabular-nums' }}>
          Prazo: {new Date(card.pedido_prazo).toLocaleDateString('pt-BR')}
        </span>
      )}
    </article>
  );
}

function minutosNaEtapa(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.max(0, Math.floor(ms / 60000));
  if (min < 60) return `${min}min`;
  if (min < 60 * 24) return `${Math.floor(min / 60)}h${min % 60}min`;
  return `${Math.floor(min / (60 * 24))}d`;
}
