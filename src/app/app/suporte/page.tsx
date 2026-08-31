import { redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { chamadosDaLoja } from '@/lib/financeiro';
import SuporteDesign, { CSS_PSEUDO } from '@/components/design/SuporteDesign';
import ShellLojista from '@/components/app/ShellLojista';
import ConteudoDoDesign from '@/components/app/ConteudoDoDesign';
import AvisoRotaLegada from '@/components/app/AvisoRotaLegada';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const painelChamados = await chamadosDaLoja(loja.id, {});

  /*
   * O design traz seis linhas de exemplo com nomes fictícios. Aqui elas
   * recebem os nomes reais desta tela; quando não há tantos registros, a
   * linha fica em branco em vez de mostrar um cliente que não existe.
   */
  const nomes = (painelChamados.chamados ?? []).map((c) => c.cliente ?? c.assunto);
  const linhas = Object.fromEntries(
    Array.from({ length: 6 }, (_, i) => [`linha${i}`, { nome: nomes[i] ?? '' }]),
  );

  /* Suporte saiu do menu: o item virou o botão Ajuda na topbar. A tela fica de
   * pé enquanto os chamados dos clientes não têm outro lugar — quem tinha o
   * link salvo não bate num 404. */
  return (
    <ShellLojista ativo={-1}>
      <AvisoRotaLegada rota="/suporte" />
      <ConteudoDoDesign
        Design={SuporteDesign}
        cssPseudo={CSS_PSEUDO}
        dados={linhas}
      />
    </ShellLojista>
  );
}
