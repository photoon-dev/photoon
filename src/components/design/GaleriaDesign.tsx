// Gerado por tools/dc2tsx.py a partir de Cliente Galeria de fotos.dc.html
// Transliteração fiel do design: não editar à mão, editar o .dc.html.
'use client';

import { css } from '@/lib/css';

export const CSS_PSEUDO = `
.dc1:hover { background: #F4F7FC; color: #2563EB; }
.dc2:hover { background: #F4F7FC; color: #2563EB; }
.dc3:hover { background: #F4F7FC; color: #2563EB; }
.dc4:hover { background: #F1F5FD; color: #2563EB; }
.dc5:hover { background: #F4F7FC; color: #2563EB; }
.dc6:hover { background: #F4F7FC; color: #2563EB; }
.dc7:hover { background: #F4F7FC; color: #2563EB; }
.dc8:hover { background: #F4F7FC; color: #2563EB; }
.dc9:hover { background: #FFF1F3; color: #E11D48; }
.dc10:hover { background: #F3F1FF; color: #4F46E5; }
.dc11:hover { filter: brightness(1.06); color: #FFFFFF; }
.dc12:hover { background: #F3F1FF; color: #4F46E5; }
.dc13:hover { background: #F3F1FF; color: #4F46E5; }
.dc14:hover { background: #F3F1FF; color: #4F46E5; }
.dc15:hover { background: #F3F1FF; color: #4F46E5; }
.dc16:hover { background: #F3F1FF; color: #4F46E5; }
.dc17:hover { background: #F3F1FF; color: #4F46E5; }
.dc18:hover { background: #FFF1F3; color: #E11D48; }
.dc19:hover { color: #2563EB; }
.dc20:hover { filter: brightness(1.06); color: #FFFFFF; }
.dc21:hover { border-color: #D6E2FC; }
.dc22:hover { background: #FFFFFF; }
.dc23:hover { background: #FFFFFF; }
.dc24:hover { background: rgba(255,255,255,.24); }
.dc25:hover { background: #F1F5FD; color: #2563EB; }
.dc26:hover { background: #F1F5FD; color: #2563EB; }
`;

export default function GaleriaDesign({ v }: { v: any }) {
  return (
    <>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#F4F7FC', fontFamily: '\'Plus Jakarta Sans\', sans-serif', color: '#0B1220' }}>
        <header style={{ position: 'sticky', top: '0', zIndex: '40', display: 'flex', alignItems: 'center', gap: '20px', minHeight: '72px', padding: '12px 28px', background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E6EAF2', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '11px', minWidth: '0' }}>
            <span style={{ width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
              <svg viewBox="0 0 40 40" width="36" height="36" role="img" aria-label="Photoon" style={{ animation: 'markSpin 24s linear infinite', transformOrigin: '50% 50%' }}>
                <defs>
                  <linearGradient id="photoon-grad-hdr" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#2563EB" />
                    <stop offset="1" stopColor="#06B6D4" />
                  </linearGradient>
                  <mask id="photoon-mark-hdr">
                    <rect width="40" height="40" fill="black" />
                    <g fill="white" stroke="white">
                      <circle cx="20" cy="20" r="6.2" />
                      <g>
                        <line x1="20" y1="20" x2="33.6" y2="20" strokeWidth="3.6" strokeLinecap="round" />
                        <circle cx="33.6" cy="20" r="4.6" stroke="none" />
                      </g>
                      <g>
                        <line x1="20" y1="20" x2="26.8" y2="31.7779" strokeWidth="3.6" strokeLinecap="round" />
                        <circle cx="26.8" cy="31.7779" r="4.6" stroke="none" />
                      </g>
                      <g>
                        <line x1="20" y1="20" x2="13.2" y2="31.7779" strokeWidth="3.6" strokeLinecap="round" />
                        <circle cx="13.2" cy="31.7779" r="4.6" stroke="none" />
                      </g>
                      <g>
                        <line x1="20" y1="20" x2="6.4" y2="20" strokeWidth="3.6" strokeLinecap="round" />
                        <circle cx="6.4" cy="20" r="4.6" stroke="none" />
                      </g>
                      <g>
                        <line x1="20" y1="20" x2="13.2" y2="8.2221" strokeWidth="3.6" strokeLinecap="round" />
                        <circle cx="13.2" cy="8.2221" r="4.6" stroke="none" />
                      </g>
                      <g>
                        <line x1="20" y1="20" x2="26.8" y2="8.2221" strokeWidth="3.6" strokeLinecap="round" />
                        <circle cx="26.8" cy="8.2221" r="4.6" stroke="none" />
                      </g>
                    </g>
                    <g fill="black">
                      <circle cx="25.889" cy="23.4" r="2.2" />
                      <circle cx="20" cy="26.8" r="2.2" />
                      <circle cx="14.111" cy="23.4" r="2.2" />
                      <circle cx="14.111" cy="16.6" r="2.2" />
                      <circle cx="20" cy="13.2" r="2.2" />
                      <circle cx="25.889" cy="16.6" r="2.2" />
                    </g>
                    <path d="M16.43 18.7A3.8 3.8 0 0 1 21.3 16.43" fill="none" stroke="black" strokeWidth="1.3" strokeLinecap="round" />
                  </mask>
                </defs>
                <rect width="40" height="40" fill="url(#photoon-grad-hdr)" mask="url(#photoon-mark-hdr)" />
              </svg>
            </span>
            <div style={{ minWidth: '0' }}>
              <p style={{ margin: '0', fontSize: '15px', fontWeight: '800', letterSpacing: '-.2px', whiteSpace: 'nowrap' }}>
                {v.nomeLoja}
              </p>
              <p style={{ margin: '1px 0 0', fontSize: '11.5px', color: '#9AA7BC', whiteSpace: 'nowrap' }}>
                {v.enderecoLoja}
              </p>
            </div>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: '12px', flexWrap: 'wrap' }}>
            <a href={v.hrefProjetos} style={{ padding: '9px 15px', borderRadius: '999px', fontSize: '14px', fontWeight: '500', color: '#46536A', background: 'transparent' }} className="dc1">
              Meus projetos
            </a>
            <a href={v.hrefAjuda} style={{ padding: '9px 15px', borderRadius: '999px', fontSize: '14px', fontWeight: '500', color: '#46536A', background: 'transparent' }} className="dc2">
              Ajuda
            </a>
            <a href={v.hrefConta} style={{ padding: '9px 15px', borderRadius: '999px', fontSize: '14px', fontWeight: '500', color: '#46536A', background: 'transparent' }} className="dc3">
              Minha conta
            </a>
          </nav>
          <div style={{ flex: '1' }}>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <a href={v.hrefAjuda} style={{ width: '42px', height: '42px', borderRadius: '14px', border: '1px solid #E6EAF2', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#46536A', flex: '0 0 auto' }} className="dc4">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="8.5" />
                <path d="M9.8 9.6a2.3 2.3 0 1 1 3 2.2v1.4M12 16.6h.01" />
              </svg>
            </a>
            <button onClick={v.toggleNotif} title="Notificações" style={css(v.bellStyle)}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 15.5V11a6 6 0 1 0-12 0v4.5L4.5 18h15z" />
                <path d="M10 20.5a2.2 2.2 0 0 0 4 0" />
              </svg>
              <span style={css(v.bellDotStyle)}>
                {v.unreadCount}
              </span>
            </button>
            <div style={{ position: 'relative' }}>
              <div onClick={v.toggleMenu} style={css(v.avatarBtn)}>
                <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#0B1220', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12.5px', fontWeight: '700', flex: '0 0 auto' }}>
                  {v.iniciais}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', lineHeight: '1.25', textAlign: 'left' }}>
                  <span style={{ fontSize: '13.5px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                    {v.nomeCliente}
                  </span>
                  <span style={{ fontSize: '11.5px', color: '#6B7A90', whiteSpace: 'nowrap' }}>
                    {v.subCliente}
                  </span>
                </div>
                <span style={{ color: '#9AA7BC', flex: '0 0 auto' }}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </span>
              </div>
              <div style={css(v.menuStyle)}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #F0F3F9' }}>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '700' }}>
                    {v.nomeCliente}
                  </p>
                  <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#6B7A90' }}>
                    {v.emailCliente}
                  </p>
                </div>
                <div style={{ padding: '8px' }}>
                  <a href={v.hrefConta} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '10px 12px', borderRadius: '12px', fontSize: '13.5px', fontWeight: '500', color: '#46536A' }} className="dc5">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="3.4" />
                      <path d="M5 20c.8-3.6 3.6-5.6 7-5.6s6.2 2 7 5.6" />
                    </svg>
                    Meus dados
                  </a>
                  <a href={v.hrefConta} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '10px 12px', borderRadius: '12px', fontSize: '13.5px', fontWeight: '500', color: '#46536A' }} className="dc6">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="5" y="10.5" width="14" height="9" rx="2.5" />
                      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
                    </svg>
                    Alterar minha senha
                  </a>
                  <a href={v.hrefAjuda} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '10px 12px', borderRadius: '12px', fontSize: '13.5px', fontWeight: '500', color: '#46536A' }} className="dc7">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="8.5" />
                      <path d="M9.8 9.6a2.3 2.3 0 1 1 3 2.2v1.4M12 16.6h.01" />
                    </svg>
                    Ajuda e contato
                  </a>
                  <a href={v.hrefConta} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '10px 12px', borderRadius: '12px', fontSize: '13.5px', fontWeight: '500', color: '#46536A' }} className="dc8">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="3.1" />
                      <path d="M12 3.5v2.2M12 18.3v2.2M4.6 7.8l1.9 1.1M17.5 15.1l1.9 1.1M4.6 16.2l1.9-1.1M17.5 8.9l1.9-1.1" />
                    </svg>
                    Configurações
                  </a>
                </div>
                <div style={{ padding: '8px', borderTop: '1px solid #F0F3F9' }}>
                  <a href={v.hrefEntrar} style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '10px 12px', borderRadius: '12px', fontSize: '13.5px', fontWeight: '600', color: '#E11D48' }} className="dc9">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v2M10 12h11M18 9l3 3-3 3" />
                    </svg>
                    Sair
                  </a>
                </div>
              </div>
            </div>
          </div>
        </header>
        <aside className="om-rail" style={css(v.railStyle)} onMouseEnter={v.openRail} onMouseLeave={v.closeRail}>
          <a href={v.hrefProjetos} title="Meus projetos" style={{ display: 'flex', alignItems: 'center', gap: '14px', height: '48px', padding: '0 11px', borderRadius: '16px', flexShrink: '0', width: '100%', boxSizing: 'border-box', alignSelf: 'stretch', background: 'transparent', color: '#46536A' }} className="dc10">
            <svg viewBox="0 0 24 24" width="26" height="26" style={{ flexShrink: '0' }} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7.5" height="7.5" rx="2.4" />
              <rect x="13.5" y="3" width="7.5" height="7.5" rx="2.4" />
              <rect x="3" y="13.5" width="7.5" height="7.5" rx="2.4" />
              <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.4" />
            </svg>
            <span style={css(v.railLabel)}>
              Meus projetos
            </span>
          </a>
          <a href={v.hrefGaleria} title="Galeria de fotos" style={{ display: 'flex', alignItems: 'center', gap: '14px', height: '48px', padding: '0 11px', borderRadius: '16px', flexShrink: '0', width: '100%', boxSizing: 'border-box', alignSelf: 'stretch', background: 'linear-gradient(135deg,#7C5CFF,#4F46E5)', color: '#FFFFFF', boxShadow: '0 8px 18px rgba(90,66,214,.28)' }} className="dc11">
            <svg viewBox="0 0 24 24" width="26" height="26" style={{ flexShrink: '0' }} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="3.5" />
              <path d="M7 5V3M17 5V3" />
              <circle cx="9" cy="11" r="1.6" />
              <path d="m4 18 5-4.4 3.4 3 3-2.6L20 18" />
            </svg>
            <span style={css(v.railLabel)}>
              Galeria de fotos
            </span>
          </a>
          <a href={v.hrefEditor} title="Editor de álbum" style={{ display: 'flex', alignItems: 'center', gap: '14px', height: '48px', padding: '0 11px', borderRadius: '16px', flexShrink: '0', width: '100%', boxSizing: 'border-box', alignSelf: 'stretch', background: 'transparent', color: '#46536A' }} className="dc12">
            <svg viewBox="0 0 24 24" width="26" height="26" style={{ flexShrink: '0' }} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 19h3l9.5-9.5a2.1 2.1 0 0 0-3-3L5 16z" />
            </svg>
            <span style={css(v.railLabel)}>
              Editor de álbum
            </span>
          </a>
          <a href={v.hrefCriarAlbum} title="Criar com IA" style={{ display: 'flex', alignItems: 'center', gap: '14px', height: '48px', padding: '0 11px', borderRadius: '16px', flexShrink: '0', width: '100%', boxSizing: 'border-box', alignSelf: 'stretch', background: 'transparent', color: '#46536A' }} className="dc13">
            <svg viewBox="0 0 24 24" width="26" height="26" style={{ flexShrink: '0' }} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 19 19 5M15 5h4v4" />
              <path d="M7 4v4M5 6h4M17 15v4M15 17h4" />
            </svg>
            <span style={css(v.railLabel)}>
              Criar com IA
            </span>
          </a>
          <a href={v.hrefRevisao} title="Revisão" style={{ display: 'flex', alignItems: 'center', gap: '14px', height: '48px', padding: '0 11px', borderRadius: '16px', flexShrink: '0', width: '100%', boxSizing: 'border-box', alignSelf: 'stretch', background: 'transparent', color: '#46536A' }} className="dc14">
            <svg viewBox="0 0 24 24" width="26" height="26" style={{ flexShrink: '0' }} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12.5 10 17.5 19 7" />
            </svg>
            <span style={css(v.railLabel)}>
              Revisão
            </span>
          </a>
          <a href={v.hrefCompartilhar} title="Compartilhar" style={{ display: 'flex', alignItems: 'center', gap: '14px', height: '48px', padding: '0 11px', borderRadius: '16px', flexShrink: '0', width: '100%', boxSizing: 'border-box', alignSelf: 'stretch', background: 'transparent', color: '#46536A' }} className="dc15">
            <svg viewBox="0 0 24 24" width="26" height="26" style={{ flexShrink: '0' }} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="17.5" cy="6" r="2.6" />
              <circle cx="6.5" cy="12" r="2.6" />
              <circle cx="17.5" cy="18" r="2.6" />
              <path d="m8.9 10.7 6.2-3.4M8.9 13.3l6.2 3.4" />
            </svg>
            <span style={css(v.railLabel)}>
              Compartilhar
            </span>
          </a>
          <a href={v.hrefAjuda} title="Ajuda" style={{ display: 'flex', alignItems: 'center', gap: '14px', height: '48px', padding: '0 11px', borderRadius: '16px', flexShrink: '0', width: '100%', boxSizing: 'border-box', alignSelf: 'stretch', background: 'transparent', color: '#46536A' }} className="dc16">
            <svg viewBox="0 0 24 24" width="26" height="26" style={{ flexShrink: '0' }} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="8.5" />
              <path d="M9.8 9.6a2.3 2.3 0 1 1 3 2.2v1.4M12 16.6h.01" />
            </svg>
            <span style={css(v.railLabel)}>
              Ajuda
            </span>
          </a>
          <a href={v.hrefConta} title="Minha conta" style={{ display: 'flex', alignItems: 'center', gap: '14px', height: '48px', padding: '0 11px', borderRadius: '16px', flexShrink: '0', width: '100%', boxSizing: 'border-box', alignSelf: 'stretch', background: 'transparent', color: '#46536A' }} className="dc17">
            <svg viewBox="0 0 24 24" width="26" height="26" style={{ flexShrink: '0' }} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="3.4" />
              <path d="M5 20c.8-3.6 3.6-5.6 7-5.6s6.2 2 7 5.6" />
            </svg>
            <span style={css(v.railLabel)}>
              Minha conta
            </span>
          </a>
          <span style={{ height: '1px', margin: '4px 8px', background: '#EEF1F7', flexShrink: '0' }}>
          </span>
          <a href={v.hrefEntrar} title="Sair" style={{ display: 'flex', alignItems: 'center', gap: '14px', height: '48px', padding: '0 11px', borderRadius: '16px', flexShrink: '0', width: '100%', boxSizing: 'border-box', alignSelf: 'stretch', color: '#E11D48' }} className="dc18">
            <svg viewBox="0 0 24 24" width="26" height="26" style={{ flexShrink: '0' }} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v2M10 12h11M18 9l3 3-3 3" />
            </svg>
            <span style={css(v.railLabel)}>
              Sair
            </span>
          </a>
        </aside>
        <main className="om-main" style={css(v.mainStyle)}>
          <div style={{ maxWidth: '1180px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'riseIn .5s cubic-bezier(.2,.8,.2,1) both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '13px', color: '#9AA7BC', flexWrap: 'wrap' }}>
              <a href={v.hrefProjetos} style={{ color: '#6B7A90', fontWeight: '600' }} className="dc19">
                Meus projetos
              </a>
              <span>
                /
              </span>
              <span style={{ color: '#46536A', fontWeight: '600' }}>
                Galeria de fotos
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ minWidth: '0' }}>
                <h1 style={{ margin: '0 0 6px', fontSize: '25px', fontWeight: '800', letterSpacing: '-.7px' }}>
                  Galeria de fotos
                </h1>
                <p style={{ margin: '0', fontSize: '14px', color: '#6B7A90' }}>
                  {v.resumo}
                </p>
              </div>
              <a href={v.hrefProjetos} style={{ height: '46px', padding: '0 22px', display: 'flex', alignItems: 'center', gap: '9px', borderRadius: '12px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#FFFFFF', fontSize: '14px', fontWeight: '700', boxShadow: '0 8px 20px rgba(37,99,235,.28)' }} className="dc20">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7.5" height="7.5" rx="2.4" />
                  <rect x="13.5" y="3" width="7.5" height="7.5" rx="2.4" />
                  <rect x="3" y="13.5" width="7.5" height="7.5" rx="2.4" />
                  <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.4" />
                </svg>
                Montar um álbum
              </a>
            </div>
            <div style={css(v.pessoasCartao)}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '14px', flexWrap: 'wrap', marginBottom: '18px' }}>
                <div>
                  <p style={{ margin: '0', fontSize: '16.5px', fontWeight: '800', letterSpacing: '-.3px' }}>
                    Pessoas nesta galeria
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#9AA7BC' }}>
                    {v.pessoasNota}
                  </p>
                </div>
                <button onClick={v.limparPessoa} style={css(v.limparEstilo)}>
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M6 6l12 12M18 6 6 18" />
                  </svg>
                  Mostrar todas de novo
                </button>
              </div>
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {v.pessoas.map((quem: any, i6: number) => (
                  <button key={i6} onClick={quem.escolher} title={quem.titulo} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '9px', width: '78px', padding: '0', border: '0', background: 'transparent', cursor: 'pointer', fontFamily: 'inherit' }}>
                    <span style={css(quem.foto)}>
                    </span>
                    <span style={css(quem.nomeEstilo)}>
                      {quem.nome}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {v.filtros.map((filtro: any, i5: number) => (
                <button key={i5} onClick={filtro.escolher} style={css(filtro.estilo)}>
                  {filtro.rotulo}
                </button>
              ))}
            </div>
            <p style={css(v.vazioEstilo)}>
              {v.vazioTexto}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(168px, 1fr))', gap: '14px' }}>
              {v.fotos.map((foto: any, i5: number) => (
                <button key={i5} onClick={foto.abrir} title={foto.titulo} style={{ position: 'relative', aspectRatio: '3 / 4', overflow: 'hidden', borderRadius: '16px', border: '1px solid #E6EAF2', background: '#F1F5FD', padding: '0', cursor: 'pointer' }} className="dc21">
                  <img src={foto.url} alt="" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  <span style={css(foto.selo)}>
                    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="9" r="3.4" />
                      <path d="M5 20c1-3.6 3.7-5.4 7-5.4s6 1.8 7 5.4" />
                    </svg>
                    {foto.rostos}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </main>
        {Boolean(v.visorAberto) && (
          <>
            <div onClick={v.fecharVisor} style={{ position: 'fixed', inset: '0', zIndex: '80', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px', background: 'rgba(11,18,32,.86)', backdropFilter: 'blur(4px)' }}>
              <img src={v.visorUrl} alt="" onClick={v.segurar} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 30px 80px rgba(0,0,0,.5)' }} />
              <button onClick={v.anterior} title="Anterior" style={{ position: 'absolute', left: '22px', top: '50%', transform: 'translateY(-50%)', width: '50px', height: '50px', borderRadius: '999px', border: '0', background: 'rgba(255,255,255,.92)', color: '#0B1220', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit' }} className="dc22">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 6l-6 6 6 6" />
                </svg>
              </button>
              <button onClick={v.proxima} title="Próxima" style={{ position: 'absolute', right: '22px', top: '50%', transform: 'translateY(-50%)', width: '50px', height: '50px', borderRadius: '999px', border: '0', background: 'rgba(255,255,255,.92)', color: '#0B1220', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit' }} className="dc23">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10 6l6 6-6 6" />
                </svg>
              </button>
              <button onClick={v.fecharVisor} title="Fechar" style={{ position: 'absolute', right: '22px', top: '22px', width: '44px', height: '44px', borderRadius: '14px', border: '1px solid rgba(255,255,255,.28)', background: 'rgba(255,255,255,.12)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontFamily: 'inherit' }} className="dc24">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
              <span style={{ position: 'absolute', bottom: '26px', left: '50%', transform: 'translateX(-50%)', padding: '9px 16px', borderRadius: '999px', background: 'rgba(11,18,32,.72)', color: '#FFFFFF', fontSize: '12.5px', fontWeight: '600' }}>
                {v.visorContagem}
              </span>
            </div>
          </>
        )}
        <div onClick={v.closeNotif} style={css(v.scrimStyle)}>
        </div>
        <aside style={css(v.drawerStyle)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '20px 22px', borderBottom: '1px solid #EEF1F7' }}>
            <div style={{ flex: '1', minWidth: '0' }}>
              <p style={{ margin: '0', fontSize: '16px', fontWeight: '800', letterSpacing: '-.3px' }}>
                Notificações
              </p>
              <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#9AA7BC' }}>
                Avisos da Photoon sobre seus projetos
              </p>
            </div>
            <button onClick={v.closeNotif} style={{ width: '38px', height: '38px', borderRadius: '12px', border: '1px solid #E6EAF2', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#46536A', cursor: 'pointer', fontFamily: 'inherit' }} className="dc25">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          {Boolean(v.hasDetail) && (
            <>
              <div style={{ flex: '1', minHeight: '0', overflowY: 'auto', padding: '22px' }}>
                <button onClick={v.backToList} style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '34px', padding: '0 12px', marginBottom: '18px', borderRadius: '10px', border: '1px solid #E6EAF2', background: '#FFFFFF', color: '#46536A', fontFamily: 'inherit', fontSize: '12.5px', fontWeight: '600', cursor: 'pointer' }} className="dc26">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H6M12 5l-7 7 7 7" />
                  </svg>
                  Todas as notificações
                </button>
                <span style={css(v.notifDetail.tagStyle)}>
                  {v.notifDetail.tag}
                </span>
                <h2 style={{ margin: '12px 0 6px', fontSize: '20px', lineHeight: '1.28', fontWeight: '800', letterSpacing: '-.5px', textWrap: 'pretty' }}>
                  {v.notifDetail.title}
                </h2>
                <p style={{ margin: '0 0 18px', fontSize: '12.5px', color: '#9AA7BC' }}>
                  {v.notifDetail.time}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {v.notifDetail.body.map((par: any, i7: number) => (
                    <p key={i7} style={{ margin: '0', fontSize: '14px', lineHeight: '1.68', color: '#46536A', textWrap: 'pretty' }}>
                      {par}
                    </p>
                  ))}
                </div>
              </div>
            </>
          )}
          {Boolean(v.notifOpen) && (
            <>
              <div style={{ flex: '1', minHeight: '0', overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {v.notifList.map((n: any, i6: number) => (
                  <button key={i6} onClick={n.pick} style={css(n.rowStyle)}>
                    <span style={css(n.dotStyle)}>
                    </span>
                    <span style={{ flex: '1', minWidth: '0' }}>
                      <span style={css(n.tagStyle)}>
                        {n.tag}
                      </span>
                      <p style={css(n.titleStyle)}>
                        {n.title}
                      </p>
                      <p style={{ margin: '5px 0 0', fontSize: '11.5px', color: '#9AA7BC' }}>
                        {n.time}
                      </p>
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </aside>
        <footer style={{ marginTop: 'auto', padding: '26px 28px 34px', borderTop: '1px solid #E6EAF2', background: '#FFFFFF' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '13px', color: '#46536A', fontWeight: '600' }}>
                {v.lojaNome}
              </span>
              <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                {v.lojaEmail}
              </span>
              <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                {v.lojaTelefone}
              </span>
              <a href={v.hrefPolitica} style={{ fontSize: '13px' }}>
                Política de privacidade
              </a>
            </div>
            <span style={{ fontSize: '12px', color: '#9AA7BC' }}>
              Tecnologia Photoon
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}
