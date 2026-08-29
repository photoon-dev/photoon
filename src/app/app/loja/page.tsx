import { redirect } from 'next/navigation';
import { molduraDaLoja } from '@/lib/painel-loja';
import LojaDesign, { CSS_PSEUDO } from '@/components/design/LojaDesign';
import TelaDoDesign from '@/components/app/TelaDoDesign';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const m = await molduraDaLoja();
  if (!m) redirect('/');

  return (
    <TelaDoDesign
      Design={LojaDesign}
      cssPseudo={CSS_PSEUDO}
      ativo={4}
      painel={m.painel}
    />
  );
}
