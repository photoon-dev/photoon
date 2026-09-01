import { FileiraKpi, Lista, Selo, ICONES, serieDiaria, type Tom } from '@/components/app/padroes';
import { reais } from '@/lib/preco';
import type { ItemDaFila } from '@/lib/pedidos';
import type { EtapaProducao } from '@/lib/pedidos-termos';

/**
 * Produção, nos padrões do painel.
 *
 * Usa `FileiraKpi` e `Lista` — os mesmos componentes da tela de Pedidos, com as
 * mesmas medidas. Antes cada tela desenhava o seu cartão, e o painel virava uma
 * colcha de retalhos.
 */

const ETAPAS: [EtapaProducao, string, Tom][] = [
  ['fila', 'Na fila', 'neutro'],
  ['impressao', 'Impressão', 'azul'],
  ['acabamento', 'Acabamento', 'roxo'],
  ['revisao', 'Revisão', 'ambar'],
  ['pronto', 'Pronto', 'verde'],
];

export default function PainelProducaoPadrao({
  fila,
}: {
  fila: Record<EtapaProducao, ItemDaFila[]>;
}) {
  const total = Object.values(fila).flat().length;
  const emAndamento = ETAPAS.slice(1, 4).reduce((t, [e]) => t + (fila[e]?.length ?? 0), 0);

  // A lista mostra a fila inteira em ordem de etapa: é assim que o operador
  // trabalha — termina uma coluna antes de puxar a seguinte.
  const linhas = ETAPAS.flatMap(([etapa, rotulo, tom]) =>
    (fila[etapa] ?? []).map((i) => {
      const p = i.pedidos;
      const cliente = p?.clientes?.nome ?? `Pedido #${p?.numero ?? '—'}`;
      const desde = i.iniciada_em ?? i.atualizado_em;
      const dias = desde
        ? Math.floor((Date.now() - new Date(desde).getTime()) / 86_400_000)
        : null;

      return {
        id: i.id,
        iniciais: cliente.slice(0, 2).toUpperCase(),
        tomAvatar: tom,
        titulo: cliente,
        subtitulo: `#${p?.numero ?? '—'}`,
        href: p?.id ? `/pedidos/${p.id}` : undefined,
        celulas: [
          <Selo key="e" texto={rotulo} tom={tom} />,
          i.responsavel ?? <span className="text-muted-2">sem responsável</span>,
          p ? <strong className="font-bold">{reais(p.total)}</strong> : '—',
          dias == null ? (
            '—'
          ) : (
            <span className={dias >= 5 ? 'font-semibold text-coral' : 'text-muted'}>
              {dias === 0 ? 'hoje' : `${dias} d`}
            </span>
          ),
          p?.prazo_em
            ? new Date(p.prazo_em + 'T12:00:00').toLocaleDateString('pt-BR', {
                day: 'numeric',
                month: 'short',
              })
            : '—',
        ],
      };
    }),
  );

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="m-0 text-[12px] font-bold uppercase tracking-[1.6px] text-muted-2">
          Operação · Produção
        </p>
        <h1 className="m-0 mt-1.5 text-[32px] font-extrabold leading-[1.15] tracking-[-.8px]">
          Produção
        </h1>
        <p className="m-0 mt-2 text-[14.5px] text-muted">
          {total === 0
            ? 'Nada na fábrica agora.'
            : `${total} ${total === 1 ? 'peça' : 'peças'} na fábrica · ${emAndamento} em andamento`}
        </p>
      </div>

      <FileiraKpi
        cartoes={ETAPAS.map(([etapa, rotulo, tom]) => ({
          rotulo,
          valor: fila[etapa]?.length ?? 0,
          tom,
          icone: etapa === 'pronto' ? ICONES.caixa : ICONES.producao,
          // A faísca mostra quando as peças entraram nesta etapa.
          serie: serieDiaria((fila[etapa] ?? []).map((i) => i.atualizado_em)),
          nota:
            etapa === 'fila'
              ? (fila.fila?.length ?? 0) > 0 ? 'aguardando começar' : 'fila vazia'
              : etapa === 'pronto'
                ? 'para expedir'
                : `${fila[etapa]?.length ?? 0} em curso`,
        }))}
      />

      <Lista
        colunas={[
          { titulo: 'Peça', largura: 'minmax(220px,1.6fr)' },
          { titulo: 'Etapa', largura: 'minmax(130px,1fr)' },
          { titulo: 'Responsável', largura: 'minmax(130px,1fr)' },
          { titulo: 'Valor', largura: 'minmax(90px,.8fr)' },
          { titulo: 'Parado há', largura: 'minmax(90px,.7fr)' },
          { titulo: 'Prazo', largura: 'minmax(80px,.7fr)' },
        ]}
        linhas={linhas}
        vazio="Nenhuma peça em produção. Pedidos pagos entram aqui automaticamente."
        rodape={<span>{linhas.length} na fila de produção</span>}
      />
    </div>
  );
}
