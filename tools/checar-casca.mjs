/**
 * Confere a casca do painel do lojista.
 *
 * Três fontes precisam concordar e é fácil uma sair de sincronia sem barulho:
 *
 *   - `design/extraido/Dashboard.dc.html` — o menu desenhado
 *   - `src/lib/rotas-lojista.ts`          — o índice de rotas
 *   - `src/app/app/**\/page.tsx`           — as telas que existem de fato
 *
 * O que ele proíbe: item de menu sem `pick`, módulo marcado como pronto sem
 * página, rota antiga que sumiu antes de o destino existir, e qualquer tela do
 * design que volte a trazer o menu junto.
 *
 *   node tools/checar-casca.mjs
 */
import fs from 'node:fs';

const ts = fs.readFileSync('src/lib/rotas-lojista.ts', 'utf8');

const itens = [...ts.matchAll(
  /\{ indice: (\d+),\s+rotulo: '([^']+)',\s+rota: '([^']+)',\s+pronto: (true|false)\s*\}/g,
)].map(([, i, rotulo, rota, pronto]) => ({ i: +i, rotulo, rota, pronto: pronto === 'true' }));

const legadas = [...ts.matchAll(
  /\{ de: '([^']+)',\s+para: '([^']+)',\s+destino: '[^']*',\s+migrado: (true|false)\s*\}/g,
)].map(([, de, para, migrado]) => ({ de, para, migrado: migrado === 'true' }));

const shell = fs.readFileSync('src/components/design/ShellLojistaDesign.tsx', 'utf8');
const picks = [...shell.matchAll(/onClick=\{v\.pick(\d+)\}/g)].map((m) => +m[1]);

/** O middleware reescreve /x do lojista para /app/x. */
const existe = (rota) =>
  fs.existsSync('src/app/app' + (rota === '/' ? '' : rota) + '/page.tsx');

let erros = 0;
const falha = (m) => { erros++; console.log('  ! ' + m); };

console.log('ITEM  ROTULO                ROTA                    MENU  ESTADO  PAGINA');
for (const it of itens) {
  const noMenu = picks.includes(it.i);
  const pagina = existe(it.rota);
  console.log(
    String(it.i).padEnd(6) + it.rotulo.padEnd(22) + it.rota.padEnd(24) +
    (noMenu ? 'sim' : 'NAO').padEnd(6) +
    (it.pronto ? 'ativo' : 'esmaec').padEnd(8) +
    (pagina ? 'sim' : 'nao'),
  );
  if (!noMenu) falha(`${it.rotulo}: no índice e não no menu desenhado`);
  if (it.pronto && !pagina) falha(`${it.rotulo}: marcado pronto e sem page.tsx — link morto`);
  if (!it.pronto && pagina) falha(`${it.rotulo}: tem page.tsx e está esmaecido — libere em rotas-lojista.ts`);
}
if (picks.length !== itens.length) falha(`menu desenha ${picks.length} itens e o índice tem ${itens.length}`);

console.log('\nROTAS ANTIGAS (fora do menu, de pé até o destino existir)');
for (const l of legadas) {
  const viva = existe(l.de);
  const destino = existe(l.para.split('?')[0]);
  console.log(`  ${l.de.padEnd(14)} -> ${l.para.padEnd(34)} pagina: ${viva ? 'responde' : 'SUMIU'}  destino: ${destino ? 'pronto' : 'ainda nao'}`);
  if (!viva && !l.migrado) falha(`${l.de}: página removida antes de o destino existir`);
}

const menuCel = fs.readFileSync('src/components/app/MenuLojista.tsx', 'utf8');
if (!menuCel.includes("from '@/lib/rotas-lojista'")) falha('menu de celular não usa MENU_LOJISTA');

const comMenu = fs.readdirSync('src/components/design')
  .filter((f) => fs.readFileSync('src/components/design/' + f, 'utf8').includes('v.pick0'));
if (comMenu.length !== 1 || comMenu[0] !== 'ShellLojistaDesign.tsx') {
  falha(`telas com menu próprio: ${comMenu.join(', ')} — só a casca pode ter`);
}

console.log(`\ncelular e desktop na mesma fonte: ${menuCel.includes("from '@/lib/rotas-lojista'") ? 'sim' : 'NAO'}`);
console.log(`componentes com menu próprio: ${comMenu.length} (${comMenu.join(', ')})`);
console.log(erros ? `\n${erros} problema(s)` : '\nsem problema');
process.exit(erros ? 1 : 0);
