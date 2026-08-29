import { redirect } from 'next/navigation';
import { molduraDaLoja } from '@/lib/painel-loja';
import CRMDesign, { CSS_PSEUDO } from '@/components/design/CRMDesign';
import TelaDoDesign from '@/components/app/TelaDoDesign';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const m = await molduraDaLoja();
  if (!m) redirect('/');

  return (
    <TelaDoDesign
      Design={CRMDesign}
      cssPseudo={CSS_PSEUDO}
      ativo={9}
      painel={m.painel}
    />
  );
}
