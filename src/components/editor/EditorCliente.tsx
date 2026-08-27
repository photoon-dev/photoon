'use client';

import type { Foto } from '@/lib/data';
import EditorDesign, { CSS_PSEUDO } from '@/components/design/EditorDesign';
import { useEditorDesign } from '@/components/editor/useEditorDesign';

/**
 * Cola o markup transliterado do design (EditorDesign) com a lógica portada
 * (useEditorDesign) e os dados reais do projeto.
 */
export default function EditorCliente({
  projetoId,
  titulo,
  fotos,
}: {
  projetoId: string;
  titulo: string;
  fotos: Foto[];
}) {
  const v = useEditorDesign({
    fotos,
    titulo,
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
