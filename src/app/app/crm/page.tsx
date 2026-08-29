import { redirect } from 'next/navigation';
import { lojaAtual, planoDaLoja, usoAtual } from '@/lib/lojista';
import { dadosCRM } from '@/lib/comercial';
import ShellLojista from '@/components/app/ShellLojista';
import CardPlano from '@/components/app/CardPlano';
import PainelCRM from '@/components/app/PainelCRM';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const atual = await lojaAtual();
  if (!atual) redirect('/');

  const [dados, plano, uso] = await Promise.all([
    dadosCRM(atual.id),
    planoDaLoja(atual.id),
    usoAtual(atual.id),
  ]);

  return (
    <ShellLojista ativo={9} cartaoPlano={<CardPlano plano={plano} uso={uso} compacto />}>
      <PainelCRM dados={dados} />
    </ShellLojista>
  );
}
