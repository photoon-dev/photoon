import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { slugFromHost, TENANT_HEADER } from '@/lib/tenant';

/** Rotas que exigem um cliente final autenticado. */
const PROTECTED = ['/meus-projetos', '/projetos', '/editor'];
/** Rotas publicas dentro do subdominio do lojista. */
const PUBLIC_TENANT = ['/entrar', '/auth'];

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get('host');
  const slug = slugFromHost(host) || process.env.DEFAULT_TENANT_SLUG || null;

  // --- Dominio raiz (photoon.com.br): nao serve as telas do cliente final ---
  if (!slug) {
    if (PROTECTED.some((p) => pathname.startsWith(p)) || pathname.startsWith('/entrar')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // --- Subdominio do lojista ---
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(TENANT_HEADER, slug);

  const base = NextResponse.next({ request: { headers: requestHeaders } });
  const { response, user } = await updateSession(request, base);

  const isProtected = PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/'));
  const isPublic = PUBLIC_TENANT.some((p) => pathname === p || pathname.startsWith(p + '/'));

  if (isProtected && !user) {
    const login = request.nextUrl.clone();
    login.pathname = '/entrar';
    // preserva o destino para voltar depois do login
    login.search = `?next=${encodeURIComponent(pathname + search)}`;
    const redirect = NextResponse.redirect(login);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }

  if (isPublic && user && pathname === '/entrar') {
    const home = request.nextUrl.clone();
    home.pathname = '/meus-projetos';
    home.search = '';
    const redirect = NextResponse.redirect(home);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }

  // "/" no subdominio do lojista leva o cliente final para o login
  if (pathname === '/') {
    const target = request.nextUrl.clone();
    target.pathname = user ? '/meus-projetos' : '/entrar';
    const redirect = NextResponse.redirect(target);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }

  return response;
}

export const config = {
  matcher: [
    // tudo, menos estaticos e arquivos com extensao
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)',
  ],
};
