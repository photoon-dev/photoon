import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/usr/bin/chromium-browser',headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});
const p=await b.newPage(); p.on('pageerror',e=>console.log('[pageerror]',e.message));
await p.setViewport({width:1440,height:900});
await p.goto('http://localhost:3000/dev-preview/editor',{waitUntil:'networkidle2',timeout:120000});
await p.waitForSelector('.om-editor',{timeout:60000});
await new Promise(r=>setTimeout(r,2500));
console.log(JSON.stringify(await p.evaluate(()=>{
  const rot=[...document.querySelectorAll('p')].find(e=>/Pessoas nesta galeria/.test(e.textContent||''));
  const circ=rot.nextElementSibling.children[0].querySelector('span');
  const cs=getComputedStyle(circ); const r=circ.getBoundingClientRect();
  const grid=[...document.querySelectorAll('div')].find(d=>/grid-template-columns:\s*repeat\(3/.test(d.getAttribute('style')||''));
  const th=grid?.children[0];
  const vazio=[...document.querySelectorAll('p')].find(e=>/Nenhuma foto/.test(e.textContent||''));
  return {
    circulo:{display:cs.display,w:+r.width.toFixed(1),h:+r.height.toFixed(1),temBg:cs.backgroundImage!=='none',
             bgSize:cs.backgroundSize,bgPos:cs.backgroundPosition},
    miniatura:{temBg:getComputedStyle(th).backgroundImage!=='none', w:+th.getBoundingClientRect().width.toFixed(1)},
    nFotos: grid?.children.length,
    avisoVazioVisivel: vazio ? vazio.offsetParent!==null : null,
  };
}),null,2));
await p.screenshot({path:'/tmp/claude-0/-root/03abbdd5-4b76-4f3d-83d7-6d69a0c45bfb/scratchpad/24-pessoas-ok.png'});
await b.close();
