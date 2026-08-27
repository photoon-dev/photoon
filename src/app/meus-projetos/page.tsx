import { notFound } from 'next/navigation';
import { currentTenantSlug } from '@/lib/tenant';
import {
  getLojista,
  garantirCliente,
  listarProjetos,
  getGaleria,
  listarFotosGaleria,
  listarNotificacoes,
  contarNaoLidas,
} from '@/lib/data';
import AppHeader from '@/components/AppHeader';
import RailLateral from '@/components/RailLateral';
import HeroProjetos from '@/components/HeroProjetos';
import { CardGaleria, CardProximosPassos } from '@/components/CardGaleria';
import CardAssistencia from '@/components/CardAssistencia';
import ListaProjetos from '@/components/ListaProjetos';
import FaixaOutroAlbum from '@/components/FaixaOutroAlbum';
import RodapeCliente from '@/components/RodapeCliente';

export const dynamic = 'force-dynamic';

export default async function MeusProjetosPage() {
  const slug = await currentTenantSlug();
  if (!slug) notFound();

  const lojista = await getLojista(slug);
  if (!lojista) notFound();

  // Primeiro acesso neste lojista: cria o vínculo cliente <-> lojista.
  const cliente = await garantirCliente(lojista.id);
  if (!cliente) notFound();

  const [projetos, galeria, naoLidas, notificacoes] = await Promise.all([
    listarProjetos(cliente.id),
    getGaleria(cliente.id),
    contarNaoLidas(cliente.id),
    listarNotificacoes(cliente.id),
  ]);

  const fotos = galeria ? await listarFotosGaleria(galeria.id) : [];
  const selecionadas = projetos.reduce((t, p) => t + p.fotos_usadas, 0);

  // "Próximos passos, na ordem recomendada": derivado do estado real dos álbuns.
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

  // Álbum sugerido para a assistência: o que tem mais quadros por preencher.
  const paraAssistencia =
    projetos.find((p) => p.avisos.length > 0) ??
    projetos.find((p) => p.status !== 'finalizado') ??
    null;

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AppHeader
        lojista={lojista}
        cliente={cliente}
        naoLidas={naoLidas}
        notificacoes={notificacoes}
      />

      <div className="mx-auto flex w-full max-w-[1320px] flex-1 gap-5 px-5 py-6">
        <RailLateral />

        <main className="min-w-0 flex-1">
          <div className="flex animate-riseIn flex-col gap-[22px]">
            <HeroProjetos
              cliente={cliente}
              galeria={galeria}
              projetos={projetos}
              nomeLojista={lojista.nome}
            />

            <div className="grid items-stretch gap-5 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
              {galeria && (
                <CardGaleria
                  galeria={galeria}
                  fotosSelecionadas={selecionadas}
                  amostras={fotos}
                />
              )}
              <CardProximosPassos passos={passos} />
              <CardAssistencia projetoId={paraAssistencia?.id ?? null} />
            </div>

            <ListaProjetos
              projetos={projetos}
              totalFotosGaleria={galeria?.total_fotos ?? 0}
              capas={fotos.map((f) => f.url)}
            />

            {galeria && (
              <FaixaOutroAlbum
                galeriaId={galeria.id}
                restantes={galeria.max_albuns - projetos.length}
                maximo={galeria.max_albuns}
              />
            )}
          </div>
        </main>
      </div>

      <RodapeCliente lojista={lojista} />
    </div>
  );
}
