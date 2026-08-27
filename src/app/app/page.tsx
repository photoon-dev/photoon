import { minhasLojas, souSuperAdmin } from '@/lib/data';
import { createClient } from '@/lib/supabase/server';
import { tenantUrl } from '@/lib/tenant';
import MarcaPhotoon from '@/components/MarcaPhotoon';
import { IconSeta, IconSair } from '@/components/icons';

export const dynamic = 'force-dynamic';

/**
 * Painel do lojista — app.photoon.com.br
 *
 * Por ora só a porta de entrada: qual loja a conta administra e o atalho
 * para a área do cliente final. As telas do painel (Dashboard, Pedidos,
 * Produção, ...) entram uma por vez.
 */
export default async function PainelLojistaPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [lojas, superAdmin] = await Promise.all([minhasLojas(), souSuperAdmin()]);
  const nome = (user?.user_metadata?.nome as string) ?? user?.email?.split('@')[0] ?? '';

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <header className="flex min-h-[72px] items-center gap-5 border-b border-line bg-surface px-7 py-3">
        <span className="flex items-center gap-[11px]">
          <MarcaPhotoon size={36} id="painel" />
          <span>
            <span className="block text-[15px] font-extrabold tracking-[-.2px]">Photoon</span>
            <span className="block text-[11.5px] text-muted-2">painel do lojista</span>
          </span>
        </span>

        <div className="flex-1" />

        <span className="text-[13px] text-muted">{user?.email}</span>
        <form action="/auth/sair" method="post">
          <button
            type="submit"
            className="flex h-10 items-center gap-2 rounded-xl border border-line px-3.5 text-[13px] font-semibold text-ink-3 hover:bg-coral-surface hover:text-[#E11D48]"
          >
            <IconSair />
            Sair
          </button>
        </form>
      </header>

      <main className="px-7 py-8">
        <div className="mx-auto flex max-w-[900px] animate-riseIn flex-col gap-6">
          <div>
            <h1 className="m-0 text-2xl font-extrabold tracking-[-.8px]">Olá, {nome}.</h1>
            <p className="m-0 mt-1.5 text-[14.5px] text-muted">
              {superAdmin
                ? 'Sua conta é super admin da plataforma.'
                : lojas.length === 1
                  ? 'Você administra uma loja.'
                  : `Você administra ${lojas.length} lojas.`}
            </p>
          </div>

          {lojas.length === 0 ? (
            <div className="rounded-card border border-dashed border-line bg-surface px-6 py-12 text-center">
              <p className="m-0 text-[15px] font-bold">Nenhuma loja vinculada</p>
              <p className="m-0 mt-1.5 text-[13.5px] text-muted">
                Esta conta ainda não é membro de nenhum lojista.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
              {lojas.map((loja) => (
                <div
                  key={loja.lojista_id}
                  className="flex flex-col gap-4 rounded-card border border-line bg-surface p-6"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <h2 className="m-0 truncate text-[17px] font-bold">{loja.nome}</h2>
                      <span className="whitespace-nowrap rounded-full bg-blue-surface px-2.5 py-1 text-[11px] font-bold text-blue">
                        {loja.papel === 'admin' ? 'Administrador' : 'Operador'}
                      </span>
                    </div>
                    <p className="m-0 mt-1 text-[12.5px] text-muted">
                      {loja.slug}.photoon.com.br
                    </p>
                  </div>

                  <a
                    href={tenantUrl(loja.slug, '/entrar')}
                    className="flex h-11 items-center justify-center gap-2 rounded-field border border-line px-4 text-[13.5px] font-semibold text-ink hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue"
                  >
                    Ver a loja do cliente
                    <IconSeta size={16} />
                  </a>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-card border border-line bg-surface-2 px-6 py-5">
            <p className="m-0 text-[13.5px] font-bold">Em construção</p>
            <p className="m-0 mt-1.5 text-[12.5px] leading-[1.6] text-muted">
              As telas do painel — Dashboard, Pedidos, Produção, Expedição, Loja, Catálogo,
              Clientes, Financeiro — estão no projeto de design e entram uma por vez. Esta página
              é só a porta de entrada do painel.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
