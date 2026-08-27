import type { Lojista } from '@/lib/data';

export default function RodapeCliente({ lojista }: { lojista: Lojista }) {
  return (
    <footer className="mt-auto border-t border-line bg-surface px-7 py-6">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-center gap-3.5 text-[12.5px] text-muted">
        <span className="font-bold text-ink">{lojista.nome}</span>
        {lojista.email_suporte && (
          <>
            <span className="h-1 w-1 rounded-full bg-[#CBD5E6]" />
            <a href={`mailto:${lojista.email_suporte}`}>{lojista.email_suporte}</a>
          </>
        )}
        {lojista.telefone_suporte && (
          <>
            <span className="h-1 w-1 rounded-full bg-[#CBD5E6]" />
            <span>{lojista.telefone_suporte}</span>
          </>
        )}
        {lojista.url_politica && (
          <>
            <span className="h-1 w-1 rounded-full bg-[#CBD5E6]" />
            <a href={lojista.url_politica}>Política de privacidade</a>
          </>
        )}
        <span className="h-1 w-1 rounded-full bg-[#CBD5E6]" />
        <span className="text-muted-2">Tecnologia Photoon</span>
      </div>
    </footer>
  );
}
