// Gerado por tools/dc2tsx.py a partir de Pedidos.dc.html
// Transliteração fiel do design: não editar à mão, editar o .dc.html.
'use client';

import { css } from '@/lib/css';

export const CSS_PSEUDO = `
.dc1:hover { background: #F1F5FD; border-color: #D6E2FC; color: #2563EB; }
.dc2:hover { filter: brightness(1.06); }
.dc3:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc4:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc5:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc6:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc7:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc8:hover { background: #FFFFFF; color: #2563EB; }
.dc9:hover { background: #FFFFFF; color: #2563EB; }
.dc10:hover { background: #FFFFFF; color: #2563EB; }
.dc11:hover { background: #F1F5FD; border-color: #D6E2FC; color: #2563EB; }
.dc12:hover { background: #F8FAFE; }
.dc13:hover { color: #2563EB; }
`;

export default function PedidosDesign({ v }: { v: any }) {
  return (
    <>
      <div style={{ padding: '26px 30px 60px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'riseIn .5s cubic-bezier(.2,.8,.2,1) both' }}>
        <div style={{ padding: '26px 30px 60px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'riseIn .5s cubic-bezier(.2,.8,.2,1) both' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '1.6px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
                Operação · Pedidos
              </p>
              <h1 style={{ margin: '0 0 8px', fontSize: '30px', fontWeight: '800', letterSpacing: '-1px' }}>
                Pedidos
              </h1>
              <p style={{ margin: '0', fontSize: '14.5px', color: '#6B7A90' }}>
                {v.resumo}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} className="dc1">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4v11M8 11l4 4 4-4" />
                  <path d="M4 19h16" />
                </svg>
                Exportar CSV
              </button>
              <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '0', borderRadius: '14px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(37,99,235,.28)' }} className="dc2">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Novo pedido
              </button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc3">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                  {v.kpi1.rotulo}
                </span>
                <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EAF0FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 8h16l-1.2 11.2a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8z" />
                    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
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
                <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                  <path d="M0 21 12 17 24 19 36 11 48 14 60 6 72 3 80 5" stroke="#2563EB" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc4">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                  {v.kpi2.rotulo}
                </span>
                <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#E4F8FC', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 9V4h10v5" />
                    <rect x="4" y="9" width="16" height="7" rx="2.5" />
                    <path d="M7 14h10v6H7z" />
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
                <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                  <path d="M0 18 12 20 24 13 36 15 48 9 60 12 72 5 80 7" stroke="#06B6D4" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc5">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                  {v.kpi3.rotulo}
                </span>
                <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#FEF3E2', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '11.5px', fontWeight: '700' }}>
                  {v.kpi3.nota}
                </span>
                <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                  <path d="M0 8 12 6 24 11 36 9 48 14 60 12 72 17 80 16" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc6">
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
                <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#FFF1F3', color: '#E11D48', fontSize: '11.5px', fontWeight: '700' }}>
                  {v.kpi4.nota}
                </span>
                <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                  <path d="M0 20 12 16 24 18 36 12 48 13 60 8 72 6 80 4" stroke="#F43F5E" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc7">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                  {v.kpi5.rotulo}
                </span>
                <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#E6F8F1', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '11.5px', fontWeight: '700' }}>
                  {v.kpi5.nota}
                </span>
                <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                  <path d="M0 14 12 12 24 16 36 10 48 12 60 7 72 9 80 6" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '18px 24px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '4px', padding: '5px', background: '#F4F7FC', border: '1px solid #E6EAF2', borderRadius: '999px', flexWrap: 'wrap' }}>
                <span onClick={v.setP0} style={css(v.per0)} className="dc8">
                  Todos
                </span>
                <span onClick={v.setP1} style={css(v.per1)} className="dc9">
                  Em produção
                </span>
                <span onClick={v.setP2} style={css(v.per2)} className="dc10">
                  Atrasados
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', height: '42px', padding: '0 14px', border: '1px solid #E6EAF2', borderRadius: '14px' }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#9AA7BC" strokeWidth="1.9" strokeLinecap="round">
                    <circle cx="11" cy="11" r="6.5" />
                    <path d="m16 16 4.5 4.5" />
                  </svg>
                  <input placeholder="Filtrar nesta lista" style={{ border: '0', background: 'transparent', fontFamily: 'inherit', fontSize: '13.5px', width: '180px', color: '#0B1220' }} />
                </div>
                <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} className="dc11">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 6h16M7 12h10M10 18h4" />
                  </svg>
                  Filtros
                </button>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '34px minmax(220px,1.6fr) minmax(150px,1.1fr) minmax(90px,.8fr) minmax(90px,.8fr) minmax(120px,1fr) minmax(120px,1fr) minmax(70px,.7fr)', gap: '14px', padding: '10px 24px', background: '#F8FAFE', borderTop: '1px solid #EEF1F7', borderBottom: '1px solid #EEF1F7', fontSize: '11.5px', letterSpacing: '.6px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
                <span>
                </span>
                <span>
                  Cliente
                </span>
                <span>
                  Produto
                </span>
                <span>
                  Canal
                </span>
                <span>
                  Valor
                </span>
                <span>
                  Pagamento
                </span>
                <span>
                  Estado
                </span>
                <span>
                  Prazo
                </span>
              </div>
              {v.pedidos.map((pd: any, i5: number) => (
                <div key={i5} onClick={pd.abrir} style={{ display: 'grid', gridTemplateColumns: '34px minmax(220px,1.6fr) minmax(150px,1.1fr) minmax(90px,.8fr) minmax(90px,.8fr) minmax(120px,1fr) minmax(120px,1fr) minmax(70px,.7fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc12">
                  <span style={{ width: '18px', height: '18px', borderRadius: '6px', border: '1.5px solid #CBD5E6' }}>
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '0' }}>
                    <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EAF0FF', color: '#2563EB', fontSize: '12.5px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                      {pd.iniciais}
                    </span>
                    <div style={{ minWidth: '0' }}>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {pd.cliente}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px' }}>
                        <a href={pd.href} style={{ color: '#9AA7BC' }} className="dc13">
                          {pd.numero}
                        </a>
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: '13.5px', color: '#34405A' }}>
                    {pd.produto}
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                    {pd.canal}
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                    {pd.valor}
                  </span>
                  <span style={css(pd.seloPag)}>
                    {pd.pagamento}
                  </span>
                  <span style={css(pd.seloEstado)}>
                    {pd.estado}
                  </span>
                  <span style={{ fontSize: '12.5px', color: '#6B7A90' }}>
                    {pd.prazo}
                  </span>
                </div>
              ))}
              <div style={css(v.vazio)}>
                Nenhum pedido com estes filtros.
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '16px 24px', background: '#F8FAFE' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                Mostrando 7 de 1 248 pedidos
              </span>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <span style={{ width: '36px', height: '36px', borderRadius: '12px', border: '1px solid #E6EAF2', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9AA7BC', cursor: 'pointer' }}>
                  ‹
                </span>
                <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#2563EB', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13.5px', fontWeight: '700' }}>
                  1
                </span>
                <span style={{ width: '36px', height: '36px', borderRadius: '12px', border: '1px solid #E6EAF2', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13.5px', color: '#46536A', cursor: 'pointer' }}>
                  2
                </span>
                <span style={{ width: '36px', height: '36px', borderRadius: '12px', border: '1px solid #E6EAF2', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13.5px', color: '#46536A', cursor: 'pointer' }}>
                  3
                </span>
                <span style={{ width: '36px', height: '36px', borderRadius: '12px', border: '1px solid #E6EAF2', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#46536A', cursor: 'pointer' }}>
                  ›
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
