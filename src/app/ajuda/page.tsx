import { notFound } from 'next/navigation';
import { currentTenantSlug, ROOT_DOMAIN } from '@/lib/tenant';
import { getLojista, garantirCliente, listarGalerias, listarNotificacoes } from '@/lib/data';
import { perfilDoCliente } from '@/lib/cliente';
import AjudaDoDesign from '@/components/cliente/AjudaDoDesign';
import '../meus-projetos/cliente.css';

export const dynamic = 'force-dynamic';

export default async function AjudaPage() {
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

  return (
    <AjudaDoDesign
      dono={{
        nome: perfil?.nome ?? perfil?.email ?? 'Você',
        email: perfil?.email ?? '',
        sub: galerias[0]?.nome ?? lojista.nome,
      }}
      loja={{
        nome: lojista.nome,
        endereco: `${lojista.slug}.${ROOT_DOMAIN}`,
        email: lojista.email_suporte,
        telefone: lojista.telefone_suporte,
        politica: lojista.url_politica,
      }}
      notificacoes={notificacoes}
    />
  );
}
