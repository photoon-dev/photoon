'use client';

import { COR, RAIO, SOMBRA } from '@/components/ui/tokens';
import EstadoVazio from '@/components/ui/EstadoVazio';

/**
 * A tabela do painel. Uma só, para todas as listagens.
 *
 * Regra 4 do briefing: toda tabela precisa de busca, filtros, paginação,
 * ordenação, estado vazio, carregando e erro. Busca e filtros vivem na
 * `BarraDeFiltros`, que fica acima; os outros cinco estão aqui.
 *
 * A ordenação é por URL, não por estado local: o lojista guarda o link de
 * "atrasados primeiro" e o botão de voltar do navegador funciona. É o mesmo
 * caminho que Pedidos já usava para os filtros.
 *
 * No celular a tabela rola dentro do próprio quadro — nunca a página inteira.
 */

export type Coluna<L> = {
  /** Chave estável; é o valor que vai para a URL quando a coluna ordena. */
  chave: string;
  titulo: string;
  /** Largura em `grid-template-columns`. Ex.: '1.4fr', '120px', 'auto'. */
  largura?: string;
  /** Alinhamento do conteúdo. Números pedem 'right'. */
  alinha?: 'left' | 'right' | 'center';
  ordenavel?: boolean;
  render: (linha: L) => React.ReactNode;
};

export type Ordem = { por: string; desc: boolean };

export default function Tabela<L>({
  colunas,
  linhas,
  chaveDe,
  ordem,
  aoOrdenar,
  aoAbrir,
  carregando = false,
  erro = null,
  vazio,
  rodape,
}: {
  colunas: Coluna<L>[];
  linhas: L[];
  chaveDe: (linha: L) => string;
  ordem?: Ordem;
  /** Recebe a chave da coluna; quem chama decide como isso vira URL. */
  aoOrdenar?: (chave: string) => void;
  aoAbrir?: (linha: L) => void;
  carregando?: boolean;
  erro?: { mensagem: string; tentarDeNovo?: () => void } | null;
  vazio: React.ReactNode;
  rodape?: React.ReactNode;
}) {
  const grade = colunas.map((c) => c.largura ?? '1fr').join(' ');

  const quadro: React.CSSProperties = {
    background: COR.papel,
    border: `1px solid ${COR.linha}`,
    borderRadius: RAIO.cartao,
    boxShadow: SOMBRA.cartao,
    overflow: 'hidden',
  };

  // Erro antes de tudo: mostrar uma tabela vazia quando a consulta falhou faz
  // o lojista concluir que não há pedido nenhum.
  if (erro) {
    return (
      <div style={quadro}>
        <div style={{ padding: '46px 26px', textAlign: 'center' }}>
          <p style={{ margin: '0 0 6px', fontSize: 14.5, fontWeight: 600, color: COR.coral }}>
            Não foi possível carregar esta lista
          </p>
          <p style={{ margin: '0 0 16px', fontSize: 13, color: COR.apagado }}>{erro.mensagem}</p>
          {erro.tentarDeNovo && (
            <button
              type="button"
              onClick={erro.tentarDeNovo}
              style={{
                padding: '9px 18px',
                borderRadius: RAIO.botao,
                border: `1px solid ${COR.linha}`,
                background: COR.papel,
                color: COR.azul,
                fontFamily: 'inherit',
                fontSize: 13.5,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Tentar de novo
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={quadro}>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: 'max-content' }}>
          <div
            role="row"
            style={{
              display: 'grid',
              gridTemplateColumns: grade,
              gap: 16,
              alignItems: 'center',
              padding: '10px 26px',
              borderBottom: `1px solid ${COR.linhaClara}`,
              background: '#FBFCFE',
            }}
          >
            {colunas.map((c) => {
              const ativa = ordem?.por === c.chave;
              return (
                <button
                  key={c.chave}
                  type="button"
                  disabled={!c.ordenavel || !aoOrdenar}
                  onClick={() => aoOrdenar?.(c.chave)}
                  aria-sort={ativa ? (ordem!.desc ? 'descending' : 'ascending') : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    justifyContent:
                      c.alinha === 'right' ? 'flex-end' : c.alinha === 'center' ? 'center' : 'flex-start',
                    padding: 0,
                    border: 0,
                    background: 'transparent',
                    fontFamily: 'inherit',
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '1.1px',
                    textTransform: 'uppercase',
                    color: ativa ? COR.azul : COR.fraco,
                    cursor: c.ordenavel && aoOrdenar ? 'pointer' : 'default',
                    textAlign: 'left',
                  }}
                >
                  {c.titulo}
                  {c.ordenavel && aoOrdenar && (
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor"
                         strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
                         style={{
                           opacity: ativa ? 1 : 0.35,
                           transform: ativa && !ordem!.desc ? 'rotate(180deg)' : undefined,
                         }}>
                      <path d="m7 10 5 5 5-5" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>

          {carregando ? (
            <div aria-busy="true">
              {Array.from({ length: 6 }, (_, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: grade,
                    gap: 16,
                    alignItems: 'center',
                    padding: '16px 26px',
                    borderBottom: `1px solid ${COR.linhaClara}`,
                  }}
                >
                  {colunas.map((c) => (
                    <div
                      key={c.chave}
                      style={{
                        height: 12,
                        width: `${55 + ((i * 7 + c.chave.length * 11) % 40)}%`,
                        borderRadius: 999,
                        background: COR.linha,
                        opacity: 0.75,
                      }}
                    />
                  ))}
                </div>
              ))}
              <span style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>
                Carregando
              </span>
            </div>
          ) : linhas.length === 0 ? (
            vazio
          ) : (
            linhas.map((linha) => (
              <div
                key={chaveDe(linha)}
                role="row"
                tabIndex={aoAbrir ? 0 : undefined}
                onClick={aoAbrir ? () => aoAbrir(linha) : undefined}
                onKeyDown={
                  aoAbrir
                    ? (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          aoAbrir(linha);
                        }
                      }
                    : undefined
                }
                style={{
                  display: 'grid',
                  gridTemplateColumns: grade,
                  gap: 16,
                  alignItems: 'center',
                  padding: '14px 26px',
                  borderBottom: `1px solid ${COR.linhaClara}`,
                  cursor: aoAbrir ? 'pointer' : 'default',
                  fontSize: 13.5,
                  color: COR.tinta2,
                }}
              >
                {colunas.map((c) => (
                  <div
                    key={c.chave}
                    style={{
                      textAlign: c.alinha ?? 'left',
                      fontVariantNumeric: c.alinha === 'right' ? 'tabular-nums' : undefined,
                      minWidth: 0,
                    }}
                  >
                    {c.render(linha)}
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
      {rodape}
    </div>
  );
}

/** Estado vazio pronto, para quem não quer montar o seu. */
export { EstadoVazio };
