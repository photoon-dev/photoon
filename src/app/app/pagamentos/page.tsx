import { redirect } from 'next/navigation';
import { molduraDaLoja } from '@/lib/painel-loja';
import { listarPagamentos } from '@/lib/pedidos';
import FinanceiroDesign, { CSS_PSEUDO } from '@/components/design/FinanceiroDesign';
import TelaDoDesign from '@/components/app/TelaDoDesign';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const m = await molduraDaLoja();
  if (!m) redirect('/');

  const dados = await listarPagamentos(m.loja.id, {});

  /*
   * O design traz seis linhas de exemplo com nomes fictícios. Aqui elas
   * recebem os nomes reais desta tela; quando não há tantos registros, a
   * linha fica em branco em vez de mostrar um cliente que não existe.
   */
  const nomes = dados.pagamentos.map((p) => p.pedidos?.clientes?.nome ?? `#${p.pedidos?.numero ?? ''}`);
  const linhas = Object.fromEntries(
    Array.from({ length: 6 }, (_, i) => [`linha${i}`, { nome: nomes[i] ?? '' }]),
  );

  return (
    <TelaDoDesign
      Design={FinanceiroDesign}
      cssPseudo={CSS_PSEUDO}
      ativo={12}
      painel={m.painel}
      dados={linhas}
    />
  );
}
