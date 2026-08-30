'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import ExpedicaoDesign, { CSS_PSEUDO } from '@/components/design/ExpedicaoDesign';
import { useDashboardDesign, type PainelDaLoja } from '@/components/app/useDashboardDesign';
import { ROTAS_LOJISTA } from '@/lib/rotas-lojista';
import MenuLojista from '@/components/app/MenuLojista';
import { reais } from '@/lib/preco';
import {
  ESTADOS_EXPEDICAO,
  dataCurta,
  type EstadoExpedicao,
  type ItemDoPedido,
  type PedidoDaLinha,
} from '@/lib/pedidos-termos';
// Só o tipo: `import type` some na compilação e não puxa o client do Supabase.
import type { EnvioDaLista } from '@/lib/pedidos';
import { abrirExpedicao, definirEstadoExpedicao, salvarRastreio } from '@/app/app/actions-pedidos';

/**
 * Tela de Expedição com o layout do design.
 *
 * A "estação de embalagem" do design bipa a OS, pesa a caixa e manda para uma
 * Zebra. Nada disso existe aqui: o que existe é a ficha de expedição —
 * transportadora, rastreio e estado. O painel grande virou o envio em foco,
 * com os itens reais do pedido e os dois campos que a ação grava; a etiqueta
 * ao lado mostra o endereço que está no banco, não um endereço de exemplo.
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
  // Depois de entregue só resta a devolução — é o único movimento real que
  // sobra, então é ele que o botão passa a oferecer.
  entregue: 'devolvido',
};

const selo = (estado: EstadoExpedicao, tamanho = '12px') => {
  const [bg, cor] = SELO[estado] ?? SELO.aguardando;
  return (
    `white-space:nowrap;padding:6px 11px;border-radius:999px;background:${bg};color:${cor};` +
    `font-size:${tamanho};font-weight:600;width:max-content`
  );
};

const rotulo = (estado: EstadoExpedicao) =>
  ESTADOS_EXPEDICAO.find((e) => e.id === estado)?.rotulo ?? estado;

const iniciais = (nome: string | null | undefined) =>
  (nome ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('') || '—';

const BOTAO_SEC =
  'white-space:nowrap;flex:1;height:44px;border:1px solid #E6EAF2;border-radius:14px;background:#FFFFFF;' +
  'color:#46536A;font-family:inherit;font-size:13.5px;font-weight:600;cursor:pointer';

export default function ExpedicaoDoDesign({
  painel,
  envios,
  porEstado,
  semEnvio,
  itens,
  estado,
}: {
  painel: PainelDaLoja;
  /** Todos os envios da loja; a aba filtra aqui mesmo, sem nova consulta. */
  envios: EnvioDaLista[];
  porEstado: Record<string, number>;
  semEnvio: PedidoDaLinha[];
  itens: Record<string, ItemDoPedido[]>;
  estado: string;
}) {
  const router = useRouter();
  const v = useDashboardDesign({ ativo: 3, rotas: ROTAS_LOJISTA, painel });
  const [ocupado, iniciar] = useTransition();
  const [busca, setBusca] = useState('');

  const lista = estado ? envios.filter((e) => e.estado === estado) : envios;

  const [focoId, setFocoId] = useState<string | null>(null);
  const foco = envios.find((e) => e.id === focoId) ?? lista[0] ?? null;

  /* Transportadora e rastreio são editáveis antes de postar. O rascunho é
   * guardado com o id do envio: trocar de foco não pode levar o texto digitado
   * para a caixa de outro cliente. */
  const [rascunho, setRascunho] = useState<{ id: string; transportadora: string; rastreio: string } | null>(null);
  const campo =
    rascunho && foco && rascunho.id === foco.id
      ? rascunho
      : {
          id: foco?.id ?? '',
          transportadora: foco?.transportadora ?? '',
          rastreio: foco?.rastreio ?? '',
        };
  const editar = (mudanca: Partial<typeof campo>) =>
    setRascunho({ ...campo, id: foco?.id ?? '', ...mudanca });

  const comCampos = (fd: FormData) => {
    fd.set('expedicao_id', campo.id);
    fd.set('transportadora', campo.transportadora);
    fd.set('rastreio', campo.rastreio);
    return fd;
  };

  const salvar = () =>
    iniciar(async () => {
      await salvarRastreio(comCampos(new FormData()));
      setRascunho(null);
      router.refresh();
    });

  const mover = (destino: EstadoExpedicao) => {
    const fd = comCampos(new FormData());
    fd.set('estado', destino);
    iniciar(async () => {
      await definirEstadoExpedicao(fd);
      setRascunho(null);
      router.refresh();
    });
  };

  const abrir = (pedidoId: string) => {
    const fd = new FormData();
    fd.set('pedido_id', pedidoId);
    iniciar(async () => {
      await abrirExpedicao(fd);
      router.refresh();
    });
  };

  const irPara = (id: string) => router.push(id ? `/expedicao?estado=${id}` : '/expedicao');

  /** Acha o envio pelo número do pedido — o que o lojista tem na mão é a OS. */
  const localizar = () => {
    const n = Number(busca.replace(/[^\d]/g, ''));
    const achado = envios.find((e) => e.pedidos?.numero === n);
    if (achado) {
      setFocoId(achado.id);
      setBusca('');
    }
  };

  const itensDoFoco = foco ? (itens[foco.pedido_id] ?? []) : [];
  const end = foco?.endereco ?? null;
  const linhaEndereco =
    end && (end.rua || end.cidade)
      ? [
          [end.rua, end.numero].filter(Boolean).join(', '),
          [end.cidade, end.uf].filter(Boolean).join(', ') + (end.cep ? ` · ${end.cep}` : ''),
        ]
      : ['Endereço não cadastrado neste envio', ''];

  const abas: [string, string][] = [
    ['', 'Todos'],
    ...ESTADOS_EXPEDICAO.map((e) => [e.id, e.rotulo] as [string, string]),
  ];
  const totalGeral = Object.values(porEstado).reduce((t, n) => t + n, 0);

  /* Carga por transportadora. O design tinha "Correios 14h" e "Loggi 17h"
   * escritos à mão; horário de coleta a plataforma não sabe. O que ela sabe é
   * quantas caixas foram por cada uma e quantas já chegaram. */
  const porTransportadora = new Map<string, EnvioDaLista[]>();
  for (const e of envios) {
    const chave = e.transportadora ?? 'Sem transportadora';
    porTransportadora.set(chave, [...(porTransportadora.get(chave) ?? []), e]);
  }

  const devolvidos = porEstado.devolvido ?? 0;
  const proximo = foco ? PROXIMO[foco.estado] : undefined;

  return (
    <div className="om-app">
      <style dangerouslySetInnerHTML={{ __html: CSS_PSEUDO }} />
      <ExpedicaoDesign
        v={{
          ...v,

          resumo: totalGeral
            ? `${totalGeral} ${totalGeral === 1 ? 'envio' : 'envios'} · ` +
              `${porEstado.aguardando ?? 0} aguardando postagem · ` +
              `${(porEstado.postado ?? 0) + (porEstado.em_transito ?? 0)} a caminho` +
              (devolvidos ? ` · ${devolvidos} ${devolvidos === 1 ? 'devolvido' : 'devolvidos'}` : '')
            : 'Nenhum envio ainda. A ficha nasce quando o pedido fica pronto.',

          rotuloAbrir: ocupado ? 'Aguarde…' : `Abrir ${semEnvio.length} envio${semEnvio.length === 1 ? '' : 's'}`,
          btnAbrir: semEnvio.length
            ? 'white-space:nowrap;height:44px;padding:0 18px;display:flex;align-items:center;gap:9px;border:0;' +
              'border-radius:14px;background:linear-gradient(135deg,#2563EB,#06B6D4);color:#FFFFFF;font-family:inherit;' +
              'font-size:14px;font-weight:700;cursor:pointer;box-shadow:0 8px 20px rgba(37,99,235,.28)'
            : 'display:none',
          abrirTodos: () => semEnvio.forEach((p) => abrir(p.id)),

          ...Object.fromEntries(
            abas.flatMap(([id, texto], i) => {
              const on = estado === id;
              const n = id ? (porEstado[id] ?? 0) : totalGeral;
              return [
                [`rot${i}`, `${texto} · ${n}`],
                [
                  `per${i}`,
                  'padding:8px 16px;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;' +
                    'white-space:nowrap;transition:all .16s;' +
                    (on
                      ? 'background:linear-gradient(135deg,#2563EB,#06B6D4);color:#FFFFFF;box-shadow:0 6px 14px rgba(37,99,235,.24)'
                      : 'background:transparent;color:#6B7A90'),
                ],
                [`setP${i}`, () => irPara(id)],
              ];
            }),
          ),

          // ---------------------------------------------------------------- envio em foco
          focoSub: foco
            ? `Pedido #${foco.pedidos?.numero} · ${foco.pedidos?.clientes?.nome ?? 'sem cliente'} · ` +
              `atualizado ${dataCurta(foco.atualizado_em)}`
            : 'Escolha um envio na lista abaixo para conferir e despachar.',
          focoEstado: foco ? rotulo(foco.estado) : 'nenhum envio',
          focoSelo: foco ? selo(foco.estado, '12.5px') : selo('aguardando', '12.5px'),

          busca,
          setBusca: (e: React.ChangeEvent<HTMLInputElement>) => setBusca(e.target.value),
          buscaTecla: (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') localizar();
          },
          localizar,

          itensTitulo: foco
            ? `Itens do pedido · ${itensDoFoco.length}`
            : 'Itens do pedido',
          itens: itensDoFoco.map((i) => ({
            descricao: i.descricao,
            detalhe:
              `${i.quantidade} un · ${reais(i.total)}` +
              (i.paginas ? ` · ${i.paginas} páginas` : '') +
              (i.fotos ? ` · ${i.fotos} fotos` : ''),
          })),
          itensVazio: itensDoFoco.length
            ? 'display:none'
            : 'margin:0;padding:16px;text-align:center;font-size:13px;color:#9AA7BC',
          itensTextoVazio: foco ? 'Este pedido não tem itens lançados.' : 'Nenhum envio em foco.',

          transportadora: campo.transportadora,
          setTransportadora: (e: React.ChangeEvent<HTMLInputElement>) =>
            editar({ transportadora: e.target.value }),
          rastreio: campo.rastreio,
          setRastreio: (e: React.ChangeEvent<HTMLInputElement>) => editar({ rastreio: e.target.value }),
          semFoco: !foco,

          // ---------------------------------------------------------------- etiqueta
          remetente: foco
            ? `Pedido #${foco.pedidos?.numero} · aberto ${dataCurta(foco.pedidos?.criado_em)}`
            : '—',
          etiquetaModal: campo.transportadora || '—',
          etiquetaSelo:
            'padding:4px 9px;border-radius:7px;background:#0B1220;color:#FFFFFF;font-size:10.5px;font-weight:700;white-space:nowrap',
          destinatario: foco?.pedidos?.clientes?.nome ?? 'Sem cliente vinculado',
          enderecoLinha1: linhaEndereco[0],
          enderecoLinha2: linhaEndereco[1],
          temRastreio: Boolean(campo.rastreio),
          // As barras são decorativas, mas derivam do próprio código: assim o
          // desenho é estável entre servidor e navegador e muda com o objeto.
          barras: [...campo.rastreio].map((ch) => ({
            estilo: `flex:1;height:${45 + ((ch.charCodeAt(0) * 7) % 56)}%;background:#0B1220`,
          })),
          rastreioEtiqueta: campo.rastreio || '—',

          rotuloSecundario: ocupado ? '…' : 'Salvar dados',
          btnSecundario: foco ? BOTAO_SEC : `${BOTAO_SEC};opacity:.45;pointer-events:none`,
          acaoSecundaria: () => foco && salvar(),
          rotuloPrincipal: proximo ? `Marcar ${rotulo(proximo).toLowerCase()}` : 'Envio encerrado',
          btnPrincipal:
            foco && proximo
              ? 'white-space:nowrap;flex:1;height:44px;border:0;border-radius:14px;font-family:inherit;' +
                'font-size:13.5px;font-weight:700;cursor:pointer;color:#FFFFFF;' +
                (proximo === 'devolvido'
                  ? 'background:#E11D48;box-shadow:0 8px 18px rgba(225,29,72,.26)'
                  : 'background:linear-gradient(135deg,#2563EB,#06B6D4);box-shadow:0 8px 18px rgba(37,99,235,.26)')
              : 'display:none',
          acaoPrincipal: () => proximo && mover(proximo),

          // ---------------------------------------------------------------- painéis laterais
          transportadoras: [...porTransportadora.entries()].map(([nome, grupo]) => {
            const entregues = grupo.filter((e) => e.estado === 'entregue').length;
            const pct = Math.round((entregues / grupo.length) * 100);
            return {
              nome,
              chip: `${pct}% entregue`,
              selo:
                'white-space:nowrap;padding:4px 9px;border-radius:999px;font-size:11px;font-weight:700;' +
                (pct === 100 ? 'background:#E6F8F1;color:#059669' : 'background:#FEF3E2;color:#B45309'),
              detalhe: `${entregues} entregues`,
              total: `de ${grupo.length}`,
              barra: `width:${pct}%;height:100%;border-radius:999px;background:linear-gradient(90deg,#2563EB,#06B6D4)`,
            };
          }),
          transportadorasVazio: porTransportadora.size
            ? 'display:none'
            : 'margin:0;padding:16px;text-align:center;font-size:13px;color:#9AA7BC',

          semEnvio: semEnvio.map((p) => ({
            iniciais: iniciais(p.clientes?.nome),
            cliente: p.clientes?.nome ?? 'Sem cliente vinculado',
            detalhe: `#${p.numero} · ${reais(p.total)}`,
            abrirEnvio: () => abrir(p.id),
          })),
          semEnvioResumo: `${semEnvio.length} aguardando`,
          semEnvioSelo:
            'white-space:nowrap;padding:5px 10px;border-radius:999px;font-size:11.5px;font-weight:700;' +
            (semEnvio.length ? 'background:#FEF3E2;color:#B45309' : 'background:#E6F8F1;color:#059669'),
          semEnvioVazio: semEnvio.length
            ? 'display:none'
            : 'margin:0;padding:16px;text-align:center;font-size:13px;color:#9AA7BC',

          devolvidosValor: `${devolvidos} ${devolvidos === 1 ? 'devolvido' : 'devolvidos'}`,
          devolvidosTexto: devolvidos
            ? 'Caixas que voltaram. A data de entrega é apagada na devolução, então o histórico não mente.'
            : 'Nenhuma caixa voltou. O estado devolvido é gravado na própria ficha do envio.',
          verDevolvidos: () => irPara('devolvido'),

          // ---------------------------------------------------------------- lista
          listaResumo: `${lista.length} de ${envios.length} ${envios.length === 1 ? 'envio' : 'envios'}`,
          envios: lista.map((e) => ({
            marca:
              'width:18px;height:18px;border-radius:6px;' +
              (foco?.id === e.id
                ? 'border:1.5px solid #2563EB;background:#2563EB'
                : 'border:1.5px solid #CBD5E6;background:transparent'),
            numero: `#${e.pedidos?.numero ?? '—'}`,
            href: `/pedidos/${e.pedidos?.id ?? ''}`,
            cliente: e.pedidos?.clientes?.nome ?? 'Sem cliente vinculado',
            transportadora: e.transportadora ?? '—',
            rastreio: e.rastreio ?? '—',
            valor: reais(e.pedidos?.total ?? 0),
            quando: dataCurta(e.atualizado_em),
            estado: rotulo(e.estado),
            selo: selo(e.estado),
            focar: () => setFocoId(e.id),
          })),
          enviosVazio: lista.length
            ? 'display:none'
            : 'margin:0;padding:44px;text-align:center;font-size:13.5px;color:#9AA7BC',
          enviosTextoVazio: estado
            ? 'Nenhum envio neste estado. Escolha outra aba.'
            : 'Nenhum envio ainda. Um pedido pronto abre a ficha de expedição.',
        }}
      />
      <MenuLojista />
    </div>
  );
}
