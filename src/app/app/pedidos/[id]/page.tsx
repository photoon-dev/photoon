import { notFound, redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { getPedido } from '@/lib/pedidos';
import PedidoDoDesign from '@/components/app/PedidoDoDesign';
import ShellLojista from '@/components/app/ShellLojista';
import { MODULO } from '@/lib/rotas-lojista';
import '../../app.css';

export const dynamic = 'force-dynamic';

export default async function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const atual = await lojaAtual();
  if (!atual) redirect('/');
  const { id } = await params;

  const pedido = await getPedido(atual.id, id);
  // A RLS já limita ao pedido da própria loja; ausente aqui significa 404.
  if (!pedido) notFound();

  return (
    <ShellLojista ativo={MODULO['Pedidos']}>
      <PedidoDoDesign
        dados={pedido}
      />
    </ShellLojista>
  );
}
