import { notFound } from 'next/navigation';
import { currentTenantSlug } from '@/lib/tenant';
import { getLojista } from '@/lib/data';
import HeroEntrar from '@/components/HeroEntrar';
import FormEntrar from '@/components/FormEntrar';

export const dynamic = 'force-dynamic';

export default async function EntrarPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const slug = await currentTenantSlug();
  if (!slug) notFound();

  const lojista = await getLojista(slug);
  if (!lojista) notFound();

  const { next } = await searchParams;

  return (
    <div className="grid min-h-screen bg-page [grid-template-columns:repeat(auto-fit,minmax(420px,1fr))]">
      <HeroEntrar lojista={lojista} />

      <div className="flex min-w-0 flex-col px-11 py-10">
        <div className="mb-auto flex items-center justify-end gap-2.5">
          <span className="text-[13px] text-muted">Primeira vez por aqui?</span>
          <span className="text-[13px] font-bold text-muted-2">
            Use o link do convite que a {lojista.nome} enviou
          </span>
        </div>

        <div className="mx-auto w-full max-w-[420px] animate-riseIn py-[34px]">
          <h2 className="m-0 mb-2 text-[28px] font-extrabold tracking-[-.9px]">
            Acesse seus projetos
          </h2>
          <p className="m-0 mb-7 text-[14.5px] text-muted">
            Entre com o e-mail que a {lojista.nome} cadastrou para você.
          </p>

          <FormEntrar
            next={next ?? '/meus-projetos'}
            telefoneSuporte={lojista.telefone_suporte}
          />
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-center gap-3.5">
          {lojista.url_politica && (
            <>
              <a
                href={lojista.url_politica}
                className="text-[12.5px] text-muted hover:text-blue"
              >
                Política de privacidade
              </a>
              <span className="h-1 w-1 rounded-full bg-[#CBD5E6]" />
            </>
          )}
          {lojista.url_contato && (
            <>
              <a href={lojista.url_contato} className="text-[12.5px] text-muted hover:text-blue">
                Contato da empresa
              </a>
              <span className="h-1 w-1 rounded-full bg-[#CBD5E6]" />
            </>
          )}
          <span className="text-[12.5px] text-muted-2">Tecnologia Photoon</span>
        </div>
      </div>
    </div>
  );
}
