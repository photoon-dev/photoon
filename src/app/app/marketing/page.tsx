import { redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { MODULO } from '@/lib/rotas-lojista';
import MarketingDesign, { CSS_PSEUDO } from '@/components/design/MarketingDesign';
import ShellLojista from '@/components/app/ShellLojista';
import ConteudoDoDesign from '@/components/app/ConteudoDoDesign';
import AvisoRotaLegada from '@/components/app/AvisoRotaLegada';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  return (
    <ShellLojista ativo={MODULO['Cupons']}>
      <AvisoRotaLegada rota="/marketing" />
      <ConteudoDoDesign Design={MarketingDesign} cssPseudo={CSS_PSEUDO} />
    </ShellLojista>
  );
}
