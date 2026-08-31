import puppeteer from 'puppeteer-core';
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({
  executablePath: '/usr/bin/chromium-browser', headless: 'new',
  args: ['--no-sandbox','--disable-dev-shm-usage','--hide-scrollbars'],
});
async function checa(base, email, rotas) {
  const a = await b.newPage();
  await a.setViewport({ width: 1500, height: 1000 });
  const erros = [];
  a.on('pageerror', (e) => erros.push(String(e).slice(0, 140)));
  a.on('console', (m) => { if (m.type() === 'error') erros.push('console: ' + m.text().slice(0, 140)); });
  await a.goto(`${base}/entrar`, { waitUntil: 'networkidle2', timeout: 45000 });
  await a.type('input[type=email]', email);
  await a.type('input[type=password]', process.env.SENHA_TESTE);
  await Promise.all([a.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {}), a.click('button[type=submit]')]);
  for (const r of rotas) {
    erros.length = 0;
    await a.goto(base + r, { waitUntil: 'networkidle2', timeout: 45000 });
    await espera(1200);
    const info = await a.evaluate(() => ({
      h1: document.querySelector('h1')?.textContent?.trim() ?? '(sem h1)',
      txt: document.body.innerText,
    }));
    const ficcao = ['Julia Martins','Formatura 2026 · sessão Julia','Marta Reis','Lab Cores','1,44 TB',
      'Zebra ZT230','Correios · 14h00','VOL-4412','Memória Books','Colégio Farol','IMG_2140','Vó Alzira']
      .filter((f) => info.txt.includes(f));
    console.log(`${r.padEnd(14)} h1=${info.h1.slice(0,34).padEnd(34)} erros=${erros.length} ficção=${ficcao.join(', ') || 'nenhuma'}`);
    if (erros.length) console.log('   ' + erros.slice(0, 3).join('\n   '));
    await a.screenshot({ path: `/tmp/fotos${r.replace(/\//g, '-')}.png`, fullPage: false });
  }
  await a.close();
}
await checa('https://demo.photoon.com.br', 'usuario@photoon.com.br', ['/galeria', '/minha-conta', '/ajuda']);
await checa('https://app.photoon.com.br', 'lojista@photoon.com.br', ['/expedicao', '/pedidos', '/producao']);
await b.close();
