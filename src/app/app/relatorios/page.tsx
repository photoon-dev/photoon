import { redirect } from 'next/navigation';
import { lojaAtual, planoDaLoja, usoAtual } from '@/lib/lojista';
import { relatoriosDaLoja, resolverPeriodo } from '@/lib/financeiro';
import ShellLojista from '@/components/app/ShellLojista';
import CardPlano from '@/components/app/CardPlano';
import PainelRelatorios from '@/components/app/PainelRelatorios';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function RelatoriosPage({
  searchParams,
}: {
  searchParams: Promise<{ dias?: string; de?: string; ate?: string }>;
}) {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const periodo = resolverPeriodo(await searchParams);
  const [dados, plano, uso] = await Promise.all([
    relatoriosDaLoja(loja.id, periodo),
    planoDaLoja(loja.id),
    usoAtual(loja.id),
  ]);

  return (
    <ShellLojista ativo={14} cartaoPlano={<CardPlano plano={plano} uso={uso} compacto />}>
      <PainelRelatorios dados={dados} periodo={periodo} />
    </ShellLojista>
  );
}
