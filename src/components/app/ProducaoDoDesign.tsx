'use client';

import { useRef, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import ProducaoDesign, { CSS_PSEUDO } from '@/components/design/ProducaoDesign';
import { useDashboardDesign } from '@/components/app/useDashboardDesign';
import { reais } from '@/lib/preco';
import {
  ETAPAS_PRODUCAO,
  PROXIMA_ETAPA,
  dataCurta,
  type EtapaProducao,
  type PedidoDaLinha,
} from '@/lib/pedidos-termos';
// Só o tipo: `import type` some na compilação e não puxa o client do Supabase.
import type { ItemDaFila } from '@/lib/pedidos';
import { colocarNaFila, moverEtapaProducao } from '@/app/app/actions-pedidos';

/**
 * Tela de Produção com o layout do design.
 *
 * O quadro do design tinha cinco colunas de exemplo — "Pré-flight",
 * "Renderização" — que não existem no banco. As colunas aqui são as cinco
 * etapas reais da tabela `producao`, na mesma ordem do fluxo; o resto do
 * layout é o mesmo `Producao.dc.html`.
 *
 * O design escreve "arraste um card para mudar de etapa", e é isso que o
 * arrastar faz: chama `moverEtapaProducao`. O botão no rodapé do card existe
 * para quem não arrasta — mesma ação, um clique.
 */

/** Cor de cada etapa: ponto da coluna, fundo e texto do selo. */
const COR: Record<EtapaProducao, [string, string, string]> = {
  fila: ['#06B6D4', '#E4F8FC', '#0891B2'],
  impressao: ['#2563EB', '#EAF0FF', '#2563EB'],
  acabamento: ['#6366F1', '#EDEBFE', '#6366F1'],
  revisao: ['#F59E0B', '#FEF3E2', '#B45309'],
  pronto: ['#10B981', '#E6F8F1', '#059669'],
};

/**
 * Quanto da produção já andou, por etapa. Não é medição: é a posição da ficha
 * no fluxo, que é o que a barra do design mostra. Fingir porcentagem de peça
 * impressa exigiria um dado que a fábrica não manda.
 */
const ANDAMENTO: Record<EtapaProducao, number> = {
  fila: 10,
  impressao: 40,
  acabamento: 65,
  revisao: 85,
  pronto: 100,
};

const CARD =
  'background:#FFFFFF;border:1px solid #E6EAF2;border-radius:16px;padding:14px;display:flex;' +
  'flex-direction:column;gap:11px;cursor:pointer;transition:box-shadow .16s,transform .16s,border-color .16s';

const COLUNA =
  'display:flex;flex-direction:column;gap:10px;width:250px;flex:0 0 250px;border-radius:16px';

const selo = (bg: string, cor: string) =>
  `padding:4px 10px;border-radius:999px;background:${bg};color:${cor};` +
  'font-size:11.5px;font-weight:700;white-space:nowrap;flex:0 0 auto';

const iniciais = (nome: string | null | undefined) =>
  (nome ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('') || '—';

const hoje = () => new Date().toISOString().slice(0, 10);

/** Prazo em palavras, do ponto de vista de quem produz. */
function prazo(dia: string | null): [string, string, string] {
  if (!dia) return ['sem prazo', '#EEF1F7', '#6B7A90'];
  const dias = Math.round(
    (new Date(dia + 'T12:00:00').getTime() - new Date(hoje() + 'T12:00:00').getTime()) / 86400000,
  );
  if (dias < 0) return [`${-dias} d atrasado`, '#FFF1F3', '#E11D48'];
  if (dias === 0) return ['hoje', '#FEF3E2', '#B45309'];
  if (dias === 1) return ['amanhã', '#FEF3E2', '#B45309'];
  return [`${dias} d`, '#E4F8FC', '#0891B2'];
}

export default function ProducaoDoDesign({
  fila,
  pendentes,
  ver,
}: {
  fila: Record<EtapaProducao, ItemDaFila[]>;
  pendentes: PedidoDaLinha[];
  ver: string;
}) {
  const router = useRouter();
  const v = useDashboardDesign();
  /* Quem está sendo arrastado vive num ref, não só no estado: o `drop` precisa
   * ler o valor no mesmo instante em que acontece, e o estado só chega ao
   * handler no render seguinte. O estado fica para o realce da coluna. */
  const arrastandoRef = useRef<string | null>(null);
  const [arrastando, setArrastando] = useState<string | null>(null);
  const pegar = (id: string | null) => {
    arrastandoRef.current = id;
    setArrastando(id);
  };
  const [ocupado, iniciar] = useTransition();

  const todas = ETAPAS_PRODUCAO.flatMap((e) => fila[e.id] ?? []);
  const atrasada = (i: ItemDaFila) =>
    Boolean(i.pedidos?.prazo_em && i.pedidos.prazo_em < hoje()) && i.etapa !== 'pronto';

  const ativas = todas.filter((i) => i.etapa !== 'pronto').length;
  const atrasadas = todas.filter(atrasada).length;
  const concluidasHoje = todas.filter((i) => (i.concluida_em ?? '').slice(0, 10) === hoje()).length;

  const mover = (producaoId: string, etapa: EtapaProducao) => {
    const fd = new FormData();
    fd.set('producao_id', producaoId);
    fd.set('etapa', etapa);
    iniciar(async () => {
      await moverEtapaProducao(fd);
      router.refresh();
    });
  };

  const enfileirar = (pedidoId: string) => {
    const fd = new FormData();
    fd.set('pedido_id', pedidoId);
    iniciar(async () => {
      await colocarNaFila(fd);
      router.refresh();
    });
  };

  // O filtro vive na URL, como em Pedidos: o lojista guarda o link de
  // "atrasados" e o botão de voltar do navegador funciona.
  const abas: [string, string][] = [
    ['', 'Tudo'],
    ['atrasados', 'Atrasados'],
    ['sem-responsavel', 'Sem responsável'],
  ];
  const visivel = (i: ItemDaFila) =>
    ver === 'atrasados' ? atrasada(i) : ver === 'sem-responsavel' ? !i.responsavel : true;

  const kpi = (rotulo: string, valor: number, nota: string) => ({
    rotulo,
    valor: valor.toLocaleString('pt-BR'),
    nota,
  });

  /* Carga por responsável: o design mostrava três equipamentos com nome de
   * fábrica. Equipamento a plataforma não conhece; quem tocou a ficha, sim. */
  const porResponsavel = new Map<string, ItemDaFila[]>();
  for (const i of todas.filter((x) => x.etapa !== 'pronto' && x.responsavel)) {
    const chave = i.responsavel as string;
    porResponsavel.set(chave, [...(porResponsavel.get(chave) ?? []), i]);
  }

  const revisao = fila.revisao ?? [];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS_PSEUDO }} />
      <ProducaoDesign
        v={{
          ...v,

          resumo: todas.length
            ? `${ativas} ${ativas === 1 ? 'peça' : 'peças'} em produção · ` +
              `${pendentes.length} esperando a fila · ` +
              (atrasadas ? `${atrasadas} com prazo vencido` : 'nenhum prazo vencido')
            : pendentes.length
              ? `Nada em produção. ${pendentes.length} ${pendentes.length === 1 ? 'pedido pago espera' : 'pedidos pagos esperam'} a fila.`
              : 'Nada em produção. A ficha nasce quando o pedido é pago.',

          rotuloFila: ocupado
            ? 'Aguarde…'
            : `Colocar ${pendentes.length} na fila`,
          btnFila: pendentes.length
            ? 'white-space:nowrap;height:44px;padding:0 18px;display:flex;align-items:center;gap:9px;' +
              'border:0;border-radius:14px;background:linear-gradient(135deg,#2563EB,#06B6D4);color:#FFFFFF;' +
              'font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 8px 20px rgba(37,99,235,.28)'
            : 'display:none',
          enfileirarTodos: () => pendentes.forEach((p) => enfileirar(p.id)),

          kpi1: kpi('Em produção', ativas, `${(fila.fila ?? []).length} na fila`),
          kpi2: kpi('Esperando a fila', pendentes.length, 'pagos, sem ficha'),
          kpi3: kpi('Prontas', (fila.pronto ?? []).length, 'aguardam expedição'),
          kpi4: {
            ...kpi('Atrasadas', atrasadas, atrasadas ? 'prazo vencido' : 'nenhum atraso'),
            selo:
              'padding:4px 9px;border-radius:999px;font-size:11.5px;font-weight:700;' +
              (atrasadas ? 'background:#FFF1F3;color:#E11D48' : 'background:#E6F8F1;color:#059669'),
          },
          kpi5: kpi('Concluídas hoje', concluidasHoje, 'carimbadas hoje'),

          chipEquipe: porResponsavel.size
            ? `${porResponsavel.size} ${porResponsavel.size === 1 ? 'responsável' : 'responsáveis'} com ficha aberta`
            : 'nenhuma ficha com responsável',
          chipAtraso: atrasadas ? `${atrasadas} com prazo vencido` : 'todos no prazo',
          chipAtrasoEstilo:
            'display:flex;align-items:center;gap:8px;padding:9px 14px;border-radius:999px;' +
            'font-size:12.5px;font-weight:600;' +
            (atrasadas ? 'background:#FFF1F3;color:#E11D48' : 'background:#E6F8F1;color:#059669'),

          ...Object.fromEntries(
            abas.flatMap(([id, rotulo], i) => {
              const on = ver === id;
              return [
                [`rot${i}`, rotulo],
                [
                  `per${i}`,
                  'padding:8px 16px;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;' +
                    'white-space:nowrap;transition:all .16s;' +
                    (on
                      ? 'background:linear-gradient(135deg,#2563EB,#06B6D4);color:#FFFFFF;box-shadow:0 6px 14px rgba(37,99,235,.24)'
                      : 'background:transparent;color:#6B7A90'),
                ],
                [`setP${i}`, () => router.push(id ? `/producao?ver=${id}` : '/producao')],
              ];
            }),
          ),

          colunas: ETAPAS_PRODUCAO.map((etapa) => {
            const [ponto, bg, cor] = COR[etapa.id];
            const cards = (fila[etapa.id] ?? []).filter(visivel);
            return {
              nome: etapa.rotulo,
              quantidade: String(cards.length),
              ponto: `width:8px;height:8px;border-radius:999px;background:${ponto}`,
              selo: `margin-left:auto;padding:2px 9px;border-radius:999px;background:${bg};color:${cor};font-size:11.5px;font-weight:700`,
              // Realce da coluna sob o card arrastado: sem isso o alvo do
              // soltar é invisível e o gesto vira adivinhação.
              estilo:
                COLUNA +
                (arrastando ? `;outline:2px dashed ${ponto};outline-offset:6px` : ''),
              /* A coluna rola por dentro. Sem isto, uma etapa com dez peças
               * esticava o quadro — e a página — a três telas de altura. */
              lista:
                'display:flex;flex-direction:column;gap:12px;max-height:512px;' +
                'overflow-y:auto;overflow-x:hidden;padding-right:2px',
              sobre: (e: React.DragEvent) => e.preventDefault(),
              soltar: (e: React.DragEvent) => {
                e.preventDefault();
                const id = arrastandoRef.current;
                // Soltar na própria coluna não é movimento: evita uma escrita
                // e um recarregamento à toa.
                if (id && (fila[etapa.id] ?? []).every((f) => f.id !== id)) mover(id, etapa.id);
                pegar(null);
              },
              vazio: cards.length
                ? 'display:none'
                : 'margin:0;padding:14px 2px;font-size:12px;color:#9AA7BC',
              textoVazio: ver ? 'nada neste filtro' : 'nenhuma peça nesta etapa',

              cards: cards.map((i) => {
                const p = i.pedidos;
                const [rotuloPrazo, prazoBg, prazoCor] = prazo(p?.prazo_em ?? null);
                const proxima = PROXIMA_ETAPA[i.etapa];
                return {
                  numero: `#${p?.numero ?? '—'}`,
                  prazo: rotuloPrazo,
                  seloPrazo: selo(prazoBg, prazoCor),
                  cliente: p?.clientes?.nome ?? 'Sem cliente vinculado',
                  detalhe: i.observacao ?? reais(p?.total ?? 0),
                  pct: `${ANDAMENTO[i.etapa]}%`,
                  barra: `width:${ANDAMENTO[i.etapa]}%;height:100%;border-radius:999px;background:${ponto}`,
                  iniciais: iniciais(i.responsavel) || '—',
                  responsavel: i.responsavel ?? 'sem responsável',
                  estilo: CARD + (arrastando === i.id ? ';opacity:.45' : ''),
                  arrastar: (e: React.DragEvent) => {
                    e.dataTransfer.effectAllowed = 'move';
                    pegar(i.id);
                  },
                  soltarCard: () => pegar(null),
                  abrir: () => p && router.push(`/pedidos/${p.id}`),
                  rotuloAvancar: proxima ? `→ ${ETAPAS_PRODUCAO.find((e) => e.id === proxima)?.rotulo}` : '',
                  btnAvancar: proxima
                    ? 'margin:9px 0 0 auto;height:26px;padding:0 10px;border:1px solid #E6EAF2;border-radius:9px;' +
                      'background:#FFFFFF;color:#6B7A90;font-family:inherit;font-size:11px;font-weight:600;cursor:pointer'
                    : 'display:none',
                  avancar: (e: React.MouseEvent) => {
                    e.stopPropagation();
                    if (proxima) mover(i.id, proxima);
                  },
                };
              }),
            };
          }),

          pendentes: pendentes.map((p) => ({
            iniciais: iniciais(p.clientes?.nome) || `#${p.numero}`,
            cliente: p.clientes?.nome ?? 'Sem cliente vinculado',
            detalhe: `#${p.numero} · ${reais(p.total)} · pago em ${dataCurta(p.criado_em)}`,
            enfileirar: () => enfileirar(p.id),
          })),
          pendentesVazio: pendentes.length
            ? 'display:none'
            : 'margin:0;padding:20px;text-align:center;font-size:13px;color:#9AA7BC',

          responsaveis: [...porResponsavel.entries()].map(([nome, fichas]) => {
            const porEtapa = ETAPAS_PRODUCAO.filter((e) => fichas.some((f) => f.etapa === e.id))
              .map((e) => `${fichas.filter((f) => f.etapa === e.id).length} em ${e.rotulo.toLowerCase()}`)
              .join(' · ');
            const atrasos = fichas.filter(atrasada).length;
            return {
              nome,
              iniciais: iniciais(nome),
              detalhe: porEtapa,
              quantidade: String(fichas.length),
              selo: atrasos ? selo('#FFF1F3', '#E11D48') : selo('#E6F8F1', '#059669'),
            };
          }),
          responsaveisVazio: porResponsavel.size
            ? 'display:none'
            : 'margin:0;padding:20px;text-align:center;font-size:13px;color:#9AA7BC',

          revisao: revisao.map((i) => ({
            titulo: `#${i.pedidos?.numero ?? '—'} · ${i.pedidos?.clientes?.nome ?? 'sem cliente'}`,
            detalhe: i.observacao ?? `em revisão desde ${dataCurta(i.atualizado_em)}`,
            abrir: () => i.pedidos && router.push(`/pedidos/${i.pedidos.id}`),
          })),
          revisaoResumo: `${revisao.length} ${revisao.length === 1 ? 'peça' : 'peças'}`,
          revisaoSelo: revisao.length ? selo('#FEF3E2', '#B45309') : selo('#E6F8F1', '#059669'),
          revisaoVazio: revisao.length
            ? 'display:none'
            : 'margin:0;padding:20px;text-align:center;font-size:13px;color:#9AA7BC',
        }}
      />
    </>
  );
}
