/**
 * Hook de resolucao para rodar TypeScript direto com `--experimental-strip-types`.
 *
 * O `strip-types` do Node apaga os tipos, mas nao mexe na resolucao de modulo:
 * o resolvedor de ESM exige extensao explicita. Como `src/lib/**` e escrito
 * para o bundler do Next (`./layouts`, sem extensao), importar `impressao.ts`
 * de fora do Next quebrava com ERR_MODULE_NOT_FOUND — era por isso que o
 * worker de renderizacao nunca subiu, mesmo antes de faltar a chave.
 *
 * A alternativa seria bundlar o worker com esbuild, que nao esta no projeto, ou
 * pespegar `.ts` em cada import de `src/lib`, que quebraria o build do Next.
 * Este hook resolve so o que falta: quando o especificador e relativo e nao tem
 * extensao, tenta `.ts`, `.tsx` e `/index.ts` antes de desistir.
 *
 * Tambem cobre o alias `@/` do tsconfig, que o Node nao conhece.
 */
import { registerHooks } from 'node:module';
import { existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve as resolverCaminho } from 'node:path';

const RAIZ = resolverCaminho(dirname(fileURLToPath(import.meta.url)), '..');
const EXTENSOES = ['.ts', '.tsx', '.js', '.mjs', '/index.ts', '/index.tsx'];

function primeiroQueExiste(base) {
  if (existsSync(base) && !base.endsWith('/')) return base;
  for (const ext of EXTENSOES) {
    const tentativa = base + ext;
    if (existsSync(tentativa)) return tentativa;
  }
  return null;
}

registerHooks({
  resolve(especificador, contexto, proximo) {
    const ehRelativo = especificador.startsWith('./') || especificador.startsWith('../');
    const ehAlias = especificador.startsWith('@/');

    if (ehRelativo || ehAlias) {
      const base = ehAlias
        ? resolverCaminho(RAIZ, 'src', especificador.slice(2))
        : resolverCaminho(dirname(fileURLToPath(contexto.parentURL)), especificador);

      const achado = primeiroQueExiste(base);
      if (achado) return { url: pathToFileURL(achado).href, shortCircuit: true };
    }

    return proximo(especificador, contexto);
  },
});
