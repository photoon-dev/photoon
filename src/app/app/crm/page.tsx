import { redirect } from 'next/navigation';
import { molduraDaLoja } from '@/lib/painel-loja';
import { MODULO } from '@/lib/rotas-lojista';
import { dadosCRM } from '@/lib/comercial';
import { planoDaLoja, usoAtual } from '@/lib/lojista';
import ShellLojista from '@/components/app/ShellLojista';
import CardPlano from '@/components/app/CardPlano';
import PainelCRMPadrao from '@/components/app/PainelCRMPadrao';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const m = await molduraDaLoja();
  if (!m) redirect('/');

  const [dados, plano, uso] = await Promise.all([
    dadosCRM(m.loja.id),
    planoDaLoja(m.loja.id),
    usoAtual(m.loja.id),
  ]);

  return (
    <ShellLojista ativo={MODULO['Clientes']} cartaoPlano={<CardPlano plano={plano} uso={uso} compacto />}>
      <PainelCRMPadrao dados={dados} />
    </ShellLojista>
  );
}
