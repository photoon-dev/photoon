// Gerado por tools/dc2tsx.py a partir de Integracoes.dc.html
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
.dc18:hover { background: #F1F5FD; border-color: #D6E2FC; }
.dc19:hover { background: #F1F5FD; border-color: #D6E2FC; }
.dc20:hover { background: #F1F5FD; border-color: #D6E2FC; }
.dc21:hover { background: #F1F5FD; border-color: #D6E2FC; }
.dc22:hover { background: #F1F5FD; border-color: #D6E2FC; }
.dc23:hover { background: #F1F5FD; border-color: #D6E2FC; }
.dc24:hover { background: #F8FAFE; }
.dc25:hover { background: #F8FAFE; }
.dc26:hover { background: #F8FAFE; }
.dc27:hover { background: #F8FAFE; }
`;

export default function IntegracoesDesign({ v }: { v: any }) {
  return (
    <>
      <div style={{ padding: '26px 30px 60px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'riseIn .5s cubic-bezier(.2,.8,.2,1) both' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '1.6px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
              Sistema · Integrações
            </p>
            <h1 style={{ margin: '0 0 8px', fontSize: '30px', fontWeight: '800', letterSpacing: '-1px' }}>
              Integrações
            </h1>
            <p style={{ margin: '0', fontSize: '14.5px', color: '#6B7A90' }}>
              9 integrações conectadas · 2 chaves de API ativas · 1 webhook com falha
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} className="dc1">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 3v5h5" />
                <path d="M6 3h8l5 5v13H6z" />
              </svg>
              Documentação
            </button>
            <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} className="dc2">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="15" r="3.5" />
                <path d="m10.5 12.5 7-7M15 5.5 19 9.5M13 7.5 16.5 11" />
              </svg>
              Chaves de API
            </button>
            <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '0', borderRadius: '14px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(37,99,235,.28)' }} className="dc3">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Conectar serviço
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc4">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                Conectadas
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#E6F8F1', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 3v6M15 3v6" />
                  <path d="M6 9h12v3a6 6 0 0 1-12 0z" />
                  <path d="M12 18v3" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              9
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '11.5px', fontWeight: '700' }}>
                2 novas no mês
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 21 12 17 24 19 36 11 48 14 60 6 72 3 80 5" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc5">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                Chamadas de API
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EAF0FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 11a8 8 0 1 0-2.3 5.7" />
                  <path d="M20 5v6h-6" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              1,2 M
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#EAF0FF', color: '#2563EB', fontSize: '11.5px', fontWeight: '700' }}>
                no mês
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 18 12 20 24 13 36 15 48 9 60 12 72 5 80 7" stroke="#2563EB" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc6">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                Webhooks
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#FEF3E2', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 3 4.5 13.5H11l-1 7.5 8.5-10.5H12z" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              6
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '11.5px', fontWeight: '700' }}>
                1 com falha
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 8 12 6 24 11 36 9 48 14 60 12 72 17 80 16" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc7">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                Chaves ativas
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EDEBFE', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="15" r="3.5" />
                  <path d="m10.5 12.5 7-7M15 5.5 19 9.5M13 7.5 16.5 11" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              2
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#EDEBFE', color: '#6366F1', fontSize: '11.5px', fontWeight: '700' }}>
                1 expira em 12 d
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 20 12 16 24 18 36 12 48 13 60 8 72 6 80 4" stroke="#6366F1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc8">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                Falhas 24 h
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#FFF1F3', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8v5M12 16.5h.01" />
                  <circle cx="12" cy="12" r="8.5" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              14
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#FFF1F3', color: '#E11D48', fontSize: '11.5px', fontWeight: '700' }}>
                todas no Correios
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 14 12 12 24 16 36 10 48 12 60 7 72 9 80 6" stroke="#F43F5E" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '4px', padding: '5px', background: '#F4F7FC', border: '1px solid #E6EAF2', borderRadius: '999px', flexWrap: 'wrap' }}>
            <span onClick={v.setP0} style={css(v.per0)} className="dc9">
              Serviços
            </span>
            <span onClick={v.setP1} style={css(v.per1)} className="dc10">
              Chaves de API
            </span>
            <span onClick={v.setP2} style={css(v.per2)} className="dc11">
              Webhooks
            </span>
            <span onClick={v.setP3} style={css(v.per3)} className="dc12">
              Logs
            </span>
            <span onClick={v.setP4} style={css(v.per4)} className="dc13">
              Sandbox
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
              ambiente produção
            </span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', alignItems: 'start' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
              <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                Serviços conectados
              </h2>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                9 ativos
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc14">
                <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#E6F8F1', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2.5" y="5" width="19" height="14" rx="4" />
                    <path d="M2.5 10h19" />
                  </svg>
                </span>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                    Gateway de pagamento
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    PIX, cartão e boleto · v3
                  </p>
                </div>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                  conectado
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc15">
                <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#FEF3E2', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7h11v10H3z" />
                    <path d="M14 10h4l3 3v4h-7z" />
                    <circle cx="7" cy="18.5" r="1.6" />
                    <circle cx="17" cy="18.5" r="1.6" />
                  </svg>
                </span>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                    Correios
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    cálculo de frete e rastreio
                  </p>
                </div>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                  instável
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
                    Loggi
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    coleta e etiquetas
                  </p>
                </div>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                  conectado
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc17">
                <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#EAF0FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 5h16v10H9l-5 4z" />
                  </svg>
                </span>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                    WhatsApp Business
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    avisos e cobranças
                  </p>
                </div>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                  conectado
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc18">
                <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#EDEBFE', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 3v5h5" />
                    <path d="M6 3h8l5 5v13H6z" />
                  </svg>
                </span>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                    NF-e · emissor fiscal
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    homologado SEFAZ
                  </p>
                </div>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                  conectado
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc19">
                <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#F1F5FD', color: '#46536A', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="16" rx="4" />
                    <path d="m3.5 16 4.6-4.2 4 3.4 3.4-3 5 4.4" />
                    <circle cx="8.6" cy="8.8" r="1.5" />
                  </svg>
                </span>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                    Google Drive
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    importação de fotos do cliente
                  </p>
                </div>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                  conectado
                </span>
              </div>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
              <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                Webhooks
              </h2>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#FFF1F3', color: '#E11D48', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                1 falha
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc20">
                <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#E6F8F1', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5 10 17.5 19 7" />
                  </svg>
                </span>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                    pedido.criado
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    https://api.lume.studio/hooks · 200
                  </p>
                </div>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                  ok
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc21">
                <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#E6F8F1', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5 10 17.5 19 7" />
                  </svg>
                </span>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                    pedido.pronto
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    https://crm.memoria.com/hook · 200
                  </p>
                </div>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                  ok
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc22">
                <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#E6F8F1', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5 10 17.5 19 7" />
                  </svg>
                </span>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                    pagamento.aprovado
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    gateway → Photoon · 200
                  </p>
                </div>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                  ok
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc23">
                <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#FFF1F3', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8v5M12 16.5h.01" />
                    <circle cx="12" cy="12" r="8.5" />
                  </svg>
                </span>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                    envio.rastreio
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Correios → Photoon · timeout
                  </p>
                </div>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#FFF1F3', color: '#E11D48', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                  falha
                </span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '18px 24px', flexWrap: 'wrap' }}>
            <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
              Chaves de API
            </h2>
            <a href="#" style={{ fontSize: '13px', fontWeight: '700' }}>
              Gerar chave
            </a>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(170px,1.2fr) minmax(180px,1.3fr) minmax(150px,1fr) minmax(130px,.9fr) minmax(120px,.8fr) minmax(110px,.7fr)', gap: '14px', padding: '10px 24px', background: '#F8FAFE', borderTop: '1px solid #EEF1F7', borderBottom: '1px solid #EEF1F7', fontSize: '11.5px', letterSpacing: '.6px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
              <span>
                Chave
              </span>
              <span>
                Escopo
              </span>
              <span>
                Criada por
              </span>
              <span>
                Último uso
              </span>
              <span>
                Expira
              </span>
              <span>
                Status
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(170px,1.2fr) minmax(180px,1.3fr) minmax(150px,1fr) minmax(130px,.9fr) minmax(120px,.8fr) minmax(110px,.7fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc24">
              <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                pk_live_••••4412
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Pedidos · leitura e escrita
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {v.usuarioNome}
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                hoje 09:12
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                12 set
              </span>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                Ativa
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(170px,1.2fr) minmax(180px,1.3fr) minmax(150px,1fr) minmax(130px,.9fr) minmax(120px,.8fr) minmax(110px,.7fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc25">
              <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                pk_live_••••8890
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Catálogo · leitura
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                João Pinto
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                hoje 08:40
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                sem prazo
              </span>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                Ativa
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(170px,1.2fr) minmax(180px,1.3fr) minmax(150px,1fr) minmax(130px,.9fr) minmax(120px,.8fr) minmax(110px,.7fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc26">
              <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                pk_test_••••2210
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Sandbox completo
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {v.usuarioNome}
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                22 ago
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                30 ago
              </span>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#F1F5FD', color: '#46536A', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                Teste
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(170px,1.2fr) minmax(180px,1.3fr) minmax(150px,1fr) minmax(130px,.9fr) minmax(120px,.8fr) minmax(110px,.7fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc27">
              <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                pk_live_••••1102
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Financeiro · leitura
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Ana Lopes
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                12 ago
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                revogada
              </span>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#FFF1F3', color: '#E11D48', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                Revogada
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
