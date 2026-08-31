// Gerado por tools/dc2tsx.py a partir de Clientes.dc.html
// Transliteração fiel do design: não editar à mão, editar o .dc.html.
'use client';

import { css } from '@/lib/css';

export const CSS_PSEUDO = `
.dc1:hover { background: #F1F5FD; border-color: #D6E2FC; color: #2563EB; }
.dc2:hover { background: #F1F5FD; border-color: #D6E2FC; color: #2563EB; }
.dc3:hover { filter: brightness(1.06); }
.dc4:hover { background: #F8FAFE; color: #2563EB; }
.dc5:hover { background: #F8FAFE; color: #2563EB; }
.dc6:hover { background: #F8FAFE; color: #2563EB; }
.dc7:hover { background: #F8FAFE; color: #2563EB; }
.dc8:hover { background: #F8FAFE; color: #2563EB; }
.dc9:hover { background: #F8FAFE; color: #2563EB; }
.dc10:hover { background: #F8FAFE; color: #2563EB; }
.dc11:hover { background: #F8FAFE; color: #2563EB; }
.dc12:hover { background: #F8FAFE; color: #2563EB; }
.dc13:hover { background: #F8FAFE; color: #2563EB; }
.dc14:hover { border-color: #2563EB; color: #2563EB; }
.dc15:hover { border-color: #2563EB; color: #2563EB; }
.dc16:hover { background: #F8FAFE; }
.dc17:hover { background: #F8FAFE; }
.dc18:hover { background: #F8FAFE; }
.dc19:hover { background: #F8FAFE; }
.dc20:hover { background: #F8FAFE; }
.dc21:hover { background: #F8FAFE; }
.dc22:hover { background: #F8FAFE; }
.dc23:hover { background: #F1F5FD; color: #2563EB; }
.dc24:hover { background: #2563EB; }
`;

export default function ClientesDesign({ v }: { v: any }) {
  return (
    <>
      <div style={{ padding: '26px 30px 60px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'riseIn .5s cubic-bezier(.2,.8,.2,1) both' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '1.6px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
              Comercial · Clientes
            </p>
            <h1 style={{ margin: '0 0 8px', fontSize: '30px', fontWeight: '800', letterSpacing: '-1px' }}>
              Base de clientes
            </h1>
            <p style={{ margin: '0', fontSize: '14.5px', color: '#6B7A90' }}>
              1 842 clientes · 38 com saldo em carteira · LTV médio R$ 2.410 · 7 sem compra há 90 dias
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
              Criar segmento
            </button>
            <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '0', borderRadius: '14px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(37,99,235,.28)' }} className="dc3">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Novo cliente
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', alignItems: 'start' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '16px' }}>
            <p style={{ margin: '0 0 10px', padding: '0 4px', fontSize: '11.5px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
              Segmentos
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 13px', borderRadius: '13px', cursor: 'pointer', background: '#F1F5FD', color: '#2563EB', fontWeight: '700', fontSize: '13.5px' }} className="dc4">
                <span style={{ flex: '1', minWidth: '0' }}>
                  Todos os clientes
                </span>
                <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#2563EB' }}>
                  1 842
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 13px', borderRadius: '13px', cursor: 'pointer', background: 'transparent', color: '#46536A', fontWeight: '500', fontSize: '13.5px' }} className="dc5">
                <span style={{ flex: '1', minWidth: '0' }}>
                  Fotógrafos B2B
                </span>
                <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#9AA7BC' }}>
                  286
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 13px', borderRadius: '13px', cursor: 'pointer', background: 'transparent', color: '#46536A', fontWeight: '500', fontSize: '13.5px' }} className="dc6">
                <span style={{ flex: '1', minWidth: '0' }}>
                  Escolas e formaturas
                </span>
                <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#9AA7BC' }}>
                  64
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 13px', borderRadius: '13px', cursor: 'pointer', background: 'transparent', color: '#46536A', fontWeight: '500', fontSize: '13.5px' }} className="dc7">
                <span style={{ flex: '1', minWidth: '0' }}>
                  Consumidor final
                </span>
                <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#9AA7BC' }}>
                  1 492
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 13px', borderRadius: '13px', cursor: 'pointer', background: 'transparent', color: '#46536A', fontWeight: '500', fontSize: '13.5px' }} className="dc8">
                <span style={{ flex: '1', minWidth: '0' }}>
                  Com saldo em carteira
                </span>
                <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#9AA7BC' }}>
                  38
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 13px', borderRadius: '13px', cursor: 'pointer', background: 'transparent', color: '#46536A', fontWeight: '500', fontSize: '13.5px' }} className="dc9">
                <span style={{ flex: '1', minWidth: '0' }}>
                  Inativos há 90 dias
                </span>
                <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#9AA7BC' }}>
                  7
                </span>
              </div>
            </div>
            <p style={{ margin: '0 0 10px', padding: '0 4px', fontSize: '11.5px', letterSpacing: '1.2px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
              Grupos de preço
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 13px', borderRadius: '13px', cursor: 'pointer', background: 'transparent', color: '#46536A', fontWeight: '500', fontSize: '13.5px' }} className="dc10">
                <span style={{ flex: '1', minWidth: '0' }}>
                  B2B Ouro
                </span>
                <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#9AA7BC' }}>
                  42
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 13px', borderRadius: '13px', cursor: 'pointer', background: 'transparent', color: '#46536A', fontWeight: '500', fontSize: '13.5px' }} className="dc11">
                <span style={{ flex: '1', minWidth: '0' }}>
                  B2B Prata
                </span>
                <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#9AA7BC' }}>
                  118
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 13px', borderRadius: '13px', cursor: 'pointer', background: 'transparent', color: '#46536A', fontWeight: '500', fontSize: '13.5px' }} className="dc12">
                <span style={{ flex: '1', minWidth: '0' }}>
                  Eventos
                </span>
                <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#9AA7BC' }}>
                  64
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 13px', borderRadius: '13px', cursor: 'pointer', background: 'transparent', color: '#46536A', fontWeight: '500', fontSize: '13.5px' }} className="dc13">
                <span style={{ flex: '1', minWidth: '0' }}>
                  B2C padrão
                </span>
                <span style={{ fontSize: '11.5px', fontWeight: '700', color: '#9AA7BC' }}>
                  1 492
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '0', gridColumn: 'span 3' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '18px 24px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', height: '42px', padding: '0 15px', border: '1px solid #E6EAF2', borderRadius: '14px', flex: '1', minWidth: '220px', maxWidth: '380px' }}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#9AA7BC" strokeWidth="1.9" strokeLinecap="round">
                    <circle cx="11" cy="11" r="6.5" />
                    <path d="m16 16 4.5 4.5" />
                  </svg>
                  <input placeholder="Buscar por nome, CNPJ ou e-mail" style={{ flex: '1', minWidth: '0', border: '0', background: 'transparent', fontFamily: 'inherit', fontSize: '13.5px', color: '#0B1220' }} />
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '999px', background: '#F4F7FC', border: '1px solid #E6EAF2', fontSize: '12.5px', fontWeight: '600', color: '#46536A', cursor: 'pointer' }} className="dc14">
                    Grupo: todos
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '999px', background: '#F4F7FC', border: '1px solid #E6EAF2', fontSize: '12.5px', fontWeight: '600', color: '#46536A', cursor: 'pointer' }} className="dc15">
                    Vendedor: todos
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '999px', background: '#F1F5FD', border: '1px solid #D6E2FC', fontSize: '12.5px', fontWeight: '700', color: '#2563EB', cursor: 'pointer' }}>
                    Ordenar por LTV
                  </span>
                </div>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,1.6fr) minmax(130px,1fr) minmax(80px,.6fr) minmax(120px,.9fr) minmax(110px,.8fr) minmax(130px,.9fr) minmax(110px,.7fr)', gap: '14px', padding: '10px 24px', background: '#F8FAFE', borderTop: '1px solid #EEF1F7', borderBottom: '1px solid #EEF1F7', fontSize: '11.5px', letterSpacing: '.6px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
                  <span>
                    Cliente
                  </span>
                  <span>
                    Grupo
                  </span>
                  <span>
                    Pedidos
                  </span>
                  <span>
                    LTV
                  </span>
                  <span>
                    Carteira
                  </span>
                  <span>
                    Vendedor
                  </span>
                  <span>
                    Status
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,1.6fr) minmax(130px,1fr) minmax(80px,.6fr) minmax(120px,.9fr) minmax(110px,.8fr) minmax(130px,.9fr) minmax(110px,.7fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc16">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '0' }}>
                    <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EAF0FF', color: '#2563EB', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                      SL
                    </span>
                    <div style={{ minWidth: '0' }}>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Studio Fotográfico Lume
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                        CNPJ 18.442.110/0001-22
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', color: '#34405A' }}>
                    B2B Ouro
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                    62
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                    R$ 48.200
                  </span>
                  <span style={{ fontSize: '13px', color: '#059669', fontWeight: '600' }}>
                    R$ 2.480
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                    Ana Lopes
                  </span>
                  <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                    Ativo
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,1.6fr) minmax(130px,1fr) minmax(80px,.6fr) minmax(120px,.9fr) minmax(110px,.8fr) minmax(130px,.9fr) minmax(110px,.7fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc17">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '0' }}>
                    <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EDEBFE', color: '#6366F1', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                      MB
                    </span>
                    <div style={{ minWidth: '0' }}>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Memória Books
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                        CNPJ 22.108.554/0001-90
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', color: '#34405A' }}>
                    B2B Ouro
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                    48
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                    R$ 39.400
                  </span>
                  <span style={{ fontSize: '13px', color: '#059669', fontWeight: '600' }}>
                    R$ 3.120
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                    Ana Lopes
                  </span>
                  <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                    Ativo
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,1.6fr) minmax(130px,1fr) minmax(80px,.6fr) minmax(120px,.9fr) minmax(110px,.8fr) minmax(130px,.9fr) minmax(110px,.7fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc18">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '0' }}>
                    <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#E4F8FC', color: '#0891B2', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                      CF
                    </span>
                    <div style={{ minWidth: '0' }}>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Colégio Farol
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                        CNPJ 09.884.220/0001-14
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', color: '#34405A' }}>
                    Eventos
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                    9
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                    R$ 28.900
                  </span>
                  <span style={{ fontSize: '13px', color: '#059669', fontWeight: '600' }}>
                    R$ 1.740
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                    Bruno Sá
                  </span>
                  <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                    Ativo
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,1.6fr) minmax(130px,1fr) minmax(80px,.6fr) minmax(120px,.9fr) minmax(110px,.8fr) minmax(130px,.9fr) minmax(110px,.7fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc19">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '0' }}>
                    <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                      LV
                    </span>
                    <div style={{ minWidth: '0' }}>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Luz Viva Estúdio
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                        CNPJ 31.552.088/0001-05
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', color: '#34405A' }}>
                    B2B Prata
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                    22
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                    R$ 14.600
                  </span>
                  <span style={{ fontSize: '13px', color: '#059669', fontWeight: '600' }}>
                    R$ 980
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                    Bruno Sá
                  </span>
                  <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                    Ativo
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,1.6fr) minmax(130px,1fr) minmax(80px,.6fr) minmax(120px,.9fr) minmax(110px,.8fr) minmax(130px,.9fr) minmax(110px,.7fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc20">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '0' }}>
                    <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#FEF3E2', color: '#B45309', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                      FT
                    </span>
                    <div style={{ minWidth: '0' }}>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Foto Trindade
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                        CNPJ 12.998.441/0001-70
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', color: '#34405A' }}>
                    B2B Prata
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                    31
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                    R$ 11.240
                  </span>
                  <span style={{ fontSize: '13px', color: '#9AA7BC', fontWeight: '400' }}>
                    —
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                    Diego Martins
                  </span>
                  <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#FFF1F3', color: '#E11D48', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                    Inadimplente
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,1.6fr) minmax(130px,1fr) minmax(80px,.6fr) minmax(120px,.9fr) minmax(110px,.8fr) minmax(130px,.9fr) minmax(110px,.7fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc21">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '0' }}>
                    <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#F1F5FD', color: '#46536A', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                      AP
                    </span>
                    <div style={{ minWidth: '0' }}>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Ana Paula Moreira
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                        CPF 224.118.990-31
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', color: '#34405A' }}>
                    B2C padrão
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                    4
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                    R$ 486
                  </span>
                  <span style={{ fontSize: '13px', color: '#9AA7BC', fontWeight: '400' }}>
                    —
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                    Balcão
                  </span>
                  <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                    Ativo
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,1.6fr) minmax(130px,1fr) minmax(80px,.6fr) minmax(120px,.9fr) minmax(110px,.8fr) minmax(130px,.9fr) minmax(110px,.7fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc22">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '0' }}>
                    <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#FFF1F3', color: '#E11D48', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                      RN
                    </span>
                    <div style={{ minWidth: '0' }}>
                      <p style={{ margin: '0', fontSize: '14px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        Rita Nunes
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                        CPF 118.442.221-08
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', color: '#34405A' }}>
                    B2C padrão
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                    4
                  </span>
                  <span style={{ fontSize: '13.5px', fontWeight: '700' }}>
                    R$ 1.148
                  </span>
                  <span style={{ fontSize: '13px', color: '#9AA7BC', fontWeight: '400' }}>
                    —
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                    Balcão
                  </span>
                  <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '12px', fontWeight: '600', width: 'max-content' }}>
                    Suporte aberto
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '16px 24px', background: '#F8FAFE' }}>
                  <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                    Mostrando 7 de 1 842 clientes
                  </span>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{ width: '34px', height: '34px', borderRadius: '12px', border: '1px solid #E6EAF2', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9AA7BC', cursor: 'pointer' }}>
                      ‹
                    </span>
                    <span style={{ width: '34px', height: '34px', borderRadius: '12px', background: '#2563EB', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '700' }}>
                      1
                    </span>
                    <span style={{ width: '34px', height: '34px', borderRadius: '12px', border: '1px solid #E6EAF2', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#46536A', cursor: 'pointer' }}>
                      2
                    </span>
                    <span style={{ width: '34px', height: '34px', borderRadius: '12px', border: '1px solid #E6EAF2', background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#46536A', cursor: 'pointer' }}>
                      ›
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', padding: '24px 26px', borderBottom: '1px solid #F0F3F9', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '0' }}>
                  <span style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#EAF0FF', color: '#2563EB', fontSize: '17px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                    SL
                  </span>
                  <div style={{ minWidth: '0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      <h2 style={{ margin: '0', fontSize: '20px', fontWeight: '800', letterSpacing: '-.5px' }}>
                        Studio Fotográfico Lume
                      </h2>
                      <span style={{ whiteSpace: 'nowrap', padding: '5px 10px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '11.5px', fontWeight: '700' }}>
                        B2B Ouro
                      </span>
                    </div>
                    <p style={{ margin: '5px 0 0', fontSize: '13px', color: '#6B7A90' }}>
                      Perfil 360 · cliente desde março de 2023 · vendedora Ana Lopes
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button style={{ whiteSpace: 'nowrap', height: '38px', padding: '0 14px', border: '1px solid #E6EAF2', borderRadius: '12px', background: '#FFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }} className="dc23">
                    Adicionar crédito
                  </button>
                  <button style={{ whiteSpace: 'nowrap', height: '38px', padding: '0 14px', border: '0', borderRadius: '12px', background: '#0B1220', color: '#FFF', fontFamily: 'inherit', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }} className="dc24">
                    Novo pedido assistido
                  </button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1px', background: '#F0F3F9' }}>
                <div style={{ background: '#FFFFFF', padding: '18px 24px' }}>
                  <p style={{ margin: '0', fontSize: '12.5px', color: '#6B7A90' }}>
                    LTV
                  </p>
                  <p style={{ margin: '6px 0 0', fontSize: '22px', fontWeight: '800', letterSpacing: '-.6px' }}>
                    R$ 48.200
                  </p>
                </div>
                <div style={{ background: '#FFFFFF', padding: '18px 24px' }}>
                  <p style={{ margin: '0', fontSize: '12.5px', color: '#6B7A90' }}>
                    Pedidos
                  </p>
                  <p style={{ margin: '6px 0 0', fontSize: '22px', fontWeight: '800', letterSpacing: '-.6px' }}>
                    62
                  </p>
                </div>
                <div style={{ background: '#FFFFFF', padding: '18px 24px' }}>
                  <p style={{ margin: '0', fontSize: '12.5px', color: '#6B7A90' }}>
                    Ticket médio
                  </p>
                  <p style={{ margin: '6px 0 0', fontSize: '22px', fontWeight: '800', letterSpacing: '-.6px' }}>
                    R$ 777
                  </p>
                </div>
                <div style={{ background: '#FFFFFF', padding: '18px 24px' }}>
                  <p style={{ margin: '0', fontSize: '12.5px', color: '#6B7A90' }}>
                    Carteira
                  </p>
                  <p style={{ margin: '6px 0 0', fontSize: '22px', fontWeight: '800', letterSpacing: '-.6px', color: '#059669' }}>
                    R$ 2.480
                  </p>
                </div>
                <div style={{ background: '#FFFFFF', padding: '18px 24px' }}>
                  <p style={{ margin: '0', fontSize: '12.5px', color: '#6B7A90' }}>
                    Última compra
                  </p>
                  <p style={{ margin: '6px 0 0', fontSize: '22px', fontWeight: '800', letterSpacing: '-.6px' }}>
                    24 ago
                  </p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px', padding: '24px 26px' }}>
                <div>
                  <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: '700' }}>
                    Cadastro e endereços
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                      <span style={{ color: '#9AA7BC' }}>
                        CNPJ
                      </span>
                      <span>
                        18.442.110/0001-22
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                      <span style={{ color: '#9AA7BC' }}>
                        Contato
                      </span>
                      <span>
                        lume@studio.com
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                      <span style={{ color: '#9AA7BC' }}>
                        Telefone
                      </span>
                      <span>
                        (11) 98844-2210
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                      <span style={{ color: '#9AA7BC' }}>
                        Entrega padrão
                      </span>
                      <span>
                        Retirada · Centro
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                      <span style={{ color: '#9AA7BC' }}>
                        Documentos
                      </span>
                      <span style={{ color: '#059669', fontWeight: '600' }}>
                        CNPJ e IE validados
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: '700' }}>
                    Preços especiais
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 13px', borderRadius: '14px', background: '#F8FAFE', border: '1px solid #EEF1F7' }}>
                      <span style={{ flex: '1', minWidth: '0', fontSize: '13px', fontWeight: '600' }}>
                        Tabela B2B Ouro
                      </span>
                      <span style={{ fontSize: '12.5px', color: '#6B7A90' }}>
                        vigente
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 13px', borderRadius: '14px', background: '#F8FAFE', border: '1px solid #EEF1F7' }}>
                      <span style={{ flex: '1', minWidth: '0', fontSize: '13px', fontWeight: '600' }}>
                        Fotolivro 30×30
                      </span>
                      <span style={{ fontSize: '12.5px', color: '#059669', fontWeight: '700' }}>
                        R$ 930
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 13px', borderRadius: '14px', background: '#F8FAFE', border: '1px solid #EEF1F7' }}>
                      <span style={{ flex: '1', minWidth: '0', fontSize: '13px', fontWeight: '600' }}>
                        Prazo negociado
                      </span>
                      <span style={{ fontSize: '12.5px', color: '#6B7A90' }}>
                        28 dias
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 style={{ margin: '0 0 14px', fontSize: '15px', fontWeight: '700' }}>
                    Linha do tempo
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ width: '9px', height: '9px', borderRadius: '999px', background: '#2563EB', marginTop: '5px', flex: '0 0 auto' }}>
                      </span>
                      <div>
                        <p style={{ margin: '0', fontSize: '13px', fontWeight: '600' }}>
                          Pedido #PT-10482 em produção
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                          hoje 08:32
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ width: '9px', height: '9px', borderRadius: '999px', background: '#10B981', marginTop: '5px', flex: '0 0 auto' }}>
                      </span>
                      <div>
                        <p style={{ margin: '0', fontSize: '13px', fontWeight: '600' }}>
                          PIX de R$ 1.240 confirmado
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                          24 ago 16:45
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ width: '9px', height: '9px', borderRadius: '999px', background: '#6366F1', marginTop: '5px', flex: '0 0 auto' }}>
                      </span>
                      <div>
                        <p style={{ margin: '0', fontSize: '13px', fontWeight: '600' }}>
                          Crédito de R$ 340 aplicado
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                          18 ago · reimpressão
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <span style={{ width: '9px', height: '9px', borderRadius: '999px', background: '#CBD5E6', marginTop: '5px', flex: '0 0 auto' }}>
                      </span>
                      <div>
                        <p style={{ margin: '0', fontSize: '13px', fontWeight: '600' }}>
                          Migrou para tabela Ouro
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                          02 jul · Ana Lopes
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
