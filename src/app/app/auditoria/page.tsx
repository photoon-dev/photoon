import { redirect } from 'next/navigation';
import { molduraDaLoja } from '@/lib/painel-loja';
import { auditoriaDaLoja, resolverPeriodo } from '@/lib/financeiro';
import AuditoriaDesign, { CSS_PSEUDO } from '@/components/design/AuditoriaDesign';
import TelaDoDesign from '@/components/app/TelaDoDesign';
import '../app.css';

export const dynamic = 'force-dynamic';

/** Nome legível para cada ação registrada; a chave crua não diz nada ao lojista. */
const ROTULO: Record<string, string> = {
  'pedido.criado': 'Pedido criado',
  'pedido.cancelado': 'Pedido cancelado',
  'pagamento.aprovado': 'Pagamento aprovado',
  'producao.iniciada': 'Produção iniciada',
  'produto.criado': 'Produto cadastrado',
};

export default async function Pagina() {
  const m = await molduraDaLoja();
  if (!m) redirect('/');

  // 90 dias: auditoria serve para achar o que aconteceu semanas atrás, não só
  // hoje. O filtro por período fica para quando a tela tiver o seletor.
  const { linhas } = await auditoriaDaLoja(m.loja.id, resolverPeriodo({ dias: '90' }));

  return (
    <TelaDoDesign
      Design={AuditoriaDesign}
      cssPseudo={CSS_PSEUDO}
      ativo={17}
      painel={m.painel}
      dados={{
        eventos: linhas.map((l) => ({
          acao: ROTULO[l.acao] ?? l.acao,
          // O detalhe é jsonb: mostrar a chave e o valor é mais útil que o JSON.
          detalhe: [l.entidade, l.detalhe ? Object.entries(l.detalhe as Record<string, unknown>).map(([k, v]) => `${k}: ${v}`).join(' · ') : '']
            .filter(Boolean)
            .join(' · '),
          quando: new Date(l.criadoEm).toLocaleString('pt-BR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
          }),
        })),
        semEventos: linhas.length ? 'display:none' : 'padding:34px;text-align:center;font-size:13px;color:#9AA7BC',
      }}
    />
  );
}
