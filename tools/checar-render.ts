/**
 * Verificador da renderização de impressão.
 *
 * Roda `renderizarLamina` de ponta a ponta com fotos sintéticas, sem Supabase e
 * sem worker. Serve para dizer, em segundos, se o renderizador em si está de pé
 * — separando "o render está quebrado" de "falta credencial/infra", que foi
 * exatamente a confusão que deixou a renderização parada.
 *
 * Cobre o caso que quebrava: foto no modo `preencher`, em que a imagem escalada
 * fica MAIOR que o quadro e o `composite` do sharp recusava a entrada.
 *
 *   node --experimental-strip-types --import ./tools/resolver-ts.mjs tools/checar-render.ts
 */
import sharp from 'sharp';
import { renderizarLamina, type Medidas } from '../src/lib/impressao.ts';
import { migrarLaminas } from '../src/lib/album.ts';

const MEDIDAS: Medidas = { larguraMm: 300, alturaMm: 300, sangriaMm: 3, areaSeguraMm: 8 };
// 300mm + 3mm de sangria de cada lado = 306mm; 306 * 300/25.4 = 3614 px.
const LARGURA_PAGINA = 3614;

let problemas = 0;
const ok = (rotulo: string, passou: boolean, detalhe = '') => {
  console.log(`${passou ? 'ok  ' : 'NAO '} ${rotulo.padEnd(38)} ${detalhe}`);
  if (!passou) problemas++;
};

const foto = (cor: { r: number; g: number; b: number }, w = 1600, h = 1200) =>
  sharp({ create: { width: w, height: h, channels: 3, background: cor } }).jpeg().toBuffer();

const fotos = new Map<string, Buffer>([
  ['f1', await foto({ r: 200, g: 90, b: 70 })],
  ['f2', await foto({ r: 70, g: 120, b: 200 })],
  // Retrato: proporção invertida, para exercitar o corte no outro eixo.
  ['f3', await foto({ r: 80, g: 170, b: 110 }, 1200, 1600)],
]);
const buscar = async (id: string) => fotos.get(id) ?? null;

const enq = (extra: Record<string, unknown> = {}) => ({
  modo: 'preencher', escala: 1, dx: 0, dy: 0, rot: 0, espelho: false, ...extra,
});
const ajustes = (efeito = 'nenhum') => ({ brilho: 0, contraste: 0, saturacao: 0, efeito });

const quadroFoto = (id: string, fotoId: string, e = enq(), a = ajustes()) =>
  ({ id, tipo: 'foto', fotoId, enq: e, ajustes: a });

async function cenario(nome: string, lamina: unknown) {
  try {
    const [migrada] = migrarLaminas([lamina]);
    const jpeg = await renderizarLamina(migrada, MEDIDAS, buscar);
    const meta = await sharp(jpeg).metadata();
    const certo = meta.width === LARGURA_PAGINA * 2 && meta.height === LARGURA_PAGINA;
    ok(nome, certo, `${meta.width}x${meta.height}px, ${Math.round(jpeg.length / 1024)} KB`);
  } catch (e) {
    ok(nome, false, e instanceof Error ? e.message : String(e));
  }
}

const pagina = (quadros: unknown[]) => ({ layoutId: 'dupla-h', quadros });
const lamina = (esq: unknown[], dir: unknown[]) =>
  ({ id: 'l', fundo: '#FFFFFF', espacoMm: 3, reserva: [], esquerda: pagina(esq), direita: pagina(dir) });

console.log('\n-- renderizacao de lamina (300 dpi) --\n');

await cenario('preencher (imagem maior que o quadro)',
  lamina([quadroFoto('a', 'f1'), quadroFoto('b', 'f2')], [quadroFoto('c', 'f3')]));

await cenario('encaixar (imagem menor que o quadro)',
  lamina([quadroFoto('a', 'f1', enq({ modo: 'encaixar' }))], [quadroFoto('b', 'f3', enq({ modo: 'encaixar' }))]));

await cenario('deslocamento extremo (dx/dy no limite)',
  lamina([quadroFoto('a', 'f1', enq({ dx: 1, dy: 1 }))], [quadroFoto('b', 'f2', enq({ dx: -1, dy: -1 }))]));

await cenario('escala e rotacao',
  lamina([quadroFoto('a', 'f1', enq({ escala: 2, rot: 90 }))], [quadroFoto('b', 'f3', enq({ rot: 270 }))]));

await cenario('efeitos de cor',
  lamina([quadroFoto('a', 'f2', enq(), ajustes('sepia'))], [quadroFoto('b', 'f1', enq(), ajustes('pb'))]));

await cenario('texto + foto',
  lamina([quadroFoto('a', 'f1')],
    [{ id: 't', tipo: 'texto', texto: 'Casamento\nAna & Rui', preset: 'titulo', cor: '#0B1220',
       ret: { x: 10, y: 70, w: 80, h: 20 } }]));

await cenario('lamina vazia (sem quadro)', lamina([], []));

await cenario('foto ausente no acervo',
  lamina([quadroFoto('a', 'inexistente')], [quadroFoto('b', 'f1')]));

console.log(`\n${problemas} problema(s)\n`);
process.exit(problemas ? 1 : 0);
