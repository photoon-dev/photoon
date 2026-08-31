import { redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { listarJobs, listarWorkers, type FiltrosRender, type PainelRender } from '@/lib/render';
import { MODULO } from '@/lib/rotas-lojista';
import ShellLojista from '@/components/app/ShellLojista';
import RenderizacaoDaLoja from '@/components/app/RenderizacaoDaLoja';
import '../app.css';

export const dynamic = 'force-dynamic';

/** Central de Renderização — /renderizacao */
export default async function Pagina({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const q = await searchParams;
  const filtros: FiltrosRender = {
    busca: q.busca ?? '',
    estado: q.estado ?? '',
    projeto: q.projeto ?? '',
    pedido: q.pedido ?? '',
    worker: q.worker ?? '',
    de: q.de ?? '',
    ate: q.ate ?? '',
    ordem: q.ordem ?? '',
    pagina: Number(q.pagina ?? 0) || 0,
  };

  let dados: PainelRender | null = null;
  let workers: { valor: string; rotulo: string }[] = [];
  let erro: string | null = null;
  try {
    [dados, workers] = await Promise.all([listarJobs(loja.id, filtros), listarWorkers()]);
  } catch (e) {
    erro = e instanceof Error ? e.message : 'Falha ao consultar a fila.';
  }

  return (
    <ShellLojista ativo={MODULO['Renderização']}>
      <RenderizacaoDaLoja
        jobs={dados?.jobs ?? []}
        total={dados?.total ?? 0}
        cards={dados?.cards ?? { naFila: 0, processando: 0, prontos: 0, comErro: 0, tempoMedio: null, ultimas24h: 0 }}
        servico={dados?.servico ?? { online: false, ativos: 0, total: 0, ultimaFalha: null, ultimoConcluido: null }}
        temAlgum={dados?.temAlgum ?? false}
        workers={workers}
        pagina={filtros.pagina ?? 0}
        erro={erro}
      />
    </ShellLojista>
  );
}
