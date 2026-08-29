import { redirect } from 'next/navigation';
import { lojaAtual, planoDaLoja, usoAtual } from '@/lib/lojista';
import { listarProdutos, listarModelos } from '@/lib/comercial';
import ShellLojista from '@/components/app/ShellLojista';
import CardPlano from '@/components/app/CardPlano';
import PainelCatalogo from '@/components/app/PainelCatalogo';
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
    <ShellLojista ativo={5} cartaoPlano={<CardPlano plano={plano} uso={uso} compacto />}>
      <PainelCatalogo produtos={produtos} modelos={modelos} />
    </ShellLojista>
  );
}
