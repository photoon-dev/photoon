import { redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { cifragemDisponivel, gatewaysDaLoja } from '@/lib/financeiro';
import { MODULO } from '@/lib/rotas-lojista';
import ShellLojista from '@/components/app/ShellLojista';
import PainelIntegracoes from '@/components/app/PainelIntegracoes';
import '../app.css';

export const dynamic = 'force-dynamic';

/**
 * Integrações — /integracoes
 *
 * Gateways de verdade, com a credencial mascarada no servidor. `cifragemOk`
 * diz à tela se dá para guardar segredo: sem `CHAVE_CIFRAGEM` ela recusa o
 * formulário em vez de gravar credencial em texto puro.
 */
export default async function Pagina() {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const gateways = await gatewaysDaLoja(loja.id);

  return (
    <ShellLojista ativo={MODULO['Integrações']}>
      <PainelIntegracoes gateways={gateways} cifragemOk={cifragemDisponivel()} />
    </ShellLojista>
  );
}
