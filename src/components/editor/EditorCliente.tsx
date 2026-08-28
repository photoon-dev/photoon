'use client';

import { useState } from 'react';
import type { Foto, PessoaDaGaleria, RostoDaFoto } from '@/lib/data';
import type { PrecoModelo } from '@/lib/preco';
import { useDocumento } from '@/components/editor/useDocumento';
import EditorDesign, { CSS_PSEUDO } from '@/components/design/EditorDesign';
import EditorMobile from '@/components/editor/EditorMobile';
import { useEditorDesign } from '@/components/editor/useEditorDesign';
import { useTelaPequena } from '@/components/editor/useTelaPequena';

/**
 * Cola o markup transliterado do design (EditorDesign) com a lógica portada
 * (useEditorDesign) e os dados reais do projeto.
 */
export default function EditorCliente({
  projetoId,
  titulo: tituloInicial,
  fotos,
  rostos,
  pessoas,
  modelo,
  paginas,
}: {
  projetoId: string;
  titulo: string;
  fotos: Foto[];
  /** Rostos detectados no envio (Fase 5). Vazio quando a galeria é antiga. */
  rostos?: RostoDaFoto[];
  pessoas?: PessoaDaGaleria[];
  modelo: PrecoModelo | null;
  paginas: unknown;
}) {
  const [titulo, setTitulo] = useState(tituloInicial);

  // O documento do álbum: estado real, desfazer e gravação automática. Antes
  // não existia — o editor desenhava fotos que não estavam em lugar nenhum.
  const doc = useDocumento({ projetoId, paginas });

  const v = useEditorDesign({
    fotos,
    rostos: rostos ?? [],
    pessoas: pessoas ?? [],
    titulo,
    doc,
    bloqueadores: doc.bloqueadores,
    onTitulo: setTitulo,
    modelo,
    laminas: doc.laminas.length,
    fotosUsadas: doc.usadas.size,
    rotas: {
      hrefProjetos: '/meus-projetos',
      // Prévia e Revisão ainda não têm tela própria; por ora levam ao detalhe,
      // que é onde o cliente vê pendências e o estado do álbum.
      hrefPreview: `/projetos/${projetoId}`,
      hrefRevisao: `/projetos/${projetoId}`,
    },
  });

  // Layouts distintos, mesma lógica. Espremer o de desktop empurra o canvas
  // para fora da tela; renderizar os dois duplicaria o DOM do editor.
  const pequena = useTelaPequena();

  return (
    <div className="om-editor h-full">
      <style dangerouslySetInnerHTML={{ __html: CSS_PSEUDO }} />
      {pequena ? <EditorMobile v={v} projetoId={projetoId} /> : <EditorDesign v={v} />}
    </div>
  );
}
