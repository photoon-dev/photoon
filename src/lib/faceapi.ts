'use client';

import type { Caixa } from './rostos';

/**
 * Detecção de rostos no navegador do LOJISTA, durante o envio das fotos.
 *
 * Roda aqui, e não na VPS, por três motivos: custo zero de servidor (a VPS não
 * cresce com o volume de fotos), o original já está na memória do navegador que
 * o está enviando, e o vetor biométrico nunca precisa transitar por um serviço
 * de terceiros.
 *
 * ~7 MB de modelo, baixados uma vez e mantidos no cache do navegador. A carga é
 * preguiçosa: quem nunca envia foto nunca baixa nada.
 */

export type RostoDetectado = {
  /** Caixa normalizada 0–1 sobre a foto ORIGINAL. */
  caixa: Caixa;
  /** Descritor de 128 dimensões. */
  vetor: number[];
  conf: number;
};

const CAMINHO_MODELOS = '/modelos-rosto';

/** Lado maior a que a foto é reduzida antes de detectar. */
const LADO_ANALISE = 1024;

type FaceApi = typeof import('@vladmandic/face-api');

let carregando: Promise<FaceApi> | null = null;

/** Carrega biblioteca e pesos uma única vez por aba. */
async function carregar(): Promise<FaceApi> {
  if (carregando) return carregando;
  carregando = (async () => {
    const faceapi = await import('@vladmandic/face-api');
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(CAMINHO_MODELOS),
      faceapi.nets.faceLandmark68Net.loadFromUri(CAMINHO_MODELOS),
      faceapi.nets.faceRecognitionNet.loadFromUri(CAMINHO_MODELOS),
    ]);
    return faceapi;
  })();
  try {
    return await carregando;
  } catch (e) {
    // Deixa tentar de novo no próximo envio em vez de travar a aba para sempre.
    carregando = null;
    throw e;
  }
}

/** `true` quando os modelos já estão prontos (evita spinner desnecessário). */
export function modelosProntos(): boolean {
  return carregando !== null;
}

/**
 * Desenha o arquivo num canvas reduzido.
 *
 * Detectar sobre o original de 24 MP gasta memória à toa: o detector trabalha
 * em 416px de qualquer forma. A caixa sai normalizada, então a redução não
 * afeta o resultado gravado.
 */
async function paraCanvas(arquivo: Blob): Promise<{
  canvas: HTMLCanvasElement;
  largura: number;
  altura: number;
} | null> {
  const bitmap = await createImageBitmap(arquivo).catch(() => null);
  if (!bitmap) return null;

  const { width, height } = bitmap;
  const fator = Math.min(1, LADO_ANALISE / Math.max(width, height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(width * fator));
  canvas.height = Math.max(1, Math.round(height * fator));

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    bitmap.close();
    return null;
  }
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return { canvas, largura: width, altura: height };
}

/**
 * Detecta rostos e devolve caixa + descritor, além das dimensões da foto.
 *
 * Nunca lança: um envio de fotos não pode falhar porque a análise de rosto
 * falhou. Sem rosto detectado a foto entra na galeria como sempre entrou.
 */
export async function analisarFoto(arquivo: Blob): Promise<{
  largura: number | null;
  altura: number | null;
  rostos: RostoDetectado[];
}> {
  const vazio = { largura: null, altura: null, rostos: [] as RostoDetectado[] };
  try {
    const preparado = await paraCanvas(arquivo);
    if (!preparado) return vazio;
    const { canvas, largura, altura } = preparado;

    const faceapi = await carregar();
    const achados = await faceapi
      /*
       * inputSize 608 e limiar 0,35, não 416 e 0,5.
       *
       * Com os valores anteriores, 24 fotos de casamento renderam 7 rostos:
       * convidado ao fundo e rosto de perfil passavam batido. O detector
       * redimensiona a imagem para `inputSize`, então rosto pequeno vira
       * poucos pixels — 608 é o degrau seguinte da rede e recupera a maioria.
       *
       * Um limiar mais baixo traz algum falso positivo. Na prática isso é
       * preferível: o lojista apaga uma bolinha errada em um clique, mas não
       * tem como recuperar a pessoa que o detector nunca viu.
       */
      .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions({ inputSize: 608, scoreThreshold: 0.35 }))
      .withFaceLandmarks()
      .withFaceDescriptors();

    const rostos: RostoDetectado[] = achados.map((d) => {
      const b = d.detection.box;
      const cw = canvas.width || 1;
      const ch = canvas.height || 1;
      return {
        // Normalizada sobre a foto original: independe da redução acima e de
        // qualquer miniatura que venha a existir depois.
        caixa: {
          x: Math.max(0, b.x / cw),
          y: Math.max(0, b.y / ch),
          w: Math.min(1, b.width / cw),
          h: Math.min(1, b.height / ch),
        },
        vetor: Array.from(d.descriptor as Float32Array),
        conf: d.detection.score,
      };
    });

    return { largura, altura, rostos };
  } catch {
    // Sem WebGL, aba sem memória, modelo fora do ar: segue sem rostos.
    return { largura: null, altura: null, rostos: [] };
  }
}

/** Só as dimensões, para quando a análise de rosto estiver desligada. */
export async function medirFoto(arquivo: File): Promise<{ largura: number | null; altura: number | null }> {
  try {
    const bitmap = await createImageBitmap(arquivo);
    const r = { largura: bitmap.width, altura: bitmap.height };
    bitmap.close();
    return r;
  } catch {
    return { largura: null, altura: null };
  }
}

/**
 * Analisa uma foto que JÁ está no Storage, a partir da URL assinada.
 *
 * Existe porque a detecção acontece no envio, e toda galeria enviada antes
 * desta função ficaria sem rosto para sempre — nenhum lojista vai reenviar a
 * galeria inteira. É o mesmo caminho de `analisarFoto`, só que a imagem vem
 * da rede em vez do seletor de arquivos.
 *
 * Nunca lança: uma foto que falhe é pulada, e o lote continua.
 */
export async function analisarUrl(url: string): Promise<{
  largura: number | null;
  altura: number | null;
  rostos: RostoDetectado[];
} | null> {
  try {
    const r = await fetch(url, { mode: 'cors' });
    if (!r.ok) return null;
    return await analisarFoto(await r.blob());
  } catch {
    return null;
  }
}
