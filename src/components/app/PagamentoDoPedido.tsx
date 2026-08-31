'use client';

import { COR, type Tom } from '@/components/ui/tokens';
import Selo from '@/components/ui/Selo';
import EstadoVazio from '@/components/ui/EstadoVazio';
import {
  ESTADOS_PAGAMENTO,
  METODOS_PAGAMENTO,
  dataHora,
  moeda,
  termo,
} from '@/lib/pedidos-termos';
import type { LinhaPagamento } from '@/lib/pedidos';

const PAG_TOM: Record<string, Tom> = {
  pendente: 'ambar',
  aprovado: 'verde',
  recusado: 'coral',
  estornado: 'indigo',
  expirado: 'neutro',
};

const METODO_TOM: Record<string, Tom> = {
  pix: 'ciano',
  cartao: 'azul',
  boleto: 'neutro',
  manual: 'neutro',
};

/**
 * Aba Pagamento do detalhe do pedido.
 *
 * Bloco 1 — totais: subtotal, desconto, frete, total, recebido, falta.
 * Bloco 2 — lista de pagamentos com gateway, método, valor, status, IDs externos.
 *
 * Tudo vem de `getPedido.pagamentos` — uma única consulta, sem invenção.
 */
export default function PagamentoDoPedido({
  pedido,
  pagamentos,
}: {
  pedido: { subtotal: number; desconto: number; frete: number; total: number };
  pagamentos: LinhaPagamento[];
}) {
  const recebido = pagamentos
    .filter((p) => p.estado === 'aprovado')
    .reduce((t, p) => t + Number(p.valor || 0), 0);
  const falta = Number(pedido.total) - recebido;
  const estadoPagamento =
    recebido >= Number(pedido.total) && recebido > 0
      ? 'quitado'
      : recebido > 0
        ? 'parcial'
        : pagamentos.length
          ? pagamentos[0].estado
          : 'sem-cobranca';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Bloco de totais */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12,
        }}
      >
        {[
          { rotulo: 'Subtotal', valor: pedido.subtotal, tom: 'neutro' as Tom },
          { rotulo: 'Desconto', valor: -Number(pedido.desconto || 0), tom: 'verde' as Tom, esconder: !pedido.desconto },
          { rotulo: 'Frete', valor: pedido.frete, tom: 'neutro' as Tom, esconder: !pedido.frete },
          { rotulo: 'Total', valor: pedido.total, tom: 'azul' as Tom, forte: true },
          { rotulo: 'Recebido', valor: recebido, tom: 'verde' as Tom },
          { rotulo: 'Falta', valor: falta, tom: falta > 0 ? 'coral' as Tom : 'verde' as Tom, esconder: falta <= 0 },
        ]
          .filter((c) => !c.esconder)
          .map((c) => (
            <div
              key={c.rotulo}
              style={{
                background: COR.papel,
                border: `1px solid ${COR.linha}`,
                borderRadius: 16,
                padding: '14px 16px',
                boxShadow: '0 2px 8px rgba(11,18,32,.03)',
              }}
            >
              <p
                style={{
                  margin: '0 0 4px',
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: '1.1px',
                  textTransform: 'uppercase',
                  color: COR.fraco,
                }}
              >
                {c.rotulo}
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: c.forte ? 22 : 19,
                  fontWeight: 800,
                  letterSpacing: '-0.6px',
                  color: c.forte ? COR.tinta : c.tom === 'verde' ? '#059669' : c.tom === 'coral' ? COR.coral : COR.tinta,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {moeda(c.valor)}
              </p>
            </div>
          ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Selo tom={estadoPagamento === 'quitado' ? 'verde' : estadoPagamento === 'parcial' ? 'ambar' : 'coral'}>
          {estadoPagamento === 'quitado' ? 'Quitado' : estadoPagamento === 'parcial' ? 'Pagamento parcial' : 'Sem quitação'}
        </Selo>
        <span style={{ fontSize: 12.5, color: COR.apagado }}>
          Status do pedido vem do que o dinheiro diz, não do estado do workflow.
        </span>
      </div>

      {/* Lista de pagamentos */}
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
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 14.5, fontWeight: 700, color: COR.tinta }}>
            Pagamentos
          </h2>
          <Selo tom="neutro">{pagamentos.length}</Selo>
        </div>

        {pagamentos.length === 0 ? (
          <EstadoVazio
            titulo="Nenhuma cobrança registrada"
            descricao="Pedidos em rascunho não geram pagamento até serem enviados para o cliente."
          />
        ) : (
          <div>
            {pagamentos.map((p) => {
              const tEstado = termo(ESTADOS_PAGAMENTO, p.estado);
              const tMetodo = termo(METODOS_PAGAMENTO, p.metodo);
              return (
                <div
                  key={p.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1.4fr',
                    gap: 16,
                    alignItems: 'center',
                    padding: '14px 22px',
                    borderBottom: `1px solid ${COR.linhaClara}`,
                    fontSize: 13.5,
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Selo tom={PAG_TOM[p.estado] ?? 'neutro'}>{tEstado.rotulo}</Selo>
                    <Selo tom={METODO_TOM[p.metodo] ?? 'neutro'}>{tMetodo.rotulo}</Selo>
                  </div>
                  <span
                    style={{
                      textAlign: 'right',
                      fontWeight: 700,
                      color: COR.tinta,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {moeda(p.valor)}
                  </span>
                  <span style={{ fontSize: 12.5, color: COR.apagado }}>
                    {p.provedor ?? '—'}
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                    <span style={{ fontSize: 12, color: COR.texto }}>
                      {p.pago_em ? `pago em ${dataHora(p.pago_em)}` : `criado em ${dataHora(p.criado_em)}`}
                    </span>
                    {p.id_externo && (
                      <span
                        style={{
                          fontSize: 11,
                          color: COR.fraco,
                          fontFamily: 'monospace',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {p.id_externo}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
