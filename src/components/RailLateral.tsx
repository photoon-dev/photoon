'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  IconGrade,
  IconGaleria,
  IconLapis,
  IconSparkle,
  IconCheck,
  IconCompartilhar,
  IconInfo,
  IconUsuario,
  IconSair,
} from '@/components/icons';

/**
 * Barra lateral de ícones do design.
 *
 * Os destinos sem `href` são telas que existem no projeto de design mas ainda
 * não foram construídas (não há arquivo .dc.html para elas). Ficam visíveis e
 * desativadas, em vez de virarem link quebrado.
 */
const ITENS = [
  { rotulo: 'Meus projetos', Icone: IconGrade, href: '/meus-projetos' },
  { rotulo: 'Galeria de fotos', Icone: IconGaleria },
  { rotulo: 'Editor de álbum', Icone: IconLapis },
  { rotulo: 'Criar com IA', Icone: IconSparkle },
  { rotulo: 'Revisão', Icone: IconCheck },
  { rotulo: 'Compartilhar', Icone: IconCompartilhar },
  { rotulo: 'Ajuda', Icone: IconInfo },
  { rotulo: 'Minha conta', Icone: IconUsuario },
] as const;

export default function RailLateral() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-[88px] hidden h-max flex-none flex-col gap-1 rounded-card border border-line bg-surface p-2 md:flex">
      {ITENS.map(({ rotulo, Icone, ...resto }) => {
        const href = 'href' in resto ? resto.href : undefined;
        const ativo = href ? pathname.startsWith(href) : false;
        const classe = `group relative flex h-12 w-12 items-center justify-center rounded-2xl transition-colors ${
          ativo
            ? 'bg-[linear-gradient(135deg,#7C5CFF,#4F46E5)] text-white shadow-[0_8px_18px_rgba(90,66,214,.28)]'
            : href
              ? 'text-ink-3 hover:bg-[#F3F1FF] hover:text-[#4F46E5]'
              : 'cursor-not-allowed text-muted-2/50'
        }`;

        const dica = (
          <span className="pointer-events-none absolute left-[calc(100%+10px)] z-20 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-[11.5px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
            {rotulo}
            {!href && ' · em breve'}
          </span>
        );

        return href ? (
          <Link key={rotulo} href={href} className={classe} aria-label={rotulo}>
            <Icone size={24} />
            {dica}
          </Link>
        ) : (
          <span key={rotulo} className={classe} aria-disabled title={`${rotulo} · em breve`}>
            <Icone size={24} />
            {dica}
          </span>
        );
      })}

      <span className="mx-2 my-1 h-px bg-[#EEF1F7]" />

      <form action="/auth/sair" method="post">
        <button
          type="submit"
          aria-label="Sair"
          className="group relative flex h-12 w-12 items-center justify-center rounded-2xl text-[#E11D48] hover:bg-coral-surface"
        >
          <IconSair size={24} />
          <span className="pointer-events-none absolute left-[calc(100%+10px)] z-20 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1.5 text-[11.5px] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
            Sair
          </span>
        </button>
      </form>
    </aside>
  );
}
