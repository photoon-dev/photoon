import { redirect } from 'next/navigation';
import { molduraDaLoja } from '@/lib/painel-loja';
import { itensDosPedidos, listarEnvios, pedidosSemEnvio } from '@/lib/pedidos';
import ExpedicaoDoDesign from '@/components/app/ExpedicaoDoDesign';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const m = await molduraDaLoja();
  if (!m) redirect('/');

  const q = await searchParams;

  /*
   * A busca traz a loja inteira e a aba filtra no navegador. São dezenas de
   * linhas, não milhares, e em troca o painel lateral pode somar por
   * transportadora sobre tudo — não só sobre a aba aberta — e trocar de aba
   * não custa uma ida ao banco.
   */
  const [{ envios }, semEnvio] = await Promise.all([
    listarEnvios(m.loja.id, ''),
    pedidosSemEnvio(m.loja.id),
  ]);

  const itens = await itensDosPedidos(envios.map((e) => e.pedido_id));

  return (
    <ExpedicaoDoDesign
      painel={m.painel}
      envios={envios}
      semEnvio={semEnvio}
      itens={itens}
    />
  );
}
