'use client';

import { useState } from 'react';
import type { GatewayConectado } from '@/lib/financeiro';
import {
  alternarGateway,
  alternarMetodoGateway,
  conectarGateway,
  desconectarGateway,
} from '@/app/app/actions-sistema';

/**
 * Integrações de pagamento por loja.
 *
 * Cada lojista conecta o PRÓPRIO gateway: o dinheiro do álbum cai na conta
 * dele, não na da plataforma. A credencial digitada aqui é cifrada no servidor
 * (`src/lib/cripto.ts`) antes de ir ao banco e nunca volta ao navegador — o
 * mais que esta tela mostra são os quatro últimos caracteres.
 */

const CARD = 'rounded-[18px] border border-line bg-surface';
const CAMPO =
  'h-11 w-full rounded-[14px] border border-line bg-surface px-3.5 text-[14px] text-ink outline-none focus:border-blue';
const ROTULO = 'text-[12.5px] font-semibold text-ink-3';
const AJUDA = 'text-[11.5px] text-muted-2';
const BOTAO_PRIMARIO =
  'flex h-11 items-center justify-center gap-2 rounded-[14px] bg-lente px-4 text-[13.5px] font-bold text-white shadow-card hover:brightness-[1.06] disabled:opacity-50';
const BOTAO =
  'flex h-11 items-center justify-center gap-2 rounded-[14px] border border-line bg-surface px-4 text-[13.5px] font-semibold text-ink hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue';

type Campo = { chave: string; rotulo: string; ajuda: string };
type Provedor = {
  id: string;
  nome: string;
  resumo: string;
  /** Qual credencial é o segredo — é dela que sai a máscara `••••1234`. */
  principal: string;
  campos: Campo[];
  metodos: ('pix' | 'cartao' | 'boleto')[];
};

/**
 * Catálogo dos gateways aceitos.
 *
 * Mora no componente porque só a tela precisa dos rótulos: o servidor valida o
 * `id` contra a sua própria lista e trata as credenciais como pares
 * nome/valor, sem depender deste desenho.
 */
export const PROVEDORES: Provedor[] = [
  {
    id: 'mercadopago',
    nome: 'Mercado Pago',
    resumo: 'Pix, cartão e boleto numa API só. O mais usado no Brasil.',
    principal: 'access_token',
    campos: [
      {
        chave: 'access_token',
        rotulo: 'Access token',
        ajuda: 'Painel do Mercado Pago → Suas integrações → Credenciais de produção.',
      },
      { chave: 'public_key', rotulo: 'Public key', ajuda: 'Usada no formulário de cartão.' },
    ],
    metodos: ['pix', 'cartao', 'boleto'],
  },
  {
    id: 'asaas',
    nome: 'Asaas',
    resumo: 'Cobrança recorrente e split. Cobre Pix, cartão e boleto.',
    principal: 'api_key',
    campos: [
      { chave: 'api_key', rotulo: 'Chave de API', ajuda: 'Asaas → Integrações → Chave de API.' },
      {
        chave: 'wallet_id',
        rotulo: 'Wallet ID',
        ajuda: 'Opcional. Só é necessário se você usa split de recebimento.',
      },
    ],
    metodos: ['pix', 'cartao', 'boleto'],
  },
  {
    id: 'pagseguro',
    nome: 'PagSeguro',
    resumo: 'PagBank. Pix, cartão e boleto com a conta que você já tem.',
    principal: 'token',
    campos: [
      { chave: 'token', rotulo: 'Token', ajuda: 'PagBank → Vendas online → Integrações.' },
      { chave: 'email', rotulo: 'E-mail da conta', ajuda: 'O e-mail cadastrado no PagBank.' },
    ],
    metodos: ['pix', 'cartao', 'boleto'],
  },
  {
    id: 'stripe',
    nome: 'Stripe',
    resumo: 'Cartão internacional. Não emite Pix nem boleto no Brasil.',
    principal: 'secret_key',
    campos: [
      { chave: 'secret_key', rotulo: 'Secret key', ajuda: 'Começa com sk_live_. Nunca a compartilhe.' },
      { chave: 'publishable_key', rotulo: 'Publishable key', ajuda: 'Começa com pk_live_.' },
    ],
    metodos: ['cartao'],
  },
];

const METODO_ROTULO = { pix: 'Pix', cartao: 'Cartão', boleto: 'Boleto' } as const;

/** Alternador de método: um form por botão, porque cada um grava uma coluna diferente. */
function Alternador({
  provedor,
  metodo,
  ligado,
}: {
  provedor: string;
  metodo: 'pix' | 'cartao' | 'boleto';
  ligado: boolean;
}) {
  return (
    <form action={alternarMetodoGateway}>
      <input type="hidden" name="provedor" value={provedor} />
      <input type="hidden" name="metodo" value={metodo} />
      <input type="hidden" name="ligar" value={ligado ? '0' : '1'} />
      <button
        type="submit"
        aria-pressed={ligado}
        className={`flex h-9 items-center gap-2 rounded-full border px-3 text-[12.5px] font-semibold ${
          ligado
            ? 'border-transparent bg-green-surface text-[#047857]'
            : 'border-line bg-surface text-muted hover:text-blue'
        }`}
      >
        <span
          className={`flex h-4 w-7 items-center rounded-full p-0.5 ${ligado ? 'bg-[#10B981]' : 'bg-[#D7DEEA]'}`}
        >
          <span
            className={`h-3 w-3 rounded-full bg-white transition-transform ${ligado ? 'translate-x-3' : ''}`}
          />
        </span>
        {METODO_ROTULO[metodo]}
      </button>
    </form>
  );
}

export default function PainelIntegracoes({
  gateways,
  cifragemOk,
}: {
  gateways: GatewayConectado[];
  /** `false` quando falta `CHAVE_CIFRAGEM` no servidor: a tela recusa o formulário em vez de gravar segredo em texto puro. */
  cifragemOk: boolean;
}) {
  const [aberto, setAberto] = useState<string | null>(null);
  const conectados = new Map(gateways.map((g) => [g.provedor, g]));

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="m-0 text-[12.5px] font-semibold uppercase tracking-[1.2px] text-muted-2">
          Sistema · Integrações
        </p>
        <h1 className="m-0 mt-1.5 text-[26px] font-extrabold tracking-[-.9px]">
          Gateways de pagamento
        </h1>
        <p className="m-0 mt-1.5 text-[13.5px] text-muted">
          Conecte a sua conta no gateway e escolha o que a loja aceita. O pagamento do seu cliente
          cai direto na sua conta.
        </p>
      </div>

      {!cifragemOk && (
        <p className="m-0 rounded-[14px] bg-coral-surface px-4 py-3 text-[13px] font-semibold leading-[1.55] text-coral">
          O servidor está sem <code>CHAVE_CIFRAGEM</code>. Enquanto ela não existir, conectar
          gateway fica bloqueado — guardar chave de pagamento em texto puro no banco não é uma opção.
          Defina a variável no ambiente do app (por exemplo{' '}
          <code>openssl rand -hex 32</code>) e reinicie.
        </p>
      )}

      <p className="m-0 rounded-[14px] bg-blue-soft px-4 py-3 text-[12.5px] leading-[1.55] text-ink-3">
        A credencial é cifrada com AES-256-GCM antes de ser gravada e a chave vive fora do banco.
        Depois de salva ela não volta mais para esta tela: para trocá-la, digite a nova por inteiro.
      </p>

      {PROVEDORES.map((p) => {
        const g = conectados.get(p.id);
        const editando = aberto === p.id;

        return (
          <section key={p.id} className={`${CARD} p-6`}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <p className="m-0 text-[15px] font-bold">{p.nome}</p>
                  {g ? (
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11.5px] font-bold ${
                        g.ativo ? 'bg-green-surface text-[#047857]' : 'bg-line-2 text-muted'
                      }`}
                    >
                      {g.ativo ? 'Conectado' : 'Suspenso'}
                    </span>
                  ) : (
                    <span className="rounded-full bg-line-2 px-2.5 py-1 text-[11.5px] font-bold text-muted">
                      Não conectado
                    </span>
                  )}
                  {g?.mascara && (
                    <span className="text-[12px] text-muted-2">chave {g.mascara}</span>
                  )}
                </div>
                <p className="m-0 mt-1.5 max-w-[560px] text-[12.5px] leading-[1.5] text-muted">
                  {p.resumo}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {g && (
                  <form action={alternarGateway}>
                    <input type="hidden" name="provedor" value={p.id} />
                    <input type="hidden" name="ativo" value={g.ativo ? '0' : '1'} />
                    <button type="submit" className={BOTAO}>
                      {g.ativo ? 'Suspender' : 'Reativar'}
                    </button>
                  </form>
                )}
                <button
                  type="button"
                  disabled={!cifragemOk}
                  onClick={() => setAberto(editando ? null : p.id)}
                  className={g ? BOTAO : BOTAO_PRIMARIO}
                >
                  {editando ? 'Cancelar' : g ? 'Trocar credenciais' : 'Conectar'}
                </button>
              </div>
            </div>

            {g?.ilegivel && (
              <p className="m-0 mt-4 rounded-[14px] bg-amber-surface px-4 py-3 text-[12.5px] font-semibold leading-[1.5] text-[#B45309]">
                A credencial guardada não abre com a chave de cifragem atual. Ou{' '}
                <code>CHAVE_CIFRAGEM</code> mudou, ou a linha foi alterada por fora. Reconecte o
                gateway digitando as chaves de novo.
              </p>
            )}

            {g && (
              <div className="mt-4 border-t border-line-2 pt-4">
                <p className="m-0 mb-2.5 text-[12.5px] font-semibold text-ink-3">
                  Métodos aceitos nesta loja
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {p.metodos.map((m) => (
                    <Alternador
                      key={m}
                      provedor={p.id}
                      metodo={m}
                      ligado={
                        m === 'pix' ? g.aceitaPix : m === 'cartao' ? g.aceitaCartao : g.aceitaBoleto
                      }
                    />
                  ))}
                  {!g.aceitaPix && !g.aceitaCartao && !g.aceitaBoleto && (
                    <span className="text-[12px] text-[#B45309]">
                      Nenhum método ligado — o cliente não conseguirá pagar por este gateway.
                    </span>
                  )}
                </div>
              </div>
            )}

            {editando && (
              <form action={conectarGateway} className="mt-4 border-t border-line-2 pt-4">
                <input type="hidden" name="provedor" value={p.id} />
                <input type="hidden" name="principal" value={p.principal} />

                <div className="grid gap-3 sm:grid-cols-2">
                  {p.campos.map((c) => (
                    <label key={c.chave} className="flex flex-col gap-1.5">
                      <span className={ROTULO}>{c.rotulo}</span>
                      <input
                        // `password` para não ficar legível na tela de quem
                        // está do lado, e `off` porque gerenciador de senha
                        // guardando token de gateway é vazamento silencioso.
                        type="password"
                        name={`cred_${c.chave}`}
                        autoComplete="off"
                        className={CAMPO}
                        required={c.chave === p.principal}
                      />
                      <span className={AJUDA}>{c.ajuda}</span>
                    </label>
                  ))}
                </div>

                <p className="m-0 mb-2 mt-4 text-[12.5px] font-semibold text-ink-3">
                  O que este gateway vai aceitar
                </p>
                <div className="flex flex-wrap gap-4">
                  {p.metodos.map((m) => (
                    <label key={m} className="flex items-center gap-2 text-[13px] text-ink-3">
                      <input
                        type="checkbox"
                        name={`aceita_${m}`}
                        defaultChecked={
                          g
                            ? m === 'pix'
                              ? g.aceitaPix
                              : m === 'cartao'
                                ? g.aceitaCartao
                                : g.aceitaBoleto
                            : true
                        }
                        className="h-4 w-4 accent-[#2563EB]"
                      />
                      {METODO_ROTULO[m]}
                    </label>
                  ))}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="submit" className={BOTAO_PRIMARIO}>
                    Salvar e conectar
                  </button>
                </div>
              </form>
            )}

            {g && !editando && (
              <form action={desconectarGateway} className="mt-4">
                <input type="hidden" name="provedor" value={p.id} />
                <button
                  type="submit"
                  className="text-[12.5px] font-semibold text-muted hover:text-coral"
                >
                  Desconectar e apagar a credencial
                </button>
              </form>
            )}
          </section>
        );
      })}
    </div>
  );
}
