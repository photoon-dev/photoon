import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { urlPublica } from '@/lib/url-publica';

/** Troca o code do magic link / confirmacao de e-mail por uma sessao. */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  // `next` vem da URL: aceitar caminho absoluto deixaria o link de e-mail
  // levar para outro site — o clássico redirecionamento aberto. Só caminho
  // interno, e nunca `//host`, que o navegador lê como endereço externo.
  const bruto = searchParams.get('next') ?? '/meus-projetos';
  const next = bruto.startsWith('/') && !bruto.startsWith('//') ? bruto : '/meus-projetos';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    // `origin` de `request.url` é o endereço interno do contêiner atrás do
    // Caddy: o link de e-mail cairia em 0.0.0.0:3000 e, pior num sistema
    // multi-inquilino, perderia o subdomínio da loja.
    if (!error) return NextResponse.redirect(urlPublica(request, next));
  }

  return NextResponse.redirect(urlPublica(request, '/entrar?erro=link_invalido'));
}
