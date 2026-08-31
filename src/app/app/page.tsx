import { redirect } from 'next/navigation';
import { molduraDaLoja } from '@/lib/painel-loja';
import { MODULO } from '@/lib/rotas-lojista';
import ShellLojista from '@/components/app/ShellLojista';
import { minhasLojas, souSuperAdmin } from '@/lib/data';
import DashboardLojista from '@/components/app/DashboardLojista';
import './app.css';

export const dynamic = 'force-dynamic';

/** Painel do lojista — app.photoon.com.br */
export default async function PainelLojistaPage() {
  // O middleware já barrou quem não tem sessão; aqui só confirmamos o papel.
  const [lojas, superAdmin] = await Promise.all([minhasLojas(), souSuperAdmin()]);

  if (lojas.length === 0 && !superAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <h1 className="m-0 text-xl font-bold">Nenhuma loja vinculada</h1>
          <p className="m-0 mt-2 text-sm text-muted">
            Esta conta não administra nenhum lojista.
          </p>
          <form action="/auth/sair" method="post" className="mt-5">
            <button
              type="submit"
              className="rounded-xl border border-line px-4 py-2 text-sm font-semibold"
            >
              Sair
            </button>
          </form>
        </div>
      </main>
    );
  }

  const moldura = await molduraDaLoja();
  if (!moldura) redirect('/entrar');

  return (
    <ShellLojista ativo={MODULO['Dashboard']}>
      <DashboardLojista painel={moldura.painel} />
    </ShellLojista>
  );
}
