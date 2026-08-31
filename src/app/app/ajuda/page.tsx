import { redirect } from 'next/navigation';
import { lojaAtual, getLojistaPorId } from '@/lib/lojista';
import { chamadosDaLoja } from '@/lib/financeiro';
import ShellLojista from '@/components/app/ShellLojista';
import PainelAjuda from '@/components/app/PainelAjuda';
import '../app.css';

export const dynamic = 'force-dynamic';

/**
 * Ajuda — o que restou do módulo Suporte.
 *
 * Fica fora do menu de propósito: chega-se por aqui pelo botão da topbar.
 */
export default async function Pagina() {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  const [dados, chamados] = await Promise.all([
    getLojistaPorId(loja.id),
    chamadosDaLoja(loja.id),
  ]);

  return (
    <ShellLojista ativo={-1}>
      <PainelAjuda
        canais={{
          telefoneSuporte: dados?.telefone_suporte ?? null,
          emailSuporte: dados?.email_suporte ?? null,
          urlContato: dados?.url_contato ?? null,
          urlPolitica: dados?.url_politica ?? null,
        }}
        chamadosPorEstado={chamados.porEstado}
        suporte={{
          email: process.env.NEXT_PUBLIC_SUPORTE_EMAIL || null,
          whatsapp: process.env.NEXT_PUBLIC_SUPORTE_WHATSAPP || null,
          docs: process.env.NEXT_PUBLIC_DOCS_URL || null,
        }}
      />
    </ShellLojista>
  );
}
