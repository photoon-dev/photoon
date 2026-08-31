import { notFound, redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { getJob } from '@/lib/render';
import { MODULO } from '@/lib/rotas-lojista';
import ShellLojista from '@/components/app/ShellLojista';
import JobDetalhe from '@/components/app/JobDetalhe';
import '../../app.css';

export const dynamic = 'force-dynamic';

/** Detalhe do job de renderização — /renderizacao/:id */
export default async function Pagina({ params }: { params: Promise<{ id: string }> }) {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const { id } = await params;
  const dados = await getJob(loja.id, id);
  if (!dados) notFound();

  return (
    <ShellLojista ativo={MODULO['Renderização']}>
      <JobDetalhe dados={dados} />
    </ShellLojista>
  );
}
