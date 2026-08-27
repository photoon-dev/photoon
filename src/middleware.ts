import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { slugFromHost, TENANT_HEADER } from '@/lib/tenant';

/** Rotas que exigem um cliente final autenticado. */
const PROTECTED = ['/meus-projetos', '/projetos', '/editor'];
/** Rotas publicas dentro do subdominio do lojista. */
const PUBLIC_TENANT = ['/entrar', '/auth'];

/**
 * Monta uma URL de redirecionamento preservando o subdominio do lojista.
 *
 * `request.nextUrl` normaliza o host e devolveria photoon.com.br, o que jogaria
 * o cliente de joao.photoon.com.br para fora da loja dele. Atras do Caddy o
 * protocolo tambem precisa vir do X-Forwarded-Proto, senao o redirect vira http.
 */
function urlDaLoja(request: NextRequest, pathname: string, search = ''): URL {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = search;

  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (host) {
    // Atribuir `url.host` mantém a porta anterior quando o valor novo não tem
    // uma, e a porta interna (3000) vazaria no Location atrás do Caddy.
    const [hostname, porta] = host.split(':');
    url.hostname = hostname;
    url.port = porta ?? '';
  }

  const proto = request.headers.get('x-forwarded-proto');
  if (proto) url.protocol = `${proto.split(',')[0].trim()}:`;

  return url;
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get('host');
  const slug = slugFromHost(host) || process.env.DEFAULT_TENANT_SLUG || null;

  // --- Dominio raiz (photoon.com.br): nao serve as telas do cliente final ---
  if (!slug) {
    if (PROTECTED.some((p) => pathname.startsWith(p)) || pathname.startsWith('/entrar')) {
      return NextResponse.redirect(urlDaLoja(request, '/'));
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
    // preserva o destino para voltar depois do login
    const login = urlDaLoja(request, '/entrar', `?next=${encodeURIComponent(pathname + search)}`);
    const redirect = NextResponse.redirect(login);
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }

  if (isPublic && user && pathname === '/entrar') {
    const redirect = NextResponse.redirect(urlDaLoja(request, '/meus-projetos'));
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  }

  // "/" no subdominio do lojista leva o cliente final para o login
  if (pathname === '/') {
    const redirect = NextResponse.redirect(urlDaLoja(request, user ? '/meus-projetos' : '/entrar'));
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
