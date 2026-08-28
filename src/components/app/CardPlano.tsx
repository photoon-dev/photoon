import type { Plano } from '@/lib/lojista';
import { calcularMensalidade, reais } from '@/lib/preco';

/**
 * Consumo do plano no mês.
 *
 * O design tinha um cartão de "Armazenamento" no rodapé do menu, com número
 * inventado. Trocado pelo que a plataforma de fato mede e cobra: projetos e
 * lâminas na competência, contra o limite do plano.
 */
export default function CardPlano({
  plano,
  uso,
  compacto = false,
}: {
  plano: Plano | null;
  uso: { projetos: number; laminas: number };
  /** `true` no rodapé do menu; `false` na tela de configurações. */
  compacto?: boolean;
}) {
  if (!plano) {
    return (
      <div className="rounded-[18px] border border-line bg-surface-2 p-4">
        <p className="m-0 text-[13px] font-bold">Sem plano</p>
        <p className="m-0 mt-1 text-[12px] leading-[1.5] text-muted">
          Esta loja não está em nenhum plano, então não há limite de projetos.
        </p>
      </div>
    );
  }

  const conta = calcularMensalidade(plano, uso);
  const limite = plano.limite_projetos;
  const pct = limite ? Math.min(100, Math.round((uso.projetos / limite) * 100)) : null;
  const perto = pct != null && pct >= 80;

  const barra = (
    <>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <span className="text-[12px] text-muted">Projetos no mês</span>
        <span className={`text-[12.5px] font-bold ${perto ? 'text-[#B45309]' : 'text-ink-3'}`}>
          {uso.projetos}
          {limite ? ` de ${limite}` : ''}
        </span>
      </div>
      <div className="h-2 rounded-full bg-[#EEF1F7]">
        <div
          className="h-full rounded-full transition-[width]"
          style={{
            width: `${pct ?? 6}%`,
            background: perto
              ? 'linear-gradient(90deg,#F59E0B,#E11D48)'
              : 'linear-gradient(90deg,#2563EB,#06B6D4)',
          }}
        />
      </div>
    </>
  );

  if (compacto) {
    return (
      <div className="rounded-[18px] border border-line bg-[linear-gradient(160deg,#F1F5FD,#E4F8FC)] p-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-[13px] font-extrabold">{plano.nome}</span>
          <span className="text-[12px] font-bold text-blue">{reais(conta.total)}</span>
        </div>
        {barra}
        <p className="m-0 mt-2 text-[11px] leading-[1.45] text-muted">
          {uso.laminas.toLocaleString('pt-BR')} lâminas neste mês
          {perto && limite ? ' · perto do limite' : ''}
        </p>
      </div>
    );
  }

  const linhas: [string, string, string][] = [
    ['Mensalidade', reais(plano.valor_mensal), 'valor fixo do plano'],
    [
      'Projetos',
      reais(conta.projetos),
      plano.valor_por_projeto > 0
        ? `${uso.projetos} × ${reais(plano.valor_por_projeto)}`
        : 'não cobrado neste plano',
    ],
    [
      'Lâminas',
      reais(conta.laminas),
      plano.valor_por_lamina > 0
        ? `${uso.laminas.toLocaleString('pt-BR')} × ${reais(plano.valor_por_lamina)}`
        : 'não cobrado neste plano',
    ],
  ];

  return (
    <section className="rounded-[18px] border border-line bg-surface p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="m-0 text-[15px] font-bold">Plano {plano.nome}</p>
          {plano.descricao && (
            <p className="m-0 mt-0.5 text-[12.5px] text-muted">{plano.descricao}</p>
          )}
        </div>
        <div className="text-right">
          <p className="m-0 text-[12px] text-muted-2">Previsto neste mês</p>
          <p className="m-0 text-[26px] font-extrabold tracking-[-.8px]">{reais(conta.total)}</p>
        </div>
      </div>

      <div className="mb-5">{barra}</div>

      <dl className="m-0 flex flex-col gap-2.5">
        {linhas.map(([rot, val, obs]) => (
          <div key={rot} className="flex items-baseline justify-between gap-3">
            <dt className="text-[13px] text-ink-3">
              {rot}
              <span className="ml-2 text-[11.5px] text-muted-2">{obs}</span>
            </dt>
            <dd className="m-0 whitespace-nowrap text-[13.5px] font-semibold">{val}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 flex flex-wrap gap-4 border-t border-line-2 pt-4 text-[12px] text-muted">
        <span>
          Clientes:{' '}
          <strong className="text-ink-3">
            {plano.limite_clientes ? plano.limite_clientes.toLocaleString('pt-BR') : 'ilimitado'}
          </strong>
        </span>
        <span>
          Projetos:{' '}
          <strong className="text-ink-3">
            {limite ? limite.toLocaleString('pt-BR') : 'ilimitado'}
          </strong>
        </span>
      </div>

      {perto && limite && (
        <p className="m-0 mt-4 rounded-[14px] bg-amber-surface px-4 py-3 text-[12.5px] font-semibold text-[#B45309]">
          Você usou {pct}% dos projetos do plano. Ao atingir o limite, a criação de novos álbuns é
          bloqueada até a troca de plano.
        </p>
      )}
    </section>
  );
}
