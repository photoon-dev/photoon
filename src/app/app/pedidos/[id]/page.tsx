import { notFound, redirect } from 'next/navigation';
import { identidadeLojista, lojaAtual, numerosDaLoja, planoDaLoja } from '@/lib/lojista';
import { getPedido } from '@/lib/pedidos';
import PedidoDoDesign from '@/components/app/PedidoDoDesign';
import '../../app.css';

export const dynamic = 'force-dynamic';

export default async function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const atual = await lojaAtual();
  if (!atual) redirect('/');
  const { id } = await params;

  const [pedido, ident, numeros, plano] = await Promise.all([
    getPedido(atual.id, id),
    identidadeLojista(),
    numerosDaLoja(atual.id),
    planoDaLoja(atual.id),
  ]);
  // A RLS já limita ao pedido da própria loja; ausente aqui significa 404.
  if (!pedido) notFound();

  return (
    <PedidoDoDesign
      painel={{
        lojaNome: atual.nome,
        usuarioNome: ident.nome,
        usuarioCargo: ident.email,
        numeros,
        plano: plano ? { nome: plano.nome, limite: plano.limite_projetos } : null,
      }}
      dados={pedido}
    />
  );
}
