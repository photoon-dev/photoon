import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { classificarHost, TENANT_HEADER } from '@/lib/tenant';

/** Rotas da loja que exigem um cliente final autenticado. */
const PROTEGIDAS_LOJA = ['/meus-projetos', '/projetos', '/editor'];
/** Rotas públicas dentro do subdomínio da loja. */
const PUBLICAS_LOJA = ['/entrar', '/auth'];
/** Rotas públicas do painel do lojista (app.photoon.com.br). */
const PUBLICAS_APP = ['/entrar', '/auth'];

/**
 * Monta uma URL de redirecionamento preservando o host de origem.
 *
 * `request.nextUrl` normaliza o host e devolveria photoon.com.br, o que jogaria
 * o cliente de joao.photoon.com.br para fora da loja dele. Atrás do Caddy o
 * protocolo também precisa vir do X-Forwarded-Proto, senão o redirect vira http.
 */
function urlDoHost(request: NextRequest, pathname: string, search = ''): URL {
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

const casa = (pathname: string, rotas: string[]) =>
  rotas.some((p) => pathname === p || pathname.startsWith(p + '/'));

/** Copia os cookies de sessão atualizados para a resposta de redirect. */
function comSessao(redirect: NextResponse, resposta: NextResponse): NextResponse {
  resposta.cookies.getAll().forEach((c) => redirect.cookies.set(c));
  return redirect;
}

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get('host');

  let alvo = classificarHost(host);
  // Fallback para acesso por IP cru / preview, quando configurado.
  if (alvo.tipo === 'raiz' && process.env.DEFAULT_TENANT_SLUG) {
    alvo = { tipo: 'loja', slug: process.env.DEFAULT_TENANT_SLUG };
  }

  // -------------------------------------------------------------------------
  // admin.photoon.com.br — painel do super admin, ainda não construído.
  // -------------------------------------------------------------------------
  if (alvo.tipo === 'admin') {
    return new NextResponse('Painel do super admin ainda não disponível.', {
      status: 503,
      headers: { 'content-type': 'text/plain; charset=utf-8' },
    });
  }

  // -------------------------------------------------------------------------
  // app.photoon.com.br — painel do lojista.
  //
  // As telas vivem em src/app/app/**, e o caminho é reescrito internamente:
  // o visitante vê app.photoon.com.br/entrar, o Next resolve /app/entrar.
  // Isso evita colidir com o /entrar do cliente final, que é outra tela.
  // -------------------------------------------------------------------------
  if (alvo.tipo === 'app') {
    const base = NextResponse.next();
    const { response, user } = await updateSession(request, base);

    const publica = casa(pathname, PUBLICAS_APP);

    if (!publica && !user) {
      return comSessao(
        NextResponse.redirect(
          urlDoHost(request, '/entrar', `?next=${encodeURIComponent(pathname + search)}`),
        ),
        response,
      );
    }
    if (pathname === '/entrar' && user) {
      return comSessao(NextResponse.redirect(urlDoHost(request, '/')), response);
    }

    // /auth/* é compartilhado com a loja; não reescreve.
    if (pathname.startsWith('/auth')) return response;

    const destino = request.nextUrl.clone();
    destino.pathname = `/app${pathname === '/' ? '' : pathname}`;
    return comSessao(NextResponse.rewrite(destino), response);
  }

  // -------------------------------------------------------------------------
  // photoon.com.br — domínio raiz, não serve painel nenhum.
  // -------------------------------------------------------------------------
  if (alvo.tipo === 'raiz') {
    if (casa(pathname, PROTEGIDAS_LOJA) || pathname.startsWith('/entrar')) {
      return NextResponse.redirect(urlDoHost(request, '/'));
    }
    return NextResponse.next();
  }

  // -------------------------------------------------------------------------
  // <loja>.photoon.com.br — área do cliente final.
  // -------------------------------------------------------------------------
  const cabecalhos = new Headers(request.headers);
  cabecalhos.set(TENANT_HEADER, alvo.slug);

  const base = NextResponse.next({ request: { headers: cabecalhos } });
  const { response, user } = await updateSession(request, base);

  if (casa(pathname, PROTEGIDAS_LOJA) && !user) {
    return comSessao(
      NextResponse.redirect(
        urlDoHost(request, '/entrar', `?next=${encodeURIComponent(pathname + search)}`),
      ),
      response,
    );
  }

  if (pathname === '/entrar' && user) {
    return comSessao(NextResponse.redirect(urlDoHost(request, '/meus-projetos')), response);
  }

  if (pathname === '/') {
    return comSessao(
      NextResponse.redirect(urlDoHost(request, user ? '/meus-projetos' : '/entrar')),
      response,
    );
  }

  return response;
}

export const config = {
  matcher: [
    // tudo, menos estáticos e arquivos com extensão
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)',
  ],
};
