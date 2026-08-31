// Gerado por tools/dc2tsx.py a partir de Configuracoes.dc.html
// Transliteração fiel do design: não editar à mão, editar o .dc.html.
'use client';

import { css } from '@/lib/css';

export const CSS_PSEUDO = `
.dc1:hover { background: #F1F5FD; border-color: #D6E2FC; color: #2563EB; }
.dc2:hover { filter: brightness(1.06); }
.dc3:hover { background: #F4F7FC; color: #2563EB; }
.dc4:hover { background: #F4F7FC; color: #2563EB; }
.dc5:hover { background: #F4F7FC; color: #2563EB; }
.dc6:hover { background: #F4F7FC; color: #2563EB; }
.dc7:hover { background: #F4F7FC; color: #2563EB; }
.dc8:hover { background: #F4F7FC; color: #2563EB; }
.dc9:focus, .dc9:focus-within { border-color: #2563EB; }
.dc10:focus, .dc10:focus-within { border-color: #2563EB; }
.dc11:focus, .dc11:focus-within { border-color: #2563EB; }
.dc12:focus, .dc12:focus-within { border-color: #2563EB; }
.dc13:focus, .dc13:focus-within { border-color: #2563EB; }
.dc14:focus, .dc14:focus-within { border-color: #2563EB; }
.dc15:hover { border-color: #D6E2FC; }
.dc16:hover { border-color: #D6E2FC; }
.dc17:hover { border-color: #D6E2FC; }
.dc18:hover { border-color: #D6E2FC; }
.dc19:focus, .dc19:focus-within { border-color: #2563EB; }
.dc20:focus, .dc20:focus-within { border-color: #2563EB; }
.dc21:hover { border-color: #D6E2FC; }
.dc22:hover { background: #E4F8FC; }
.dc23:hover { background: rgba(255,255,255,.1); }
.dc24:hover { border-color: #2563EB; color: #2563EB; background: #F8FAFE; }
.dc25:hover { background: #F8FAFE; border-color: #D6E2FC; }
.dc26:hover { background: #F8FAFE; border-color: #D6E2FC; }
.dc27:hover { background: #F8FAFE; border-color: #D6E2FC; }
.dc28:hover { background: #F8FAFE; border-color: #D6E2FC; }
.dc29:hover { background: #F8FAFE; border-color: #D6E2FC; }
.dc30:hover { background: #F8FAFE; border-color: #D6E2FC; }
`;

export default function ConfiguracoesDesign({ v }: { v: any }) {
  return (
    <>
      <div style={{ padding: '26px 30px 60px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'riseIn .5s cubic-bezier(.2,.8,.2,1) both' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '1.6px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
              Sistema · Configurações
            </p>
            <h1 style={{ margin: '0 0 8px', fontSize: '30px', fontWeight: '800', letterSpacing: '-1px' }}>
              Configurações da empresa
            </h1>
            <p style={{ margin: '0', fontSize: '14.5px', color: '#6B7A90' }}>
              Photoon Studio Ltda · 3 filiais · 12 usuários · plano Pro até 1 set
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} className="dc1">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4v11M8 11l4 4 4-4" />
                <path d="M4 19h16" />
              </svg>
              Histórico de alterações
            </button>
            <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '0', borderRadius: '14px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(37,99,235,.28)' }} className="dc2">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5 10 17.5 19 7" />
              </svg>
              Salvar alterações
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(264px, 1fr))', gap: '20px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '22px', padding: '12px', position: 'sticky', top: '96px' }}>
            <div onClick={v.setP0} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '14px', fontSize: '14px', fontWeight: '700', cursor: 'pointer', background: '#F1F5FD', color: '#2563EB' }} className="dc3">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <path d="M4 20V8l8-4 8 4v12" />
                <path d="M9 20v-6h6v6" />
              </svg>
              <span style={{ flex: '1', minWidth: '0' }}>
                Empresa
              </span>
            </div>
            <div onClick={v.setP1} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '14px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', background: 'transparent', color: '#46536A' }} className="dc4">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <path d="M4 9.5 5.5 4h13L20 9.5" />
                <path d="M4 9.5h16V20H4z" />
                <path d="M9 20v-5h6v5" />
              </svg>
              <span style={{ flex: '1', minWidth: '0' }}>
                Filiais
              </span>
            </div>
            <div onClick={v.setP2} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '14px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', background: 'transparent', color: '#46536A' }} className="dc5">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <circle cx="9" cy="8" r="3.4" />
                <path d="M3.5 19.5c.7-3.2 3-5 5.5-5s4.8 1.8 5.5 5M16.5 6.2a3 3 0 0 1 0 5.6M18.5 19.5c-.3-1.7-.9-3-1.8-3.9" />
              </svg>
              <span style={{ flex: '1', minWidth: '0' }}>
                Equipe e permissões
              </span>
              <span style={{ padding: '2px 8px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '11px', fontWeight: '700' }}>
                2
              </span>
            </div>
            <div onClick={v.setP3} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '14px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', background: 'transparent', color: '#46536A' }} className="dc6">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <circle cx="12" cy="12" r="8.5" />
                <path d="M3.5 12h17M12 3.5c2.4 2.4 2.4 14.6 0 17M12 3.5c-2.4 2.4-2.4 14.6 0 17" />
              </svg>
              <span style={{ flex: '1', minWidth: '0' }}>
                Domínios e SSL
              </span>
            </div>
            <div onClick={v.setP4} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '14px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', background: 'transparent', color: '#46536A' }} className="dc7">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <path d="M14 3v5h5" />
                <path d="M6 3h8l5 5v13H6z" />
              </svg>
              <span style={{ flex: '1', minWidth: '0' }}>
                Fiscal e NF-e
              </span>
            </div>
            <div onClick={v.setP5} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '14px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', background: 'transparent', color: '#46536A' }} className="dc8">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                <circle cx="12" cy="12" r="3.4" />
                <path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4 5.3 5.3" />
              </svg>
              <span style={{ flex: '1', minWidth: '0' }}>
                Preferências
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '0', gridColumn: 'span 3' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '24px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '18px' }}>
                <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                  Dados cadastrais
                </h2>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '12px', fontWeight: '600' }}>
                  CNPJ verificado
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#6B7A90' }}>
                    Razão social
                  </label>
                  <input value="Photoon Studio Ltda" style={{ height: '46px', padding: '0 15px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', color: '#0B1220' }} className="dc9" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#6B7A90' }}>
                    Nome fantasia
                  </label>
                  <input value="Photoon" style={{ height: '46px', padding: '0 15px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', color: '#0B1220' }} className="dc10" />
                  <span style={{ fontSize: '11.5px', color: '#9AA7BC' }}>
                    aparece na loja e nos e-mails
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#6B7A90' }}>
                    CNPJ
                  </label>
                  <input value="21.884.412/0001-08" style={{ height: '46px', padding: '0 15px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', color: '#0B1220' }} className="dc11" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#6B7A90' }}>
                    Inscrição estadual
                  </label>
                  <input value="114.882.990.221" style={{ height: '46px', padding: '0 15px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', color: '#0B1220' }} className="dc12" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#6B7A90' }}>
                    E-mail administrativo
                  </label>
                  <input value="contato@photoon.studio" style={{ height: '46px', padding: '0 15px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', color: '#0B1220' }} className="dc13" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#6B7A90' }}>
                    Telefone
                  </label>
                  <input value="(11) 4002-8922" style={{ height: '46px', padding: '0 15px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', color: '#0B1220' }} className="dc14" />
                </div>
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '24px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '18px' }}>
                <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                  Marca e aparência
                </h2>
                <a href="./Design System.dc.html" style={{ fontSize: '13px', fontWeight: '700' }}>
                  Abrir design system
                </a>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', alignItems: 'start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px', border: '1px solid #E6EAF2', borderRadius: '18px' }}>
                  <span style={{ width: '54px', height: '54px', borderRadius: '16px', background: '#0B1220', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                    <svg viewBox="0 0 100 100" width="30" height="30">
                      <circle cx="50" cy="50" r="43" fill="none" stroke="#FFFFFF" strokeWidth="8" />
                      <circle cx="50" cy="50" r="20" fill="#FFFFFF" />
                      <circle cx="41" cy="41" r="6" fill="#06B6D4" />
                    </svg>
                  </span>
                  <div style={{ minWidth: '0' }}>
                    <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '700' }}>
                      Logotipo
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#6B7A90' }}>
                      SVG · versões clara e escura
                    </p>
                    <a href="#" style={{ fontSize: '12.5px', fontWeight: '700' }}>
                      Substituir
                    </a>
                  </div>
                </div>
                <div style={{ padding: '18px', border: '1px solid #E6EAF2', borderRadius: '18px' }}>
                  <p style={{ margin: '0 0 12px', fontSize: '13.5px', fontWeight: '700' }}>
                    Cores da marca
                  </p>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <span style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#0B1220' }}>
                    </span>
                    <span style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#2563EB' }}>
                    </span>
                    <span style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#06B6D4' }}>
                    </span>
                    <span style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#F4F7FC', border: '1px solid #E6EAF2' }}>
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#6B7A90' }}>
                    Fonte da interface
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '46px', padding: '0 15px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', cursor: 'pointer' }} className="dc15">
                    <span style={{ fontSize: '14px' }}>
                      Instrument Sans
                    </span>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#9AA7BC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                  <span style={{ fontSize: '11.5px', color: '#9AA7BC' }}>
                    usada na loja e no painel
                  </span>
                </div>
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '24px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '18px' }}>
                <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                  Fuso, moeda e prazos
                </h2>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#6B7A90' }}>
                    Fuso horário
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '46px', padding: '0 15px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', cursor: 'pointer' }} className="dc16">
                    <span style={{ fontSize: '14px' }}>
                      America/Sao_Paulo (GMT-3)
                    </span>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#9AA7BC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#6B7A90' }}>
                    Moeda
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '46px', padding: '0 15px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', cursor: 'pointer' }} className="dc17">
                    <span style={{ fontSize: '14px' }}>
                      Real brasileiro · R$
                    </span>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#9AA7BC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#6B7A90' }}>
                    Idioma padrão
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '46px', padding: '0 15px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', cursor: 'pointer' }} className="dc18">
                    <span style={{ fontSize: '14px' }}>
                      Português do Brasil
                    </span>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#9AA7BC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#6B7A90' }}>
                    Prazo de produção
                  </label>
                  <input value="3 dias úteis" style={{ height: '46px', padding: '0 15px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', color: '#0B1220' }} className="dc19" />
                  <span style={{ fontSize: '11.5px', color: '#9AA7BC' }}>
                    usado no cálculo de SLA
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#6B7A90' }}>
                    Prazo de retirada
                  </label>
                  <input value="5 dias úteis" style={{ height: '46px', padding: '0 15px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', color: '#0B1220' }} className="dc20" />
                  <span style={{ fontSize: '11.5px', color: '#9AA7BC' }}>
                    após aviso ao cliente
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#6B7A90' }}>
                    Regime tributário
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '46px', padding: '0 15px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', cursor: 'pointer' }} className="dc21">
                    <span style={{ fontSize: '14px' }}>
                      Simples Nacional · anexo III
                    </span>
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#9AA7BC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '24px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '18px' }}>
                <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                  Segurança da conta
                </h2>
                <span style={{ whiteSpace: 'nowrap', padding: '6px 11px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '12px', fontWeight: '600' }}>
                  2 pendências
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', border: '1px solid #E6EAF2', borderRadius: '16px', background: '#F8FAFE' }}>
                  <div style={{ flex: '1', minWidth: '0' }}>
                    <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                      Autenticação em duas etapas obrigatória
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#6B7A90' }}>
                      exigida para perfis Proprietário e Administrador
                    </p>
                  </div>
                  <span style={{ width: '44px', height: '26px', borderRadius: '999px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', padding: '3px', display: 'flex', justifyContent: 'flex-end', cursor: 'pointer', flex: '0 0 auto' }}>
                    <span style={{ width: '20px', height: '20px', borderRadius: '999px', background: '#FFFFFF', boxShadow: '0 2px 5px rgba(11,18,32,.18)' }}>
                    </span>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', border: '1px solid #E6EAF2', borderRadius: '16px', background: '#F8FAFE' }}>
                  <div style={{ flex: '1', minWidth: '0' }}>
                    <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                      Bloqueio após 5 tentativas
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#6B7A90' }}>
                      IP bloqueado por 2 horas e alerta por e-mail
                    </p>
                  </div>
                  <span style={{ width: '44px', height: '26px', borderRadius: '999px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', padding: '3px', display: 'flex', justifyContent: 'flex-end', cursor: 'pointer', flex: '0 0 auto' }}>
                    <span style={{ width: '20px', height: '20px', borderRadius: '999px', background: '#FFFFFF', boxShadow: '0 2px 5px rgba(11,18,32,.18)' }}>
                    </span>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', border: '1px solid #E6EAF2', borderRadius: '16px', background: '#FFFFFF' }}>
                  <div style={{ flex: '1', minWidth: '0' }}>
                    <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                      Exigir aprovação para exportar base de clientes
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#6B7A90' }}>
                      protege dados pessoais conforme LGPD
                    </p>
                  </div>
                  <span style={{ width: '44px', height: '26px', borderRadius: '999px', background: '#E6EAF2', padding: '3px', display: 'flex', justifyContent: 'flex-start', cursor: 'pointer', flex: '0 0 auto' }}>
                    <span style={{ width: '20px', height: '20px', borderRadius: '999px', background: '#FFFFFF', boxShadow: '0 2px 5px rgba(11,18,32,.18)' }}>
                    </span>
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', border: '1px solid #E6EAF2', borderRadius: '16px', background: '#F8FAFE' }}>
                  <div style={{ flex: '1', minWidth: '0' }}>
                    <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                      Sessões expiram em 12 horas
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#6B7A90' }}>
                      9 dispositivos conectados agora
                    </p>
                  </div>
                  <span style={{ width: '44px', height: '26px', borderRadius: '999px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', padding: '3px', display: 'flex', justifyContent: 'flex-end', cursor: 'pointer', flex: '0 0 auto' }}>
                    <span style={{ width: '20px', height: '20px', borderRadius: '999px', background: '#FFFFFF', boxShadow: '0 2px 5px rgba(11,18,32,.18)' }}>
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              <div style={{ background: '#0B1220', borderRadius: '24px', padding: '24px 26px', color: '#FFFFFF' }}>
                <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '1.6px', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', fontWeight: '700' }}>
                  Assinatura Photoon
                </p>
                <p style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: '800', letterSpacing: '-.8px' }}>
                  Plano Pro
                </p>
                <p style={{ margin: '0 0 18px', fontSize: '13.5px', color: 'rgba(255,255,255,.7)' }}>
                  R$ 890/mês · renova em 1 de setembro · cartão •••• 4412
                </p>
                <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: 'rgba(255,255,255,.7)' }}>
                  <span>
                    {v.usoTitulo}
                  </span>
                  <span>
                    1,44 TB de 2 TB
                  </span>
                </div>
                <div style={{ height: '8px', borderRadius: '999px', background: 'rgba(255,255,255,.14)', marginBottom: '18px' }}>
                  <div style={css(v.usoBarra)}>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  <button style={{ whiteSpace: 'nowrap', height: '40px', padding: '0 16px', border: '0', borderRadius: '999px', background: '#FFFFFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '13.5px', fontWeight: '700', cursor: 'pointer' }} className="dc22">
                    Fazer upgrade
                  </button>
                  <button style={{ whiteSpace: 'nowrap', height: '40px', padding: '0 16px', border: '1px solid rgba(255,255,255,.25)', borderRadius: '999px', background: 'transparent', color: '#FFFFFF', fontFamily: 'inherit', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer' }} className="dc23">
                    Ver faturas
                  </button>
                </div>
              </div>
              <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '24px 26px' }}>
                <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: '700' }}>
                  Filiais
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7' }}>
                    <span style={{ width: '32px', height: '32px', borderRadius: '11px', background: '#EAF0FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 9.5 5.5 4h13L20 9.5" />
                        <path d="M4 9.5h16V20H4z" />
                        <path d="M9 20v-5h6v5" />
                      </svg>
                    </span>
                    <div style={{ flex: '1', minWidth: '0' }}>
                      <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                        Filial Centro
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                        retirada · 5 usuários
                      </p>
                    </div>
                    <span style={{ whiteSpace: 'nowrap', padding: '5px 10px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '11.5px', fontWeight: '700' }}>
                      matriz
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7' }}>
                    <span style={{ width: '32px', height: '32px', borderRadius: '11px', background: '#E4F8FC', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 9.5 5.5 4h13L20 9.5" />
                        <path d="M4 9.5h16V20H4z" />
                        <path d="M9 20v-5h6v5" />
                      </svg>
                    </span>
                    <div style={{ flex: '1', minWidth: '0' }}>
                      <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                        Filial Norte
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                        retirada · 3 usuários
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7' }}>
                    <span style={{ width: '32px', height: '32px', borderRadius: '11px', background: '#EDEBFE', color: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 9.5 5.5 4h13L20 9.5" />
                        <path d="M4 9.5h16V20H4z" />
                        <path d="M9 20v-5h6v5" />
                      </svg>
                    </span>
                    <div style={{ flex: '1', minWidth: '0' }}>
                      <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                        Fábrica Lapa
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                        produção e expedição · 4 usuários
                      </p>
                    </div>
                  </div>
                </div>
                <button style={{ whiteSpace: 'nowrap', marginTop: '14px', height: '42px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', border: '1px dashed #CBD5E6', borderRadius: '14px', background: 'transparent', color: '#46536A', fontFamily: 'inherit', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer' }} className="dc24">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Adicionar filial
                </button>
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '24px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '18px' }}>
                <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                  Equipe e permissões
                </h2>
                <a href="#" style={{ fontSize: '13px', fontWeight: '700' }}>
                  Convidar usuário
                </a>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px,1.4fr) minmax(140px,1fr) minmax(120px,.9fr) 90px 70px', gap: '14px', alignItems: 'center', padding: '12px 14px', borderRadius: '16px', border: '1px solid #EEF1F7' }} className="dc25">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '0' }}>
                    <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#F1F5FD', color: '#46536A', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                      MR
                    </span>
                    <div style={{ minWidth: '0' }}>
                      <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                        {v.usuarioNome}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9AA7BC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        marta@photoon.studio
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', color: '#34405A' }}>
                    Proprietária
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                    Centro
                  </span>
                  <span style={{ whiteSpace: 'nowrap', padding: '5px 10px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '11.5px', fontWeight: '700', width: 'max-content' }}>
                    2FA ativo
                  </span>
                  <a href="#" style={{ fontSize: '12.5px', fontWeight: '700' }}>
                    Editar
                  </a>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px,1.4fr) minmax(140px,1fr) minmax(120px,.9fr) 90px 70px', gap: '14px', alignItems: 'center', padding: '12px 14px', borderRadius: '16px', border: '1px solid #EEF1F7' }} className="dc26">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '0' }}>
                    <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#F1F5FD', color: '#46536A', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                      JP
                    </span>
                    <div style={{ minWidth: '0' }}>
                      <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                        João Pinto
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9AA7BC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        joao@photoon.studio
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', color: '#34405A' }}>
                    Produção
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                    Fábrica Lapa
                  </span>
                  <span style={{ whiteSpace: 'nowrap', padding: '5px 10px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '11.5px', fontWeight: '700', width: 'max-content' }}>
                    2FA ativo
                  </span>
                  <a href="#" style={{ fontSize: '12.5px', fontWeight: '700' }}>
                    Editar
                  </a>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px,1.4fr) minmax(140px,1fr) minmax(120px,.9fr) 90px 70px', gap: '14px', alignItems: 'center', padding: '12px 14px', borderRadius: '16px', border: '1px solid #EEF1F7' }} className="dc27">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '0' }}>
                    <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#F1F5FD', color: '#46536A', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                      CM
                    </span>
                    <div style={{ minWidth: '0' }}>
                      <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                        Carla Mendes
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9AA7BC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        carla@photoon.studio
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', color: '#34405A' }}>
                    Expedição
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                    Fábrica Lapa
                  </span>
                  <span style={{ whiteSpace: 'nowrap', padding: '5px 10px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '11.5px', fontWeight: '700', width: 'max-content' }}>
                    2FA ativo
                  </span>
                  <a href="#" style={{ fontSize: '12.5px', fontWeight: '700' }}>
                    Editar
                  </a>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px,1.4fr) minmax(140px,1fr) minmax(120px,.9fr) 90px 70px', gap: '14px', alignItems: 'center', padding: '12px 14px', borderRadius: '16px', border: '1px solid #EEF1F7' }} className="dc28">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '0' }}>
                    <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#F1F5FD', color: '#46536A', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                      AL
                    </span>
                    <div style={{ minWidth: '0' }}>
                      <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                        Ana Lopes
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9AA7BC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        ana@photoon.studio
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', color: '#34405A' }}>
                    Vendedora
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                    Centro
                  </span>
                  <span style={{ whiteSpace: 'nowrap', padding: '5px 10px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '11.5px', fontWeight: '700', width: 'max-content' }}>
                    2FA ativo
                  </span>
                  <a href="#" style={{ fontSize: '12.5px', fontWeight: '700' }}>
                    Editar
                  </a>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px,1.4fr) minmax(140px,1fr) minmax(120px,.9fr) 90px 70px', gap: '14px', alignItems: 'center', padding: '12px 14px', borderRadius: '16px', border: '1px solid #EEF1F7' }} className="dc29">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '0' }}>
                    <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#F1F5FD', color: '#46536A', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                      DM
                    </span>
                    <div style={{ minWidth: '0' }}>
                      <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                        Diego Martins
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9AA7BC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        diego@photoon.studio
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', color: '#34405A' }}>
                    Vendedor
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                    Norte
                  </span>
                  <span style={{ whiteSpace: 'nowrap', padding: '5px 10px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '11.5px', fontWeight: '700', width: 'max-content' }}>
                    sem 2FA
                  </span>
                  <a href="#" style={{ fontSize: '12.5px', fontWeight: '700' }}>
                    Editar
                  </a>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(200px,1.4fr) minmax(140px,1fr) minmax(120px,.9fr) 90px 70px', gap: '14px', alignItems: 'center', padding: '12px 14px', borderRadius: '16px', border: '1px solid #EEF1F7' }} className="dc30">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '0' }}>
                    <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#F1F5FD', color: '#46536A', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                      EP
                    </span>
                    <div style={{ minWidth: '0' }}>
                      <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                        Elis Prado
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#9AA7BC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        elis@photoon.studio
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: '13px', color: '#34405A' }}>
                    Atendimento
                  </span>
                  <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                    Centro
                  </span>
                  <span style={{ whiteSpace: 'nowrap', padding: '5px 10px', borderRadius: '999px', background: '#FEF3E2', color: '#B45309', fontSize: '11.5px', fontWeight: '700', width: 'max-content' }}>
                    sem 2FA
                  </span>
                  <a href="#" style={{ fontSize: '12.5px', fontWeight: '700' }}>
                    Editar
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
