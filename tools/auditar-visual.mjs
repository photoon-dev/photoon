/**
 * Auditoria visual autenticada do painel do lojista.
 *
 * `tirar-foto.mjs` faz uma tela por execução e refaz o login toda vez, e marca
 * `isMobile: true` em qualquer largura — o que falseia justamente as larguras
 * de desktop. Esta entra uma vez e varre a lista inteira, em cada largura, com
 * o viewport certo para cada uma.
 *
 * O que ela recolhe, além da foto:
 *   - erro de console e promessa rejeitada (é onde o defeito de verdade aparece)
 *   - requisição que falhou (imagem quebrada, URL assinada vencida, 4xx/5xx)
 *   - rolagem lateral e quem a causa
 *   - se a tela renderizou conteúdo ou só a casca vazia
 *
 * Os ids de pedido e projeto são descobertos na hora: fixar id no script é como
 * a auditoria começa a falhar por dado que mudou, e não por defeito.
 *
 *   SENHA_TESTE='...' node tools/auditar-visual.mjs [largura[,largura...]]
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync } from 'node:fs';

const CHROME = '/usr/bin/chromium-browser';
const HOST = process.env.HOST_TESTE ?? 'https://app.photoon.com.br';
const EMAIL = process.env.EMAIL_TESTE ?? 'lojista@photoon.com.br';
const SENHA = process.env.SENHA_TESTE ?? '';
const SAIDA = '/tmp/fotos';

if (!SENHA) throw new Error('defina SENHA_TESTE no ambiente');

const LARGURAS = (process.argv[2] ?? '1440,1366,1024,390').split(',').map(Number);
mkdirSync(SAIDA, { recursive: true });

const navegador = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'],
});

const aba = await navegador.newPage();

// Coletores. Zerados a cada tela.
let erros = [];
let requisicoesFalhas = [];
aba.on('console', (m) => {
  if (m.type() === 'error') erros.push(m.text().slice(0, 200));
});
aba.on('pageerror', (e) => erros.push(`pageerror: ${String(e.message).slice(0, 200)}`));
aba.on('requestfailed', (r) => {
  requisicoesFalhas.push(`${r.failure()?.errorText ?? 'falhou'} ${r.url().slice(0, 110)}`);
});
aba.on('response', (r) => {
  if (r.status() >= 400) requisicoesFalhas.push(`HTTP ${r.status()} ${r.url().slice(0, 110)}`);
});

async function entrar() {
  await aba.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await aba.goto(`${HOST}/entrar`, { waitUntil: 'networkidle2', timeout: 60000 });
  await aba.type('input[type=email]', EMAIL);
  await aba.type('input[type=password]', SENHA);
  await Promise.all([
    aba.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }).catch(() => {}),
    aba.click('button[type=submit]'),
  ]);
  const url = aba.url();
  if (url.includes('/entrar')) {
    const aviso = await aba.evaluate(() => document.body.innerText.slice(0, 200));
    throw new Error(`login nao passou. Tela diz: ${aviso}`);
  }
  console.log(`login ok -> ${url}\n`);
}

/**
 * Primeiro id de uma lista, para montar as rotas de detalhe.
 *
 * Procura em `href` e, se não achar, no HTML inteiro: a tabela de Projetos abre
 * a linha por clique (`aoAbrir`), não por link, então varrer só as âncoras
 * dizia "nenhum projeto" numa lista que tinha três.
 */
async function primeiroId(rota, padrao, forcado) {
  if (forcado) return forcado;
  await aba.goto(`${HOST}${rota}`, { waitUntil: 'networkidle2', timeout: 60000 });
  return aba.evaluate((p) => {
    const re = new RegExp(p);
    const href = [...document.querySelectorAll('a[href]')]
      .map((e) => e.getAttribute('href'))
      .find((h) => h && re.test(h));
    if (href) return href.match(re)[1];
    const m = document.documentElement.innerHTML.match(new RegExp(p.replace('/', '\\/')));
    return m ? m[1] : null;
  }, padrao);
}

const relatorio = [];

async function visitar(nome, rota, largura) {
  erros = [];
  requisicoesFalhas = [];

  const celular = largura < 700;
  await aba.setViewport({
    width: largura,
    height: celular ? 844 : 900,
    deviceScaleFactor: 1,
    isMobile: celular,
    hasTouch: celular,
  });

  let status = 0;
  try {
    const resp = await aba.goto(`${HOST}${rota}`, { waitUntil: 'networkidle2', timeout: 60000 });
    status = resp?.status() ?? 0;
  } catch (e) {
    relatorio.push({ nome, rota, largura, status: 0, falha: String(e.message).slice(0, 120) });
    return;
  }
  await new Promise((r) => setTimeout(r, 900));

  const medida = await aba.evaluate(() => {
    const passam = [...document.querySelectorAll('*')].filter(
      (e) => e.getBoundingClientRect().right > window.innerWidth + 1,
    );
    return {
      larguraDoc: document.documentElement.scrollWidth,
      larguraJanela: window.innerWidth,
      alturaDoc: document.documentElement.scrollHeight,
      culpados: passam.slice(0, 5).map((e) => {
        const c = String(e.className || '').split(' ')[0];
        return `${e.tagName.toLowerCase()}${c ? '.' + c : ''} → ${Math.round(e.getBoundingClientRect().right)}px`;
      }),
      texto: document.body.innerText.replace(/\s+/g, ' ').trim().length,
      titulo: (document.querySelector('h1')?.innerText ?? '').trim().slice(0, 60),
      imagensQuebradas: [...document.images].filter((i) => i.complete && i.naturalWidth === 0).length,
    };
  });

  const arquivo = `${SAIDA}/${nome}-${largura}.png`;
  await aba.screenshot({ path: arquivo, fullPage: false });

  const linha = {
    nome,
    rota,
    largura,
    status,
    titulo: medida.titulo,
    texto: medida.texto,
    alturaDoc: medida.alturaDoc,
    overflow: medida.larguraDoc > medida.larguraJanela ? medida.larguraDoc - medida.larguraJanela : 0,
    culpados: medida.culpados,
    imagensQuebradas: medida.imagensQuebradas,
    erros: [...new Set(erros)].slice(0, 4),
    requisicoesFalhas: [...new Set(requisicoesFalhas)].slice(0, 4),
    arquivo,
  };
  relatorio.push(linha);

  const sinais = [
    status !== 200 ? `HTTP ${status}` : '',
    linha.overflow ? `overflow ${linha.overflow}px` : '',
    linha.erros.length ? `${linha.erros.length} erro(s)` : '',
    linha.requisicoesFalhas.length ? `${linha.requisicoesFalhas.length} req falha` : '',
    linha.imagensQuebradas ? `${linha.imagensQuebradas} img quebrada` : '',
    linha.texto < 200 ? 'TELA QUASE VAZIA' : '',
  ].filter(Boolean);

  console.log(
    `${String(largura).padEnd(5)} ${nome.padEnd(18)} ${String(status).padEnd(4)} ` +
      `${String(linha.texto).padStart(6)}ch  ${sinais.join(' · ') || 'ok'}`,
  );
}

try {
  await entrar();

  const idPedido = await primeiroId('/pedidos', '/pedidos/([0-9a-f-]{36})', process.env.PEDIDO_ID);
  const idProjeto = await primeiroId('/projetos', '/projetos/([0-9a-f-]{36})', process.env.PROJETO_ID);
  console.log(`pedido de teste:  ${idPedido ?? '(nenhum na lista)'}`);
  console.log(`projeto de teste: ${idProjeto ?? '(nenhum na lista)'}\n`);

  const TELAS = [
    ['dashboard', '/'],
    ['pedidos', '/pedidos'],
    ...(idPedido ? [['pedido-detalhe', `/pedidos/${idPedido}`], ['pedido-os', `/pedidos/${idPedido}/os`]] : []),
    ['projetos', '/projetos'],
    ...(idProjeto
      ? [['projeto-detalhe', `/projetos/${idProjeto}`], ['projeto-resumo', `/projetos/${idProjeto}/resumo`]]
      : []),
    ['producao', '/producao'],
    ['renderizacao', '/renderizacao'],
    ['expedicao', '/expedicao'],
    ['clientes', '/clientes'],
    ['financeiro', '/financeiro'],
    ['loja', '/loja'],
    ['integracoes', '/integracoes'],
  ];

  for (const largura of LARGURAS) {
    console.log(`\n===== ${largura}px =====`);
    console.log('larg  tela               HTTP  texto   sinais');
    for (const [nome, rota] of TELAS) await visitar(nome, rota, largura);
  }

  writeFileSync(`${SAIDA}/relatorio.json`, JSON.stringify(relatorio, null, 2));
  console.log(`\nrelatorio: ${SAIDA}/relatorio.json  (${relatorio.length} capturas)`);
} finally {
  await navegador.close();
}
