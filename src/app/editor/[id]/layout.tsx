/**
 * O editor tem rota propria (/editor/<id>), historico proprio e URL
 * compartilhavel - nao e um modal empilhado sobre a tela de detalhe.
 * Ocupa a tela inteira e nao usa o cabecalho da loja.
 */
export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex h-screen flex-col overflow-hidden bg-[#E8EDF5]">{children}</div>;
}
