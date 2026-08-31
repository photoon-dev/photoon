import { redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { carteiraDaLoja, resolverPeriodo } from '@/lib/financeiro';
import { MODULO } from '@/lib/rotas-lojista';
import CarteiraDesign, { CSS_PSEUDO } from '@/components/design/CarteiraDesign';
import ShellLojista from '@/components/app/ShellLojista';
import ConteudoDoDesign from '@/components/app/ConteudoDoDesign';
import AvisoRotaLegada from '@/components/app/AvisoRotaLegada';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const carteira = await carteiraDaLoja(loja.id, resolverPeriodo({ dias: '90' }));

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
    <ShellLojista ativo={MODULO['Financeiro']}>
      <AvisoRotaLegada rota="/carteira" />
      <ConteudoDoDesign
        Design={CarteiraDesign}
        cssPseudo={CSS_PSEUDO}
        dados={linhas}
      />
    </ShellLojista>
  );
}
