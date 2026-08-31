'use client';

import Link from 'next/link';
import { COR, type Tom } from '@/components/ui/tokens';
import CartaoKPI from '@/components/ui/CartaoKPI';
import type { ResumoRenderizacao as Resumo } from '@/lib/pedidos';

/**
 * Cabeçalho de "renderização" dentro da página de Produção.
 *
 * O briefing é claro: Produção não deve carregar a fila inteira de jobs
 * (quem faz isso é /renderizacao). Aqui só aparecem os números — e o
 * "Abrir Central de Renderização" leva à tela certa.
 */
export default function ResumoRenderizacao({ r }: { r: Resumo }) {
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
          Renderização
        </h2>
        <span style={{ fontSize: 12.5, color: COR.apagado, flex: 1 }}>
          Resumo da fila — a lista completa vive em /renderizacao.
        </span>
        <Link
          href="/renderizacao"
          style={{
            padding: '8px 14px',
            borderRadius: 999,
            background: COR.gradiente,
            color: COR.papel,
            fontSize: 12.5,
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 8px 20px rgba(37,99,235,.28)',
          }}
        >
          Abrir Central de Renderização
        </Link>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 12,
        }}
      >
        <CartaoKPI rotulo="Na fila" valor={r.na_fila} tom={tomPara(r.na_fila)} />
        <CartaoKPI rotulo="Processando" valor={r.processando} tom="azul" />
        <CartaoKPI
          rotulo="Com erro"
          valor={r.erro}
          tom={r.erro > 0 ? 'coral' : 'neutro'}
          href={r.erro > 0 ? '/renderizacao?estado=erro' : undefined}
        />
        <CartaoKPI
          rotulo="Concluídas 24h"
          valor={r.concluida_24h}
          tom="verde"
        />
      </div>
    </section>
  );
}

function tomPara(n: number): Tom {
  if (n === 0) return 'neutro';
  if (n > 50) return 'ambar';
  return 'azul';
}
