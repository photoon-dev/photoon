import { redirect } from 'next/navigation';
import { molduraDaLoja } from '@/lib/painel-loja';
import { MODULO } from '@/lib/rotas-lojista';
import { filaDeProducao } from '@/lib/pedidos';
import ShellLojista from '@/components/app/ShellLojista';
import CardPlano from '@/components/app/CardPlano';
import { planoDaLoja, usoAtual } from '@/lib/lojista';
import PainelProducaoPadrao from '@/components/app/PainelProducaoPadrao';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const m = await molduraDaLoja();
  if (!m) redirect('/');

  const [fila, plano, uso] = await Promise.all([
    filaDeProducao(m.loja.id),
    planoDaLoja(m.loja.id),
    usoAtual(m.loja.id),
  ]);

  return (
    <ShellLojista ativo={MODULO['Produção']} cartaoPlano={<CardPlano plano={plano} uso={uso} compacto />}>
      <PainelProducaoPadrao fila={fila} />
    </ShellLojista>
  );
}
