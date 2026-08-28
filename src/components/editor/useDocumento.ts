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
  novoQuadroFoto,
  type Ajustes,
  type Enq,
  type Lamina,
  type Pagina,
  type Quadro,
  type QuadroFoto,
} from '@/lib/album';
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

  /* ------------------------------ histórico ------------------------------ */
  const passado = useRef<Lamina[][]>([]);
  const futuro = useRef<Lamina[][]>([]);
  /** Marcado quando a alteração veio de desfazer/refazer, para não empilhar. */
  const semHistorico = useRef(false);

  const aplicar = useCallback((fn: (l: Lamina[]) => Lamina[]) => {
    definirLaminas((antes) => {
      const depois = fn(antes);
      if (depois === antes) return antes;
      if (!semHistorico.current) {
        passado.current = [...passado.current, antes].slice(-LIMITE_HISTORICO);
        futuro.current = [];
      }
      semHistorico.current = false;
      return depois;
    });
  }, []);

  const desfazer = useCallback(() => {
    const anterior = passado.current.at(-1);
    if (!anterior) return;
    passado.current = passado.current.slice(0, -1);
    definirLaminas((agora) => {
      futuro.current = [...futuro.current, agora];
      return anterior;
    });
  }, []);

  const refazer = useCallback(() => {
    const proximo = futuro.current.at(-1);
    if (!proximo) return;
    futuro.current = futuro.current.slice(0, -1);
    definirLaminas((agora) => {
      passado.current = [...passado.current, agora];
      return proximo;
    });
  }, []);

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
      aplicar((ls) => ls.map((l, k) => (k === i ? fn(l) : l))),
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

  /** Ajusta o enquadramento do quadro selecionado. */
  const mudarEnq = useCallback(
    (mudanca: Partial<Enq>) => {
      if (!selecao) return;
      mudarQuadro(selecao, (q) => ({ enq: { ...q.enq, ...mudanca } }));
    },
    [selecao, mudarQuadro],
  );

  /** Ajusta a cor do quadro selecionado. */
  const mudarAjustes = useCallback(
    (mudanca: Partial<Ajustes>) => {
      if (!selecao) return;
      mudarQuadro(selecao, (q) => ({ ajustes: { ...q.ajustes, ...mudanca } }));
    },
    [selecao, mudarQuadro],
  );

  /** Coloca uma foto no quadro; sem alvo, no primeiro quadro vazio da lâmina. */
  const definirFoto = useCallback(
    (fotoId: string, alvo: Selecao = selecao) => {
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
    [selecao, atual, mudarQuadro, mudarLamina],
  );

  /** Tira a foto do quadro, mantendo o quadro. */
  const limparQuadro = useCallback(() => {
    if (!selecao) return;
    mudarQuadro(selecao, () => ({ fotoId: null }));
  }, [selecao, mudarQuadro]);

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

  const adicionarLamina = useCallback(() => {
    aplicar((ls) => {
      const nova = [...ls];
      nova.splice(atual + 1, 0, novaLamina(ls[atual]?.esquerda.layoutId ?? LAYOUT_PADRAO));
      return nova;
    });
    setAtual((i) => i + 1);
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

  const quadroSelecionado = useMemo((): QuadroFoto | null => {
    if (!selecao) return null;
    const l = laminas[selecao.lamina];
    const q = l?.[selecao.lado].quadros.find((x) => x.id === selecao.quadro);
    return q && q.tipo === 'foto' ? q : null;
  }, [selecao, laminas]);

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
    quadroSelecionado,
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
    trocarLayout,
    mudarFundo,
    adicionarLamina,
    removerLamina,
    desfazer,
    refazer,
    podeDesfazer: passado.current.length > 0,
    podeRefazer: futuro.current.length > 0,
  };
}
