'use client';

import type { Cliente, Notificacao, Projeto } from '@/lib/data';
import MeusProjetosDesign, { CSS_PSEUDO } from '@/components/design/MeusProjetosDesign';
import { useMeusProjetosDesign } from '@/components/cliente/useMeusProjetosDesign';
import MenuCliente from '@/components/cliente/MenuCliente';

/** Cola o markup transliterado do design com a lógica portada e os dados reais. */
export default function MeusProjetosCliente({
  projetos,
  notificacoes,
  totalFotos,
  capas,
  eventos,
  cliente,
  nomeLoja,
  enderecoLoja,
  emailLoja,
  telefoneLoja,
  nomeGaleria,
  galeriaAtualizada,
}: {
  projetos: Projeto[];
  notificacoes: Notificacao[];
  totalFotos: number;
  capas: string[];
  /** Quantas galerias (eventos) a loja liberou para este cliente. */
  eventos: number;
  cliente: Cliente;
  nomeLoja: string;
  enderecoLoja: string;
  emailLoja: string;
  telefoneLoja: string;
  nomeGaleria: string;
  galeriaAtualizada: string;
}) {
  const v = useMeusProjetosDesign({
    projetos,
    notificacoes,
    totalFotos,
    capas,
    eventos,
    cliente,
    nomeLoja,
    enderecoLoja,
    emailLoja,
    telefoneLoja,
    nomeGaleria,
    galeriaAtualizada,
  });

  return (
    <div className="om-cliente">
      <style dangerouslySetInnerHTML={{ __html: CSS_PSEUDO }} />
      <MeusProjetosDesign v={v} />
      <MenuCliente />
    </div>
  );
}
