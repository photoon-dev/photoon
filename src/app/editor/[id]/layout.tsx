import './editor.css';

/**
 * O editor tem rota própria (/editor/<id>), histórico próprio e URL
 * compartilhável — não é um modal empilhado sobre a tela de detalhe.
 * Ocupa a tela inteira e não usa o cabeçalho da loja.
 */
export default function EditorLayout({ children }: { children: React.ReactNode }) {
  return <div className="h-screen overflow-hidden bg-[#EEF3F9]">{children}</div>;
}
