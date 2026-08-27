import { notFound } from 'next/navigation';
import { currentTenantSlug } from '@/lib/tenant';
import { getLojista } from '@/lib/data';
import FormEntrar from '@/components/FormEntrar';

export const dynamic = 'force-dynamic';

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const slug = await currentTenantSlug();
  if (!slug) notFound();

  const lojista = await getLojista(slug);
  if (!lojista) notFound();

  const { next } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <header className="mb-8 text-center">
          {lojista.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={lojista.logo_url}
              alt={lojista.nome}
              className="mx-auto mb-4 h-12 w-auto object-contain"
            />
          ) : (
            <div className="mb-4 text-2xl font-semibold">{lojista.nome}</div>
          )}
          <h1 className="text-lg font-medium">Entrar</h1>
          <p className="mt-1 text-sm text-muted">
            Acesse para criar e acompanhar seus álbuns.
          </p>
        </header>

        <FormEntrar next={next ?? '/meus-projetos'} />

        <p className="mt-8 text-center text-xs text-muted">
          Powered by <span className="font-medium">Photoon</span>
        </p>
      </div>
    </main>
  );
}
