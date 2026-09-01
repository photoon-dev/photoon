import { redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { listarModelos, listarProdutos } from '@/lib/comercial';
import { MODULO } from '@/lib/rotas-lojista';
import ShellLojista from '@/components/app/ShellLojista';
import PainelCatalogo from '@/components/app/PainelCatalogo';
import '../app.css';

export const dynamic = 'force-dynamic';

/**
 * Catálogo — /catalogo
 *
 * Trocado o `CatalogoDesign` transliterado pelos produtos e modelos reais da
 * loja. Sem produto cadastrado a tela explica, em vez de mostrar os quatro
 * cartões de exemplo do protótipo.
 */
export default async function Pagina() {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const [produtos, modelos] = await Promise.all([
    listarProdutos(loja.id),
    listarModelos(loja.id),
  ]);

  return (
    <ShellLojista ativo={MODULO['Catálogo']}>
      <PainelCatalogo produtos={produtos} modelos={modelos} />
    </ShellLojista>
  );
}
