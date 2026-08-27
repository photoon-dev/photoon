'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import MarcaPhotoon from '@/components/MarcaPhotoon';
import { IconInfo, IconSino, IconChevron, IconSair } from '@/components/icons';
import type { Cliente, Lojista } from '@/lib/data';

const NAV = [{ href: '/meus-projetos', rotulo: 'Meus projetos' }];

export default function AppHeader({
  lojista,
  cliente,
  naoLidas,
}: {
  lojista: Lojista;
  cliente: Cliente;
  naoLidas: number;
}) {
  const pathname = usePathname();
  const [menu, setMenu] = useState(false);
  const caixa = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const fora = (e: MouseEvent) => {
      if (caixa.current && !caixa.current.contains(e.target as Node)) setMenu(false);
    };
    document.addEventListener('mousedown', fora);
    return () => document.removeEventListener('mousedown', fora);
  }, [menu]);

  const iniciais = (cliente.nome ?? cliente.email)
    .split(/[\s@.]+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex min-h-[72px] flex-wrap items-center gap-5 border-b border-line bg-surface/[.92] px-7 py-3 backdrop-blur-[12px]">
      <Link href="/meus-projetos" className="flex min-w-0 items-center gap-[11px]">
        <span className="flex h-9 w-9 flex-none items-center justify-center">
          {lojista.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={lojista.logo_url} alt="" className="h-9 w-9 object-contain" />
          ) : (
            <MarcaPhotoon size={36} id="hdr" />
          )}
        </span>
        <span className="min-w-0">
          <span className="block whitespace-nowrap text-[15px] font-extrabold tracking-[-.2px] text-ink">
            {lojista.nome}
          </span>
          <span className="block whitespace-nowrap text-[11.5px] text-muted-2">
            {lojista.slug}.photoon.com.br
          </span>
        </span>
      </Link>

      <nav className="ml-3 flex flex-wrap items-center gap-1">
        {NAV.map((item) => {
          const ativo = pathname === item.href || pathname.startsWith('/projetos');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-full px-[15px] py-[9px] text-sm ${
                ativo ? 'bg-blue-soft font-bold text-blue' : 'font-medium text-ink-3 hover:bg-page hover:text-blue'
              }`}
            >
              {item.rotulo}
            </Link>
          );
        })}
      </nav>

      <div className="flex-1" />

      <div className="flex items-center gap-2.5">
        {lojista.url_contato && (
          <a
            href={lojista.url_contato}
            title="Ajuda"
            className="flex h-[42px] w-[42px] flex-none items-center justify-center rounded-control border border-line bg-surface text-ink-3 hover:bg-blue-soft hover:text-blue"
          >
            <IconInfo size={18} />
          </a>
        )}

        <Link
          href="/meus-projetos#avisos"
          title="Notificações"
          className="relative flex h-[42px] w-[42px] flex-none items-center justify-center rounded-control border border-line bg-surface text-ink-3 hover:bg-blue-soft hover:text-blue"
        >
          <IconSino size={18} />
          {naoLidas > 0 && (
            <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-coral px-1 text-[10px] font-bold text-white">
              {naoLidas}
            </span>
          )}
        </Link>

        <div className="relative" ref={caixa}>
          <button
            onClick={() => setMenu((m) => !m)}
            aria-expanded={menu}
            className="flex items-center gap-2.5 rounded-control border border-line bg-surface px-2.5 py-1.5 hover:bg-blue-soft"
          >
            <span className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-[11px] bg-ink text-[12.5px] font-bold text-white">
              {iniciais}
            </span>
            <span className="flex flex-col text-left leading-[1.25]">
              <span className="whitespace-nowrap text-[13.5px] font-bold">
                {cliente.nome ?? cliente.email.split('@')[0]}
              </span>
              <span className="whitespace-nowrap text-[11.5px] text-muted">{lojista.nome}</span>
            </span>
            <span className="flex-none text-muted-2">
              <IconChevron />
            </span>
          </button>

          {menu && (
            <div className="absolute right-0 top-[calc(100%+8px)] w-[260px] overflow-hidden rounded-control border border-line bg-surface shadow-modal">
              <div className="border-b border-line-2 px-4 py-3.5">
                <p className="m-0 text-[13.5px] font-bold">{cliente.nome ?? 'Minha conta'}</p>
                <p className="m-0 mt-[3px] truncate text-[12.5px] text-muted">{cliente.email}</p>
              </div>
              {/* "Meus dados" / "Alterar senha" existem no design mas nao ha
                  tela "Cliente Minha conta" no projeto - so entram quando ela vier. */}
              <form action="/auth/sair" method="post" className="p-2">
                <button
                  type="submit"
                  className="flex w-full items-center gap-[11px] rounded-xl px-3 py-2.5 text-[13.5px] font-semibold text-[#E11D48] hover:bg-coral-surface"
                >
                  <IconSair />
                  Sair
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
