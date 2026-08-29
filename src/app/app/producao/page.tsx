import { redirect } from 'next/navigation';
import { lojaAtual, planoDaLoja, usoAtual } from '@/lib/lojista';
import { filaDeProducao, pedidosForaDaFila } from '@/lib/pedidos';
import ShellLojista from '@/components/app/ShellLojista';
import CardPlano from '@/components/app/CardPlano';
import PainelProducao from '@/components/app/PainelProducao';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const atual = await lojaAtual();
  if (!atual) redirect('/');
  const q = await searchParams;

  const [fila, foraDaFila, plano, uso] = await Promise.all([
    filaDeProducao(atual.id),
    pedidosForaDaFila(atual.id),
    planoDaLoja(atual.id),
    usoAtual(atual.id),
  ]);

  return (
    <ShellLojista ativo={2} cartaoPlano={<CardPlano plano={plano} uso={uso} compacto />}>
      <PainelProducao fila={fila} foraDaFila={foraDaFila} />
    </ShellLojista>
  );
}
