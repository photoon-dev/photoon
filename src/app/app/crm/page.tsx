import { redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { MODULO } from '@/lib/rotas-lojista';
import CRMDesign, { CSS_PSEUDO } from '@/components/design/CRMDesign';
import ShellLojista from '@/components/app/ShellLojista';
import ConteudoDoDesign from '@/components/app/ConteudoDoDesign';
import AvisoRotaLegada from '@/components/app/AvisoRotaLegada';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  return (
    <ShellLojista ativo={MODULO['Clientes']}>
      <AvisoRotaLegada rota="/crm" />
      <ConteudoDoDesign Design={CRMDesign} cssPseudo={CSS_PSEUDO} />
    </ShellLojista>
  );
}
