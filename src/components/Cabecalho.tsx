import Link from 'next/link';
import type { Lojista } from '@/lib/data';

export default function Cabecalho({ lojista }: { lojista: Lojista }) {
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/meus-projetos" className="flex items-center gap-2">
          {lojista.logo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={lojista.logo_url} alt={lojista.nome} className="h-7 w-auto object-contain" />
          ) : (
            <span className="font-semibold">{lojista.nome}</span>
          )}
        </Link>

        <form action="/auth/sair" method="post">
          <button type="submit" className="text-sm text-muted hover:text-fg">
            Sair
          </button>
        </form>
      </div>
    </header>
  );
}
