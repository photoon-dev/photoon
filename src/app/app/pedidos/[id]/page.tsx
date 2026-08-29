import { notFound, redirect } from 'next/navigation';
import { lojaAtual, planoDaLoja, usoAtual } from '@/lib/lojista';
import { getPedido } from '@/lib/pedidos';
import ShellLojista from '@/components/app/ShellLojista';
import CardPlano from '@/components/app/CardPlano';
import PainelPedidosDetalhe from '@/components/app/PainelPedidosDetalhe';
import '../../app.css';

export const dynamic = 'force-dynamic';

export default async function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const atual = await lojaAtual();
  if (!atual) redirect('/');
  const { id } = await params;

  const [pedido, plano, uso] = await Promise.all([
    getPedido(atual.id, id),
    planoDaLoja(atual.id),
    usoAtual(atual.id),
  ]);
  // A RLS já limita ao pedido da própria loja; ausente aqui significa 404.
  if (!pedido) notFound();

  return (
    <ShellLojista ativo={1} cartaoPlano={<CardPlano plano={plano} uso={uso} compacto />}>
      <PainelPedidosDetalhe dados={pedido} />
    </ShellLojista>
  );
}
