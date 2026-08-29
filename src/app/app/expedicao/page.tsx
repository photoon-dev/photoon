import { redirect } from 'next/navigation';
import { lojaAtual, planoDaLoja, usoAtual } from '@/lib/lojista';
import { listarEnvios, pedidosSemEnvio } from '@/lib/pedidos';
import ShellLojista from '@/components/app/ShellLojista';
import CardPlano from '@/components/app/CardPlano';
import PainelExpedicao from '@/components/app/PainelExpedicao';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const atual = await lojaAtual();
  if (!atual) redirect('/');
  const q = await searchParams;

  const estado = q.estado ?? "";
  const [envios, semEnvio, plano, uso] = await Promise.all([
    listarEnvios(atual.id, estado),
    pedidosSemEnvio(atual.id),
    planoDaLoja(atual.id),
    usoAtual(atual.id),
  ]);

  return (
    <ShellLojista ativo={3} cartaoPlano={<CardPlano plano={plano} uso={uso} compacto />}>
      <PainelExpedicao
        envios={envios.envios}
        porEstado={envios.porEstado}
        semEnvio={semEnvio}
        estado={estado}
      />
    </ShellLojista>
  );
}
