import Link from 'next/link';
import { reais } from '@/lib/preco';
import type { DadosMarketing, Oportunidade } from '@/lib/comercial';

/**
 * Oportunidades de venda — medidas, não inventadas.
 *
 * O design trazia campanhas e taxas de e-mail que a plataforma não tem. O que
 * ela tem, e vale mais, é o funil real: quem recebeu foto e não montou, quem
 * montou e não comprou, quem comprou e não pagou. Cada linha é um telefonema
 * que o lojista pode dar hoje.
 */

const CARD = 'rounded-[18px] border border-line bg-surface';

/** Cada bloco de oportunidade tem o mesmo formato; só muda o que ele significa. */
function Bloco({
  titulo,
  explicacao,
  itens,
  cor,
  acao,
}: {
  titulo: string;
  explicacao: string;
  itens: Oportunidade[];
  cor: string;
  acao: string;
}) {
  return (
    <section className={`${CARD} overflow-hidden`}>
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line-2 px-6 py-4">
        <div>
          <p className="m-0 flex items-center gap-2 text-[15px] font-bold">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: cor }} />
            {titulo}
            <span className="rounded-full bg-page px-2.5 py-0.5 text-[12px] font-bold text-ink-3">
              {itens.length}
            </span>
          </p>
          <p className="m-0 mt-1 text-[12.5px] text-muted">{explicacao}</p>
        </div>
        <span className="text-[12px] font-semibold text-muted-2">{acao}</span>
      </div>

      {itens.length === 0 ? (
        <p className="m-0 px-6 py-8 text-center text-[13px] text-muted">
          Ninguém nesta situação. É um bom sinal.
        </p>
      ) : (
        <ul className="m-0 flex list-none flex-col p-0">
          {itens.map((o) => (
            <li
              key={o.id}
              className="flex flex-wrap items-center gap-3 border-b border-line-2 px-6 py-3.5 last:border-0"
            >
              <div className="min-w-[220px] flex-1">
                <p className="m-0 text-[14px] font-semibold">{o.titulo}</p>
                <p className="m-0 mt-0.5 text-[12px] text-muted">
                  {o.detalhe}
                  {o.cliente && ` · ${o.cliente}`}
                </p>
              </div>

              {o.valor != null && (
                <span className="text-[13.5px] font-bold">{reais(o.valor)}</span>
              )}

              {o.diasParado != null && (
                <span
                  className={`rounded-full px-3 py-1 text-[11.5px] font-bold ${
                    o.diasParado >= 14
                      ? 'bg-coral-surface text-coral'
                      : o.diasParado >= 7
                        ? 'bg-amber-surface text-[#B45309]'
                        : 'bg-page text-muted'
                  }`}
                >
                  {o.diasParado === 0 ? 'hoje' : `${o.diasParado} d parado`}
                </span>
              )}

              {o.contato && (
                <a
                  href={
                    o.contato.includes('@')
                      ? `mailto:${o.contato}`
                      : `https://wa.me/${o.contato.replace(/\D/g, '')}`
                  }
                  className="rounded-[12px] border border-line px-3.5 py-2 text-[12.5px] font-semibold text-ink-3 hover:border-[#D6E2FC] hover:text-blue"
                >
                  Falar
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default function PainelMarketing({ dados }: { dados: DadosMarketing }) {
  const f = dados.funil;

  // Percentual sobre a etapa ANTERIOR, não sobre o topo: é o que mostra onde a
  // perda acontece. Sobre o topo, todas as etapas finais pareceriam ruins.
  const etapas: [string, number, number | null][] = [
    ['Clientes na loja', f.clientes, null],
    ['Receberam fotos', f.comFotos, f.clientes],
    ['Montaram um álbum', f.comAlbumMontado, f.comFotos],
    ['Viraram pedido', f.comPedido, f.comAlbumMontado],
    ['Pagaram', f.comPedidoPago, f.comPedido],
  ];

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="m-0 text-[26px] font-extrabold tracking-[-.9px]">Oportunidades</h1>
        <p className="m-0 mt-1.5 text-[13.5px] text-muted">
          Onde suas vendas estão paradas — medido nos dados da loja, não estimado.
        </p>
      </div>

      {/* ------------------------------- funil ------------------------------ */}
      <section className={`${CARD} p-6`}>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <p className="m-0 text-[15px] font-bold">Funil</p>
          <p className="m-0 text-[13px] text-muted">
            Receita paga no período:{' '}
            <strong className="text-ink">{reais(f.receita)}</strong>
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          {etapas.map(([rot, valor, base]) => {
            const pct = base ? Math.round((valor / Math.max(1, base)) * 100) : 100;
            const largura = f.clientes ? Math.max(3, (valor / Math.max(1, f.clientes)) * 100) : 3;
            return (
              <div key={rot} className="flex items-center gap-3">
                <span className="w-[150px] flex-none text-[12.5px] text-ink-3">{rot}</span>
                <div className="h-7 flex-1 overflow-hidden rounded-[9px] bg-[#EEF1F7]">
                  <div
                    className="flex h-full items-center rounded-[9px] bg-[linear-gradient(90deg,#2563EB,#06B6D4)] px-3 text-[12px] font-bold text-white"
                    style={{ width: `${largura}%` }}
                  >
                    {valor}
                  </div>
                </div>
                <span
                  className={`w-[86px] flex-none text-right text-[12px] font-semibold ${
                    base && pct < 50 ? 'text-coral' : 'text-muted'
                  }`}
                >
                  {base == null ? '' : `${pct}% da etapa`}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      <Bloco
        titulo="Receberam fotos e não montaram"
        explicacao="A galeria está liberada e o cliente não abriu o editor."
        itens={dados.naoMontados}
        cor="#F59E0B"
        acao="lembre que as fotos estão prontas"
      />
      <Bloco
        titulo="Montaram e não pediram"
        explicacao="O álbum está pronto e nunca virou pedido — é a oportunidade mais quente."
        itens={dados.semPedido}
        cor="#E11D48"
        acao="ofereça fechar o pedido"
      />
      <Bloco
        titulo="Pediram e não pagaram"
        explicacao="Pedido criado, pagamento pendente."
        itens={dados.naoPagos}
        cor="#7C3AED"
        acao="reenvie o link de pagamento"
      />
      <Bloco
        titulo="Nunca entraram na loja"
        explicacao="Foram cadastrados e nunca acessaram o link."
        itens={dados.nuncaEntraram}
        cor="#9AA7BC"
        acao="reenvie o convite"
      />

      {dados.truncado && (
        <p className="m-0 text-[12px] text-muted-2">
          As listas mostram as oportunidades mais recentes. Há mais casos além dos exibidos.
        </p>
      )}

      <Link href="/clientes" className="text-[13px] font-semibold text-blue hover:underline">
        Ver todos os clientes
      </Link>
    </div>
  );
}
