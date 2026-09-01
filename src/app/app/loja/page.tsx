import { notFound, redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { dadosVitrine } from '@/lib/comercial';
import { ROOT_DOMAIN } from '@/lib/tenant';
import { MODULO } from '@/lib/rotas-lojista';
import ShellLojista from '@/components/app/ShellLojista';
import PainelLoja from '@/components/app/PainelLoja';
import '../app.css';

export const dynamic = 'force-dynamic';

/**
 * Minha loja — /loja
 *
 * Mostrava o `LojaDesign` transliterado, com os números do protótipo. Agora lê
 * a vitrine de verdade: identidade da loja, o que está publicado, o que está
 * oculto e quantos clientes já entraram.
 */
export default async function Pagina() {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const dados = await dadosVitrine(loja.id);
  if (!dados) notFound();

  return (
    <ShellLojista ativo={MODULO['Loja']}>
      <PainelLoja dados={dados} dominio={ROOT_DOMAIN} />
    </ShellLojista>
  );
}
