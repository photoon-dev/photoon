'use client';

/**
 * Financeiro — `/financeiro`.
 *
 * A rota estava no menu como `pronto: false` e não existia; `/carteira` e
 * `/pagamentos` continuavam de pé apontando para cá. Esta tela é o destino que
 * faltava.
 *
 * Três abas, todas ligadas ao banco:
 *   - Visão geral: KPIs do período, recebimento por dia e por método
 *   - Recebimentos: o extrato de `pagamentos`, linha a linha
 *   - Gateways: `lojista_gateways`, com a credencial mascarada no servidor
 *
 * O briefing prevê mais abas (repasses, conciliação, notas). Elas não entram
 * aqui enquanto não houver tabela: uma aba com número inventado é pior que uma
 * aba que ainda não existe — quem confere caixa não pode desconfiar da tela.
 *
 * Período e aba vivem na URL, como em Pedidos: o link de "recebimentos dos
 * últimos 90 dias" é guardável e o botão de voltar funciona.
 *
 * Densidade alinhada a `/pedidos`: KPIs compactos, tabela com linha de 12/18 e
 * fonte 13, filtros de altura 36.
 */

import { useRouter, useSearchParams } from 'next/navigation';
import Abas from '@/components/ui/Abas';
import CartaoKPI from '@/components/ui/CartaoKPI';
import Selo from '@/components/ui/Selo';
import Tabela, { type Coluna } from '@/components/ui/Tabela';
import EstadoVazio from '@/components/ui/EstadoVazio';
import { COR, RAIO, SOMBRA, type Tom } from '@/components/ui/tokens';
import { moeda, dataHora } from '@/lib/pedidos-termos';
import type { Carteira, GatewayConectado, LinhaExtrato, Periodo } from '@/lib/financeiro';

/** Um estado de pagamento, um tom — o mesmo em toda tela que os mostra. */
const TOM_PAGAMENTO: Record<string, { rotulo: string; tom: Tom }> = {
  aprovado: { rotulo: 'Aprovado', tom: 'verde' },
  pendente: { rotulo: 'Pendente', tom: 'ambar' },
  recusado: { rotulo: 'Recusado', tom: 'coral' },
  estornado: { rotulo: 'Estornado', tom: 'coral' },
  expirado: { rotulo: 'Expirado', tom: 'neutro' },
};

const METODO: Record<string, string> = {
  pix: 'Pix',
  cartao: 'Cartão',
  boleto: 'Boleto',
  manual: 'Manual',
};

export default function FinanceiroDaLoja({
  carteira,
  gateways,
  periodo,
  cifragemOk,
}: {
  carteira: Carteira;
  gateways: GatewayConectado[];
  periodo: Periodo;
  cifragemOk: boolean;
}) {
  const router = useRouter();
  const busca = useSearchParams();
  const aba = busca.get('aba') ?? 'visao';

  const irPara = (mudanca: Record<string, string | null>) => {
    const q = new URLSearchParams(busca.toString());
    for (const [k, v] of Object.entries(mudanca)) {
      if (v === null || v === '') q.delete(k);
      else q.set(k, v);
    }
    router.push(`/financeiro${q.toString() ? `?${q}` : ''}`);
  };

  const vazio = !carteira.temAlgumPagamento;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 260 }}>
          <p
            style={{
              margin: '0 0 4px',
              fontSize: 11,
              letterSpacing: '1.4px',
              textTransform: 'uppercase',
              color: COR.fraco,
              fontWeight: 700,
            }}
          >
            Gestão
          </p>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>
            Financeiro
          </h1>
          <p style={{ margin: '4px 0 0', fontSize: 13.5, color: COR.apagado, maxWidth: '68ch' }}>
            Recebimentos, extrato e meios de pagamento da loja. Período de {periodo.de} a{' '}
            {periodo.ate}.
          </p>
        </div>
        <PeriodoBotoes atual={periodo.dias} aoTrocar={(d) => irPara({ dias: d })} />
      </div>

      {/* KPIs do período */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 10 }}>
        <CartaoKPI
          rotulo="Recebido"
          valor={moeda(carteira.recebido)}
          nota={`${carteira.quantidade.recebido} pagamento(s)`}
          tom="verde"
          compacto
        />
        <CartaoKPI
          rotulo="A receber"
          valor={moeda(carteira.aReceber)}
          nota={`${carteira.quantidade.aReceber} pendente(s)`}
          tom="ambar"
          compacto
        />
        <CartaoKPI
          rotulo="Estornado"
          valor={moeda(carteira.estornado)}
          nota={`${carteira.quantidade.estornado} estorno(s)`}
          tom="coral"
          compacto
        />
        <CartaoKPI
          rotulo="Não concretizado"
          valor={moeda(carteira.naoConcretizado)}
          nota={`${carteira.quantidade.naoConcretizado} recusado(s) ou expirado(s)`}
          compacto
        />
      </div>

      <Abas
        abas={[
          { chave: 'visao', rotulo: 'Visão geral' },
          { chave: 'recebimentos', rotulo: 'Recebimentos', contagem: carteira.extrato.length },
          { chave: 'gateways', rotulo: 'Gateways', contagem: gateways.length },
        ]}
        ativa={aba}
        aoTrocar={(c) => irPara({ aba: c === 'visao' ? null : c })}
      />

      {carteira.truncado && (
        <p
          style={{
            margin: 0,
            padding: '10px 14px',
            borderRadius: 12,
            background: '#FEF3E2',
            border: '1px solid #FADFB4',
            color: '#8A5A12',
            fontSize: 13,
          }}
        >
          O recorte passou do teto de leitura e foi truncado. Estreite o período para conferir
          caixa com segurança.
        </p>
      )}

      {aba === 'visao' &&
        (vazio ? (
          <EstadoVazio
            titulo="Nenhum pagamento registrado ainda"
            descricao="Assim que o primeiro pedido for pago, o recebimento aparece aqui."
          />
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)',
              gap: 14,
              alignItems: 'start',
            }}
          >
            <Bloco titulo="Recebido por dia">
              {carteira.porDia.length === 0 ? (
                <Nota>Nenhum recebimento neste período.</Nota>
              ) : (
                <Barras dados={carteira.porDia.map((d) => ({ rotulo: d.dia, valor: d.valor }))} />
              )}
            </Bloco>

            <Bloco titulo="Por método">
              {carteira.porMetodo.length === 0 ? (
                <Nota>Nenhum recebimento neste período.</Nota>
              ) : (
                <div style={{ marginTop: 6 }}>
                  {carteira.porMetodo.map((m) => (
                    <div
                      key={m.metodo}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'minmax(0,1fr) auto',
                        gap: 10,
                        alignItems: 'baseline',
                        padding: '9px 0',
                        borderTop: `1px solid ${COR.linhaClara}`,
                        fontSize: 13,
                      }}
                    >
                      <span style={{ color: COR.texto }}>
                        {METODO[m.metodo] ?? m.metodo}{' '}
                        <span style={{ color: COR.fraco }}>· {m.quantidade}</span>
                      </span>
                      <span
                        style={{
                          fontWeight: 700,
                          color: COR.tinta,
                          fontVariantNumeric: 'tabular-nums',
                        }}
                      >
                        {moeda(m.valor)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Bloco>
          </div>
        ))}

      {aba === 'recebimentos' &&
        (carteira.extrato.length === 0 ? (
          <EstadoVazio
            titulo="Sem recebimentos no período"
            descricao={
              vazio
                ? 'A loja ainda não registrou nenhum pagamento.'
                : 'Existem pagamentos fora deste recorte. Amplie o período.'
            }
          />
        ) : (
          <Tabela<LinhaExtrato>
            linhas={carteira.extrato}
            chaveDe={(l) => l.id}
            colunas={COLUNAS_EXTRATO}
            vazio={<EstadoVazio titulo="Sem recebimentos" descricao="Nada neste recorte." />}
          />
        ))}

      {aba === 'gateways' && (
        <>
          {!cifragemOk && (
            <p
              style={{
                margin: '0 0 14px',
                padding: '10px 14px',
                borderRadius: 12,
                background: '#FFF1F3',
                border: '1px solid #FBD0D9',
                color: '#9F1239',
                fontSize: 13,
              }}
            >
              A chave de cifragem não está configurada no servidor. Sem ela, credenciais novas de
              gateway não podem ser guardadas com segurança.
            </p>
          )}
          {gateways.length === 0 ? (
            <EstadoVazio
              titulo="Nenhum gateway conectado"
              descricao="Conecte um provedor para receber por Pix, cartão ou boleto."
            />
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 12,
              }}
            >
              {gateways.map((g) => (
                <div
                  key={g.provedor}
                  style={{
                    background: COR.papel,
                    border: `1px solid ${COR.linha}`,
                    borderRadius: RAIO.cartao,
                    padding: '14px 16px',
                    boxShadow: SOMBRA.cartao,
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: 14.5, fontWeight: 700, color: COR.tinta }}>
                      {g.provedor}
                    </span>
                    <Selo tom={g.ilegivel ? 'coral' : g.ativo ? 'verde' : 'neutro'}>
                      {g.ilegivel ? 'Credencial ilegível' : g.ativo ? 'Ativo' : 'Inativo'}
                    </Selo>
                  </div>
                  <p style={{ margin: '8px 0 0', fontSize: 12.5, color: COR.apagado }}>
                    {[g.aceitaPix && 'Pix', g.aceitaCartao && 'Cartão', g.aceitaBoleto && 'Boleto']
                      .filter(Boolean)
                      .join(' · ') || 'Nenhum meio habilitado'}
                  </p>
                  <p
                    style={{
                      margin: '6px 0 0',
                      fontSize: 12.5,
                      color: COR.fraco,
                      fontFamily: 'ui-monospace, monospace',
                    }}
                  >
                    {g.mascara ? `chave ${g.mascara}` : 'sem credencial guardada'}
                  </p>
                  <p style={{ margin: '6px 0 0', fontSize: 11.5, color: COR.fraco }}>
                    Conectado em {dataHora(g.criadoEm)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* -------------------------------- pedaços -------------------------------- */

const COLUNAS_EXTRATO: Coluna<LinhaExtrato>[] = [
  { chave: 'data', titulo: 'Data', largura: '150px', render: (l) => dataHora(l.data) },
  {
    chave: 'pedido',
    titulo: 'Pedido',
    largura: '110px',
    render: (l) =>
      l.pedidoNumero ? (
        <span style={{ fontFamily: 'ui-monospace, monospace' }}>#{l.pedidoNumero}</span>
      ) : (
        '—'
      ),
  },
  { chave: 'cliente', titulo: 'Cliente', largura: '1.4fr', render: (l) => l.cliente ?? '—' },
  { chave: 'metodo', titulo: 'Método', largura: '110px', render: (l) => METODO[l.metodo] ?? l.metodo },
  { chave: 'provedor', titulo: 'Provedor', largura: '1fr', render: (l) => l.provedor ?? '—' },
  {
    chave: 'estado',
    titulo: 'Estado',
    largura: '130px',
    render: (l) => {
      const t = TOM_PAGAMENTO[l.estado] ?? { rotulo: l.estado, tom: 'neutro' as Tom };
      return <Selo tom={t.tom}>{t.rotulo}</Selo>;
    },
  },
  {
    chave: 'valor',
    titulo: 'Valor',
    largura: '130px',
    alinha: 'right',
    render: (l) => (
      <span style={{ fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{moeda(l.valor)}</span>
    ),
  },
];

function PeriodoBotoes({
  atual,
  aoTrocar,
}: {
  atual: number | null;
  aoTrocar: (dias: string) => void;
}) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {[7, 30, 90].map((d) => {
        const on = atual === d;
        return (
          <button
            key={d}
            type="button"
            onClick={() => aoTrocar(String(d))}
            style={{
              height: 36,
              padding: '0 14px',
              borderRadius: 10,
              border: `1px solid ${on ? COR.azul : COR.linha}`,
              background: on ? COR.azul : COR.papel,
              color: on ? '#fff' : COR.texto,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {d} dias
          </button>
        );
      })}
    </div>
  );
}

function Bloco({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        background: COR.papel,
        border: `1px solid ${COR.linha}`,
        borderRadius: RAIO.cartao,
        padding: '14px 16px 16px',
        boxShadow: SOMBRA.cartao,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: COR.tinta }}>{titulo}</h2>
      {children}
    </section>
  );
}

const Nota = ({ children }: { children: React.ReactNode }) => (
  <p style={{ margin: '10px 0 0', fontSize: 13, color: COR.apagado }}>{children}</p>
);

/**
 * Barras do recebimento por dia.
 *
 * SVG inline em vez de biblioteca: é uma série só, sem eixo e sem interação —
 * carregar um pacote de gráfico para isso pesaria mais que a tela inteira.
 */
function Barras({ dados }: { dados: { rotulo: string; valor: number }[] }) {
  const teto = Math.max(...dados.map((d) => d.valor), 1);
  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: 120 }}>
        {dados.map((d) => (
          <div
            key={d.rotulo}
            title={`${d.rotulo}: ${moeda(d.valor)}`}
            style={{
              flex: 1,
              minWidth: 2,
              height: `${Math.max(2, (d.valor / teto) * 100)}%`,
              background: COR.gradiente,
              borderRadius: '4px 4px 0 0',
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 8,
          fontSize: 11.5,
          color: COR.fraco,
        }}
      >
        <span>{dados[0]?.rotulo}</span>
        <span>pico {moeda(teto)}</span>
        <span>{dados[dados.length - 1]?.rotulo}</span>
      </div>
    </div>
  );
}
