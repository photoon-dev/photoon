import { redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { filaDeProducao, pedidosForaDaFila } from '@/lib/pedidos';
import ProducaoDoDesign from '@/components/app/ProducaoDoDesign';
import ShellLojista from '@/components/app/ShellLojista';
import { MODULO } from '@/lib/rotas-lojista';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  // O recorte vive na URL, como em Pedidos: o link de "atrasados" é guardável
  // e o botão de voltar do navegador funciona.
  const q = await searchParams;

  const [fila, pendentes] = await Promise.all([
    filaDeProducao(loja.id),
    pedidosForaDaFila(loja.id),
  ]);

  return (
    <ShellLojista ativo={MODULO['Produção']}>
      <ProducaoDoDesign fila={fila} pendentes={pendentes} ver={q.ver ?? ''} />
    </ShellLojista>
  );
}
