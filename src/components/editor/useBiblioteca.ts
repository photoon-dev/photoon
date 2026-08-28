'use client';

import { useEffect, useState } from 'react';

/**
 * Biblioteca de elementos, carregada sob demanda.
 *
 * São 1.326 peças e ~3,6 MB no total: baixar tudo de uma vez atrasaria a
 * abertura do editor por um painel que o cliente talvez nem abra. O índice é
 * pequeno e vem junto; cada categoria só desce quando é aberta, e fica em
 * memória depois disso.
 */

export type PecaBiblioteca = { id: string; nome: string; corpo: string; w: number; h: number };
export type CategoriaBiblioteca = { id: string; rotulo: string; total: number };

const cache = new Map<string, PecaBiblioteca[]>();

export function useBiblioteca(categoriaAberta: string | null) {
  const [categorias, setCategorias] = useState<CategoriaBiblioteca[]>([]);
  const [pecas, setPecas] = useState<PecaBiblioteca[]>([]);
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    let vivo = true;
    fetch('/elementos/indice.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => vivo && d && setCategorias(d.categorias ?? []))
      // Sem biblioteca o painel mostra só as formas de traço: é degradação, não
      // erro — o editor continua utilizável.
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, []);

  useEffect(() => {
    if (!categoriaAberta) {
      setPecas([]);
      return;
    }
    const guardado = cache.get(categoriaAberta);
    if (guardado) {
      setPecas(guardado);
      return;
    }
    let vivo = true;
    setCarregando(true);
    fetch(`/elementos/${categoriaAberta}.json`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!vivo || !d) return;
        cache.set(categoriaAberta, d.itens ?? []);
        setPecas(d.itens ?? []);
      })
      .catch(() => {})
      .finally(() => vivo && setCarregando(false));
    return () => {
      vivo = false;
    };
  }, [categoriaAberta]);

  return { categorias, pecas, carregando };
}

/** SVG completo da peça, para virar imagem no quadro. */
export function svgDaPeca(p: PecaBiblioteca): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${p.w} ${p.h}">${p.corpo}</svg>`;
}
