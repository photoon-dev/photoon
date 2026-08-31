'use client';

/**
 * Lista de pedidos com selecao + barra de acoes em massa.
 *
 * Substitui o PedidosDoDesign na renderizacao do /pedidos. Mantem o
 * visual do design antigo (mesmas cores e dimensoes) mas adiciona:
 *   - coluna de checkbox para selecao multipla
 *   - barra de acoes em massa no topo quando ha itens selecionados
 *   - confirmacao via Modal antes de cada acao sensivel
 *   - exportar CSV via blob/download
 *
 * Acoes implementadas:
 *   - Confirmar pagamento   (server action)
 *   - Enviar para producao (server action, abre ficha)
 *   - Alterar status        (server action, com select de estado)
 *   - Exportar CSV          (client side, gera blob)
 *   - Gerar OS              (link para /pedidos/:id/os do primeiro selecionado)
 *   - Gerar etiqueta        (placeholder)
 *
 * As acoes pedem confirmacao antes de executar (via Modal de confirmacao
 * customizado, com motivo opcional para auditoria).
 */

import { useState, useTransition, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { COR, type Tom } from '@/components/ui/tokens';
import Selo from '@/components/ui/Selo';
import Botao from '@/components/ui/Botao';
import { moeda, dataCurta } from '@/lib/pedidos-termos';
import {
  confirmarPagamentoEmMassa,
  enviarParaProducaoEmMassa,
  alterarStatusEmMassa,
  exportarPedidosCSV,
} from '@/app/app/actions-pedidos-acoes-em-massa';
import type { PedidoResumo } from '@/lib/pedidos';

const TOM_ESTADO: Record<string, Tom> = {
  rascunho: 'neutro',
  aguardando_pagamento: 'ambar',
  pago: 'verde',
  em_producao: 'azul',
  pronto: 'ciano',
  enviado: 'indigo',
  entregue: 'verde',
  cancelado: 'coral',
};

type Acao = 'confirmar_pagamento' | 'enviar_producao' | 'alterar_status' | 'gerar_os' | 'gerar_etiqueta' | 'exportar';

export default function ListaPedidosSelecionaveis({
  pedidos,
  total,
  naoVistos,
}: {
  pedidos: PedidoResumo[];
  total: number;
  naoVistos: number;
}) {
  const router = useRouter();
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [pendente, iniciar] = useTransition();
  const [confirmAberto, setConfirmAberto] = useState<{ acao: Acao; novoEstado?: string } | null>(null);

  const todosVisiveis = pedidos.map((p) => p.id);
  const todosSelecionados = useMemo(
    () => todosVisiveis.length > 0 && todosVisiveis.every((id) => selecionados.has(id)),
    [todosVisiveis, selecionados],
  );

  const alternarTodos = () => {
    setSelecionados((prev) => {
      const prox = new Set(prev);
      if (todosSelecionados) {
        for (const id of todosVisiveis) prox.delete(id);
      } else {
        for (const id of todosVisiveis) prox.add(id);
      }
      return prox;
    });
  };

  const alternar = (id: string) => {
    setSelecionados((prev) => {
      const prox = new Set(prev);
      if (prox.has(id)) prox.delete(id);
      else prox.add(id);
      return prox;
    });
  };

  const limpar = () => setSelecionados(new Set());

  const idsArray = Array.from(selecionados);

  const executar = async (fd: FormData) => {
    if (idsArray.length === 0) return;
    for (const id of idsArray) fd.append('pedido_id', id);
    return fd;
  };

  const confirmar = async () => {
    if (!confirmAberto) return;
    setConfirmAberto(null);
    const fd = new FormData();
    if (confirmAberto.novoEstado) fd.set('estado', confirmAberto.novoEstado);
    await executar(fd);
    if (confirmAberto.acao === 'confirmar_pagamento') {
      iniciar(async () => {
        await confirmarPagamentoEmMassa(fd);
        limpar();
        router.refresh();
      });
    } else if (confirmAberto.acao === 'enviar_producao') {
      iniciar(async () => {
        await enviarParaProducaoEmMassa(fd);
        limpar();
        router.refresh();
      });
    } else if (confirmAberto.acao === 'alterar_status') {
      iniciar(async () => {
        await alterarStatusEmMassa(fd);
        limpar();
        router.refresh();
      });
    } else if (confirmAberto.acao === 'exportar') {
      iniciar(async () => {
        const r = await exportarPedidosCSV(fd);
        const blob = new Blob([r.csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pedidos-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        limpar();
      });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Barra de acoes em massa */}
      {selecionados.size > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
            padding: '12px 16px',
            background: COR.gradiente,
            color: COR.papel,
            borderRadius: 14,
            boxShadow: '0 8px 20px rgba(37,99,235,.28)',
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 13 }}>
            {selecionados.size} selecionado{selecionados.size === 1 ? '' : 's'}
          </span>
          <span style={{ flex: 1 }} />
          <Botao variante="secundario" onClick={() => setConfirmAberto({ acao: 'confirmar_pagamento' })}>
            Confirmar pagamento
          </Botao>
          <Botao variante="secundario" onClick={() => setConfirmAberto({ acao: 'enviar_producao' })}>
            Enviar para producao
          </Botao>
          <Botao
            variante="secundario"
            onClick={() => {
              const novo = window.prompt('Novo estado (rascunho, aguardando_pagamento, pago, em_producao, pronto, enviado, entregue, cancelado):');
              if (novo) setConfirmAberto({ acao: 'alterar_status', novoEstado: novo });
            }}
          >
            Alterar status
          </Botao>
          {idsArray.length === 1 && (
            <Link
              href={`/pedidos/${idsArray[0]}/os`}
              style={{
                padding: '8px 14px',
                border: 0,
                borderRadius: 12,
                background: COR.papel,
                color: COR.azul,
                fontSize: 12.5,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Gerar OS
            </Link>
          )}
          <Botao variante="secundario" disabled title="Em breve">
            Gerar etiqueta
          </Botao>
          <Botao variante="secundario" onClick={() => setConfirmAberto({ acao: 'exportar' })}>
            Exportar CSV
          </Botao>
          <button
            type="button"
            onClick={limpar}
            style={{
              padding: '8px 12px',
              background: 'transparent',
              border: 0,
              color: COR.papel,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Limpar
          </button>
        </div>
      )}

      {/* Tabela */}
      <div
        style={{
          background: COR.papel,
          border: `1px solid ${COR.linha}`,
          borderRadius: 16,
          boxShadow: '0 2px 8px rgba(11,18,32,.03)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '40px 1fr 1.4fr 1fr 1fr 1fr 0.8fr',
            gap: 12,
            padding: '12px 18px',
            borderBottom: `1px solid ${COR.linhaClara}`,
            background: '#FBFCFE',
            alignItems: 'center',
          }}
        >
          <input
            type="checkbox"
            checked={todosSelecionados}
            onChange={alternarTodos}
            aria-label="Selecionar todos"
          />
          <span style={cabecalho}>Pedido</span>
          <span style={cabecalho}>Cliente</span>
          <span style={cabecalho}>Estado</span>
          <span style={cabecalho}>Canal</span>
          <span style={{ ...cabecalho, textAlign: 'right' }}>Valor</span>
          <span style={{ ...cabecalho, textAlign: 'right' }}>Prazo</span>
        </div>
        {pedidos.length === 0 ? (
          <p style={{ padding: 28, textAlign: 'center', color: COR.apagado, fontSize: 13.5 }}>
            Nenhum pedido com esses filtros.
          </p>
        ) : (
          pedidos.map((p) => (
            <div
              key={p.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '40px 1fr 1.4fr 1fr 1fr 1fr 0.8fr',
                gap: 12,
                padding: '14px 18px',
                borderBottom: `1px solid ${COR.linhaClara}`,
                alignItems: 'center',
                fontSize: 13,
                background: selecionados.has(p.id) ? '#F1F5FD' : 'transparent',
              }}
            >
              <input
                type="checkbox"
                checked={selecionados.has(p.id)}
                onChange={() => alternar(p.id)}
                aria-label={`Selecionar pedido ${p.numero}`}
              />
              <Link
                href={`/pedidos/${p.id}`}
                style={{ fontFamily: 'monospace', fontWeight: 700, color: COR.azul, textDecoration: 'none' }}
              >
                #{p.numero}
              </Link>
              <span style={{ color: COR.texto, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {p.clientes?.nome ?? '—'}
              </span>
              <span>
                <Selo tom={TOM_ESTADO[p.estado] ?? 'neutro'}>
                  {rotuloEstado(p.estado)}
                </Selo>
              </span>
              <span style={{ color: COR.apagado, fontSize: 12 }}>{p.canal}</span>
              <span style={{ textAlign: 'right', fontWeight: 700, color: COR.tinta, fontVariantNumeric: 'tabular-nums' }}>
                {moeda(p.total)}
              </span>
              <span style={{ textAlign: 'right', color: COR.apagado, fontVariantNumeric: 'tabular-nums' }}>
                {p.prazo_em ? dataCurta(p.prazo_em) : '—'}
              </span>
            </div>
          ))
        )}
        <div
          style={{
            padding: '12px 18px',
            borderTop: `1px solid ${COR.linhaClara}`,
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12.5,
            color: COR.apagado,
          }}
        >
          <span>
            {total.toLocaleString('pt-BR')} pedido{total === 1 ? '' : 's'} no total ·{' '}
            {naoVistos} nao visto{naoVistos === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Modal de confirmacao */}
      {confirmAberto && (
        <div
          role="dialog"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(11,18,32,.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => setConfirmAberto(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COR.papel,
              borderRadius: 20,
              padding: 24,
              maxWidth: 460,
              width: '90%',
              boxShadow: '0 30px 70px rgba(11,18,32,.3)',
            }}
          >
            <h3 style={{ margin: '0 0 8px', fontSize: 17, fontWeight: 700, color: COR.tinta }}>
              Confirmar acao em {selecionados.size} pedido{selecionados.size === 1 ? '' : 's'}?
            </h3>
            <p style={{ margin: '0 0 20px', fontSize: 13.5, color: COR.texto, lineHeight: 1.6 }}>
              {confirmAberto.acao === 'confirmar_pagamento' && 'Vai marcar todos os pedidos selecionados como pagos. Acao reversivel: cada pedido pode voltar a aguardando_pagamento depois.'}
              {confirmAberto.acao === 'enviar_producao' && 'Vai colocar todos os pedidos em producao e abrir ficha de producao para cada um. Acao reversivel.'}
              {confirmAberto.acao === 'alterar_status' && (
                <>Vai alterar o estado de todos os pedidos selecionados para <b>{confirmAberto.novoEstado}</b>. Acao registrada na auditoria.</>
              )}
              {confirmAberto.acao === 'exportar' && 'Vai baixar um CSV com os pedidos selecionados. Nenhuma alteracao no banco.'}
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <Botao variante="secundario" onClick={() => setConfirmAberto(null)}>Cancelar</Botao>
              <Botao variante="primario" onClick={confirmar} ocupado={pendente}>
                Confirmar
              </Botao>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const cabecalho: React.CSSProperties = {
  fontSize: 10.5,
  fontWeight: 700,
  letterSpacing: '1.1px',
  textTransform: 'uppercase',
  color: COR.fraco,
};

const ROTULOS: Record<string, string> = {
  rascunho: 'Rascunho',
  aguardando_pagamento: 'Aguarda pgto',
  pago: 'Pago',
  em_producao: 'Em producao',
  pronto: 'Pronto',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
};

function rotuloEstado(estado: string): string {
  return ROTULOS[estado] ?? estado;
}
