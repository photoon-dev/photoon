import { redirect } from 'next/navigation';
import { molduraDaLoja } from '@/lib/painel-loja';
import { filaDeProducao, pedidosForaDaFila } from '@/lib/pedidos';
import ProducaoDoDesign from '@/components/app/ProducaoDoDesign';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const m = await molduraDaLoja();
  if (!m) redirect('/');

  // O recorte vive na URL, como em Pedidos: o link de "atrasados" é guardável
  // e o botão de voltar do navegador funciona.
  const q = await searchParams;

  const [fila, pendentes] = await Promise.all([
    filaDeProducao(m.loja.id),
    pedidosForaDaFila(m.loja.id),
  ]);

  return (
    <ProducaoDoDesign painel={m.painel} fila={fila} pendentes={pendentes} ver={q.ver ?? ''} />
  );
}
