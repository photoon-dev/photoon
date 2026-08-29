import { redirect } from 'next/navigation';
import { lojaAtual, planoDaLoja, usoAtual } from '@/lib/lojista';
import { AUDITORIA_POR_PAGINA, auditoriaDaLoja, resolverPeriodo } from '@/lib/financeiro';
import ShellLojista from '@/components/app/ShellLojista';
import CardPlano from '@/components/app/CardPlano';
import PainelAuditoria from '@/components/app/PainelAuditoria';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function AuditoriaPage({
  searchParams,
}: {
  searchParams: Promise<{ dias?: string; de?: string; ate?: string; acao?: string; p?: string }>;
}) {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const params = await searchParams;
  const periodo = resolverPeriodo(params);
  const acao = params.acao ?? '';
  const pagina = Math.max(0, Number(params.p) || 0);

  const [registro, plano, uso] = await Promise.all([
    auditoriaDaLoja(loja.id, periodo, { acao, pagina }),
    planoDaLoja(loja.id),
    usoAtual(loja.id),
  ]);

  return (
    <ShellLojista ativo={17} cartaoPlano={<CardPlano plano={plano} uso={uso} compacto />}>
      <PainelAuditoria
        linhas={registro.linhas}
        acoes={registro.acoes}
        total={registro.total}
        temAlgumRegistro={registro.temAlgumRegistro}
        pagina={pagina}
        porPagina={AUDITORIA_POR_PAGINA}
        acao={acao}
        periodo={periodo}
      />
    </ShellLojista>
  );
}
