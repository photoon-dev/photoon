// Gerado por tools/dc2tsx.py a partir de Pedido.dc.html
// Transliteração fiel do design: não editar à mão, editar o .dc.html.
'use client';

import { css } from '@/lib/css';

export const CSS_PSEUDO = `
.dc1:hover { background: #F1F5FD; border-color: #D6E2FC; color: #2563EB; }
.dc2:hover { background: #F1F5FD; border-color: #D6E2FC; color: #2563EB; }
.dc3:hover { background: #FFE4E9; }
`;

export default function PedidoDesign({ v }: { v: any }) {
  return (
    <>
      <div style={{ padding: '26px 30px 60px', display: 'flex', flexDirection: 'column', gap: '20px', animation: 'riseIn .5s cubic-bezier(.2,.8,.2,1) both' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: '12px', letterSpacing: '1.6px', textTransform: 'uppercase', color: '#9AA7BC', fontWeight: '700' }}>
              Pedidos · Detalhe
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <h1 style={{ margin: '0', fontSize: '30px', fontWeight: '800', letterSpacing: '-1px' }}>
                {v.titulo}
              </h1>
              <span style={css(v.seloEstado)}>
                {v.estado}
              </span>
              <span style={css(v.seloPagamento)}>
                {v.pagamento}
              </span>
              <span style={css(v.seloNovo)}>
                Não visto
              </span>
            </div>
            <p style={{ margin: '0', fontSize: '14.5px', color: '#6B7A90' }}>
              {v.subtitulo}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <a href="/pedidos" style={{ textDecoration: 'none', whiteSpace: 'nowrap', height: '44px', padding: '0 18px', display: 'flex', alignItems: 'center', gap: '9px', border: '1px solid #E6EAF2', borderRadius: '14px', background: '#FFFFFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }} className="dc1">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H6M12 5l-7 7 7 7" />
              </svg>
              Todos os pedidos
            </a>
            <button onClick={v.marcarVisto} style={css(v.btnVisto)}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
                <circle cx="12" cy="12" r="2.8" />
              </svg>
              Marcar visto
            </button>
            <button onClick={v.voltar} style={css(v.btnVoltar)}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H6M12 5l-7 7 7 7" />
              </svg>
              {v.rotuloVoltar}
            </button>
            <button onClick={v.avancar} style={css(v.btnAvancar)}>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M12 5l7 7-7 7" />
              </svg>
              {v.rotuloAvancar}
            </button>
          </div>
        </div>
        <p style={css(v.avisoEstilo)}>
          {v.aviso}
        </p>
        <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 26px' }}>
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            {v.etapas.map((etapa: any, i4: number) => (
              <div key={i4} style={{ flex: '1', minWidth: '118px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={css(etapa.barra)}>
                </div>
                <div>
                  <p style={css(etapa.tituloEstilo)}>
                    {etapa.titulo}
                  </p>
                  <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#9AA7BC' }}>
                    {etapa.nota}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '20px', alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 26px 16px' }}>
                <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                  Itens do pedido
                </h2>
                <span style={{ fontSize: '13px', color: '#6B7A90' }}>
                  {v.itensResumo}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {v.itens.map((item: any, i6: number) => (
                  <div key={i6} style={{ display: 'grid', gridTemplateColumns: '64px 1fr auto auto', gap: '16px', alignItems: 'center', padding: '16px 26px', borderTop: '1px solid #F4F6FB' }}>
                    <span style={{ width: '64px', height: '64px', borderRadius: '16px', background: '#F1F5FD', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 5.5A1.5 1.5 0 0 1 6.5 4H12v16H6.5A1.5 1.5 0 0 1 5 18.5z" />
                        <path d="M19 5.5A1.5 1.5 0 0 0 17.5 4H12v16h5.5a1.5 1.5 0 0 0 1.5-1.5z" />
                      </svg>
                    </span>
                    <div style={{ minWidth: '0' }}>
                      <p style={{ margin: '0', fontSize: '14.5px', fontWeight: '600' }}>
                        {item.descricao}
                      </p>
                      <p style={{ margin: '3px 0 0', fontSize: '12.5px', color: '#6B7A90' }}>
                        {item.detalhe}
                      </p>
                    </div>
                    <span style={{ fontSize: '13px', color: '#6B7A90', whiteSpace: 'nowrap' }}>
                      {item.quantidade}
                    </span>
                    <span style={{ fontSize: '14.5px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                      {item.total}
                    </span>
                  </div>
                ))}
                <p style={css(v.itensVazio)}>
                  Este pedido não tem item gravado. Nada é somado por conta própria.
                </p>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '40px', padding: '18px 26px', background: '#F8FAFE', borderTop: '1px solid #EEF1F7', flexWrap: 'wrap' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0', fontSize: '12.5px', color: '#6B7A90' }}>
                      Subtotal
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: '15px', fontWeight: '600' }}>
                      {v.subtotal}
                    </p>
                  </div>
                  <div style={css(v.descontoEstilo)}>
                    <p style={{ margin: '0', fontSize: '12.5px', color: '#6B7A90' }}>
                      Desconto
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: '15px', fontWeight: '600', color: '#059669' }}>
                      {v.desconto}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0', fontSize: '12.5px', color: '#6B7A90' }}>
                      Frete
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: '15px', fontWeight: '600' }}>
                      {v.frete}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: '0', fontSize: '12.5px', color: '#6B7A90' }}>
                      Total
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: '800', letterSpacing: '-.6px' }}>
                      {v.total}
                    </p>
                  </div>
                </div>
              </div>
              <p style={css(v.observacaoEstilo)}>
                {v.observacao}
              </p>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: '0', fontSize: '18px', fontWeight: '700' }}>
                  Produção
                </h2>
                <span style={css(v.producaoSelo)}>
                  {v.producaoEtapa}
                </span>
              </div>
              <div style={css(v.producaoTiles)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7' }}>
                  <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#EAF0FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="8.5" />
                      <path d="M12 7.5v5l3 2" />
                    </svg>
                  </span>
                  <div style={{ minWidth: '0' }}>
                    <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                      Atualizado
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                      {v.producaoQuando}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7' }}>
                  <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#E4F8FC', color: '#0891B2', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="3.4" />
                      <path d="M5 20c.8-3.6 3.6-5.6 7-5.6s6.2 2 7 5.6" />
                    </svg>
                  </span>
                  <div style={{ minWidth: '0' }}>
                    <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                      Responsável
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                      {v.producaoResponsavel}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '16px', background: '#F8FAFE', border: '1px solid #EEF1F7' }}>
                  <span style={{ width: '34px', height: '34px', borderRadius: '11px', background: '#E6F8F1', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="4" y="5" width="16" height="15" rx="3" />
                      <path d="M8 3v4M16 3v4M4 10h16" />
                    </svg>
                  </span>
                  <div style={{ minWidth: '0' }}>
                    <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                      Prazo
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6B7A90' }}>
                      {v.prazo}
                    </p>
                  </div>
                </div>
              </div>
              <p style={css(v.producaoForaEstilo)}>
                Este pedido ainda não entrou na produção.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                <button onClick={v.colocarNaFila} style={css(v.btnFila)}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                  Colocar na fila
                </button>
                {v.etapasDisponiveis.map((mover: any, i6: number) => (
                  <button key={i6} onClick={mover.ir} style={css(mover.estilo)}>
                    {mover.rotulo}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 26px' }}>
              <h2 style={{ margin: '0 0 18px', fontSize: '18px', fontWeight: '700' }}>
                Histórico
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {v.historico.map((linha: any, i6: number) => (
                  <div key={i6} style={{ display: 'flex', gap: '14px' }}>
                    <span style={css(linha.ponto)}>
                    </span>
                    <div>
                      <p style={{ margin: '0', fontSize: '13.5px', fontWeight: '600' }}>
                        {linha.titulo}
                      </p>
                      <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#9AA7BC' }}>
                        {linha.quando}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 24px' }}>
              <h2 style={{ margin: '0 0 16px', fontSize: '17px', fontWeight: '700' }}>
                Cliente
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ width: '36px', height: '36px', borderRadius: '12px', background: '#EAF0FF', color: '#2563EB', fontSize: '12.5px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' }}>
                  {v.clienteIniciais}
                </span>
                <div style={{ minWidth: '0' }}>
                  <p style={{ margin: '0', fontSize: '14px', fontWeight: '700' }}>
                    {v.clienteNome}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '12.5px', color: '#6B7A90' }}>
                    {v.clienteNota}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13.5px', color: '#46536A' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <span style={{ color: '#9AA7BC' }}>
                    Contato
                  </span>
                  <span style={{ textAlign: 'right', minWidth: '0' }}>
                    {v.clienteEmail}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <span style={{ color: '#9AA7BC' }}>
                    Vendedor
                  </span>
                  <span style={{ textAlign: 'right' }}>
                    {v.vendedor}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                  <span style={{ color: '#9AA7BC' }}>
                    Prazo
                  </span>
                  <span style={{ textAlign: 'right', fontWeight: '700' }}>
                    {v.prazo}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 24px' }}>
              <h2 style={{ margin: '0 0 16px', fontSize: '17px', fontWeight: '700' }}>
                Pagamento
              </h2>
              <div style={{ padding: '16px', borderRadius: '18px', background: 'linear-gradient(150deg,#F1F5FD,#E4F8FC)', marginBottom: '14px' }}>
                <p style={{ margin: '0 0 6px', fontSize: '12.5px', color: '#6B7A90' }}>
                  {v.pagoTitulo}
                </p>
                <p style={{ margin: '0', fontSize: '24px', fontWeight: '800', letterSpacing: '-.8px' }}>
                  {v.pagoValor}
                </p>
                <p style={{ margin: '6px 0 0', fontSize: '12.5px', color: '#6B7A90' }}>
                  {v.pagoNota}
                </p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px', color: '#46536A' }}>
                {v.pagamentos.map((cobranca: any, i6: number) => (
                  <div key={i6} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', flexWrap: 'wrap' }}>
                      <span style={css(cobranca.selo)}>
                        {cobranca.estado}
                      </span>
                      <span style={{ fontWeight: '700' }}>
                        {cobranca.valor}
                      </span>
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#9AA7BC' }}>
                      {cobranca.nota}
                    </span>
                  </div>
                ))}
                <p style={css(v.pagamentosVazio)}>
                  Nenhuma cobrança registrada para este pedido.
                </p>
              </div>
            </div>
            <div style={{ background: '#FFFFFF', border: '1px solid #E6EAF2', borderRadius: '24px', padding: '22px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <h2 style={{ margin: '0', fontSize: '17px', fontWeight: '700' }}>
                  Entrega
                </h2>
                <span style={css(v.envioSelo)}>
                  {v.envioEstado}
                </span>
              </div>
              <p style={css(v.envioForaEstilo)}>
                Nenhum envio aberto para este pedido.
              </p>
              <button onClick={v.abrirEnvio} style={css(v.btnEnvio)}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8h11v9H3z" />
                  <path d="M14 11h4l3 3v3h-7z" />
                  <circle cx="7" cy="18" r="1.8" />
                  <circle cx="17.5" cy="18" r="1.8" />
                </svg>
                Abrir envio
              </button>
              <form onSubmit={v.salvarRastreio} style={css(v.envioFormEstilo)}>
                <label style={{ display: 'block' }}>
                  <span style={{ display: 'block', marginBottom: '7px', fontSize: '12.5px', fontWeight: '600', color: '#6B7A90' }}>
                    Transportadora
                  </span>
                  <input name="transportadora" defaultValue={v.transportadora} placeholder="Correios, motoboy, retirada" style={{ width: '100%', height: '44px', padding: '0 14px', border: '1px solid #E6EAF2', borderRadius: '12px', background: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', color: '#0B1220' }} />
                </label>
                <label style={{ display: 'block', marginTop: '12px' }}>
                  <span style={{ display: 'block', marginBottom: '7px', fontSize: '12.5px', fontWeight: '600', color: '#6B7A90' }}>
                    Rastreio
                  </span>
                  <input name="rastreio" defaultValue={v.rastreio} placeholder="Código de acompanhamento" style={{ width: '100%', height: '44px', padding: '0 14px', border: '1px solid #E6EAF2', borderRadius: '12px', background: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', color: '#0B1220' }} />
                </label>
                <button style={{ width: '100%', height: '44px', marginTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', border: '1px solid #E6EAF2', borderRadius: '12px', background: '#FFFFFF', color: '#0B1220', fontFamily: 'inherit', fontSize: '13.5px', fontWeight: '600', cursor: 'pointer' }} className="dc2">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5 10 17.5 19 7" />
                  </svg>
                  Salvar rastreio
                </button>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' }}>
                  {v.estadosEnvio.map((passo: any, i7: number) => (
                    <button key={i7} type="button" onClick={passo.ir} style={css(passo.estilo)}>
                      {passo.rotulo}
                    </button>
                  ))}
                </div>
              </form>
            </div>
            <div style={{ background: '#0B1220', borderRadius: '24px', padding: '22px 24px', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{ width: '76px', height: '76px', borderRadius: '16px', background: 'linear-gradient(135deg,#2563EB,#06B6D4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: '800', letterSpacing: '-.6px', flex: '0 0 auto' }}>
                {v.osNumero}
              </div>
              <div style={{ minWidth: '0' }}>
                <p style={{ margin: '0 0 6px', fontSize: '12px', letterSpacing: '1.6px', textTransform: 'uppercase', color: 'rgba(255,255,255,.55)' }}>
                  Ordem de serviço
                </p>
                <p style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: '700' }}>
                  {v.osTitulo}
                </p>
                <p style={{ margin: '0', fontSize: '12.5px', color: 'rgba(255,255,255,.6)' }}>
                  {v.osNota}
                </p>
              </div>
            </div>
            <form onSubmit={v.cancelar} style={css(v.cancelarEstilo)}>
              <h2 style={{ margin: '0 0 6px', fontSize: '17px', fontWeight: '700' }}>
                Cancelar pedido
              </h2>
              <p style={{ margin: '0 0 14px', fontSize: '12.5px', color: '#9AA7BC' }}>
                O motivo fica gravado no pedido e aparece para quem abrir depois.
              </p>
              <input name="motivo" placeholder="Por que o pedido foi cancelado" style={{ width: '100%', height: '44px', padding: '0 14px', border: '1px solid #E6EAF2', borderRadius: '12px', background: '#FFFFFF', fontFamily: 'inherit', fontSize: '14px', color: '#0B1220' }} />
              <button style={{ width: '100%', height: '44px', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '9px', border: '1px solid #FFE0E6', borderRadius: '12px', background: '#FFF1F3', color: '#E11D48', fontFamily: 'inherit', fontSize: '13.5px', fontWeight: '700', cursor: 'pointer' }} className="dc3">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
                Cancelar pedido
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
