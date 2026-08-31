import { redirect } from 'next/navigation';
import { lojaAtual, listarTemplates, planoDaLoja, usoAtual } from '@/lib/lojista';
import { MODULO } from '@/lib/rotas-lojista';
import ShellLojista from '@/components/app/ShellLojista';
import CardPlano from '@/components/app/CardPlano';
import PainelTemplates from '@/components/app/PainelTemplates';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function TemplatesPage() {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const [templates, plano, uso] = await Promise.all([
    listarTemplates(loja.id),
    planoDaLoja(loja.id),
    usoAtual(loja.id),
  ]);

  return (
    <ShellLojista ativo={MODULO['Templates e Design']} cartaoPlano={<CardPlano plano={plano} uso={uso} compacto />}>
      <PainelTemplates templates={templates} />
    </ShellLojista>
  );
}
