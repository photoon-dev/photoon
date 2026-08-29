import { redirect } from 'next/navigation';
import { lojaAtual, planoDaLoja, usoAtual } from '@/lib/lojista';
import { dadosMarketing } from '@/lib/comercial';
import ShellLojista from '@/components/app/ShellLojista';
import CardPlano from '@/components/app/CardPlano';
import PainelMarketing from '@/components/app/PainelMarketing';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const atual = await lojaAtual();
  if (!atual) redirect('/');

  const [dados, plano, uso] = await Promise.all([
    dadosMarketing(atual.id),
    planoDaLoja(atual.id),
    usoAtual(atual.id),
  ]);

  return (
    <ShellLojista ativo={11} cartaoPlano={<CardPlano plano={plano} uso={uso} compacto />}>
      <PainelMarketing dados={dados} />
    </ShellLojista>
  );
}
