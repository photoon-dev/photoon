import sharp, { type Sharp } from 'sharp';
import { layout, espacoEmPorcento, type Ret } from './layouts';
import { medidasPorcento } from './imagem';
import { tipografia, type Ajustes, type Lamina, type Pagina, type QuadroFoto, type QuadroTexto } from './album';
import { interpretar as interpretarFundo } from './fundos';

/**
 * Renderizador de impressão.
 *
 * A regra que governa este arquivo: **a conta é a mesma do editor**.
 * `medidasPorcento` e `layout()` são importados, não reescritos — se a
 * impressão tivesse a própria matemática, o cliente aprovaria uma coisa e
 * receberia outra, e a divergência só apareceria no papel.
 *
 * O que muda é o meio: o editor desenha com CSS num elemento de 900px; aqui
 * cada página vira um bitmap no tamanho físico em 300 dpi.
 */

/** Pontos por milímetro na resolução de impressão. */
const DPI = 300;
const PX_POR_MM = DPI / 25.4;

export type Medidas = {
  larguraMm: number;
  alturaMm: number;
  sangriaMm: number;
  areaSeguraMm: number;
};

export const MEDIDAS_PADRAO: Medidas = {
  larguraMm: 300,
  alturaMm: 300,
  sangriaMm: 3,
  areaSeguraMm: 8,
};

const mm = (v: number) => Math.round(v * PX_POR_MM);

/**
 * Ajustes de cor com `sharp`.
 *
 * Ressalva honesta, e é conhecida: `filter: contrast()` do CSS opera em sRGB
 * não-linear e a saturação do CSS usa matriz Rec.601, enquanto
 * `sharp.modulate()` trabalha em HSL. As duas divergem em cores muito
 * saturadas. O objetivo aqui é tolerância aceitável, não igualdade matemática —
 * perseguir o pixel exato exigiria reimplementar os filtros do navegador.
 */
function aplicarAjustes(img: Sharp, a: Ajustes | undefined): Sharp {
  if (!a) return img;
  let out = img;

  const brilho = 1 + (a.brilho / 100) * 0.5;
  const saturacao = 1 + (a.saturacao / 100) * 1;
  if (a.brilho || a.saturacao) out = out.modulate({ brightness: brilho, saturation: Math.max(0, saturacao) });

  if (a.contraste) {
    // `linear(a, b)` é y = a·x + b. Girar em torno de 128 mantém o meio-tom no
    // lugar, que é o que o `contrast()` do CSS faz.
    const k = 1 + (a.contraste / 100) * 0.5;
    out = out.linear(k, 128 * (1 - k));
  }

  switch (a.efeito) {
    case 'pb':
      out = out.grayscale().linear(1.06, -128 * 0.06);
      break;
    case 'sepia':
      out = out.recomb([
        [0.393, 0.769, 0.189],
        [0.349, 0.686, 0.168],
        [0.272, 0.534, 0.131],
      ]);
      break;
    case 'vintage':
      out = out.modulate({ saturation: 0.85, brightness: 1.06 }).linear(0.92, 128 * 0.08);
      break;
    case 'desbotado':
      out = out.modulate({ saturation: 0.6, brightness: 1.1 }).linear(0.88, 128 * 0.12);
      break;
    case 'quente':
      out = out.modulate({ saturation: 1.2, brightness: 1.03 }).tint({ r: 255, g: 244, b: 230 });
      break;
    case 'frio':
      out = out.modulate({ saturation: 1.1, brightness: 1.02 }).tint({ r: 232, g: 242, b: 255 });
      break;
    default:
      break;
  }
  return out;
}

/** Retângulo do quadro em pixels da página. */
function emPixels(r: Ret, largura: number, altura: number) {
  return {
    left: Math.round((r.x / 100) * largura),
    top: Math.round((r.y / 100) * altura),
    width: Math.max(1, Math.round((r.w / 100) * largura)),
    height: Math.max(1, Math.round((r.h / 100) * altura)),
  };
}

/**
 * Compõe um quadro de foto: recorta, ajusta e devolve o bitmap do tamanho do
 * quadro, pronto para colar na página.
 */
async function comporQuadro(
  q: QuadroFoto,
  ret: Ret,
  origem: Buffer,
  largura: number,
  altura: number,
): Promise<{ input: Buffer; left: number; top: number } | null> {
  const caixa = emPixels(ret, largura, altura);

  const meta = await sharp(origem).metadata();
  if (!meta.width || !meta.height) return null;

  const proporcaoFoto = meta.width / meta.height;
  const proporcaoCaixa = caixa.width / caixa.height;

  // MESMA função do editor: é o que garante que o recorte seja idêntico.
  const { w, h } = medidasPorcento(q.enq, proporcaoFoto, proporcaoCaixa);
  const escala = q.enq.escala ?? 1;

  const larguraImg = Math.max(1, Math.round((w / 100) * caixa.width * escala));
  const alturaImg = Math.max(1, Math.round((h / 100) * caixa.height * escala));

  let img = sharp(origem).resize(larguraImg, alturaImg, { fit: 'fill' });
  if (q.enq.espelho) img = img.flop();
  if (q.enq.rot) img = img.rotate(q.enq.rot, { background: { r: 0, g: 0, b: 0, alpha: 0 } });
  img = aplicarAjustes(img, q.ajustes);

  const pronto = await img.png().toBuffer();
  const dims = await sharp(pronto).metadata();
  const iw = dims.width ?? larguraImg;
  const ih = dims.height ?? alturaImg;

  // `dx`/`dy` deslocam em fração de MEIA imagem, exatamente como no editor.
  const desX = Math.round(((q.enq.dx ?? 0) * iw) / 2);
  const desY = Math.round(((q.enq.dy ?? 0) * ih) / 2);

  const esquerda = Math.round((caixa.width - iw) / 2) + desX;
  const topo = Math.round((caixa.height - ih) / 2) + desY;

  // Recorta ao tamanho do quadro: `extract` não aceita coordenada negativa,
  // então a imagem é colada num fundo do tamanho certo e o excesso some.
  const recortado = await sharp({
    create: { width: caixa.width, height: caixa.height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input: pronto, left: esquerda, top: topo }])
    .png()
    .toBuffer();

  let comBorda = sharp(recortado);
  if (q.borda && q.borda.px > 0) {
    // A borda é por DENTRO, como no editor: por fora mudaria o tamanho do
    // quadro e desalinharia a grade.
    const b = Math.max(1, Math.round(q.borda.px * (largura / 900)));
    const moldura = Buffer.from(
      `<svg width="${caixa.width}" height="${caixa.height}">` +
        `<rect x="${b / 2}" y="${b / 2}" width="${caixa.width - b}" height="${caixa.height - b}" ` +
        `fill="none" stroke="${q.borda.cor}" stroke-width="${b}"/></svg>`,
    );
    comBorda = comBorda.composite([{ input: moldura }]);
  }

  return { input: await comBorda.png().toBuffer(), left: caixa.left, top: caixa.top };
}

/** Texto vira SVG, que o sharp compõe com antialias. */
function textoSvg(q: QuadroTexto, largura: number, altura: number): { input: Buffer; left: number; top: number } {
  const caixa = emPixels(q.ret, largura, altura);
  const tp = tipografia(q);
  // `cqw` é % da largura da PÁGINA — a mesma unidade do editor.
  const tamanho = Math.round((tp.tamanho / 100) * largura);
  const ancora = tp.alinhamento === 'left' ? 'start' : tp.alinhamento === 'right' ? 'end' : 'middle';
  const x = tp.alinhamento === 'left' ? 0 : tp.alinhamento === 'right' ? caixa.width : caixa.width / 2;

  const escapado = q.texto.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]!);
  const linhas = escapado.split('\n');
  const alturaLinha = tamanho * 1.2;
  const topo = caixa.height / 2 - ((linhas.length - 1) * alturaLinha) / 2 + tamanho * 0.36;

  const svg =
    `<svg width="${caixa.width}" height="${caixa.height}" xmlns="http://www.w3.org/2000/svg">` +
    linhas
      .map(
        (l, i) =>
          `<text x="${x}" y="${topo + i * alturaLinha}" text-anchor="${ancora}" ` +
          `font-family="${tp.familia.replace(/"/g, "'")}" font-size="${tamanho}" ` +
          `font-weight="${tp.peso}" fill="${q.cor}" ` +
          `letter-spacing="${tp.espacamento}" ` +
          (tp.italico ? 'font-style="italic" ' : '') +
          `>${tp.caixa === 'uppercase' ? l.toUpperCase() : l}</text>`,
      )
      .join('') +
    '</svg>';

  return { input: Buffer.from(svg), left: caixa.left, top: caixa.top };
}

/**
 * Uma página em bitmap.
 *
 * `buscarFoto` é injetado para o renderizador não saber de Supabase: quem chama
 * decide se busca do Storage, de um cache em disco ou de um teste.
 */
export async function renderizarPagina(
  pagina: Pagina,
  fundo: string,
  medidas: Medidas,
  espacoMm: number | undefined,
  buscarFoto: (fotoId: string) => Promise<Buffer | null>,
): Promise<Buffer> {
  const largura = mm(medidas.larguraMm + medidas.sangriaMm * 2);
  const altura = mm(medidas.alturaMm + medidas.sangriaMm * 2);

  const { papel } = interpretarFundo(fundo || '#FFFFFF');
  const base = sharp({
    create: { width: largura, height: altura, channels: 4, background: papel },
  });

  const respiro = espacoEmPorcento(espacoMm, medidas.larguraMm);
  const rets = layout(pagina.layoutId, respiro).quadros;

  const camadas: { input: Buffer; left: number; top: number }[] = [];
  let i = 0;

  for (const q of pagina.quadros) {
    if (q.tipo === 'foto') {
      const ret = rets[i++];
      if (!ret || !q.fotoId) continue;
      const origem = await buscarFoto(q.fotoId);
      if (!origem) continue;
      const camada = await comporQuadro(q, ret, origem, largura, altura);
      if (camada) camadas.push(camada);
    } else if (q.tipo === 'texto') {
      camadas.push(textoSvg(q, largura, altura));
    }
  }

  return base.composite(camadas).jpeg({ quality: 92, chromaSubsampling: '4:4:4' }).toBuffer();
}

/** Lâmina inteira: as duas páginas lado a lado, como o álbum aberto. */
export async function renderizarLamina(
  lamina: Lamina,
  medidas: Medidas,
  buscarFoto: (fotoId: string) => Promise<Buffer | null>,
): Promise<Buffer> {
  const [esq, dir] = await Promise.all([
    renderizarPagina(lamina.esquerda, lamina.fundo, medidas, lamina.espacoMm, buscarFoto),
    renderizarPagina(lamina.direita, lamina.fundo, medidas, lamina.espacoMm, buscarFoto),
  ]);

  const largura = mm(medidas.larguraMm + medidas.sangriaMm * 2);
  const altura = mm(medidas.alturaMm + medidas.sangriaMm * 2);

  return sharp({ create: { width: largura * 2, height: altura, channels: 3, background: '#FFFFFF' } })
    .composite([
      { input: esq, left: 0, top: 0 },
      { input: dir, left: largura, top: 0 },
    ])
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toBuffer();
}
