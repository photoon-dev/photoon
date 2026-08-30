import puppeteer from 'puppeteer-core';
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const b = await puppeteer.launch({
  executablePath: '/usr/bin/chromium-browser', headless: 'new',
  args: ['--no-sandbox','--disable-dev-shm-usage','--hide-scrollbars',
         '--host-resolver-rules=MAP demo.photoon.com.br 127.0.0.1:3100'],
});
const a = await b.newPage();
await a.setViewport({ width: 1440, height: 1000 });
const erros = [];
a.on('pageerror', (e) => erros.push(String(e).slice(0,160)));
const BASE = 'http://demo.photoon.com.br';
await a.goto(`${BASE}/entrar`, { waitUntil:'networkidle2', timeout:45000 });
await a.type('input[type=email]', 'usuario@photoon.com.br');
await a.type('input[type=password]', process.env.SENHA_TESTE);
await Promise.all([a.waitForNavigation({waitUntil:'networkidle2'}).catch(()=>{}), a.click('button[type=submit]')]);
await a.goto(`${BASE}/minha-conta`, { waitUntil:'networkidle2', timeout:45000 });
await espera(1500);

const info = await a.evaluate(() => ({
  h1: document.querySelector('h1')?.textContent?.trim(),
  abas: [...document.querySelectorAll('button')].map(b=>b.textContent.trim()).filter(t=>['Meus dados','Endereço','Segurança','Minhas compras'].includes(t)),
  campos: [...document.querySelectorAll('input')].map(i=>`${i.name||i.type}=${(i.value||'').slice(0,22)}`),
  ficcao: ['Julia Martins','julia.martins@email.com','412.887.930-55','Teodoro Sampaio','#PT-2418','Safari · iPhone','Helena Martins']
            .filter(f=>document.body.innerText.includes(f)),
}));
console.log('h1        :', info.h1);
console.log('abas      :', info.abas.join(' | '));
console.log('campos    :', info.campos.join(' · '));
console.log('ficção    :', info.ficcao.length ? info.ficcao.join(', ') : 'nenhuma');
await a.screenshot({ path: '/tmp/fotos/conta-dados.png', fullPage: true });

for (const [rotulo, arquivo] of [['Endereço','conta-endereco'],['Segurança','conta-seguranca'],['Minhas compras','conta-compras']]) {
  const ok = await a.evaluate((r) => {
    const b = [...document.querySelectorAll('button')].find(x=>x.textContent.trim()===r);
    if (b) { b.click(); return true; } return false;
  }, rotulo);
  await espera(900);
  const txt = await a.evaluate(()=>document.body.innerText);
  console.log(`aba ${rotulo.padEnd(14)}: ${ok?'abriu':'NÃO achou'} · ${txt.includes('migração 0013')?'avisa da migração':'sem aviso'}`);
  await a.screenshot({ path: `/tmp/fotos/${arquivo}.png`, fullPage: true });
}
console.log('erros     :', erros.length ? erros.slice(0,3).join(' / ') : 'nenhum');
await b.close();
