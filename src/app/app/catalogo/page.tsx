import { redirect } from 'next/navigation';
import { molduraDaLoja } from '@/lib/painel-loja';
import CatalogoDesign, { CSS_PSEUDO } from '@/components/design/CatalogoDesign';
import TelaDoDesign from '@/components/app/TelaDoDesign';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const m = await molduraDaLoja();
  if (!m) redirect('/');

  return (
    <TelaDoDesign
      Design={CatalogoDesign}
      cssPseudo={CSS_PSEUDO}
      ativo={5}
      painel={m.painel}
    />
  );
}
