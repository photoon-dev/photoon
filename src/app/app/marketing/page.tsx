import { redirect } from 'next/navigation';
import { molduraDaLoja } from '@/lib/painel-loja';
import MarketingDesign, { CSS_PSEUDO } from '@/components/design/MarketingDesign';
import TelaDoDesign from '@/components/app/TelaDoDesign';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const m = await molduraDaLoja();
  if (!m) redirect('/');

  return (
    <TelaDoDesign
      Design={MarketingDesign}
      cssPseudo={CSS_PSEUDO}
      ativo={11}
      painel={m.painel}
    />
  );
}
