/**
 * Auditoria de UMA página: clica em cada elemento interativo e diz o que
 * respondeu. Existe porque tela que "carrega" não é tela que funciona — metade
 * dos controles deste projeto estava ligada ao markup sem escrever em lugar
 * nenhum, e isso só aparece clicando.
 */
import puppeteer from 'puppeteer-core';
const [host, email, rota] = process.argv.slice(2);
const b = await puppeteer.launch({ executablePath:'/usr/bin/chromium-browser', headless:'new',
  args:['--no-sandbox','--disable-dev-shm-usage'] });
const a = await b.newPage(); await a.setViewport({ width:1600, height:950 });
const erros = []; a.on('pageerror', e => erros.push(String(e).slice(0,110)));
await a.goto(`https://${host}/entrar`, { waitUntil:'networkidle2' });
await a.type('input[type=email]', email);
await a.type('input[type=password]', process.env.SENHA_TESTE);
await Promise.all([a.waitForNavigation({waitUntil:'networkidle2'}).catch(()=>{}), a.click('button[type=submit]')]);
await a.goto(`https://${host}${rota}`, { waitUntil:'networkidle2' });
await new Promise(r=>setTimeout(r,1800));

const inventario = await a.evaluate(()=>{
  const inter = [...document.querySelectorAll('div,span,button,a,input,select,textarea')].filter(e=>{
    const k = Object.keys(e).find(x=>x.startsWith('__reactProps'));
    const p = k ? e[k] : null;
    const temAcao = p && (p.onClick||p.onChange||p.onSubmit||p.onPointerDown||p.onContextMenu);
    return temAcao || e.tagName==='INPUT' || e.tagName==='TEXTAREA' || e.tagName==='SELECT' ||
           (e.tagName==='A' && e.getAttribute('href'));
  });
  return { total: inter.length,
    tipos: inter.reduce((m,e)=>{m[e.tagName]=(m[e.tagName]||0)+1; return m;},{}),
    links: [...document.querySelectorAll('a[href]')].map(e=>e.getAttribute('href')).filter(h=>h&&!h.startsWith('#')),
    campos: [...document.querySelectorAll('input,textarea,select')].map(e=>e.name||e.type||e.tagName) };
});
console.log(`\n=== ${host}${rota} ===`);
console.log('elementos interativos:', inventario.total, JSON.stringify(inventario.tipos));
console.log('campos               :', inventario.campos.join(', ')||'nenhum');
console.log('links                :', [...new Set(inventario.links)].join(', ')||'nenhum');

// clica em cada elemento com onClick e vê se algo muda
const assinatura = ()=>a.evaluate(()=>{
  let h=0; const t=document.body.innerHTML;
  for(let i=0;i<t.length;i+=7) h=((h<<5)-h+t.charCodeAt(i))|0; return h;});
const nomes = await a.evaluate(()=>{
  const inter = [...document.querySelectorAll('div,span,button')].filter(e=>{
    const k=Object.keys(e).find(x=>x.startsWith('__reactProps'));
    return k && typeof e[k].onClick==='function';});
  window.__alvos = inter;
  return inter.map(e=>(e.getAttribute('title')||e.textContent||'').trim().slice(0,34)||'(sem rótulo)');});
let mudou=0, inerte=[];
for (let i=0;i<Math.min(nomes.length,40);i++){
  const antes = await assinatura();
  await a.evaluate(i2=>window.__alvos[i2]?.click(), i).catch(()=>{});
  await new Promise(r=>setTimeout(r,420));
  const depois = await assinatura();
  if (antes!==depois) mudou++; else inerte.push(nomes[i]);
  // volta se navegou
  if (!a.url().includes(rota) && rota!=='/') { await a.goto(`https://${host}${rota}`,{waitUntil:'networkidle2'});
    await new Promise(r=>setTimeout(r,1200));
    await a.evaluate(()=>{const inter=[...document.querySelectorAll('div,span,button')].filter(e=>{
      const k=Object.keys(e).find(x=>x.startsWith('__reactProps')); return k&&typeof e[k].onClick==='function';});
      window.__alvos=inter;}); }
}
console.log(`cliques: ${mudou} responderam, ${inerte.length} sem reação`);
if (inerte.length) console.log('  sem reação:', [...new Set(inerte)].slice(0,14).join(' | '));
console.log('erros de página:', erros.length? erros.slice(0,2).join(' / ') : 'nenhum');
await b.close();
