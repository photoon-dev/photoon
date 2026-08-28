'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

/**
 * Navegação inferior, no formato de aplicativo.
 *
 * Aparece só em tela pequena. Quatro destinos principais no rodapé e um botão
 * "Mais" que abre uma folha deslizando de baixo para cima com o resto — é o
 * padrão de app, e evita o menu lateral de 262px que não cabe no celular.
 *
 * Alvos de toque de 56px de altura, ícones de 26px: o mínimo confortável.
 */

export type ItemMenu = {
  rotulo: string;
  href?: string;
  icone: React.ReactNode;
  /** Sem href = tela ainda não construída; aparece esmaecida. */
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

  // Fecha a folha ao navegar.
  useEffect(() => {
    setFolha(false);
  }, [pathname]);

  // Trava o rolar do fundo enquanto a folha está aberta.
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

  const botao = (item: ItemMenu, i: number) => {
    const on = ativo(item.href);
    const conteudo = (
      <>
        <span className={on ? 'text-blue' : item.href ? 'text-ink-3' : 'text-muted-2/50'}>
          {item.icone}
        </span>
        <span
          className={`text-[11px] leading-none ${
            on ? 'font-bold text-blue' : item.href ? 'font-medium text-ink-3' : 'text-muted-2/50'
          }`}
        >
          {item.rotulo}
        </span>
      </>
    );

    const classe =
      'flex h-[56px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl transition-colors active:bg-blue-soft';

    return item.href ? (
      <Link key={i} href={item.href} className={classe} aria-current={on ? 'page' : undefined}>
        {conteudo}
      </Link>
    ) : (
      <span key={i} className={`${classe} cursor-not-allowed`} title={`${item.rotulo} · em breve`}>
        {conteudo}
      </span>
    );
  };

  return (
    <>
      {/* folha que sobe */}
      {folha && (
        <>
          <div
            className="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-[2px] md:hidden"
            onClick={() => setFolha(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-[81] max-h-[76vh] animate-[subir_.22s_cubic-bezier(.2,.8,.2,1)_both] overflow-y-auto rounded-t-[26px] border-t border-line bg-surface pb-[calc(88px+env(safe-area-inset-bottom))] md:hidden">
            <div className="sticky top-0 flex justify-center bg-surface pb-2 pt-3">
              <span className="h-1 w-10 rounded-full bg-[#DCE3EF]" />
            </div>

            <div className="grid grid-cols-3 gap-2 px-4 pt-2">
              {extras.map((item, i) => {
                const on = ativo(item.href);
                const conteudo = (
                  <>
                    <span className={on ? 'text-blue' : item.href ? 'text-ink-3' : 'text-muted-2/50'}>
                      {item.icone}
                    </span>
                    <span
                      className={`text-center text-[12px] leading-tight ${
                        on ? 'font-bold text-blue' : item.href ? 'text-ink-3' : 'text-muted-2/50'
                      }`}
                    >
                      {item.rotulo}
                    </span>
                  </>
                );
                const classe = `flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-2xl border px-2 py-3 ${
                  on ? 'border-[#D6E2FC] bg-blue-soft' : 'border-line bg-surface'
                }`;

                return item.href ? (
                  <Link key={i} href={item.href} className={classe}>
                    {conteudo}
                  </Link>
                ) : (
                  <span key={i} className={`${classe} opacity-60`} title="em breve">
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

      {/* barra fixa */}
      <nav className="fixed inset-x-0 bottom-0 z-[79] flex items-stretch gap-1 border-t border-line bg-surface/95 px-2 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur-[12px] md:hidden">
        {principais.slice(0, 4).map(botao)}

        {extras.length > 0 && (
          <button
            onClick={() => setFolha((f) => !f)}
            aria-expanded={folha}
            className="flex h-[56px] flex-1 flex-col items-center justify-center gap-1 rounded-2xl active:bg-blue-soft"
          >
            <span className={folha ? 'text-blue' : 'text-ink-3'}>
              <svg
                viewBox="0 0 24 24"
                width={26}
                height={26}
                fill="none"
                stroke="currentColor"
                strokeWidth={1.9}
                strokeLinecap="round"
                className={folha ? 'rotate-180 transition-transform' : 'transition-transform'}
              >
                <path d="M6 15l6-6 6 6" />
              </svg>
            </span>
            <span
              className={`text-[11px] leading-none ${folha ? 'font-bold text-blue' : 'font-medium text-ink-3'}`}
            >
              Mais
            </span>
          </button>
        )}
      </nav>
    </>
  );
}
