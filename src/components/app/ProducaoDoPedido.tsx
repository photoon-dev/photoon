'use client';

import { COR, type Tom } from '@/components/ui/tokens';
import Selo from '@/components/ui/Selo';
import EstadoVazio from '@/components/ui/EstadoVazio';
import { dataCurta, dataHora, termo } from '@/lib/pedidos-termos';
import type { LinhaProducao, PedidoResumo } from '@/lib/pedidos';

const ETAPA_TOM: Record<string, Tom> = {
  fila: 'neutro',
  impressao: 'azul',
  acabamento: 'indigo',
  revisao: 'ambar',
  pronto: 'verde',
};

const ETAPA_ORDEM = ['fila', 'impressao', 'acabamento', 'revisao', 'pronto'] as const;

/**
 * Aba Produção do detalhe do pedido.
 *
 * Mostra a ficha de produção, o tempo no estágio atual (calculado em JS, sem
 * inventar dado do banco), e aponta para a Central caso o lojista queira
 * mover a peça entre as colunas. O histórico completo vem na aba própria.
 */
export default function ProducaoDoPedido({
  pedido,
  producao,
  historico,
}: {
  pedido: PedidoResumo;
  producao: LinhaProducao[];
  historico: Array<{
    id: string;
    de_etapa: string | null;
    para_etapa: string;
    responsavel: string | null;
    criado_em: string;
    observacao: string | null;
  }>;
}) {
  const ficha = producao[0] ?? null;

  if (!ficha) {
    return (
      <EstadoVazio
        titulo="Pedido ainda não entrou na produção"
        descricao="A ficha de produção é aberta automaticamente quando o pedido passa para 'em produção' (ou é colocada na fila manualmente)."
      />
    );
  }

  const posicao = ETAPA_ORDEM.indexOf(ficha.etapa as (typeof ETAPA_ORDEM)[number]);
  const tempoNaEtapa = ficha.atualizado_em
    ? Math.max(0, Math.floor((Date.now() - new Date(ficha.atualizado_em).getTime()) / 60000))
    : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Régua de etapas */}
      <div
        style={{
          background: COR.papel,
          border: `1px solid ${COR.linha}`,
          borderRadius: 20,
          padding: '20px 24px',
          boxShadow: '0 2px 8px rgba(11,18,32,.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COR.tinta }}>
            Etapa atual
          </h2>
          <Selo tom={ETAPA_TOM[ficha.etapa] ?? 'neutro'}>
            {termo({ id: ficha.etapa, rotulo: ficha.etapa, classe: '' } as never, ficha.etapa).rotulo}
          </Selo>
          {tempoNaEtapa !== null && (
            <span style={{ fontSize: 12.5, color: COR.apagado, marginLeft: 'auto' }}>
              {tempoNaEtapa < 60
                ? `${tempoNaEtapa} min nesta etapa`
                : `${Math.floor(tempoNaEtapa / 60)}h ${tempoNaEtapa % 60}min nesta etapa`}
            </span>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${ETAPA_ORDEM.length}, 1fr)`,
            gap: 8,
          }}
        >
          {ETAPA_ORDEM.map((e, i) => {
            const feito = posicao > i;
            const atual = posicao === i;
            return (
              <div key={e} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div
                  style={{
                    height: 6,
                    borderRadius: 999,
                    background: atual
                      ? 'linear-gradient(90deg,#2563EB,#06B6D4)'
                      : feito
                        ? '#2563EB'
                        : '#EEF1F7',
                  }}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: atual ? 700 : 600,
                    color: atual || feito ? COR.tinta : COR.fraco,
                    textAlign: 'center',
                  }}
                >
                  {termo({ id: e, rotulo: e, classe: '' } as never, e).rotulo}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ficha */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
        }}
      >
        <Campo rotulo="Responsável" valor={ficha.responsavel ?? 'Sem responsável'} />
        <Campo rotulo="Iniciada em" valor={ficha.iniciada_em ? dataHora(ficha.iniciada_em) : 'Ainda não'} />
        <Campo rotulo="Concluída em" valor={ficha.concluida_em ? dataHora(ficha.concluida_em) : '—'} />
        <Campo rotulo="Última atualização" valor={dataHora(ficha.atualizado_em)} />
        <Campo rotulo="Pedido" valor={`#${pedido.numero}`} mono />
        <Campo rotulo="Prazo" valor={pedido.prazo_em ? dataCurta(pedido.prazo_em) : 'Não definido'} />
      </div>

      {/* Histórico resumido (a aba própria é a fonte canônica) */}
      {historico.length > 0 && (
        <div
          style={{
            background: COR.papel,
            border: `1px solid ${COR.linha}`,
            borderRadius: 20,
            boxShadow: '0 2px 8px rgba(11,18,32,.03)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '14px 22px',
              borderBottom: `1px solid ${COR.linhaClara}`,
              background: '#FBFCFE',
            }}
          >
            <h2 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: COR.tinta }}>
              Movimentações recentes
            </h2>
          </div>
          <div>
            {historico.slice(0, 5).map((h) => (
              <div
                key={h.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'auto 1fr auto',
                  gap: 12,
                  alignItems: 'center',
                  padding: '12px 22px',
                  borderBottom: `1px solid ${COR.linhaClara}`,
                  fontSize: 13,
                }}
              >
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: 999,
                    background: ETAPA_TOM[h.para_etapa] === 'verde' ? '#059669' : '#2563EB',
                    boxShadow: '0 0 0 4px #2563EB1F',
                  }}
                />
                <span style={{ color: COR.texto }}>
                  {h.de_etapa ? `de ${h.de_etapa} para` : 'entrou em'} <b>{h.para_etapa}</b>
                  {h.responsavel ? ` · ${h.responsavel}` : ''}
                </span>
                <span style={{ fontSize: 12, color: COR.apagado, fontVariantNumeric: 'tabular-nums' }}>
                  {dataHora(h.criado_em)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Campo({
  rotulo,
  valor,
  mono,
}: {
  rotulo: string;
  valor: string;
  mono?: boolean;
}) {
  return (
    <div
      style={{
        background: COR.papel,
        border: `1px solid ${COR.linha}`,
        borderRadius: 16,
        padding: '12px 14px',
      }}
    >
      <p
        style={{
          margin: '0 0 3px',
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: '1.1px',
          textTransform: 'uppercase',
          color: COR.fraco,
        }}
      >
        {rotulo}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 600,
          color: COR.tinta,
          fontFamily: mono ? 'monospace' : undefined,
        }}
      >
        {valor}
      </p>
    </div>
  );
}
