import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

// Plus Jakarta Sans em toda a interface (Design System, secao 03).
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'Photoon',
  description: 'Suas fotos já estão aqui. Vamos montar o álbum?',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={jakarta.variable}>
      <body className={`${jakarta.className} min-h-screen bg-page text-ink antialiased`}>
        {children}
      </body>
    </html>
  );
}
