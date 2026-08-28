import { notFound } from 'next/navigation';
import { currentTenantSlug } from '@/lib/tenant';
import {
  getLojista,
  getPrecoDoModelo,
  getProjeto,
  listarFotosGaleria,
  listarPessoasGaleria,
  listarRostosGaleria,
} from '@/lib/data';
import type { Lamina } from '@/lib/album';
import EditorCliente from '@/components/editor/EditorCliente';

export const dynamic = 'force-dynamic';

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const slug = await currentTenantSlug();
  if (!slug) notFound();
  const lojista = await getLojista(slug);
  if (!lojista) notFound();

  // A RLS já limita ao projeto do próprio cliente; ausente => 404.
  const projeto = await getProjeto(id);
  if (!projeto) notFound();

  const [fotos, modelo, rostos, pessoas] = await Promise.all([
    projeto.galeria_id ? listarFotosGaleria(projeto.galeria_id) : Promise.resolve([]),
    projeto.template_id ? getPrecoDoModelo(projeto.template_id) : Promise.resolve(null),
    projeto.galeria_id ? listarRostosGaleria(projeto.galeria_id) : Promise.resolve([]),
    projeto.galeria_id ? listarPessoasGaleria(projeto.galeria_id) : Promise.resolve([]),
  ]);

  return (
    <EditorCliente
      projetoId={projeto.id}
      titulo={projeto.titulo}
      fotos={fotos}
      rostos={rostos}
      pessoas={pessoas}
      modelo={modelo}
      paginas={(projeto.paginas ?? []) as Lamina[]}
    />
  );
}
