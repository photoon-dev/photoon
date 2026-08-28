'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Navegação inferior, no formato de aplicativo.
 *
 * Só ícone, sem rótulo: é o que iOS e Android fazem quando o ícone já é
 * reconhecível, e sobra espaço para alvos maiores. O item ativo ganha uma
 * pílula azul-clara — o mesmo recurso do Material 3.
 *
 * Medidas, contra as referências:
 *   barra 68px      — M3 usa 80dp com rótulo; sem rótulo pode encolher
 *   ícone 30px      — iOS HIG usa ~28pt; M3, 24dp
 *   indicador 64×36 — M3 especifica 64×32
 *   alvo 68px       — acima dos 44pt mínimos do iOS e dos 48dp do Android
 *
 * A folha "Mais" sobe por cima, travando o rolar do fundo.
 */

export type ItemMenu = {
  rotulo: string;
  href?: string;
  icone: React.ReactNode;
  /** Sem href = tela ainda não construída. */
};

export default function MenuInferior({
  principais,
  extras = [],
  onSair,
}: {
  principais: ItemMenu[];
  extras?: ItemMenu[];
  onSair?: boolean;
}) {
  const pathname = usePathname();
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

  const item = (it: ItemMenu, i: number) => {
    const on = ativo(it.href);
    const conteudo = (
      <span
        className={`flex h-9 w-16 items-center justify-center rounded-full transition-colors ${
          on ? 'bg-blue-surface text-blue' : it.href ? 'text-[#7C8AA3]' : 'text-[#C3CCDA]'
        }`}
      >
        {it.icone}
      </span>
    );
    const classe = 'flex h-[68px] flex-1 items-center justify-center active:opacity-70';

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

  return (
    <>
      {folha && (
        <>
          <div
            className="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-[2px] md:hidden"
            onClick={() => setFolha(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-[81] max-h-[76vh] animate-[subir_.22s_cubic-bezier(.2,.8,.2,1)_both] overflow-y-auto rounded-t-[26px] border-t border-line bg-surface pb-[calc(92px+env(safe-area-inset-bottom))] md:hidden">
            <div className="sticky top-0 z-10 flex justify-center bg-surface pb-3 pt-3">
              <span className="h-1 w-10 rounded-full bg-[#DCE3EF]" />
            </div>

            <div className="grid grid-cols-3 gap-2.5 px-4">
              {extras.map((it, i) => {
                const on = ativo(it.href);
                const disponivel = !!it.href;

                // Ícone e rótulo precisam de contraste real: antes ficavam a
                // 50% de opacidade sobre branco e sumiam.
                const conteudo = (
                  <>
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
                        on
                          ? 'bg-blue text-white'
                          : disponivel
                            ? 'bg-blue-soft text-blue'
                            : 'bg-page text-[#8A97AC]'
                      }`}
                    >
                      {it.icone}
                    </span>
                    <span
                      className={`text-center text-[12.5px] leading-tight ${
                        on ? 'font-bold text-blue' : disponivel ? 'text-ink-3' : 'text-muted'
                      }`}
                    >
                      {it.rotulo}
                    </span>
                    {!disponivel && (
                      <span className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-2">
                        em breve
                      </span>
                    )}
                  </>
                );

                const classe = `flex min-h-[104px] flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-3 ${
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
              <form action="/auth/sair" method="post" className="px-4 pt-4">
                <button
                  type="submit"
                  className="h-[52px] w-full rounded-2xl border border-line text-[14px] font-bold text-[#E11D48] active:bg-coral-surface"
                >
                  Sair
                </button>
              </form>
            )}
          </div>
        </>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-[79] flex items-stretch border-t border-line bg-surface/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur-[12px] md:hidden">
        {principais.slice(0, 4).map(item)}

        {extras.length > 0 && (
          <button
            onClick={() => setFolha((f) => !f)}
            aria-expanded={folha}
            aria-label="Mais"
            className="flex h-[68px] flex-1 items-center justify-center active:opacity-70"
          >
            <span
              className={`flex h-9 w-16 items-center justify-center rounded-full transition-colors ${
                folha ? 'bg-blue-surface text-blue' : 'text-[#7C8AA3]'
              }`}
            >
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
    </>
  );
}
