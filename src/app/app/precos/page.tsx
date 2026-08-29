import { redirect } from 'next/navigation';
import { molduraDaLoja } from '@/lib/painel-loja';
import PrecosDesign, { CSS_PSEUDO } from '@/components/design/PrecosDesign';
import TelaDoDesign from '@/components/app/TelaDoDesign';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const m = await molduraDaLoja();
  if (!m) redirect('/');

  return (
    <TelaDoDesign
      Design={PrecosDesign}
      cssPseudo={CSS_PSEUDO}
      ativo={6}
      painel={m.painel}
    />
  );
}
