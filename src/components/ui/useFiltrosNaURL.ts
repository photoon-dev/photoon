'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useTransition } from 'react';

/**
 * Filtros que moram na URL.
 *
 * Regra do briefing: "filtros devem persistir na URL quando possível". Não é
 * capricho — é o que faz o lojista guardar o link de "pedidos atrasados da
 * filial Centro", mandar por mensagem, e o botão de voltar do navegador
 * funcionar. Pedidos já fazia assim; isto generaliza para as outras telas.
 *
 * Trocar um filtro sempre volta para a primeira página: continuar na página 4
 * de um recorte que agora tem duas é como o resultado some sem explicação.
 *
 * `pendente` vem de `useTransition` e serve para acender o estado de
 * carregando da tabela enquanto o servidor devolve o novo recorte.
 */
export function useFiltrosNaURL({ chavePagina = 'pagina' }: { chavePagina?: string } = {}) {
  const router = useRouter();
  const caminho = usePathname();
  const busca = useSearchParams();
  const [pendente, iniciar] = useTransition();

  const aplicar = useCallback(
    (mudancas: Record<string, string | number | null | undefined>, { manterPagina = false } = {}) => {
      const p = new URLSearchParams(busca.toString());
      for (const [chave, valor] of Object.entries(mudancas)) {
        if (valor === null || valor === undefined || valor === '') p.delete(chave);
        else p.set(chave, String(valor));
      }
      if (!manterPagina) p.delete(chavePagina);
      const s = p.toString();
      iniciar(() => router.push(s ? `${caminho}?${s}` : caminho));
    },
    [busca, caminho, chavePagina, router],
  );

  /** Alterna a ordenação de uma coluna: asc -> desc -> sem ordenação. */
  const ordenarPor = useCallback(
    (chave: string) => {
      const atual = busca.get('ordem');
      const proximo = atual === chave ? `-${chave}` : atual === `-${chave}` ? null : chave;
      aplicar({ ordem: proximo });
    },
    [aplicar, busca],
  );

  const ordem = (() => {
    const bruto = busca.get('ordem');
    if (!bruto) return undefined;
    return bruto.startsWith('-') ? { por: bruto.slice(1), desc: true } : { por: bruto, desc: false };
  })();

  return {
    valor: (chave: string) => busca.get(chave) ?? '',
    aplicar,
    limpar: () => iniciar(() => router.push(caminho)),
    ordem,
    ordenarPor,
    pendente,
    /** Algum filtro ativo? Decide entre "não há nada" e "nada neste recorte". */
    filtrado: Array.from(busca.keys()).some((k) => k !== chavePagina),
  };
}
