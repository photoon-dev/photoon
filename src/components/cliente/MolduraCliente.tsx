import Link from 'next/link';

/**
 * Moldura das telas do cliente que não vêm do design.
 *
 * "Meus projetos", "Detalhe" e "Editor" têm tela própria transliterada. Conta,
 * Ajuda e Galeria não vieram no zip, então usam esta moldura — mesmo cabeçalho,
 * mesmas medidas e mesmas cores, para não parecerem de outro produto.
 */
export default function MolduraCliente({
  ativo,
  loja,
  nome,
  avatar,
  children,
}: {
  ativo: 'projetos' | 'galeria' | 'ajuda' | 'conta';
  loja: string;
  nome: string;
  avatar?: string | null;
  children: React.ReactNode;
}) {
  const itens: [string, string, typeof ativo][] = [
    ['Meus projetos', '/meus-projetos', 'projetos'],
    ['Galeria', '/galeria', 'galeria'],
    ['Ajuda', '/ajuda', 'ajuda'],
    ['Minha conta', '/minha-conta', 'conta'],
  ];

  const iniciais =
    nome.split(/[ @.]/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?';

  return (
    <div className="om-cli min-h-screen bg-page">
      <header className="flex min-h-[72px] flex-wrap items-center gap-3 border-b border-line bg-surface px-6 py-3">
        <Link href="/meus-projetos" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-lente text-[13px] font-extrabold text-white">
            {loja.slice(0, 2).toUpperCase()}
          </span>
          <span>
            <span className="block text-[15px] font-extrabold tracking-[-.2px]">{loja}</span>
            <span className="block text-[11.5px] text-muted-2">seus álbuns</span>
          </span>
        </Link>

        <nav className="ml-4 flex flex-wrap gap-1">
          {itens.map(([rot, href, id]) => (
            <Link
              key={href}
              href={href}
              aria-current={ativo === id ? 'page' : undefined}
              className={`rounded-full px-4 py-2 text-sm ${
                ativo === id
                  ? 'bg-blue-soft font-bold text-blue'
                  : 'font-medium text-ink-3 hover:bg-page hover:text-blue'
              }`}
            >
              {rot}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        <Link href="/minha-conta" className="flex items-center gap-2.5">
          <span className="hidden text-right sm:block">
            <span className="block text-[13.5px] font-bold leading-tight">{nome}</span>
            <span className="block text-[11.5px] text-muted-2">Minha conta</span>
          </span>
          <span className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-blue-soft text-[13px] font-bold text-blue">
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt="" className="h-full w-full object-cover" />
            ) : (
              iniciais
            )}
          </span>
        </Link>
      </header>

      <main className="px-6 py-7">{children}</main>
    </div>
  );
}
