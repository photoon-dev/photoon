/**
 * Fotografa telas do sistema em tamanho de celular, já logado.
 *
 * Existe porque eu não enxergo o resultado renderizado: sem isso, cada ajuste
 * de layout dependia de um print do celular do Fábio para eu saber se quebrou.
 *
 * uso: node tools/tirar-foto.mjs <perfil> <caminho> [nome] [largura]
 *      perfil: lojista | cliente | admin
 */
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';

const CHROME = '/usr/bin/chromium-browser';
const SENHA = process.env.SENHA_TESTE ?? '';

const PERFIS = {
  lojista: { host: 'https://app.photoon.com.br', email: 'lojista@photoon.com.br' },
  cliente: { host: 'https://demo.photoon.com.br', email: 'usuario@photoon.com.br' },
  admin: { host: 'https://admin.photoon.com.br', email: 'admin@photoon.com.br' },
};

const [perfil = 'lojista', caminho = '/', nome = 'tela', largura = '390'] = process.argv.slice(2);
const p = PERFIS[perfil];
if (!p) throw new Error(`perfil desconhecido: ${perfil}`);
if (!SENHA) throw new Error('defina SENHA_TESTE no ambiente');

mkdirSync('/tmp/fotos', { recursive: true });

const navegador = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'],
});

try {
  const aba = await navegador.newPage();
  await aba.setViewport({ width: Number(largura), height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true });

  await aba.goto(`${p.host}/entrar`, { waitUntil: 'networkidle2', timeout: 45000 });
  await aba.type('input[type=email]', p.email);
  await aba.type('input[type=password]', SENHA);
  await Promise.all([
    aba.waitForNavigation({ waitUntil: 'networkidle2', timeout: 45000 }).catch(() => {}),
    aba.click('button[type=submit]'),
  ]);

  await aba.goto(`${p.host}${caminho}`, { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise((r) => setTimeout(r, 1200));

  // Mede a rolagem lateral, que é o defeito mais comum e o mais fácil de perder.
  const medida = await aba.evaluate(() => ({
    larguraDoc: document.documentElement.scrollWidth,
    larguraJanela: window.innerWidth,
    culpados: [...document.querySelectorAll('*')]
      .filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1)
      .slice(0, 6)
      .map((e) => `${e.tagName.toLowerCase()}${e.className ? '.' + String(e.className).split(' ')[0] : ''} → ${Math.round(e.getBoundingClientRect().right)}px`),
  }));

  const arquivo = `/tmp/fotos/${nome}.png`;
  await aba.screenshot({ path: arquivo, fullPage: false });

  console.log(`foto: ${arquivo}`);
  console.log(`largura do documento: ${medida.larguraDoc}px | janela: ${medida.larguraJanela}px`);
  if (medida.larguraDoc > medida.larguraJanela) {
    console.log('ROLAGEM LATERAL — elementos que passam da borda:');
    medida.culpados.forEach((c) => console.log('  ' + c));
  } else {
    console.log('sem rolagem lateral');
  }
} finally {
  await navegador.close();
}
