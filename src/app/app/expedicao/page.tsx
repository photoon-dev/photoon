import { redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { expedicoesCompletas, resumoExpedicao } from '@/lib/pedidos';
import ResumoExpedicao from '@/components/app/ResumoExpedicao';
import ExpedicaoCompleta from '@/components/app/ExpedicaoCompleta';
import ShellLojista from '@/components/app/ShellLojista';
import { MODULO } from '@/lib/rotas-lojista';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const [envios, resumo] = await Promise.all([
    expedicoesCompletas(loja.id),
    resumoExpedicao(loja.id),
  ]);

  return (
    <ShellLojista ativo={MODULO['Expedição']}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <ResumoExpedicao r={resumo} />
        <ExpedicaoCompleta envios={envios} />
      </div>
    </ShellLojista>
  );
}
