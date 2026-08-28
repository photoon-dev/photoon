'use client';

import type { Notificacao, Projeto } from '@/lib/data';
import MeusProjetosDesign, { CSS_PSEUDO } from '@/components/design/MeusProjetosDesign';
import { useMeusProjetosDesign } from '@/components/cliente/useMeusProjetosDesign';

/** Cola o markup transliterado do design com a lógica portada e os dados reais. */
export default function MeusProjetosCliente({
  projetos,
  notificacoes,
  totalFotos,
  capas,
  eventos,
}: {
  projetos: Projeto[];
  notificacoes: Notificacao[];
  totalFotos: number;
  capas: string[];
  /** Quantas galerias (eventos) a loja liberou para este cliente. */
  eventos: number;
}) {
  const v = useMeusProjetosDesign({ projetos, notificacoes, totalFotos, capas, eventos });

  return (
    <div className="om-cliente">
      <style dangerouslySetInnerHTML={{ __html: CSS_PSEUDO }} />
      <MeusProjetosDesign v={v} />
    </div>
  );
}
