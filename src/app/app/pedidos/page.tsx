import { redirect } from 'next/navigation';
import { lojaAtual, planoDaLoja, usoAtual } from '@/lib/lojista';
import { listarPedidos } from '@/lib/pedidos';
import ShellLojista from '@/components/app/ShellLojista';
import CardPlano from '@/components/app/CardPlano';
import PainelPedidos from '@/components/app/PainelPedidos';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const atual = await lojaAtual();
  if (!atual) redirect('/');

  // Os filtros vivem na URL: assim o lojista pode guardar o link de "pedidos
  // atrasados" e voltar nele, e o botão de voltar do navegador funciona.
  const q = await searchParams;
  const filtros = {
    estado: q.estado ?? '',
    de: q.de ?? '',
    ate: q.ate ?? '',
    busca: q.busca ?? '',
    pagina: Number(q.pagina ?? 0) || 0,
  };

  const [dados, plano, uso] = await Promise.all([
    listarPedidos(atual.id, filtros),
    planoDaLoja(atual.id),
    usoAtual(atual.id),
  ]);

  return (
    <ShellLojista ativo={1} cartaoPlano={<CardPlano plano={plano} uso={uso} compacto />}>
      <PainelPedidos
        pedidos={dados.pedidos}
        total={dados.total}
        naoVistos={dados.naoVistos}
        filtros={filtros}
      />
    </ShellLojista>
  );
}
