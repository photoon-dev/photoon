import puppeteer from 'puppeteer-core';
const SENHA = process.env.SENHA_TESTE ?? '';
const rota = process.argv[2] ?? '/';
const nome = process.argv[3] ?? 'tela';
const larguras = (process.argv[4] ?? '1440').split(',').map(Number);
const nav = await puppeteer.launch({
  executablePath: '/usr/bin/chromium-browser',
  headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'],
});
const aba = await nav.newPage();
await aba.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
await aba.goto('https://app.photoon.com.br/entrar', { waitUntil: 'networkidle2', timeout: 45000 });
await aba.type('input[type=email]', 'lojista@photoon.com.br');
await aba.type('input[type=password]', SENHA);
await Promise.all([
  aba.waitForNavigation({ waitUntil: 'networkidle2', timeout: 45000 }).catch(() => {}),
  aba.click('button[type=submit]'),
]);
for (const w of larguras) {
  const celular = w <= 500;
  await aba.setViewport({ width: w, height: 900, deviceScaleFactor: 1, isMobile: celular, hasTouch: celular });
  await aba.goto(`https://app.photoon.com.br${rota}`, { waitUntil: 'networkidle2', timeout: 45000 });
  await new Promise((r) => setTimeout(r, 1000));
  const m = await aba.evaluate(() => ({
    doc: document.documentElement.scrollWidth,
    jan: window.innerWidth,
    alt: document.documentElement.scrollHeight,
    erros: window.__erros ?? [],
    culpados: [...document.querySelectorAll('*')]
      .filter((e) => e.getBoundingClientRect().right > window.innerWidth + 1)
      .slice(0, 5)
      .map((e) => `${e.tagName.toLowerCase()}.${String(e.className||'').split(' ')[0]} → ${Math.round(e.getBoundingClientRect().right)}px`),
  }));
  const f = `/tmp/fotos/${nome}-${w}.png`;
  await aba.screenshot({ path: f, fullPage: true });
  console.log(`${String(w).padEnd(5)} altura=${String(m.alt).padEnd(5)} ${m.doc > m.jan ? 'ROLAGEM LATERAL ' + m.culpados.join(' | ') : 'sem rolagem lateral'}  ${f}`);
}
await nav.close();
