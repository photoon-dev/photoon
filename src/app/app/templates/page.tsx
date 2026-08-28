import { redirect } from 'next/navigation';
import { lojaAtual, listarTemplates } from '@/lib/lojista';
import ShellLojista from '@/components/app/ShellLojista';
import PainelTemplates from '@/components/app/PainelTemplates';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function TemplatesPage() {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const templates = await listarTemplates(loja.id);

  return (
    <ShellLojista ativo={7}>
      <PainelTemplates templates={templates} />
    </ShellLojista>
  );
}
