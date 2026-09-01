import { redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { relatoriosDaLoja, resolverPeriodo } from '@/lib/financeiro';
import { MODULO } from '@/lib/rotas-lojista';
import ShellLojista from '@/components/app/ShellLojista';
import PainelRelatorios from '@/components/app/PainelRelatorios';
import '../app.css';

export const dynamic = 'force-dynamic';

/**
 * Relatórios — /relatorios
 *
 * O período vem da URL, como em Pedidos e Financeiro: o link de "os últimos 90
 * dias" é guardável. Antes a tela era o `RelatoriosDesign` transliterado, com
 * os gráficos do protótipo.
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
  const dados = await relatoriosDaLoja(loja.id, periodo);

  return (
    <ShellLojista ativo={MODULO['Relatórios']}>
      <PainelRelatorios dados={dados} periodo={periodo} />
    </ShellLojista>
  );
}
