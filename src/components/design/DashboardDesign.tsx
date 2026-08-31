// Gerado por tools/dc2tsx.py a partir de Dashboard.dc.html
// Transliteração fiel do design: não editar à mão, editar o .dc.html.
'use client';

import { css } from '@/lib/css';

export const CSS_PSEUDO = `
.dc1:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc2:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc3:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc4:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc5:hover { background: #FFFFFF; color: #2563EB; }
.dc6:hover { background: #FFFFFF; color: #2563EB; }
.dc7:hover { background: #FFFFFF; color: #2563EB; }
.dc8:hover { background: #F8FAFE; }
.dc9:hover { background: #FFE4E9; }
.dc10:hover { background: #FCE9CE; }
.dc11:hover { background: #E7EEFB; }
.dc12:hover { background: #EAF0FF; border-color: #D6E2FC; }
.dc13:hover { background: #E4F8FC; border-color: #CBEEF6; }
.dc14:hover { background: #E6F8F1; border-color: #CDEEDF; }
.dc15:hover { background: #EDEBFE; border-color: #DDD9FB; }
`;

export default function DashboardDesign({ v }: { v: any }) {
  return (
    <>
      <div style={{ padding: '26px 30px 60px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'riseIn .5s cubic-bezier(.2,.8,.2,1) both' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '26px', padding: '28px 30px', background: 'linear-gradient(120deg,#0B1220 0%,#17306B 52%,#0E6E86 100%)', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '28px', flexWrap: 'wrap' }}>
          <div style={{ position: 'absolute', right: '-60px', top: '-70px', width: '260px', height: '260px', borderRadius: '999px', background: 'radial-gradient(circle at 30% 30%, rgba(6,182,212,.55), rgba(6,182,212,0) 70%)' }}>
          </div>
          <div style={{ position: 'absolute', right: '130px', bottom: '-110px', width: '240px', height: '240px', borderRadius: '999px', background: 'radial-gradient(circle at 50% 50%, rgba(37,99,235,.45), rgba(37,99,235,0) 70%)' }}>
          </div>
          <div style={{ position: 'relative', flex: '1', minWidth: '320px' }}>
            <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '1.8px', textTransform: 'uppercase', color: 'rgba(255,255,255,.6)' }}>
              {v.agora}
            </p>
            <h1 style={{ margin: '0 0 10px', fontSize: '32px', lineHeight: '1.15', fontWeight: '800', letterSpacing: '-.8px' }}>
              {v.saudacao}
            </h1>
            <p style={{ margin: '0', fontSize: '15px', lineHeight: '1.6', color: 'rgba(255,255,255,.78)', maxWidth: '620px' }}>
              {v.resumoHero}
            </p>
          </div>
          <div style={{ position: 'relative', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ minWidth: '132px', padding: '16px 18px', borderRadius: '18px', background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.18)', backdropFilter: 'blur(6px)' }}>
              <p style={{ margin: '0 0 6px', fontSize: '12px', color: 'rgba(255,255,255,.7)' }}>
                {v.kpiHeroA.rotulo}
              </p>
              <p style={{ margin: '0', fontSize: '26px', fontWeight: '800' }}>
                {v.kpiHeroA.valor}
              </p>
            </div>
            <div style={{ minWidth: '132px', padding: '16px 18px', borderRadius: '18px', background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.18)', backdropFilter: 'blur(6px)' }}>
              <p style={{ margin: '0 0 6px', fontSize: '12px', color: 'rgba(255,255,255,.7)' }}>
                {v.kpiHeroB.rotulo}
              </p>
              <p style={{ margin: '0', fontSize: '26px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {v.kpiHeroB.valor}
                <span style={{ width: '8px', height: '8px', borderRadius: '999px', background: '#22D3EE', animation: 'pulseDot 1.8s ease-in-out infinite' }}>
                </span>
              </p>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc1">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                {v.kpi1.rotulo}
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EAF0FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 17.5 9.5 12l3.5 3.2L20 7" />
                  <path d="M15.5 7H20v4.5" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              {v.kpi1.valor}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '11.5px', fontWeight: '700' }}>
                {v.kpi1.nota}
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 21 12 17 24 19 36 11 48 14 60 6 72 3 80 5" stroke="#2563EB" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc2">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                {v.kpi2.rotulo}
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#E4F8FC', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 8h16l-1.2 11.2a2 2 0 0 1-2 1.8H7.2a2 2 0 0 1-2-1.8z" />
                  <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              {v.kpi2.valor}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '11.5px', fontWeight: '700' }}>
                {v.kpi2.nota}
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 18 12 20 24 13 36 15 48 9 60 12 72 5 80 7" stroke="#06B6D4" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc3">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                {v.kpi3.rotulo}
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EDEBFE', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4v16M8.5 8.2c0-1.6 1.6-2.4 3.5-2.4s3.5.9 3.5 2.6c0 3.6-7 2.2-7 5.6 0 1.8 1.7 2.7 3.5 2.7s3.5-.8 3.5-2.4" />
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
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc4">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                {v.kpi4.rotulo}
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#E6F8F1', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M12 7.5v5l3 2" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              {v.kpi4.valor}
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '11.5px', fontWeight: '700' }}>
                {v.kpi4.nota}
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
                    {v.graficoTitulo}
                  </h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12.5px', color: '#6B7A90' }}>
                      <span style={{ width: '9px', height: '9px', borderRadius: '3px', background: '#2563EB' }}>
                      </span>
                      {v.serieA}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12.5px', color: '#6B7A90' }}>
                      <span style={{ width: '9px', height: '9px', borderRadius: '3px', background: '#06B6D4' }}>
                      </span>
                      Pedidos
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '4px', padding: '5px', background: '#F4F7FC', border: '1px solid #E6EAF2', borderRadius: '999px', flexWrap: 'wrap' }}>
                  <span onClick={v.setP0} style={css(v.per0)} className="dc5">
                    7 dias
                  </span>
                  <span onClick={v.setP1} style={css(v.per1)} className="dc6">
                    30 dias
                  </span>
                  <span onClick={v.setP2} style={css(v.per2)} className="dc7">
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
                <path d={v.linhaA} fill="none" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1600" style={{ animation: 'drawLine 1.4s ease-out both' }} />
                <path d="M0 182 58 172 116 176 175 152 233 162 291 138 350 146 408 126 466 136 525 112 583 122 641 100 700 106 V210 H0 Z" fill="url(#fillB)" />
                <path d={v.linhaB} fill="none" stroke="#06B6D4" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1600" style={{ animation: 'drawLine 1.6s .1s ease-out both' }} />
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
              <div className="ph-tab-cab" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr .8fr .9fr auto', gap: '16px', alignItems: 'center', padding: '10px 26px', borderBottom: '1px solid #EEF1F7', background: '#FBFCFE' }}>
                <span style={{ fontSize: '11px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
                  Álbum
                </span>
                <span style={{ fontSize: '11px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
                  Andamento
                </span>
                <span style={{ fontSize: '11px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
                  Lâminas
                </span>
                <span style={{ fontSize: '11px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
                  Estado
                </span>
                <span style={{ fontSize: '11px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
                  Atualizado
                </span>
              </div>
              <div style={css(v.recentesVazio)}>
                Nenhum álbum ainda. Cadastre um cliente e libere as fotos para o primeiro aparecer aqui.
              </div>
              {v.recentes.map((rc: any, i5: number) => (
                <div key={i5} onClick={rc.abrir} data-ph-linha style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr .8fr .9fr auto', gap: '16px', alignItems: 'center', padding: '14px 26px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc8">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '0' }}>
                    <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EAF0FF', color: '#2563EB', fontSize: '12.5px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                      {rc.iniciais}
                    </span>
                    <div style={{ minWidth: '0' }}>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: '600' }}>
                        {rc.titulo}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                        {rc.cliente}
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: '13.5px', color: '#34405A' }}>
                    {rc.progresso}
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                    {rc.laminas}
                  </span>
                  <span style={css(rc.selo)}>
                    {rc.estado}
                  </span>
                  <span style={{ fontSize: '12.5px', color: '#6B7A90' }}>
                    {rc.quando}
                  </span>
                </div>
              ))}
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
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', borderRadius: '16px', background: '#FFF1F3', cursor: 'pointer' }} className="dc9">
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
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', borderRadius: '16px', background: '#FEF3E2', cursor: 'pointer' }} className="dc10">
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
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', borderRadius: '16px', background: '#F1F5FD', cursor: 'pointer' }} className="dc11">
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', padding: '14px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc12">
                  <span style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#EAF0FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                  <span style={{ fontSize: '13px', fontWeight: '600' }}>
                    Novo produto
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', padding: '14px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc13">
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', padding: '14px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc14">
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', padding: '14px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7', cursor: 'pointer' }} className="dc15">
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
    </>
  );
}
