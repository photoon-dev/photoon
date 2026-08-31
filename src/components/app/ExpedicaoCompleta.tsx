'use client';

/**
 * Lista completa de expedicao, agrupada pelos 10 estados do briefing.
 *
 * Os 10 estados aparecem como filter chips no topo (clicáveis). A lista
 * embaixo mostra os envios do estado selecionado, com todos os campos
 * do briefing: transportadora, modalidade, volumes, peso, dimensoes,
 * coleta_em, previsao_em, SLA, responsavel, etiqueta_url, rastreio.
 *
 * Substitui o ResumoExpedicao + ExpedicaoDoDesign (que tinha 5 abas) por
 * uma view unica. O estado selecionado fica na URL (?estado=...).
 */

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition } from 'react';
import Link from 'next/link';
import { COR, type Tom } from '@/components/ui/tokens';
import Selo from '@/components/ui/Selo';
import EstadoVazio from '@/components/ui/EstadoVazio';
import { COLUNAS_EXPEDICAO, colunaDaExpedicao } from '@/lib/pedidos-termos';
import type { ExpedicaoCompleta } from '@/lib/pedidos';

const TOM_ESTADO: Record<string, Tom> = {
  aguardando_embalagem: 'neutro',
  pronto_para_envio: 'ciano',
  etiqueta_gerada: 'azul',
  aguardando_coleta: 'azul',
  postado: 'azul',
  em_transito: 'ciano',
  entregue: 'verde',
  problema_na_entrega: 'coral',
  retornado: 'coral',
  devolvido: 'coral',
};

export default function ExpedicaoCompleta({
  envios,
}: {
  envios: ExpedicaoCompleta[];
}) {
  const router = useRouter();
  const busca = useSearchParams();
  const caminho = usePathname();
  const [pendente, iniciar] = useTransition();

  const estadoAtivo = busca.get('estado') ?? '';

  const contagem = COLUNAS_EXPEDICAO.map((c) => ({
    coluna: c.id,
    rotulo: c.rotulo,
    tom: c.tom as Tom,
    quantidade: envios.filter((e) => colunaDaExpedicao(e.estado) === c.id).length,
  }));

  const visiveis = estadoAtivo
    ? envios.filter((e) => colunaDaExpedicao(e.estado) === estadoAtivo)
    : envios;

  const selecionar = (coluna: string) => {
    const p = new URLSearchParams(busca.toString());
    if (coluna === '' || p.get('estado') === coluna) p.delete('estado');
    else p.set('estado', coluna);
    const s = p.toString();
    iniciar(() => router.push(s ? `${caminho}?${s}` : caminho));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Chips dos 10 estados */}
      <section
        style={{
          background: COR.papel,
          border: `1px solid ${COR.linha}`,
          borderRadius: 16,
          padding: '14px 16px',
          boxShadow: '0 2px 8px rgba(11,18,32,.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: COR.tinta }}>
          Estados da expedição
        </h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          <button
            type="button"
            onClick={() => selecionar('')}
            style={{
              padding: '7px 12px',
              border: `1px solid ${estadoAtivo === '' ? COR.azul : COR.linha}`,
              borderRadius: 999,
              background: estadoAtivo === '' ? COR.azul : COR.papel,
              color: estadoAtivo === '' ? COR.papel : COR.texto,
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Todos ({envios.length})
          </button>
          {contagem.map((c) => {
            const ativo = estadoAtivo === c.coluna;
            return (
              <button
                key={c.coluna}
                type="button"
                onClick={() => selecionar(c.coluna)}
                style={{
                  padding: '7px 12px',
                  border: `1px solid ${ativo ? COR.azul : COR.linha}`,
                  borderRadius: 999,
                  background: ativo ? COR.azul : COR.papel,
                  color: ativo ? COR.papel : COR.texto,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <Selo tom={c.tom}>{c.rotulo}</Selo>
                <span>{c.quantidade}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Lista de envios */}
      <section
        style={{
          background: COR.papel,
          border: `1px solid ${COR.linha}`,
          borderRadius: 16,
          padding: '4px 0',
          boxShadow: '0 2px 8px rgba(11,18,32,.03)',
          overflow: 'hidden',
        }}
      >
        {visiveis.length === 0 ? (
          <EstadoVazio
            titulo={estadoAtivo ? 'Nenhum envio neste estado' : 'Nenhum envio ainda'}
            descricao={
              estadoAtivo
                ? 'Tente outro estado acima ou limpe o filtro.'
                : 'Envios aparecem aqui assim que o pedido entra em produção e expedição.'
            }
          />
        ) : (
          <div>
            {visiveis.map((e) => (
              <Linha key={e.id} e={e} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Linha({ e }: { e: ExpedicaoCompleta }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '0.8fr 1.4fr 1fr 0.8fr 0.8fr 1fr 0.7fr 0.8fr 0.7fr 0.7fr 0.7fr',
        gap: 12,
        alignItems: 'center',
        padding: '14px 22px',
        borderBottom: `1px solid ${COR.linhaClara}`,
        fontSize: 12.5,
      }}
    >
      <Link
        href={`/pedidos/${e.pedido_id}`}
        style={{ fontFamily: 'monospace', fontWeight: 700, color: COR.azul, textDecoration: 'none' }}
      >
        #{e.pedido_numero}
      </Link>
      <span style={{ color: COR.texto, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {e.cliente_nome ?? '—'}
      </span>
      <span style={{ color: COR.texto }}>{e.transportadora ?? '—'}</span>
      <span style={{ color: COR.texto, fontSize: 11.5 }}>{e.modalidade ?? '—'}</span>
      <Selo tom={TOM_ESTADO[colunaDaExpedicao(e.estado)] ?? 'neutro'}>
        {rotuloEstado(e.estado)}
      </Selo>
      <span
        style={{
          color: COR.texto,
          fontFamily: 'monospace',
          fontSize: 11.5,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {e.rastreio ?? '—'}
      </span>
      <span style={{ color: COR.apagado, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
        {e.volumes ?? '—'}
      </span>
      <span style={{ color: COR.apagado, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
        {e.peso_kg ? `${e.peso_kg} kg` : '—'}
      </span>
      <span style={{ color: COR.apagado, fontVariantNumeric: 'tabular-nums' }}>
        {e.largura_cm && e.altura_cm && e.profundidade_cm
          ? `${e.largura_cm}×${e.altura_cm}×${e.profundidade_cm}`
          : '—'}
      </span>
      <span style={{ color: COR.apagado, fontVariantNumeric: 'tabular-nums' }}>
        {e.sla_dias ? `${e.sla_dias}d` : '—'}
      </span>
      <span style={{ color: COR.apagado, fontSize: 11.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={e.responsavel ?? ''}>
        {e.responsavel ?? '—'}
      </span>
    </div>
  );
}

function rotuloEstado(estado: string): string {
  const c = colunaDaExpedicao(estado);
  const found = COLUNAS_EXPEDICAO.find((x) => x.id === c);
  return found?.rotulo ?? estado;
}
