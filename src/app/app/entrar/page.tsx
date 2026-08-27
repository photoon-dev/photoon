import MolduraLogin from '@/components/MolduraLogin';
import FormEntrarLojista from '@/components/app/FormEntrarLojista';
import { IconCheck } from '@/components/icons';

export const dynamic = 'force-dynamic';

const DESTAQUES = [
  'Pedidos, produção, entrega e financeiro na mesma janela.',
  'Do upload ao lote impresso, sem instalar sincronizador.',
  'Cada loja no próprio domínio, com a sua marca.',
];

/** Login do lojista — app.photoon.com.br/entrar */
export default async function EntrarLojistaPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <MolduraLogin
      legenda="app.photoon.com.br"
      titulo={
        <>
          Entre e coloque o
          <br />
          laboratório a girar.
        </>
      }
      subtitulo="Painel de quem administra a loja. Clientes finais entram pelo endereço da loja."
      selo={
        <span className="inline-flex items-center gap-2 rounded-full bg-blue-surface py-1.5 pl-2 pr-3 text-xs font-semibold text-blue">
          <span className="h-[7px] w-[7px] rounded-full bg-green" />
          Todos os serviços no ar
        </span>
      }
      formulario={<FormEntrarLojista next={next ?? '/'} />}
      painel={
        <>
          <p className="m-0 mb-6 max-w-[420px] text-[30px] font-bold leading-[1.2] tracking-[-.7px] text-white">
            Web to print, do jeito
            <br />
            que o laboratório precisa.
          </p>
          <ul className="m-0 flex list-none flex-col gap-3.5 p-0">
            {DESTAQUES.map((texto) => (
              <li key={texto} className="flex items-start gap-3">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-[10px] bg-white/[.16] text-white">
                  <IconCheck size={16} />
                </span>
                <span className="pt-1.5 text-[13.5px] leading-[1.5] text-white/75">{texto}</span>
              </li>
            ))}
          </ul>
        </>
      }
      rodape={
        <>
          <span>© 2026 Photoon</span>
          <span className="h-1 w-1 rounded-full bg-[#CBD5E6]" />
          <span>Privacidade</span>
          <span className="h-1 w-1 rounded-full bg-[#CBD5E6]" />
          <span>Termos</span>
        </>
      }
    />
  );
}
