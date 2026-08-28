'use client';

import { useEffect, useState } from 'react';

/**
 * `true` em tela de celular.
 *
 * Começa em `false` para o servidor e o primeiro render coincidirem; o valor
 * real chega logo após montar. É o suficiente porque o editor só aparece
 * depois de carregar o projeto.
 */
export function useTelaPequena(limite = 860) {
  const [pequena, setPequena] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${limite}px)`);
    const aplicar = () => setPequena(mq.matches);
    aplicar();
    mq.addEventListener('change', aplicar);
    return () => mq.removeEventListener('change', aplicar);
  }, [limite]);

  return pequena;
}
