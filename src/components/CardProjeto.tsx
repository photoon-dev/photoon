import Link from 'next/link';
import type { Projeto } from '@/lib/data';

const ROTULO: Record<Projeto['status'], string> = {
  rascunho: 'Rascunho',
  em_edicao: 'Em edição',
  enviado: 'Enviado',
  em_producao: 'Em produção',
  concluido: 'Concluído',
};

export default function CardProjeto({ projeto }: { projeto: Projeto }) {
  return (
    <Link
      href={`/projetos/${projeto.id}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-surface transition hover:shadow-md"
    >
      <div className="aspect-[4/3] w-full bg-bg">
        {projeto.capa_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={projeto.capa_url}
            alt=""
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        )}
      </div>
      <div className="space-y-1 p-4">
        <h3 className="truncate font-medium">{projeto.titulo}</h3>
        <p className="text-sm text-muted">
          {ROTULO[projeto.status]} · {projeto.total_paginas}{' '}
          {projeto.total_paginas === 1 ? 'página' : 'páginas'}
        </p>
      </div>
    </Link>
  );
}
