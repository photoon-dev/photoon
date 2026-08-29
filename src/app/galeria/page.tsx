import { notFound } from 'next/navigation';
import { currentTenantSlug } from '@/lib/tenant';
import {
  getLojista,
  garantirCliente,
  listarGalerias,
  listarFotosGaleria,
  listarRostosGaleria,
  listarPessoasGaleria,
} from '@/lib/data';
import { perfilDoCliente } from '@/lib/cliente';
import PainelGaleria from '@/components/cliente/PainelGaleria';
import MolduraCliente from '@/components/cliente/MolduraCliente';
import '../meus-projetos/cliente.css';

export const dynamic = 'force-dynamic';

export default async function GaleriaPage() {
  const slug = await currentTenantSlug();
  if (!slug) notFound();
  const lojista = await getLojista(slug);
  if (!lojista) notFound();
  const cliente = await garantirCliente(lojista.id);
  if (!cliente) notFound();

  const [perfil, galerias] = await Promise.all([
    perfilDoCliente(lojista.id),
    listarGalerias(cliente.id),
  ]);

  // Uma galeria por evento; a mais recente é a que o cliente quer ver.
  const galeria = galerias[0] ?? null;
  const [fotos, rostos, pessoas] = galeria
    ? await Promise.all([
        listarFotosGaleria(galeria.id),
        listarRostosGaleria(galeria.id),
        listarPessoasGaleria(galeria.id),
      ])
    : [[], [], []];

  return (
    <MolduraCliente
      ativo="galeria"
      loja={lojista.nome}
      avatar={perfil?.avatar_url}
      nome={perfil?.nome ?? perfil?.email ?? 'Você'}
    >
      <PainelGaleria
        fotos={fotos}
        rostos={rostos}
        pessoas={pessoas}
        galeriaNome={galeria?.nome ?? 'Sem galeria'}
      />
    </MolduraCliente>
  );
}
