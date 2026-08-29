import { redirect } from 'next/navigation';
import { lojaAtual, planoDaLoja, usoAtual } from '@/lib/lojista';
import { listarProdutos, listarModelos } from '@/lib/comercial';
import ShellLojista from '@/components/app/ShellLojista';
import CardPlano from '@/components/app/CardPlano';
import PainelPrecos from '@/components/app/PainelPrecos';
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

  const [produtos, modelos, plano, uso] = await Promise.all([
    listarProdutos(atual.id),
    listarModelos(atual.id),
    planoDaLoja(atual.id),
    usoAtual(atual.id),
  ]);

  return (
    <ShellLojista ativo={6} cartaoPlano={<CardPlano plano={plano} uso={uso} compacto />}>
      <PainelPrecos produtos={produtos} modelos={modelos} />
    </ShellLojista>
  );
}
