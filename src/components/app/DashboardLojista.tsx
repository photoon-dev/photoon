'use client';

import { useMemo, useState } from 'react';
import { COR, SUPERFICIE } from '@/components/ui/tokens';
import type { PainelDaLoja } from '@/components/app/useDashboardDesign';

/**
 * Dashboard do lojista.
 *
 * Antes era `Dashboard.dc.html` transliterado. Trocado por layout escrito à mão
 * com os tokens, pelas mesmas medidas de `/pedidos` — a referência visual do
 * painel: cartão `radius 22`, `padding 20/22`, borda `COR.linha`, número de
 * 29px, grade `auto-fit minmax(210px,1fr)` com `gap 16`.
 *
 * O protótipo mostrava número inventado como se fosse medição: "Produção hoje"
 * trazia 27/40, 18/32, 9/25 e 21/24 fixos no HTML, e "Precisa de você" listava
 * "2 pagamentos para conciliar" e "5 artes com DPI baixo" — nada disso saía do
 * banco. O gráfico tinha a mesma doença: as duas montanhas sombreadas eram um
 * `path` desenhado à mão, e só as linhas finas vinham da série real; por isso a
 * área subia bonito enquanto a linha azul andava rente ao chão.
 *
 * Aqui os dois blocos passaram a mostrar o que a plataforma de fato mede, sem
 * consulta nova: os contadores que já vêm em `numerosDaLoja` e que o menu já
 * usa nos selos. Menos números na tela, todos verdadeiros.
 */

const PAPEL: React.CSSProperties = {
  background: COR.papel,
  border: `1px solid ${COR.linha}`,
  borderRadius: 22,
};

/** Rótulo de seção, no mesmo padrão do cabeçalho de `/pedidos`. */
function Titulo({ children, acao }: { children: React.ReactNode; acao?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
      <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, letterSpacing: '-0.2px' }}>{children}</h2>
      {acao}
    </div>
  );
}

/**
 * O cartão de KPI de `/pedidos`, nas mesmas medidas: rótulo e ícone na primeira
 * linha, número grande, e o par selo + minigráfico embaixo.
 */
function Kpi({
  rotulo,
  valor,
  nota,
  cor,
  fundo,
  linha,
  icone,
}: {
  rotulo: string;
  valor: string;
  nota: string;
  cor: string;
  fundo: string;
  /** Traçado do minigráfico, no viewBox 80×26. */
  linha: string;
  icone: React.ReactNode;
}) {
  return (
    <div style={{ ...PAPEL, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, color: COR.apagado, fontWeight: 500 }}>{rotulo}</span>
        <span
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: fundo,
            color: cor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '0 0 auto',
          }}
        >
          {icone}
        </span>
      </div>
      <span style={{ fontSize: 29, fontWeight: 800, letterSpacing: '-1px', lineHeight: 1 }}>{valor}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          style={{
            padding: '4px 9px',
            borderRadius: 999,
            background: fundo,
            color: cor,
            fontSize: 11.5,
            fontWeight: 700,
            lineHeight: 1.35,
          }}
        >
          {nota}
        </span>
        <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
          <path d={linha} stroke={cor} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

const ICONE = {
  cliente: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </svg>
  ),
  album: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M9 4v16" />
    </svg>
  ),
  foto: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="16" rx="4" />
      <path d="m3.5 16 4.6-4.2 4 3.4 3.4-3 5 4.4" />
      <circle cx="9" cy="9" r="1.4" />
    </svg>
  ),
  pronto: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12 2.4 2.4 4.6-4.8" />
    </svg>
  ),
};

const SELO_PROJETO: Record<string, [string, string, string]> = {
  pronto: ['Pronto', SUPERFICIE.verde, COR.verde],
  renderizado: ['Renderizado', SUPERFICIE.ciano, '#0891B2'],
  em_renderizacao: ['Renderizando', SUPERFICIE.ciano, '#0891B2'],
  com_pendencias: ['Com pendência', SUPERFICIE.ambar, COR.ambar],
  com_erro: ['Com erro', SUPERFICIE.coral, COR.coral],
  em_edicao: ['Em edição', SUPERFICIE.azul, COR.azul],
  finalizado: ['Finalizado', SUPERFICIE.verde, COR.verde],
  nao_iniciado: ['Não iniciado', SUPERFICIE.neutro, COR.apagado],
};

/**
 * A série real vira um `path`, e o mesmo cálculo desenha a área embaixo dele.
 *
 * O protótipo tinha as duas coisas separadas — linha vinda do dado, área
 * desenhada à mão — e elas não se encontravam em lugar nenhum do gráfico.
 */
function curva(vals: number[], largura: number, altura: number, teto: number) {
  if (vals.length < 2) return { linha: '', area: '' };
  const passo = largura / (vals.length - 1);
  const y = (val: number) => altura - 4 - (val / teto) * (altura - 12);
  const pontos = vals.map((val, i) => `${Math.round(i * passo)} ${y(val).toFixed(1)}`);
  const linha = `M${pontos.join(' L')}`;
  return { linha, area: `${linha} L${largura} ${altura} L0 ${altura} Z` };
}

export default function DashboardLojista({ painel }: { painel: PainelDaLoja }) {
  const [dias, setDias] = useState(30);
  const n = painel.numeros;

  const primeiroNome = (painel.usuarioNome ?? '').split(' ')[0] || 'por aqui';
  const num = (x: number) => x.toLocaleString('pt-BR');

  // Data e hora saem do MESMO fuso, o da loja. `getHours()` usa o fuso de quem
  // abriu o navegador: com o servidor em UTC, a tela mostrava "Bom dia" ao lado
  // de uma data que, em São Paulo, ainda era a noite do dia anterior.
  const FUSO_DA_LOJA = 'America/Sao_Paulo';
  const agora = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: FUSO_DA_LOJA,
  });
  const hora = Number(
    new Date().toLocaleString('pt-BR', { hour: '2-digit', hour12: false, timeZone: FUSO_DA_LOJA }),
  );

  const grafico = useMemo(() => {
    const corta = (s: number[]) => s.slice(-dias);
    const a = corta(n.serieCriados ?? []);
    const b = corta(n.serieProntos ?? []);
    const teto = Math.max(1, ...a, ...b);
    return {
      a: curva(a, 700, 150, teto),
      b: curva(b, 700, 150, teto),
      teto,
      pontos: a.length,
      vazio: a.length < 2,
    };
  }, [n.serieCriados, n.serieProntos, dias]);

  // O que de fato espera uma pessoa. Os três já são contados em `numerosDaLoja`
  // e são os mesmos que o menu mostra nos selos — não há consulta nova aqui.
  const pendencias = [
    {
      quanto: n.pedidosNaoVistos ?? 0,
      titulo: 'pedido ainda não aberto',
      titulos: 'pedidos ainda não abertos',
      nota: 'ninguém da loja abriu',
      href: '/pedidos',
      fundo: SUPERFICIE.azul,
      cor: COR.azul,
    },
    {
      quanto: n.comPendencia ?? 0,
      titulo: 'álbum com pendência',
      titulos: 'álbuns com pendência',
      nota: 'quadro de foto vazio',
      href: '/projetos?status=com_pendencias',
      fundo: SUPERFICIE.ambar,
      cor: COR.ambar,
    },
    {
      quanto: n.rendersComErro ?? 0,
      titulo: 'renderização com erro',
      titulos: 'renderizações com erro',
      nota: 'a fila parou nesta',
      href: '/renderizacao?estado=erro',
      fundo: SUPERFICIE.coral,
      cor: COR.coral,
    },
  ].filter((p) => p.quanto > 0);

  // "Andamento da loja" no lugar do "Produção hoje" do protótipo: as mesmas
  // quatro barras, com números que existem.
  const totalAlbuns = Math.max(1, n.projetos);
  const andamento = [
    // As três primeiras são fatias do total de álbuns e ganham barra; a última
    // é uma contagem absoluta, e barra de proporção ali seria mentira visual.
    { rotulo: 'Em edição', valor: n.emEdicao, cor: COR.azul, proporcao: true },
    { rotulo: 'Com pendência', valor: n.comPendencia, cor: COR.ambarVivo, proporcao: true },
    { rotulo: 'Prontos', valor: n.prontos, cor: COR.verdeVivo, proporcao: true },
    // `numerosDaLoja` devolve `laminas: 0` fixo — a contagem nunca foi
    // implementada. Um zero que não mede nada é a mesma fábula do "27 / 40".
  ];

  return (
    <div style={{ padding: '26px 30px 60px', display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* -------------------------------------------------------------------
          Hero.

          Mesmo banner de saudação da área do cliente (`Cliente Meus
          projetos.dc.html`), campo a campo: o gradiente `140deg`, o raio de
          14, o padding 30/34, a malha que desliza, os dois blobs, a pílula de
          vidro, o título de 32px e o parágrafo de 14.5. Duas telas do mesmo
          produto que dizem "bom dia" de dois jeitos diferentes parecem dois
          produtos.

          O que muda é só a composição: em vez de uma faixa larga com uma frase
          e um vazio à direita, os dois números ocupam esse lado — nas mesmas
          caixas de vidro que o cliente usa para o progresso do pedido.
      ------------------------------------------------------------------- */}
      <section
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 14,
          background: 'linear-gradient(140deg,#0B1220 0%,#1B2350 48%,#123F63 100%)',
          padding: '30px 34px',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: -40,
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            animation: 'gridDrift 14s linear infinite',
            maskImage: 'radial-gradient(120% 90% at 70% 40%, #000 20%, transparent 78%)',
            WebkitMaskImage: 'radial-gradient(120% 90% at 70% 40%, #000 20%, transparent 78%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: -120,
            right: -70,
            width: 340,
            height: 340,
            borderRadius: 999,
            background: 'radial-gradient(circle at 40% 40%, rgba(99,102,241,.42), transparent 70%)',
            animation: 'blobFloat 18s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -140,
            left: '30%',
            width: 300,
            height: 300,
            borderRadius: 999,
            background: 'radial-gradient(circle at 50% 50%, rgba(6,182,212,.3), transparent 72%)',
            animation: 'blobFloat 22s ease-in-out infinite reverse',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'grid',
            // O cliente usa duas colunas iguais; aqui a frase da saudação é mais
            // longa que a dele e, repartida ao meio, quebrava em três linhas —
            // altura pura, sem informação. Mesma grade, proporção outra.
            gridTemplateColumns: 'minmax(0, 1.35fr) minmax(300px, 1fr)',
            gap: 28,
            alignItems: 'center',
          }}
          className="ph-hero-grade"
        >
          <div style={{ minWidth: 0 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                borderRadius: 999,
                background: 'rgba(255,255,255,.12)',
                backdropFilter: 'blur(14px)',
                border: '1px solid rgba(255,255,255,.22)',
                color: '#EDE9FE',
                fontSize: 11.5,
                fontWeight: 700,
                marginBottom: 14,
              }}
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="5" width="18" height="14" rx="3.5" />
                <path d="M7 5V3M17 5V3" />
                <circle cx="9" cy="11" r="1.6" />
                <path d="m4 18 5-4.4 3.4 3 3-2.6L20 18" />
              </svg>
              {agora}
            </span>
            <h1
              style={{
                margin: '0 0 10px',
                fontSize: 32,
                lineHeight: 1.12,
                fontWeight: 800,
                letterSpacing: '-1.2px',
                color: '#FFFFFF',
              }}
            >
              {hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite'}, {primeiroNome}.
            </h1>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.6, color: 'rgba(255,255,255,.74)' }}>
              {n.projetos === 0 ? (
                'Nenhum álbum ainda. Cadastre um cliente, libere as fotos e o álbum aparece aqui.'
              ) : (
                <>
                  A <strong style={{ color: '#FFFFFF' }}>{painel.lojaNome}</strong> tem {n.projetos}{' '}
                  {n.projetos === 1 ? 'álbum' : 'álbuns'} · {n.emEdicao} em edição · {n.prontos}{' '}
                  {n.prontos === 1 ? 'pronto' : 'prontos'}
                  {n.comPendencia ? ` · ${n.comPendencia} com pendência` : ''}
                </>
              )}
            </p>
          </div>

          {/* A caixa de vidro do cliente ("Progresso do pedido"), nas mesmas
              medidas — aqui com os dois números que o lojista precisa ver. */}
          <div
            style={{
              padding: '18px 20px',
              borderRadius: 14,
              background: 'rgba(23,25,64,.42)',
              backdropFilter: 'blur(18px)',
              border: '1px solid rgba(255,255,255,.2)',
              boxShadow: '0 18px 40px rgba(10,12,36,.34)',
              minWidth: 0,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
              <span style={{ fontSize: 12.5, color: 'rgba(255,255,255,.7)' }}>Andamento médio</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#FFFFFF' }}>{n.progressoMedio}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: 'rgba(255,255,255,.16)', marginBottom: 18 }}>
              <div
                style={{
                  width: `${Math.min(100, Math.max(0, n.progressoMedio))}%`,
                  height: '100%',
                  borderRadius: 999,
                  background: 'linear-gradient(90deg,#A78BFA,#E9E5FF)',
                }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 14 }}>
              {[
                ['Prontos', n.prontos],
                ['Em edição', n.emEdicao],
                ['Pendências', n.comPendencia],
              ].map(([rotulo, valor]) => (
                <div key={String(rotulo)}>
                  <p style={{ margin: 0, fontSize: 19, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.1 }}>
                    {String(valor)}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 11.5, color: 'rgba(255,255,255,.7)' }}>{rotulo}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* KPIs — as medidas são as de /pedidos, cartão por cartão. */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 16 }}>
        <Kpi
          rotulo="Clientes"
          valor={num(n.clientes)}
          nota={n.clientes ? 'cadastrados na loja' : 'nenhum ainda'}
          cor={COR.azul}
          fundo={SUPERFICIE.azul}
          linha="M0 21 12 17 24 19 36 11 48 14 60 6 72 3 80 5"
          icone={ICONE.cliente}
        />
        <Kpi
          rotulo="Álbuns"
          valor={num(n.projetos)}
          nota={`${n.emEdicao} em edição`}
          cor="#0891B2"
          fundo={SUPERFICIE.ciano}
          linha="M0 18 12 20 24 13 36 15 48 9 60 12 72 5 80 7"
          icone={ICONE.album}
        />
        <Kpi
          rotulo="Fotos liberadas"
          valor={num(n.fotos)}
          nota="na galeria"
          cor={COR.ambar}
          fundo={SUPERFICIE.ambar}
          linha="M0 10 12 8 24 13 36 11 48 16 60 14 72 19 80 17"
          icone={ICONE.foto}
        />
        <Kpi
          rotulo="Prontos"
          valor={num(n.prontos)}
          nota={n.comPendencia ? `${n.comPendencia} com pendência` : 'sem pendências'}
          cor={n.comPendencia ? COR.ambar : COR.verde}
          fundo={n.comPendencia ? SUPERFICIE.ambar : SUPERFICIE.verde}
          linha="M0 20 12 18 24 19 36 14 48 15 60 9 72 7 80 4"
          icone={ICONE.pronto}
        />
      </section>

      {/* -------------------------------------------------------------------
          Gráfico + coluna da direita. `minmax(0,…)` porque `1fr` não encolhe
          abaixo do conteúdo e o SVG empurraria a grade para fora em 1024.
      ------------------------------------------------------------------- */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.85fr) minmax(280px, 1fr)',
          gap: 16,
          // `start` deixava o cartão do gráfico curto e abria um buraco de
          // ~150px entre ele e a tabela, porque a coluna da direita é mais
          // alta. Esticando, o gráfico ocupa a altura da linha e o vazio some
          // — sem precisar alongar o gráfico por conta própria.
          alignItems: 'stretch',
        }}
        className="ph-dash-grade"
      >
        <div style={{ ...PAPEL, padding: '18px 20px', display: 'flex', flexDirection: 'column' }}>
          <Titulo
            acao={
              <div style={{ display: 'flex', gap: 4, background: COR.papelSuave, padding: 3, borderRadius: 999, border: `1px solid ${COR.linha}` }}>
                {[7, 30].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDias(d)}
                    style={{
                      border: 0,
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      padding: '5px 12px',
                      borderRadius: 999,
                      fontSize: 12.5,
                      whiteSpace: 'nowrap',
                      fontWeight: dias === d ? 700 : 500,
                      background: dias === d ? COR.tinta : 'transparent',
                      color: dias === d ? '#FFFFFF' : COR.texto,
                    }}
                  >
                    {d} dias
                  </button>
                ))}
              </div>
            }
          >
            Álbuns ao longo do mês
          </Titulo>

          <div style={{ display: 'flex', gap: 16, margin: '10px 0 6px' }}>
            {[
              ['Criados', COR.azul],
              ['Concluídos', COR.ciano],
            ].map(([rotulo, cor]) => (
              <span key={rotulo} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: COR.texto }}>
                <i style={{ width: 8, height: 8, borderRadius: 999, background: cor, display: 'block' }} />
                {rotulo}
              </span>
            ))}
            <span style={{ marginLeft: 'auto', fontSize: 12, color: COR.fraco, whiteSpace: 'nowrap' }}>
              pico de {grafico.teto}/dia
            </span>
          </div>

          {grafico.vazio ? (
            <div style={{ flex: 1, minHeight: 150, display: 'grid', placeItems: 'center', fontSize: 13, color: COR.fraco }}>
              Ainda não há dias suficientes para desenhar a curva.
            </div>
          ) : (
            <>
              {/* Piso de 150px — contra os 230 fixos do protótipo — e daí para
                  cima só o que a linha ao lado pedir. `preserveAspectRatio` em
                  `none` deixa o viewBox esticar sem deformar a leitura. */}
              <div style={{ flex: 1, minHeight: 150, display: 'flex' }}>
              <svg viewBox="0 0 700 150" width="100%" height="100%" preserveAspectRatio="none" style={{ display: 'block' }}>
                <defs>
                  <linearGradient id="dashA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={COR.azul} stopOpacity=".20" />
                    <stop offset="1" stopColor={COR.azul} stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="dashB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={COR.ciano} stopOpacity=".16" />
                    <stop offset="1" stopColor={COR.ciano} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <g stroke={COR.linhaClara} strokeWidth="1">
                  <path d="M0 38h700" />
                  <path d="M0 75h700" />
                  <path d="M0 112h700" />
                </g>
                {/* A área é o MESMO caminho da linha, fechado embaixo. */}
                <path d={grafico.a.area} fill="url(#dashA)" />
                <path d={grafico.b.area} fill="url(#dashB)" />
                <path d={grafico.b.linha} fill="none" stroke={COR.ciano} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                <path d={grafico.a.linha} fill="none" stroke={COR.azul} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11.5, color: COR.fraco }}>
                <span>há {grafico.pontos} dias</span>
                <span>hoje</span>
              </div>
            </>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ ...PAPEL, padding: '18px 20px' }}>
            <Titulo>Andamento da loja</Titulo>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 14 }}>
              {andamento.map((b) => {
                const pct = b.proporcao ? Math.round((b.valor / totalAlbuns) * 100) : null;
                return (
                  <div key={b.rotulo}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 6 }}>
                      <span style={{ color: COR.tinta2, fontWeight: 500 }}>{b.rotulo}</span>
                      <span style={{ color: COR.apagado, fontVariantNumeric: 'tabular-nums' }}>
                        {pct === null ? num(b.valor) : `${b.valor} / ${n.projetos}`}
                      </span>
                    </div>
                    {pct !== null && (
                      <div style={{ height: 6, borderRadius: 999, background: SUPERFICIE.neutro }}>
                        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 999, background: b.cor }} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ ...PAPEL, padding: '18px 20px' }}>
            <Titulo>Precisa de você</Titulo>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
              {pendencias.length === 0 ? (
                <p style={{ margin: 0, fontSize: 13, color: COR.fraco }}>
                  Nada parado esperando alguém. Pedido não aberto, álbum com pendência e renderização com
                  erro aparecem aqui.
                </p>
              ) : (
                pendencias.map((p) => (
                  <a
                    key={p.href}
                    href={p.href}
                    style={{
                      display: 'flex',
                      gap: 12,
                      alignItems: 'center',
                      padding: '10px 12px',
                      borderRadius: 14,
                      background: p.fundo,
                      textDecoration: 'none',
                      color: 'inherit',
                    }}
                  >
                    <span
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: 10,
                        background: COR.papel,
                        color: p.cor,
                        display: 'grid',
                        placeItems: 'center',
                        flex: '0 0 auto',
                        fontSize: 13,
                        fontWeight: 800,
                      }}
                    >
                      {p.quanto}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>
                        {p.quanto === 1 ? p.titulo : p.titulos}
                      </p>
                      <p style={{ margin: '1px 0 0', fontSize: 11.5, color: COR.apagado }}>{p.nota}</p>
                    </div>
                  </a>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Álbuns recentes. O protótipo intitulava "Pedidos recentes" e listava
          álbum, com colunas de álbum. O título estava errado, não a tabela. */}
      <section style={{ ...PAPEL, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px 12px' }}>
          <Titulo
            acao={
              <a href="/projetos" style={{ fontSize: 13, fontWeight: 600, color: COR.azul, textDecoration: 'none' }}>
                Ver todos
              </a>
            }
          >
            Álbuns recentes
          </Titulo>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
            <thead>
              <tr style={{ background: COR.papelSuave }}>
                {['Álbum', 'Andamento', 'Lâminas', 'Estado', 'Atualizado'].map((c) => (
                  <th
                    key={c}
                    style={{
                      textAlign: 'left',
                      padding: '10px 20px',
                      fontSize: 11,
                      letterSpacing: '1.2px',
                      textTransform: 'uppercase',
                      color: COR.fraco,
                      fontWeight: 700,
                      borderBottom: `1px solid ${COR.linhaClara}`,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {n.recentes.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 26, textAlign: 'center', fontSize: 13, color: COR.fraco }}>
                    Nenhum álbum ainda. Cadastre um cliente e libere as fotos para o primeiro aparecer aqui.
                  </td>
                </tr>
              )}
              {n.recentes.map((p) => {
                const [rot, bg, cor] = SELO_PROJETO[p.status] ?? SELO_PROJETO.nao_iniciado;
                return (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${COR.linhaClara}` }}>
                    <td style={{ padding: '12px 20px' }}>
                      <a
                        href={`/projetos/${p.id}`}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}
                      >
                        <span
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 10,
                            background: SUPERFICIE.azul,
                            color: COR.azul,
                            fontSize: 12,
                            fontWeight: 700,
                            display: 'grid',
                            placeItems: 'center',
                            flex: '0 0 auto',
                          }}
                        >
                          {(p.titulo || '?').slice(0, 2).toUpperCase()}
                        </span>
                        <span style={{ minWidth: 0 }}>
                          <span style={{ display: 'block', fontSize: 13.5, fontWeight: 600 }}>{p.titulo}</span>
                          <span style={{ display: 'block', fontSize: 11.5, color: COR.fraco }}>
                            {p.cliente ?? 'sem cliente vinculado'}
                          </span>
                        </span>
                      </a>
                    </td>
                    <td style={{ padding: '12px 20px', fontSize: 13, color: COR.tinta2, whiteSpace: 'nowrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 54, height: 5, borderRadius: 999, background: SUPERFICIE.neutro, flex: '0 0 auto' }}>
                          <span
                            style={{
                              display: 'block',
                              width: `${p.progresso}%`,
                              height: '100%',
                              borderRadius: 999,
                              background: COR.azul,
                            }}
                          />
                        </span>
                        {p.progresso}%
                      </span>
                    </td>
                    <td style={{ padding: '12px 20px', fontSize: 13, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {p.laminas}
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <span
                        style={{
                          padding: '5px 10px',
                          borderRadius: 999,
                          background: bg,
                          color: cor,
                          fontSize: 11.5,
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {rot}
                      </span>
                    </td>
                    <td style={{ padding: '12px 20px', fontSize: 12.5, color: COR.apagado, whiteSpace: 'nowrap' }}>
                      {new Date(p.atualizado_em).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        timeZone: 'America/Sao_Paulo',
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Abaixo de 1100 a grade de duas colunas aperta o gráfico; empilha. */}
      <style>{`
        @media (max-width:1100px){.ph-dash-grade{grid-template-columns:minmax(0,1fr)!important}}
        @media (max-width:900px){.ph-hero-grade{grid-template-columns:minmax(0,1fr)!important}}
      `}</style>
    </div>
  );
}
