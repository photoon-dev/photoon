import { redirect } from 'next/navigation';
import { lojaAtual, planoDaLoja, usoAtual } from '@/lib/lojista';
import { dadosVendedores } from '@/lib/comercial';
import ShellLojista from '@/components/app/ShellLojista';
import CardPlano from '@/components/app/CardPlano';
import PainelVendedores from '@/components/app/PainelVendedores';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const atual = await lojaAtual();
  if (!atual) redirect('/');

  const [dados, plano, uso] = await Promise.all([
    dadosVendedores(atual.id),
    planoDaLoja(atual.id),
    usoAtual(atual.id),
  ]);

  return (
    <ShellLojista ativo={10} cartaoPlano={<CardPlano plano={plano} uso={uso} compacto />}>
      <PainelVendedores dados={dados} />
    </ShellLojista>
  );
}
