// Gerado por tools/dc2tsx.py a partir de Catalogo.dc.html
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
.dc14:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc15:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc16:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc17:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc18:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
.dc19:hover { box-shadow: 0 14px 30px rgba(11,18,32,.09); transform: translateY(-2px); }
`;

export default function CatalogoDesign({ v }: { v: any }) {
  return (
    <>
      <div style={{ padding: '26px 30px 60px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'riseIn .5s cubic-bezier(.2,.8,.2,1) both' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '1.6px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
              Loja e catálogo · Catálogo
            </p>
            <h1 style={{ margin: '0 0 8px', fontSize: '30px', fontWeight: '800', letterSpacing: '-1px' }}>
              Catálogo
            </h1>
            <p style={{ margin: '0', fontSize: '14.5px', color: '#6B7A90' }}>
              184 produtos publicados · 12 rascunhos · 6 categorias ativas
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} className="dc1">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4v11M8 11l4 4 4-4" />
                <path d="M4 19h16" />
              </svg>
              Importar CSV
            </button>
            <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} className="dc2">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M7 12h10M10 18h4" />
              </svg>
              Filtros
            </button>
            <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '0', borderRadius: '14px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(37,99,235,.28)' }} className="dc3">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Novo produto
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '16px' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc4">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                Produtos publicados
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EAF0FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 7.5 12 3.5l8 4v9L12 20.5l-8-4z" />
                  <path d="m4 7.5 8 4 8-4M12 11.5v9" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              184
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#EAF0FF', color: '#2563EB', fontSize: '11.5px', fontWeight: '700' }}>
                +9 este mês
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 21 12 17 24 19 36 11 48 14 60 6 72 3 80 5" stroke="#2563EB" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc5">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                Fotoprodutos
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#E4F8FC', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="16" rx="4" />
                  <path d="m3.5 16 4.6-4.2 4 3.4 3.4-3 5 4.4" />
                  <circle cx="8.6" cy="8.8" r="1.5" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              46
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#E4F8FC', color: '#0891B2', fontSize: '11.5px', fontWeight: '700' }}>
                canecas, quadros, calendários
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 18 12 20 24 13 36 15 48 9 60 12 72 5 80 7" stroke="#06B6D4" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc6">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                Tabelas de preço
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EDEBFE', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 11.5V5h6.5L20 14.5 13.5 21z" />
                  <circle cx="8" cy="8.5" r="1.4" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              7
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#EDEBFE', color: '#6366F1', fontSize: '11.5px', fontWeight: '700' }}>
                B2B, B2C e revenda
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 20 12 16 24 18 36 12 48 13 60 8 72 6 80 4" stroke="#6366F1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc7">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                Sem estoque
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#FEF3E2', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8v5M12 16.5h.01" />
                  <circle cx="12" cy="12" r="8.5" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              5
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '11.5px', fontWeight: '700' }}>
                repor até sexta
              </span>
              <svg viewBox="0 0 80 26" width="80" height="26" fill="none" style={{ flex: '0 0 auto' }}>
                <path d="M0 8 12 6 24 11 36 9 48 14 60 12 72 17 80 16" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow .18s, transform .18s' }} className="dc8">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: '#6B7A90', fontWeight: '500' }}>
                Mais vendido
              </span>
              <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#E6F8F1', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 4 2.3 4.9 5.2.7-3.8 3.7 1 5.3-4.7-2.6-4.7 2.6 1-5.3L4.5 9.6l5.2-.7z" />
                </svg>
              </span>
            </div>
            <span style={{ fontSize: '29px', fontWeight: '800', letterSpacing: '-1px' }}>
              Fotolivro 30×30
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ padding: '4px 9px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '11.5px', fontWeight: '700' }}>
                312 pedidos no mês
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
              Todos
            </span>
            <span onClick={v.setP1} style={css(v.per1)} className="dc10">
              Revelação
            </span>
            <span onClick={v.setP2} style={css(v.per2)} className="dc11">
              Fotolivros
            </span>
            <span onClick={v.setP3} style={css(v.per3)} className="dc12">
              Fotoprodutos
            </span>
            <span onClick={v.setP4} style={css(v.per4)} className="dc13">
              Opcionais
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#F1F5FD', color: '#46536A', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
              12 rascunhos
            </span>
            <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
              5 sem estoque
            </span>
          </div>
        </div>
        <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
            <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
              Produtos
            </h2>
            <a href="#" style={{ fontSize: '13px', fontWeight: '700' }}>
              Gerenciar categorias
            </a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '16px' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'box-shadow .18s, transform .18s' }} className="dc14">
              <div style={{ height: '148px', background: '#F1F5FD' }}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: "12px", color: "#9AA7BC" }}>Foto do produto</span>
              </div>
              <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ minWidth: '0' }}>
                    <p style={{ margin: '0', fontSize: '14.5px', fontWeight: '700' }}>
                      Fotolivro 30×30 capa dura
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                      SKU-FL3030 · Fotolivros
                    </p>
                  </div>
                  <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                    Publicado
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #F4F6FB' }}>
                  <span style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '-.5px' }}>
                    R$ 980
                  </span>
                  <span style={{ fontSize: '12.5px', color: '#6B7A90' }}>
                    48 páginas base
                  </span>
                </div>
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'box-shadow .18s, transform .18s' }} className="dc15">
              <div style={{ height: '148px', background: '#F1F5FD' }}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: "12px", color: "#9AA7BC" }}>Foto do produto</span>
              </div>
              <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ minWidth: '0' }}>
                    <p style={{ margin: '0', fontSize: '14.5px', fontWeight: '700' }}>
                      Revelação 15×21 brilho
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                      SKU-RV1521 · Revelação
                    </p>
                  </div>
                  <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                    Publicado
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #F4F6FB' }}>
                  <span style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '-.5px' }}>
                    R$ 2,00 /un
                  </span>
                  <span style={{ fontSize: '12.5px', color: '#6B7A90' }}>
                    estoque alto
                  </span>
                </div>
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'box-shadow .18s, transform .18s' }} className="dc16">
              <div style={{ height: '148px', background: '#F1F5FD' }}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: "12px", color: "#9AA7BC" }}>Foto do produto</span>
              </div>
              <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ minWidth: '0' }}>
                    <p style={{ margin: '0', fontSize: '14.5px', fontWeight: '700' }}>
                      Quadro canvas 40×60
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                      SKU-QC4060 · Fotoprodutos
                    </p>
                  </div>
                  <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                    Publicado
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #F4F6FB' }}>
                  <span style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '-.5px' }}>
                    R$ 289
                  </span>
                  <span style={{ fontSize: '12.5px', color: '#6B7A90' }}>
                    12 un em estoque
                  </span>
                </div>
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'box-shadow .18s, transform .18s' }} className="dc17">
              <div style={{ height: '148px', background: '#F1F5FD' }}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: "12px", color: "#9AA7BC" }}>Foto do produto</span>
              </div>
              <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ minWidth: '0' }}>
                    <p style={{ margin: '0', fontSize: '14.5px', fontWeight: '700' }}>
                      Caneca mágica 325 ml
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                      SKU-CN325 · Fotoprodutos
                    </p>
                  </div>
                  <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                    Pausado
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #F4F6FB' }}>
                  <span style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '-.5px' }}>
                    R$ 79
                  </span>
                  <span style={{ fontSize: '12.5px', color: '#6B7A90' }}>
                    sem estoque
                  </span>
                </div>
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'box-shadow .18s, transform .18s' }} className="dc18">
              <div style={{ height: '148px', background: '#F1F5FD' }}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: "12px", color: "#9AA7BC" }}>Foto do produto</span>
              </div>
              <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ minWidth: '0' }}>
                    <p style={{ margin: '0', fontSize: '14.5px', fontWeight: '700' }}>
                      Álbum formatura + estojo
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                      SKU-AF2020 · Álbuns
                    </p>
                  </div>
                  <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#F1F5FD', color: '#46536A', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                    Rascunho
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #F4F6FB' }}>
                  <span style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '-.5px' }}>
                    R$ 2.410
                  </span>
                  <span style={{ fontSize: '12.5px', color: '#6B7A90' }}>
                    sob encomenda
                  </span>
                </div>
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column', cursor: 'pointer', transition: 'box-shadow .18s, transform .18s' }} className="dc19">
              <div style={{ height: '148px', background: '#F1F5FD' }}>
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: "12px", color: "#9AA7BC" }}>Foto do produto</span>
              </div>
              <div style={{ padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ minWidth: '0' }}>
                    <p style={{ margin: '0', fontSize: '14.5px', fontWeight: '700' }}>
                      Calendário de mesa 2027
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                      SKU-CL2027 · Fotoprodutos
                    </p>
                  </div>
                  <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#F1F5FD', color: '#46536A', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                    Rascunho
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #F4F6FB' }}>
                  <span style={{ fontSize: '16px', fontWeight: '800', letterSpacing: '-.5px' }}>
                    R$ 59
                  </span>
                  <span style={{ fontSize: '12.5px', color: '#6B7A90' }}>
                    pré-venda
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', alignItems: 'start' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
              <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                Tabelas de preço
              </h2>
              <a href="#" style={{ fontSize: '13px', fontWeight: '700' }}>
                Nova tabela
              </a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7' }}>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                    B2B Ouro
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                    38 clientes · -18% sobre B2C
                  </p>
                </div>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                  vigente
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7' }}>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                    B2C loja
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                    preço cheio · todos os canais
                  </p>
                </div>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                  vigente
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7' }}>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                    Formatura 2027
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                    vigência a partir de 1 set
                  </p>
                </div>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#EDEBFE', color: '#6366F1', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                  agendada
                </span>
              </div>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 26px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '16px' }}>
              <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                Temas e templates
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7' }}>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                    Casamento clássico
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                    24 spreads · sangria 3 mm
                  </p>
                </div>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                  publicado
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7' }}>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                    Formatura moderna
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                    18 spreads · variáveis de turma
                  </p>
                </div>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                  em revisão
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7' }}>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                    Newborn suave
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                    12 spreads · máscaras redondas
                  </p>
                </div>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#F1F5FD', color: '#46536A', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                  rascunho
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
