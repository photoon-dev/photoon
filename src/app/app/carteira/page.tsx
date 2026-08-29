import { redirect } from 'next/navigation';
import { molduraDaLoja } from '@/lib/painel-loja';
import { carteiraDaLoja, resolverPeriodo } from '@/lib/financeiro';
import CarteiraDesign, { CSS_PSEUDO } from '@/components/design/CarteiraDesign';
import TelaDoDesign from '@/components/app/TelaDoDesign';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const m = await molduraDaLoja();
  if (!m) redirect('/');

  const carteira = await carteiraDaLoja(m.loja.id, resolverPeriodo({ dias: '90' }));

  /*
   * O design traz seis linhas de exemplo com nomes fictícios. Aqui elas
   * recebem os nomes reais desta tela; quando não há tantos registros, a
   * linha fica em branco em vez de mostrar um cliente que não existe.
   */
  const nomes = (carteira.extrato ?? []).map((l) => l.cliente ?? '—');
  const linhas = Object.fromEntries(
    Array.from({ length: 6 }, (_, i) => [`linha${i}`, { nome: nomes[i] ?? '' }]),
  );

  return (
    <TelaDoDesign
      Design={CarteiraDesign}
      cssPseudo={CSS_PSEUDO}
      ativo={13}
      painel={m.painel}
      dados={linhas}
    />
  );
}
