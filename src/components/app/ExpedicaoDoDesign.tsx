'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import ExpedicaoDesign, { CSS_PSEUDO } from '@/components/design/ExpedicaoDesign';
import { useDashboardDesign } from '@/components/app/useDashboardDesign';
import {
  ESTADOS_EXPEDICAO,
  dataCurta,
  type EstadoExpedicao,
  type ItemDoPedido,
} from '@/lib/pedidos-termos';
// Só o tipo: `import type` some na compilação e não puxa o client do Supabase.
import type { EnvioDaLista } from '@/lib/pedidos';
import { definirEstadoExpedicao, salvarRastreio } from '@/app/app/actions-pedidos';

/**
 * Expedição e embalagem, com o layout novo do Claude Design.
 *
 * O desenho traz uma estação de embalagem, o painel de coletas, as retiradas
 * no balcão, o cartão de ocorrências e a tabela de volumes do dia.
 *
 * O que o banco tem é a ficha de expedição: transportadora, rastreio, estado,
 * endereço e as datas. Então:
 *
 * - a **estação** é o envio em foco. "Bipar a OS" é procurar pelo número do
 *   pedido; conferir os itens é listar `pedido_itens`; peso e caixa não
 *   existem em lugar nenhum e deram lugar aos dois campos que a ação grava —
 *   transportadora e rastreio;
 * - **coletas** não são horários de Correios e Loggi (não há agenda de coleta
 *   no sistema): é a carga por transportadora, com quantos volumes já têm
 *   rastreio;
 * - **retiradas no balcão** são os envios cuja transportadora diz retirada;
 * - **ocorrências** são os envios devolvidos;
 * - **imprimir** é o `print` do navegador sobre a prévia que está na tela. Não
 *   há impressora térmica integrada, e fingir uma Zebra pronta seria mentira.
 */

const SELO: Record<EstadoExpedicao, [string, string]> = {
  aguardando: ['#EEF1F7', '#6B7A90'],
  postado: ['#EAF0FF', '#2563EB'],
  em_transito: ['#E4F8FC', '#0891B2'],
  entregue: ['#E6F8F1', '#059669'],
  devolvido: ['#FFF1F3', '#E11D48'],
};

/** O caminho normal da caixa. É o que o botão principal oferece. */
const PROXIMO: Partial<Record<EstadoExpedicao, EstadoExpedicao>> = {
  aguardando: 'postado',
  postado: 'em_transito',
  em_transito: 'entregue',
  entregue: 'devolvido',
};

/** As cinco abas do desenho, cada uma sobre um recorte real da lista. */
const ABAS = ['embalar', 'etiquetados', 'coletas', 'retiradas', 'ocorrencias'] as const;
type Aba = (typeof ABAS)[number];

const ROTULO_ABA: Record<Aba, string> = {
  embalar: 'Para embalar',
  etiquetados: 'Etiquetados',
  coletas: 'Coletas',
  retiradas: 'Retiradas',
  ocorrencias: 'Ocorrências',
};

const selo = (estado: EstadoExpedicao) => {
  const [bg, cor] = SELO[estado] ?? SELO.aguardando;
  return (
    `white-space:nowrap;padding:6px 11px;border-radius:999px;background:${bg};color:${cor};` +
    'font-size:12px;font-weight:600;width:max-content'
  );
};

const rotulo = (estado: EstadoExpedicao) =>
  ESTADOS_EXPEDICAO.find((e) => e.id === estado)?.rotulo ?? estado;

const iniciais = (nome: string | null | undefined) =>
  (nome ?? '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('') || '?';

/** Retirada no balcão não é um estado: está escrito na transportadora. */
const ehRetirada = (t: string | null) => /retirad|balc[ãa]o/i.test(t ?? '');

export default function ExpedicaoDoDesign({
  lojaNome,
  envios,
  semEnvio,
  itens,
}: {
  /** Nome da loja, que vai no remetente da etiqueta. */
  lojaNome: string;
  envios: EnvioDaLista[];
  semEnvio: { id: string; numero: number }[];
  itens: Record<string, ItemDoPedido[]>;
}) {
  const router = useRouter();
  const v = useDashboardDesign();
  const [, iniciar] = useTransition();

  const [aba, setAba] = useState<Aba>('embalar');
  const [foco, setFoco] = useState<string | null>(envios[0]?.id ?? null);
  const [busca, setBusca] = useState('');
  const [marcados, setMarcados] = useState<string[]>([]);
  const [modal, setModal] = useState(false);
  const [transportadora, setTransportadora] = useState<string | null>(null);
  const [rastreio, setRastreio] = useState<string | null>(null);

  const emFoco = envios.find((e) => e.id === foco) ?? envios[0] ?? null;

  // Enquanto o operador não digitar, os campos mostram o que está gravado.
  const campo = {
    transportadora: transportadora ?? emFoco?.transportadora ?? '',
    rastreio: rastreio ?? emFoco?.rastreio ?? '',
  };

  /** Cada aba é um recorte da mesma lista; nenhuma delas volta ao banco. */
  const daAba = (e: EnvioDaLista, id: Aba) => {
    switch (id) {
      case 'embalar':
        return e.estado === 'aguardando' && !e.rastreio;
      case 'etiquetados':
        return Boolean(e.rastreio) && e.estado === 'aguardando';
      case 'coletas':
        return e.estado === 'postado' || e.estado === 'em_transito';
      case 'retiradas':
        return ehRetirada(e.transportadora) && e.estado !== 'entregue';
      case 'ocorrencias':
        return e.estado === 'devolvido';
    }
  };

  const visiveis = envios.filter((e) => daAba(e, aba));
  const devolvidos = envios.filter((e) => e.estado === 'devolvido');
  const retiradas = envios.filter((e) => ehRetirada(e.transportadora) && e.estado !== 'entregue');
  const paraDespachar = envios.filter((e) => e.estado === 'aguardando').length;

  const focar = (id: string) => {
    setFoco(id);
    setTransportadora(null);
    setRastreio(null);
  };

  const gravar = (extra?: EstadoExpedicao) => {
    if (!emFoco) return;
    const fd = new FormData();
    fd.set('expedicao_id', emFoco.id);
    fd.set('transportadora', campo.transportadora);
    fd.set('rastreio', campo.rastreio);
    iniciar(async () => {
      await salvarRastreio(fd);
      if (extra) {
        const fd2 = new FormData();
        fd2.set('expedicao_id', emFoco.id);
        fd2.set('estado', extra);
        await definirEstadoExpedicao(fd2);
      }
      setTransportadora(null);
      setRastreio(null);
      router.refresh();
    });
  };

  // ------------------------------------------------------------- etiqueta
  const end = emFoco?.endereco ?? null;
  const linha1 = end
    ? [end.rua, end.numero].filter(Boolean).join(', ') +
      (end.complemento ? ` · ${end.complemento}` : '')
    : 'Sem endereço gravado';
  const linha2 = end
    ? [[end.bairro, end.cidade].filter(Boolean).join(' · '), end.uf, end.cep]
        .filter(Boolean)
        .join(' · ')
    : 'Grave o endereço no pedido para a etiqueta sair certa';

  // -------------------------------------------------- carga por transportadora
  const nomes = Array.from(
    new Set(envios.map((e) => (e.transportadora || 'Sem transportadora').trim())),
  );
  const coletas = nomes
    .map((nome) => {
      const lista = envios.filter((e) => (e.transportadora || 'Sem transportadora').trim() === nome);
      const prontos = lista.filter((e) => e.rastreio).length;
      const pct = lista.length ? Math.round((prontos / lista.length) * 100) : 0;
      const atrasado = pct < 50;
      return {
        nome,
        total: lista.length,
        titulo: nome,
        seloRotulo: `${lista.length} ${lista.length === 1 ? 'volume' : 'volumes'}`,
        selo:
          'white-space:nowrap;padding:4px 9px;border-radius:999px;font-size:11px;font-weight:700;' +
          (atrasado ? 'background:#FEF3E2;color:#B45309' : 'background:#F1F5FD;color:#46536A'),
        resumo: `${prontos} de ${lista.length} com código de rastreio`,
        pct: `${pct}%`,
        pctEstilo: `font-size:13px;font-weight:700;color:${atrasado ? '#B45309' : '#2563EB'}`,
        barra:
          `width:${pct}%;height:100%;border-radius:999px;background:` +
          (atrasado
            ? 'linear-gradient(90deg,#F59E0B,#FBBF24)'
            : 'linear-gradient(90deg,#2563EB,#06B6D4)'),
      };
    })
    .sort((a, b) => b.total - a.total);

  // -------------------------------------------------------------- volumes
  const volume = (e: EnvioDaLista) => {
    const marcado = marcados.includes(e.id);
    return {
      volume: `#${e.pedidos.numero}`,
      pedido: `#${e.pedidos.numero}`,
      href: `/pedidos/${e.pedido_id}`,
      cliente: e.pedidos.clientes?.nome ?? 'Sem cliente',
      transportadora: e.transportadora || '—',
      rastreio: e.rastreio || '—',
      itens: String(itens[e.pedido_id]?.length ?? 0),
      estado: rotulo(e.estado),
      selo: selo(e.estado),
      check:
        'width:18px;height:18px;border-radius:6px;display:flex;align-items:center;justify-content:center;' +
        `border:1.5px solid ${marcado ? '#2563EB' : '#CBD5E6'};` +
        `background:${marcado ? '#2563EB' : 'transparent'};color:${marcado ? '#FFFFFF' : 'transparent'}`,
      marcar: (ev?: React.MouseEvent) => {
        ev?.stopPropagation();
        setMarcados((s) => (s.includes(e.id) ? s.filter((x) => x !== e.id) : [...s, e.id]));
      },
      abrir: () => focar(e.id),
    };
  };

  const selecionados = envios.filter((e) => marcados.includes(e.id));

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS_PSEUDO }} />
      <ExpedicaoDesign
        v={{
          ...v,

          resumo:
            `${paraDespachar} ${paraDespachar === 1 ? 'volume aguardando' : 'volumes aguardando'} despacho` +
            ` · ${envios.length} ${envios.length === 1 ? 'envio aberto' : 'envios abertos'}` +
            (semEnvio.length ? ` · ${semEnvio.length} prontos sem envio` : '') +
            (devolvidos.length ? ` · ${devolvidos.length} devolvidos` : ''),

          imprimirPagina: () => window.print(),
          verOcorrencias: () => setAba('ocorrencias'),
          rotuloOcorrencias: devolvidos.length
            ? `Ocorrências · ${devolvidos.length}`
            : 'Ocorrências',
          btnOcorrencias:
            'white-space:nowrap;height:44px;padding:0 18px;display:flex;align-items:center;gap:9px;' +
            `border:1px solid ${devolvidos.length ? '#FFE0E6' : '#E6EAF2'};border-radius:14px;` +
            `background:${devolvidos.length ? '#FFF1F3' : '#FFFFFF'};color:${devolvidos.length ? '#E11D48' : '#0B1220'};` +
            'font-family:inherit;font-size:14px;font-weight:600;cursor:pointer',

          // ------------------------------------------------------------ abas
          ...Object.fromEntries(
            ABAS.map((id, i) => {
              const n = envios.filter((e) => daAba(e, id)).length;
              return [`aba${i}`, n ? `${ROTULO_ABA[id]} · ${n}` : ROTULO_ABA[id]];
            }),
          ),
          ...Object.fromEntries(ABAS.map((id, i) => [`setP${i}`, () => setAba(id)])),
          ...Object.fromEntries(
            ABAS.map((id, i) => [
              `per${i}`,
              'padding:8px 16px;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;' +
                'white-space:nowrap;transition:all .16s;' +
                (aba === id
                  ? 'background:linear-gradient(135deg,#2563EB,#06B6D4);color:#FFFFFF;box-shadow:0 6px 14px rgba(37,99,235,.24);'
                  : 'background:transparent;color:#6B7A90;'),
            ]),
          ),

          // ------------------------------------------- estação de embalagem
          estacaoNota: emFoco
            ? `Pedido #${emFoco.pedidos.numero} · ${emFoco.pedidos.clientes?.nome ?? 'sem cliente'}`
            : 'Nenhum envio aberto para conferir',
          estacaoEstado: emFoco ? rotulo(emFoco.estado) : 'Sem envio',
          estacaoSelo:
            'display:flex;align-items:center;gap:8px;padding:8px 13px;border-radius:999px;' +
            `font-size:12.5px;font-weight:700;${
              emFoco?.rastreio
                ? 'background:#E6F8F1;color:#059669'
                : 'background:#FEF3E2;color:#B45309'
            }`,
          estacaoPonto:
            `width:8px;height:8px;border-radius:999px;background:${emFoco?.rastreio ? '#10B981' : '#F59E0B'}`,

          busca,
          onBusca: (ev: React.ChangeEvent<HTMLInputElement>) => setBusca(ev.target.value),
          conferir: () => {
            const q = busca.trim().replace(/^#/, '');
            const achado = envios.find((e) => String(e.pedidos.numero) === q);
            if (achado) focar(achado.id);
          },

          itensTitulo: emFoco
            ? `Conferência de itens · ${itens[emFoco.pedido_id]?.length ?? 0}`
            : 'Conferência de itens',
          itens: (emFoco ? (itens[emFoco.pedido_id] ?? []) : []).map((i) => ({
            descricao: i.descricao,
            detalhe:
              `${i.quantidade} un` +
              (i.paginas > 0 ? ` · ${i.paginas} páginas` : '') +
              (i.fotos > 0 ? ` · ${i.fotos} fotos` : ''),
          })),
          itensVazio:
            emFoco && (itens[emFoco.pedido_id]?.length ?? 0) > 0
              ? 'display:none'
              : 'margin:0;font-size:13px;color:#9AA7BC',

          transportadora: campo.transportadora,
          rastreio: campo.rastreio,
          onTransportadora: (ev: React.ChangeEvent<HTMLInputElement>) =>
            setTransportadora(ev.target.value),
          onRastreio: (ev: React.ChangeEvent<HTMLInputElement>) => setRastreio(ev.target.value),

          // ------------------------------------------------------- etiqueta
          remetenteNome: lojaNome,
          remetente: emFoco ? `Envio aberto em ${dataCurta(emFoco.atualizado_em)}` : '—',
          servico: (emFoco?.transportadora || 'SEM').slice(0, 12).toUpperCase(),
          destNome: emFoco?.pedidos.clientes?.nome ?? 'Sem cliente',
          destLinha1: linha1,
          destLinha2: linha2,
          rastreioEtiqueta: emFoco?.rastreio || '—',
          despachar: () => gravar(emFoco ? PROXIMO[emFoco.estado] : undefined),
          rotuloDespachar: emFoco
            ? PROXIMO[emFoco.estado]
              ? `Salvar e marcar ${rotulo(PROXIMO[emFoco.estado]!).toLowerCase()}`
              : 'Salvar rastreio'
            : 'Sem envio',
          btnDespachar: emFoco
            ? 'white-space:nowrap;flex:1;height:44px;border:0;border-radius:14px;' +
              'background:linear-gradient(135deg,#2563EB,#06B6D4);color:#FFFFFF;font-family:inherit;' +
              'font-size:13.5px;font-weight:700;cursor:pointer;box-shadow:0 8px 18px rgba(37,99,235,.26)'
            : 'display:none',

          // ------------------------------------------ carga por transportadora
          coletas,
          coletasVazio: coletas.length ? 'display:none' : 'margin:0;font-size:13px;color:#9AA7BC',

          // ------------------------------------------------------- retiradas
          retiradasRotulo: `${retiradas.length} aguardando`,
          retiradasSelo:
            'white-space:nowrap;padding:5px 10px;border-radius:999px;font-size:11.5px;font-weight:700;' +
            (retiradas.length ? 'background:#FEF3E2;color:#B45309' : 'background:#F1F5FD;color:#46536A'),
          retiradas: retiradas.map((e) => ({
            iniciais: iniciais(e.pedidos.clientes?.nome),
            avatar:
              'width:32px;height:32px;border-radius:10px;background:#EDEBFE;color:#6366F1;font-size:11px;' +
              'font-weight:700;display:flex;align-items:center;justify-content:center;flex:0 0 auto',
            nome: e.pedidos.clientes?.nome ?? 'Sem cliente',
            nota: `#${e.pedidos.numero} · ${rotulo(e.estado).toLowerCase()}`,
            linha:
              'display:flex;align-items:center;gap:12px;padding:12px;border-radius:15px;' +
              'background:#F8FAFE;border:1px solid #EEF1F7',
            href: `/pedidos/${e.pedido_id}`,
          })),
          retiradasVazio: retiradas.length ? 'display:none' : 'margin:0;font-size:13px;color:#9AA7BC',

          // ----------------------------------------------------- ocorrências
          ocorrenciasTitulo: `${devolvidos.length} ${devolvidos.length === 1 ? 'aberta' : 'abertas'}`,
          ocorrenciasTexto: devolvidos.length
            ? `Devolvidos: ${devolvidos.map((e) => `#${e.pedidos.numero}`).join(', ')}.`
            : 'Nenhum envio devolvido. Devolução é o único tipo de ocorrência que o sistema registra hoje.',

          // -------------------------------------------------------- volumes
          volumes: visiveis.map(volume),
          volumesVazio: visiveis.length
            ? 'display:none'
            : 'margin:0;padding:34px 24px;text-align:center;font-size:13.5px;color:#9AA7BC',
          selecionadosRotulo: `${marcados.length} ${marcados.length === 1 ? 'selecionado' : 'selecionados'}`,
          selecionadosEstilo:
            'padding:9px 14px;border-radius:999px;font-size:12.5px;font-weight:700;cursor:pointer;' +
            (marcados.length
              ? 'background:#F1F5FD;border:1px solid #D6E2FC;color:#2563EB'
              : 'background:#F4F7FC;border:1px solid #E6EAF2;color:#9AA7BC'),

          // ---------------------------------------------------------- modal
          openModal: () => setModal(true),
          closeModal: () => setModal(false),
          ov: modal
            ? 'position:fixed;inset:0;z-index:80;background:rgba(11,18,32,.42)'
            : 'display:none',
          sh: modal
            ? 'position:fixed;inset:0;z-index:81;display:flex;align-items:center;justify-content:center;padding:24px;pointer-events:none'
            : 'display:none',
          modalResumo: selecionados.length
            ? `${selecionados.length} ${selecionados.length === 1 ? 'volume selecionado' : 'volumes selecionados'}`
            : 'Nenhum volume selecionado',
          modalContagem: String(selecionados.length),
          modalLinhas: selecionados.map((e) => ({
            volume: `#${e.pedidos.numero}`,
            cliente: e.pedidos.clientes?.nome ?? 'Sem cliente',
            servico: e.transportadora || '—',
          })),
          modalVazio: selecionados.length ? 'display:none' : 'margin:0;font-size:13px;color:#9AA7BC',
          imprimirRotulo: `Imprimir ${selecionados.length} ${selecionados.length === 1 ? 'etiqueta' : 'etiquetas'}`,
        }}
      />
    </>
  );
}
