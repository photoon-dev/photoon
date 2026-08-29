import { redirect } from 'next/navigation';
import { lojaAtual, planoDaLoja, usoAtual } from '@/lib/lojista';
import { cifragemDisponivel, gatewaysDaLoja } from '@/lib/financeiro';
import ShellLojista from '@/components/app/ShellLojista';
import CardPlano from '@/components/app/CardPlano';
import PainelIntegracoes from '@/components/app/PainelIntegracoes';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function IntegracoesPage() {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const [gateways, plano, uso] = await Promise.all([
    gatewaysDaLoja(loja.id),
    planoDaLoja(loja.id),
    usoAtual(loja.id),
  ]);

  return (
    <ShellLojista ativo={16} cartaoPlano={<CardPlano plano={plano} uso={uso} compacto />}>
      {/* A credencial em si nunca chega aqui: `gatewaysDaLoja` devolve só a máscara. */}
      <PainelIntegracoes gateways={gateways} cifragemOk={cifragemDisponivel()} />
    </ShellLojista>
  );
}
