// Gerado por tools/dc2tsx.py a partir de Producao.dc.html
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
.dc7:hover { background: #F1F5FD; border-color: #D6E2FC; color: #2563EB; }
.dc8:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc9:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc10:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc11:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc12:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc13:hover { background: #FFFFFF; color: #2563EB; }
.dc14:hover { background: #FFFFFF; color: #2563EB; }
.dc15:hover { background: #FFFFFF; color: #2563EB; }
.dc16:hover { box-shadow: 0 10px 22px rgba(11,18,32,.09); transform: translateY(-2px); border-color: #D6E2FC; }
.dc17:hover { background: #F1F5FD; color: #2563EB; border-color: #D6E2FC; }
.dc18:hover { background: #F1F5FD; color: #2563EB; border-color: #D6E2FC; }
.dc19:hover { border-color: #D6E2FC; }
`;

export default function ProducaoDesign({ v }: { v: any }) {
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
              {v.lojaIniciais}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.25', minWidth: '0' }}>
              <span style={{ fontSize: '13.5px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {v.lojaNome}
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
                {v.selo1}
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
                  {v.usoTitulo}
                </span>
                <span style={{ marginLeft: 'auto', fontSize: '11.5px', color: '#6B7A90' }}>
                  {v.usoPct}
                </span>
              </div>
              <div style={{ height: '7px', borderRadius: '999px', background: '#E3E9F5', overflow: 'hidden' }}>
                <div style={css(v.usoBarra)}>
                </div>
              </div>
              <p style={{ margin: '10px 0 0', fontSize: '11.5px', color: '#6B7A90' }}>
                {v.usoTexto}
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
              <input placeholder="Buscar job, lote ou equipamento" style={{ flex: '1', border: '0', background: 'transparent', fontFamily: 'inherit', fontSize: '14px', color: '#0B1220' }} />
              <span style={{ padding: '4px 9px', borderRadius: '8px', background: '#F1F5FD', fontSize: '11px', fontWeight: '600', color: '#6B7A90' }}>
                ⌘K
              </span>
            </div>
            <div style={{ flex: '1' }}>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
              <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '0', borderRadius: '14px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 8px 20px rgba(37,99,235,.28)' }} className="dc1">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Novo pedido
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
                    {v.usuarioIniciais}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.25', textAlign: 'left' }}>
                    <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                      {v.usuarioNome}
                    </span>
                    <span style={{ fontSize: '11.5px', color: '#6B7A90' }}>
                      {v.usuarioCargo}
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
                    <a href="./Login.dc.html" style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '10px 12px', borderRadius: '12px', fontSize: '13.5px', color: '#E11D48' }} className="dc6">
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
                <a href="/pedidos" style={{ textDecoration: 'none', whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} className="dc7">
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
              <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc8">
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
              <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc9">
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
              <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc10">
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
              <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc11">
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
              <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc12">
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
                <span onClick={v.setP0} style={css(v.per0)} className="dc13">
                  {v.rot0}
                </span>
                <span onClick={v.setP1} style={css(v.per1)} className="dc14">
                  {v.rot1}
                </span>
                <span onClick={v.setP2} style={css(v.per2)} className="dc15">
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
                  {v.colunas.map((col: any, i7: number) => (
                    <div key={i7} onDragOver={col.sobre} onDrop={col.soltar} style={css(col.estilo)}>
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
                        {col.cards.map((c: any, i10: number) => (
                          <div key={i10} draggable="true" onDragStart={c.arrastar} onDragEnd={c.soltarCard} onClick={c.abrir} style={css(c.estilo)} className="dc16">
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
                              <button onClick={c.avancar} style={css(c.btnAvancar)} className="dc17">
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
                  {v.pendentes.map((p: any, i7: number) => (
                    <div key={i7} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7' }}>
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
                      <button onClick={p.enfileirar} style={{ whiteSpace: 'nowrap', height: '36px', padding: '0 14px', border: '1px solid #E6EAF2', borderRadius: '12px', background: '#FFFFFF', color: '#46536A', fontFamily: 'inherit', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer' }} className="dc18">
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
                  {v.responsaveis.map((r: any, i7: number) => (
                    <div key={i7} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7' }}>
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
                  {v.revisao.map((rv: any, i7: number) => (
                    <div key={i7} onClick={rv.abrir} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc19">
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
        </main>
      </div>
    </>
  );
}
