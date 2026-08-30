import { notFound } from 'next/navigation';
import { currentTenantSlug, ROOT_DOMAIN } from '@/lib/tenant';
import {
  getLojista,
  garantirCliente,
  listarGalerias,
  listarFotosGaleria,
  listarRostosGaleria,
  listarPessoasGaleria,
  listarNotificacoes,
} from '@/lib/data';
import { perfilDoCliente } from '@/lib/cliente';
import GaleriaDoDesign from '@/components/cliente/GaleriaDoDesign';
import '../meus-projetos/cliente.css';

export const dynamic = 'force-dynamic';

export default async function GaleriaPage() {
  const slug = await currentTenantSlug();
  if (!slug) notFound();
  const lojista = await getLojista(slug);
  if (!lojista) notFound();
  const cliente = await garantirCliente(lojista.id);
  if (!cliente) notFound();

  const [perfil, galerias, notificacoes] = await Promise.all([
    perfilDoCliente(lojista.id),
    listarGalerias(cliente.id),
    listarNotificacoes(cliente.id),
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
    <GaleriaDoDesign
      dono={{
        nome: perfil?.nome ?? perfil?.email ?? 'Você',
        email: perfil?.email ?? '',
        sub: galeria?.nome ?? lojista.nome,
      }}
      loja={{
        nome: lojista.nome,
        endereco: `${lojista.slug}.${ROOT_DOMAIN}`,
        email: lojista.email_suporte,
        telefone: lojista.telefone_suporte,
        politica: lojista.url_politica,
      }}
      notificacoes={notificacoes}
      fotos={fotos}
      rostos={rostos}
      pessoas={pessoas}
      galeriaNome={galeria?.nome ?? 'Sem galeria'}
    />
  );
}
