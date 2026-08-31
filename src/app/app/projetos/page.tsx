import { redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { listarProjetos, opcoesDeFiltro, type FiltrosProjetos } from '@/lib/projetos';
import type { PainelProjetos } from '@/lib/projetos';
import { MODULO } from '@/lib/rotas-lojista';
import ShellLojista from '@/components/app/ShellLojista';
import ProjetosDaLoja from '@/components/app/ProjetosDaLoja';
import '../app.css';

export const dynamic = 'force-dynamic';

/**
 * Central de Projetos — /projetos
 *
 * Os filtros vivem na URL: o link de "com erro, da filial Centro" é guardável
 * e o botão de voltar do navegador funciona. É o mesmo caminho de Pedidos.
 */
export default async function Pagina({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const q = await searchParams;
  const filtros: FiltrosProjetos = {
    busca: q.busca ?? '',
    status: q.status ?? '',
    cliente: q.cliente ?? '',
    produto: q.produto ?? '',
    filial: q.filial ?? '',
    criadoDe: q.criadoDe ?? '',
    criadoAte: q.criadoAte ?? '',
    editadoDe: q.editadoDe ?? '',
    pedido: q.pedido ?? '',
    capa: q.capa ?? '',
    render: q.render ?? '',
    arquivados: q.arquivados ?? '',
    ordem: q.ordem ?? '',
    pagina: Number(q.pagina ?? 0) || 0,
  };

  /*
   * Uma consulta que falha não pode virar lista vazia: o lojista concluiria
   * que não há projeto nenhum. A tabela tem estado de erro e é ele que aparece.
   * Enquanto a migração 0015 não estiver no banco, o erro é justamente esse —
   * e a mensagem diz qual é, em vez de um "algo deu errado".
   */
  let dados: PainelProjetos | null = null;
  let opcoes: Awaited<ReturnType<typeof opcoesDeFiltro>> = {
    clientes: [], produtos: [], filiais: [],
  };
  let erro: string | null = null;
  try {
    [dados, opcoes] = await Promise.all([
      listarProjetos(loja.id, filtros),
      opcoesDeFiltro(loja.id),
    ]);
  } catch (e) {
    const bruto = e instanceof Error ? e.message : String(e);
    // O banco responde "column ... does not exist" / "function ... does not
    // exist" quando a migração 0015 ainda não foi aplicada. Traduzir isso vale
    // mais que repassar a mensagem crua para quem não escreve SQL.
    erro = /does not exist|não existe/i.test(bruto)
      ? 'Esta tela precisa da migração 0015 no banco. Aplique-a e recarregue.'
      : bruto;
  }

  return (
    <ShellLojista ativo={MODULO['Projetos']}>
      <ProjetosDaLoja
        projetos={dados?.projetos ?? []}
        total={dados?.total ?? 0}
        cards={dados?.cards ?? {
          abertos: 0, aguardandoFinalizacao: 0, finalizadosHoje: 0,
          comProblema: 0, semPedido: 0, bytes: 0,
        }}
        temAlgum={dados?.temAlgum ?? false}
        opcoes={opcoes}
        pagina={filtros.pagina ?? 0}
        erro={erro}
      />
    </ShellLojista>
  );
}
