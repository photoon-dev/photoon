'use client';

import { COR, type Tom } from '@/components/ui/tokens';
import Selo from '@/components/ui/Selo';
import type { ResumoExpedicao as Resumo } from '@/lib/pedidos';

/**
 * Cabeçalho de "10 estados" dentro da página de Expedição.
 *
 * Mostra uma contagem por coluna, na ordem do briefing. Sem lista, sem
 * detalhes — a lista detalhada é o `ExpedicaoDoDesign` que já existia.
 */
export default function ResumoExpedicao({ r }: { r: Resumo }) {
  return (
    <section
      style={{
        background: COR.papel,
        border: `1px solid ${COR.linha}`,
        borderRadius: 20,
        padding: '18px 22px',
        boxShadow: '0 2px 8px rgba(11,18,32,.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      <header style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: COR.tinta }}>
          Estados da expedição
        </h2>
        <span style={{ fontSize: 12.5, color: COR.apagado, flex: 1 }}>
          {r.total} envios no total. A lista detalhada fica abaixo.
        </span>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 10,
        }}
      >
        {r.colunas.map((c) => (
          <div
            key={c.coluna}
            style={{
              background: '#FBFCFE',
              border: `1px solid ${COR.linha}`,
              borderRadius: 14,
              padding: '10px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            <Selo tom={c.tom as Tom}>{c.rotulo}</Selo>
            <span
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: COR.tinta,
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.5px',
              }}
            >
              {c.quantidade}
            </span>
          </div>
        ))}
      </div>

      {(r.atrasados > 0 || r.semEtiqueta > 0 || r.semColeta > 0) && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {r.atrasados > 0 && <Selo tom="coral">{r.atrasados} com prazo vencido</Selo>}
          {r.semEtiqueta > 0 && <Selo tom="ambar">{r.semEtiqueta} sem etiqueta</Selo>}
          {r.semColeta > 0 && <Selo tom="azul">{r.semColeta} aguardando coleta</Selo>}
        </div>
      )}
    </section>
  );
}
