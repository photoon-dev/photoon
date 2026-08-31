// Gerado por tools/dc2tsx.py a partir de Relatorios.dc.html
// Transliteração fiel do design: não editar à mão, editar o .dc.html.
'use client';

import { css } from '@/lib/css';

export const CSS_PSEUDO = `
.dc1:hover { background: #F1F5FD; border-color: #D6E2FC; color: #2563EB; }
.dc2:hover { background: #F1F5FD; border-color: #D6E2FC; color: #2563EB; }
.dc3:hover { filter: brightness(1.06); }
.dc4:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc5:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc6:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc7:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc8:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc9:hover { background: #FFFFFF; color: #2563EB; }
.dc10:hover { background: #FFFFFF; color: #2563EB; }
.dc11:hover { background: #FFFFFF; color: #2563EB; }
.dc12:hover { background: #FFFFFF; color: #2563EB; }
.dc13:hover { background: #FFFFFF; color: #2563EB; }
.dc14:hover { background: #F1F5FD; border-color: #D6E2FC; }
.dc15:hover { background: #F1F5FD; border-color: #D6E2FC; }
.dc16:hover { background: #F1F5FD; border-color: #D6E2FC; }
.dc17:hover { background: #F1F5FD; border-color: #D6E2FC; }
.dc18:hover { background: #F8FAFE; }
.dc19:hover { background: #F8FAFE; }
.dc20:hover { background: #F8FAFE; }
.dc21:hover { background: #F8FAFE; }
.dc22:hover { background: #F8FAFE; }
`;

export default function RelatoriosDesign({ v }: { v: any }) {
  return (
    <>
      <div style={{ padding: '26px 30px 60px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'riseIn .5s cubic-bezier(.2,.8,.2,1) both' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '1.6px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
              Sistema · Relatórios
            </p>
            <h1 style={{ margin: '0 0 8px', fontSize: '30px', fontWeight: '800', letterSpacing: '-1px' }}>
              Relatórios
            </h1>
            <p style={{ margin: '0', fontSize: '14.5px', color: '#6B7A90' }}>
              Agosto de 2026 · R$ 184.320 faturados · 1 248 pedidos · 3 480 fotos entregues
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} className="dc1">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 7.5v5l3 2" />
              </svg>
              Período
            </button>
            <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} className="dc2">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4v11M8 11l4 4 4-4" />
                <path d="M4 19h16" />
              </svg>
              Exportar PDF
            </button>
            <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '0', borderRadius: '14px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(37,99,235,.28)' }} className="dc3">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Novo painel
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc4">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                Faturamento
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#E6F8F1', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 17.5 9.5 12l3.5 3.2L20 7" />
                  <path d="M15.5 7H20v4.5" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              R$ 184.320
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '11.5px', fontWeight: '700' }}>
                +12,4% vs julho
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 21 12 17 24 19 36 11 48 14 60 6 72 3 80 5" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc5">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                Pedidos
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EAF0FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 8h16l-1.2 11.2a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8z" />
                  <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              1 248
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#EAF0FF', color: '#2563EB', fontSize: '11.5px', fontWeight: '700' }}>
                +9,1%
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 18 12 20 24 13 36 15 48 9 60 12 72 5 80 7" stroke="#2563EB" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc6">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                Ticket médio
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#E4F8FC', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 11.5V5h6.5L20 14.5 13.5 21z" />
                  <circle cx="8" cy="8.5" r="1.4" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              R$ 147
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#E4F8FC', color: '#0891B2', fontSize: '11.5px', fontWeight: '700' }}>
                +R$ 12
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 8 12 6 24 11 36 9 48 14 60 12 72 17 80 16" stroke="#06B6D4" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc7">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                SLA de produção
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EDEBFE', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M12 7.5v5l3 2" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              96%
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#EDEBFE', color: '#6366F1', fontSize: '11.5px', fontWeight: '700' }}>
                meta 95%
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 20 12 16 24 18 36 12 48 13 60 8 72 6 80 4" stroke="#6366F1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc8">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                NPS
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#FEF3E2', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 4 2.4 5 5.6.7-4 3.9 1 5.4-5-2.7-5 2.7 1-5.4-4-3.9 5.6-.7z" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              72
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '11.5px', fontWeight: '700' }}>
                +5 pontos
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 14 12 12 24 16 36 10 48 12 60 7 72 9 80 6" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '4px', padding: '5px', background: '#F4F7FC', border: '1px solid #E6EAF2', borderRadius: '999px', flexWrap: 'wrap' }}>
            <span onClick={v.setP0} style={css(v.per0)} className="dc9">
              Visão geral
            </span>
            <span onClick={v.setP1} style={css(v.per1)} className="dc10">
              Vendas
            </span>
            <span onClick={v.setP2} style={css(v.per2)} className="dc11">
              Produção
            </span>
            <span onClick={v.setP3} style={css(v.per3)} className="dc12">
              Clientes
            </span>
            <span onClick={v.setP4} style={css(v.per4)} className="dc13">
              Exportações
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#F1F5FD', color: '#46536A', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
              dados até hoje 09h
            </span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', alignItems: 'start' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
              <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                Faturamento por canal
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '7px' }}>
                  <span style={{ fontWeight: '500' }}>
                    Loja B2B
                  </span>
                  <span style={{ color: '#6B7A90' }}>
                    R$ 96.400
                  </span>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: '#EEF1F7' }}>
                  <div style={{ width: '52%', height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg,#2563EB,#06B6D4)' }}>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '7px' }}>
                  <span style={{ fontWeight: '500' }}>
                    Loja B2C
                  </span>
                  <span style={{ color: '#6B7A90' }}>
                    R$ 52.100
                  </span>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: '#EEF1F7' }}>
                  <div style={{ width: '28%', height: '100%', borderRadius: '999px', background: '#06B6D4' }}>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '7px' }}>
                  <span style={{ fontWeight: '500' }}>
                    Eventos
                  </span>
                  <span style={{ color: '#6B7A90' }}>
                    R$ 24.900
                  </span>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: '#EEF1F7' }}>
                  <div style={{ width: '14%', height: '100%', borderRadius: '999px', background: '#6366F1' }}>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '7px' }}>
                  <span style={{ fontWeight: '500' }}>
                    Balcão
                  </span>
                  <span style={{ color: '#6B7A90' }}>
                    R$ 10.920
                  </span>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: '#EEF1F7' }}>
                  <div style={{ width: '6%', height: '100%', borderRadius: '999px', background: '#10B981' }}>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
              <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                Produtos que mais faturam
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '7px' }}>
                  <span style={{ fontWeight: '500' }}>
                    Fotolivros
                  </span>
                  <span style={{ color: '#6B7A90' }}>
                    R$ 78.200
                  </span>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: '#EEF1F7' }}>
                  <div style={{ width: '42%', height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg,#2563EB,#06B6D4)' }}>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '7px' }}>
                  <span style={{ fontWeight: '500' }}>
                    Revelação
                  </span>
                  <span style={{ color: '#6B7A90' }}>
                    R$ 51.600
                  </span>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: '#EEF1F7' }}>
                  <div style={{ width: '28%', height: '100%', borderRadius: '999px', background: '#06B6D4' }}>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '7px' }}>
                  <span style={{ fontWeight: '500' }}>
                    Quadros e canvas
                  </span>
                  <span style={{ color: '#6B7A90' }}>
                    R$ 32.400
                  </span>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: '#EEF1F7' }}>
                  <div style={{ width: '18%', height: '100%', borderRadius: '999px', background: '#6366F1' }}>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '7px' }}>
                  <span style={{ fontWeight: '500' }}>
                    Brindes
                  </span>
                  <span style={{ color: '#6B7A90' }}>
                    R$ 22.120
                  </span>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: '#EEF1F7' }}>
                  <div style={{ width: '12%', height: '100%', borderRadius: '999px', background: '#F59E0B' }}>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
              <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                Indicadores de operação
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc14">
                <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#E6F8F1', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="8.5" />
                    <path d="M12 7.5v5l3 2" />
                  </svg>
                </span>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                    Prazo médio de produção
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    2,8 dias · meta 3 dias
                  </p>
                </div>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                  no alvo
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc15">
                <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#EAF0FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 9V4h10v5" />
                    <rect x="4" y="9" width="16" height="7" rx="2.5" />
                    <path d="M7 14h10v6H7z" />
                  </svg>
                </span>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                    Taxa de reimpressão
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    1,4% dos pedidos
                  </p>
                </div>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                  no alvo
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc16">
                <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#E4F8FC', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7h11v10H3z" />
                    <path d="M14 10h4l3 3v4h-7z" />
                    <circle cx="7" cy="18.5" r="1.6" />
                    <circle cx="17" cy="18.5" r="1.6" />
                  </svg>
                </span>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                    Entrega no prazo
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    98,7% dos volumes
                  </p>
                </div>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                  no alvo
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc17">
                <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#FEF3E2', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8v5M12 16.5h.01" />
                    <circle cx="12" cy="12" r="8.5" />
                  </svg>
                </span>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                    Cancelamentos
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    0,9% · 11 pedidos
                  </p>
                </div>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                  atenção
                </span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '18px 24px', flexWrap: 'wrap' }}>
            <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
              Relatórios salvos
            </h2>
            <a href="#" style={{ fontSize: '13px', fontWeight: '700' }}>
              Agendar envio
            </a>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px,1.5fr) minmax(150px,1.1fr) minmax(130px,.9fr) minmax(110px,.7fr) minmax(130px,.9fr) minmax(120px,.8fr)', gap: '14px', padding: '10px 24px', background: '#F8FAFE', borderTop: '1px solid #EEF1F7', borderBottom: '1px solid #EEF1F7', fontSize: '11.5px', letterSpacing: '.6px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
              <span>
                Relatório
              </span>
              <span>
                Escopo
              </span>
              <span>
                Período
              </span>
              <span>
                Formato
              </span>
              <span>
                Envio
              </span>
              <span>
                Status
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px,1.5fr) minmax(150px,1.1fr) minmax(130px,.9fr) minmax(110px,.7fr) minmax(130px,.9fr) minmax(120px,.8fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc18">
              <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                Fechamento mensal
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Financeiro
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Mensal
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                PDF + XLSX
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                1º dia · 08h
              </span>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                Agendado
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px,1.5fr) minmax(150px,1.1fr) minmax(130px,.9fr) minmax(110px,.7fr) minmax(130px,.9fr) minmax(120px,.8fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc19">
              <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                Produtividade da produção
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Produção
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Semanal
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                XLSX
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Seg · 07h
              </span>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                Agendado
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px,1.5fr) minmax(150px,1.1fr) minmax(130px,.9fr) minmax(110px,.7fr) minmax(130px,.9fr) minmax(120px,.8fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc20">
              <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                Ranking de vendedores
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Comercial
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Mensal
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                PDF
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                1º dia · 09h
              </span>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                Agendado
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px,1.5fr) minmax(150px,1.1fr) minmax(130px,.9fr) minmax(110px,.7fr) minmax(130px,.9fr) minmax(120px,.8fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc21">
              <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                Curva ABC de produtos
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Catálogo
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Trimestral
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                XLSX
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                manual
              </span>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#F1F5FD', color: '#46536A', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                Sob demanda
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px,1.5fr) minmax(150px,1.1fr) minmax(130px,.9fr) minmax(110px,.7fr) minmax(130px,.9fr) minmax(120px,.8fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc22">
              <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                Base de clientes
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                CRM
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Livre
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                CSV
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                manual
              </span>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#F1F5FD', color: '#46536A', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                Sob demanda
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
