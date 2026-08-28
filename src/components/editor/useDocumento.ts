'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { salvarLaminas } from '@/app/actions';
import {
  aplicarLayout,
  calcularProgresso,
  fotosUsadas as fotosDoAlbum,
  laminasSemFoto,
  migrarLaminas,
  novaLamina,
  novoQuadroElemento,
  novoQuadroFoto,
  type Ajustes,
  type Enq,
  type Lamina,
  type Pagina,
  type Quadro,
  type QuadroElemento,
  type QuadroFoto,
} from '@/lib/album';
import type { Ret } from '@/lib/layouts';
import { LAYOUT_PADRAO, layout } from '@/lib/layouts';

/**
 * Camada de documento do editor.
 *
 * O editor não guardava nada: as fotos vinham de `fotos[n % fotos.length]` e a
 * sequência de layouts era uma constante no estado inicial. O cliente podia
 * passar uma hora montando o álbum e perder tudo ao fechar a aba — no banco,
 * `laminas = 0`. Aqui mora o documento de verdade, com desfazer e gravação
 * automática; `useEditorDesign` volta a ser só estado de interface.
 */

const ATRASO_AUTOSAVE = 1200;
const LIMITE_HISTORICO = 60;

export type Lado = 'esquerda' | 'direita';
export type Selecao = { lamina: number; lado: Lado; quadro: string } | null;
export type EstadoSalvamento = 'salvo' | 'salvando' | 'erro';

export type Documento = ReturnType<typeof useDocumento>;

export function useDocumento({ projetoId, paginas }: { projetoId: string; paginas: unknown }) {
  const [laminas, definirLaminas] = useState<Lamina[]>(() => {
    const migradas = migrarLaminas(paginas);
    return migradas.length ? migradas : [novaLamina(LAYOUT_PADRAO)];
  });

  const [atual, setAtual] = useState(0);
  const [selecao, setSelecao] = useState<Selecao>(null);
  const [estado, setEstado] = useState<EstadoSalvamento>('salvo');

  /* ------------------------------ histórico ------------------------------
     O histórico vivia em refs mutados DENTRO do updater de `definirLaminas`.
     Updater precisa ser puro, e com `reactStrictMode` o React o invoca duas
     vezes em dev. Pior: `podeDesfazer` lia `passado.current.length` durante o
     render, e ref não provoca re-render — o botão Desfazer mentia.

     Agora `aplicar` calcula tudo fora do updater, a partir de `laminasRef`
     (mantido em dia na hora), e o tamanho das pilhas é ESTADO de verdade.
     ------------------------------------------------------------------------ */
  const passado = useRef<Lamina[][]>([]);
  const futuro = useRef<Lamina[][]>([]);
  /** Marcado quando a alteração veio de desfazer/refazer, para não empilhar. */
  const semHistorico = useRef(false);
  const laminasRef = useRef(laminas);
  laminasRef.current = laminas;

  // Espelho das pilhas, para os botões saberem que mudaram.
  const [tamanhos, setTamanhos] = useState({ passado: 0, futuro: 0 });
  const sincronizar = useCallback(
    () => setTamanhos({ passado: passado.current.length, futuro: futuro.current.length }),
    [],
  );

  /**
   * Gesto contínuo (arrastar uma alça, varrer um slider, escolher cor).
   *
   * `iniciarGesto` NÃO empilha: só guarda a base e marca o gesto. O ponto de
   * histórico nasce na primeira alteração de verdade. Sem isso, um
   * `pointerdown` seco no slider empilhava uma cópia idêntica do estado, e o
   * Ctrl+Z seguinte não fazia nada visível — o usuário via o desfazer ser
   * engolido.
   */
  const gesto = useRef(false);
  const baseGesto = useRef<Lamina[] | null>(null);
  const gestoEmpilhado = useRef(false);

  const aplicar = useCallback(
    (fn: (l: Lamina[]) => Lamina[]) => {
      const antes = laminasRef.current;
      const depois = fn(antes);
      if (depois === antes) return;

      if (semHistorico.current) {
        semHistorico.current = false;
      } else if (gesto.current) {
        if (!gestoEmpilhado.current) {
          passado.current = [...passado.current, baseGesto.current ?? antes].slice(-LIMITE_HISTORICO);
          futuro.current = [];
          gestoEmpilhado.current = true;
        }
      } else {
        passado.current = [...passado.current, antes].slice(-LIMITE_HISTORICO);
        futuro.current = [];
      }

      laminasRef.current = depois;
      definirLaminas(depois);
      sincronizar();
    },
    [sincronizar],
  );

  const iniciarGesto = useCallback(() => {
    if (gesto.current) return;
    gesto.current = true;
    gestoEmpilhado.current = false;
    baseGesto.current = laminasRef.current;
  }, []);

  const fimGesto = useCallback(() => {
    gesto.current = false;
    gestoEmpilhado.current = false;
    baseGesto.current = null;
  }, []);

  const desfazer = useCallback(() => {
    // Um Ctrl+Z no meio de um gesto fecha o gesto primeiro: senão o passo que
    // ele acabou de criar continuaria aberto e a próxima alteração entraria
    // nele, em cima de um estado já desfeito.
    gesto.current = false;
    gestoEmpilhado.current = false;
    baseGesto.current = null;

    const anterior = passado.current.at(-1);
    if (!anterior) return;
    passado.current = passado.current.slice(0, -1);
    futuro.current = [...futuro.current, laminasRef.current];
    laminasRef.current = anterior;
    definirLaminas(anterior);
    sincronizar();
  }, [sincronizar]);

  const refazer = useCallback(() => {
    const proximo = futuro.current.at(-1);
    if (!proximo) return;
    futuro.current = futuro.current.slice(0, -1);
    passado.current = [...passado.current, laminasRef.current];
    laminasRef.current = proximo;
    definirLaminas(proximo);
    sincronizar();
  }, [sincronizar]);

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey) || e.key.toLowerCase() !== 'z') return;
      const alvo = e.target as HTMLElement | null;
      // Dentro de um campo, Ctrl+Z é do campo.
      if (alvo && /^(INPUT|TEXTAREA)$/.test(alvo.tagName)) return;
      e.preventDefault();
      (e.shiftKey ? refazer : desfazer)();
    };
    window.addEventListener('keydown', tecla);
    return () => window.removeEventListener('keydown', tecla);
  }, [desfazer, refazer]);

  /* ---------------------------- gravação ---------------------------- */
  const primeira = useRef(true);
  useEffect(() => {
    if (primeira.current) {
      primeira.current = false;
      return;
    }
    setEstado('salvando');
    const t = setTimeout(() => {
      salvarLaminas(projetoId, laminas)
        .then(() => setEstado('salvo'))
        .catch(() => setEstado('erro'));
    }, ATRASO_AUTOSAVE);
    return () => clearTimeout(t);
  }, [laminas, projetoId]);

  // Fechar a aba com alteração pendente perde até 1,2s de trabalho. O aviso do
  // navegador é o que dá ao cliente a chance de esperar a gravação terminar.
  useEffect(() => {
    if (estado === 'salvo') return;
    const sair = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', sair);
    return () => window.removeEventListener('beforeunload', sair);
  }, [estado]);

  /* ------------------------------ edição ------------------------------ */

  const mudarLamina = useCallback(
    (i: number, fn: (l: Lamina) => Lamina) =>
      aplicar((ls) => {
        const antes = ls[i];
        if (!antes) return ls;
        const depois = fn(antes);
        // `ls.map` devolvia array novo mesmo sem alteração nenhuma, então o
        // guarda de `aplicar` nunca disparava: clicar duas vezes em
        // "Preencher" criava dois passos de desfazer idênticos.
        if (depois === antes) return ls;
        const nova = ls.slice();
        nova[i] = depois;
        return nova;
      }),
    [aplicar],
  );

  const mudarQuadro = useCallback(
    (alvo: NonNullable<Selecao>, mudanca: (q: QuadroFoto) => Partial<QuadroFoto>) =>
      mudarLamina(alvo.lamina, (l) => ({
        ...l,
        [alvo.lado]: {
          ...l[alvo.lado],
          quadros: l[alvo.lado].quadros.map((q) =>
            q.id === alvo.quadro && q.tipo === 'foto' ? { ...q, ...mudanca(q) } : q,
          ),
        },
      })),
    [mudarLamina],
  );

  /**
   * A seleção só vale na lâmina que está na tela.
   *
   * Editar o que não se vê é sempre bug: o cliente mexe num controle, o palco
   * não muda, e o álbum muda. Este é o portão único — todo editor do inspetor
   * passa por aqui, então nenhum caminho novo consegue reabrir o buraco.
   */
  const selecaoAtiva = selecao && selecao.lamina === atual ? selecao : null;

  /**
   * Ajusta o enquadramento do quadro selecionado.
   *
   * Aceita uma função para quem precisa partir do valor CORRENTE — a roda do
   * mouse, por exemplo. Com valor fixo, dois eventos no mesmo quadro de
   * animação (trackpad, mouse de alta taxa) calculavam a partir do mesmo
   * enquadramento e o segundo sobrescrevia o primeiro: cliques perdidos.
   */
  const mudarEnq = useCallback(
    (mudanca: Partial<Enq> | ((e: Enq) => Partial<Enq>)) => {
      if (!selecaoAtiva) return;
      mudarQuadro(selecaoAtiva, (q) => ({
        enq: { ...q.enq, ...(typeof mudanca === 'function' ? mudanca(q.enq) : mudanca) },
      }));
    },
    [selecaoAtiva, mudarQuadro],
  );

  /** Ajusta a cor do quadro selecionado. */
  const mudarAjustes = useCallback(
    (mudanca: Partial<Ajustes>) => {
      if (!selecaoAtiva) return;
      mudarQuadro(selecaoAtiva, (q) => ({ ajustes: { ...q.ajustes, ...mudanca } }));
    },
    [selecaoAtiva, mudarQuadro],
  );

  /** Coloca uma foto no quadro; sem alvo, no primeiro quadro vazio da lâmina. */
  const definirFoto = useCallback(
    (fotoId: string, alvo: Selecao = selecaoAtiva) => {
      if (alvo) {
        mudarQuadro(alvo, () => ({ fotoId }));
        return;
      }
      mudarLamina(atual, (l) => {
        for (const lado of ['esquerda', 'direita'] as Lado[]) {
          const i = l[lado].quadros.findIndex((q) => q.tipo === 'foto' && !q.fotoId);
          if (i < 0) continue;
          const quadros = l[lado].quadros.slice();
          quadros[i] = { ...(quadros[i] as QuadroFoto), fotoId };
          return { ...l, [lado]: { ...l[lado], quadros } };
        }
        return l;
      });
    },
    [selecaoAtiva, atual, mudarQuadro, mudarLamina],
  );

  /** Tira a foto do quadro, mantendo o quadro. */
  const limparQuadro = useCallback(() => {
    if (!selecaoAtiva) return;
    mudarQuadro(selecaoAtiva, () => ({ fotoId: null }));
  }, [selecaoAtiva, mudarQuadro]);

  /* --------------------- quadros livres (texto, elemento) --------------- */

  /** Muda um quadro que NÃO é foto (tem retângulo próprio). */
  const mudarLivre = useCallback(
    (alvo: NonNullable<Selecao>, mudanca: (q: Quadro) => Partial<Quadro>) =>
      mudarLamina(alvo.lamina, (l) => ({
        ...l,
        [alvo.lado]: {
          ...l[alvo.lado],
          quadros: l[alvo.lado].quadros.map((q) =>
            q.id === alvo.quadro && q.tipo !== 'foto' ? ({ ...q, ...mudanca(q) } as Quadro) : q,
          ),
        },
      })),
    [mudarLamina],
  );

  /** Move/redimensiona o quadro livre selecionado. */
  const mudarRet = useCallback(
    (mudanca: Partial<Ret>) => {
      if (!selecaoAtiva) return;
      mudarLivre(selecaoAtiva, (q) =>
        q.tipo === 'foto' ? {} : ({ ret: { ...q.ret, ...mudanca } } as Partial<Quadro>),
      );
    },
    [selecaoAtiva, mudarLivre],
  );

  /** Cor/rotação/forma do elemento selecionado. */
  const mudarElemento = useCallback(
    (mudanca: Partial<Omit<QuadroElemento, 'id' | 'tipo'>>) => {
      if (!selecaoAtiva) return;
      mudarLivre(selecaoAtiva, (q) => (q.tipo === 'elemento' ? (mudanca as Partial<Quadro>) : {}));
    },
    [selecaoAtiva, mudarLivre],
  );

  /** Insere um elemento na página do lado selecionado (ou na esquerda). */
  const adicionarElemento = useCallback(
    (forma: string, cor?: string) => {
      const lado: Lado = selecao?.lado ?? 'esquerda';
      const novo = novoQuadroElemento(forma, cor);
      mudarLamina(atual, (l) => ({
        ...l,
        [lado]: { ...l[lado], quadros: [...l[lado].quadros, novo] },
      }));
      // Já nasce selecionado: o cliente vê o que inseriu e pode arrastar.
      setSelecao({ lamina: atual, lado, quadro: novo.id });
    },
    [atual, selecao, mudarLamina],
  );

  /** Apaga o quadro livre selecionado. Quadro de foto não some: esvazia. */
  const removerQuadro = useCallback(() => {
    const alvo = selecaoAtiva;
    if (!alvo) return;
    mudarLamina(alvo.lamina, (l) => ({
      ...l,
      [alvo.lado]: {
        ...l[alvo.lado],
        quadros: l[alvo.lado].quadros.filter(
          (q) => !(q.id === alvo.quadro && q.tipo !== 'foto'),
        ),
      },
    }));
    setSelecao(null);
  }, [selecaoAtiva, mudarLamina]);

  const trocarLayout = useCallback(
    (layoutId: string, lado: Lado | 'ambos' = selecao?.lado ?? 'ambos') => {
      mudarLamina(atual, (l) => {
        if (lado !== 'ambos') return aplicarLayout(l, lado, layoutId);
        return aplicarLayout(aplicarLayout(l, 'esquerda', layoutId), 'direita', layoutId);
      });
      // O quadro selecionado pode ter deixado de existir.
      setSelecao(null);
    },
    [atual, selecao, mudarLamina],
  );

  const mudarFundo = useCallback(
    (fundo: string) => mudarLamina(atual, (l) => ({ ...l, fundo })),
    [atual, mudarLamina],
  );

  /** O mesmo fundo em todas as lâminas — o "Todo o álbum" do painel. */
  const mudarFundoTudo = useCallback(
    (fundo: string) => aplicar((ls) => ls.map((l) => (l.fundo === fundo ? l : { ...l, fundo }))),
    [aplicar],
  );

  const adicionarLamina = useCallback(() => {
    aplicar((ls) => {
      const nova = [...ls];
      nova.splice(atual + 1, 0, novaLamina(ls[atual]?.esquerda.layoutId ?? LAYOUT_PADRAO));
      return nova;
    });
    setAtual((i) => i + 1);
    // Sem isto, a seleção continua apontando para a lâmina anterior: a caixa
    // some da tela (o id não existe na lâmina nova), mas o inspetor segue
    // dizendo "Foto selecionada" e a roda do mouse edita uma foto que o
    // cliente não está vendo — e grava.
    setSelecao(null);
  }, [aplicar, atual]);

  const removerLamina = useCallback(
    (i: number) => {
      aplicar((ls) => (ls.length <= 1 ? ls : ls.filter((_, k) => k !== i)));
      setAtual((a) => Math.max(0, Math.min(a, laminas.length - 2)));
      setSelecao(null);
    },
    [aplicar, laminas.length],
  );

  /* ------------------------------ derivados ------------------------------ */

  const lamina = laminas[Math.min(atual, laminas.length - 1)];

  /** O quadro selecionado, de qualquer tipo. */
  const quadroSel = useMemo((): Quadro | null => {
    if (!selecao || selecao.lamina !== atual) return null;
    const l = laminas[selecao.lamina];
    return l?.[selecao.lado].quadros.find((x) => x.id === selecao.quadro) ?? null;
  }, [selecao, laminas, atual]);

  /** Atalho para o caso mais comum: o quadro selecionado é uma foto. */
  const quadroSelecionado = quadroSel?.tipo === 'foto' ? quadroSel : null;
  const elementoSel = quadroSel?.tipo === 'elemento' ? quadroSel : null;

  const usadas = useMemo(() => fotosDoAlbum(laminas), [laminas]);
  const progresso = useMemo(() => calcularProgresso(laminas), [laminas]);
  const bloqueadores = useMemo(() => laminasSemFoto(laminas).length, [laminas]);

  /** Quadros da página com o retângulo do layout — o desenho é um só. */
  const quadrosDe = useCallback((pagina: Pagina) => {
    const rets = layout(pagina.layoutId).quadros;
    let i = 0;
    return pagina.quadros.map((q: Quadro) =>
      q.tipo === 'foto' ? { q, ret: rets[i++] ?? null } : { q, ret: q.ret },
    );
  }, []);

  return {
    laminas,
    lamina,
    atual,
    setAtual,
    selecao,
    setSelecao,
    quadroSel,
    quadroSelecionado,
    elementoSel,
    estado,
    progresso,
    bloqueadores,
    usadas,
    quadrosDe,
    // edição
    definirFoto,
    limparQuadro,
    mudarEnq,
    mudarAjustes,
    mudarRet,
    mudarElemento,
    adicionarElemento,
    removerQuadro,
    trocarLayout,
    mudarFundo,
    mudarFundoTudo,
    adicionarLamina,
    removerLamina,
    desfazer,
    refazer,
    iniciarGesto,
    fimGesto,
    podeDesfazer: tamanhos.passado > 0,
    podeRefazer: tamanhos.futuro > 0,
  };
}
