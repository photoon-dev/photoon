import { LogoLockup } from '@/components/Logo';

/**
 * Esqueleto compartilhado das duas telas de login (cliente final e lojista).
 *
 * Mesma estrutura, mesma logo, mesmo respiro: só muda o conteúdo do painel
 * escuro à direita e o formulário à esquerda. Ter as duas telas divergindo
 * era o que fazia a plataforma parecer dois produtos diferentes.
 */
export default function MolduraLogin({
  legenda,
  titulo,
  subtitulo,
  selo,
  formulario,
  painel,
  rodape,
}: {
  legenda: string;
  titulo: React.ReactNode;
  subtitulo: string;
  selo?: React.ReactNode;
  formulario: React.ReactNode;
  painel: React.ReactNode;
  rodape?: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-page lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <div className="flex flex-col justify-between gap-10 px-8 py-9 sm:px-12">
        <LogoLockup width={40} legenda={legenda} />

        <div className="mx-auto w-full max-w-[400px] animate-riseIn">
          {selo && <div className="mb-5">{selo}</div>}

          <h1 className="m-0 mb-2.5 text-[32px] font-extrabold leading-[1.12] tracking-[-1.1px]">
            {titulo}
          </h1>
          <p className="m-0 mb-8 text-[14.5px] leading-[1.6] text-muted">{subtitulo}</p>

          {formulario}
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[12.5px] text-muted-2">
          {rodape}
        </div>
      </div>

      <div className="hidden p-4 pl-0 lg:block">
        <div className="relative flex h-full min-h-[620px] flex-col justify-end overflow-hidden rounded-hero bg-[linear-gradient(150deg,#0B1220_0%,#17306B_55%,#0E6E86_100%)] p-10">
          <div className="pointer-events-none absolute -right-20 -top-28 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(37,99,235,.5),transparent_70%)]" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,.38),transparent_72%)]" />
          <div className="relative">{painel}</div>
        </div>
      </div>
    </div>
  );
}
