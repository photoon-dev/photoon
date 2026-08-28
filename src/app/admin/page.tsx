import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { souSuperAdmin } from '@/lib/data';
import { listarTodasAsLojas, numerosDaPlataforma, listarPlanos } from '@/lib/lojista';
import { ROOT_DOMAIN } from '@/lib/tenant';
import PainelSuperAdmin from '@/components/admin/PainelSuperAdmin';

export const dynamic = 'force-dynamic';

export default async function SuperAdminPage() {
  if (!(await souSuperAdmin())) redirect('/entrar');

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [lojas, numeros, planos] = await Promise.all([
    listarTodasAsLojas(),
    numerosDaPlataforma(),
    listarPlanos(),
  ]);

  return (
    <PainelSuperAdmin
      lojas={lojas}
      numeros={numeros}
      dominio={ROOT_DOMAIN}
      email={user?.email ?? ''}
      planos={planos}
    />
  );
}
