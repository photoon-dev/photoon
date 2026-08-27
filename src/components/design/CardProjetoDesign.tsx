// Card de álbum, markup extraído de Cliente Meus projetos.dc.html.
// Gerado por tools/dc2tsx.py e parametrizado; os estilos são os do design.
'use client';

export type DadosCard = {
  titulo: string;
  produto: string;
  statusRotulo: string;
  statusBg: string;
  statusCor: string;
  progresso: number;
  fotos: string;
  aviso: string;
  acao: string;
  capa?: string;
  hrefEditar: string;
  hrefVer: string;
};

export default function CardProjetoDesign({ p }: { p: DadosCard }) {
  return (
    <>
      <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '14px', overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'box-shadow .18s, transform .18s' }} className="dc1">
        <div style={{ position: 'relative', height: '150px', background: p.capa ? `center / cover no-repeat url(${p.capa})` : 'linear-gradient(140deg,#7C3AED,#2563EB)', overflow: 'hidden' }}>
          {!p.capa && (
          <div style={{ position: 'absolute', inset: '0', display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: '1fr 1fr', gap: '3px', padding: '3px', opacity: '.92' }}>
            <span style={{ gridRow: 'span 2', background: 'rgba(255,255,255,.26)', borderRadius: '4px' }}>
            </span>
            <span style={{ background: 'rgba(255,255,255,.2)', borderRadius: '4px' }}>
            </span>
            <span style={{ background: 'rgba(255,255,255,.14)', borderRadius: '4px' }}>
            </span>
          </div>)}
        </div>
        <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px', flex: '1' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ minWidth: '0' }}>
              <p style={{ margin: '0', fontSize: '15.5px', fontWeight: '700', letterSpacing: '-.2px' }}>
                {p.titulo}
              </p>
              <p style={{ margin: '4px 0 0', fontSize: '12.5px', color: '#9AA7BC' }}>
                {p.produto}
              </p>
            </div>
            <span style={{ width: '32px', height: '32px', borderRadius: '10px', border: '1px solid #E6EAF2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9AA7BC', cursor: 'pointer', flex: '0 0 auto' }} className="dc2">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="6" r="1.4" />
                <circle cx="12" cy="12" r="1.4" />
                <circle cx="12" cy="18" r="1.4" />
              </svg>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <span style={{ whiteSpace: 'nowrap', padding: '5px 11px', borderRadius: '999px', background: p.statusBg, color: p.statusCor, fontSize: '12px', fontWeight: '700' }}>
              {p.statusRotulo}
            </span>
            <span style={{ fontSize: '12.5px', fontWeight: '700', color: '#46536A' }}>
              {p.progresso}%
            </span>
          </div>
          <div style={{ height: '6px', borderRadius: '999px', background: '#EEF1F7' }}>
            <div style={{ width: `${p.progresso}%`, height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg,#2563EB,#06B6D4)' }}>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12.5px', color: '#6B7A90' }}>
              <span style={{ color: '#9AA7BC', display: 'flex' }}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="3.5" />
                  <circle cx="9" cy="11" r="1.6" />
                  <path d="m4 18 5-4.4 3.4 3 3-2.6L20 18" />
                </svg>
              </span>
              {p.fotos}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12.5px', color: '#6B7A90' }}>
              <span style={{ color: '#9AA7BC', display: 'flex' }}>
                <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M12 8v5M12 16.5h.01" />
                </svg>
              </span>
              {p.aviso}
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', paddingTop: '4px' }}>
            <a href={p.hrefEditar} style={{ flex: '1', minWidth: '0', height: '44px', padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid transparent', borderRadius: '12px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#FFFFFF', fontSize: '13.5px', fontWeight: '700', whiteSpace: 'nowrap' }} className="dc3">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="8.5" />
                <path d="M12 8v5M12 16.5h.01" />
              </svg>
              {p.acao}
            </a>
            <a href={p.hrefVer} style={{ flex: '1', minWidth: '0', height: '44px', padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', border: '1px solid #E6EAF2', borderRadius: '12px', background: '#FFFFFF', color: '#0B1220', fontSize: '13.5px', fontWeight: '600', whiteSpace: 'nowrap' }} className="dc4">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z" />
                <circle cx="12" cy="12" r="2.8" />
              </svg>
              Visualizar
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
