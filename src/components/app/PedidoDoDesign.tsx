'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import PedidoDesign, { CSS_PSEUDO } from '@/components/design/PedidoDesign';
import { useDashboardDesign, type PainelDaLoja } from '@/components/app/useDashboardDesign';
import { ROTAS_LOJISTA } from '@/lib/rotas-lojista';
import MenuLojista from '@/components/app/MenuLojista';
import {
  ESTADOS_EXPEDICAO,
  ESTADOS_PAGAMENTO,
  ESTADOS_PEDIDO,
  ETAPAS_PRODUCAO,
  METODOS_PAGAMENTO,
  PROXIMO_ESTADO,
  dataCurta,
  dataHora,
  moeda,
  termo,
  type EstadoExpedicao,
  type EstadoPedido,
  type EtapaProducao,
} from '@/lib/pedidos-termos';
// Só o tipo: `import type` some na compilação e não puxa o client do Supabase.
import type { PedidoDetalhado } from '@/lib/pedidos';
import {
  abrirExpedicao,
  avancarEstadoPedido,
  cancelarPedido,
  colocarNaFila,
  definirEstadoExpedicao,
  marcarPedidoVisto,
  moverEtapaProducao,
  salvarRastreio,
} from '@/app/app/actions-pedidos';

/**
 * Detalhe do pedido com o layout do design.
 *
 * Mesmo caminho de Pedidos, Produção e Expedição: `Pedido.dc.html` vira
 * `PedidoDesign` por `tools/dc2tsx.py` e aqui só se monta o `v` com o dado
 * real. Substitui `PainelPedidosDetalhe.tsx`, que era Tailwind escrito à mão.
 *
 * As ações são as mesmas de antes (`actions-pedidos`), agora chamadas do
 * cliente dentro de uma transição: o design usa `onClick`/`onSubmit`, não
 * `<form action>`, e o `router.refresh()` traz o dado gravado de volta.
 */

/** Fundo e texto do selo de cada valor. O design não tem classe, é estilo. */
const COR_ESTADO: Record<string, [string, string]> = {
  rascunho: ['#EEF1F7', '#6B7A90'],
  aguardando_pagamento: ['#FEF3E2', '#B45309'],
  pago: ['#E6F8F1', '#059669'],
  em_producao: ['#EAF0FF', '#2563EB'],
  pronto: ['#E4F8FC', '#0E7490'],
  enviado: ['#F1F5FD', '#4F46E5'],
  entregue: ['#E6F8F1', '#047857'],
  cancelado: ['#FFF1F3', '#E11D48'],
};

const COR_PAGAMENTO: Record<string, [string, string]> = {
  pendente: ['#FEF3E2', '#B45309'],
  aprovado: ['#E6F8F1', '#059669'],
  recusado: ['#FFF1F3', '#E11D48'],
  estornado: ['#F1F5FD', '#6B7A90'],
  expirado: ['#EEF1F7', '#6B7A90'],
};

const COR_ETAPA: Record<EtapaProducao, [string, string]> = {
  fila: ['#E4F8FC', '#0891B2'],
  impressao: ['#EAF0FF', '#2563EB'],
  acabamento: ['#EDEBFE', '#6366F1'],
  revisao: ['#FEF3E2', '#B45309'],
  pronto: ['#E6F8F1', '#059669'],
};

const COR_ENVIO: Record<EstadoExpedicao, [string, string]> = {
  aguardando: ['#EEF1F7', '#6B7A90'],
  postado: ['#EAF0FF', '#2563EB'],
  em_transito: ['#E4F8FC', '#0891B2'],
  entregue: ['#E6F8F1', '#047857'],
  devolvido: ['#FFF1F3', '#E11D48'],
};

const selo = ([bg, cor]: [string, string]) =>
  `padding:6px 12px;border-radius:999px;background:${bg};color:${cor};` +
  'font-size:12.5px;font-weight:600;white-space:nowrap;width:max-content';

const BOTAO =
  'white-space:nowrap;height:44px;padding:0 18px;display:flex;align-items:center;gap:9px;' +
  'border:1px solid #E6EAF2;border-radius:14px;background:#FFFFFF;color:#0B1220;' +
  'font-family:inherit;font-size:14px;font-weight:600;cursor:pointer';

const BOTAO_PRIMARIO =
  'white-space:nowrap;height:44px;padding:0 18px;display:flex;align-items:center;gap:9px;' +
  'border:0;border-radius:14px;background:linear-gradient(135deg,#2563EB,#06B6D4);color:#FFFFFF;' +
  'font-family:inherit;font-size:14px;font-weight:700;cursor:pointer;' +
  'box-shadow:0 8px 20px rgba(37,99,235,.28)';

const BOTAO_PEQUENO =
  'padding:8px 14px;border:1px solid #E6EAF2;border-radius:999px;background:#FFFFFF;' +
  'color:#46536A;font-family:inherit;font-size:12.5px;font-weight:600;cursor:pointer';

/** O caminho normal do pedido, na ordem — é a régua do topo da tela. */
const FLUXO: EstadoPedido[] = [
  'rascunho',
  'aguardando_pagamento',
  'pago',
  'em_producao',
  'pronto',
  'enviado',
  'entregue',
];

export default function PedidoDoDesign({
  painel,
  dados,
}: {
  painel: PainelDaLoja;
  dados: PedidoDetalhado;
}) {
  const router = useRouter();
  const v = useDashboardDesign({ ativo: 1, rotas: ROTAS_LOJISTA, painel });
  const [, iniciar] = useTransition();

  const { pedido, itens, producao, expedicao, pagamentos } = dados;
  const ficha = producao[0] ?? null;
  const envio = expedicao[0] ?? null;
  const proximo = PROXIMO_ESTADO[pedido.estado];
  const cancelado = pedido.estado === 'cancelado';

  const aprovado = pagamentos
    .filter((p) => p.estado === 'aprovado')
    .reduce((t, p) => t + Number(p.valor || 0), 0);
  const falta = Number(pedido.total) - aprovado;

  /** Toda ação é a mesma coisa: monta o FormData, grava, recarrega o dado. */
  const acao = (fn: (fd: FormData) => Promise<unknown>, campos: Record<string, string>) => () => {
    const fd = new FormData();
    for (const [k, val] of Object.entries(campos)) fd.set(k, val);
    iniciar(async () => {
      await fn(fd);
      router.refresh();
    });
  };

  // A posição no fluxo comanda a régua do topo. Pedido cancelado sai do
  // fluxo: nenhuma etapa fica acesa, e o aviso vermelho explica por quê.
  const posicao = cancelado ? -1 : FLUXO.indexOf(pedido.estado);

  const etapas = FLUXO.map((id, i) => {
    const feito = posicao > i;
    const atual = posicao === i;
    return {
      titulo: termo(ESTADOS_PEDIDO, id).rotulo,
      barra:
        'height:6px;border-radius:999px;background:' +
        (atual ? 'linear-gradient(90deg,#2563EB,#06B6D4)' : feito ? '#2563EB' : '#EEF1F7'),
      tituloEstilo:
        `margin:0;font-size:13px;font-weight:${atual ? 700 : 600};color:` +
        (feito || atual ? '#0B1220' : '#9AA7BC'),
      // O banco não guarda a data de cada estado — só a do último. Dizer
      // "concluído em tal dia" seria invenção; o que se sabe é a posição.
      nota: atual ? dataHora(pedido.atualizado_em) : feito ? 'concluído' : 'pendente',
    };
  });

  // Histórico: só evento com data no banco. Nada é deduzido.
  const eventos: { titulo: string; quando: string | null; cor: string }[] = [
    { titulo: `Pedido #${pedido.numero} aberto`, quando: pedido.criado_em, cor: '#2563EB' },
    ...(pedido.visto_em ? [{ titulo: 'Aberto pela loja', quando: pedido.visto_em, cor: '#9AA7BC' }] : []),
    ...pagamentos.map((p) => ({
      titulo: `Pagamento ${termo(ESTADOS_PAGAMENTO, p.estado).rotulo.toLowerCase()} · ${moeda(p.valor)}`,
      quando: p.pago_em ?? p.criado_em,
      cor: COR_PAGAMENTO[p.estado]?.[1] ?? '#9AA7BC',
    })),
    ...producao.map((l) => ({
      titulo: `Produção: ${termo(ETAPAS_PRODUCAO, l.etapa).rotulo.toLowerCase()}`,
      quando: l.atualizado_em,
      cor: COR_ETAPA[l.etapa]?.[1] ?? '#9AA7BC',
    })),
    ...expedicao.map((e) => ({
      titulo: `Entrega: ${termo(ESTADOS_EXPEDICAO, e.estado).rotulo.toLowerCase()}`,
      quando: e.entregue_em ?? e.postado_em ?? e.atualizado_em,
      cor: COR_ENVIO[e.estado]?.[1] ?? '#9AA7BC',
    })),
  ].sort((a, b) => (b.quando ?? '').localeCompare(a.quando ?? ''));

  const clienteNome = pedido.clientes?.nome ?? 'Sem cliente vinculado';

  // O selo de pagamento do topo é o que o dinheiro diz, não o que o estado do
  // pedido sugere: pedido "em produção" com cobrança recusada precisa gritar.
  const [pagRotulo, pagCor]: [string, [string, string]] =
    aprovado >= Number(pedido.total) && aprovado > 0
      ? ['Pago', COR_PAGAMENTO.aprovado]
      : aprovado > 0
        ? [`Parcial · falta ${moeda(falta)}`, COR_PAGAMENTO.pendente]
        : pagamentos.length
          ? [
              termo(ESTADOS_PAGAMENTO, pagamentos[0].estado).rotulo,
              COR_PAGAMENTO[pagamentos[0].estado] ?? COR_PAGAMENTO.pendente,
            ]
          : ['Sem cobrança', COR_PAGAMENTO.expirado];

  return (
    <div className="om-app">
      <style dangerouslySetInnerHTML={{ __html: CSS_PSEUDO }} />
      <PedidoDesign
        v={{
          ...v,

          // ---------------- topo ----------------
          titulo: `Pedido #${pedido.numero}`,
          estado: termo(ESTADOS_PEDIDO, pedido.estado).rotulo,
          seloEstado: selo(COR_ESTADO[pedido.estado] ?? COR_ESTADO.rascunho),
          pagamento: pagRotulo,
          seloPagamento: selo(pagCor),
          seloNovo: pedido.visto_em ? 'display:none' : selo(['#EAF0FF', '#2563EB']),
          subtitulo:
            `Aberto em ${dataHora(pedido.criado_em)} · canal ${pedido.canal}` +
            ` · atualizado em ${dataHora(pedido.atualizado_em)}`,

          btnVisto: pedido.visto_em ? 'display:none' : BOTAO,
          marcarVisto: acao(marcarPedidoVisto, { pedido_id: pedido.id }),
          btnAvancar: proximo ? BOTAO_PRIMARIO : 'display:none',
          rotuloAvancar: proximo
            ? `Avançar para ${termo(ESTADOS_PEDIDO, proximo).rotulo.toLowerCase()}`
            : '',
          avancar: proximo
            ? acao(avancarEstadoPedido, { pedido_id: pedido.id, estado: proximo })
            : () => {},

          aviso: cancelado
            ? `Cancelado: ${pedido.motivo_cancelamento ?? 'sem motivo registrado'}`
            : '',
          avisoEstilo: cancelado
            ? 'margin:0;padding:14px 18px;border-radius:16px;background:#FFF1F3;color:#E11D48;' +
              'font-size:13.5px;font-weight:600'
            : 'display:none',

          etapas,

          // ---------------- itens ----------------
          itensResumo: `${itens.length} ${itens.length === 1 ? 'item' : 'itens'}`,
          itens: itens.map((i) => ({
            descricao: i.descricao,
            detalhe:
              `${i.paginas > 0 ? `${i.paginas} páginas` : 'sem páginas'} · ` +
              `${i.fotos > 0 ? `${i.fotos} fotos` : 'sem fotos'}` +
              (i.projeto_id ? ' · álbum vinculado' : ''),
            quantidade: `${i.quantidade} × ${moeda(i.preco_unit)}`,
            total: moeda(i.total),
          })),
          itensVazio: itens.length
            ? 'display:none'
            : 'margin:0;padding:30px 26px;border-top:1px solid #F4F6FB;text-align:center;' +
              'font-size:13.5px;color:#9AA7BC',

          subtotal: moeda(pedido.subtotal),
          desconto: `− ${moeda(pedido.desconto)}`,
          descontoEstilo: Number(pedido.desconto) > 0 ? 'text-align:right' : 'display:none',
          frete: moeda(pedido.frete),
          total: moeda(pedido.total),

          observacao: pedido.observacao ?? '',
          observacaoEstilo: pedido.observacao
            ? 'margin:0;padding:16px 26px;border-top:1px solid #EEF1F7;font-size:13px;color:#46536A'
            : 'display:none',

          // ---------------- produção ----------------
          producaoEtapa: ficha ? termo(ETAPAS_PRODUCAO, ficha.etapa).rotulo : 'Fora da produção',
          producaoSelo: selo(ficha ? COR_ETAPA[ficha.etapa] : ['#EEF1F7', '#6B7A90']),
          producaoTiles: ficha
            ? 'display:grid;grid-template-columns:repeat(auto-fit,minmax(178px,1fr));gap:12px'
            : 'display:none',
          producaoQuando: ficha ? dataHora(ficha.atualizado_em) : '—',
          producaoResponsavel: ficha?.responsavel ?? 'Sem responsável',
          producaoForaEstilo: ficha
            ? 'display:none'
            : 'margin:0;font-size:13.5px;color:#6B7A90',
          btnFila: ficha ? 'display:none' : BOTAO,
          colocarNaFila: acao(colocarNaFila, { pedido_id: pedido.id }),
          etapasDisponiveis: ficha
            ? ETAPAS_PRODUCAO.filter((e) => e.id !== ficha.etapa).map((e) => ({
                rotulo: e.rotulo,
                estilo: BOTAO_PEQUENO,
                ir: acao(moverEtapaProducao, { producao_id: ficha.id, etapa: e.id }),
              }))
            : [],

          historico: eventos.map((e) => ({
            titulo: e.titulo,
            quando: dataHora(e.quando),
            ponto:
              `width:10px;height:10px;border-radius:999px;flex:0 0 auto;margin-top:5px;` +
              `background:${e.cor};box-shadow:0 0 0 4px ${e.cor}1F`,
          })),

          // ---------------- cliente ----------------
          clienteIniciais: clienteNome.slice(0, 2).toUpperCase(),
          clienteNome,
          clienteNota: `Pedido pelo canal ${pedido.canal}`,
          clienteEmail: pedido.clientes?.email ?? '—',
          vendedor: pedido.vendedores?.nome ?? 'Sem vendedor',
          prazo: pedido.prazo_em ? dataCurta(pedido.prazo_em) : 'Não definido',

          // ---------------- pagamento ----------------
          pagoTitulo: 'Recebido',
          pagoValor: moeda(aprovado),
          pagoNota:
            falta > 0 ? `Falta ${moeda(falta)} de ${moeda(pedido.total)}` : 'Pedido quitado',
          pagamentos: pagamentos.map((p) => ({
            estado: `${termo(ESTADOS_PAGAMENTO, p.estado).rotulo} · ${termo(METODOS_PAGAMENTO, p.metodo).rotulo}`,
            selo: selo(COR_PAGAMENTO[p.estado] ?? COR_PAGAMENTO.pendente),
            valor: moeda(p.valor),
            nota:
              (p.provedor ? `${p.provedor} · ` : '') +
              (p.pago_em ? `pago em ${dataHora(p.pago_em)}` : `criado em ${dataHora(p.criado_em)}`) +
              (p.id_externo ? ` · ${p.id_externo}` : ''),
          })),
          pagamentosVazio: pagamentos.length
            ? 'display:none'
            : 'margin:0;font-size:13px;color:#9AA7BC',

          // ---------------- entrega ----------------
          envioEstado: envio ? termo(ESTADOS_EXPEDICAO, envio.estado).rotulo : 'Sem envio',
          envioSelo: selo(envio ? COR_ENVIO[envio.estado] : ['#EEF1F7', '#6B7A90']),
          envioForaEstilo: envio ? 'display:none' : 'margin:0 0 14px;font-size:13.5px;color:#6B7A90',
          btnEnvio: envio ? 'display:none' : BOTAO,
          abrirEnvio: acao(abrirExpedicao, { pedido_id: pedido.id }),
          envioFormEstilo: envio ? '' : 'display:none',
          transportadora: envio?.transportadora ?? '',
          rastreio: envio?.rastreio ?? '',
          salvarRastreio: (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if (!envio) return;
            const fd = new FormData(e.currentTarget);
            fd.set('expedicao_id', envio.id);
            iniciar(async () => {
              await salvarRastreio(fd);
              router.refresh();
            });
          },
          estadosEnvio: envio
            ? ESTADOS_EXPEDICAO.filter((e) => e.id !== envio.estado).map((e) => ({
                rotulo: e.rotulo,
                estilo: BOTAO_PEQUENO,
                ir: acao(definirEstadoExpedicao, { expedicao_id: envio.id, estado: e.id }),
              }))
            : [],

          // ---------------- ordem de serviço ----------------
          osNumero: `#${pedido.numero}`,
          osTitulo: `${itens.length} ${itens.length === 1 ? 'peça' : 'peças'} · ${moeda(pedido.total)}`,
          osNota: ficha
            ? `Na produção desde ${dataCurta(ficha.iniciada_em ?? ficha.atualizado_em)}`
            : 'Ainda não entrou na produção',

          // ---------------- cancelamento ----------------
          cancelarEstilo: cancelado
            ? 'display:none'
            : 'background:#FFFFFF;border:1px solid #E6EAF2;border-radius:24px;padding:22px 24px',
          cancelar: (e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const motivo = String(fd.get('motivo') ?? '').trim();
            // A ação exige motivo; sem ele o cancelamento voltaria em erro e a
            // tela pareceria travada. Melhor não deixar sair daqui.
            if (!motivo) return;
            fd.set('pedido_id', pedido.id);
            iniciar(async () => {
              await cancelarPedido(fd);
              router.refresh();
            });
          },
        }}
      />
      <MenuLojista />
    </div>
  );
}
