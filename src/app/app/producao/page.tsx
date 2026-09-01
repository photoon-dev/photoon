import { redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { kanbanProducao } from '@/lib/pedidos';
import ResumoRenderizacao from '@/components/app/ResumoRenderizacao';
import KanbanProducao from '@/components/app/KanbanProducao';
import ShellLojista from '@/components/app/ShellLojista';
import CabecalhoPagina from '@/components/ui/CabecalhoPagina';
import { MODULO } from '@/lib/rotas-lojista';
import { resumoRenderizacao } from '@/lib/pedidos';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  // Kanban com 8 colunas + resumo de renderizacao (contadores).
  const [kanban, render] = await Promise.all([
    kanbanProducao(loja.id),
    resumoRenderizacao(loja.id),
  ]);

  return (
    <ShellLojista ativo={MODULO['Produção']}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <CabecalhoPagina
          grupo="Operação"
          titulo="Produção"
          descricao="Acompanhe cada pedido pelas oito etapas da fábrica, do pré-flight à embalagem."
        />
        <ResumoRenderizacao r={render} />
        <KanbanProducao kanban={kanban} />
      </div>
    </ShellLojista>
  );
}
