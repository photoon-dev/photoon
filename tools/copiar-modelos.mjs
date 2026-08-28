/**
 * Copia os modelos do face-api para `public/modelos-rosto/`.
 *
 * Os pesos vêm do pacote npm, não do repositório: são ~7 MB de binário que
 * mudariam de versão junto com a biblioteca. Copiar na build garante que o
 * modelo servido é o da versão instalada — e mantém o Git leve.
 *
 * Roda sozinho antes de `npm run dev` e `npm run build`.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const origem = join(raiz, 'node_modules', '@vladmandic', 'face-api', 'model');
const destino = join(raiz, 'public', 'modelos-rosto');

// Só os três de que precisamos. `ssd_mobilenetv1` (5,6 MB) é mais preciso, mas
// o `tiny` detecta bem em foto de estúdio e economiza a maior parte do download;
// idade/expressão não entram porque não são usados.
const PRECISA = [
  'tiny_face_detector_model',
  'face_landmark_68_model',
  'face_recognition_model',
];

if (!existsSync(origem)) {
  console.warn('[modelos-rosto] pacote face-api ausente; nada copiado');
  process.exit(0);
}

mkdirSync(destino, { recursive: true });

let copiados = 0;
let bytes = 0;
for (const arq of readdirSync(origem)) {
  if (!PRECISA.some((p) => arq.startsWith(p))) continue;
  const de = join(origem, arq);
  const para = join(destino, arq);
  // Não recopia o que já está lá com o mesmo tamanho: mantém o `dev` rápido.
  if (existsSync(para) && statSync(para).size === statSync(de).size) continue;
  copyFileSync(de, para);
  copiados++;
  bytes += statSync(de).size;
}

console.log(
  copiados
    ? `[modelos-rosto] ${copiados} arquivo(s), ${(bytes / 1048576).toFixed(1)} MB`
    : '[modelos-rosto] já atualizados',
);
