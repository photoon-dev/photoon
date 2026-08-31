import 'server-only';

/**
 * Rastreio de encomenda: o link que o cliente abre e a consulta à API dos
 * Correios.
 *
 * Duas coisas bem diferentes moram aqui:
 *
 * 1. **O link público** funciona hoje, sem contrato e sem credencial. É o que
 *    o cliente usa para acompanhar a caixa dele.
 * 2. **A API oficial** (`api.correios.com.br`) exige contrato: usuário e
 *    código de acesso do cartão de postagem. Sem isso ela responde 401 e não
 *    há como contornar. A integração está escrita e desligada: assim que as
 *    duas variáveis existirem no ambiente, a sincronização passa a rodar sem
 *    mudar mais nada no código.
 */

/** Um código dos Correios: 2 letras, 9 dígitos, 2 letras do país. */
const CODIGO_CORREIOS = /^[A-Z]{2}\d{9}[A-Z]{2}$/i;

export const ehCodigoCorreios = (codigo: string | null | undefined) =>
  CODIGO_CORREIOS.test((codigo ?? '').trim());

/**
 * Para onde mandar o cliente que quer ver onde está a caixa.
 *
 * Só os Correios têm uma página pública estável por código. Nas outras
 * transportadoras o rastreio vive atrás de login ou de um domínio por
 * cliente, então não inventamos um link que daria 404: devolvemos null e a
 * tela mostra o código para copiar.
 */
export function linkDeRastreio(
  transportadora: string | null,
  codigo: string | null,
): string | null {
  const cod = (codigo ?? '').trim();
  if (!cod) return null;
  const t = (transportadora ?? '').toLowerCase();
  if (ehCodigoCorreios(cod) || t.includes('correio') || t.includes('sedex') || t.includes('pac')) {
    return `https://rastreamento.correios.com.br/app/index.php?objeto=${encodeURIComponent(cod.toUpperCase())}`;
  }
  return null;
}

// ---------------------------------------------------------------------------
// API oficial
// ---------------------------------------------------------------------------

const BASE = 'https://api.correios.com.br';

export type CredenciaisCorreios = {
  usuario: string;
  codigoAcesso: string;
  cartaoPostagem: string | null;
};

/** As credenciais do contrato, se o ambiente tiver. */
export function credenciaisCorreios(): CredenciaisCorreios | null {
  const usuario = process.env.CORREIOS_USUARIO;
  const codigoAcesso = process.env.CORREIOS_CODIGO_ACESSO;
  if (!usuario || !codigoAcesso) return null;
  return { usuario, codigoAcesso, cartaoPostagem: process.env.CORREIOS_CARTAO_POSTAGEM ?? null };
}

/**
 * Token do contrato. Vale algumas horas; guardamos em memória do processo
 * porque pedir um token novo a cada consulta é o que faz os Correios
 * bloquearem o contrato por excesso de chamada.
 */
let token: { valor: string; expira: number } | null = null;

async function autenticar(cred: CredenciaisCorreios): Promise<string> {
  if (token && token.expira > Date.now() + 60_000) return token.valor;

  const basica = Buffer.from(`${cred.usuario}:${cred.codigoAcesso}`).toString('base64');
  const caminho = cred.cartaoPostagem ? '/token/v1/autentica/cartaopostagem' : '/token/v1/autentica';

  const r = await fetch(BASE + caminho, {
    method: 'POST',
    headers: { Authorization: `Basic ${basica}`, 'Content-Type': 'application/json' },
    body: cred.cartaoPostagem ? JSON.stringify({ numero: cred.cartaoPostagem }) : undefined,
    cache: 'no-store',
  });
  if (!r.ok) throw new Error(`Correios recusou a autenticação (${r.status}).`);

  const j = (await r.json()) as { token: string; expiraEm?: string };
  const expira = j.expiraEm ? Date.parse(j.expiraEm) : Date.now() + 3_600_000;
  token = { valor: j.token, expira };
  return j.token;
}

export type EventoRastreio = {
  codigo: string;
  descricao: string;
  quando: string;
  local: string | null;
  /** Códigos dos Correios: BDE/BDI/BDR = tentativa de entrega, PAR = devolução. */
  tipo: string;
};

/**
 * Os eventos mais recentes de cada objeto. Até 50 códigos por chamada — é o
 * teto do endpoint, e a expedição de uma loja cabe nisso.
 */
export async function consultarCorreios(codigos: string[]): Promise<Record<string, EventoRastreio[]>> {
  const cred = credenciaisCorreios();
  if (!cred) throw new Error('Sem credencial dos Correios neste ambiente.');

  const validos = Array.from(new Set(codigos.filter(ehCodigoCorreios).map((c) => c.toUpperCase())));
  if (!validos.length) return {};

  const jwt = await autenticar(cred);
  const fora: Record<string, EventoRastreio[]> = {};

  for (let i = 0; i < validos.length; i += 50) {
    const lote = validos.slice(i, i + 50);
    const url = `${BASE}/srorastro/v1/objetos?${lote.map((c) => `codigosObjetos=${c}`).join('&')}&resultado=U`;
    const r = await fetch(url, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: 'no-store',
    });
    if (!r.ok) throw new Error(`Correios recusou a consulta (${r.status}).`);

    const j = (await r.json()) as {
      objetos?: {
        codObjeto: string;
        eventos?: { codigo: string; descricao: string; dtHrCriado: string; unidade?: { endereco?: { cidade?: string; uf?: string } } }[];
      }[];
    };
    for (const o of j.objetos ?? []) {
      fora[o.codObjeto] = (o.eventos ?? []).map((e) => ({
        codigo: e.codigo,
        descricao: e.descricao,
        quando: e.dtHrCriado,
        local: [e.unidade?.endereco?.cidade, e.unidade?.endereco?.uf].filter(Boolean).join('/') || null,
        tipo: e.codigo,
      }));
    }
  }
  return fora;
}

/** O estado de expedição que o evento dos Correios implica, se implicar algum. */
export function estadoDoEvento(ev: EventoRastreio): 'postado' | 'em_transito' | 'entregue' | 'devolvido' | null {
  const c = ev.codigo.toUpperCase();
  const d = ev.descricao.toLowerCase();
  if (c === 'BDE' || c === 'BDI' || c === 'BDR' || d.includes('entregue')) return 'entregue';
  if (d.includes('devolv')) return 'devolvido';
  if (c === 'PO' || d.includes('postado')) return 'postado';
  if (d.includes('trânsito') || d.includes('transito') || d.includes('encaminhado')) return 'em_transito';
  return null;
}
