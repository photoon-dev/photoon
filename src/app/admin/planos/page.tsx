import { redirect } from 'next/navigation';
import { souSuperAdmin } from '@/lib/data';
import { listarPlanos } from '@/lib/lojista';
import PainelPlanos from '@/components/admin/PainelPlanos';

export const dynamic = 'force-dynamic';

export default async function PlanosPage() {
  if (!(await souSuperAdmin())) redirect('/entrar');
  return <PainelPlanos planos={await listarPlanos()} />;
}
