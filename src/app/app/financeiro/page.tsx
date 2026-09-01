import { redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import {
  carteiraDaLoja,
  cifragemDisponivel,
  gatewaysDaLoja,
  resolverPeriodo,
} from '@/lib/financeiro';
import { MODULO } from '@/lib/rotas-lojista';
import ShellLojista from '@/components/app/ShellLojista';
import FinanceiroDaLoja from '@/components/app/FinanceiroDaLoja';
import '../app.css';

export const dynamic = 'force-dynamic';

/**
 * Financeiro — /financeiro
 *
 * O menu já apontava para cá (esmaecido) e `/carteira` e `/pagamentos`
 * prometiam este destino. Agora ele existe, ligado a `pagamentos` e
 * `lojista_gateways`.
 *
 * Período e aba vivem na URL, como em Pedidos.
 */
export default async function Pagina({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const q = await searchParams;
  const periodo = resolverPeriodo({ dias: q.dias, de: q.de, ate: q.ate });

  const [carteira, gateways] = await Promise.all([
    carteiraDaLoja(loja.id, periodo),
    gatewaysDaLoja(loja.id),
  ]);

  return (
    <ShellLojista ativo={MODULO['Financeiro']}>
      <FinanceiroDaLoja
        carteira={carteira}
        gateways={gateways}
        periodo={periodo}
        cifragemOk={cifragemDisponivel()}
      />
    </ShellLojista>
  );
}
