import { notFound } from 'next/navigation';
import { currentTenantSlug, ROOT_DOMAIN } from '@/lib/tenant';
import { getLojista, garantirCliente, listarNotificacoes } from '@/lib/data';
import { contaDoCliente, perfilDoCliente } from '@/lib/cliente';
import MinhaContaDoDesign from '@/components/cliente/MinhaContaDoDesign';
import '../meus-projetos/cliente.css';

export const dynamic = 'force-dynamic';

export default async function MinhaContaPage() {
  const slug = await currentTenantSlug();
  if (!slug) notFound();
  const lojista = await getLojista(slug);
  if (!lojista) notFound();

  const cliente = await garantirCliente(lojista.id);
  if (!cliente) notFound();

  const perfil = await perfilDoCliente(lojista.id);
  if (!perfil) notFound();

  const [conta, notificacoes] = await Promise.all([
    contaDoCliente(perfil.id),
    listarNotificacoes(perfil.id),
  ]);

  return (
    <MinhaContaDoDesign
      perfil={perfil}
      conta={conta}
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
