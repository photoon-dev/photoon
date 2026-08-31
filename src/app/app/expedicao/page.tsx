import { redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { itensDosPedidos, listarEnvios, pedidosSemEnvio } from '@/lib/pedidos';
import ExpedicaoDoDesign from '@/components/app/ExpedicaoDoDesign';
import ShellLojista from '@/components/app/ShellLojista';
import { MODULO } from '@/lib/rotas-lojista';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const q = await searchParams;

  /*
   * A busca traz a loja inteira e a aba filtra no navegador. São dezenas de
   * linhas, não milhares, e em troca o painel lateral pode somar por
   * transportadora sobre tudo — não só sobre a aba aberta — e trocar de aba
   * não custa uma ida ao banco.
   */
  const [{ envios }, semEnvio] = await Promise.all([
    listarEnvios(loja.id, ''),
    pedidosSemEnvio(loja.id),
  ]);

  const itens = await itensDosPedidos(envios.map((e) => e.pedido_id));

  return (
    <ShellLojista ativo={MODULO['Expedição']}>
      <ExpedicaoDoDesign
        lojaNome={loja.nome}
        envios={envios}
        semEnvio={semEnvio}
        itens={itens}
      />
    </ShellLojista>
  );
}
