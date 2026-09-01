import { FileiraKpi, Lista, Selo, ICONES, serieDiaria, type Tom } from '@/components/app/padroes';
import { reais } from '@/lib/preco';
import type { EnvioDaLista } from '@/lib/pedidos';

/** Expedição, nos padrões do painel. */

const ESTADOS: [string, string, Tom][] = [
  ['aguardando', 'Aguardando', 'neutro'],
  ['postado', 'Postado', 'azul'],
  ['em_transito', 'Em trânsito', 'roxo'],
  ['entregue', 'Entregue', 'verde'],
  ['devolvido', 'Devolvido', 'coral'],
];

export default function PainelExpedicaoPadrao({
  envios,
  porEstado,
  semEnvio,
}: {
  envios: EnvioDaLista[];
  porEstado: Record<string, number>;
  semEnvio: number;
}) {
  const tomDe = (e: string) => ESTADOS.find(([id]) => id === e)?.[2] ?? 'neutro';
  const rotuloDe = (e: string) => ESTADOS.find(([id]) => id === e)?.[1] ?? e;

  const linhas = envios.map((e) => {
    const p = e.pedidos;
    const cliente = p?.clientes?.nome ?? `Pedido #${p?.numero ?? '—'}`;
    const end = e.endereco;
    return {
      id: e.id,
      iniciais: cliente.slice(0, 2).toUpperCase(),
      tomAvatar: tomDe(e.estado),
      titulo: cliente,
      subtitulo: `#${p?.numero ?? '—'}`,
      href: p?.id ? `/pedidos/${p.id}` : undefined,
      celulas: [
        <Selo key="e" texto={rotuloDe(e.estado)} tom={tomDe(e.estado)} />,
        e.transportadora ?? <span className="text-muted-2">sem transportadora</span>,
        e.rastreio ? (
          <span className="font-mono text-[12.5px]">{e.rastreio}</span>
        ) : (
          <span className="text-muted-2">—</span>
        ),
        end?.cidade ? `${end.cidade}${end.uf ? `/${end.uf}` : ''}` : '—',
        p ? <strong className="font-bold">{reais(p.total)}</strong> : '—',
      ],
    };
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="m-0 text-[12px] font-bold uppercase tracking-[1.6px] text-muted-2">
          Operação · Expedição
        </p>
        <h1 className="m-0 mt-1.5 text-[32px] font-extrabold leading-[1.15] tracking-[-.8px]">
          Expedição
        </h1>
        <p className="m-0 mt-2 text-[14.5px] text-muted">
          {envios.length === 0
            ? 'Nenhum envio ainda.'
            : `${envios.length} ${envios.length === 1 ? 'envio' : 'envios'}` +
              (semEnvio ? ` · ${semEnvio} pronto${semEnvio === 1 ? '' : 's'} sem envio criado` : '')}
        </p>
      </div>

      <FileiraKpi
        cartoes={[
          ...ESTADOS.map(([id, rotulo, tom]) => {
            const doEstado = envios.filter((e) => e.estado === id);
            return {
              rotulo,
              valor: porEstado[id] ?? doEstado.length,
              tom,
              icone: id === 'devolvido' ? ICONES.alerta : ICONES.entrega,
              serie: serieDiaria(doEstado.map((e) => e.atualizado_em)),
              nota:
                id === 'entregue'
                  ? 'concluídos'
                  : id === 'devolvido'
                    ? (porEstado[id] ?? 0) > 0 ? 'exige atenção' : 'nenhum'
                    : id === 'aguardando'
                      ? 'sem postar'
                      : 'a caminho',
            };
          }),
          {
            rotulo: 'Prontos sem envio',
            valor: semEnvio,
            tom: (semEnvio ? 'ambar' : 'neutro') as Tom,
            icone: ICONES.caixa,
            nota: semEnvio ? 'aguardam postagem' : undefined,
          },
        ]}
      />

      <Lista
        colunas={[
          { titulo: 'Envio', largura: 'minmax(210px,1.5fr)' },
          { titulo: 'Estado', largura: 'minmax(120px,.9fr)' },
          { titulo: 'Transportadora', largura: 'minmax(120px,1fr)' },
          { titulo: 'Rastreio', largura: 'minmax(150px,1.1fr)' },
          { titulo: 'Destino', largura: 'minmax(110px,.9fr)' },
          { titulo: 'Valor', largura: 'minmax(90px,.7fr)' },
        ]}
        linhas={linhas}
        vazio="Nenhum envio. Pedidos prontos aparecem aqui para postagem."
        rodape={<span>{linhas.length} envios</span>}
      />
    </div>
  );
}
