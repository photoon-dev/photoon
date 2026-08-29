import { identidadeLojista, lojaAtual, numerosDaLoja, planoDaLoja } from '@/lib/lojista';
import type { PainelDaLoja } from '@/components/app/useDashboardDesign';

/**
 * Os dados de moldura de qualquer tela do lojista.
 *
 * Todas as 16 telas precisam do mesmo conjunto — nome da loja, quem está
 * logado, plano e números. Repetir isso em cada página seria copiar o mesmo
 * `Promise.all` dezesseis vezes.
 */
export async function molduraDaLoja(): Promise<{ loja: { id: string; nome: string; slug: string }; painel: PainelDaLoja } | null> {
  const loja = await lojaAtual();
  if (!loja) return null;

  const [ident, numeros, plano] = await Promise.all([
    identidadeLojista(),
    numerosDaLoja(loja.id),
    planoDaLoja(loja.id),
  ]);

  return {
    loja,
    painel: {
      lojaNome: loja.nome,
      usuarioNome: ident.nome,
      usuarioCargo: ident.email,
      numeros,
      plano: plano ? { nome: plano.nome, limite: plano.limite_projetos } : null,
    },
  };
}
