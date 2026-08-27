import { notFound } from 'next/navigation';
import { currentTenantSlug } from '@/lib/tenant';
import { getLojista, getProjeto, listarFotosGaleria } from '@/lib/data';
import EditorShell from '@/components/editor/EditorShell';

export const dynamic = 'force-dynamic';

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const slug = await currentTenantSlug();
  if (!slug) notFound();
  const lojista = await getLojista(slug);
  if (!lojista) notFound();

  // A RLS ja limita ao projeto do proprio cliente; ausente => 404.
  const projeto = await getProjeto(id);
  if (!projeto) notFound();

  const fotos = projeto.galeria_id ? await listarFotosGaleria(projeto.galeria_id) : [];

  return <EditorShell projeto={projeto} fotos={fotos} />;
}
