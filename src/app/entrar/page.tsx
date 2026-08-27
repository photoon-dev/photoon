import { notFound } from 'next/navigation';
import { currentTenantSlug } from '@/lib/tenant';
import { getLojista } from '@/lib/data';
import MolduraLogin from '@/components/MolduraLogin';
import FormEntrar from '@/components/FormEntrar';
import { IconSparkle, IconFoto, IconCheck } from '@/components/icons';

export const dynamic = 'force-dynamic';

const DESTAQUES = [
  { Icone: IconSparkle, texto: 'A assistência diagrama, respeita rostos e evita repetidas.' },
  { Icone: IconFoto, texto: 'Suas fotos já liberadas — você não precisa enviar nada.' },
  { Icone: IconCheck, texto: 'Revisão de páginas vazias e cortes antes da produção.' },
];

/** Login do cliente final — <loja>.photoon.com.br/entrar */
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
    <MolduraLogin
      legenda={`${lojista.slug}.photoon.com.br`}
      titulo="Acesse seus projetos"
      subtitulo={`Entre com o e-mail que a ${lojista.nome} cadastrou para você.`}
      formulario={
        <FormEntrar next={next ?? '/meus-projetos'} telefoneSuporte={lojista.telefone_suporte} />
      }
      painel={
        <>
          <p className="m-0 mb-6 max-w-[420px] text-[30px] font-bold leading-[1.2] tracking-[-.7px] text-white">
            Suas fotos já estão aqui.
            <br />
            Vamos montar o álbum?
          </p>
          <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
            {DESTAQUES.map(({ Icone, texto }) => (
              <li key={texto} className="flex items-start gap-3">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[10px] bg-white/[.16] text-white">
                  <Icone size={16} />
                </span>
                <span className="pt-1.5 text-[13.5px] leading-[1.5] text-white/75">{texto}</span>
              </li>
            ))}
          </ul>
        </>
      }
      rodape={
        <>
          <span className="font-semibold text-muted">{lojista.nome}</span>
          {lojista.url_politica && (
            <>
              <span className="h-1 w-1 rounded-full bg-[#CBD5E6]" />
              <a href={lojista.url_politica} className="hover:text-blue">
                Política de privacidade
              </a>
            </>
          )}
          <span className="h-1 w-1 rounded-full bg-[#CBD5E6]" />
          <span>Tecnologia Photoon</span>
        </>
      }
    />
  );
}
