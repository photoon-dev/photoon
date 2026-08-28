import puppeteer from 'puppeteer-core';
const OUT = '/tmp/claude-0/-root/03abbdd5-4b76-4f3d-83d7-6d69a0c45bfb/scratchpad';
const b = await puppeteer.launch({
  executablePath: '/usr/bin/chromium-browser', headless: 'new',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'],
});
const s = (ms) => new Promise((r) => setTimeout(r, ms));
const ok = (c, m) => console.log(`${c ? 'PASS' : 'FALHA'}  ${m}`);

try {
  const p = await b.newPage();
  p.on('pageerror', (e) => console.log('  [pageerror]', e.message));
  await p.setViewport({ width: 1440, height: 900 });
  await p.goto('http://localhost:3000/dev-preview/editor', { waitUntil: 'networkidle2', timeout: 120000 });
  await p.waitForSelector('.om-editor', { timeout: 60000 });
  await s(2500);

  const num = (i) => p.evaluate((k) => [...document.querySelectorAll('input[type=number]')][k]?.value, i);
  // So o que esta REALMENTE visivel: textContent devolve texto de no escondido,
  // e o bloco do aviso continua no DOM com display:none.
  const textos = () => p.evaluate(() =>
    [...document.querySelectorAll('p')]
      .filter((e) => e.offsetParent !== null)
      .map((e) => e.textContent?.trim())
      .filter(Boolean));

  // ---------------- aba Pessoas ----------------
  console.log('--- Pessoas ---');
  const pessoas = await p.evaluate(() => {
    const rot = [...document.querySelectorAll('p')].find((e) => /Pessoas nesta galeria/.test(e.textContent || ''));
    if (!rot) return null;
    const linha = rot.nextElementSibling;
    return [...linha.children].map((d) => ({
      nome: d.querySelector('span:last-child')?.textContent?.trim(),
      temFoto: /background-image/.test(d.querySelector('span')?.getAttribute('style') || ''),
      titulo: d.getAttribute('title'),
    }));
  });
  ok(!!pessoas && pessoas.length === 2, `fileira de pessoas: ${JSON.stringify(pessoas)}`);
  ok(!!pessoas?.every((x) => x.temFoto), 'cada bolinha recorta o rosto da foto');

  // clicar numa pessoa filtra a galeria
  const contaFotos = () => p.evaluate(() => {
    const g = [...document.querySelectorAll('div')].find((d) => /grid-template-columns:\s*repeat\(3/.test(d.getAttribute('style') || ''));
    return g ? g.children.length : -1;
  });
  const antes = await contaFotos();
  await p.evaluate(() => {
    const rot = [...document.querySelectorAll('p')].find((e) => /Pessoas nesta galeria/.test(e.textContent || ''));
    rot.nextElementSibling.children[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await s(500);
  const depois = await contaFotos();
  const conta = await p.evaluate(() => [...document.querySelectorAll('span')].find((e) => /^\d+ de \d+$/.test(e.textContent?.trim() || ''))?.textContent?.trim());
  ok(depois === 1 && antes === 3, `filtrar por pessoa: ${antes} -> ${depois} fotos (contador diz "${conta}")`);
  await p.screenshot({ path: `${OUT}/20-pessoas.png` });

  // desfaz o filtro
  await p.evaluate(() => {
    const rot = [...document.querySelectorAll('p')].find((e) => /fotos desta pessoa|Pessoas nesta galeria/.test(e.textContent || ''));
    rot.nextElementSibling.children[1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await s(400);

  // ---------------- aviso de rosto ----------------
  console.log('\n--- Aviso "rosto perto do corte" ---');
  // frameA: primeiro quadro da pagina esquerda, rot 0 — o rosto sai pelo topo
  // e a correcao por deslocamento e possivel (nos girados 90 nao e, e ali o
  // botao Corrigir some de proposito).
  await p.evaluate(() => {
    const grid = document.querySelector('section > div');
    grid?.firstElementChild?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
  });
  await s(700);

  const contornos = await p.evaluate(() => {
    const box = [...document.querySelectorAll('[data-om-selbox]')].find((x) => getComputedStyle(x).display !== 'none');
    if (!box) return null;
    const br = box.getBoundingClientRect();
    return [...box.querySelectorAll('span')]
      .filter((sp) => /border:\s*1\.5px solid/.test(sp.getAttribute('style') || ''))
      .map((sp) => {
        const r = sp.getBoundingClientRect();
        return {
          cor: /solid (#[0-9A-F]{6})/i.exec(sp.getAttribute('style'))?.[1],
          dentro: r.x >= br.x - 1 && r.y >= br.y - 1,
          fracX: +((r.x - br.x) / br.width).toFixed(3),
          fracY: +((r.y - br.y) / br.height).toFixed(3),
        };
      });
  });
  ok(!!contornos?.length, `contorno de rosto desenhado: ${JSON.stringify(contornos)}`);

  const t = await textos();
  const temAviso = t.some((x) => /rosto/i.test(x || ''));
  const titulo = t.find((x) => /Rosto (cortado|perto do corte)/.test(x || ''));
  ok(temAviso, `aviso no inspetor: "${titulo ?? t.find((x) => /rosto/i.test(x || ''))}"`);

  await p.screenshot({ path: `${OUT}/21-aviso-rosto.png` });

  // ---------------- botão Corrigir ----------------
  console.log('\n--- Botão Corrigir (determinístico) ---');
  const enqAntes = await p.evaluate(() => {
    const box = [...document.querySelectorAll('[data-om-selbox]')].find((x) => getComputedStyle(x).display !== 'none');
    const br = box.getBoundingClientRect();
    const alvo = [...box.parentElement.children].find((c) => {
      if (c === box) return false;
      const r = c.getBoundingClientRect();
      return Math.abs(r.x - br.x) < 2 && Math.abs(r.y - br.y) < 2;
    });
    return alvo?.querySelector('img')?.getAttribute('style');
  });
  const zoomAntes = await num(0);

  const clicou = await p.evaluate(() => {
    const btn = [...document.querySelectorAll('span')].find((e) => e.textContent?.trim() === 'Corrigir');
    if (!btn || getComputedStyle(btn).display === 'none') return false;
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return true;
  });
  await s(600);
  const zoomDepois = await num(0);
  const enqDepois = await p.evaluate(() => {
    const box = [...document.querySelectorAll('[data-om-selbox]')].find((x) => getComputedStyle(x).display !== 'none');
    const br = box.getBoundingClientRect();
    const alvo = [...box.parentElement.children].find((c) => {
      if (c === box) return false;
      const r = c.getBoundingClientRect();
      return Math.abs(r.x - br.x) < 2 && Math.abs(r.y - br.y) < 2;
    });
    return alvo?.querySelector('img')?.getAttribute('style');
  });
  ok(clicou, 'botão Corrigir estava visível e clicável');
  ok(enqAntes !== enqDepois, `Corrigir mudou o enquadramento (zoom ${zoomAntes}% -> ${zoomDepois}%)`);

  const depoisTxt = await textos();
  const aindaAvisa = depoisTxt.some((x) => /Rosto (cortado|perto do corte)/.test(x || ''));
  ok(!aindaAvisa, 'depois de corrigir, o aviso sumiu (o rosto entrou na área segura)');
  await p.screenshot({ path: `${OUT}/22-corrigido.png` });

  // ---------------- Manter ----------------
  console.log('\n--- Botão Manter ---');
  // O passo anterior CORRIGIU o frameA, entao ali nao ha mais aviso. Usa o
  // quadro girado 90 (.dc24), que continua avisando "Rosto cortado" e onde o
  // Corrigir some de proposito — e exatamente o caso em que Manter importa.
  // (Recarregar nao serve: o guarda de gravacao pendente bloqueia a saida.)
  await p.evaluate(() => document.querySelector('.dc24')?.dispatchEvent(new MouseEvent('click', { bubbles: true })));
  await s(700);
  const avisoAntes = (await textos()).some((x) => /Rosto (cortado|perto do corte)/.test(x || ''));
  const clicouManter = await p.evaluate(() => {
    const btn = [...document.querySelectorAll('span')].find((e) => e.textContent?.trim() === 'Manter');
    if (!btn) return false;
    btn.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return true;
  });
  await s(500);
  const avisoDepois = (await textos()).some((x) => /Rosto (cortado|perto do corte)/.test(x || ''));
  ok(avisoAntes && clicouManter && !avisoDepois,
     `Manter silencia o aviso naquele quadro (antes=${avisoAntes}, depois=${avisoDepois})`);
} finally {
  await b.close();
}
