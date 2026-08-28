'use client';

import { useMemo, useState } from 'react';
import type { Foto } from '@/lib/data';
import type { PrecoModelo } from '@/lib/preco';
import type { Lamina } from '@/lib/album';
import EditorDesign, { CSS_PSEUDO } from '@/components/design/EditorDesign';
import { useEditorDesign } from '@/components/editor/useEditorDesign';

/**
 * Cola o markup transliterado do design (EditorDesign) com a lógica portada
 * (useEditorDesign) e os dados reais do projeto.
 */
export default function EditorCliente({
  projetoId,
  titulo: tituloInicial,
  fotos,
  modelo,
  paginas,
}: {
  projetoId: string;
  titulo: string;
  fotos: Foto[];
  modelo: PrecoModelo | null;
  paginas: Lamina[];
}) {
  const [titulo, setTitulo] = useState(tituloInicial);

  // Fotos distintas realmente usadas nos quadros — é o que entra no preço.
  const fotosUsadas = useMemo(() => {
    const usadas = new Set<string>();
    for (const l of paginas ?? []) {
      for (const q of l.quadros ?? []) {
        if (q.tipo === 'foto' && q.fotoId) usadas.add(q.fotoId);
      }
    }
    return usadas.size;
  }, [paginas]);

  const v = useEditorDesign({
    fotos,
    titulo,
    onTitulo: setTitulo,
    modelo,
    laminas: paginas?.length ?? 0,
    fotosUsadas,
    rotas: {
      hrefProjetos: '/meus-projetos',
      // Prévia e Revisão ainda não têm tela própria; por ora levam ao detalhe,
      // que é onde o cliente vê pendências e o estado do álbum.
      hrefPreview: `/projetos/${projetoId}`,
      hrefRevisao: `/projetos/${projetoId}`,
    },
  });

  return (
    <div className="om-editor">
      <style dangerouslySetInnerHTML={{ __html: CSS_PSEUDO }} />
      <EditorDesign v={v} />
    </div>
  );
}
