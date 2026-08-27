import { headers } from 'next/headers';

export const TENANT_HEADER = 'x-photoon-tenant';

export const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? 'photoon.com.br';
export const PROTOCOL = process.env.NEXT_PUBLIC_PROTOCOL ?? 'https';

/**
 * Extrai o slug do lojista a partir do Host.
 *   joaofotografia.photoon.com.br -> "joaofotografia"
 *   photoon.com.br               -> null (dominio raiz)
 *   lojista.localhost:3000       -> "lojista"
 *
 * Subdominios reservados nunca viram tenant.
 */
const RESERVED = new Set(['www', 'app', 'admin', 'api', 'static', 'assets', 'cdn', 'mail']);

export function slugFromHost(host: string | null | undefined): string | null {
  if (!host) return null;
  const hostname = host.split(':')[0].toLowerCase();
  const root = ROOT_DOMAIN.split(':')[0].toLowerCase();

  if (hostname === root || hostname === `www.${root}`) return null;
  if (!hostname.endsWith(`.${root}`)) return null;

  const slug = hostname.slice(0, -(root.length + 1));
  // apenas o primeiro nivel: a.b.photoon.com.br nao e um tenant valido
  if (!slug || slug.includes('.')) return null;
  if (RESERVED.has(slug)) return null;
  return slug;
}

/** Slug do tenant da requisicao atual (server components / route handlers). */
export async function currentTenantSlug(): Promise<string | null> {
  const h = await headers();
  return h.get(TENANT_HEADER) || process.env.DEFAULT_TENANT_SLUG || null;
}

/** URL absoluta para um caminho dentro do subdominio de um lojista. */
export function tenantUrl(slug: string, path = '/'): string {
  return `${PROTOCOL}://${slug}.${ROOT_DOMAIN}${path}`;
}
