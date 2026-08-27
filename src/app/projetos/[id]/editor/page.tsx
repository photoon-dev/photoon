import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProjeto } from '@/lib/data';
import { currentTenantSlug } from '@/lib/tenant';

export const dynamic = 'force-dynamic';

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const slug = await currentTenantSlug();
  if (!slug) notFound();

  const projeto = await getProjeto(id);
  if (!projeto) notFound();

  return (
    <>
      <header className="flex shrink-0 items-center justify-between border-b border-border bg-surface px-4 py-2.5">
        <div className="flex items-center gap-3">
          <Link
            href={`/projetos/${projeto.id}`}
            className="rounded-lg border border-border px-3 py-1.5 text-sm"
          >
            ← Voltar
          </Link>
          <span className="text-sm font-medium">{projeto.titulo}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted">Salvo automaticamente</span>
          <button className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-brand-fg">
            Concluir
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-56 shrink-0 overflow-y-auto border-r border-border bg-surface p-3 md:block">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">Páginas</p>
          {/* Miniaturas das paginas - ligar ao editor real (Especificacao_Editor_Usuario_Photoon.md) */}
        </aside>

        <main className="min-w-0 flex-1 overflow-auto bg-bg p-6">
          <div className="mx-auto aspect-[3/2] w-full max-w-3xl rounded-lg border border-border bg-surface" />
        </main>

        <aside className="hidden w-64 shrink-0 overflow-y-auto border-l border-border bg-surface p-3 lg:block">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
            Propriedades
          </p>
        </aside>
      </div>
    </>
  );
}
