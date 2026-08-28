'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { currentTenantSlug } from '@/lib/tenant';
import { getLojista, garantirCliente } from '@/lib/data';
import { novaLamina, laminasSemFoto, calcularProgresso, zLaminas, type Lamina } from '@/lib/album';

/** Cria um album vazio na galeria liberada e abre o editor. */
export async function criarProjeto(formData: FormData) {
  const slug = await currentTenantSlug();
  if (!slug) throw new Error('Lojista não identificado.');

  const lojista = await getLojista(slug);
  if (!lojista) throw new Error('Lojista não encontrado.');

  const cliente = await garantirCliente(lojista.id);
  if (!cliente) redirect('/entrar');

  const galeriaId = formData.get('galeria_id');
  const titulo = (formData.get('titulo') as string) || 'Novo álbum';

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projetos')
    .insert({
      lojista_id: lojista.id,
      cliente_id: cliente.id,
      galeria_id: typeof galeriaId === 'string' && galeriaId ? galeriaId : null,
      titulo,
      paginas: [novaLamina(), novaLamina()],
    })
    .select('id')
    .single();

  if (error || !data) throw new Error(error?.message ?? 'Não foi possível criar o projeto.');

  revalidatePath('/meus-projetos');
  redirect(`/editor/${data.id}`);
}

export async function renomearProjeto(id: string, titulo: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('projetos')
    .update({ titulo: titulo.trim() || 'Novo álbum' })
    .eq('id', id);
  if (error) throw new Error(error.message);
  revalidatePath(`/projetos/${id}`);
  revalidatePath('/meus-projetos');
}

/**
 * Autosave do editor. Recalcula progresso, avisos e status a partir das
 * laminas, para que "Meus projetos" e o detalhe reflitam o estado real.
 */
export async function salvarLaminas(id: string, entrada: Lamina[]) {
  const supabase = await createClient();

  // O documento chega do navegador e vai direto para o banco. Sem esquema, um
  // bug no cliente — ou, adiante, a resposta de um modelo — vira lixo
  // persistido que só aparece na impressão, quando não há mais o que fazer.
  const conferido = zLaminas.safeParse(entrada);
  if (!conferido.success) {
    throw new Error(`Documento inválido: ${conferido.error.issues[0]?.path.join('.')}`);
  }
  const laminas = conferido.data;

  const vazias = laminasSemFoto(laminas);
  const progresso = calcularProgresso(laminas);

  const avisos = vazias.length
    ? [
        {
          titulo: `${vazias.length} lâmina${vazias.length === 1 ? '' : 's'} sem foto`,
          descricao: `${vazias.length === 1 ? 'A lâmina' : 'As lâminas'} ${vazias.join(', ')} ${
            vazias.length === 1 ? 'tem quadro vazio' : 'têm quadros vazios'
          }.`,
          nivel: 'obrigatoria' as const,
          acao: 'Corrigir',
        },
      ]
    : [];

  const status =
    progresso === 0 ? 'nao_iniciado' : vazias.length ? 'com_pendencias' : progresso === 100 ? 'pronto' : 'em_edicao';

  const { error } = await supabase
    .from('projetos')
    .update({ paginas: laminas, progresso, avisos, status })
    .eq('id', id);

  if (error) throw new Error(error.message);
  return { progresso, avisos: avisos.length, status };
}
