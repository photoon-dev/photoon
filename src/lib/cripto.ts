import 'server-only';
import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'node:crypto';

/**
 * Cifragem simétrica das credenciais de gateway.
 *
 * É chave de dinheiro de terceiro: o PLANO-PAGAMENTOS exige que nada vá para
 * `lojista_gateways.credenciais_cifradas` em texto puro e que a chave viva
 * fora do banco. Aqui ela vem só do ambiente (`CHAVE_CIFRAGEM`) — quem tiver
 * um dump do Postgres não consegue faturar no lugar do lojista.
 *
 * AES-256-GCM (e não CBC) porque o modo autentica: credencial adulterada no
 * banco falha ao decifrar em vez de virar lixo silencioso na chamada ao
 * gateway.
 */

/** Prefixo de versão no texto gravado: permite trocar o algoritmo sem quebrar o que já está no banco. */
const VERSAO = 'v1';

export class SemChaveDeCifragem extends Error {
  constructor() {
    super(
      'CHAVE_CIFRAGEM não está definida no ambiente. Sem ela não é possível guardar credencial de gateway.',
    );
  }
}

/**
 * 32 bytes de chave a partir da variável de ambiente.
 *
 * Aceita 64 hex (chave gerada por `openssl rand -hex 32`) ou uma frase
 * qualquer — o SHA-256 normaliza o tamanho. Aceitar frase evita a tentação de
 * cortar/completar a chave à mão na hora do deploy, que é como se perde acesso
 * ao que já foi cifrado.
 */
function chave(): Buffer {
  const bruta = process.env.CHAVE_CIFRAGEM;
  if (!bruta) throw new SemChaveDeCifragem();
  if (/^[0-9a-f]{64}$/i.test(bruta)) return Buffer.from(bruta, 'hex');
  return createHash('sha256').update(bruta, 'utf8').digest();
}

/** `true` quando o ambiente permite conectar gateway — a tela avisa em vez de falhar no envio. */
export function temChaveDeCifragem(): boolean {
  return Boolean(process.env.CHAVE_CIFRAGEM);
}

export function cifrar(texto: string): string {
  // IV novo a cada gravação: reusar IV em GCM revela o texto claro.
  const iv = randomBytes(12);
  const c = createCipheriv('aes-256-gcm', chave(), iv);
  const dados = Buffer.concat([c.update(texto, 'utf8'), c.final()]);
  return [VERSAO, iv.toString('base64'), c.getAuthTag().toString('base64'), dados.toString('base64')].join(
    '.',
  );
}

export function decifrar(guardado: string): string {
  const [versao, iv, tag, dados] = guardado.split('.');
  if (versao !== VERSAO || !iv || !tag || !dados) {
    throw new Error('Credencial gravada em formato desconhecido.');
  }
  const d = createDecipheriv('aes-256-gcm', chave(), Buffer.from(iv, 'base64'));
  d.setAuthTag(Buffer.from(tag, 'base64'));
  return Buffer.concat([d.update(Buffer.from(dados, 'base64')), d.final()]).toString('utf8');
}

/**
 * Últimos 4 caracteres de um segredo, para o lojista reconhecer qual chave
 * está conectada sem que ela volte ao navegador.
 */
export function ultimos4(segredo: string): string {
  return segredo.length <= 4 ? '••••' : `••••${segredo.slice(-4)}`;
}
