import { notFound } from 'next/navigation';
import { currentTenantSlug } from '@/lib/tenant';
import {
  getLojista,
  garantirCliente,
  listarProjetos,
  getGaleria,
  contarNaoLidas,
} from '@/lib/data';
import AppHeader from '@/components/AppHeader';
import HeroProjetos from '@/components/HeroProjetos';
import { CardGaleria, CardProximosPassos } from '@/components/CardGaleria';
import ListaProjetos from '@/components/ListaProjetos';
import RodapeCliente from '@/components/RodapeCliente';

export const dynamic = 'force-dynamic';

export default async function MeusProjetosPage() {
  const slug = await currentTenantSlug();
  if (!slug) notFound();

  const lojista = await getLojista(slug);
  if (!lojista) notFound();

  // Primeiro acesso neste lojista: cria o vinculo cliente <-> lojista.
  const cliente = await garantirCliente(lojista.id);
  if (!cliente) notFound();

  const [projetos, galeria, naoLidas] = await Promise.all([
    listarProjetos(cliente.id),
    getGaleria(cliente.id),
    contarNaoLidas(cliente.id),
  ]);

  const selecionadas = projetos.reduce((t, p) => t + p.fotos_usadas, 0);

  // "Proximos passos, na ordem recomendada": derivado do estado real dos albuns.
  const passos: { titulo: string; sub: string }[] = [];
  const comAviso = projetos.filter((p) => p.avisos.length > 0);
  if (comAviso[0]) {
    passos.push({ titulo: comAviso[0].avisos[0].titulo, sub: comAviso[0].titulo });
  }
  if (comAviso.length > 1) {
    const total = comAviso.reduce((t, p) => t + p.avisos.length, 0);
    passos.push({
      titulo: `Revisar ${total} avisos de qualidade`,
      sub: `${comAviso.length} projetos`,
    });
  }
  const prontos = projetos.filter((p) => p.status === 'pronto');
  if (prontos.length > 0) {
    passos.push({
      titulo: `Finalizar ${prontos.length} ${prontos.length === 1 ? 'projeto' : 'projetos'}`,
      sub: 'envio para produção',
    });
  }

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AppHeader lojista={lojista} cliente={cliente} naoLidas={naoLidas} />

      <main className="px-7 py-6">
        <div className="mx-auto flex max-w-[1200px] animate-riseIn flex-col gap-[22px]">
          <HeroProjetos
            cliente={cliente}
            galeria={galeria}
            projetos={projetos}
            nomeLojista={lojista.nome}
          />

          <div className="grid items-stretch gap-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
            {galeria && <CardGaleria galeria={galeria} fotosSelecionadas={selecionadas} />}
            <CardProximosPassos passos={passos} />
          </div>

          <ListaProjetos projetos={projetos} totalFotosGaleria={galeria?.total_fotos ?? 0} />
        </div>
      </main>

      <RodapeCliente lojista={lojista} />
    </div>
  );
}
