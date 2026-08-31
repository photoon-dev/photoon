// Gerado por tools/dc2tsx.py a partir de Auditoria.dc.html
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
.dc15:hover { background: #F8FAFE; }
.dc16:hover { background: #F8FAFE; }
.dc17:hover { background: #F8FAFE; }
.dc18:hover { background: #F8FAFE; }
.dc19:hover { background: #F8FAFE; }
.dc20:hover { background: #F8FAFE; }
`;

export default function AuditoriaDesign({ v }: { v: any }) {
  return (
    <>
      <div style={{ padding: '26px 30px 60px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'riseIn .5s cubic-bezier(.2,.8,.2,1) both' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '1.6px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
              Sistema · Auditoria
            </p>
            <h1 style={{ margin: '0 0 8px', fontSize: '30px', fontWeight: '800', letterSpacing: '-1px' }}>
              Auditoria
            </h1>
            <p style={{ margin: '0', fontSize: '14.5px', color: '#6B7A90' }}>
              18 420 eventos no mês · 6 ações sensíveis hoje · retenção de 24 meses
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} className="dc1">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              Filtros
            </button>
            <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} className="dc2">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4v11M8 11l4 4 4-4" />
                <path d="M4 19h16" />
              </svg>
              Exportar trilha
            </button>
            <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '0', borderRadius: '14px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(37,99,235,.28)' }} className="dc3">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Nova regra de alerta
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc4">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                Eventos no mês
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EAF0FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3.5 5 6.5v5c0 4.3 2.9 7.6 7 9 4.1-1.4 7-4.7 7-9v-5z" />
                  <path d="m9.3 12 1.9 1.9 3.6-3.9" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              18 420
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#EAF0FF', color: '#2563EB', fontSize: '11.5px', fontWeight: '700' }}>
                +6% vs julho
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 21 12 17 24 19 36 11 48 14 60 6 72 3 80 5" stroke="#2563EB" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc5">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                Ações sensíveis
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#FEF3E2', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="15" r="3.5" />
                  <path d="m10.5 12.5 7-7M15 5.5 19 9.5M13 7.5 16.5 11" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              6
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '11.5px', fontWeight: '700' }}>
                hoje
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 18 12 20 24 13 36 15 48 9 60 12 72 5 80 7" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc6">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                Logins fora do horário
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EDEBFE', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M12 7.5v5l3 2" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              3
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#EDEBFE', color: '#6366F1', fontSize: '11.5px', fontWeight: '700' }}>
                2 aprovados
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 8 12 6 24 11 36 9 48 14 60 12 72 17 80 16" stroke="#6366F1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc7">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                Tentativas bloqueadas
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#FFF1F3', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8v5M12 16.5h.01" />
                  <circle cx="12" cy="12" r="8.5" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              11
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#FFF1F3', color: '#E11D48', fontSize: '11.5px', fontWeight: '700' }}>
                IP bloqueado 2 h
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 20 12 16 24 18 36 12 48 13 60 8 72 6 80 4" stroke="#F43F5E" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc8">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                Retenção
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#E6F8F1', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5 10 17.5 19 7" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              24 meses
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '11.5px', fontWeight: '700' }}>
                conforme LGPD
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 14 12 12 24 16 36 10 48 12 60 7 72 9 80 6" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '4px', padding: '5px', background: '#F4F7FC', border: '1px solid #E6EAF2', borderRadius: '999px', flexWrap: 'wrap' }}>
            <span onClick={v.setP0} style={css(v.per0)} className="dc9">
              Trilha completa
            </span>
            <span onClick={v.setP1} style={css(v.per1)} className="dc10">
              Ações sensíveis
            </span>
            <span onClick={v.setP2} style={css(v.per2)} className="dc11">
              Acessos
            </span>
            <span onClick={v.setP3} style={css(v.per3)} className="dc12">
              Alterações de preço
            </span>
            <span onClick={v.setP4} style={css(v.per4)} className="dc13">
              LGPD
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
              LGPD em conformidade
            </span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', alignItems: 'start' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
              <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                Eventos por módulo
              </h2>
              <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                no mês
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '7px' }}>
                  <span style={{ fontWeight: '500' }}>
                    Pedidos
                  </span>
                  <span style={{ color: '#6B7A90' }}>
                    7 840 eventos
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
                    Produção
                  </span>
                  <span style={{ color: '#6B7A90' }}>
                    5 220 eventos
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
                    Financeiro
                  </span>
                  <span style={{ color: '#6B7A90' }}>
                    3 180 eventos
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
                    Configurações
                  </span>
                  <span style={{ color: '#6B7A90' }}>
                    2 180 eventos
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
                Ações sensíveis de hoje
              </h2>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                6 eventos
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {v.eventos.map((ev: any, i5: number) => (
                <div key={i5} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc14">
                  <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#E6F8F1', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                    <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 11.5V5h6.5L20 14.5 13.5 21z" />
                      <circle cx="8" cy="8.5" r="1.4" />
                    </svg>
                  </span>
                  <div style={{ flex: '1', minWidth: '0' }}>
                    <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                      {ev.acao}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ev.detalhe}
                    </p>
                  </div>
                  <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                    revisado
                  </span>
                </div>
              ))}
              <div style={css(v.semEventos)}>
                Nenhuma ação registrada ainda.
              </div>
            </div>
          </div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '18px 24px', flexWrap: 'wrap' }}>
            <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
              Trilha de auditoria
            </h2>
            <a href="#" style={{ fontSize: '13px', fontWeight: '700' }}>
              Ver tudo
            </a>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px,.8fr) minmax(160px,1.1fr) minmax(210px,1.6fr) minmax(130px,.9fr) minmax(140px,1fr) minmax(110px,.7fr)', gap: '14px', padding: '10px 24px', background: '#F8FAFE', borderTop: '1px solid #EEF1F7', borderBottom: '1px solid #EEF1F7', fontSize: '11.5px', letterSpacing: '.6px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
              <span>
                Horário
              </span>
              <span>
                Usuário
              </span>
              <span>
                Ação
              </span>
              <span>
                Módulo
              </span>
              <span>
                Origem
              </span>
              <span>
                Nível
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px,.8fr) minmax(160px,1.1fr) minmax(210px,1.6fr) minmax(130px,.9fr) minmax(140px,1fr) minmax(110px,.7fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc15">
              <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                09:42
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {v.usuarioNome}
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Alterou preço de produto
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Preços
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                192.168.0.14 · web
              </span>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                Sensível
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px,.8fr) minmax(160px,1.1fr) minmax(210px,1.6fr) minmax(130px,.9fr) minmax(140px,1fr) minmax(110px,.7fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc16">
              <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                09:18
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Ana Lopes
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Aprovou estorno de R$ 640
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Financeiro
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                200.140.22.8 · web
              </span>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                Sensível
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px,.8fr) minmax(160px,1.1fr) minmax(210px,1.6fr) minmax(130px,.9fr) minmax(140px,1fr) minmax(110px,.7fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc17">
              <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                08:56
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                João Pinto
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Avançou etapa de 12 jobs
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Produção
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                tablet · fábrica
              </span>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#F1F5FD', color: '#46536A', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                Normal
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px,.8fr) minmax(160px,1.1fr) minmax(210px,1.6fr) minmax(130px,.9fr) minmax(140px,1fr) minmax(110px,.7fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc18">
              <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                08:32
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                sistema
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Executou fluxo de cobrança
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Automações
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                worker-02
              </span>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#F1F5FD', color: '#46536A', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                Normal
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px,.8fr) minmax(160px,1.1fr) minmax(210px,1.6fr) minmax(130px,.9fr) minmax(140px,1fr) minmax(110px,.7fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc19">
              <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                07:58
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Bruno Sá
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Exportou base de clientes
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                CRM
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                189.44.10.2 · web
              </span>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#FFF1F3', color: '#E11D48', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                Sensível
              </span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(120px,.8fr) minmax(160px,1.1fr) minmax(210px,1.6fr) minmax(130px,.9fr) minmax(140px,1fr) minmax(110px,.7fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc20">
              <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                02:14
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                desconhecido
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                3 tentativas de login falhadas
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Acesso
              </span>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                IP bloqueado
              </span>
              <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#FFF1F3', color: '#E11D48', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                Bloqueado
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
