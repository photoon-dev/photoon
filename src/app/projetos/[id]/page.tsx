import Link from 'next/link';
import { notFound } from 'next/navigation';
import { currentTenantSlug } from '@/lib/tenant';
import {
  getLojista,
  garantirCliente,
  getProjeto,
  getGaleriaPorId,
  listarEventos,
  contarNaoLidas,
} from '@/lib/data';
import { STATUS } from '@/lib/status';
import AppHeader from '@/components/AppHeader';
import PainelPendencias from '@/components/PainelPendencias';
import RodapeCliente from '@/components/RodapeCliente';
import { IconSeta, IconOlho, IconGaleria, IconRelogio } from '@/components/icons';

export const dynamic = 'force-dynamic';

const dataHora = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

export default async function DetalheProjetoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const slug = await currentTenantSlug();
  if (!slug) notFound();
  const lojista = await getLojista(slug);
  if (!lojista) notFound();
  const cliente = await garantirCliente(lojista.id);
  if (!cliente) notFound();

  // A RLS ja limita ao projeto do proprio cliente; ausente => 404.
  const projeto = await getProjeto(id);
  if (!projeto) notFound();

  const [galeria, eventos, naoLidas] = await Promise.all([
    projeto.galeria_id ? getGaleriaPorId(projeto.galeria_id) : Promise.resolve(null),
    listarEventos(projeto.id),
    contarNaoLidas(cliente.id),
  ]);

  const s = STATUS[projeto.status];
  const laminas = Math.ceil(projeto.total_paginas / 2);

  const ficha: [string, string][] = [
    ['Produto', projeto.produto_nome ?? '—'],
    ['Tamanho', projeto.produto_tamanho ?? '—'],
    ['Páginas', `${projeto.total_paginas} (${laminas} lâminas)`],
    ['Fotos usadas', `${projeto.fotos_usadas} de ${galeria?.total_fotos ?? 0}`],
    ['Último salvamento', dataHora(projeto.atualizado_em)],
    [
      'Preço estimado',
      projeto.preco_estimado != null
        ? projeto.preco_estimado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        : '—',
    ],
  ];

  return (
    <div className="flex min-h-screen flex-col bg-page">
      <AppHeader lojista={lojista} cliente={cliente} naoLidas={naoLidas} />

      <main className="px-7 py-6">
        <div className="mx-auto flex max-w-[1200px] animate-riseIn flex-col gap-[22px]">
          <nav className="flex items-center gap-2 text-[13px]">
            <Link href="/meus-projetos" className="text-muted hover:text-blue">
              Meus projetos
            </Link>
            <span className="text-muted-2">/</span>
            <span className="truncate font-semibold text-ink">{projeto.titulo}</span>
          </nav>

          <div className="grid items-start gap-[22px] lg:grid-cols-[340px_minmax(0,1fr)]">
            {/* --- capa + ficha tecnica --- */}
            <aside className="flex flex-col gap-[22px]">
              <div className="overflow-hidden rounded-control border border-line bg-surface">
                <div
                  className="relative aspect-[4/3] w-full"
                  style={
                    projeto.capa_url
                      ? undefined
                      : { background: 'linear-gradient(140deg,#7C3AED,#2563EB)' }
                  }
                >
                  {projeto.capa_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={projeto.capa_url} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <span className="text-[12.5px] text-muted">Capa atual</span>
                  <span className="text-[12.5px] font-semibold text-ink-3">{laminas} lâminas</span>
                </div>
              </div>

              <div className="rounded-control border border-line bg-surface p-5">
                <div className="mb-4">
                  <div className="mb-2 flex items-baseline justify-between gap-3">
                    <span className="text-[12.5px] text-muted">Progresso da criação</span>
                    <span className="text-[13px] font-extrabold">{projeto.progresso}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#EEF1F7]">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#2563EB,#06B6D4)]"
                      style={{ width: `${projeto.progresso}%` }}
                    />
                  </div>
                </div>

                <dl className="m-0 flex flex-col gap-2.5">
                  {ficha.map(([rotulo, valor]) => (
                    <div key={rotulo} className="flex items-center justify-between gap-3">
                      <dt className="text-[12.5px] text-muted-2">{rotulo}</dt>
                      <dd className="m-0 text-right text-[12.5px] font-semibold text-ink-3">
                        {valor}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </aside>

            {/* --- conteudo principal --- */}
            <div className="flex min-w-0 flex-col gap-[22px]">
              <section className="rounded-control border border-line bg-surface px-6 py-[22px]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="mb-2 flex flex-wrap items-center gap-2.5">
                      <h1 className="m-0 text-[24px] font-extrabold tracking-[-.8px]">
                        {projeto.titulo}
                      </h1>
                      <span
                        className={`whitespace-nowrap rounded-full px-[11px] py-[5px] text-xs font-bold ${s.chip}`}
                      >
                        {s.rotulo}
                      </span>
                    </div>
                    <p className="m-0 text-[12.5px] text-muted">
                      Criado pela {lojista.nome}
                      {galeria ? ` · galeria ${galeria.nome}` : ''}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2.5">
                  {/* Editar abre a rota propria do editor - nao um modal. */}
                  <Link
                    href={`/editor/${projeto.id}`}
                    className="flex h-[46px] items-center gap-2 rounded-field bg-lente px-5 text-[14.5px] font-bold text-white shadow-cta hover:brightness-[1.06]"
                  >
                    <IconSeta size={17} />
                    Continuar editando
                  </Link>
                  <Link
                    href={`/editor/${projeto.id}?modo=previa`}
                    className="flex h-[46px] items-center gap-2 rounded-field border border-line bg-surface px-5 text-[14.5px] font-semibold text-ink hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue"
                  >
                    <IconOlho />
                    Visualizar álbum
                  </Link>
                </div>
              </section>

              <PainelPendencias avisos={projeto.avisos} projetoId={projeto.id} />

              <div className="grid gap-[22px] [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
                {galeria && (
                  <section className="rounded-control border border-line bg-surface px-6 py-[22px]">
                    <div className="mb-4 flex items-center gap-3">
                      <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl bg-[#F1EBFE] text-[#7C3AED]">
                        <IconGaleria />
                      </span>
                      <div className="min-w-0">
                        <p className="m-0 text-[14.5px] font-bold">Galeria vinculada</p>
                        <p className="m-0 mt-0.5 truncate text-[12.5px] text-muted">
                          {galeria.nome} · {galeria.total_fotos} fotos
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-[9px]">
                      {[
                        ['Usadas no álbum', projeto.fotos_usadas],
                        ['Não usadas', Math.max(galeria.total_fotos - projeto.fotos_usadas, 0)],
                      ].map(([r, v]) => (
                        <div key={r} className="flex items-center justify-between gap-2.5">
                          <span className="text-[12.5px] text-muted-2">{r}</span>
                          <span className="text-[12.5px] font-semibold text-ink-3">{v}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                <section className="rounded-control border border-line bg-surface px-6 py-[22px]">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl bg-cyan-surface text-[#0891B2]">
                      <IconRelogio />
                    </span>
                    <p className="m-0 text-[14.5px] font-bold">Histórico</p>
                  </div>

                  {eventos.length === 0 ? (
                    <p className="m-0 text-[13px] text-muted">Nenhuma alteração registrada ainda.</p>
                  ) : (
                    <ol className="m-0 flex list-none flex-col gap-3 p-0">
                      {eventos.map((e) => (
                        <li key={e.id} className="flex items-start gap-3">
                          <span className="mt-1.5 h-1.5 w-1.5 flex-none rounded-full bg-blue" />
                          <div className="min-w-0">
                            <p className="m-0 text-[13px] font-medium">{e.descricao}</p>
                            <p className="m-0 mt-0.5 text-[11.5px] text-muted-2">
                              {dataHora(e.criado_em)}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>

      <RodapeCliente lojista={lojista} />
    </div>
  );
}
