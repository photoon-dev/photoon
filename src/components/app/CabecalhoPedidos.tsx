import CartaoKPI from '@/components/ui/CartaoKPI';
import { COR } from '@/components/ui/tokens';
import { reais } from '@/lib/preco';
import type { PedidoResumo } from '@/lib/pedidos';

/**
 * Cabecalho da pagina de Pedidos: titulo + 5 KPIs.
 *
 * Renderizado no servidor a partir de `dados.pedidos`, para que o lojista
 * veja os numeros reais sem precisar de hidratacao. Os mesmos 5 KPIs
 * aparecem no design transliterado; aqui ficaram menores e mais densos
 * (versao padrao do CartaoKPI, nao a `compacto`) para alinhar com o resto
 * do cabecalho de Pedidos.
 *
 * A pagina renderiza: CabecalhoPedidos (KPIs) -> BarraDeFiltrosPedidos ->
 * PedidosDoDesign (sem KPIs). Os KPIs do design sao suprimidos por CSS
 * quando o rotulo vem vazio.
 */
export default function CabecalhoPedidos({
  pedidos,
  total,
  naoVistos,
}: {
  pedidos: PedidoResumo[];
  total: number;
  naoVistos: number;
}) {
  const conta = (e: string) => pedidos.filter((p) => p.estado === e).length;
  const emAberto = pedidos
    .filter((p) => p.estado === 'aguardando_pagamento')
    .reduce((t, p) => t + p.total, 0);

  // "Atrasado" e prazo vencido em pedido que ainda nao saiu: nao basta a data.
  const hoje = new Date().toISOString().slice(0, 10);
  const atrasados = pedidos.filter(
    (p) =>
      p.prazo_em &&
      p.prazo_em < hoje &&
      !['entregue', 'cancelado'].includes(p.estado),
  ).length;

  const num = (n: number) => n.toLocaleString('pt-BR');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: '0 0 4px',
              fontSize: 11,
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              color: COR.fraco,
              fontWeight: 700,
            }}
          >
            Operacao · Pedidos
          </p>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>
            Pedidos
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13.5, color: COR.apagado }}>
            {total.toLocaleString('pt-BR')} {total === 1 ? 'pedido' : 'pedidos'} nesta loja
            {naoVistos > 0 ? ` · ${naoVistos} ainda nao abertos` : ''}
          </p>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
          gap: 14,
        }}
      >
        <CartaoKPI
          rotulo="Nao vistos"
          valor={num(naoVistos)}
          nota={naoVistos ? 'aguardando voce abrir' : 'tudo visto'}
          tom="azul"
        />
        <CartaoKPI
          rotulo="Em producao"
          valor={num(conta('em_producao'))}
          nota="na fabrica agora"
          tom="ciano"
        />
        <CartaoKPI
          rotulo="Aguardam pagamento"
          valor={num(conta('aguardando_pagamento'))}
          nota={`${reais(emAberto)} em aberto`}
          tom="ambar"
        />
        <CartaoKPI
          rotulo="Atrasados"
          valor={num(atrasados)}
          nota={atrasados ? 'prazo vencido' : 'nenhum atraso'}
          tom={atrasados ? 'coral' : 'neutro'}
        />
        <CartaoKPI
          rotulo="Expedidos"
          valor={num(conta('enviado') + conta('entregue'))}
          nota="ja sairam"
          tom="verde"
        />
      </div>
    </div>
  );
}
