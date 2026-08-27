/**
 * O editor ocupa a tela inteira e nao usa o cabecalho do site.
 * Layout proprio para que /projetos/<id>/editor seja uma rota independente,
 * e nao um modal empilhado sobre a tela de detalhe.
 */
export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex h-screen flex-col overflow-hidden">{children}</div>;
}
