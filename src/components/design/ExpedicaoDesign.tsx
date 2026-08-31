// Gerado por tools/dc2tsx.py a partir de Expedicao.dc.html
// Transliteração fiel do design: não editar à mão, editar o .dc.html.
'use client';

import { css } from '@/lib/css';

export const CSS_PSEUDO = `
.dc1:hover { background: #F1F5FD; border-color: #D6E2FC; color: #2563EB; }
.dc2:hover { filter: brightness(1.06); }
.dc3:hover { background: #FFFFFF; color: #2563EB; }
.dc4:hover { background: #FFFFFF; color: #2563EB; }
.dc5:hover { background: #FFFFFF; color: #2563EB; }
.dc6:hover { background: #FFFFFF; color: #2563EB; }
.dc7:hover { background: #FFFFFF; color: #2563EB; }
.dc8:hover { background: #2563EB; }
.dc9:focus, .dc9:focus-within { border-color: #2563EB; }
.dc10:focus, .dc10:focus-within { border-color: #2563EB; }
.dc11:hover { background: #F1F5FD; color: #2563EB; }
.dc12:hover { background: rgba(255,255,255,.1); }
.dc13:hover { border-color: #2563EB; color: #2563EB; }
.dc14:hover { background: #F8FAFE; }
.dc15:hover { background: #F1F5FD; color: #2563EB; }
.dc16:hover { background: #F1F5FD; color: #2563EB; }
.dc17:hover { filter: brightness(1.06); }
`;

export default function ExpedicaoDesign({ v }: { v: any }) {
  return (
    <>
      <div style={{ padding: '26px 30px 60px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'riseIn .5s cubic-bezier(.2,.8,.2,1) both' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '1.6px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
              Operação · Expedição
            </p>
            <h1 style={{ margin: '0 0 8px', fontSize: '30px', fontWeight: '800', letterSpacing: '-1px' }}>
              Expedição e embalagem
            </h1>
            <p style={{ margin: '0', fontSize: '14.5px', color: '#6B7A90' }}>
              {v.resumo}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button onClick={v.imprimirPagina} style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} className="dc1">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 3v5h5" />
                <path d="M6 3h8l5 5v13H6z" />
              </svg>
              Romaneio do dia
            </button>
            <button onClick={v.verOcorrencias} style={css(v.btnOcorrencias)}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 8v5M12 16.5h.01" />
                <circle cx="12" cy="12" r="8.5" />
              </svg>
              {v.rotuloOcorrencias}
            </button>
            <button onClick={v.openModal} style={{ whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '0', borderRadius: '14px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 20px rgba(37,99,235,.28)' }} className="dc2">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 9V4h10v5" />
                <rect x="4" y="9" width="16" height="7" rx="2.5" />
                <path d="M7 14h10v6H7z" />
              </svg>
              Gerar etiquetas
            </button>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '4px', padding: '5px', background: '#F4F7FC', border: '1px solid #E6EAF2', borderRadius: '999px', flexWrap: 'wrap', width: 'max-content', maxWidth: '100%' }}>
          <span onClick={v.setP0} style={css(v.per0)} className="dc3">
            {v.aba0}
          </span>
          <span onClick={v.setP1} style={css(v.per1)} className="dc4">
            {v.aba1}
          </span>
          <span onClick={v.setP2} style={css(v.per2)} className="dc5">
            {v.aba2}
          </span>
          <span onClick={v.setP3} style={css(v.per3)} className="dc6">
            {v.aba3}
          </span>
          <span onClick={v.setP4} style={css(v.per4)} className="dc7">
            {v.aba4}
          </span>
        </div>
        <div className="exp-split">
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 26px', minWidth: '0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '18px', flexWrap: 'wrap' }}>
              <div>
                <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                  Estação de embalagem
                </h2>
                <p style={{ margin: '5px 0 0', fontSize: '13px', color: '#6B7A90' }}>
                  {v.estacaoNota}
                </p>
              </div>
              <span style={css(v.estacaoSelo)}>
                <span style={css(v.estacaoPonto)}>
                </span>
                {v.estacaoEstado}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 8px 8px 18px', border: '1.5px solid #2563EB', borderRadius: '18px', background: '#F8FAFE', marginBottom: '20px' }}>
              <span style={{ color: '#2563EB', flex: '0 0 auto' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6v12M8 6v12M12 6v12M16 6v12M20 6v12" />
                </svg>
              </span>
              <input defaultValue={v.busca} onChange={v.onBusca} placeholder="Número do pedido" style={{ flex: '1', minWidth: '0', border: '0', background: 'transparent', fontFamily: 'monospace', fontSize: '18px', fontWeight: '700', color: '#0B1220' }} />
              <button onClick={v.conferir} style={{ whiteSpace: 'nowrap', height: '42px', padding: '0 18px', border: '0', borderRadius: '13px', background: '#0B1220', color: '#FFFFFF', fontFamily: 'inherit', fontSize: '13.5px', fontWeight: '700', cursor: 'pointer' }} className="dc8">
                Conferir
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', alignItems: 'start' }}>
              <div>
                <p style={{ margin: '0 0 12px', fontSize: '12px', letterSpacing: '1.4px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
                  {v.itensTitulo}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {v.itens.map((item: any, i7: number) => (
                    <div key={i7} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '15px', background: '#F8FAFE', border: '1px solid #EEF1F7' }}>
                      <span style={{ width: '22px', height: '22px', borderRadius: '7px', background: '#10B981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFFFF', flex: '0 0 auto' }}>
                        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </span>
                      <div style={{ flex: '1', minWidth: '0' }}>
                        <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                          {item.descricao}
                        </p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                          {item.detalhe}
                        </p>
                      </div>
                    </div>
                  ))}
                  <p style={css(v.itensVazio)}>
                    Nenhum item gravado neste pedido.
                  </p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginTop: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '0' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#6B7A90' }}>
                      Transportadora
                    </label>
                    <input name="transportadora" defaultValue={v.transportadora} onChange={v.onTransportadora} placeholder="Correios, motoboy, retirada" style={{ height: '46px', padding: '0 15px', border: '1px solid #E6EAF2', borderRadius: '14px', fontFamily: 'inherit', fontSize: '14px', color: '#0B1220', minWidth: '0' }} className="dc9" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '0' }}>
                    <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#6B7A90' }}>
                      Rastreio
                    </label>
                    <input name="rastreio" defaultValue={v.rastreio} onChange={v.onRastreio} placeholder="Código de acompanhamento" style={{ height: '46px', padding: '0 15px', border: '1px solid #E6EAF2', borderRadius: '14px', fontFamily: 'inherit', fontSize: '14px', color: '#0B1220', minWidth: '0' }} className="dc10" />
                  </div>
                </div>
              </div>
              <div>
                <p style={{ margin: '0 0 12px', fontSize: '12px', letterSpacing: '1.4px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
                  Prévia da etiqueta
                </p>
                <div style={{ border: '1px solid #E6EAF2', borderRadius: '18px', padding: '18px', background: '#FFFFFF', boxShadow: '0 10px 24px rgba(11,18,32,.07)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', paddingBottom: '12px', borderBottom: '1.5px dashed #CBD5E6' }}>
                    <div style={{ minWidth: '0' }}>
                      <p style={{ margin: '0', fontSize: '15px', fontWeight: '800' }}>
                        {v.remetenteNome}
                      </p>
                      <p style={{ margin: '3px 0 0', fontSize: '11px', color: '#6B7A90' }}>
                        {v.remetente}
                      </p>
                    </div>
                    <span style={{ padding: '4px 9px', borderRadius: '7px', background: '#0B1220', color: '#FFFFFF', fontSize: '10.5px', fontWeight: '700' }}>
                      {v.servico}
                    </span>
                  </div>
                  <div style={{ padding: '12px 0', borderBottom: '1.5px dashed #CBD5E6' }}>
                    <p style={{ margin: '0', fontSize: '10.5px', letterSpacing: '1px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
                      Destinatário
                    </p>
                    <p style={{ margin: '5px 0 0', fontSize: '13.5px', fontWeight: '700' }}>
                      {v.destNome}
                    </p>
                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#46536A', lineHeight: '1.5' }}>
                      {v.destLinha1}
                      <br />
                      {v.destLinha2}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '44px', flex: '1', minWidth: '0' }}>
                      <span style={{ flex: '1', height: '100%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '60%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '90%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '45%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '100%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '70%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '55%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '95%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '100%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '60%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '90%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '45%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '100%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '70%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '55%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '95%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '100%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '60%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '90%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '45%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '100%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '70%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '55%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '95%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '100%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '60%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '90%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '45%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '100%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '70%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '55%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '95%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '100%', background: '#0B1220' }}>
                      </span>
                      <span style={{ flex: '1', height: '60%', background: '#0B1220' }}>
                      </span>
                    </div>
                    <div style={{ textAlign: 'right', flex: '0 0 auto' }}>
                      <p style={{ margin: '0', fontSize: '11px', color: '#9AA7BC' }}>
                        Rastreio
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12.5px', fontWeight: '700', fontFamily: 'monospace' }}>
                        {v.rastreioEtiqueta}
                      </p>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                  <button onClick={v.imprimirPagina} style={{ whiteSpace: 'nowrap', flex: '1', height: '44px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', color: '#46536A', fontFamily: 'inherit', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer' }} className="dc11">
                    Imprimir
                  </button>
                  <button onClick={v.despachar} style={css(v.btnDespachar)}>
                    {v.rotuloDespachar}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: '0' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 24px' }}>
              <h2 style={{ margin: '0 0 16px', fontSize: '17px', fontWeight: '700' }}>
                Por transportadora
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {v.coletas.map((c: any, i6: number) => (
                  <div key={i6} style={{ padding: '14px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
                      <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '700' }}>
                        {c.titulo}
                      </p>
                      <span style={css(c.selo)}>
                        {c.seloRotulo}
                      </span>
                    </div>
                    <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: '12.5px', color: '#6B7A90' }}>
                      <span>
                        {c.resumo}
                      </span>
                      <span style={css(c.pctEstilo)}>
                        {c.pct}
                      </span>
                    </div>
                    <div style={{ height: '8px', borderRadius: '999px', background: '#E3E9F5' }}>
                      <div style={css(c.barra)}>
                      </div>
                    </div>
                  </div>
                ))}
                <p style={css(v.coletasVazio)}>
                  Nenhum envio aberto nesta loja.
                </p>
              </div>
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
              <h2 style={{ margin: '0', fontSize: '17px', fontWeight: '700' }}>
                Retiradas no balcão
              </h2>
              <span style={css(v.retiradasSelo)}>
                {v.retiradasRotulo}
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {v.retiradas.map((r: any, i5: number) => (
                <div key={i5} style={css(r.linha)}>
                  <span style={css(r.avatar)}>
                    {r.iniciais}
                  </span>
                  <div style={{ flex: '1', minWidth: '0' }}>
                    <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {r.nome}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                      {r.nota}
                    </p>
                  </div>
                  <a href={r.href} style={{ fontSize: '12.5px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                    Abrir
                  </a>
                </div>
              ))}
              <p style={css(v.retiradasVazio)}>
                Nenhuma retirada no balcão em aberto.
              </p>
            </div>
          </div>
          <div style={{ background: 'linear-gradient(150deg,#0B1220,#1E2A44)', borderRadius: '24px', padding: '22px 24px', color: '#FFFFFF', flex: '1', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '1.6px', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)', fontWeight: '700' }}>
              Ocorrências
            </p>
            <p style={{ margin: '0 0 6px', fontSize: '26px', fontWeight: '800', letterSpacing: '-.8px' }}>
              {v.ocorrenciasTitulo}
            </p>
            <p style={{ margin: '0 0 16px', fontSize: '13px', color: 'rgba(255,255,255,.7)' }}>
              {v.ocorrenciasTexto}
            </p>
            <button onClick={v.verOcorrencias} style={{ whiteSpace: 'nowrap', alignSelf: 'flex-start', height: '40px', padding: '0 16px', border: '1px solid rgba(255,255,255,.25)', borderRadius: '999px', background: 'transparent', color: '#FFFFFF', fontFamily: 'inherit', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer' }} className="dc12">
              Abrir ocorrências
            </button>
          </div>
        </div>
      </div>
      <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', padding: '18px 24px', flexWrap: 'wrap' }}>
          <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
            Volumes do dia
          </h2>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <span style={css(v.selecionadosEstilo)}>
              {v.selecionadosRotulo}
            </span>
            <span onClick={v.openModal} style={{ padding: '9px 14px', borderRadius: '999px', background: '#F4F7FC', border: '1px solid #E6EAF2', fontSize: '12.5px', fontWeight: '600', color: '#46536A', cursor: 'pointer' }} className="dc13">
              Imprimir selecionados
            </span>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '26px minmax(110px,.8fr) minmax(110px,.8fr) minmax(170px,1.3fr) minmax(130px,1fr) minmax(140px,1fr) minmax(70px,.5fr) minmax(120px,.9fr)', gap: '14px', padding: '10px 24px', background: '#F8FAFE', borderTop: '1px solid #EEF1F7', borderBottom: '1px solid #EEF1F7', fontSize: '11.5px', letterSpacing: '.6px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
            <span>
            </span>
            <span>
              Volume
            </span>
            <span>
              Pedido
            </span>
            <span>
              Cliente
            </span>
            <span>
              Transportadora
            </span>
            <span>
              Rastreio
            </span>
            <span>
              Itens
            </span>
            <span>
              Status
            </span>
          </div>
          {v.volumes.map((v: any, i3: number) => (
            <div key={i3} onClick={v.abrir} style={{ display: 'grid', gridTemplateColumns: '26px minmax(110px,.8fr) minmax(110px,.8fr) minmax(170px,1.3fr) minmax(130px,1fr) minmax(140px,1fr) minmax(70px,.5fr) minmax(120px,.9fr)', gap: '14px', alignItems: 'center', padding: '14px 24px', borderBottom: '1px solid #F4F6FB', cursor: 'pointer' }} className="dc14">
              <span onClick={v.marcar} style={css(v.check)}>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: '#46536A' }}>
                {v.volume}
              </span>
              <a href={v.href} style={{ fontSize: '13px', fontWeight: '600' }}>
                {v.pedido}
              </a>
              <span style={{ fontSize: '13.5px', color: '#34405A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {v.cliente}
              </span>
              <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                {v.transportadora}
              </span>
              <span style={{ fontSize: '12.5px', color: '#9AA7BC', fontFamily: 'monospace' }}>
                {v.rastreio}
              </span>
              <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                {v.itens}
              </span>
              <span style={css(v.selo)}>
                {v.estado}
              </span>
            </div>
          ))}
          <p style={css(v.volumesVazio)}>
            Nenhum volume nesta aba.
          </p>
        </div>
      </div>
      <div style={css(v.ov)} onClick={v.closeModal}>
      </div>
      <div style={css(v.sh)}>
        <div style={{ width: 'min(620px, 100%)', maxHeight: '86vh', overflowY: 'auto', background: '#FFFFFF', borderRadius: '24px', boxShadow: '0 30px 70px rgba(11,18,32,.3)', pointerEvents: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', padding: '24px 26px 18px', borderBottom: '1px solid #F0F3F9' }}>
            <div style={{ minWidth: '0' }}>
              <h2 style={{ margin: '0', fontSize: '20px', fontWeight: '800', letterSpacing: '-.5px' }}>
                Gerar etiquetas
              </h2>
              <p style={{ margin: '6px 0 0', fontSize: '13.5px', color: '#6B7A90' }}>
                {v.modalResumo}
              </p>
            </div>
            <span onClick={v.closeModal} style={{ width: '36px', height: '36px', borderRadius: '12px', border: '1px solid #E6EAF2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7A90', cursor: 'pointer', flex: '0 0 auto' }} className="dc15">
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </span>
          </div>
          <div style={{ padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '0' }}>
                <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#6B7A90' }}>
                  Volumes
                </label>
                <input readOnly={true} value={v.modalContagem} style={{ height: '46px', padding: '0 15px', border: '1px solid #E6EAF2', borderRadius: '14px', fontFamily: 'inherit', fontSize: '14px', color: '#0B1220', minWidth: '0' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '0' }}>
                <label style={{ fontSize: '12.5px', fontWeight: '600', color: '#6B7A90' }}>
                  Formato
                </label>
                <input readOnly={true} value="100 × 150 mm" style={{ height: '46px', padding: '0 15px', border: '1px solid #E6EAF2', borderRadius: '14px', fontFamily: 'inherit', fontSize: '14px', color: '#0B1220', minWidth: '0' }} />
                <span style={{ fontSize: '11.5px', color: '#9AA7BC' }}>
                  o que a prévia ao lado imprime
                </span>
              </div>
            </div>
            <div style={{ border: '1px solid #E6EAF2', borderRadius: '18px', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.6fr 1fr', gap: '12px', padding: '10px 16px', background: '#F8FAFE', fontSize: '11.5px', letterSpacing: '.6px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
                <span>
                  Volume
                </span>
                <span>
                  Cliente
                </span>
                <span>
                  Serviço
                </span>
              </div>
              {v.modalLinhas.map((m: any, i5: number) => (
                <div key={i5} style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.6fr 1fr', gap: '12px', padding: '12px 16px', borderTop: '1px solid #F4F6FB', fontSize: '13px' }}>
                  <span style={{ fontWeight: '700' }}>
                    {m.volume}
                  </span>
                  <span>
                    {m.cliente}
                  </span>
                  <span style={{ color: '#6B7A90' }}>
                    {m.servico}
                  </span>
                </div>
              ))}
              <p style={css(v.modalVazio)}>
                Marque um volume na tabela para gerar a etiqueta.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', padding: '18px 26px', borderTop: '1px solid #F0F3F9', background: '#F8FAFE' }}>
            <button onClick={v.closeModal} style={{ whiteSpace: 'nowrap', height: '42px', padding: '0 18px', border: '1px solid #E6EAF2', borderRadius: '13px', background: '#FFFFFF', color: '#46536A', fontFamily: 'inherit', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer' }} className="dc16">
              Cancelar
            </button>
            <button onClick={v.imprimirPagina} style={{ whiteSpace: 'nowrap', height: '42px', padding: '0 20px', border: '0', borderRadius: '13px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', color: '#FFFFFF', fontFamily: 'inherit', fontSize: '13.5px', fontWeight: '700', cursor: 'pointer', boxShadow: '0 8px 18px rgba(37,99,235,.26)' }} className="dc17">
              {v.imprimirRotulo}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
