import { redirect } from 'next/navigation';
import { molduraDaLoja } from '@/lib/painel-loja';
import { MODULO } from '@/lib/rotas-lojista';
import { listarEnvios, pedidosSemEnvio } from '@/lib/pedidos';
import { planoDaLoja, usoAtual } from '@/lib/lojista';
import ShellLojista from '@/components/app/ShellLojista';
import CardPlano from '@/components/app/CardPlano';
import PainelExpedicaoPadrao from '@/components/app/PainelExpedicaoPadrao';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const m = await molduraDaLoja();
  if (!m) redirect('/');

  const [envios, semEnvio, plano, uso] = await Promise.all([
    listarEnvios(m.loja.id, ''),
    pedidosSemEnvio(m.loja.id),
    planoDaLoja(m.loja.id),
    usoAtual(m.loja.id),
  ]);

  return (
    <ShellLojista ativo={MODULO['Expedição']} cartaoPlano={<CardPlano plano={plano} uso={uso} compacto />}>
      <PainelExpedicaoPadrao
        envios={envios.envios}
        porEstado={envios.porEstado}
        semEnvio={Array.isArray(semEnvio) ? semEnvio.length : Number(semEnvio ?? 0)}
      />
    </ShellLojista>
  );
}
