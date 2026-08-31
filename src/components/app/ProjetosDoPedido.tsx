'use client';

import Link from 'next/link';
import { COR, type Tom } from '@/components/ui/tokens';
import EstadoVazio from '@/components/ui/EstadoVazio';
import Selo from '@/components/ui/Selo';
import { moeda } from '@/lib/pedidos-termos';
import { termoProjeto } from '@/lib/projetos-termos';
import RenderizarTudoBotao from '@/components/app/RenderizarTudoBotao';
import type { ProjetoDoPedido } from '@/lib/pedidos';

/**
 * Aba "Projetos" do detalhe do pedido.
 *
 * A relação é REAL: cada linha vem de `pedido_itens.projeto_id`, com o projeto
 * resolvido por junção interna. Não inferimos por nome, código ou cliente.
 *
 * O botão "Renderizar tudo" só aparece quando há projetos. A simulação e a
 * criação de jobs são feitas em `RenderizarTudoBotao`, que valida projeto a
 * projeto antes de criar qualquer `render_job`.
 */

const STATUS_TOM: Record<string, Tom> = {
  nao_iniciado: 'neutro',
  em_edicao: 'azul',
  com_pendencias: 'ambar',
  pronto: 'verde',
  finalizado: 'ciano',
  aguardando_cliente: 'indigo',
  fechado: 'neutro',
  em_renderizacao: 'azul',
  renderizado: 'verde',
  com_erro: 'coral',
  arquivado: 'neutro',
};

const RENDER_TOM: Record<string, Tom> = {
  na_fila: 'neutro',
  preparando: 'neutro',
  baixando: 'azul',
  processando: 'azul',
  upload: 'azul',
  concluida: 'verde',
  erro: 'coral',
  cancelada: 'coral',
};

const formatar = (mm: number | null) => (mm ? `${mm} mm` : '—');

export default function ProjetosDoPedido({
  pedidoId,
  projetos,
}: {
  pedidoId: string;
  projetos: ProjetoDoPedido[];
}) {
  if (projetos.length === 0) {
    return (
      <EstadoVazio
        titulo="Este pedido não tem projetos"
        descricao="Itens sem projeto_id continuam aparecendo na aba Resumo, como venda avulsa."
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        <h2 style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: COR.tinta }}>
          Projetos do pedido
        </h2>
        <Selo tom="azul">{projetos.length}</Selo>
        <span style={{ fontSize: 12.5, color: COR.apagado, flex: 1 }}>
          Cada linha vem de <code style={{ fontFamily: 'monospace' }}>pedido_itens.projeto_id</code>.
        </span>
        <RenderizarTudoBotao pedidoId={pedidoId} />
      </div>

      <div
        style={{
          background: COR.papel,
          border: `1px solid ${COR.linha}`,
          borderRadius: 20,
          boxShadow: '0 2px 8px rgba(11,18,32,.03)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.4fr 1.6fr 1fr 1fr 0.8fr 1.1fr 1fr',
            gap: 16,
            padding: '10px 22px',
            borderBottom: `1px solid ${COR.linhaClara}`,
            background: '#FBFCFE',
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '1.1px',
            textTransform: 'uppercase',
            color: COR.fraco,
          }}
        >
          <span>Código</span>
          <span>Projeto</span>
          <span>Produto</span>
          <span>Formato</span>
          <span style={{ textAlign: 'right' }}>Qtd</span>
          <span>Status · Render</span>
          <span style={{ textAlign: 'right' }}>Ações</span>
        </div>

        {projetos.map((p) => {
          const tProj = termoProjeto(p.status);
          const tProjTom = STATUS_TOM[p.status] ?? 'neutro';
          const r = p.render;
          return (
            <div
              key={p.item_id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.4fr 1.6fr 1fr 1fr 0.8fr 1.1fr 1fr',
                gap: 16,
                alignItems: 'center',
                padding: '14px 22px',
                borderBottom: `1px solid ${COR.linhaClara}`,
                fontSize: 13.5,
              }}
            >
              <span
                style={{
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  color: COR.tinta,
                  fontSize: 13,
                }}
              >
                {p.codigo ?? '—'}
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
                <Link
                  href={`/projetos/${p.projeto_id}`}
                  style={{ color: COR.azul, fontWeight: 600, textDecoration: 'none' }}
                >
                  {p.titulo || p.descricao || 'Projeto sem título'}
                </Link>
                <span style={{ fontSize: 12, color: COR.apagado }}>
                  {p.paginas > 0 ? `${p.paginas} pág · ` : ''}
                  {p.fotos > 0 ? `${p.fotos} fotos · ` : ''}
                  {moeda(p.total)}
                </span>
              </div>

              <span style={{ color: COR.texto, fontSize: 13 }}>
                {p.categoria ?? '—'}
              </span>

              <span style={{ color: COR.texto, fontSize: 12.5 }}>
                {formatar(p.largura_mm)} × {formatar(p.altura_mm)}
              </span>

              <span
                style={{
                  textAlign: 'right',
                  color: COR.texto,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {p.quantidade} × {moeda(p.preco_unit)}
              </span>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Selo tom={tProjTom}>{tProj.rotulo}</Selo>
                {r ? (
                  <Selo tom={RENDER_TOM[r.estado] ?? 'neutro'}>
                    Render: {r.estado}
                    {r.progresso > 0 && r.progresso < 100 ? ` · ${r.progresso}%` : ''}
                  </Selo>
                ) : (
                  <span style={{ fontSize: 11.5, color: COR.fraco }}>Sem job</span>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  justifyContent: 'flex-end',
                  flexWrap: 'wrap',
                }}
              >
                <Link
                  href={`/projetos/${p.projeto_id}`}
                  style={{
                    padding: '7px 12px',
                    border: `1px solid ${COR.linha}`,
                    borderRadius: 999,
                    background: COR.papel,
                    color: COR.texto,
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Abrir
                </Link>
                {r && (
                  <Link
                    href={`/renderizacao?projeto=${p.projeto_id}`}
                    style={{
                      padding: '7px 12px',
                      border: `1px solid ${COR.linha}`,
                      borderRadius: 999,
                      background: COR.papel,
                      color: COR.texto,
                      fontSize: 12,
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    Ver render
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
