import Link from 'next/link';
import { notFound } from 'next/navigation';
import { currentTenantSlug } from '@/lib/tenant';
import { getLojista, getProjeto } from '@/lib/data';
import Cabecalho from '@/components/Cabecalho';

export const dynamic = 'force-dynamic';

const ROTULO = {
  rascunho: 'Rascunho',
  em_edicao: 'Em edição',
  enviado: 'Enviado',
  em_producao: 'Em produção',
  concluido: 'Concluído',
} as const;

export default async function DetalheProjetoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const slug = await currentTenantSlug();
  if (!slug) notFound();
  const lojista = await getLojista(slug);
  if (!lojista) notFound();

  // RLS ja limita ao projeto do proprio cliente; ausente => 404.
  const projeto = await getProjeto(id);
  if (!projeto) notFound();

  return (
    <>
      <Cabecalho lojista={lojista} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <nav className="mb-6 text-sm text-muted">
          <Link href="/meus-projetos" className="hover:text-fg">
            Meus projetos
          </Link>
          <span className="mx-2">/</span>
          <span className="text-fg">{projeto.titulo}</span>
        </nav>

        <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_260px]">
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="aspect-[4/3] w-full bg-bg">
              {projeto.capa_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={projeto.capa_url} alt="" className="h-full w-full object-cover" />
              )}
            </div>
          </div>

          <aside className="space-y-5">
            <div>
              <h1 className="text-xl font-semibold">{projeto.titulo}</h1>
              <p className="mt-1 text-sm text-muted">{ROTULO[projeto.status]}</p>
            </div>

            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Páginas</dt>
                <dd>{projeto.total_paginas}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Atualizado</dt>
                <dd>
                  {new Date(projeto.atualizado_em).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </dd>
              </div>
            </dl>

            {/* Editar e uma NAVEGACAO de verdade: /projetos/<id>/editor.
                O editor tem URL propria, historico proprio e e compartilhavel. */}
            <Link
              href={`/projetos/${projeto.id}/editor`}
              className="block rounded-xl bg-brand px-4 py-2.5 text-center text-sm font-medium text-brand-fg"
            >
              Editar álbum
            </Link>

            <Link
              href="/meus-projetos"
              className="block rounded-xl border border-border px-4 py-2.5 text-center text-sm"
            >
              Voltar
            </Link>
          </aside>
        </div>
      </main>
    </>
  );
}
