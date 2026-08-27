import { notFound } from 'next/navigation';
import { currentTenantSlug } from '@/lib/tenant';
import { getLojista, garantirCliente, listarProjetos } from '@/lib/data';
import Cabecalho from '@/components/Cabecalho';
import CardProjeto from '@/components/CardProjeto';
import BotaoNovoProjeto from '@/components/BotaoNovoProjeto';

export const dynamic = 'force-dynamic';

export default async function MeusProjetosPage() {
  const slug = await currentTenantSlug();
  if (!slug) notFound();

  const lojista = await getLojista(slug);
  if (!lojista) notFound();

  // Primeiro acesso neste lojista: cria o vinculo cliente <-> lojista.
  const clienteId = await garantirCliente(lojista.id);
  const projetos = clienteId ? await listarProjetos(clienteId) : [];

  return (
    <>
      <Cabecalho lojista={lojista} />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Meus projetos</h1>
            <p className="mt-1 text-sm text-muted">
              {projetos.length === 0
                ? 'Você ainda não tem projetos.'
                : `${projetos.length} ${projetos.length === 1 ? 'projeto' : 'projetos'}`}
            </p>
          </div>
          <BotaoNovoProjeto />
        </div>

        {projetos.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center">
            <p className="text-muted">Crie seu primeiro álbum para começar.</p>
            <div className="mt-4 flex justify-center">
              <BotaoNovoProjeto />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projetos.map((p) => (
              <CardProjeto key={p.id} projeto={p} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
