/**
 * Varredura do editor: exercita cada controle e diz se ele MUDOU alguma coisa.
 *
 * Existe porque "parece funcionar" não é verificação: vários controles deste
 * editor estavam ligados ao markup e não escreviam em lugar nenhum, e isso só
 * aparece comparando o estado antes e depois de cada clique.
 */
import puppeteer from 'puppeteer-core';
const ID = process.argv[2] ?? '6191d544-023a-4ee7-88e7-699472448212';
const U = 'https://demo.photoon.com.br';

const b = await puppeteer.launch({ executablePath:'/usr/bin/chromium-browser', headless:'new',
  args:['--no-sandbox','--disable-dev-shm-usage'] });
const a = await b.newPage();
await a.setViewport({ width:1700, height:980 });
const erros = [];
a.on('pageerror', e => erros.push(String(e).slice(0,120)));

await a.goto(`${U}/entrar`, { waitUntil:'networkidle2' });
await a.type('input[type=email]','usuario@photoon.com.br');
await a.type('input[type=password]', process.env.SENHA_TESTE);
await Promise.all([a.waitForNavigation({waitUntil:'networkidle2'}).catch(()=>{}), a.click('button[type=submit]')]);
await a.goto(`${U}/editor/${ID}`, { waitUntil:'networkidle2' });
await new Promise(r=>setTimeout(r,2100));

const pausa = (ms=1500)=>new Promise(r=>setTimeout(r,ms));
const aba = async (nome)=>{ await a.evaluate(n=>{const e=[...document.querySelectorAll('div,span')]
  .find(x=>x.textContent?.trim()===n); e&&e.click();}, nome); await pausa(900); };

/**
 * Assinatura do que está na TELA — não só do palco.
 *
 * Medir só o palco deu quatro falsos negativos: "todo o álbum" muda as outras
 * lâminas, a prévia é um modal fora dele, e o peso do texto muda o quadro
 * SELECIONADO, que nem sempre é o primeiro. Somando as miniaturas do
 * storyboard e os modais, cada um desses passa a deixar rastro.
 */
const assin = () => a.evaluate(()=>{
  const alvo = [document.querySelector('[data-om-palco]'),
                document.querySelector('.om-pagestrip'),
                ...[...document.querySelectorAll('div')].filter(e=>Number(e.style.zIndex)>=60)];
  const txt = alvo.filter(Boolean)
    .map(p=>[...p.querySelectorAll('div,span,img')]
      .map(e=>(e.getAttribute('style')||'')+'~'+(e.getAttribute('src')||''))
      .join('|'))
    .join('#');
  // Hash e não comprimento: trocar brightness(1.4) por 1.5 não muda o tamanho,
  // e a primeira versão deste teste dava "sem efeito" para meio inspetor.
  let h = 0;
  for (let i = 0; i < txt.length; i++) h = ((h << 5) - h + txt.charCodeAt(i)) | 0;
  return h;
});

const R=[];
async function checa(nome, acao){
  const antes = await assin();
  try { await acao(); } catch(e){ R.push([nome,'ERRO',String(e).slice(0,60)]); return; }
  await pausa(1400);
  const depois = await assin();
  R.push([nome, antes!==depois ? 'ok' : 'SEM EFEITO', '']);
}
/**
 * Escreve num campo controlado pelo React.
 *
 * O setter nativo passa por cima do rastreador de valor do React, e o evento
 * tem de ser `input`: `onChange` do React ouve `input`, não `change`. Disparar
 * só `change` fazia meio inspetor aparecer como "sem efeito" num editor que
 * funcionava.
 */
const escrever = (sel, valor) => a.evaluate(([s2, v2])=>{
  const el = typeof s2 === 'string' ? document.querySelector(s2) : null;
  if (!el) throw new Error('campo nao encontrado: ' + s2);
  const proto = el.tagName === 'TEXTAREA' ? window.HTMLTextAreaElement : window.HTMLInputElement;
  Object.getOwnPropertyDescriptor(proto.prototype, 'value').set.call(el, v2);
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
}, [sel, valor]);

const clicarTexto = (t)=>a.evaluate(x=>{const e=[...document.querySelectorAll('span,div,button')]
  .find(y=>y.textContent?.trim()===x); if(!e) throw new Error('nao achei: '+x); e.click();}, t);

// ---------- selecionar uma foto ----------
await checa('selecionar foto do quadro', async()=>{
  await a.evaluate(()=>{const p=document.querySelector('[data-om-palco]');
    const d=[...p.querySelectorAll('div')].filter(e=>{const k=Object.keys(e).find(x=>x.startsWith('__reactProps'));
      return k && typeof e[k].onContextMenu==='function';})[0]; d.click();});
});

// ---------- inspetor da FOTO ----------
for (const btn of ['Encaixar','Preencher','Girar','Espelhar'])
  await checa(`enquadramento: ${btn}`, ()=>clicarTexto(btn));

await checa('zoom da foto (campo)', ()=>escrever('input[type=number]','150'));

for (const [nome,idx] of [['brilho',0],['contraste',1],['saturação',2]])
  await checa(`ajuste: ${nome}`, ()=>a.evaluate(i=>{
    const r=[...document.querySelectorAll('input[type=range]')].filter(x=>x.min==='-100');
    const el=r[i]; if(!el) throw new Error('slider ausente');
    // Valor sempre diferente do atual: repor o mesmo número não muda nada e
    // o teste acusaria "sem efeito" num controle que funciona.
    const novo = Number(el.value) > 0 ? -55 : 55;
    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set.call(el, String(novo));
    el.dispatchEvent(new Event('input',{bubbles:true}));
    el.dispatchEvent(new Event('change',{bubbles:true}));}, idx));

for (const ef of ['Sépia','Vintage','Preto e branco','Original'])
  await checa(`efeito: ${ef}`, ()=>a.evaluate(x=>{
    const e=[...document.querySelectorAll('span')].find(y=>y.textContent?.trim()===x);
    if(!e) throw new Error('efeito ausente'); e.parentElement.click();}, ef));

// ---------- layout ----------
await checa('trocar layout', ()=>a.evaluate(()=>{
  const l=[...document.querySelectorAll('div')].filter(e=>e.getAttribute('title')?.includes('por página'));
  l[5]?.click();}));

// ---------- espaçamento ----------
await checa('espaçamento entre fotos', async()=>{
  await a.evaluate(()=>[...document.querySelectorAll('span')]
    .find(e=>e.getAttribute('title')==='Espaçamento entre as fotos')?.click());
  await new Promise(r=>setTimeout(r,500));
  await escrever('input[type=number][max="20"][step="0.5"]','12');
});

// ---------- fundos ----------
await aba('Fundos');
await checa('fundo: cor do papel', ()=>a.evaluate(()=>{
  const t=[...document.querySelectorAll('p')].find(e=>e.textContent==='Cor do papel');
  if(!t) throw new Error('grade de papel ausente');
  [...t.nextElementSibling.querySelectorAll('span')][5]?.click();}));
await checa('fundo: padrão', ()=>a.evaluate(()=>{
  const p=[...document.querySelectorAll('span')].filter(e=>e.style.backgroundImage?.includes('svg+xml')&&e.style.aspectRatio);
  p[5]?.click();}));
await checa('fundo: todo o álbum', ()=>clicarTexto('Todo o álbum'));

// ---------- texto ----------
await aba('Texto');
await checa('inserir título', ()=>a.evaluate(()=>{
  const p=[...document.querySelectorAll('p')].find(e=>e.textContent==='Título'); p.parentElement.click();}));
await checa('editar conteúdo', ()=>a.evaluate(()=>{
  const ta=document.querySelector('textarea'); if(!ta) throw new Error('sem textarea');
  Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype,'value').set
    .call(ta, 'Nosso casamento ' + Math.random().toString(36).slice(2,7));
  ta.dispatchEvent(new Event('input',{bubbles:true}));
  ta.dispatchEvent(new Event('change',{bubbles:true}));}));
for (const f of ['Serifa','Manuscrita'])
  await checa(`fonte: ${f}`, ()=>clicarTexto(f));
await checa('tamanho do texto', ()=>escrever('input[type=number][max="40"]','11'));
await checa('peso do texto', ()=>escrever('input[type=number][max="900"]','300'));
for (const t of ['Esquerda','MAIÚSCULAS','Itálico'])
  await checa(`texto: ${t}`, ()=>clicarTexto(t));
await checa('cor do texto', ()=>a.evaluate(()=>{
  const cs=[...document.querySelectorAll('span')].filter(e=>e.style.aspectRatio==='1 / 1'&&e.style.borderRadius==='7px');
  cs[8]?.click();}));

// ---------- elementos ----------
await aba('Elementos');
await checa('inserir elemento', async()=>{
  await a.evaluate(()=>[...document.querySelectorAll('span')].find(e=>e.textContent?.trim()==='Viagem')?.click());
  await new Promise(r=>setTimeout(r,1900));
  await a.evaluate(()=>{const g=[...document.querySelectorAll('div')].filter(e=>e.style.backgroundImage?.includes('svg')); g[2]?.click();});
});

// ---------- prévia ----------
await checa('abrir prévia', ()=>clicarTexto('Prévia'));
const prev = await a.evaluate(()=>{
  const m=[...document.querySelectorAll('div')].find(e=>e.style.zIndex==='81');
  if(!m) return null;
  return { rotulo: (m.textContent||'').match(/(Capa|Lâmina \d+) · \d+ de \d+/)?.[0],
           paginas: m.querySelectorAll('section').length,
           imagens: m.querySelectorAll('img').length,
           botoes: m.querySelectorAll('span[title]').length };});
console.log('\n--- PRÉVIA ---');
console.log(prev ? JSON.stringify(prev) : 'nao abriu');
if(prev){
  await a.evaluate(()=>{const m=[...document.querySelectorAll('div')].find(e=>e.style.zIndex==='81');
    [...m.querySelectorAll('span[title]')].find(x=>x.title==='Próxima')?.click();});
  await pausa(1200);
  console.log('apos "Próxima":', await a.evaluate(()=>{const m=[...document.querySelectorAll('div')].find(e=>e.style.zIndex==='81');
    return (m.textContent||'').match(/(Capa|Lâmina \d+) · \d+ de \d+/)?.[0];}));
  await a.evaluate(()=>{const m=[...document.querySelectorAll('div')].find(e=>e.style.zIndex==='81');
    [...m.querySelectorAll('span[title]')].find(x=>x.title==='Reproduzir')?.click();});
  await pausa(3200);
  console.log('apos "Reproduzir" (2,6s):', await a.evaluate(()=>{const m=[...document.querySelectorAll('div')].find(e=>e.style.zIndex==='81');
    return (m.textContent||'').match(/(Capa|Lâmina \d+) · \d+ de \d+/)?.[0];}));
}

console.log('\n--- CAMPOS ---');
for (const [n,st,d] of R) console.log(`  ${st==='ok'?'✓':'✗'} ${n.padEnd(30)} ${st}${d?' — '+d:''}`);
console.log('\nerros de página:', erros.length? erros.slice(0,3).join(' / ') : 'nenhum');
console.log(
  '\nNota: "fundo: todo o álbum" e "editar conteúdo" podem sair como SEM EFEITO\n' +
  'numa segunda rodada seguida — repetir a mesma ação com o mesmo estado não\n' +
  'deixa rastro. Rode num projeto limpo para o resultado ser conclusivo.',
);
await b.close();
