'use client';

import { useRouter } from 'next/navigation';
import PedidosDesign, { CSS_PSEUDO } from '@/components/design/PedidosDesign';
import { useDashboardDesign } from '@/components/app/useDashboardDesign';
import { reais } from '@/lib/preco';
import type { PedidoResumo, FiltrosPedidos } from '@/lib/pedidos';

/**
 * Tela de Pedidos com o layout do design.
 *
 * A primeira versão foi escrita à mão em Tailwind e ficou visualmente à parte do
 * resto do produto. Esta usa `Pedidos.dc.html` transliterado — o mesmo caminho
 * do Dashboard e do Editor. O que muda aqui é só o dado.
 *
 * A página `pedidos/page.tsx` renderiza CabecalhoPedidos (KPIs) + a barra de
 * filtros + este componente. Aqui o título, o `resumo` e a grid de KPIs do
 * `PedidosDesign` são suprimidos via CSS_PSEUDO extra para não duplicar.
 */

const SELO_ESTADO: Record<string, [string, string, string]> = {
  rascunho: ['Rascunho', '#EEF1F7', '#6B7A90'],
  aguardando_pagamento: ['Aguarda pagamento', '#FEF3E2', '#B45309'],
  pago: ['Pago', '#E6F8F1', '#059669'],
  em_producao: ['Em produção', '#EAF0FF', '#2563EB'],
  pronto: ['Pronto', '#E4F8FC', '#0E7490'],
  enviado: ['Expedido', '#F1F5FD', '#4F46E5'],
  entregue: ['Entregue', '#E6F8F1', '#047857'],
  cancelado: ['Cancelado', '#FFF1F3', '#E11D48'],
};

const SELO_PAG: Record<string, [string, string, string]> = {
  aprovado: ['Pago', '#E6F8F1', '#059669'],
  pendente: ['Pendente', '#FEF3E2', '#B45309'],
  recusado: ['Recusado', '#FFF1F3', '#E11D48'],
  estornado: ['Estornado', '#F1F5FD', '#6B7A90'],
};

const selo = ([, bg, cor]: [string, string, string]) =>
  `padding:6px 11px;border-radius:999px;background:${bg};color:${cor};` +
  'font-size:12px;font-weight:600;width:max-content;white-space:nowrap';

// CSS extra injetado para a nova ordem: KPIs e filtros vem antes, então o que
// está no topo do design (título duplicado + grid de KPIs) é escondido.
// Selecionamos pela assinatura do estilo inline (única no documento).
const CSS_OMITIR = `
.om-pedidos-resumido [style*="fontSize: 30px"] { display: none !important; }
.om-pedidos-resumido [style*="repeat(auto-fit, minmax(210px"] { display: none !important; }
.om-pedidos-resumido [style*="font-size: 30px"] { display: none !important; }
`;

export default function PedidosDoDesign({
  pedidos,
  total,
  naoVistos,
  filtros,
}: {
  pedidos: PedidoResumo[];
  total: number;
  naoVistos: number;
  filtros: FiltrosPedidos;
}) {
  const router = useRouter();
  const v = useDashboardDesign();

  // KPIs do design são suprimidos via CSS; esses valores são apenas placeholders.
  const kpiVazio = (rotulo: string) => ({ rotulo, valor: '', nota: '' });

  // "Atrasado" é prazo vencido em pedido que ainda não saiu — não basta a data.
  const hoje = new Date().toISOString().slice(0, 10);
  const atrasados = pedidos.filter(
    (p) => p.prazo_em && p.prazo_em < hoje && !['entregue', 'cancelado'].includes(p.estado),
  ).length;

  const irPara = (novos: Partial<FiltrosPedidos>) => {
    const q = new URLSearchParams();
    const f = { ...filtros, ...novos };
    if (f.estado) q.set('estado', f.estado);
    if (f.busca) q.set('busca', f.busca);
    if (f.de) q.set('de', f.de);
    if (f.ate) q.set('ate', f.ate);
    router.push(`/pedidos${q.toString() ? `?${q}` : ''}`);
  };

  const abas: [string, string][] = [
    ['', 'Todos'],
    ['em_producao', 'Em produção'],
    ['aguardando_pagamento', 'Aguardam pagamento'],
    ['cancelado', 'Cancelados'],
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS_PSEUDO + CSS_OMITIR }} />
      <div className="om-pedidos-resumido">
        <PedidosDesign
          v={{
            ...v,
            // Resumo vazio para não duplicar com CabecalhoPedidos.
            resumo: '',
            kpi1: kpiVazio(''),
            kpi2: kpiVazio(''),
            kpi3: kpiVazio(''),
            kpi4: kpiVazio(''),
            kpi5: kpiVazio(''),

            abas: abas.map(([id, rotulo]) => {
              const on = (filtros.estado ?? '') === id;
              return {
                rotulo,
                style:
                  'padding:8px 15px;border-radius:999px;font-size:13px;cursor:pointer;white-space:nowrap;' +
                  (on
                    ? 'background:#0B1220;color:#FFFFFF;font-weight:700'
                    : 'background:#FFFFFF;border:1px solid #E6EAF2;color:#46536A;font-weight:500'),
                pick: () => irPara({ estado: id }),
              };
            }),

            vazio: pedidos.length
              ? 'display:none'
              : 'padding:44px;text-align:center;font-size:13.5px;color:#9AA7BC',

            pedidos: pedidos.map((p) => {
              const est = SELO_ESTADO[p.estado] ?? SELO_ESTADO.rascunho;
              // O estado do pagamento não vem na listagem; deduzir do estado do pedido
              // é honesto e evita uma consulta por linha.
              const chavePag =
                p.estado === 'cancelado'
                  ? 'estornado'
                  : p.estado === 'aguardando_pagamento' || p.estado === 'rascunho'
                    ? 'pendente'
                    : 'aprovado';
              const pag = SELO_PAG[chavePag];
              return {
                iniciais: (p.clientes?.nome ?? 'Sem cliente').slice(0, 2).toUpperCase(),
                cliente: p.clientes?.nome ?? 'Sem cliente vinculado',
                // O selo de não visto vai junto do número: é onde o olho cai.
                numero: `#${p.numero}${p.visto_em ? '' : ' · novo'}`,
                href: `/pedidos/${p.id}`,
                produto: p.canal,
                canal: new Date(p.criado_em).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }),
                valor: reais(p.total),
                pagamento: pag[0],
                seloPag: selo(pag),
                estado: est[0],
                seloEstado: selo(est),
                prazo: p.prazo_em
                  ? new Date(p.prazo_em + 'T12:00:00').toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'short',
                    })
                  : '—',
                abrir: () => router.push(`/pedidos/${p.id}`),
              };
            }),
          }}
        />
      </div>
    </>
  );
}
