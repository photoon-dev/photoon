import { redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { listarPagamentos } from '@/lib/pedidos';
import { MODULO } from '@/lib/rotas-lojista';
import FinanceiroDesign, { CSS_PSEUDO } from '@/components/design/FinanceiroDesign';
import ShellLojista from '@/components/app/ShellLojista';
import ConteudoDoDesign from '@/components/app/ConteudoDoDesign';
import AvisoRotaLegada from '@/components/app/AvisoRotaLegada';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const dados = await listarPagamentos(loja.id, {});

  /*
   * O design traz seis linhas de exemplo com nomes fictícios. Aqui elas
   * recebem os nomes reais desta tela; quando não há tantos registros, a
   * linha fica em branco em vez de mostrar um cliente que não existe.
   */
  const nomes = dados.pagamentos.map(
    (p) => p.pedidos?.clientes?.nome ?? `#${p.pedidos?.numero ?? ''}`,
  );
  const linhas = Object.fromEntries(
    Array.from({ length: 6 }, (_, i) => [`linha${i}`, { nome: nomes[i] ?? '' }]),
  );

  return (
    <ShellLojista ativo={MODULO['Financeiro']}>
      <AvisoRotaLegada rota="/pagamentos" />
      <ConteudoDoDesign
        Design={FinanceiroDesign}
        cssPseudo={CSS_PSEUDO}
        dados={linhas}
      />
    </ShellLojista>
  );
}
