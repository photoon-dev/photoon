import { notFound, redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import {
  getPedido,
  projetosDoPedido,
  arquivosDoPedido,
  historicoProducaoDoPedido,
} from '@/lib/pedidos';
import PedidoDetalhe, { type AbaPedido } from '@/components/app/PedidoDetalhe';
import ShellLojista from '@/components/app/ShellLojista';
import { MODULO } from '@/lib/rotas-lojista';
import '../../app.css';

export const dynamic = 'force-dynamic';

const ABAS_VALIDAS: ReadonlySet<AbaPedido> = new Set([
  'resumo',
  'projetos',
  'pagamento',
  'producao',
  'entrega',
  'arquivos',
  'historico',
]);

export default async function PedidoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const atual = await lojaAtual();
  if (!atual) redirect('/');
  const { id } = await params;
  const q = await searchParams;

  const abaBruta = (q.aba ?? 'resumo') as string;
  const aba: AbaPedido = (ABAS_VALIDAS.has(abaBruta as AbaPedido) ? abaBruta : 'resumo') as AbaPedido;

  const pedido = await getPedido(atual.id, id);
  if (!pedido) notFound();

  // Cada aba puxa só o que precisa. A Resumo já vem em `getPedido`; as outras
  // abas pedem dados adicionais em paralelo, e o `Promise.all` mantém tudo
  // num único round trip de banco.
  const [projetos, arquivos, producaoHistorico] = await Promise.all([
    aba === 'projetos' ? projetosDoPedido(atual.id, id) : Promise.resolve([]),
    aba === 'arquivos' ? arquivosDoPedido(atual.id, id) : Promise.resolve([]),
    aba === 'producao' || aba === 'historico'
      ? historicoProducaoDoPedido(atual.id, id)
      : Promise.resolve([]),
  ]);

  return (
    <ShellLojista ativo={MODULO['Pedidos']}>
      <PedidoDetalhe
        dados={pedido}
        aba={aba}
        projetos={projetos}
        arquivos={arquivos}
        producaoHistorico={producaoHistorico}
      />
    </ShellLojista>
  );
}
