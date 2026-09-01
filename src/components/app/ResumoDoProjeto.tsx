'use client';

/**
 * Folha de resumo do projeto — `/projetos/:id/resumo`.
 *
 * O botão "Resumo" do detalhe apontava para cá desde o começo e caía em 404.
 * É o documento que acompanha o álbum na bancada: quem confere a produção olha
 * esta folha, não a tela de detalhe com seis abas.
 *
 * Segue a densidade de `/pedidos` (a referência visual): container 26/30/60,
 * blocos com cabeçalho de 13px, linhas de 12/13px com divisor de 1px, sem
 * cartão gigante e sem espaço morto.
 *
 * Imprimir e Gerar PDF usam `window.print()`, como a OS — o navegador oferece
 * a impressora ou "Salvar como PDF", e não precisamos embarcar um gerador de
 * PDF no bundle. "Baixar PDF" é o mesmo caminho, com o nome do arquivo já
 * sugerido pelo `document.title` (o navegador usa o título como nome padrão),
 * por isso ele é trocado durante a impressão e devolvido depois.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Selo from '@/components/ui/Selo';
import { COR, RAIO, SOMBRA } from '@/components/ui/tokens';
import {
  dataHora,
  laminasDoProjeto,
  paginasDoProjeto,
  tamanho,
  termoProjeto,
} from '@/lib/projetos-termos';
import type { ResumoDoProjeto as Dados } from '@/lib/projetos';

export default function ResumoDoProjeto({
  dados,
  lojaNome,
}: {
  dados: Dados;
  lojaNome: string;
}) {
  const { projeto: p, pedido, laminas } = dados;
  const status = termoProjeto(p.status);
  const naoUsadas = Math.max(0, (p.fotos_enviadas ?? 0) - (p.fotos_usadas ?? 0));

  // O navegador usa o `document.title` como nome sugerido do PDF. Trocar só
  // durante a impressão evita que a aba fique com o nome do arquivo depois.
  const [titulo] = useState(() => `${p.codigo ?? 'projeto'}-resumo`);
  useEffect(() => {
    const original = document.title;
    const antes = () => {
      document.title = titulo;
    };
    const depois = () => {
      document.title = original;
    };
    window.addEventListener('beforeprint', antes);
    window.addEventListener('afterprint', depois);
    return () => {
      window.removeEventListener('beforeprint', antes);
      window.removeEventListener('afterprint', depois);
      document.title = original;
    };
  }, [titulo]);

  const imprimir = () => window.print();

  return (
    // O padding do container vem da casca (ShellLojista); aqui só o ritmo interno.
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <style>{`
        @media print {
          aside, header, nav, [data-no-print] { display: none !important; }
          body { background: #fff !important; }
          .resumo-folha { padding: 0 !important; }
          .resumo-bloco { break-inside: avoid; box-shadow: none !important; }
          .resumo-miniaturas { grid-template-columns: repeat(4, minmax(0,1fr)) !important; }
        }
        @page { margin: 12mm; }
      `}</style>

      {/* Barra de ações — não sai no papel */}
      <div
        data-no-print
        style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}
      >
        <Link
          href={`/projetos/${p.id}`}
          style={{
            padding: '8px 14px',
            border: `1px solid ${COR.linha}`,
            borderRadius: RAIO.botao,
            color: COR.texto,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
            background: COR.papel,
          }}
        >
          ← Voltar ao projeto
        </Link>
        <span style={{ flex: 1 }} />
        <Acao onClick={imprimir} primaria>
          Imprimir
        </Acao>
        <Acao onClick={imprimir}>Gerar PDF</Acao>
        <Acao onClick={imprimir}>Baixar PDF</Acao>
      </div>

      <div className="resumo-folha" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Cabeçalho do documento */}
        <header
          style={{
            display: 'flex',
            gap: 20,
            alignItems: 'flex-start',
            borderBottom: `2px solid ${COR.tinta}`,
            paddingBottom: 14,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: COR.apagado, letterSpacing: .6 }}>
              {lojaNome.toUpperCase()} · RESUMO DO PROJETO
            </p>
            <h1
              style={{
                margin: '6px 0 0',
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: -.6,
                color: COR.tinta,
              }}
            >
              {p.titulo}
            </h1>
            <p style={{ margin: '6px 0 0', fontSize: 13, color: COR.texto }}>
              <span style={{ fontFamily: 'ui-monospace, monospace', fontWeight: 700 }}>
                {p.codigo ?? '—'}
              </span>
              {' · '}
              {p.clientes?.nome ?? 'sem cliente'}
              {pedido && (
                <>
                  {' · '}
                  pedido{' '}
                  <span style={{ fontFamily: 'ui-monospace, monospace' }}>
                    {pedido.codigo ?? `#${pedido.numero}`}
                  </span>
                </>
              )}
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <Selo tom={status.tom}>{status.rotulo}</Selo>
            <span style={{ fontSize: 11.5, color: COR.fraco }}>
              Emitido em {dataHora(new Date().toISOString())}
            </span>
          </div>
        </header>

        {/* Números de uma olhada */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, minmax(0,1fr))',
            gap: 10,
          }}
        >
          <Numero rotulo="Lâminas" valor={laminasDoProjeto(p.total_paginas)} />
          <Numero rotulo="Páginas" valor={paginasDoProjeto(p.total_paginas)} />
          <Numero rotulo="Fotos enviadas" valor={p.fotos_enviadas ?? 0} />
          <Numero rotulo="Fotos usadas" valor={p.fotos_usadas ?? 0} />
          <Numero rotulo="Não usadas" valor={naoUsadas} />
          <Numero rotulo="Textos" valor={dados.totalTextos} />
        </div>

        {/* Identificação · Produto · Técnicas */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
            gap: 14,
            alignItems: 'start',
          }}
        >
          <Bloco titulo="Identificação">
            <Linha rotulo="Código" valor={p.codigo} mono />
            <Linha rotulo="Cliente" valor={p.clientes?.nome} />
            <Linha rotulo="E-mail" valor={p.clientes?.email} />
            <Linha rotulo="Filial" valor={p.filiais?.nome} />
            <Linha rotulo="Galeria" valor={p.galerias?.nome} />
            <Linha
              rotulo="Pedido"
              valor={
                pedido ? (
                  <a href={`/pedidos/${pedido.id}`} style={{ color: COR.azul, fontWeight: 600 }}>
                    {pedido.codigo ?? `#${pedido.numero}`}
                  </a>
                ) : (
                  'sem pedido'
                )
              }
            />
          </Bloco>

          <Bloco titulo="Produto e formato">
            <Linha rotulo="Produto" valor={p.produto_nome} />
            <Linha rotulo="Tamanho" valor={p.produto_tamanho} />
            <Linha rotulo="Formato aberto" valor={p.formato_aberto} />
            <Linha rotulo="Formato fechado" valor={p.formato_fechado} />
            <Linha
              rotulo="Dimensão"
              valor={p.largura_mm && p.altura_mm ? `${p.largura_mm} × ${p.altura_mm} mm` : null}
            />
            <Linha rotulo="Dorso" valor={p.dorso_mm ? `${p.dorso_mm} mm` : null} />
          </Bloco>

          <Bloco titulo="Características técnicas">
            <Linha rotulo="Resolução" valor="300 dpi" />
            <Linha rotulo="Sangria" valor="3 mm por borda" />
            <Linha rotulo="Área segura" valor="8 mm" />
            <Linha rotulo="Perfil de saída" valor="JPEG 4:4:4, qualidade 92" />
            <Linha rotulo="Capa" valor={p.capa_url ? (p.capa_tipo ?? 'sim') : 'sem capa'} />
            <Linha rotulo="Tamanho total" valor={tamanho(p.bytes_total)} />
          </Bloco>
        </div>

        {/* Capa */}
        {dados.capa && (
          <Bloco titulo="Capa">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={dados.capa}
              alt={`Capa de ${p.titulo}`}
              style={{
                maxWidth: 260,
                width: '100%',
                borderRadius: 12,
                border: `1px solid ${COR.linha}`,
                display: 'block',
                marginTop: 10,
              }}
            />
          </Bloco>
        )}

        {/* Miniaturas das páginas */}
        <Bloco titulo={`Lâminas (${laminas.length})`}>
          {laminas.length === 0 ? (
            <p style={{ margin: '10px 0 0', fontSize: 13, color: COR.apagado }}>
              O documento ainda não tem lâminas. Elas aparecem aqui assim que o cliente
              montar o álbum no editor.
            </p>
          ) : (
            <div
              className="resumo-miniaturas"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
                gap: 12,
                marginTop: 12,
              }}
            >
              {laminas.map((l) => (
                <figure key={l.numero} style={{ margin: 0 }}>
                  <div
                    style={{
                      aspectRatio: '2 / 1',
                      borderRadius: 10,
                      border: `1px solid ${COR.linha}`,
                      background: COR.papelSuave,
                      overflow: 'hidden',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {l.miniatura ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={l.miniatura}
                        alt={`Lâmina ${l.numero}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      // Sem render ainda: o esquema da folha aberta, com o vinco
                      // no meio. Melhor que um quadrado quebrado.
                      <div style={{ display: 'flex', width: '100%', height: '100%' }}>
                        <EsquemaPagina layout={l.layoutEsquerda} />
                        <div style={{ width: 1, background: COR.linha }} />
                        <EsquemaPagina layout={l.layoutDireita} />
                      </div>
                    )}
                  </div>
                  <figcaption
                    style={{
                      marginTop: 6,
                      fontSize: 11.5,
                      color: COR.apagado,
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 8,
                    }}
                  >
                    <span style={{ fontWeight: 700, color: COR.tinta2 }}>
                      Lâmina {l.numero}
                    </span>
                    <span>
                      pág. {l.paginas[0]}–{l.paginas[1]} · {l.fotos} foto
                      {l.fotos === 1 ? '' : 's'}
                      {l.textos > 0 && ` · ${l.textos} texto${l.textos === 1 ? '' : 's'}`}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </Bloco>

        <footer
          style={{
            borderTop: `1px solid ${COR.linha}`,
            paddingTop: 10,
            fontSize: 11.5,
            color: COR.fraco,
            display: 'flex',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <span>
            {lojaNome} · {p.codigo ?? p.id}
          </span>
          <span>Criado em {dataHora(p.criado_em)} · Alterado em {dataHora(p.atualizado_em)}</span>
        </footer>
      </div>
    </div>
  );
}

/* -------------------------------- pedaços -------------------------------- */

function Acao({
  children,
  onClick,
  primaria,
}: {
  children: React.ReactNode;
  onClick: () => void;
  primaria?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        height: 36,
        padding: '0 16px',
        borderRadius: RAIO.botao,
        border: primaria ? 0 : `1px solid ${COR.linha}`,
        background: primaria ? COR.gradiente : COR.papel,
        color: primaria ? '#fff' : COR.texto,
        fontSize: 13,
        fontWeight: primaria ? 700 : 600,
        cursor: 'pointer',
        boxShadow: primaria ? SOMBRA.acao : undefined,
      }}
    >
      {children}
    </button>
  );
}

function Numero({ rotulo, valor }: { rotulo: string; valor: number }) {
  return (
    <div
      className="resumo-bloco"
      style={{
        background: COR.papel,
        border: `1px solid ${COR.linha}`,
        borderRadius: 14,
        padding: '12px 14px',
        boxShadow: SOMBRA.cartao,
      }}
    >
      <p style={{ margin: 0, fontSize: 11.5, fontWeight: 600, color: COR.apagado }}>{rotulo}</p>
      <p style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 800, color: COR.tinta, letterSpacing: -.5 }}>
        {valor}
      </p>
    </div>
  );
}

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section
      className="resumo-bloco"
      style={{
        background: COR.papel,
        border: `1px solid ${COR.linha}`,
        borderRadius: RAIO.cartao,
        padding: '14px 16px 16px',
        boxShadow: SOMBRA.cartao,
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: 13,
          fontWeight: 700,
          color: COR.tinta,
          letterSpacing: -.2,
        }}
      >
        {titulo}
      </h2>
      {children}
    </section>
  );
}

function Linha({
  rotulo,
  valor,
  mono,
}: {
  rotulo: string;
  valor: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0,110px) minmax(0,1fr)',
        gap: 10,
        alignItems: 'baseline',
        padding: '8px 0',
        borderTop: `1px solid ${COR.linhaClara}`,
        fontSize: 13,
      }}
    >
      <span style={{ color: COR.apagado, fontSize: 12 }}>{rotulo}</span>
      <span
        style={{
          color: COR.tinta,
          fontWeight: 600,
          fontFamily: mono ? 'ui-monospace, monospace' : undefined,
          wordBreak: 'break-word',
        }}
      >
        {valor === null || valor === undefined || valor === '' ? '—' : valor}
      </span>
    </div>
  );
}

/**
 * Esquema da página quando ainda não há renderização.
 *
 * Não tenta desenhar o layout de verdade: mostra o nome do molde e um bloco
 * neutro. Inventar um preview que não corresponde ao documento seria pior que
 * não mostrar nada.
 */
function EsquemaPagina({ layout }: { layout: string }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 10,
        color: COR.fraco,
        padding: 6,
        textAlign: 'center',
        wordBreak: 'break-word',
      }}
    >
      {layout}
    </div>
  );
}
