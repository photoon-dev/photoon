import { notFound, redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { getProjeto } from '@/lib/projetos';
import { MODULO } from '@/lib/rotas-lojista';
import ShellLojista from '@/components/app/ShellLojista';
import ProjetoDetalhe from '@/components/app/ProjetoDetalhe';
import '../../app.css';

export const dynamic = 'force-dynamic';

/** Detalhe administrativo do projeto — /projetos/:id */
export default async function Pagina({ params }: { params: Promise<{ id: string }> }) {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const { id } = await params;
  const dados = await getProjeto(loja.id, id);
  // A RLS já limita ao projeto da própria loja; ausente aqui significa 404.
  if (!dados) notFound();

  return (
    <ShellLojista ativo={MODULO['Projetos']}>
      <ProjetoDetalhe dados={dados} />
    </ShellLojista>
  );
}
