'use client';

/**
 * Casca de abas do detalhe do pedido.
 *
 * Cada aba é um componente próprio, todos no mesmo padrão visual (UI kit).
 * O conteúdo existente (régua, ficha, OS, ações) continua em `PedidoDoDesign`,
 * que vira a aba "Resumo".
 *
 * `eventos` (timeline) é montado uma vez no `PedidoDetalhe` a partir dos dados
 * do `PedidoDetalhado` e reusado pela aba Resumo e pela aba Histórico.
 */

import type {
  LinhaExpedicao,
  LinhaPagamento,
  LinhaProducao,
  PedidoDetalhado,
  ProjetoDoPedido,
  ArquivoDoPedido,
  HistoricoProducao,
} from '@/lib/pedidos';
import PedidoDoDesign from '@/components/app/PedidoDoDesign';
import ProjetosDoPedido from '@/components/app/ProjetosDoPedido';
import PagamentoDoPedido from '@/components/app/PagamentoDoPedido';
import ProducaoDoPedido from '@/components/app/ProducaoDoPedido';
import EntregaDoPedido from '@/components/app/EntregaDoPedido';
import ArquivosDoPedido from '@/components/app/ArquivosDoPedido';
import HistoricoDoPedido, { montarEventosDoPedido } from '@/components/app/HistoricoDoPedido';
import AbasPedido from '@/components/app/AbasPedido';

export type AbaPedido =
  | 'resumo'
  | 'projetos'
  | 'pagamento'
  | 'producao'
  | 'entrega'
  | 'arquivos'
  | 'historico';

export default function PedidoDetalhe({
  dados,
  aba,
  projetos,
  arquivos,
  producaoHistorico,
}: {
  dados: PedidoDetalhado;
  aba: AbaPedido;
  projetos: ProjetoDoPedido[];
  arquivos: ArquivoDoPedido[];
  producaoHistorico: HistoricoProducao[];
}) {
  const eventos = montarEventosDoPedido({
    pedido: dados.pedido,
    pagamentos: dados.pagamentos,
    producao: dados.producao,
    expedicao: dados.expedicao,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <AbasPedido ativa={aba} />

      {aba === 'resumo' && <PedidoDoDesign dados={dados} />}

      {aba === 'projetos' && (
        <ProjetosDoPedido pedidoId={dados.pedido.id} projetos={projetos} />
      )}

      {aba === 'pagamento' && (
        <PagamentoDoPedido pedido={dados.pedido} pagamentos={dados.pagamentos} />
      )}

      {aba === 'producao' && (
        <ProducaoDoPedido
          pedido={dados.pedido}
          producao={dados.producao}
          historico={producaoHistorico}
        />
      )}

      {aba === 'entrega' && (
        <EntregaDoPedido pedido={dados.pedido} expedicao={dados.expedicao} />
      )}

      {aba === 'arquivos' && <ArquivosDoPedido arquivos={arquivos} />}

      {aba === 'historico' && <HistoricoDoPedido eventos={eventos} />}
    </div>
  );
}
