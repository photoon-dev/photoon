import { redirect } from 'next/navigation';
import { lojaAtual, planoDaLoja, usoAtual } from '@/lib/lojista';
import { chamadosDaLoja } from '@/lib/financeiro';
import ShellLojista from '@/components/app/ShellLojista';
import CardPlano from '@/components/app/CardPlano';
import PainelSuporte from '@/components/app/PainelSuporte';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function SuportePage({
  searchParams,
}: {
  searchParams: Promise<{ estado?: string; prioridade?: string }>;
}) {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const { estado = '', prioridade = '' } = await searchParams;
  const [dados, plano, uso] = await Promise.all([
    chamadosDaLoja(loja.id, { estado, prioridade }),
    planoDaLoja(loja.id),
    usoAtual(loja.id),
  ]);

  return (
    <ShellLojista ativo={18} cartaoPlano={<CardPlano plano={plano} uso={uso} compacto />}>
      <PainelSuporte dados={dados} estado={estado} prioridade={prioridade} />
    </ShellLojista>
  );
}
