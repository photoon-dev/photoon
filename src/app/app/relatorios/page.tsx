import { redirect } from 'next/navigation';
import { molduraDaLoja } from '@/lib/painel-loja';
import RelatoriosDesign, { CSS_PSEUDO } from '@/components/design/RelatoriosDesign';
import TelaDoDesign from '@/components/app/TelaDoDesign';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const m = await molduraDaLoja();
  if (!m) redirect('/');

  return (
    <TelaDoDesign
      Design={RelatoriosDesign}
      cssPseudo={CSS_PSEUDO}
      ativo={14}
      painel={m.painel}
    />
  );
}
