import { redirect } from 'next/navigation';
import {
  lojaAtual,
  listarClientesDaLoja,
  listarTemplates,
  planoDaLoja,
  usoAtual,
  CLIENTES_POR_PAGINA,
} from '@/lib/lojista';
import { ROOT_DOMAIN } from '@/lib/tenant';
import ShellLojista from '@/components/app/ShellLojista';
import CardPlano from '@/components/app/CardPlano';
import PainelClientes from '@/components/app/PainelClientes';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; p?: string }>;
}) {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const { q = '', p = '0' } = await searchParams;
  const pagina = Math.max(0, Number(p) || 0);

  const [{ clientes, total }, templates, plano, uso] = await Promise.all([
    listarClientesDaLoja(loja.id, { busca: q, pagina }),
    listarTemplates(loja.id),
    planoDaLoja(loja.id),
    usoAtual(loja.id),
  ]);

  return (
    <ShellLojista ativo={8} cartaoPlano={<CardPlano plano={plano} uso={uso} compacto />}>
      <PainelClientes
        clientes={clientes}
        templates={templates}
        slugLoja={loja.slug}
        dominio={ROOT_DOMAIN}
        total={total}
        pagina={pagina}
        porPagina={CLIENTES_POR_PAGINA}
        busca={q}
      />
    </ShellLojista>
  );
}
