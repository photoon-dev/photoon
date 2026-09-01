import { redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { listarModelos, listarProdutos } from '@/lib/comercial';
import { MODULO } from '@/lib/rotas-lojista';
import ShellLojista from '@/components/app/ShellLojista';
import PainelPrecos from '@/components/app/PainelPrecos';
import '../app.css';

export const dynamic = 'force-dynamic';

/**
 * Preços — /precos
 *
 * Lê os mesmos produtos e modelos do catálogo: preço é atributo do produto, e
 * duas telas com listas diferentes do mesmo produto é como o valor cobrado
 * começa a divergir do valor exibido.
 */
export default async function Pagina() {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const [produtos, modelos] = await Promise.all([
    listarProdutos(loja.id),
    listarModelos(loja.id),
  ]);

  return (
    <ShellLojista ativo={MODULO['Preços']}>
      <PainelPrecos produtos={produtos} modelos={modelos} />
    </ShellLojista>
  );
}
