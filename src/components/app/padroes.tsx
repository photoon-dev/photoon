import Link from 'next/link';

/**
 * Os dois padrões visuais do painel, extraídos da tela de Pedidos.
 *
 * Toda tela nova usa estes componentes. O motivo é concreto: as telas
 * construídas à mão ficaram com cartões de alturas diferentes, tipografia
 * própria e listas que não se pareciam entre si — o painel virou uma colcha de
 * retalhos. Aqui as medidas ficam num lugar só.
 *
 * As medidas vieram do `Pedidos.dc.html`, não de gosto: cartão com raio de
 * 22px e 20/22 de recuo, ícone de 36px com raio de 12, valor em 29px com
 * entreletra de −1px, linha de lista com 14/24 de recuo e avatar de 36px.
 */

/* ------------------------------------------------------------------ cores */

export type Tom = 'azul' | 'verde' | 'ambar' | 'coral' | 'roxo' | 'ciano' | 'neutro';

/** Fundo e traço de cada tom. Um par por tom, para nunca desencontrarem. */
export const TONS: Record<Tom, { fundo: string; cor: string }> = {
  azul: { fundo: '#EAF0FF', cor: '#2563EB' },
  verde: { fundo: '#E6F8F1', cor: '#059669' },
  ambar: { fundo: '#FEF3E2', cor: '#B45309' },
  coral: { fundo: '#FFF1F3', cor: '#E11D48' },
  roxo: { fundo: '#F1F5FD', cor: '#4F46E5' },
  ciano: { fundo: '#E4F8FC', cor: '#0E7490' },
  neutro: { fundo: '#EEF1F7', cor: '#6B7A90' },
};

/* ------------------------------------------------------------ cartão KPI */

export type CartaoKpi = {
  rotulo: string;
  valor: string | number;
  /** Selo abaixo do valor. Ausente = sem selo, e o cartão continua da mesma altura. */
  nota?: string;
  tom?: Tom;
  icone?: React.ReactNode;
  /** Série para o gráfico; menos de 2 pontos não desenha nada. */
  serie?: number[];
};

/**
 * Gráfico de linha do cartão.
 *
 * 80×26 como no design. Sem série real ele não é desenhado — o design trazia
 * uma curva bonita e inventada em todo cartão, o que fazia a tela parecer ter
 * informação que não tinha.
 */
function Faisca({ serie, cor }: { serie: number[]; cor: string }) {
  if (!serie || serie.length < 2) return null;
  const teto = Math.max(...serie);
  const chao = Math.min(...serie);
  const faixa = teto - chao || 1;
  const passo = 80 / (serie.length - 1);
  const d = serie
    .map((v, i) => `${i === 0 ? 'M' : ''}${(i * passo).toFixed(1)} ${(23 - ((v - chao) / faixa) * 20).toFixed(1)}`)
    .join(' ');
  return (
    <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
      <path d={d} stroke={cor} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Kpi({ rotulo, valor, nota, tom = 'azul', icone, serie }: CartaoKpi) {
  const t = TONS[tom];
  return (
    <div
      className="flex flex-col gap-3 rounded-[22px] border border-line bg-surface px-[22px] py-5 transition-[box-shadow,transform] duration-[180ms] hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(11,18,32,.09)]"
    >
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-muted">{rotulo}</span>
        {icone && (
          <span
            className="flex h-9 w-9 items-center justify-center rounded-[12px]"
            style={{ background: t.fundo, color: t.cor }}
          >
            {icone}
          </span>
        )}
      </div>

      <span className="text-[29px] font-extrabold tracking-[-1px]">
        {typeof valor === 'number' ? valor.toLocaleString('pt-BR') : valor}
      </span>

      {/* A linha existe sempre, mesmo vazia: sem ela, cartões com e sem nota
          teriam alturas diferentes e a fileira ficaria desalinhada. */}
      <div className="flex min-h-[26px] items-center gap-2.5">
        {nota && (
          <span
            className="rounded-full px-[9px] py-1 text-[11.5px] font-bold"
            style={{ background: t.fundo, color: t.cor }}
          >
            {nota}
          </span>
        )}
        {serie && <Faisca serie={serie} cor={t.cor} />}
      </div>
    </div>
  );
}

/** Fileira de cartões. `auto-fit` mantém a altura igual e quebra sozinho. */
export function FileiraKpi({ cartoes }: { cartoes: CartaoKpi[] }) {
  return (
    <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(210px,1fr))]">
      {cartoes.map((c) => (
        <Kpi key={c.rotulo} {...c} />
      ))}
    </div>
  );
}

/* --------------------------------------------------------------- selo */

/** Selo de estado. Mesma pílula do design, com o par de cores do tom. */
export function Selo({ texto, tom = 'neutro' }: { texto: string; tom?: Tom }) {
  const t = TONS[tom];
  return (
    <span
      className="w-max whitespace-nowrap rounded-full px-[11px] py-1.5 text-[12px] font-semibold"
      style={{ background: t.fundo, color: t.cor }}
    >
      {texto}
    </span>
  );
}

/* --------------------------------------------------------------- lista */

export type ColunaLista = {
  /** Cabeçalho da coluna. Vazio para a coluna do avatar. */
  titulo: string;
  /** Largura em `grid-template-columns`. */
  largura: string;
};

export type LinhaLista = {
  id: string;
  /** Iniciais do avatar; ausente esconde o avatar. */
  iniciais?: string;
  tomAvatar?: Tom;
  titulo: string;
  /** Segunda linha, abaixo do título. */
  subtitulo?: string;
  href?: string;
  /** Uma célula por coluna depois da primeira. */
  celulas: React.ReactNode[];
};

/**
 * Lista do painel.
 *
 * Grade e não tabela: as colunas do design têm `minmax()`, e uma `<table>` não
 * encolhe do mesmo jeito quando a janela aperta.
 */
export function Lista({
  colunas,
  linhas,
  vazio = 'Nada por aqui ainda.',
  rodape,
}: {
  colunas: ColunaLista[];
  linhas: LinhaLista[];
  vazio?: string;
  rodape?: React.ReactNode;
}) {
  const grade = colunas.map((c) => c.largura).join(' ');

  return (
    <section className="overflow-hidden rounded-[22px] border border-line bg-surface">
      <div
        className="grid items-center gap-3.5 border-b border-line-2 bg-[#FBFCFE] px-6 py-2.5"
        style={{ gridTemplateColumns: grade }}
      >
        {colunas.map((c, i) => (
          <span
            key={i}
            className="text-[11px] font-bold uppercase tracking-[1.2px] text-muted-2"
          >
            {c.titulo}
          </span>
        ))}
      </div>

      {linhas.length === 0 ? (
        <p className="m-0 px-6 py-11 text-center text-[13.5px] text-muted">{vazio}</p>
      ) : (
        linhas.map((l) => {
          const t = TONS[l.tomAvatar ?? 'azul'];
          const conteudo = (
            <>
              <div className="flex min-w-0 items-center gap-3">
                {l.iniciais && (
                  <span
                    className="flex h-9 w-9 flex-none items-center justify-center rounded-[12px] text-[12.5px] font-bold"
                    style={{ background: t.fundo, color: t.cor }}
                  >
                    {l.iniciais}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="m-0 truncate text-[14px] font-semibold">{l.titulo}</p>
                  {l.subtitulo && (
                    <p className="m-0 mt-0.5 truncate text-[12px] text-muted-2">{l.subtitulo}</p>
                  )}
                </div>
              </div>
              {l.celulas.map((c, i) => (
                <div key={i} className="min-w-0 text-[13.5px] text-ink-3">
                  {c}
                </div>
              ))}
            </>
          );

          const classe =
            'grid items-center gap-3.5 border-b border-line-2 px-6 py-3.5 last:border-0 hover:bg-[#F8FAFE]';

          return l.href ? (
            <Link key={l.id} href={l.href} className={classe} style={{ gridTemplateColumns: grade }}>
              {conteudo}
            </Link>
          ) : (
            <div key={l.id} className={classe} style={{ gridTemplateColumns: grade }}>
              {conteudo}
            </div>
          );
        })
      )}

      {rodape && (
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#F8FAFE] px-6 py-4 text-[13px] text-muted">
          {rodape}
        </div>
      )}
    </section>
  );
}

/* --------------------------------------------------------------- ícones */

/**
 * Ícones dos cartões, no traço do design: 24×24, traço 1.9, pontas redondas.
 * Ficam aqui para as telas não redesenharem cada um do seu jeito.
 */
const svg = (d: React.ReactNode) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
       strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);

export const ICONES = {
  pedido: svg(<><path d="M4 8h16l-1.2 11.2a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8z" /><path d="M9 8V6.5a3 3 0 0 1 6 0V8" /></>),
  producao: svg(<><rect x="4" y="9" width="16" height="10" rx="2" /><path d="M7 9V5h10v4M8 19v2M16 19v2" /></>),
  entrega: svg(<><path d="M3 7h11v9H3zM14 10h4l3 3v3h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></>),
  dinheiro: svg(<><rect x="2.5" y="6" width="19" height="12" rx="2.5" /><circle cx="12" cy="12" r="2.6" /></>),
  relogio: svg(<><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 1.8" /></>),
  alerta: svg(<><circle cx="12" cy="12" r="8.5" /><path d="M12 8v5M12 16.5h.01" /></>),
  pessoas: svg(<><circle cx="9" cy="9" r="3.2" /><path d="M3 19c.8-3.4 3.2-5 6-5s5.2 1.6 6 5" /><path d="M16.5 6.4a3 3 0 0 1 0 5.6M18.6 19c-.3-1.7-.9-3-1.8-3.9" /></>),
  caixa: svg(<><path d="M12 3.2 20 7v10l-8 3.8L4 17V7z" /><path d="M4 7l8 3.8L20 7M12 10.8V20.8" /></>),
  grafico: svg(<><path d="M4 19V5M4 19h16" /><path d="M8 15l3.5-4 3 2.5L20 8" /></>),
  estrela: svg(<path d="m12 4 2.4 5.2 5.6.5-4.2 3.8 1.2 5.5L12 16.2 6.9 19l1.3-5.5L4 9.7l5.6-.5z" />),
} as const;
