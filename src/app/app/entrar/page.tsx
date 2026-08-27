import FormEntrarLojista from '@/components/app/FormEntrarLojista';

export const dynamic = 'force-dynamic';

/** Login do lojista — app.photoon.com.br/entrar */
export default async function EntrarLojistaPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="grid min-h-screen bg-page lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {/* ---------------- coluna do formulário ---------------- */}
      <div className="flex flex-col justify-between gap-9 px-8 pb-[30px] pt-[34px] sm:px-[52px]">
        <div className="flex items-center justify-between gap-5">
          <span className="flex items-center gap-2.5 text-ink">
            <LenteDupla />
            <span className="text-lg font-extrabold tracking-[.6px]">PHOTOON</span>
          </span>
          <span className="text-[13px] text-muted">Painel do lojista</span>
        </div>

        <div className="mx-auto w-full max-w-[404px] animate-riseIn">
          <span className="mb-[18px] inline-flex items-center gap-2 rounded-full bg-blue-surface py-1.5 pl-2 pr-3 text-xs font-semibold text-blue">
            <span className="h-[7px] w-[7px] rounded-full bg-green" />
            Todos os serviços no ar
          </span>

          <h1 className="m-0 mb-2.5 text-[38px] font-extrabold leading-[1.1] tracking-[-1.2px]">
            Entre e coloque o<br />
            laboratório a girar.
          </h1>
          <p className="m-0 mb-[30px] text-[15px] leading-[1.6] text-muted">
            Pedidos, produção, entrega e financeiro — tudo na mesma janela.
          </p>

          <FormEntrarLojista next={next ?? '/'} />
        </div>

        <div className="flex items-center justify-between gap-5 text-xs text-muted-2">
          <span>© 2026 Photoon · Privacidade · Termos</span>
          <span className="flex items-center gap-[7px]">
            <span className="h-1.5 w-1.5 rounded-full bg-green" />
            photoon.com.br
          </span>
        </div>
      </div>

      {/* ---------------- painel visual ---------------- */}
      <div className="hidden p-[18px] pl-0 lg:block">
        <div className="relative h-full min-h-[660px] overflow-hidden rounded-hero bg-[linear-gradient(150deg,#0B1220_0%,#17306B_55%,#0E6E86_100%)]">
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgba(11,18,32,.72)_0%,rgba(23,48,107,.55)_45%,rgba(11,18,32,.86)_100%)]" />

          <div className="pointer-events-none absolute left-9 right-9 top-[34px] flex items-center justify-between">
            <span className="rounded-full border border-white/20 bg-white/[.14] px-[15px] py-[9px] text-xs font-semibold tracking-[.4px] text-white backdrop-blur-[10px]">
              Web to Print · Cloud-first
            </span>
            <span className="flex h-[46px] w-[46px] items-center justify-center rounded-full border border-white/20 bg-white/[.14] backdrop-blur-[10px]">
              <svg
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="none"
                stroke="#22D3EE"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2.5" y="6" width="19" height="14" rx="4" />
                <circle cx="12" cy="13" r="3.6" />
              </svg>
            </span>
          </div>

          <div className="pointer-events-none absolute bottom-[34px] left-9 right-9 flex flex-col gap-[22px] text-white">
            <p className="m-0 max-w-[520px] text-[30px] font-bold leading-[1.25] tracking-[-.6px]">
              Do upload ao lote impresso, sem instalar sincronizador.
            </p>
            {/* Os números do design eram de demonstração; entram quando houver
                métrica real da plataforma. */}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Marca de duas lentes usada na tela de login da plataforma. */
function LenteDupla() {
  return (
    <svg viewBox="0 0 124 72" width="44" height="26" role="img" aria-label="Photoon">
      <defs>
        <linearGradient id="lente-login" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2563EB" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <circle cx="34" cy="36" r="26" fill="none" stroke="#0B1220" strokeWidth="7" />
      <circle cx="34" cy="36" r="11" fill="#0B1220" />
      <circle cx="90" cy="36" r="26" fill="none" stroke="#0B1220" strokeWidth="7" />
      <circle cx="90" cy="36" r="11" fill="url(#lente-login)" />
      <circle cx="98" cy="19" r="5.5" fill="#06B6D4" />
    </svg>
  );
}
