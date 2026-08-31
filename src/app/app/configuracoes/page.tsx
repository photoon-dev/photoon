import { redirect } from 'next/navigation';
import { lojaAtual, getLojistaPorId, planoDaLoja, usoAtual } from '@/lib/lojista';
import { ROOT_DOMAIN } from '@/lib/tenant';
import { MODULO } from '@/lib/rotas-lojista';
import ShellLojista from '@/components/app/ShellLojista';
import PainelConfiguracoes, { type DadosLoja } from '@/components/app/PainelConfiguracoes';
import CardPlano from '@/components/app/CardPlano';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function ConfiguracoesPage() {
  const atual = await lojaAtual();
  if (!atual) redirect('/');

  const [loja, plano, uso] = await Promise.all([
    getLojistaPorId(atual.id),
    planoDaLoja(atual.id),
    usoAtual(atual.id),
  ]);
  if (!loja) redirect('/');

  return (
    <ShellLojista ativo={MODULO['Configurações']} cartaoPlano={<CardPlano plano={plano} uso={uso} compacto />}>
      <CardPlano plano={plano} uso={uso} />
      <PainelConfiguracoes loja={loja as unknown as DadosLoja} dominio={ROOT_DOMAIN} />
    </ShellLojista>
  );
}
