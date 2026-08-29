import { notFound } from 'next/navigation';
import { currentTenantSlug } from '@/lib/tenant';
import { getLojista, garantirCliente } from '@/lib/data';
import { perfilDoCliente } from '@/lib/cliente';
import PainelAjuda from '@/components/cliente/PainelAjuda';
import MolduraCliente from '@/components/cliente/MolduraCliente';
import '../meus-projetos/cliente.css';

export const dynamic = 'force-dynamic';

export default async function AjudaPage() {
  const slug = await currentTenantSlug();
  if (!slug) notFound();
  const lojista = await getLojista(slug);
  if (!lojista) notFound();
  const cliente = await garantirCliente(lojista.id);
  if (!cliente) notFound();
  const perfil = await perfilDoCliente(lojista.id);

  return (
    <MolduraCliente
      ativo="ajuda"
      loja={lojista.nome}
      avatar={perfil?.avatar_url}
      nome={perfil?.nome ?? perfil?.email ?? 'Você'}
    >
      <PainelAjuda
        loja={lojista.nome}
        email={lojista.email_suporte}
        telefone={lojista.telefone_suporte}
      />
    </MolduraCliente>
  );
}
