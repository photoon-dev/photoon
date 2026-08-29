import { redirect } from 'next/navigation';
import { molduraDaLoja } from '@/lib/painel-loja';
import VendedoresDesign, { CSS_PSEUDO } from '@/components/design/VendedoresDesign';
import TelaDoDesign from '@/components/app/TelaDoDesign';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const m = await molduraDaLoja();
  if (!m) redirect('/');

  return (
    <TelaDoDesign
      Design={VendedoresDesign}
      cssPseudo={CSS_PSEUDO}
      ativo={10}
      painel={m.painel}
    />
  );
}
