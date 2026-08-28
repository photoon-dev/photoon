import { redirect } from 'next/navigation';
import { lojaAtual, listarClientesDaLoja, listarTemplates } from '@/lib/lojista';
import { ROOT_DOMAIN } from '@/lib/tenant';
import ShellLojista from '@/components/app/ShellLojista';
import PainelClientes from '@/components/app/PainelClientes';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function ClientesPage() {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const [clientes, templates] = await Promise.all([
    listarClientesDaLoja(loja.id),
    listarTemplates(loja.id),
  ]);

  return (
    <ShellLojista ativo={8}>
      <PainelClientes
        clientes={clientes}
        templates={templates}
        slugLoja={loja.slug}
        dominio={ROOT_DOMAIN}
      />
    </ShellLojista>
  );
}
