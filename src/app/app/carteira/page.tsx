import { redirect } from 'next/navigation';
import { lojaAtual, planoDaLoja, usoAtual } from '@/lib/lojista';
import { carteiraDaLoja, resolverPeriodo } from '@/lib/financeiro';
import ShellLojista from '@/components/app/ShellLojista';
import CardPlano from '@/components/app/CardPlano';
import PainelCarteira from '@/components/app/PainelCarteira';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function CarteiraPage({
  searchParams,
}: {
  searchParams: Promise<{ dias?: string; de?: string; ate?: string }>;
}) {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const periodo = resolverPeriodo(await searchParams);
  const [carteira, plano, uso] = await Promise.all([
    carteiraDaLoja(loja.id, periodo),
    planoDaLoja(loja.id),
    usoAtual(loja.id),
  ]);

  return (
    <ShellLojista ativo={13} cartaoPlano={<CardPlano plano={plano} uso={uso} compacto />}>
      <PainelCarteira carteira={carteira} periodo={periodo} />
    </ShellLojista>
  );
}
