'use client';

/**
 * Ordem de Servico (OS) — `/pedidos/:id/os`.
 *
 * Documento imprimível com:
 *   - cabecalho: numero do pedido, codigo PT, data, QR Code, codigo de barras
 *   - cliente: nome, telefone
 *   - filial: nome (do banco)
 *   - responsavel: vendedor do pedido
 *   - projetos: tabela com produto, formato, quantidade, papel, acabamento,
 *     capa, dorso, estojo, paginas, laminas
 *   - producao: etapa, responsavel, prazo
 *   - expedicao: estado, transportadora, rastreio
 *   - observacoes
 *
 * Toggle "Mostrar valores" esconde/exibe a coluna de preco na tabela de
 * projetos. Os botoes "Imprimir" e "Gerar PDF" chamam `window.print()` —
 * o navegador da ao usuario a escolha de impressora ou "Salvar como PDF".
 *
 * CSS de impressao em `app.css` esconde a sidebar, topbar e botoes, e
 * ajusta o layout para o formato de etiqueta de expedicao ja usado no
 * Photoon (referencia: `design/extraido/Expedicao.dc.html`).
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import bwipjs from 'bwip-js';
import { COR } from '@/components/ui/tokens';
import type { DadosDaOS } from '@/lib/pedidos';
import { moeda, dataHora, dataCurta } from '@/lib/pedidos-termos';

const FONTE = 'Plus Jakarta Sans, system-ui, sans-serif';

export default function OrdemDeServico({
  dados,
  lojaNome,
}: {
  dados: DadosDaOS;
  lojaNome: string;
}) {
  const [mostrarValores, setMostrarValores] = useState(true);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [barcodeDataUrl, setBarcodeDataUrl] = useState<string | null>(null);
  /*
   * A hora da emissao so e calculada no cliente.
   *
   * `new Date()` no corpo do componente da um valor no servidor e outro no
   * cliente — texto diferente nos dois HTMLs, que era a divergencia de
   * hidratacao ("Minified React error #418") flagrada na auditoria em 1024.
   * Comecando vazia e preenchendo no efeito, os dois lados concordam na
   * primeira pintura.
   */
  const [emitidoEm, setEmitidoEm] = useState('');
  useEffect(() => {
    setEmitidoEm(dataHora(new Date().toISOString()));
  }, []);

  /*
   * QR e codigo de barras sao gerados DEPOIS da montagem, num efeito.
   *
   * Antes isto rodava no corpo do componente, guardado por
   * `typeof window !== 'undefined'`. Duas consequencias: `setState` durante o
   * render, e uma arvore que so existia no cliente — o servidor renderizava
   * sem as imagens e o cliente com elas. O React reclamava de hidratacao
   * ("Minified React error #418") e, quando a reconciliacao falhava, jogava
   * fora a arvore inteira: a OS aparecia em branco. Aconteceu de verdade na
   * auditoria, em 1024.
   *
   * `useEffect` so roda no cliente, entao a primeira pintura e igual a do
   * servidor (sem as imagens) e elas entram na segunda. `cancelado` evita
   * escrever estado depois que a pagina foi trocada.
   */
  useEffect(() => {
    let cancelado = false;

    QRCode.toDataURL(`${window.location.origin}/pedidos/${dados.id}/os`, {
      errorCorrectionLevel: 'M',
      width: 140,
      margin: 1,
    })
      .then((url) => {
        if (!cancelado) setQrDataUrl(url);
      })
      .catch(() => {
        // QR e complemento do numero impresso ao lado; sem ele a OS serve.
      });

    if (dados.codigo) {
      try {
        const canvas = bwipjs.toCanvas({
          bcid: 'code128',
          text: dados.codigo,
          scale: 2,
          height: 14,
          includetext: true,
          textxalign: 'center',
          textsize: 8,
        }) as unknown as HTMLCanvasElement;
        if (!cancelado) setBarcodeDataUrl(canvas.toDataURL('image/png'));
      } catch {
        // silencioso: barcode e opcional
      }
    }

    return () => {
      cancelado = true;
    };
  }, [dados.id, dados.codigo]);

  return (
    <div
      style={{
        maxWidth: 880,
        margin: '0 auto',
        background: COR.papel,
        border: `1px solid ${COR.linha}`,
        borderRadius: 20,
        boxShadow: '0 2px 8px rgba(11,18,32,.03)',
        padding: 28,
        fontFamily: FONTE,
        color: COR.tinta,
        // esconde a casca no @media print via classe abaixo
      }}
      className="os-container"
    >
      <style>{`
        @media print {
          aside, header, [data-no-print], nav { display: none !important; }
          body { background: white !important; }
          .os-container {
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: 100% !important;
          }
          .os-toolbar { display: none !important; }
        }
      `}</style>

      {/* Toolbar — nao imprime */}
      <div
        className="os-toolbar"
        data-no-print
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 18,
          flexWrap: 'wrap',
        }}
      >
        <Link
          href={`/pedidos/${dados.id}`}
          style={{
            padding: '8px 14px',
            border: `1px solid ${COR.linha}`,
            borderRadius: 12,
            color: COR.texto,
            fontSize: 13,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          ← Voltar
        </Link>
        <span style={{ flex: 1 }} />
        <label
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            color: COR.texto,
          }}
        >
          <input
            type="checkbox"
            checked={mostrarValores}
            onChange={(e) => setMostrarValores(e.target.checked)}
          />
          Mostrar valores
        </label>
        <button
          onClick={() => window.print()}
          style={{
            padding: '8px 16px',
            border: 0,
            borderRadius: 12,
            background: COR.gradiente,
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(37,99,235,.28)',
          }}
        >
          Imprimir
        </button>
        <button
          onClick={() => window.print()}
          style={{
            padding: '8px 16px',
            border: `1px solid ${COR.linha}`,
            borderRadius: 12,
            background: COR.papel,
            color: COR.texto,
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Gerar PDF
        </button>
      </div>

      {/* Cabecalho */}
      <header
        style={{
          display: 'flex',
          gap: 24,
          alignItems: 'flex-start',
          borderBottom: `2px solid ${COR.tinta}`,
          paddingBottom: 16,
          marginBottom: 18,
        }}
      >
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: '1.2px', textTransform: 'uppercase', color: COR.fraco }}>
            Ordem de Servico
          </p>
          <h1 style={{ margin: '4px 0', fontSize: 30, fontWeight: 800, letterSpacing: '-1px' }}>
            Pedido #{dados.numero}
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: COR.texto }}>
            Codigo PT:{' '}
            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: COR.azul }}>
              {dados.codigo ?? '—'}
            </span>{' '}
            · aberto em {dataHora(dados.criado_em)}
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
          {qrDataUrl && (
            <img
              src={qrDataUrl}
              alt="QR do pedido"
              style={{ width: 100, height: 100, border: `1px solid ${COR.linha}`, borderRadius: 8 }}
            />
          )}
          {barcodeDataUrl && (
            <img
              src={barcodeDataUrl}
              alt={`Codigo de barras ${dados.codigo}`}
              style={{ height: 50, maxWidth: 200 }}
            />
          )}
        </div>
      </header>

      {/* Cliente + Filial + Responsavel + Prazo + Prioridade */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 14,
          marginBottom: 18,
        }}
      >
        <Campo rotulo="Cliente" valor={dados.cliente?.nome ?? 'Sem cliente'} />
        <Campo rotulo="Telefone" valor={dados.cliente?.telefone ?? '—'} mono />
        <Campo rotulo="E-mail" valor={dados.cliente?.email ?? '—'} />
        <Campo rotulo="Filial" valor={dados.filial?.nome ?? 'Matriz'} />
        <Campo rotulo="Responsavel" valor={dados.vendedor?.nome ?? '—'} />
        <Campo rotulo="Loja" valor={lojaNome} />
        <Campo
          rotulo="Prazo"
          valor={dados.prazo_em ? dataCurta(dados.prazo_em) : 'Sem prazo'}
        />
        <Campo rotulo="Prioridade" valor="Normal" />
      </section>

      {/* Projetos */}
      <section style={{ marginBottom: 18 }}>
        <h2 style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 700, color: COR.tinta }}>
          Projetos ({dados.projetos.length})
        </h2>
        <TabelaProjetos projetos={dados.projetos} mostrarValores={mostrarValores} />
      </section>

      {/* Producao + Expedicao */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 14,
          marginBottom: 18,
        }}
      >
        <Bloco
          titulo="Producao"
          itens={[
            ['Etapa', dados.producao[0]?.etapa ?? 'Fora da producao'],
            ['Responsavel', dados.producao[0]?.responsavel ?? '—'],
            ['Iniciada em', dataHora(dados.producao[0]?.iniciada_em)],
          ]}
        />
        <Bloco
          titulo="Expedicao"
          itens={[
            ['Estado', dados.expedicao?.estado ?? 'Sem envio'],
            ['Transportadora', dados.expedicao?.transportadora ?? '—'],
            ['Rastreio', dados.expedicao?.rastreio ?? '—'],
          ]}
        />
      </section>

      {/* Observacoes */}
      {dados.observacao && (
        <section style={{ marginBottom: 18 }}>
          <h2 style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 700, color: COR.tinta }}>
            Observacoes
          </h2>
          <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.55, color: COR.texto }}>
            {dados.observacao}
          </p>
        </section>
      )}

      {/* Totais (so se mostrar valores) */}
      {mostrarValores && (
        <section
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 18,
            paddingTop: 14,
            borderTop: `1px solid ${COR.linha}`,
          }}
        >
          <Tot rotulo="Subtotal" valor={Number(dados.subtotal ?? 0)} />
          <Tot rotulo="Desconto" valor={-Number(dados.desconto ?? 0)} />
          <Tot rotulo="Frete" valor={Number(dados.frete ?? 0)} />
          <Tot rotulo="Total" valor={Number(dados.total ?? 0)} forte />
        </section>
      )}

      <footer
        style={{
          marginTop: 24,
          paddingTop: 12,
          borderTop: `1px solid ${COR.linha}`,
          fontSize: 11,
          color: COR.fraco,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>OS gerada por Photoon · {lojaNome}</span>
        <span>
          pedido {dados.id.slice(0, 8)}{emitidoEm && ` · ${emitidoEm}`}
        </span>
      </footer>
    </div>
  );
}

function Campo({
  rotulo,
  valor,
  mono,
}: {
  rotulo: string;
  valor: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p
        style={{
          margin: '0 0 3px',
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: '1.1px',
          textTransform: 'uppercase',
          color: COR.fraco,
        }}
      >
        {rotulo}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 600,
          color: COR.tinta,
          fontFamily: mono ? 'monospace' : undefined,
        }}
      >
        {valor}
      </p>
    </div>
  );
}

function Bloco({
  titulo,
  itens,
}: {
  titulo: string;
  itens: Array<[string, string]>;
}) {
  return (
    <div
      style={{
        background: '#FBFCFE',
        border: `1px solid ${COR.linha}`,
        borderRadius: 14,
        padding: '14px 16px',
      }}
    >
      <h3
        style={{
          margin: '0 0 8px',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '1.1px',
          textTransform: 'uppercase',
          color: COR.fraco,
        }}
      >
        {titulo}
      </h3>
      {itens.map(([r, v]) => (
        <div key={r} style={{ display: 'flex', gap: 8, marginBottom: 4, fontSize: 13 }}>
          <span style={{ color: COR.apagado, minWidth: 110 }}>{r}</span>
          <span style={{ color: COR.tinta, fontWeight: 600 }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function Tot({
  rotulo,
  valor,
  forte,
}: {
  rotulo: string;
  valor: number;
  forte?: boolean;
}) {
  return (
    <div style={{ textAlign: 'right' }}>
      <p
        style={{
          margin: 0,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '1.1px',
          textTransform: 'uppercase',
          color: forte ? COR.tinta : COR.fraco,
        }}
      >
        {rotulo}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: forte ? 22 : 16,
          fontWeight: 800,
          color: valor < 0 ? '#059669' : COR.tinta,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {moeda(valor)}
      </p>
    </div>
  );
}

function TabelaProjetos({
  projetos,
  mostrarValores,
}: {
  projetos: DadosDaOS['projetos'];
  mostrarValores: boolean;
}) {
  if (projetos.length === 0) {
    return (
      <p style={{ margin: 0, fontSize: 13, color: COR.fraco }}>
        Nenhum projeto associado a este pedido.
      </p>
    );
  }
  // Colunas: Produto | Formato | Qtd | Papel | Acabamento | Capa | Dorso | Estojo | Paginas | Laminas | Valor
  const grade = mostrarValores
    ? '1.2fr 1fr 0.6fr 0.8fr 0.8fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr 0.8fr'
    : '1.2fr 1fr 0.6fr 0.8fr 0.8fr 0.6fr 0.6fr 0.6fr 0.6fr 0.6fr';
  return (
    <div
      style={{
        background: '#FBFCFE',
        border: `1px solid ${COR.linha}`,
        borderRadius: 12,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: grade,
          gap: 10,
          padding: '10px 16px',
          borderBottom: `1px solid ${COR.linha}`,
          background: '#F4F7FC',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: '1.1px',
          textTransform: 'uppercase',
          color: COR.fraco,
        }}
      >
        <span>Produto</span>
        <span>Formato</span>
        <span style={{ textAlign: 'right' }}>Qtd</span>
        <span>Papel</span>
        <span>Acabamento</span>
        <span>Capa</span>
        <span>Dorso</span>
        <span>Estojo</span>
        <span>Paginas</span>
        <span>Laminas</span>
        {mostrarValores && <span style={{ textAlign: 'right' }}>Valor</span>}
      </div>
      {projetos.map((p) => (
        <div
          key={p.projeto_id}
          style={{
            display: 'grid',
            gridTemplateColumns: grade,
            gap: 10,
            padding: '10px 16px',
            borderBottom: `1px solid ${COR.linhaClara}`,
            fontSize: 12.5,
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
            <span style={{ fontWeight: 700, color: COR.tinta, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {p.codigo ?? '—'}
            </span>
            <span style={{ fontSize: 11, color: COR.apagado, fontFamily: 'monospace' }}>
              {p.categoria ?? 'sem categoria'}
            </span>
          </div>
          <span style={{ color: COR.texto }}>
            {p.largura_mm && p.altura_mm ? `${p.largura_mm}×${p.altura_mm} mm` : '—'}
            {p.formato_aberto ? ` · ${p.formato_aberto}` : ''}
          </span>
          <span style={{ textAlign: 'right', color: COR.texto, fontVariantNumeric: 'tabular-nums' }}>
            {p.quantidade}
          </span>
          <span style={{ color: COR.apagado, fontSize: 11.5 }}>—</span>
          <span style={{ color: COR.apagado, fontSize: 11.5 }}>—</span>
          <span style={{ color: COR.texto, fontSize: 11.5 }}>{p.capa_tipo ?? '—'}</span>
          <span style={{ color: COR.texto, fontSize: 11.5 }}>
            {p.dorso_mm ? `${p.dorso_mm} mm` : '—'}
          </span>
          <span style={{ color: COR.apagado, fontSize: 11.5 }}>—</span>
          <span style={{ color: COR.texto, fontVariantNumeric: 'tabular-nums' }}>{p.paginas || '—'}</span>
          <span style={{ color: COR.apagado, fontSize: 11.5 }}>—</span>
          {mostrarValores && (
            <span style={{ textAlign: 'right', color: COR.tinta, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
              {moeda(p.total)}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
