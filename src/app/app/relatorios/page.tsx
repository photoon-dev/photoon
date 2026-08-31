import { redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { MODULO } from '@/lib/rotas-lojista';
import RelatoriosDesign, { CSS_PSEUDO } from '@/components/design/RelatoriosDesign';
import ShellLojista from '@/components/app/ShellLojista';
import ConteudoDoDesign from '@/components/app/ConteudoDoDesign';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  return (
    <ShellLojista ativo={MODULO['Relatórios']}>
      <ConteudoDoDesign Design={RelatoriosDesign} cssPseudo={CSS_PSEUDO} />
    </ShellLojista>
  );
}
