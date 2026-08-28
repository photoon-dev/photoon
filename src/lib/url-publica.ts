import type { NextRequest } from 'next/server';

/**
 * URL pública para redirecionar, a partir do endereço que o visitante usou.
 *
 * `request.url` atrás do Caddy é o endereço INTERNO do contêiner — sair do
 * sistema mandava todo mundo para `https://0.0.0.0:3000/entrar`, que não
 * existe. E num sistema multi-inquilino errar o host é pior que errar a porta:
 * o cliente de `joao.photoon.com.br` cairia no domínio raiz e perderia a loja.
 *
 * Mesma lógica de `urlDoHost` no middleware, aqui para as rotas.
 */
export function urlPublica(request: NextRequest, caminho: string): URL {
  const url = new URL(caminho, request.url);

  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (host) {
    // Atribuir `url.host` mantém a porta anterior quando o valor novo não tem
    // uma, e a porta interna vazaria no Location.
    const [hostname, porta] = host.split(':');
    url.hostname = hostname;
    url.port = porta ?? '';
  }

  const proto = request.headers.get('x-forwarded-proto');
  if (proto) url.protocol = `${proto.split(',')[0].trim()}:`;

  return url;
}
