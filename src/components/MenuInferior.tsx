'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Navegação inferior no formato de aplicativo.
 *
 * Barra flutuante, destacada da borda, com o azul profundo da marca e cantos
 * de 28px. No centro, a ação principal salta para fora da barra — é o recurso
 * que dá peso visual e o que os aplicativos reservam à ação mais frequente.
 *
 * Medidas, contra as referências:
 *   barra 74px        — M3 usa 80dp com rótulo; sem rótulo pode encolher
 *   ícone 30px        — iOS HIG ~28pt, M3 24dp
 *   ação central 62px — acima dos 56dp do FAB do Material
 *   alvo 74px         — muito acima dos 44pt do iOS e dos 48dp do Android
 *
 * O fundo é escuro de propósito. Sobre branco, o ícone inativo precisa ser
 * cinza-claro para não competir com o ativo, e aí ele some — foi o que
 * aconteceu na versão anterior. Sobre o azul, o inativo pode ser branco a
 * 60%: visível, sem disputar atenção.
 */

export type ItemMenu = {
  rotulo: string;
  href?: string;
  icone: React.ReactNode;
  /** Sem href = tela ainda não construída. */
};

export type AcaoCentral = {
  rotulo: string;
  href: string;
  icone: React.ReactNode;
};

export default function MenuInferior({
  principais,
  extras = [],
  acao,
  onSair,
}: {
  principais: ItemMenu[];
  extras?: ItemMenu[];
  /** Botão central em destaque, saltando da barra. */
  acao?: AcaoCentral;
  onSair?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [folha, setFolha] = useState(false);

  useEffect(() => {
    setFolha(false);
  }, [pathname]);

  useEffect(() => {
    if (!folha) return;
    const antes = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = antes;
    };
  }, [folha]);

  const ativo = (href?: string) =>
    !!href && (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const pilula = (on: boolean, disponivel: boolean) =>
    `flex h-[46px] w-[52px] items-center justify-center rounded-[16px] transition-all duration-200 ${
      on
        ? 'bg-white/[.18] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,.22)]'
        : disponivel
          ? 'text-white/60'
          : 'text-white/25'
    }`;

  const item = (it: ItemMenu, i: number) => {
    const on = ativo(it.href);
    const conteudo = <span className={pilula(on, !!it.href)}>{it.icone}</span>;
    const classe =
      'flex h-[74px] flex-1 items-center justify-center transition-transform active:scale-95';

    return it.href ? (
      <Link
        key={i}
        href={it.href}
        aria-label={it.rotulo}
        title={it.rotulo}
        aria-current={on ? 'page' : undefined}
        className={classe}
      >
        {conteudo}
      </Link>
    ) : (
      <span
        key={i}
        aria-label={it.rotulo}
        title={`${it.rotulo} · em breve`}
        className={`${classe} cursor-not-allowed`}
      >
        {conteudo}
      </span>
    );
  };

  // Com ação central, os itens ficam dois de cada lado dela.
  const metade = acao ? Math.ceil(principais.length / 2) : principais.length;
  const esquerda = principais.slice(0, metade);
  const direita = principais.slice(metade, 4);

  return (
    <>
      {folha && (
        <>
          <div
            className="fixed inset-0 z-[80] bg-ink/50 backdrop-blur-[3px] md:hidden"
            onClick={() => setFolha(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-[81] max-h-[78vh] animate-[subir_.24s_cubic-bezier(.2,.8,.2,1)_both] overflow-y-auto rounded-t-[30px] bg-surface pb-[calc(120px+env(safe-area-inset-bottom))] shadow-[0_-16px_40px_rgba(11,18,32,.22)] md:hidden">
            <div className="sticky top-0 z-10 flex justify-center bg-surface pb-4 pt-3.5">
              <span className="h-1.5 w-11 rounded-full bg-[#DCE3EF]" />
            </div>

            <div className="grid grid-cols-3 gap-3 px-5">
              {extras.map((it, i) => {
                const on = ativo(it.href);
                const disponivel = !!it.href;

                const conteudo = (
                  <>
                    <span
                      className={`flex h-[52px] w-[52px] items-center justify-center rounded-[18px] ${
                        on
                          ? 'bg-lente text-white shadow-card'
                          : disponivel
                            ? 'bg-blue-soft text-blue'
                            : 'bg-page text-[#8A97AC]'
                      }`}
                    >
                      {it.icone}
                    </span>
                    <span
                      className={`text-center text-[12.5px] leading-tight ${
                        on
                          ? 'font-bold text-blue'
                          : disponivel
                            ? 'font-medium text-ink-3'
                            : 'text-muted'
                      }`}
                    >
                      {it.rotulo}
                    </span>
                    {!disponivel && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-2">
                        em breve
                      </span>
                    )}
                  </>
                );

                const classe = `flex min-h-[112px] flex-col items-center justify-center gap-2.5 rounded-[22px] border px-2 py-4 transition-transform active:scale-95 ${
                  on ? 'border-[#D6E2FC] bg-blue-soft' : 'border-line bg-surface'
                }`;

                return disponivel ? (
                  <Link key={i} href={it.href!} className={classe}>
                    {conteudo}
                  </Link>
                ) : (
                  <span key={i} className={classe}>
                    {conteudo}
                  </span>
                );
              })}
            </div>

            {onSair && (
              <form action="/auth/sair" method="post" className="px-5 pt-5">
                <button
                  type="submit"
                  className="h-[54px] w-full rounded-[18px] border border-line text-[14.5px] font-bold text-[#E11D48] active:bg-coral-surface"
                >
                  Sair
                </button>
              </form>
            )}
          </div>
        </>
      )}

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[79] pb-[env(safe-area-inset-bottom)] md:hidden">
        <nav className="pointer-events-auto relative mx-3 mb-3 flex items-stretch rounded-[28px] bg-[linear-gradient(118deg,#0B1220_0%,#17306B_58%,#0E4F6B_100%)] px-2 shadow-[0_16px_36px_rgba(11,18,32,.34)]">
          {esquerda.map(item)}

          {acao && (
            <div className="flex w-[78px] flex-none items-start justify-center">
              <button
                onClick={() => router.push(acao.href)}
                aria-label={acao.rotulo}
                title={acao.rotulo}
                className="-mt-6 flex h-[62px] w-[62px] items-center justify-center rounded-full bg-lente text-white shadow-[0_10px_24px_rgba(37,99,235,.5)] ring-4 ring-page transition-transform active:scale-90"
              >
                {acao.icone}
              </button>
            </div>
          )}

          {direita.map(item)}

          {extras.length > 0 && (
            <button
              onClick={() => setFolha((f) => !f)}
              aria-expanded={folha}
              aria-label="Mais"
              className="flex h-[74px] flex-1 items-center justify-center transition-transform active:scale-95"
            >
              <span className={pilula(folha, true)}>
                <svg
                  viewBox="0 0 24 24"
                  width={30}
                  height={30}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={folha ? 'rotate-180 transition-transform' : 'transition-transform'}
                >
                  <path d="M6 15l6-6 6 6" />
                </svg>
              </span>
            </button>
          )}
        </nav>
      </div>
    </>
  );
}
