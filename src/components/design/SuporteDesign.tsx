// Gerado por tools/dc2tsx.py a partir de Suporte.dc.html
// Transliteração fiel do design: não editar à mão, editar o .dc.html.
'use client';

import { css } from '@/lib/css';

export const CSS_PSEUDO = `
.dc1:hover { background: #F1F5FD; border-color: #D6E2FC; color: #2563EB; }
.dc2:hover { background: #F1F5FD; border-color: #D6E2FC; color: #2563EB; }
.dc3:hover { filter: brightness(1.06); }
.dc4:hover { background: #FFFFFF; color: #2563EB; }
.dc5:hover { background: #FFFFFF; color: #2563EB; }
.dc6:hover { background: #FFFFFF; color: #2563EB; }
.dc7:hover { background: #F8FAFE; }
.dc8:hover { background: #F8FAFE; }
.dc9:hover { background: #F8FAFE; }
.dc10:hover { background: #F8FAFE; }
.dc11:hover { background: #F8FAFE; }
.dc12:hover { background: #F8FAFE; }
.dc13:hover { background: #F1F5FD; color: #2563EB; }
.dc14:hover { background: #2563EB; }
.dc15:hover { border-color: #2563EB; color: #2563EB; }
.dc16:hover { border-color: #2563EB; color: #2563EB; }
.dc17:hover { border-color: #2563EB; color: #2563EB; }
.dc18:hover { border-color: #2563EB; color: #2563EB; }
.dc19:hover { border-color: #2563EB; color: #2563EB; }
.dc20:hover { background: #F1F5FD; color: #2563EB; }
.dc21:hover { filter: brightness(1.06); }
.dc22:hover { background: #F1F5FD; color: #2563EB; }
.dc23:hover { background: #F1F5FD; color: #2563EB; }
.dc24:hover { background: #F1F5FD; color: #2563EB; }
`;

export default function SuporteDesign({ v }: { v: any }) {
  return (
    <>
      <div style={{ padding: '26px 30px 60px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'riseIn .5s cubic-bezier(.2,.8,.2,1) both' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '1.6px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
              Sistema · Central de suporte
            </p>
            <h1 style={{ margin: '0 0 8px', fontSize: '30px', fontWeight: '800', letterSpacing: '-1px' }}>
              Central de suporte
            </h1>
            <p style={{ margin: '0', fontSize: '14.5px', color: '#6B7A90' }}>
              18 tickets abertos · 1ª resposta em 12 min · CSAT 4,7 de 5 · SLA 96%
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} className="dc1">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 5h7v15H4z" />
                <path d="M13 5h7v15h-7z" />
              </svg>
              Base de conhecimento
            </button>
            <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} className="dc2">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 3 4.5 13.5H11l-1 7.5 8.5-10.5H12z" />
              </svg>
              Macros
            </button>
            <button style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '0', borderRadius: '14px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(37,99,235,.28)' }} className="dc3">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Novo ticket
            </button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', alignItems: 'start' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', overflow: 'hidden' }}>
            <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #F0F3F9' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
                <h2 style={{ margin: '0', fontSize: '16px', fontWeight: '700' }}>
                  Fila de atendimento
                </h2>
                <span style={{ whiteSpace: 'nowrap', padding: '5px 10px', borderRadius: '999px', background: '#FFF1F3', color: '#E11D48', fontSize: '11.5px', fontWeight: '700' }}>
                  5 sem resposta
                </span>
              </div>
              <div style={{ display: 'flex', gap: '4px', padding: '4px', background: '#F4F7FC', border: '1px solid #E6EAF2', borderRadius: '999px' }}>
                <span onClick={v.setP0} style={css(v.per0)} className="dc4">
                  Todos
                </span>
                <span onClick={v.setP1} style={css(v.per1)} className="dc5">
                  Meus
                </span>
                <span onClick={v.setP2} style={css(v.per2)} className="dc6">
                  SLA crítico
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '10px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', padding: '14px 16px', borderRadius: '16px', cursor: 'pointer', border: '1px solid #D6E2FC', background: '#F1F5FD' }} className="dc7">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '30px', height: '30px', borderRadius: '10px', background: '#FFF1F3', color: '#E11D48', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                    RN
                  </span>
                  <p style={{ margin: '0', flex: '1', minWidth: '0', fontSize: '13.5px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {v.linha0.nome}
                  </p>
                  <span style={{ fontSize: '11px', color: '#9AA7BC', flex: '0 0 auto' }}>
                    8 min
                  </span>
                </div>
                <p style={{ margin: '0', fontSize: '12.5px', color: '#6B7A90', lineHeight: '1.45', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  O canvas 40×60 chegou com a foto cortada no rosto. Preciso de reimpressão urgente.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#9AA7BC' }}>
                    #TK-4412
                  </span>
                  <span style={{ padding: '3px 8px', borderRadius: '8px', background: '#FFF1F3', color: '#E11D48', fontSize: '10.5px', fontWeight: '700' }}>
                    urgente
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', padding: '14px 16px', borderRadius: '16px', cursor: 'pointer', border: '1px solid transparent', background: 'transparent' }} className="dc8">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '30px', height: '30px', borderRadius: '10px', background: '#E4F8FC', color: '#0891B2', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                    CF
                  </span>
                  <p style={{ margin: '0', flex: '1', minWidth: '0', fontSize: '13.5px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {v.linha2.nome}
                  </p>
                  <span style={{ fontSize: '11px', color: '#9AA7BC', flex: '0 0 auto' }}>
                    22 min
                  </span>
                </div>
                <p style={{ margin: '0', fontSize: '12.5px', color: '#6B7A90', lineHeight: '1.45', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  Conseguimos antecipar a entrega dos álbuns de formatura para dia 2?
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#9AA7BC' }}>
                    #TK-4411
                  </span>
                  <span style={{ padding: '3px 8px', borderRadius: '8px', background: '#FEF3E2', color: '#B45309', fontSize: '10.5px', fontWeight: '700' }}>
                    alta
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', padding: '14px 16px', borderRadius: '16px', cursor: 'pointer', border: '1px solid transparent', background: 'transparent' }} className="dc9">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '30px', height: '30px', borderRadius: '10px', background: '#EAF0FF', color: '#2563EB', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                    SL
                  </span>
                  <p style={{ margin: '0', flex: '1', minWidth: '0', fontSize: '13.5px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    Studio Lume
                  </p>
                  <span style={{ fontSize: '11px', color: '#9AA7BC', flex: '0 0 auto' }}>
                    1 h
                  </span>
                </div>
                <p style={{ margin: '0', fontSize: '12.5px', color: '#6B7A90', lineHeight: '1.45', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  A nota fiscal do pedido #PT-10482 saiu com o CNPJ antigo.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#9AA7BC' }}>
                    #TK-4409
                  </span>
                  <span style={{ padding: '3px 8px', borderRadius: '8px', background: '#FEF3E2', color: '#B45309', fontSize: '10.5px', fontWeight: '700' }}>
                    alta
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', padding: '14px 16px', borderRadius: '16px', cursor: 'pointer', border: '1px solid transparent', background: 'transparent' }} className="dc10">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '30px', height: '30px', borderRadius: '10px', background: '#EDEBFE', color: '#6366F1', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                    MB
                  </span>
                  <p style={{ margin: '0', flex: '1', minWidth: '0', fontSize: '13.5px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {v.linha3.nome}
                  </p>
                  <span style={{ fontSize: '11px', color: '#9AA7BC', flex: '0 0 auto' }}>
                    2 h
                  </span>
                </div>
                <p style={{ margin: '0', fontSize: '12.5px', color: '#6B7A90', lineHeight: '1.45', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  Duas páginas do álbum saíram com mancha. Seguem fotos em anexo.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#9AA7BC' }}>
                    #TK-4407
                  </span>
                  <span style={{ padding: '3px 8px', borderRadius: '8px', background: '#EAF0FF', color: '#2563EB', fontSize: '10.5px', fontWeight: '700' }}>
                    normal
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', padding: '14px 16px', borderRadius: '16px', cursor: 'pointer', border: '1px solid transparent', background: 'transparent' }} className="dc11">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '30px', height: '30px', borderRadius: '10px', background: '#E6F8F1', color: '#059669', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                    AP
                  </span>
                  <p style={{ margin: '0', flex: '1', minWidth: '0', fontSize: '13.5px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {v.linha4.nome}
                  </p>
                  <span style={{ fontSize: '11px', color: '#9AA7BC', flex: '0 0 auto' }}>
                    3 h
                  </span>
                </div>
                <p style={{ margin: '0', fontSize: '12.5px', color: '#6B7A90', lineHeight: '1.45', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  Não consigo mover a foto dentro da moldura no editor.
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#9AA7BC' }}>
                    #TK-4404
                  </span>
                  <span style={{ padding: '3px 8px', borderRadius: '8px', background: '#EAF0FF', color: '#2563EB', fontSize: '10.5px', fontWeight: '700' }}>
                    normal
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', padding: '14px 16px', borderRadius: '16px', cursor: 'pointer', border: '1px solid transparent', background: 'transparent' }} className="dc12">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ width: '30px', height: '30px', borderRadius: '10px', background: '#FEF3E2', color: '#B45309', fontSize: '11px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                    FT
                  </span>
                  <p style={{ margin: '0', flex: '1', minWidth: '0', fontSize: '13.5px', fontWeight: '700', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {v.linha5.nome}
                  </p>
                  <span style={{ fontSize: '11px', color: '#9AA7BC', flex: '0 0 auto' }}>
                    1 d
                  </span>
                </div>
                <p style={{ margin: '0', fontSize: '12.5px', color: '#6B7A90', lineHeight: '1.45', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  Boleto venceu, posso pagar por PIX com o mesmo valor?
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '11px', fontWeight: '700', color: '#9AA7BC' }}>
                    #TK-4398
                  </span>
                  <span style={{ padding: '3px 8px', borderRadius: '8px', background: '#F1F5FD', color: '#46536A', fontSize: '10.5px', fontWeight: '700' }}>
                    baixa
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', overflow: 'hidden', minWidth: '0', gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', padding: '20px 24px', borderBottom: '1px solid #F0F3F9', flexWrap: 'wrap' }}>
              <div style={{ minWidth: '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                    Canvas com corte no rosto
                  </h2>
                  <span style={{ whiteSpace: 'nowrap', padding: '5px 10px', borderRadius: '999px', background: '#FFF1F3', color: '#E11D48', fontSize: '11.5px', fontWeight: '700' }}>
                    urgente
                  </span>
                </div>
                <p style={{ margin: '0', fontSize: '13px', color: '#6B7A90' }}>
                  #TK-4412 · Rita Nunes · pedido #PT-10480 · aberto há 8 min via WhatsApp
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button style={{ whiteSpace: 'nowrap', height: '38px', padding: '0 14px', border: '1px solid #E6EAF2', borderRadius: '12px', background: '#FFFFFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }} className="dc13">
                  Abrir reimpressão
                </button>
                <button style={{ whiteSpace: 'nowrap', height: '38px', padding: '0 14px', border: '0', borderRadius: '12px', background: '#0B1220', color: '#FFFFFF', fontFamily: 'inherit', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }} className="dc14">
                  Resolver ticket
                </button>
              </div>
            </div>
            <div style={{ padding: '22px 24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ width: '32px', height: '32px', borderRadius: '11px', background: '#FFF1F3', color: '#E11D48', fontSize: '11.5px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  RN
                </span>
                <div style={{ minWidth: '0' }}>
                  <div style={{ padding: '13px 16px', borderRadius: '4px 16px 16px 16px', background: '#F4F7FC' }}>
                    <p style={{ margin: '0', fontSize: '13.5px', color: '#34405A', lineHeight: '1.55' }}>
                      Boa tarde! O quadro chegou hoje, mas a foto está cortada no rosto da minha filha. No editor aparecia inteira. Preciso resolver antes do aniversário, dia 30.
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
                    <span style={{ fontSize: '11.5px', color: '#9AA7BC' }}>
                      Rita Nunes · 14:12
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '4px 9px', borderRadius: '8px', background: '#F1F5FD', fontSize: '11px', fontWeight: '600', color: '#46536A' }}>
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 12.5 14 6.5a3 3 0 0 1 4.2 4.2l-7.6 7.6a5 5 0 0 1-7-7L11 4.5" />
                      </svg>
                      foto_quadro.jpg
                    </span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', flexDirection: 'row-reverse' }}>
                <span style={{ width: '32px', height: '32px', borderRadius: '11px', background: '#0B1220', color: '#FFFFFF', fontSize: '11.5px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  EP
                </span>
                <div style={{ minWidth: '0' }}>
                  <div style={{ padding: '13px 16px', borderRadius: '16px 4px 16px 16px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)' }}>
                    <p style={{ margin: '0', fontSize: '13.5px', color: '#FFFFFF', lineHeight: '1.55' }}>
                      Oi Rita! Já verifiquei o arquivo: o preflight marcou aviso de corte de rosto na área de sangria. A reimpressão sai sem custo e entra na produção de hoje.
                    </p>
                  </div>
                  <p style={{ margin: '8px 0 0', fontSize: '11.5px', color: '#9AA7BC', textAlign: 'right' }}>
                    Elis Prado · 14:18 · visto
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '16px', background: '#FEF3E2', border: '1px solid #FCE9CE' }}>
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="#B45309" strokeWidth="1.9" strokeLinecap="round" style={{ flex: '0 0 auto' }}>
                  <path d="M12 8v5M12 16.5h.01" />
                  <circle cx="12" cy="12" r="8.5" />
                </svg>
                <p style={{ margin: '0', fontSize: '12.5px', color: '#7A5410' }}>
                  Nota interna · João Pinto: arte original tem 2 mm de folga apenas. Sugerir recorte manual na reimpressão.
                </p>
              </div>
            </div>
            <div style={{ padding: '16px 24px 20px', borderTop: '1px solid #F0F3F9' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <span style={{ padding: '6px 12px', borderRadius: '999px', background: '#F4F7FC', border: '1px solid #E6EAF2', fontSize: '12px', fontWeight: '600', color: '#46536A', cursor: 'pointer' }} className="dc15">
                  Macro · reimpressão sem custo
                </span>
                <span style={{ padding: '6px 12px', borderRadius: '999px', background: '#F4F7FC', border: '1px solid #E6EAF2', fontSize: '12px', fontWeight: '600', color: '#46536A', cursor: 'pointer' }} className="dc16">
                  Macro · prazo de produção
                </span>
                <span style={{ padding: '6px 12px', borderRadius: '999px', background: '#F4F7FC', border: '1px solid #E6EAF2', fontSize: '12px', fontWeight: '600', color: '#46536A', cursor: 'pointer' }} className="dc17">
                  Artigo · área de segurança
                </span>
              </div>
              <div style={{ border: '1px solid #E6EAF2', borderRadius: '18px', padding: '14px 16px' }}>
                <input placeholder="Responder para Rita pelo WhatsApp…" style={{ width: '100%', border: '0', background: 'transparent', fontFamily: 'inherit', fontSize: '14px', color: '#0B1220', marginBottom: '12px' }} />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <span style={{ width: '34px', height: '34px', borderRadius: '11px', border: '1px solid #E6EAF2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7A90', cursor: 'pointer' }} className="dc18">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M8 12.5 14 6.5a3 3 0 0 1 4.2 4.2l-7.6 7.6a5 5 0 0 1-7-7L11 4.5" />
                      </svg>
                    </span>
                    <span style={{ width: '34px', height: '34px', borderRadius: '11px', border: '1px solid #E6EAF2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7A90', cursor: 'pointer' }} className="dc19">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 3v5h5" />
                        <path d="M6 3h8l5 5v13H6z" />
                      </svg>
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button style={{ whiteSpace: 'nowrap', height: '38px', padding: '0 14px', border: '1px solid #E6EAF2', borderRadius: '12px', background: '#FFFFFF', color: '#46536A', fontFamily: 'inherit', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }} className="dc20">
                      Nota interna
                    </button>
                    <button style={{ whiteSpace: 'nowrap', height: '38px', padding: '0 18px', border: '0', borderRadius: '12px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#FFFFFF', fontFamily: 'inherit', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }} className="dc21">
                      Responder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '20px 22px' }}>
              <h2 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: '700' }}>
                Contexto da conta
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <span style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#FFF1F3', color: '#E11D48', fontSize: '12.5px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  RN
                </span>
                <div style={{ minWidth: '0' }}>
                  <p style={{ margin: '0', fontSize: '14px', fontWeight: '700' }}>
                    {v.linha0.nome}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                    B2C · 4 pedidos · desde 2024
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: '#9AA7BC' }}>
                    Pedido
                  </span>
                  <a href="./Pedido.dc.html" style={{ fontWeight: '700' }}>
                    #PT-10480
                  </a>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: '#9AA7BC' }}>
                    Produto
                  </span>
                  <span>
                    Canvas 40×60
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: '#9AA7BC' }}>
                    Pagamento
                  </span>
                  <span style={{ color: '#B45309', fontWeight: '600' }}>
                    PIX pendente
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                  <span style={{ color: '#9AA7BC' }}>
                    LTV
                  </span>
                  <span style={{ fontWeight: '700' }}>
                    R$ 1.148
                  </span>
                </div>
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '20px 22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '14px' }}>
                <h2 style={{ margin: '0', fontSize: '16px', fontWeight: '700' }}>
                  SLA do ticket
                </h2>
                <span style={{ whiteSpace: 'nowrap', padding: '5px 10px', borderRadius: '999px', background: '#E6F8F1', color: '#059669', fontSize: '11.5px', fontWeight: '700' }}>
                  dentro do prazo
                </span>
              </div>
              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#6B7A90' }}>
                <span>
                  1ª resposta
                </span>
                <span>
                  6 min de 30
                </span>
              </div>
              <div style={{ height: '8px', borderRadius: '999px', background: '#EEF1F7', marginBottom: '14px' }}>
                <div style={{ width: '20%', height: '100%', borderRadius: '999px', background: '#10B981' }}>
                </div>
              </div>
              <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#6B7A90' }}>
                <span>
                  Resolução
                </span>
                <span>
                  8 h de 24
                </span>
              </div>
              <div style={{ height: '8px', borderRadius: '999px', background: '#EEF1F7' }}>
                <div style={{ width: '33%', height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg,#2563EB,#06B6D4)' }}>
                </div>
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '20px 22px' }}>
              <h2 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: '700' }}>
                Artigos sugeridos
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '11px 12px', borderRadius: '14px', background: '#F8FAFE', border: '1px solid #EEF1F7', color: '#34405A', fontSize: '13px', fontWeight: '600' }} className="dc22">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                    <path d="M4 5h7v15H4z" />
                    <path d="M13 5h7v15h-7z" />
                  </svg>
                  Área de segurança e sangria
                </a>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '11px 12px', borderRadius: '14px', background: '#F8FAFE', border: '1px solid #EEF1F7', color: '#34405A', fontSize: '13px', fontWeight: '600' }} className="dc23">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                    <path d="M4 5h7v15H4z" />
                    <path d="M13 5h7v15h-7z" />
                  </svg>
                  Como abrir uma reimpressão
                </a>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '11px', padding: '11px 12px', borderRadius: '14px', background: '#F8FAFE', border: '1px solid #EEF1F7', color: '#34405A', fontSize: '13px', fontWeight: '600' }} className="dc24">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
                    <path d="M4 5h7v15H4z" />
                    <path d="M13 5h7v15h-7z" />
                  </svg>
                  Prazos de produção e entrega
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
