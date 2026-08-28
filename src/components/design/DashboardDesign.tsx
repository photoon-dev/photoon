// Gerado por tools/dc2tsx.py a partir de Dashboard.dc.html
// Transliteração fiel do design: não editar à mão, editar o .dc.html.
'use client';

import { css } from '@/lib/css';

export const CSS_PSEUDO = `
.dc1:hover { filter: brightness(1.06); }
.dc2:hover { background: #F1F5FD; color: #2563EB; }
.dc3:hover { background: #F1F5FD; color: #2563EB; }
.dc4:hover { background: #F1F5FD; color: #2563EB; }
.dc5:hover { background: #F1F5FD; color: #2563EB; }
.dc6:hover { background: #FFF1F3; color: #E11D48; }
.dc7:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc8:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc9:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc10:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc11:hover { background: #FFFFFF; color: #2563EB; }
.dc12:hover { background: #FFFFFF; color: #2563EB; }
.dc13:hover { background: #FFFFFF; color: #2563EB; }
.dc14:hover { background: #F8FAFE; }
.dc15:hover { background: #F8FAFE; }
.dc16:hover { background: #F8FAFE; }
.dc17:hover { background: #F8FAFE; }
.dc18:hover { background: #FFE4E9; }
.dc19:hover { background: #FCE9CE; }
.dc20:hover { background: #E7EEFB; }
.dc21:hover { background: #EAF0FF; border-color: #D6E2FC; }
.dc22:hover { background: #E4F8FC; border-color: #CBEEF6; }
.dc23:hover { background: #E6F8F1; border-color: #CDEEDF; }
.dc24:hover { background: #EDEBFE; border-color: #DDD9FB; }
`;

export default function DashboardDesign({ v }: { v: any }) {
  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', background: '#F4F7FC', fontFamily: '\'Plus Jakarta Sans\', sans-serif', color: '#0B1220' }}>
        <aside style={css(v.sideStyle)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '11px', height: '78px', padding: '0 22px', overflow: 'hidden', whiteSpace: 'nowrap', flex: '0 0 auto' }}>
            <svg viewBox="0 0 124 72" width="40" height="24" style={{ flex: '0 0 auto' }}>
              <defs>
                <linearGradient id="lensA" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#2563EB" />
                  <stop offset="1" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              <circle cx="34" cy="36" r="26" fill="none" stroke="#0B1220" strokeWidth="7" />
              <circle cx="34" cy="36" r="11" fill="#0B1220" />
              <circle cx="90" cy="36" r="26" fill="none" stroke="#0B1220" strokeWidth="7" />
              <circle cx="90" cy="36" r="11" fill="url(#lensA)" />
              <circle cx="98" cy="19" r="5.5" fill="#06B6D4" />
            </svg>
            <span style={css(v.brandStyle)}>
              PHOTOON
            </span>
          </div>
          <div style={css(v.tenantStyle)}>
            <div style={{ width: '34px', height: '34px', borderRadius: '11px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700', flex: '0 0 auto' }}>
              LC
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.25', minWidth: '0' }}>
              <span style={{ fontSize: '13.5px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Lab Cores
              </span>
              <span style={{ fontSize: '11.5px', color: '#6B7A90' }}>
                {v.lojaSub}
              </span>
            </div>
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#9AA7BC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 'auto', flex: '0 0 auto' }}>
              <path d="m8 9 4-4 4 4M8 15l4 4 4-4" />
            </svg>
          </div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '3px', padding: '8px 14px 6px', flex: '1', overflowX: 'hidden', overflowY: 'auto' }}>
            <p style={css(v.groupStyle)}>
              Operação
            </p>
            <div onClick={v.pick0} style={css(v.nav0)}>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <rect x="3" y="3" width="7.5" height="7.5" rx="2.4" />
                <rect x="13.5" y="3" width="7.5" height="7.5" rx="2.4" />
                <rect x="3" y="13.5" width="7.5" height="7.5" rx="2.4" />
                <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.4" />
              </svg>
              <span style={css(v.labelStyle)}>
                Dashboard
              </span>
            </div>
            <div onClick={v.pick1} style={css(v.nav1)}>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <path d="M4 8h16l-1.2 11.2a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8z" />
                <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
              </svg>
              <span style={css(v.labelStyle)}>
                Pedidos
              </span>
              <span style={css(v.badgeStyle)}>
                14
              </span>
            </div>
            <div onClick={v.pick2} style={css(v.nav2)}>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <path d="M7 9V4h10v5" />
                <rect x="4" y="9" width="16" height="7" rx="2.5" />
                <path d="M7 14h10v6H7z" />
              </svg>
              <span style={css(v.labelStyle)}>
                Produção
              </span>
            </div>
            <div onClick={v.pick3} style={css(v.nav3)}>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <path d="M4 7.5 12 3.5l8 4v9L12 20.5l-8-4z" />
                <path d="m4 7.5 8 4 8-4M12 11.5v9" />
              </svg>
              <span style={css(v.labelStyle)}>
                Expedição
              </span>
            </div>
            <p style={css(v.groupStyle)}>
              Loja e catálogo
            </p>
            <div onClick={v.pick4} style={css(v.nav4)}>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <path d="M4 9.5 5.5 4h13L20 9.5" />
                <path d="M4 9.5h16V20H4z" />
                <path d="M9 20v-5h6v5" />
              </svg>
              <span style={css(v.labelStyle)}>
                Loja
              </span>
            </div>
            <div onClick={v.pick5} style={css(v.nav5)}>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <rect x="3" y="4" width="18" height="16" rx="4" />
                <path d="m3.5 16 4.6-4.2 4 3.4 3.4-3 5 4.4" />
                <circle cx="8.6" cy="8.8" r="1.5" />
              </svg>
              <span style={css(v.labelStyle)}>
                Catálogo
              </span>
            </div>
            <div onClick={v.pick6} style={css(v.nav6)}>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <path d="M4 11.5V5h6.5L20 14.5 13.5 21z" />
                <circle cx="8" cy="8.5" r="1.4" />
              </svg>
              <span style={css(v.labelStyle)}>
                Preços
              </span>
            </div>
            <div onClick={v.pick7} style={css(v.nav7)}>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <path d="m12 3.5 8 4.2-8 4.2-8-4.2z" />
                <path d="m4 12.5 8 4.2 8-4.2" />
              </svg>
              <span style={css(v.labelStyle)}>
                Temas e templates
              </span>
            </div>
            <p style={css(v.groupStyle)}>
              Comercial
            </p>
            <div onClick={v.pick8} style={css(v.nav8)}>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <circle cx="9" cy="8" r="3.4" />
                <path d="M3.5 19.5c.7-3.2 3-5 5.5-5s4.8 1.8 5.5 5M16.5 6.2a3 3 0 0 1 0 5.6M18.5 19.5c-.3-1.7-.9-3-1.8-3.9" />
              </svg>
              <span style={css(v.labelStyle)}>
                Clientes
              </span>
            </div>
            <div onClick={v.pick9} style={css(v.nav9)}>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <rect x="3" y="4" width="18" height="16" rx="4" />
                <path d="M8 9h3.5M8 13h8M8 17h5" />
              </svg>
              <span style={css(v.labelStyle)}>
                CRM
              </span>
            </div>
            <div onClick={v.pick10} style={css(v.nav10)}>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <circle cx="12" cy="8" r="3.4" />
                <path d="M5 20c.8-3.6 3.6-5.6 7-5.6s6.2 2 7 5.6" />
              </svg>
              <span style={css(v.labelStyle)}>
                Vendedores
              </span>
            </div>
            <div onClick={v.pick11} style={css(v.nav11)}>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <path d="M4 10v4h3l7 4V6l-7 4z" />
                <path d="M17.5 9.5a4 4 0 0 1 0 5" />
              </svg>
              <span style={css(v.labelStyle)}>
                Marketing
              </span>
            </div>
            <p style={css(v.groupStyle)}>
              Financeiro
            </p>
            <div onClick={v.pick12} style={css(v.nav12)}>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <rect x="2.5" y="5" width="19" height="14" rx="4" />
                <path d="M2.5 10h19" />
              </svg>
              <span style={css(v.labelStyle)}>
                Pagamentos
              </span>
            </div>
            <div onClick={v.pick13} style={css(v.nav13)}>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H18v3" />
                <rect x="3" y="8" width="18" height="11" rx="3" />
                <circle cx="16.5" cy="13.5" r="1.3" />
              </svg>
              <span style={css(v.labelStyle)}>
                Carteira e faturas
              </span>
            </div>
            <p style={css(v.groupStyle)}>
              Sistema
            </p>
            <div onClick={v.pick14} style={css(v.nav14)}>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <path d="M4 19V9M10 19V5M16 19v-6M22 19H2" />
              </svg>
              <span style={css(v.labelStyle)}>
                Relatórios
              </span>
            </div>
            <div onClick={v.pick15} style={css(v.nav15)}>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <path d="M13 3 4.5 13.5H11l-1 7.5 8.5-10.5H12z" />
              </svg>
              <span style={css(v.labelStyle)}>
                Automações
              </span>
            </div>
            <div onClick={v.pick16} style={css(v.nav16)}>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <path d="M9 3v6M15 3v6" />
                <path d="M6 9h12v3a6 6 0 0 1-12 0z" />
                <path d="M12 18v3" />
              </svg>
              <span style={css(v.labelStyle)}>
                Integrações
              </span>
            </div>
            <div onClick={v.pick17} style={css(v.nav17)}>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <path d="M12 3.5 5 6.5v5c0 4.3 2.9 7.6 7 9 4.1-1.4 7-4.7 7-9v-5z" />
                <path d="m9.3 12 1.9 1.9 3.6-3.9" />
              </svg>
              <span style={css(v.labelStyle)}>
                Auditoria
              </span>
            </div>
            <div onClick={v.pick18} style={css(v.nav18)}>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <circle cx="12" cy="12" r="8.5" />
                <path d="M9.8 9.6a2.3 2.3 0 1 1 3 2.2v1.4M12 16.6h.01" />
              </svg>
              <span style={css(v.labelStyle)}>
                Suporte
              </span>
            </div>
            <div onClick={v.pick19} style={css(v.nav19)}>
              <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <circle cx="12" cy="12" r="3.4" />
                <path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4 5.3 5.3" />
              </svg>
              <span style={css(v.labelStyle)}>
                Configurações
              </span>
            </div>
          </nav>
          <div style={{ padding: '12px 14px 16px', display: 'flex', flexDirection: 'column', gap: '10px', flex: '0 0 auto' }}>
            <div style={css(v.storageCard)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '10px' }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#2563EB" strokeWidth="1.9" strokeLinecap="round">
                  <ellipse cx="12" cy="6" rx="7.5" ry="3" />
                  <path d="M4.5 6v12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3" />
                </svg>
                <span style={{ fontSize: '13px', fontWeight: '700' }}>
                  Armazenamento
                </span>
                <span style={{ marginLeft: 'auto', fontSize: '11.5px', color: '#6B7A90' }}>
                  72%
                </span>
              </div>
              <div style={{ height: '7px', borderRadius: '999px', background: '#E3E9F5', overflow: 'hidden' }}>
                <div style={{ width: '72%', height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg,#2563EB,#06B6D4)' }}>
                </div>
              </div>
              <p style={{ margin: '10px 0 0', fontSize: '11.5px', color: '#6B7A90' }}>
                1,44 TB de 2 TB · originais e produção
              </p>
            </div>
            <div onClick={v.toggleSide} style={css(v.collapseBtn)}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={css(v.chevStyle)}>
                <path d="m14 6-6 6 6 6" />
              </svg>
              <span style={css(v.labelStyle)}>
                Recolher menu
              </span>
            </div>
          </div>
        </aside>
        <main style={{ flex: '1', minWidth: '0', display: 'flex', flexDirection: 'column' }}>
          <header style={{ position: 'sticky', top: '0', zIndex: '30', display: 'flex', alignItems: 'center', gap: '16px', minHeight: '78px', padding: '12px 30px', flexWrap: 'wrap', background: 'rgba(244,247,252,.88)', backdropFilter: 'blur(14px)', borderBottom: '1px solid #E6EAF2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1', maxWidth: '460px', height: '46px', padding: '0 16px', background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '16px', boxShadow: '0 2px 8px rgba(11,18,32,.03)' }}>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#9AA7BC" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="6.5" />
                <path d="m16 16 4.5 4.5" />
              </svg>
              <input placeholder="Buscar pedido, cliente, OS ou produto" style={{ flex: '1', border: '0', background: 'transparent', fontFamily: 'inherit', fontSize: '14px', color: '#0B1220' }} />
              <span className="ph-atalho" style={{ padding: '4px 9px', borderRadius: '8px', background: '#F1F5FD', fontSize: '11px', fontWeight: '600', color: '#6B7A90' }}>
                ⌘K
              </span>
            </div>
            <div style={{ flex: '1' }}>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '0', borderRadius: '14px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 8px 20px rgba(37,99,235,.28)' }} className="dc1 ph-acao">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span className="ph-acao-texto">Novo pedido</span>
              </button>
              <button style={{ position: 'relative', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', color: '#46536A', cursor: 'pointer' }} className="dc2">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8.5a6 6 0 1 0-12 0c0 6-2 7.5-2 7.5h16s-2-1.5-2-7.5M10.5 19.5a2 2 0 0 0 3 0" />
                </svg>
                <span style={{ position: 'absolute', top: '10px', right: '11px', width: '8px', height: '8px', borderRadius: '999px', background: '#F43F5E', border: '2px solid #FFFFFF' }}>
                </span>
              </button>
              <div style={{ position: 'relative' }}>
                <div onClick={v.toggleMenu} style={css(v.avatarBtn)}>
                  <div style={{ width: '34px', height: '34px', borderRadius: '11px', background: 'linear-gradient(135deg,#0B1220,#2E3E5C)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12.5px', fontWeight: '700' }}>
                    MR
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.25', textAlign: 'left' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                      {v.usuarioNome}
                    </span>
                    <span style={{ fontSize: '11.5px', color: '#6B7A90' }}>
                      Administradora
                    </span>
                  </div>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#9AA7BC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={css(v.menuChev)}>
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </div>
                <div style={css(v.menuStyle)}>
                  <div style={{ padding: '16px', background: 'linear-gradient(135deg,#EEF3FF,#E4F8FC)' }}>
                    <p style={{ margin: '0', fontSize: '14px', fontWeight: '700' }}>
                      {v.usuarioNome}
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#6B7A90' }}>
                      {v.usuarioEmail}
                    </p>
                    <span style={{ display: 'inline-block', marginTop: '10px', padding: '4px 10px', borderRadius: '999px', background: '#FFFFFF', fontSize: '11px', fontWeight: '600', color: '#2563EB' }}>
                      {v.planoResumo}
                    </span>
                  </div>
                  <div style={{ padding: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '10px 12px', borderRadius: '12px', fontSize: '13.5px', color: '#34405A', cursor: 'pointer' }} className="dc3">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="3.4" />
                        <path d="M5 20c.8-3.6 3.6-5.6 7-5.6s6.2 2 7 5.6" />
                      </svg>
                      Meu perfil
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '10px 12px', borderRadius: '12px', fontSize: '13.5px', color: '#34405A', cursor: 'pointer' }} className="dc4">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 7.5 12 3.5l8 4v9L12 20.5l-8-4z" />
                      </svg>
                      Empresa e filiais
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '10px 12px', borderRadius: '12px', fontSize: '13.5px', color: '#34405A', cursor: 'pointer' }} className="dc5">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="5" width="18" height="14" rx="4" />
                        <path d="M3 10h18" />
                      </svg>
                      Assinatura e faturas
                    </div>
                  </div>
                  <div style={{ padding: '8px', borderTop: '1px solid #EEF1F7' }}>
                    <a href={v.hrefSair} onClick={v.sair} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '10px 12px', borderRadius: '12px', fontSize: '13.5px', color: '#E11D48' }} className="dc6">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v2M10 12h11M18 9l3 3-3 3" />
                      </svg>
                      Sair da conta
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div style={{ padding: '26px 30px 60px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'riseIn .5s cubic-bezier(.2,.8,.2,1) both' }}>
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '26px', padding: '28px 30px', background: 'linear-gradient(120deg,#0B1220 0%,#17306B 52%,#0E6E86 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
              <div style={{ position: 'absolute', right: '-60px', top: '-70px', width: '260px', height: '260px', borderRadius: '999px', background: 'radial-gradient(circle at 30% 30%, rgba(6,182,212,.55), rgba(6,182,212,0) 70%)' }}>
              </div>
              <div style={{ position: 'absolute', right: '130px', bottom: '-110px', width: '240px', height: '240px', borderRadius: '999px', background: 'radial-gradient(circle at 50% 50%, rgba(37,99,235,.45), rgba(37,99,235,0) 70%)' }}>
              </div>
              <div style={{ position: 'relative', flex: '1', minWidth: '320px' }}>
                <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '1.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)' }}>
                  Terça, 25 de agosto · 09:12
                </p>
                <h1 style={{ margin: '0 0 10px', fontSize: '32px', lineHeight: '1.15', fontWeight: '800', letterSpacing: '-.8px' }}>
                  Bom dia, Marta. O laboratório está indo bem.
                </h1>
                <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.6', color: 'rgba(255,255,255,.78)', maxWidth: '620px' }}>
                  14 pedidos entraram desde ontem, 3 lotes saem hoje e nenhum job de render falhou nas últimas 24 h.
                </p>
              </div>
              <div style={{ position: 'relative', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ minWidth: '132px', padding: '16px 18px', borderRadius: '18px', background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.18)', backdropFilter: 'blur(6px)' }}>
                  <p style={{ margin: '0 0 6px', fontSize: '12px', color: 'rgba(255,255,255,.7)' }}>
                    SLA no prazo
                  </p>
                  <p style={{ margin: '0', fontSize: '26px', fontWeight: '800' }}>
                    96%
                  </p>
                </div>
                <div style={{ minWidth: '132px', padding: '16px 18px', borderRadius: '18px', background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.18)', backdropFilter: 'blur(6px)' }}>
                  <p style={{ margin: '0 0 6px', fontSize: '12px', color: 'rgba(255,255,255,.7)' }}>
                    Na fila de render
                  </p>
                  <p style={{ margin: '0', fontSize: '26px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    27
                    <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: '#22D3EE', animation: 'pulseDot 1.8s ease-in-out infinite' }}>
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc7">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                    GMV do mês
                  </span>
                  <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EAF0FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                    +12,4%
                  </span>
                  <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                    <path d="M0 21 12 17 24 19 36 11 48 14 60 6 72 3 80 5" stroke="#2563EB" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc8">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                    Pedidos
                  </span>
                  <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#E4F8FC', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
                  <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '11.5px', fontWeight: '700' }}>
                    +8,1%
                  </span>
                  <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                    <path d="M0 18 12 20 24 13 36 15 48 9 60 12 72 5 80 7" stroke="#06B6D4" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc9">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                    Ticket médio
                  </span>
                  <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EDEBFE', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 4v16M8.5 8.2c0-1.6 1.6-2.4 3.5-2.4s3.5.9 3.5 2.6c0 3.6-7 2.2-7 5.6 0 1.8 1.7 2.7 3.5 2.7s3.5-.8 3.5-2.4" />
                    </svg>
                  </span>
                </div>
                <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
                  R$ 147,70
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '11.5px', fontWeight: '700' }}>
                    -1,9%
                  </span>
                  <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                    <path d="M0 8 12 6 24 11 36 9 48 14 60 12 72 17 80 16" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc10">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                    Conversão da loja
                  </span>
                  <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#E6F8F1', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="8.5" />
                      <path d="M12 7.5v5l3 2" />
                    </svg>
                  </span>
                </div>
                <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
                  3,8%
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '11.5px', fontWeight: '700' }}>
                    +0,4 pp
                  </span>
                  <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                    <path d="M0 20 12 16 24 18 36 12 48 13 60 8 72 6 80 4" stroke="#10B981" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="ph-2col" style={{ display: 'grid', gridTemplateColumns: '1.75fr 1fr', gap: '20px', alignItems: 'start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '24px 26px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap', marginBottom: '18px' }}>
                    <div>
                      <h2 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: '700' }}>
                        Vendas e pedidos
                      </h2>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12.5px', color: '#6B7A90' }}>
                          <span style={{ width: '9px', height: '9px', borderRadius: '3px', background: '#2563EB' }}>
                          </span>
                          Faturamento
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12.5px', color: '#6B7A90' }}>
                          <span style={{ width: '9px', height: '9px', borderRadius: '3px', background: '#06B6D4' }}>
                          </span>
                          Pedidos
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', padding: '5px', background: '#F4F7FC', border: '1px solid #E6EAF2', borderRadius: '999px', flexWrap: 'wrap' }}>
                      <span onClick={v.setP0} style={css(v.per0)} className="dc11">
                        7 dias
                      </span>
                      <span onClick={v.setP1} style={css(v.per1)} className="dc12">
                        30 dias
                      </span>
                      <span onClick={v.setP2} style={css(v.per2)} className="dc13">
                        Trimestre
                      </span>
                    </div>
                  </div>
                  <svg viewBox="0 0 700 210" width="100%" height="230" preserveAspectRatio="none" style={{ display: 'block' }}>
                    <defs>
                      <linearGradient id="fillA" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#2563EB" stop-opacity=".22" />
                        <stop offset="1" stopColor="#2563EB" stop-opacity="0" />
                      </linearGradient>
                      <linearGradient id="fillB" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#06B6D4" stop-opacity=".18" />
                        <stop offset="1" stopColor="#06B6D4" stop-opacity="0" />
                      </linearGradient>
                    </defs>
                    <g stroke="#EEF1F7" strokeWidth="1">
                      <path d="M0 40h700" />
                      <path d="M0 88h700" />
                      <path d="M0 136h700" />
                      <path d="M0 184h700" />
                    </g>
                    <path d="M0 150 58 132 116 140 175 104 233 116 291 78 350 88 408 60 466 72 525 44 583 56 641 28 700 36 V210 H0 Z" fill="url(#fillA)" />
                    <path d="M0 150 58 132 116 140 175 104 233 116 291 78 350 88 408 60 466 72 525 44 583 56 641 28 700 36" fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1600" style={{ animation: 'drawLine 1.4s ease-out both' }} />
                    <path d="M0 182 58 172 116 176 175 152 233 162 291 138 350 146 408 126 466 136 525 112 583 122 641 100 700 106 V210 H0 Z" fill="url(#fillB)" />
                    <path d="M0 182 58 172 116 176 175 152 233 162 291 138 350 146 408 126 466 136 525 112 583 122 641 100 700 106" fill="none" stroke="#06B6D4" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1600" style={{ animation: 'drawLine 1.6s .1s ease-out both' }} />
                    <circle cx="641" cy="28" r="6" fill="#FFFFFF" stroke="#2563EB" strokeWidth="3.4" />
                  </svg>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11.5px', color: '#9AA7BC' }}>
                    <span>
                      1 ago
                    </span>
                    <span>
                      6
                    </span>
                    <span>
                      11
                    </span>
                    <span>
                      16
                    </span>
                    <span>
                      21
                    </span>
                    <span>
                      26
                    </span>
                    <span>
                      Hoje
                    </span>
                  </div>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', overflow: 'hidden' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 26px 16px' }}>
                    <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                      Pedidos recentes
                    </h2>
                    <a href="#" style={{ fontSize: '13px', fontWeight: '600' }}>
                      Ver todos
                    </a>
                  </div>
                  <div className="ph-tab-cab" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr .8fr .9fr auto', gap: '16px', padding: '10px 26px', background: '#F8FAFE', borderTop: '1px solid #EEF1F7', borderBottom: '1px solid #EEF1F7', fontSize: '11.5px', letterSpacing: '.6px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '600' }}>
                    <span>
                      Cliente
                    </span>
                    <span>
                      Produto
                    </span>
                    <span>
                      Valor
                    </span>
                    <span>
                      Estado
                    </span>
                    <span>
                      Prazo
                    </span>
                  </div>
                  <div data-ph-linha style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr .8fr .9fr auto', gap: '16px', alignItems: 'center', padding: '14px 26px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc14">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '0' }}>
                      <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EAF0FF', color: '#2563EB', fontSize: '12.5px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                        SF
                      </span>
                      <div style={{ minWidth: '0' }}>
                        <p style={{ margin: '0', fontSize: '14px', fontWeight: '600' }}>
                          Studio Fotográfico Lume
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                          #PT-10482 · B2B
                        </p>
                      </div>
                    </div>
                    <span style={{ fontSize: '13.5px', color: '#34405A' }}>
                      Fotolivro 30×30
                    </span>
                    <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                      R$ 1.240
                    </span>
                    <span style={{ padding: '6px 11px', borderRadius: '999px', background: '#EAF0FF', color: '#2563EB', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                      Em produção
                    </span>
                    <span style={{ fontSize: '12.5px', color: '#6B7A90' }}>
                      27 ago
                    </span>
                  </div>
                  <div data-ph-linha style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr .8fr .9fr auto', gap: '16px', alignItems: 'center', padding: '14px 26px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc15">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '0' }}>
                      <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#E6F8F1', color: '#059669', fontSize: '12.5px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                        CF
                      </span>
                      <div style={{ minWidth: '0' }}>
                        <p style={{ margin: '0', fontSize: '14px', fontWeight: '600' }}>
                          Colégio Farol · Formatura
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                          #PT-10481 · Evento
                        </p>
                      </div>
                    </div>
                    <span style={{ fontSize: '13.5px', color: '#34405A' }}>
                      Revelação 15×21
                    </span>
                    <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                      R$ 3.980
                    </span>
                    <span style={{ padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                      Pago
                    </span>
                    <span style={{ fontSize: '12.5px', color: '#6B7A90' }}>
                      28 ago
                    </span>
                  </div>
                  <div data-ph-linha style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr .8fr .9fr auto', gap: '16px', alignItems: 'center', padding: '14px 26px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc16">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '0' }}>
                      <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#FEF3E2', color: '#B45309', fontSize: '12.5px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                        RN
                      </span>
                      <div style={{ minWidth: '0' }}>
                        <p style={{ margin: '0', fontSize: '14px', fontWeight: '600' }}>
                          Rita Nunes
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                          #PT-10480 · B2C
                        </p>
                      </div>
                    </div>
                    <span style={{ fontSize: '13.5px', color: '#34405A' }}>
                      Quadro canvas 40×60
                    </span>
                    <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                      R$ 289
                    </span>
                    <span style={{ padding: '6px 11px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                      Aguarda arte
                    </span>
                    <span style={{ fontSize: '12.5px', color: '#B45309', fontWeight: '600' }}>
                      Hoje
                    </span>
                  </div>
                  <div data-ph-linha style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr .8fr .9fr auto', gap: '16px', alignItems: 'center', padding: '14px 26px', cursor: 'pointer' }} className="dc17">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '0' }}>
                      <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EDEBFE', color: '#6366F1', fontSize: '12.5px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                        MB
                      </span>
                      <div style={{ minWidth: '0' }}>
                        <p style={{ margin: '0', fontSize: '14px', fontWeight: '600' }}>
                          Memória Books
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                          #PT-10479 · B2B
                        </p>
                      </div>
                    </div>
                    <span style={{ fontSize: '13.5px', color: '#34405A' }}>
                      Álbum + estojo
                    </span>
                    <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                      R$ 2.410
                    </span>
                    <span style={{ padding: '6px 11px', borderRadius: '999px', background: '#F1F5FD', color: '#46536A', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                      Expedido
                    </span>
                    <span style={{ fontSize: '12.5px', color: '#6B7A90' }}>
                      24 ago
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <h2 style={{ margin: '0', fontSize: '17px', fontWeight: '700' }}>
                      Produção hoje
                    </h2>
                    <span style={{ padding: '5px 10px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '11.5px', fontWeight: '700' }}>
                      no prazo
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '7px' }}>
                        <span style={{ color: '#34405A', fontWeight: '500' }}>
                          Renderização
                        </span>
                        <span style={{ color: '#6B7A90' }}>
                          27 / 40
                        </span>
                      </div>
                      <div style={{ height: '8px', borderRadius: '999px', background: '#EEF1F7' }}>
                        <div style={{ width: '68%', height: '100%', borderRadius: '999px', background: '#2563EB' }}>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '7px' }}>
                        <span style={{ color: '#34405A', fontWeight: '500' }}>
                          Impressão
                        </span>
                        <span style={{ color: '#6B7A90' }}>
                          18 / 32
                        </span>
                      </div>
                      <div style={{ height: '8px', borderRadius: '999px', background: '#EEF1F7' }}>
                        <div style={{ width: '56%', height: '100%', borderRadius: '999px', background: '#06B6D4' }}>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '7px' }}>
                        <span style={{ color: '#34405A', fontWeight: '500' }}>
                          Acabamento
                        </span>
                        <span style={{ color: '#6B7A90' }}>
                          9 / 25
                        </span>
                      </div>
                      <div style={{ height: '8px', borderRadius: '999px', background: '#EEF1F7' }}>
                        <div style={{ width: '36%', height: '100%', borderRadius: '999px', background: '#6366F1' }}>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '7px' }}>
                        <span style={{ color: '#34405A', fontWeight: '500' }}>
                          Expedição
                        </span>
                        <span style={{ color: '#6B7A90' }}>
                          21 / 24
                        </span>
                      </div>
                      <div style={{ height: '8px', borderRadius: '999px', background: '#EEF1F7' }}>
                        <div style={{ width: '88%', height: '100%', borderRadius: '999px', background: '#10B981' }}>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 24px' }}>
                  <h2 style={{ margin: '0 0 16px', fontSize: '17px', fontWeight: '700' }}>
                    Precisa de você
                  </h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', borderRadius: '16px', background: '#FFF1F3', cursor: 'pointer' }} className="dc18">
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
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', borderRadius: '16px', background: '#FEF3E2', cursor: 'pointer' }} className="dc19">
                      <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#FFFFFF', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="4" width="18" height="16" rx="4" />
                          <path d="m3.5 16 4.6-4.2 4 3.4 3.4-3 5 4.4" />
                        </svg>
                      </span>
                      <div>
                        <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                          5 artes com DPI baixo
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                          Preflight bloqueou o envio
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', borderRadius: '16px', background: '#F1F5FD', cursor: 'pointer' }} className="dc20">
                      <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#FFFFFF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 6h16M4 12h16M4 18h10" />
                        </svg>
                      </span>
                      <div>
                        <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                          3 propostas para enviar
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                          Pipeline · etapa negociação
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 24px' }}>
                  <h2 style={{ margin: '0 0 14px', fontSize: '17px', fontWeight: '700' }}>
                    Atalhos
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', padding: '14px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc21">
                      <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#EAF0FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>
                        Novo produto
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', padding: '14px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc22">
                      <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#E4F8FC', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 16V4M8 8l4-4 4 4" />
                          <path d="M4 16v2.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V16" />
                        </svg>
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>
                        Importar clientes
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', padding: '14px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc23">
                      <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#E6F8F1', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="5" width="18" height="14" rx="3.5" />
                          <path d="M3 10h18" />
                        </svg>
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>
                        Tabela de preços
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', padding: '14px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc24">
                      <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#EDEBFE', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="8.5" />
                          <path d="M12 8.5v7M8.5 12h7" />
                        </svg>
                      </span>
                      <span style={{ fontSize: '13px', fontWeight: '600' }}>
                        Nova campanha
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
