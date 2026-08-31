// Gerado por tools/dc2tsx.py a partir de Financeiro.dc.html
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
.dc14:hover { background: #FFE4E9; }
.dc15:hover { background: #FCE9CE; }
.dc16:hover { background: #E7EEFB; }
.dc17:hover { background: #F8FAFE; }
.dc18:hover { background: #F8FAFE; }
.dc19:hover { background: #F8FAFE; }
.dc20:hover { background: #F8FAFE; }
.dc21:hover { background: #F8FAFE; }
.dc22:hover { background: #F8FAFE; }
`;

export default function FinanceiroDesign({ v }: { v: any }) {
  return (
    <>
      <div style={{ padding: '26px 30px 60px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'riseIn .5s cubic-bezier(.2,.8,.2,1) both' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '1.6px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
              Financeiro · Pagamentos
            </p>
            <h1 style={{ margin: '0 0 8px', fontSize: '30px', fontWeight: '800', letterSpacing: '-1px' }}>
              Financeiro
            </h1>
            <p style={{ margin: '0', fontSize: '14.5px', color: '#6B7A90' }}>
              R$ 184.320 faturados no mês · R$ 12.480 em aberto · 2 estornos
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} className="dc1">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4v11M8 11l4 4 4-4" />
                <path d="M4 19h16" />
              </svg>
              Exportar XLSX
            </button>
            <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} className="dc2">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              Conciliar
            </button>
            <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '0', borderRadius: '14px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(37,99,235,.28)' }} className="dc3">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Link de pagamento
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc4">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                Recebido no mês
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#E6F8F1', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 17.5 9.5 12l3.5 3.2L20 7" />
                  <path d="M15.5 7H20v4.5" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              R$ 171.840
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
                Em aberto
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#FEF3E2', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M12 7.5v5l3 2" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              R$ 12.480
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '11.5px', fontWeight: '700' }}>
                19 pedidos
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 8 12 6 24 11 36 9 48 14 60 12 72 17 80 16" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc6">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                PIX · participação
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#E4F8FC', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2.5" y="5" width="19" height="14" rx="4" />
                  <path d="M2.5 10h19" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              68%
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#E4F8FC', color: '#0891B2', fontSize: '11.5px', fontWeight: '700' }}>
                ticket médio R$ 147
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 18 12 20 24 13 36 15 48 9 60 12 72 5 80 7" stroke="#06B6D4" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc7">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                Estornos
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#FFF1F3', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8v5M12 16.5h.01" />
                  <circle cx="12" cy="12" r="8.5" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              2
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#FFF1F3', color: '#E11D48', fontSize: '11.5px', fontWeight: '700' }}>
                R$ 1.180 no mês
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 20 12 16 24 18 36 12 48 13 60 8 72 6 80 4" stroke="#F43F5E" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc8">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                Saldo em carteiras
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EDEBFE', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3" />
                  <rect x="3" y="8" width="18" height="11" rx="3" />
                  <circle cx="16.5" cy="13.5" r="1.3" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              R$ 9.870
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#EDEBFE', color: '#6366F1', fontSize: '11.5px', fontWeight: '700' }}>
                38 clientes
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 14 12 12 24 16 36 10 48 12 60 7 72 9 80 6" stroke="#6366F1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '4px', padding: '5px', background: '#F4F7FC', border: '1px solid #E6EAF2', borderRadius: '999px', flexWrap: 'wrap' }}>
            <span onClick={v.setP0} style={css(v.per0)} className="dc9">
              Transações
            </span>
            <span onClick={v.setP1} style={css(v.per1)} className="dc10">
              A receber
            </span>
            <span onClick={v.setP2} style={css(v.per2)} className="dc11">
              Carteiras
            </span>
            <span onClick={v.setP3} style={css(v.per3)} className="dc12">
              Faturas SaaS
            </span>
            <span onClick={v.setP4} style={css(v.per4)} className="dc13">
              Conciliação
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
              gateway online
            </span>
            <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#FFF1F3', color: '#E11D48', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
              2 falhas hoje
            </span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', alignItems: 'start' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
              <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                Recebimentos por método
              </h2>
              <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                últimos 30 dias
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '7px' }}>
                  <span style={{ fontWeight: '500' }}>
                    PIX
                  </span>
                  <span style={{ color: '#6B7A90' }}>
                    R$ 116.850
                  </span>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: '#EEF1F7' }}>
                  <div style={{ width: '68%', height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg,#2563EB,#06B6D4)' }}>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '7px' }}>
                  <span style={{ fontWeight: '500' }}>
                    Cartão de crédito
                  </span>
                  <span style={{ color: '#6B7A90' }}>
                    R$ 38.420
                  </span>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: '#EEF1F7' }}>
                  <div style={{ width: '22%', height: '100%', borderRadius: '999px', background: '#6366F1' }}>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '7px' }}>
                  <span style={{ fontWeight: '500' }}>
                    Boleto
                  </span>
                  <span style={{ color: '#6B7A90' }}>
                    R$ 12.100
                  </span>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: '#EEF1F7' }}>
                  <div style={{ width: '7%', height: '100%', borderRadius: '999px', background: '#F59E0B' }}>
                  </div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '7px' }}>
                  <span style={{ fontWeight: '500' }}>
                    Carteira e créditos
                  </span>
                  <span style={{ color: '#6B7A90' }}>
                    R$ 4.470
                  </span>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: '#EEF1F7' }}>
                  <div style={{ width: '3%', height: '100%', borderRadius: '999px', background: '#10B981' }}>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
              <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                Precisa de você
              </h2>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#FFF1F3', color: '#E11D48', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                3 itens
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', borderRadius: '16px', background: '#FFF1F3', cursor: 'pointer' }} className="dc14">
                <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#FFFFFF', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
                    <path d="M12 8v5M12 16.5h.01" />
                    <circle cx="12" cy="12" r="8.5" />
                  </svg>
                </span>
                <div>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                    2 pagamentos para conciliar
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                    PIX pendente há mais de 24 h
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', borderRadius: '16px', background: '#FEF3E2', cursor: 'pointer' }} className="dc15">
                <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#FFFFFF', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2.5" y="5" width="19" height="14" rx="4" />
                    <path d="M2.5 10h19" />
                  </svg>
                </span>
                <div>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                    1 boleto vencido · Foto Trindade
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                    R$ 640 · 3 dias de atraso
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', borderRadius: '16px', background: '#F1F5FD', cursor: 'pointer' }} className="dc16">
                <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#FFFFFF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 6h16M4 12h16M4 18h10" />
                  </svg>
                </span>
                <div>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                    Fatura SaaS de setembro
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                    Plano Pro · R$ 890 · vence 1 set
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '18px 24px', flexWrap: 'wrap' }}>
            <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
              Transações recentes
            </h2>
            <a href="#" style={{ fontSize: '13px', fontWeight: '700' }}>
              Ver todas
            </a>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px,.9fr) minmax(200px,1.5fr) minmax(120px,1fr) minmax(110px,.8fr) minmax(110px,.8fr) minmax(120px,.9fr)', gap: '14px', padding: '10px 24px', background: '#F8FAFE', borderTop: '1px solid #EEF1F7', borderBottom: '1px solid #EEF1F7', fontSize: '11.5px', letterSpacing: '.6px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
              <span>
                Transação
              </span>
              <span>
                Cliente
              </span>
              <span>
                Método
              </span>
              <span>
                Valor
              </span>
              <span>
                Data
              </span>
              <span>
                Status
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px,.9fr) minmax(200px,1.5fr) minmax(120px,1fr) minmax(110px,.8fr) minmax(110px,.8fr) minmax(120px,.9fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc17">
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#46536A' }}>
                #TX-88412
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {v.linha1.nome}
              </span>
              <span style={{ fontSize: '13.5px', color: '#6B7A90' }}>
                PIX
              </span>
              <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                R$ 1.240
              </span>
              <span style={{ fontSize: '12.5px', color: '#6B7A90' }}>
                24 ago
              </span>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                Conciliado
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px,.9fr) minmax(200px,1.5fr) minmax(120px,1fr) minmax(110px,.8fr) minmax(110px,.8fr) minmax(120px,.9fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc18">
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#46536A' }}>
                #TX-88411
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {v.linha2.nome}
              </span>
              <span style={{ fontSize: '13.5px', color: '#6B7A90' }}>
                Cartão 3x
              </span>
              <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                R$ 3.980
              </span>
              <span style={{ fontSize: '12.5px', color: '#6B7A90' }}>
                24 ago
              </span>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                Aprovado
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px,.9fr) minmax(200px,1.5fr) minmax(120px,1fr) minmax(110px,.8fr) minmax(110px,.8fr) minmax(120px,.9fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc19">
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#46536A' }}>
                #TX-88409
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {v.linha0.nome}
              </span>
              <span style={{ fontSize: '13.5px', color: '#6B7A90' }}>
                PIX
              </span>
              <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                R$ 289
              </span>
              <span style={{ fontSize: '12.5px', color: '#6B7A90' }}>
                Hoje
              </span>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                Aguardando
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px,.9fr) minmax(200px,1.5fr) minmax(120px,1fr) minmax(110px,.8fr) minmax(110px,.8fr) minmax(120px,.9fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc20">
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#46536A' }}>
                #TX-88407
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {v.linha5.nome}
              </span>
              <span style={{ fontSize: '13.5px', color: '#6B7A90' }}>
                Boleto
              </span>
              <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                R$ 640
              </span>
              <span style={{ fontSize: '12.5px', color: '#6B7A90' }}>
                20 ago
              </span>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#FFF1F3', color: '#E11D48', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                Vencido
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px,.9fr) minmax(200px,1.5fr) minmax(120px,1fr) minmax(110px,.8fr) minmax(110px,.8fr) minmax(120px,.9fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc21">
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#46536A' }}>
                #TX-88402
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {v.linha3.nome}
              </span>
              <span style={{ fontSize: '13.5px', color: '#6B7A90' }}>
                Carteira
              </span>
              <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                R$ 2.410
              </span>
              <span style={{ fontSize: '12.5px', color: '#6B7A90' }}>
                19 ago
              </span>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                Conciliado
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px,.9fr) minmax(200px,1.5fr) minmax(120px,1fr) minmax(110px,.8fr) minmax(110px,.8fr) minmax(120px,.9fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc22">
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#46536A' }}>
                #TX-88398
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {v.linha4.nome}
              </span>
              <span style={{ fontSize: '13.5px', color: '#6B7A90' }}>
                Cartão 1x
              </span>
              <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                R$ 79
              </span>
              <span style={{ fontSize: '12.5px', color: '#6B7A90' }}>
                18 ago
              </span>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#F1F5FD', color: '#46536A', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                Estornado
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
