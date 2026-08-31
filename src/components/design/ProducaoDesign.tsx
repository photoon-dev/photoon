// Gerado por tools/dc2tsx.py a partir de Producao.dc.html
// Transliteração fiel do design: não editar à mão, editar o .dc.html.
'use client';

import { css } from '@/lib/css';

export const CSS_PSEUDO = `
.dc1:hover { background: #F1F5FD; border-color: #D6E2FC; color: #2563EB; }
.dc2:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc3:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc4:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc5:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc6:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc7:hover { background: #FFFFFF; color: #2563EB; }
.dc8:hover { background: #FFFFFF; color: #2563EB; }
.dc9:hover { background: #FFFFFF; color: #2563EB; }
.dc10:hover { box-shadow: 0 10px 22px rgba(11,18,32,.09); transform: translateY(-2px); border-color: #D6E2FC; }
.dc11:hover { background: #F1F5FD; color: #2563EB; border-color: #D6E2FC; }
.dc12:hover { background: #F1F5FD; color: #2563EB; border-color: #D6E2FC; }
.dc13:hover { border-color: #D6E2FC; }
`;

export default function ProducaoDesign({ v }: { v: any }) {
  return (
    <>
      <div style={{ padding: '26px 30px 60px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'riseIn .5s cubic-bezier(.2,.8,.2,1) both' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '1.6px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
              Operação · Produção
            </p>
            <h1 style={{ margin: '0 0 8px', fontSize: '30px', fontWeight: '800', letterSpacing: '-1px' }}>
              Produção
            </h1>
            <p style={{ margin: '0', fontSize: '14.5px', color: '#6B7A90' }}>
              {v.resumo}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a href="/pedidos" style={{ textDecoration: 'none', whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} className="dc1">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 8h16l-1.2 11.2a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8z" />
                <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
              </svg>
              Ver pedidos
            </a>
            <button onClick={v.enfileirarTodos} style={css(v.btnFila)}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              {v.rotuloFila}
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc2">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                {v.kpi1.rotulo}
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EAF0FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3.5 8 4.2-8 4.2-8-4.2z" />
                  <path d="m4 12.5 8 4.2 8-4.2" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              {v.kpi1.valor}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#EAF0FF', color: '#2563EB', fontSize: '11.5px', fontWeight: '700' }}>
                {v.kpi1.nota}
              </span>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                {v.kpi2.rotulo}
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#E4F8FC', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="6" width="12" height="12" rx="3" />
                  <path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              {v.kpi2.valor}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#E4F8FC', color: '#0891B2', fontSize: '11.5px', fontWeight: '700' }}>
                {v.kpi2.nota}
              </span>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc4">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                {v.kpi3.rotulo}
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#E6F8F1', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M12 7.5v5l3 2" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              {v.kpi3.valor}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '11.5px', fontWeight: '700' }}>
                {v.kpi3.nota}
              </span>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc5">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                {v.kpi4.rotulo}
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#FFF1F3', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8v5M12 16.5h.01" />
                  <circle cx="12" cy="12" r="8.5" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              {v.kpi4.valor}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={css(v.kpi4.selo)}>
                {v.kpi4.nota}
              </span>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc6">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                {v.kpi5.rotulo}
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EDEBFE', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 7h11v10H3z" />
                  <path d="M14 10h4l3 3v4h-7z" />
                  <circle cx="7" cy="18.5" r="1.6" />
                  <circle cx="17" cy="18.5" r="1.6" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              {v.kpi5.valor}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#EDEBFE', color: '#6366F1', fontSize: '11.5px', fontWeight: '700' }}>
                {v.kpi5.nota}
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '4px', padding: '5px', background: '#F4F7FC', border: '1px solid #E6EAF2', borderRadius: '999px', flexWrap: 'wrap' }}>
            <span onClick={v.setP0} style={css(v.per0)} className="dc7">
              {v.rot0}
            </span>
            <span onClick={v.setP1} style={css(v.per1)} className="dc8">
              {v.rot1}
            </span>
            <span onClick={v.setP2} style={css(v.per2)} className="dc9">
              {v.rot2}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '9px 14px', borderRadius: '999px', background: '#FFFFFF', border: '1px solid #E6EAF2', fontSize: '12.5px', fontWeight: '600', color: '#46536A' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: '#10B981' }}>
              </span>
              {v.chipEquipe}
            </span>
            <span style={css(v.chipAtrasoEstilo)}>
              {v.chipAtraso}
            </span>
          </div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
            <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
              Fluxo de produção
            </h2>
            <span style={{ fontSize: '13px', color: '#6B7A90' }}>
              arraste um card para mudar de etapa
            </span>
          </div>
          <div style={{ overflowX: 'auto', paddingBottom: '6px' }}>
            <div style={{ display: 'flex', gap: '14px', minWidth: '1320px' }}>
              {v.colunas.map((col: any, i5: number) => (
                <div key={i5} onDragOver={col.sobre} onDrop={col.soltar} style={css(col.estilo)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '9px', padding: '0 2px 4px' }}>
                    <span style={css(col.ponto)}>
                    </span>
                    <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                      {col.nome}
                    </span>
                    <span style={css(col.selo)}>
                      {col.quantidade}
                    </span>
                  </div>
                  <div style={css(col.lista)}>
                    {col.cards.map((c: any, i8: number) => (
                      <div key={i8} draggable="true" onDragStart={c.arrastar} onDragEnd={c.soltarCard} onClick={c.abrir} style={css(c.estilo)} className="dc10">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                          <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#9AA7BC', letterSpacing: '.4px' }}>
                            {c.numero}
                          </span>
                          <span style={css(c.seloPrazo)}>
                            {c.prazo}
                          </span>
                        </div>
                        <p style={{ margin: '0', fontSize: '14px', fontWeight: '700', lineHeight: '1.3', textWrap: 'pretty' }}>
                          {c.cliente}
                        </p>
                        <p style={{ margin: '0', fontSize: '12px', color: '#6B7A90', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {c.detalhe}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ flex: '1', height: '6px', borderRadius: '999px', background: '#EEF1F7' }}>
                            <div style={css(c.barra)}>
                            </div>
                          </div>
                          <span style={{ flex: '0 0 auto', fontSize: '11.5px', fontWeight: '600', color: '#6B7A90' }}>
                            {c.pct}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingTop: '2px', borderTop: '1px solid #F4F6FB' }}>
                          <span style={{ width: '24px', height: '24px', borderRadius: '8px', background: '#F1F5FD', color: '#46536A', fontSize: '10.5px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '9px' }}>
                            {c.iniciais}
                          </span>
                          <span style={{ fontSize: '11.5px', color: '#9AA7BC', marginTop: '9px' }}>
                            {c.responsavel}
                          </span>
                          <button onClick={c.avancar} style={css(c.btnAvancar)} className="dc11">
                            {c.rotuloAvancar}
                          </button>
                        </div>
                      </div>
                    ))}
                    <p style={css(col.vazio)}>
                      {col.textoVazio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', alignItems: 'start' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
              <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                Aguardando entrar na fila
              </h2>
              <a href="/pedidos?estado=pago" style={{ fontSize: '13px', fontWeight: '700' }}>
                Ver pedidos pagos
              </a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {v.pendentes.map((p: any, i5: number) => (
                <div key={i5} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7' }}>
                  <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#EAF0FF', color: '#2563EB', fontSize: '11.5px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                    {p.iniciais}
                  </span>
                  <div style={{ flex: '1', minWidth: '0' }}>
                    <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                      {p.cliente}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                      {p.detalhe}
                    </p>
                  </div>
                  <button onClick={p.enfileirar} style={{ whiteSpace: 'nowrap', height: '36px', padding: '0 14px', border: '1px solid #E6EAF2', borderRadius: '12px', background: '#FFFFFF', color: '#46536A', fontFamily: 'inherit', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer' }} className="dc12">
                    Colocar na fila
                  </button>
                </div>
              ))}
              <p style={css(v.pendentesVazio)}>
                Nenhum pedido pago esperando ficha de produção.
              </p>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
              <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                Responsáveis
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {v.responsaveis.map((r: any, i5: number) => (
                <div key={i5} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7' }}>
                  <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#EAF0FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto', fontSize: '11.5px', fontWeight: '700' }}>
                    {r.iniciais}
                  </span>
                  <div style={{ flex: '1', minWidth: '0' }}>
                    <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                      {r.nome}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                      {r.detalhe}
                    </p>
                  </div>
                  <span style={css(r.selo)}>
                    {r.quantidade}
                  </span>
                </div>
              ))}
              <p style={css(v.responsaveisVazio)}>
                Nenhuma ficha tem responsável. O nome entra ao mover a etapa.
              </p>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
              <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                Em revisão
              </h2>
              <span style={css(v.revisaoSelo)}>
                {v.revisaoResumo}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {v.revisao.map((rv: any, i5: number) => (
                <div key={i5} onClick={rv.abrir} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc13">
                  <span style={{ width: '20px', height: '20px', borderRadius: '7px', border: '1.5px solid #CBD5E6', flex: '0 0 auto' }}>
                  </span>
                  <div style={{ flex: '1', minWidth: '0' }}>
                    <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                      {rv.titulo}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                      {rv.detalhe}
                    </p>
                  </div>
                </div>
              ))}
              <p style={css(v.revisaoVazio)}>
                Nada em revisão agora.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
