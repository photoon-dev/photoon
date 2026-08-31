import { redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { filaDeProducao, pedidosForaDaFila, resumoRenderizacao } from '@/lib/pedidos';
import ProducaoDoDesign from '@/components/app/ProducaoDoDesign';
import ResumoRenderizacao from '@/components/app/ResumoRenderizacao';
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

  // O resumo da renderização entra como "cabeçalho" da Produção — sem
  // duplicar a fila, só os contadores. Quem quiser ver a fila abre o
  // botão "Abrir Central de Renderização".
  const [fila, pendentes, renderResumo] = await Promise.all([
    filaDeProducao(loja.id),
    pedidosForaDaFila(loja.id),
    resumoRenderizacao(loja.id),
  ]);

  return (
    <ShellLojista ativo={MODULO['Produção']}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <ResumoRenderizacao r={renderResumo} />
        <ProducaoDoDesign fila={fila} pendentes={pendentes} ver={q.ver ?? ''} />
      </div>
    </ShellLojista>
  );
}
