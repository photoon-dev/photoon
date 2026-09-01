import { FileiraKpi, Lista, Selo, ICONES, serieDiaria, type Tom } from '@/components/app/padroes';
import { reais } from '@/lib/preco';
import type { DadosCRM, EstadoCliente } from '@/lib/comercial';

/** CRM, nos padrões do painel. */

const ESTADOS: Record<EstadoCliente, [string, Tom]> = {
  ativo: ['Ativo', 'verde'],
  sem_pedido: ['Sem pedido', 'ambar'],
  sem_acesso: ['Nunca entrou', 'neutro'],
  inativo: ['Inativo', 'coral'],
};

/**
 * O estado sai do comportamento, não de um campo.
 *
 * Quem comprou obviamente acessou — a ordem importa. Com a checagem de acesso
 * primeiro, um cliente com vinte pedidos aparecia como "nunca entrou", porque o
 * `primeiro_acesso_em` só é preenchido pelo login e o pedido pode ter sido
 * lançado pelo balcão.
 */
function estadoDe(c: DadosCRM['clientes'][number]): EstadoCliente {
  if (c.pedidos > 0) {
    if (!c.ultimoPedidoEm) return 'ativo';
    const dias = (Date.now() - new Date(c.ultimoPedidoEm).getTime()) / 86_400_000;
    return dias > 180 ? 'inativo' : 'ativo';
  }
  return c.primeiro_acesso_em ? 'sem_pedido' : 'sem_acesso';
}

export default function PainelCRMPadrao({ dados }: { dados: DadosCRM }) {
  const cs = dados.clientes;
  const receita = cs.reduce((t, c) => t + c.totalGasto, 0);
  const ticket = cs.filter((c) => c.pedidosPagos > 0);

  const linhas = cs.map((c) => {
    const est = estadoDe(c);
    const [rot, tom] = ESTADOS[est];
    const nome = c.nome ?? c.email ?? 'Sem nome';
    return {
      id: c.id,
      iniciais: nome.slice(0, 2).toUpperCase(),
      tomAvatar: tom,
      titulo: nome,
      subtitulo: c.email ?? undefined,
      celulas: [
        <Selo key="e" texto={rot} tom={tom} />,
        <span key="p">{c.pedidos}</span>,
        <strong key="g" className="font-bold">{reais(c.totalGasto)}</strong>,
        c.pedidosPagos ? reais(c.ticketMedio) : <span className="text-muted-2">—</span>,
        c.ultimoPedidoEm
          ? new Date(c.ultimoPedidoEm).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
          : <span className="text-muted-2">nunca</span>,
      ],
    };
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="m-0 text-[12px] font-bold uppercase tracking-[1.6px] text-muted-2">
          Comercial · CRM
        </p>
        <h1 className="m-0 mt-1.5 text-[32px] font-extrabold leading-[1.15] tracking-[-.8px]">
          Clientes
        </h1>
        <p className="m-0 mt-2 text-[14.5px] text-muted">
          {cs.length === 0
            ? 'Nenhum cliente cadastrado ainda.'
            : `${cs.length} ${cs.length === 1 ? 'cliente' : 'clientes'} · ${reais(receita)} em compras`}
        </p>
      </div>

      <FileiraKpi
        cartoes={[
          { rotulo: 'Clientes', valor: cs.length, tom: 'azul', icone: ICONES.pessoas,
            nota: 'na loja', serie: serieDiaria(cs.map((c) => c.convidado_em)) },
          {
            rotulo: 'Ativos',
            valor: cs.filter((c) => estadoDe(c) === 'ativo').length,
            tom: 'verde',
            icone: ICONES.estrela,
            nota: 'compraram',
            serie: serieDiaria(cs.map((c) => c.ultimoPedidoEm)),
          },
          {
            rotulo: 'Sem pedido',
            valor: cs.filter((c) => estadoDe(c) === 'sem_pedido').length,
            tom: 'ambar',
            icone: ICONES.alerta,
            nota: 'oportunidade',
          },
          {
            rotulo: 'Nunca entraram',
            // Contado pela MESMA função da lista: usar a contagem da biblioteca
            // fazia o cartão dizer "1 ativo" com zero ativos na tabela.
            valor: cs.filter((c) => estadoDe(c) === 'sem_acesso').length,
            tom: 'neutro',
            icone: ICONES.relogio,
            nota: 'convite pendente',
          },
          { rotulo: 'Receita', valor: reais(receita), tom: 'verde', icone: ICONES.dinheiro,
            nota: 'no total' },
          {
            rotulo: 'Ticket médio',
            valor: ticket.length
              ? reais(ticket.reduce((t, c) => t + c.ticketMedio, 0) / ticket.length)
              : '—',
            tom: 'roxo',
            icone: ICONES.grafico,
            nota: 'por pedido pago',
          },
        ]}
      />

      <Lista
        colunas={[
          { titulo: 'Cliente', largura: 'minmax(220px,1.7fr)' },
          { titulo: 'Estado', largura: 'minmax(120px,.9fr)' },
          { titulo: 'Pedidos', largura: 'minmax(80px,.6fr)' },
          { titulo: 'Total gasto', largura: 'minmax(110px,.9fr)' },
          { titulo: 'Ticket médio', largura: 'minmax(110px,.9fr)' },
          { titulo: 'Último pedido', largura: 'minmax(110px,.8fr)' },
        ]}
        linhas={linhas}
        vazio="Nenhum cliente. Cadastre pelo painel de Clientes e envie o link da loja."
        rodape={<span>{linhas.length} clientes</span>}
      />
    </div>
  );
}
