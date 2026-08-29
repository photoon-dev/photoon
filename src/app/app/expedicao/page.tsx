import { redirect } from 'next/navigation';
import { molduraDaLoja } from '@/lib/painel-loja';
import { listarEnvios } from '@/lib/pedidos';
import ExpedicaoDesign, { CSS_PSEUDO } from '@/components/design/ExpedicaoDesign';
import TelaDoDesign from '@/components/app/TelaDoDesign';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const m = await molduraDaLoja();
  if (!m) redirect('/');

  const { envios } = await listarEnvios(m.loja.id, '');

  /*
   * O design traz seis linhas de exemplo com nomes fictícios. Aqui elas
   * recebem os nomes reais desta tela; quando não há tantos registros, a
   * linha fica em branco em vez de mostrar um cliente que não existe.
   */
  const nomes = envios.map((e) => e.pedidos?.clientes?.nome ?? `#${e.pedidos?.numero ?? ''}`);
  const linhas = Object.fromEntries(
    Array.from({ length: 6 }, (_, i) => [`linha${i}`, { nome: nomes[i] ?? '' }]),
  );

  return (
    <TelaDoDesign
      Design={ExpedicaoDesign}
      cssPseudo={CSS_PSEUDO}
      ativo={3}
      painel={m.painel}
      dados={linhas}
    />
  );
}
