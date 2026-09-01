import { notFound, redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { dadosDoResumo } from '@/lib/projetos';
import { MODULO } from '@/lib/rotas-lojista';
import ShellLojista from '@/components/app/ShellLojista';
import ResumoDoProjeto from '@/components/app/ResumoDoProjeto';
import '../../../app.css';

export const dynamic = 'force-dynamic';

/**
 * Folha de resumo do projeto — `/projetos/:id/resumo`.
 *
 * O botão "Resumo" do detalhe já apontava para cá; a rota é que não existia.
 * Documento imprimível com identificação, produto, características técnicas,
 * capa e as miniaturas das lâminas.
 */
export default async function Pagina({ params }: { params: Promise<{ id: string }> }) {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const { id } = await params;
  const dados = await dadosDoResumo(loja.id, id);
  // A RLS já limita ao projeto da própria loja; ausente aqui significa 404.
  if (!dados) notFound();

  return (
    <ShellLojista ativo={MODULO['Projetos']}>
      <ResumoDoProjeto dados={dados} lojaNome={loja.nome} />
    </ShellLojista>
  );
}
