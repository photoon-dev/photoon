import { notFound } from 'next/navigation';
import { currentTenantSlug } from '@/lib/tenant';
import {
  getLojista,
  garantirCliente,
  listarProjetos,
  getGaleria,
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

  const [projetos, galeria, notificacoes] = await Promise.all([
    listarProjetos(cliente.id),
    getGaleria(cliente.id),
    listarNotificacoes(cliente.id),
  ]);

  const fotos = galeria ? await listarFotosGaleria(galeria.id) : [];

  return (
    <MeusProjetosCliente
      projetos={projetos}
      notificacoes={notificacoes}
      totalFotos={galeria?.total_fotos ?? 0}
      capas={fotos.map((f) => f.url)}
    />
  );
}
