import { redirect } from 'next/navigation';
import { molduraDaLoja } from '@/lib/painel-loja';
import { filaDeProducao } from '@/lib/pedidos';
import ProducaoDesign, { CSS_PSEUDO } from '@/components/design/ProducaoDesign';
import TelaDoDesign from '@/components/app/TelaDoDesign';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const m = await molduraDaLoja();
  if (!m) redirect('/');

  const fila = await filaDeProducao(m.loja.id);

  /*
   * O design traz seis linhas de exemplo com nomes fictícios. Aqui elas
   * recebem os nomes reais desta tela; quando não há tantos registros, a
   * linha fica em branco em vez de mostrar um cliente que não existe.
   */
  // `filaDeProducao` devolve um mapa etapa -> itens; achatar dá a ordem em que
  // as peças aparecem no quadro.
  const nomes = Object.values(fila)
    .flat()
    .map((i) => i.pedidos?.clientes?.nome ?? `#${i.pedidos?.numero ?? ''}`);
  const linhas = Object.fromEntries(
    Array.from({ length: 6 }, (_, i) => [`linha${i}`, { nome: nomes[i] ?? '' }]),
  );

  return (
    <TelaDoDesign
      Design={ProducaoDesign}
      cssPseudo={CSS_PSEUDO}
      ativo={2}
      painel={m.painel}
      dados={linhas}
    />
  );
}
