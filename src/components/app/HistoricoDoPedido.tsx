'use client';

import { COR } from '@/components/ui/tokens';
import EstadoVazio from '@/components/ui/EstadoVazio';
import {
  ESTADOS_EXPEDICAO,
  ESTADOS_PAGAMENTO,
  ETAPAS_PRODUCAO,
  dataHora,
  moeda,
  termo,
} from '@/lib/pedidos-termos';

export type EventoPedido = {
  /** ISO timestamp; usado para ordenar e mostrar. */
  quando: string;
  /** Rótulo curto, em uma frase. */
  titulo: string;
  /** Cor do pontinho na timeline. */
  cor: string;
  /** Categoria, para agrupar visualmente. */
  categoria: 'pedido' | 'pagamento' | 'producao' | 'expedicao';
};

const cores = {
  pedido: '#2563EB',
  pagamento: '#059669',
  producao: '#0891B2',
  expedicao: '#4F46E5',
};

/**
 * Aba Histórico do detalhe do pedido.
 *
 * A timeline é montada a partir do que existe no banco: criação do pedido,
 * pagamentos, fichas de produção (com a etapa atual), envios. Nenhuma data
 * é inferida — se não está gravada, não aparece.
 */
export default function HistoricoDoPedido({ eventos }: { eventos: EventoPedido[] }) {
  if (eventos.length === 0) {
    return (
      <EstadoVazio
        titulo="Sem eventos registrados"
        descricao="O histórico aparece conforme o pedido avança: pagamento confirmado, produção movida, envio postado."
      />
    );
  }

  return (
    <div
      style={{
        background: COR.papel,
        border: `1px solid ${COR.linha}`,
        borderRadius: 20,
        padding: '22px 26px',
        boxShadow: '0 2px 8px rgba(11,18,32,.03)',
      }}
    >
      <ol
        style={{
          listStyle: 'none',
          padding: 0,
          margin: 0,
          position: 'relative',
        }}
      >
        {/* Linha vertical da timeline */}
        <span
          aria-hidden
          style={{
            position: 'absolute',
            left: 7,
            top: 6,
            bottom: 6,
            width: 2,
            background: COR.linha,
            borderRadius: 1,
          }}
        />
        {eventos.map((e, i) => (
          <li
            key={i}
            style={{
              position: 'relative',
              padding: '8px 0 8px 28px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <span
              aria-hidden
              style={{
                position: 'absolute',
                left: 0,
                top: 12,
                width: 16,
                height: 16,
                borderRadius: 999,
                background: e.cor,
                boxShadow: `0 0 0 4px ${e.cor}1A`,
              }}
            />
            <span style={{ fontSize: 13.5, color: COR.tinta, fontWeight: 600 }}>{e.titulo}</span>
            <span
              style={{
                fontSize: 11.5,
                color: COR.fraco,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {dataHora(e.quando)}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * Constrói a timeline a partir das entidades do pedido. Centraliza a regra
 * "o que conta como evento" num só lugar — usado tanto pela aba própria quanto
 * pela régua do Resumo.
 */
export function montarEventosDoPedido({
  pedido,
  pagamentos,
  producao,
  expedicao,
}: {
  pedido: {
    numero: number;
    criado_em: string;
    visto_em: string | null;
    atualizado_em: string;
  };
  pagamentos: Array<{ estado: string; valor: number; pago_em: string | null; criado_em: string }>;
  producao: Array<{ etapa: string; atualizado_em: string }>;
  expedicao: Array<{ estado: string; postado_em: string | null; entregue_em: string | null; atualizado_em: string }>;
}): EventoPedido[] {
  const eventos: EventoPedido[] = [
    {
      quando: pedido.criado_em,
      titulo: `Pedido #${pedido.numero} aberto`,
      cor: cores.pedido,
      categoria: 'pedido',
    },
  ];

  if (pedido.visto_em) {
    eventos.push({
      quando: pedido.visto_em,
      titulo: 'Aberto pela loja',
      cor: cores.pedido,
      categoria: 'pedido',
    });
  }

  for (const p of pagamentos) {
    eventos.push({
      quando: p.pago_em ?? p.criado_em,
      titulo: `Pagamento ${termo(ESTADOS_PAGAMENTO, p.estado).rotulo.toLowerCase()} · ${moeda(p.valor)}`,
      cor: cores.pagamento,
      categoria: 'pagamento',
    });
  }

  for (const l of producao) {
    eventos.push({
      quando: l.atualizado_em,
      titulo: `Produção: ${termo(ETAPAS_PRODUCAO, l.etapa).rotulo.toLowerCase()}`,
      cor: cores.producao,
      categoria: 'producao',
    });
  }

  for (const e of expedicao) {
    eventos.push({
      quando: e.entregue_em ?? e.postado_em ?? e.atualizado_em,
      titulo: `Entrega: ${termo(ESTADOS_EXPEDICAO, e.estado).rotulo.toLowerCase()}`,
      cor: cores.expedicao,
      categoria: 'expedicao',
    });
  }

  return eventos.sort((a, b) => (b.quando ?? '').localeCompare(a.quando ?? ''));
}
