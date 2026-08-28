import { redirect } from 'next/navigation';
import { lojaAtual, getLojistaPorId } from '@/lib/lojista';
import { ROOT_DOMAIN } from '@/lib/tenant';
import ShellLojista from '@/components/app/ShellLojista';
import PainelConfiguracoes, { type DadosLoja } from '@/components/app/PainelConfiguracoes';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function ConfiguracoesPage() {
  const atual = await lojaAtual();
  if (!atual) redirect('/');

  const loja = await getLojistaPorId(atual.id);
  if (!loja) redirect('/');

  return (
    <ShellLojista ativo={19}>
      <PainelConfiguracoes loja={loja as unknown as DadosLoja} dominio={ROOT_DOMAIN} />
    </ShellLojista>
  );
}
