import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { slugFromHost, ROOT_DOMAIN } from '@/lib/tenant';

/**
 * Endpoint do `on_demand_tls { ask }` do Caddy.
 *
 * O Caddy consulta este endereço antes de emitir certificado para um host.
 * 200 = pode emitir; qualquer outro = recusa. Sem esta checagem, qualquer
 * pessoa que apontasse um domínio para a VPS faria o Caddy pedir certificado
 * em nome dela e estouraria o limite da Let's Encrypt.
 */
export async function GET(request: NextRequest) {
  const dominio = request.nextUrl.searchParams.get('domain');
  if (!dominio) return new NextResponse('faltou o parâmetro domain', { status: 400 });

  const host = dominio.toLowerCase();

  // Hosts da própria plataforma: domínio raiz, www, painel do lojista (app)
  // e painel do super admin (admin). Nenhum deles pode ser slug de lojista --
  // estão na lista de reservados de slugFromHost.
  const NOSSOS = [ROOT_DOMAIN, `www.${ROOT_DOMAIN}`, `app.${ROOT_DOMAIN}`, `admin.${ROOT_DOMAIN}`];
  if (NOSSOS.includes(host)) {
    return new NextResponse('ok', { status: 200 });
  }

  const slug = slugFromHost(host);
  if (!slug) return new NextResponse('host fora do domínio', { status: 404 });

  const supabase = await createClient();
  const { data } = await supabase
    .from('lojistas')
    .select('slug')
    .eq('slug', slug)
    .eq('ativo', true)
    .maybeSingle();

  return data
    ? new NextResponse('ok', { status: 200 })
    : new NextResponse('lojista inexistente', { status: 404 });
}
