import { redirect } from 'next/navigation';
import { lojaAtual, planoDaLoja, usoAtual } from '@/lib/lojista';
import { dadosVitrine } from '@/lib/comercial';
import { ROOT_DOMAIN } from '@/lib/tenant';
import ShellLojista from '@/components/app/ShellLojista';
import CardPlano from '@/components/app/CardPlano';
import PainelLoja from '@/components/app/PainelLoja';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const atual = await lojaAtual();
  if (!atual) redirect('/');

  const [dados, plano, uso] = await Promise.all([
    dadosVitrine(atual.id),
    planoDaLoja(atual.id),
    usoAtual(atual.id),
  ]);

  // Sem vitrine configurada não há o que mostrar; a moldura sozinha explica.
  if (!dados) redirect('/configuracoes');

  return (
    <ShellLojista ativo={4} cartaoPlano={<CardPlano plano={plano} uso={uso} compacto />}>
      <PainelLoja dados={dados} dominio={ROOT_DOMAIN} />
    </ShellLojista>
  );
}
