import { notFound } from 'next/navigation';
import { currentTenantSlug } from '@/lib/tenant';
import {
  getLojista,
  garantirCliente,
  listarProjetos,
  listarGalerias,
  listarFotosGaleria,
  listarNotificacoes,
} from '@/lib/data';
import MeusProjetosCliente from '@/components/cliente/MeusProjetosCliente';
import './cliente.css';

export const dynamic = 'force-dynamic';

export default async function MeusProjetosPage() {
  const slug = await currentTenantSlug();
  if (!slug) notFound();

  const lojista = await getLojista(slug);
  if (!lojista) notFound();

  // Primeiro acesso neste lojista: cria o vínculo cliente <-> lojista.
  const cliente = await garantirCliente(lojista.id);
  if (!cliente) notFound();

  const [projetos, galerias, notificacoes] = await Promise.all([
    listarProjetos(cliente.id),
    listarGalerias(cliente.id),
    listarNotificacoes(cliente.id),
  ]);

  // Uma galeria por evento. A tela destaca o evento mais recente, e as capas
  // dos álbuns podem vir de qualquer um deles.
  const fotosPorEvento = await Promise.all(galerias.map((g) => listarFotosGaleria(g.id)));
  const fotos = fotosPorEvento.flat();
  const totalFotos = galerias.reduce((t, g) => t + g.total_fotos, 0);

  return (
    <MeusProjetosCliente
      projetos={projetos}
      notificacoes={notificacoes}
      totalFotos={totalFotos}
      eventos={galerias.length}
      capas={fotos.map((f) => f.url)}
    />
  );
}
