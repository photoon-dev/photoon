import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Photoon',
  description: 'Crie e edite seus álbuns de fotos.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
