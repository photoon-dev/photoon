import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { urlPublica } from '@/lib/url-publica';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  // `request.url` aqui é o endereço interno do contêiner: sem `urlPublica`, o
  // Location saía como https://0.0.0.0:3000/entrar e sair do sistema levava a
  // um endereço morto — para todos os perfis.
  return NextResponse.redirect(urlPublica(request, '/entrar'), { status: 303 });
}
