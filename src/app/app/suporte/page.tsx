import { redirect } from 'next/navigation';
import { molduraDaLoja } from '@/lib/painel-loja';
import { chamadosDaLoja } from '@/lib/financeiro';
import SuporteDesign, { CSS_PSEUDO } from '@/components/design/SuporteDesign';
import TelaDoDesign from '@/components/app/TelaDoDesign';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const m = await molduraDaLoja();
  if (!m) redirect('/');

  const painelChamados = await chamadosDaLoja(m.loja.id, {});

  /*
   * O design traz seis linhas de exemplo com nomes fictícios. Aqui elas
   * recebem os nomes reais desta tela; quando não há tantos registros, a
   * linha fica em branco em vez de mostrar um cliente que não existe.
   */
  const nomes = (painelChamados.chamados ?? []).map((c) => c.cliente ?? c.assunto);
  const linhas = Object.fromEntries(
    Array.from({ length: 6 }, (_, i) => [`linha${i}`, { nome: nomes[i] ?? '' }]),
  );

  return (
    <TelaDoDesign
      Design={SuporteDesign}
      cssPseudo={CSS_PSEUDO}
      ativo={18}
      painel={m.painel}
      dados={linhas}
    />
  );
}
