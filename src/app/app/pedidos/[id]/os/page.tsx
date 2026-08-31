import { notFound, redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { dadosDaOS } from '@/lib/pedidos';
import OrdemDeServico from '@/components/app/OrdemDeServico';
import ShellLojista from '@/components/app/ShellLojista';
import { MODULO } from '@/lib/rotas-lojista';
import '../../../app.css';

export const dynamic = 'force-dynamic';

/**
 * Ordem de Servico imprimível.
 *
 * Tudo num unico documento: pedido, cliente, filial, projetos (com campos
 * tecnicos), producao, expedicao. Botoes Imprimir e Gerar PDF usam o
 * `window.print()` do navegador; o CSS de impressão esconde os botoes e
 * ajusta o layout para o formato da etiqueta de expedicao que ja existe
 * no projeto (ver `design/extraido/Expedicao.dc.html` como referencia).
 *
 * O QR Code codifica a URL canonica do pedido (admin e cliente abrem o
 * mesmo QR). O codigo de barras usa Code 128 com o codigo PT-XXXXX
 * (formato do campo `pedidos.codigo` gerado pela 0014).
 */
export default async function PaginaOS({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const loja = await lojaAtual();
  if (!loja) redirect('/');
  const { id } = await params;

  const dados = await dadosDaOS(loja.id, id);
  if (!dados) notFound();

  return (
    <ShellLojista ativo={MODULO['Pedidos']}>
      <OrdemDeServico dados={dados} lojaNome={loja.nome} />
    </ShellLojista>
  );
}
