'use client';

import Link from 'next/link';
import { COR, type Tom } from '@/components/ui/tokens';
import Selo from '@/components/ui/Selo';
import EstadoVazio from '@/components/ui/EstadoVazio';
import { dataHora } from '@/lib/pedidos-termos';
import type { ArquivoDoPedido } from '@/lib/pedidos';

const TIPOS_PADRAO = ['original', 'renderizado', 'preview', 'auxiliar', 'os', 'etiqueta', 'comprovante'];

const TIPO_TOM: Record<string, Tom> = {
  original: 'azul',
  renderizado: 'verde',
  preview: 'indigo',
  auxiliar: 'neutro',
  os: 'ambar',
  etiqueta: 'ambar',
  comprovante: 'ciano',
};

const formatarBytes = (b: number) => {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 * 1024 * 1024) return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  return `${(b / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

/**
 * Aba Arquivos do detalhe do pedido.
 *
 * Os arquivos vêm dos `projeto_arquivos` dos projetos do pedido, via join
 * `pedido_itens → projetos → projeto_arquivos`. Filtra `removido_em IS NULL`
 * — nada some em silêncio (regra 14).
 *
 * A UI separa por `tipo` (originais, renderizados, previews, OS, etiquetas,
 * comprovantes) e mantém o link para o projeto de origem. O download
 * propriamente dito fica para a Fase 8.4 — usa `urlAssinada` do projeto.
 */
export default function ArquivosDoPedido({
  arquivos,
}: {
  arquivos: ArquivoDoPedido[];
}) {
  if (arquivos.length === 0) {
    return (
      <EstadoVazio
        titulo="Nenhum arquivo ainda"
        descricao="Originais sobem com o envio, renderizados vêm do worker de renderização, OS e comprovantes entram quando a produção avança."
      />
    );
  }

  // Agrupa por tipo, preservando a ordem do array.
  const grupos = new Map<string, ArquivoDoPedido[]>();
  for (const a of arquivos) {
    const lista = grupos.get(a.tipo) ?? [];
    lista.push(a);
    grupos.set(a.tipo, lista);
  }

  // Ordena os grupos pelos tipos conhecidos, depois pelos extras.
  const tiposOrdenados = [
    ...TIPOS_PADRAO.filter((t) => grupos.has(t)),
    ...[...grupos.keys()].filter((t) => !TIPOS_PADRAO.includes(t)),
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <h2 style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: COR.tinta }}>
          Arquivos do pedido
        </h2>
        <Selo tom="azul">{arquivos.length}</Selo>
        <span style={{ fontSize: 12.5, color: COR.apagado }}>
          Vindos de <code style={{ fontFamily: 'monospace' }}>projeto_arquivos</code> dos projetos associados.
        </span>
      </div>

      {tiposOrdenados.map((tipo) => {
        const lista = grupos.get(tipo) ?? [];
        return (
          <section key={tipo}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Selo tom={TIPO_TOM[tipo] ?? 'neutro'}>{tipo}</Selo>
              <span style={{ fontSize: 12, color: COR.apagado }}>{lista.length}</span>
            </div>
            <div
              style={{
                background: COR.papel,
                border: `1px solid ${COR.linha}`,
                borderRadius: 16,
                boxShadow: '0 2px 8px rgba(11,18,32,.03)',
                overflow: 'hidden',
              }}
            >
              {lista.map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1.6fr 1fr 0.8fr 0.6fr 0.9fr',
                    gap: 16,
                    alignItems: 'center',
                    padding: '12px 18px',
                    borderBottom: `1px solid ${COR.linhaClara}`,
                    fontSize: 13,
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 1, minWidth: 0 }}>
                    <span
                      style={{
                        fontWeight: 600,
                        color: COR.tinta,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {a.nome}
                    </span>
                    <span style={{ fontSize: 11.5, color: COR.fraco, fontFamily: 'monospace' }}>
                      {a.caminho}
                    </span>
                  </div>
                  <Link
                    href={`/projetos/${a.projeto_id}`}
                    style={{
                      color: COR.azul,
                      fontSize: 12.5,
                      textDecoration: 'none',
                      fontFamily: 'monospace',
                    }}
                  >
                    {a.projeto_codigo ?? a.projeto_id.slice(0, 8)}
                  </Link>
                  <span style={{ color: COR.texto, fontSize: 12.5 }}>{a.mime ?? '—'}</span>
                  <span
                    style={{
                      color: COR.texto,
                      fontSize: 12.5,
                      textAlign: 'right',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {formatarBytes(a.bytes)}
                  </span>
                  <span style={{ color: COR.apagado, fontSize: 11.5 }}>
                    v{a.versao} · {dataHora(a.criado_em)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
