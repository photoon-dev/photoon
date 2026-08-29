/**
 * Auditoria do painel: percorre cada tela e diz o que carrega, o que tem dado
 * real e o que ainda é do desenho.
 */
import puppeteer from 'puppeteer-core';
const b=await puppeteer.launch({executablePath:'/usr/bin/chromium-browser',headless:'new',args:['--no-sandbox','--disable-dev-shm-usage']});

async function entrar(host, email){
  const a=await b.newPage(); await a.setViewport({width:1600,height:950});
  a.on('pageerror',e=>a._erros=[...(a._erros||[]),String(e).slice(0,90)]);
  await a.goto(`https://${host}/entrar`,{waitUntil:'networkidle2'});
  await a.type('input[type=email]',email);
  await a.type('input[type=password]',process.env.SENHA_TESTE);
  await Promise.all([a.waitForNavigation({waitUntil:'networkidle2'}).catch(()=>{}),a.click('button[type=submit]')]);
  return a;
}
const MOCK = ['Marta Reis','marta@labcores','Formatura 2026','IMG_0412','Plano Pro · 8',
  'Filial Centro','Lorem','labcores','R$ 12.480','João da Silva','Ana Souza'];

async function ver(a, host, rota){
  const r = await a.goto(`https://${host}${rota}`,{waitUntil:'networkidle2',timeout:40000}).catch(e=>null);
  await new Promise(x=>setTimeout(x,1400));
  if(!r) return { rota, status:'sem resposta' };
  const t = await a.evaluate(()=>document.body.innerText);
  const achados = MOCK.filter(m=>t.includes(m));
  return { rota, status:r.status(),
    vazia: t.trim().length < 120,
    mock: achados.length? achados.join(', ') : '-',
    linhas: t.split('\n').filter(Boolean).length };
}

console.log('=== PAINEL DO CLIENTE (demo.photoon.com.br) ===');
let a = await entrar('demo.photoon.com.br','usuario@photoon.com.br');
for (const rota of ['/meus-projetos','/projetos/6191d544-023a-4ee7-88e7-699472448212','/galeria','/minha-conta','/ajuda'])
  console.log(' ', JSON.stringify(await ver(a,'demo.photoon.com.br',rota)));
console.log('  erros:', (a._erros||[]).slice(0,2).join(' / ')||'nenhum');
await a.close();

console.log('\n=== PAINEL DO LOJISTA (app.photoon.com.br) ===');
a = await entrar('app.photoon.com.br','lojista@photoon.com.br');
for (const rota of ['/','/clientes','/configuracoes','/templates','/pedidos','/producao','/financeiro','/relatorios','/catalogo','/precos'])
  console.log(' ', JSON.stringify(await ver(a,'app.photoon.com.br',rota)));
console.log('  erros:', (a._erros||[]).slice(0,2).join(' / ')||'nenhum');
await a.close();

console.log('\n=== SUPER ADMIN (admin.photoon.com.br) ===');
a = await entrar('admin.photoon.com.br','admin@photoon.com.br');
for (const rota of ['/','/planos'])
  console.log(' ', JSON.stringify(await ver(a,'admin.photoon.com.br',rota)));
console.log('  erros:', (a._erros||[]).slice(0,2).join(' / ')||'nenhum');
await b.close();
