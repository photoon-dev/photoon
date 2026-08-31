'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import Abas, { type Aba } from '@/components/ui/Abas';

/**
 * Abas do detalhe do pedido.
 *
 * A aba ativa vive na URL (`?aba=projetos`), não em estado local — o link de
 * "olha a aba de projetos do pedido 1042" abre exatamente onde deveria, e o
 * botão Voltar do navegador funciona. É a mesma decisão dos filtros em todo
 * o painel.
 *
 * Trocar de aba nunca volta à primeira página: aqui nem há paginação, então
 * a regra do `useFiltrosNaURL` sobre "resetar a página" não se aplica.
 */

export const ABAS_PEDIDO: Aba[] = [
  { chave: 'resumo',    rotulo: 'Resumo' },
  { chave: 'projetos',  rotulo: 'Projetos' },
  { chave: 'pagamento', rotulo: 'Pagamento' },
  { chave: 'producao',  rotulo: 'Produção' },
  { chave: 'entrega',   rotulo: 'Entrega' },
  { chave: 'arquivos',  rotulo: 'Arquivos' },
  { chave: 'historico', rotulo: 'Histórico' },
];

export default function AbasPedido({ ativa }: { ativa: string }) {
  const router = useRouter();
  const caminho = usePathname();
  const busca = useSearchParams();
  const [, iniciar] = useTransition();

  const ir = (chave: string) => {
    const p = new URLSearchParams(busca.toString());
    if (chave === 'resumo') p.delete('aba');
    else p.set('aba', chave);
    const s = p.toString();
    iniciar(() => router.push(s ? `${caminho}?${s}` : caminho));
  };

  return (
    <Abas
      abas={ABAS_PEDIDO}
      ativa={ativa}
      aoTrocar={ir}
    />
  );
}
