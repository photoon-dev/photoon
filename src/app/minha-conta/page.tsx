import { notFound } from 'next/navigation';
import { currentTenantSlug } from '@/lib/tenant';
import { getLojista, garantirCliente } from '@/lib/data';
import { perfilDoCliente, resumoDoCliente } from '@/lib/cliente';
import PainelMinhaConta from '@/components/cliente/PainelMinhaConta';
import MolduraCliente from '@/components/cliente/MolduraCliente';
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
  const resumo = await resumoDoCliente(perfil.id);

  return (
    <MolduraCliente ativo="conta" loja={lojista.nome} avatar={perfil.avatar_url} nome={perfil.nome ?? perfil.email}>
      <PainelMinhaConta perfil={perfil} resumo={resumo} />
    </MolduraCliente>
  );
}
