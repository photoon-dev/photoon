import { redirect } from 'next/navigation';
import { lojaAtual, planoDaLoja, usoAtual } from '@/lib/lojista';
import { listarPagamentos } from '@/lib/pedidos';
import ShellLojista from '@/components/app/ShellLojista';
import CardPlano from '@/components/app/CardPlano';
import PainelPagamentos from '@/components/app/PainelPagamentos';
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

  const filtros = { estado: q.estado ?? "", metodo: q.metodo ?? "", de: q.de ?? "", ate: q.ate ?? "" };
  const [dados, plano, uso] = await Promise.all([
    listarPagamentos(atual.id, filtros),
    planoDaLoja(atual.id),
    usoAtual(atual.id),
  ]);

  return (
    <ShellLojista ativo={12} cartaoPlano={<CardPlano plano={plano} uso={uso} compacto />}>
      <PainelPagamentos dados={dados} filtros={filtros} />
    </ShellLojista>
  );
}
