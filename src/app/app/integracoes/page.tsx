import { redirect } from 'next/navigation';
import { molduraDaLoja } from '@/lib/painel-loja';
import IntegracoesDesign, { CSS_PSEUDO } from '@/components/design/IntegracoesDesign';
import TelaDoDesign from '@/components/app/TelaDoDesign';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const m = await molduraDaLoja();
  if (!m) redirect('/');

  return (
    <TelaDoDesign
      Design={IntegracoesDesign}
      cssPseudo={CSS_PSEUDO}
      ativo={16}
      painel={m.painel}
    />
  );
}
