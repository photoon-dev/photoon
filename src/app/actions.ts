'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { currentTenantSlug } from '@/lib/tenant';
import { getLojista, garantirCliente } from '@/lib/data';
import {
  novaLamina,
  laminasSemFoto,
  calcularProgresso,
  fotosUsadas,
  zLaminas,
  type Lamina,
} from '@/lib/album';

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

  const usadas = fotosUsadas(laminas);

  const { error } = await supabase
    .from('projetos')
    .update({ paginas: laminas, progresso, avisos, status, fotos_usadas: usadas.size })
    .eq('id', id);

  if (error) throw new Error(error.message);

  await sincronizarFotosDoProjeto(supabase, id, [...usadas]);

  return { progresso, avisos: avisos.length, status };
}

/**
 * Espelha em `projeto_fotos` as fotos que o documento realmente usa.
 *
 * O `fotoId` de cada quadro só existe dentro do JSON de `projetos.paginas`.
 * `projeto_fotos` e a tabela que o RESTO do sistema le: o worker de
 * renderizacao monta o acervo por ela (`tools/worker-render.ts`), a Galeria
 * marca "ja usada" (`usoDasFotos`) e a contagem de fotos do album sai dali
 * (`CAMPOS_PROJETO`, com `projeto_fotos(count)`).
 *
 * Ninguem escrevia nessa tabela. Ela ficava vazia sempre, e nada no editor
 * denunciava isso — o editor le as fotos da galeria, nao do indice. O efeito
 * so apareceria no papel: o worker nao acharia caminho para nenhum `fotoId` e
 * renderizaria o album inteiro em branco, tecnicamente sem erro.
 *
 * E indice derivado do documento, e o documento e a verdade. Por isso uma
 * falha aqui NAO derruba o autosave: perder o indice de uma gravacao custa uma
 * contagem desatualizada ate a proxima; perder a gravacao custa o trabalho do
 * cliente. O worker tambem sabe cair em `galeria_fotos` quando o indice nao
 * tem a foto, entao nem a renderizacao depende desta escrita ter dado certo.
 */
async function sincronizarFotosDoProjeto(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projetoId: string,
  usadas: string[],
) {
  const { data: atuais, error: erroLeitura } = await supabase
    .from('projeto_fotos')
    .select('galeria_foto_id')
    .eq('projeto_id', projetoId);

  if (erroLeitura) {
    console.error('projeto_fotos: nao consegui ler o indice atual', erroLeitura.message);
    return;
  }

  const tinha = new Set((atuais ?? []).map((l) => l.galeria_foto_id as string));
  const tem = new Set(usadas);

  // O autosave dispara a cada mexida; na maioria delas o conjunto de fotos nao
  // muda. Sem este par de diffs, toda tecla escreveria na tabela a toa.
  const entrando = usadas.filter((foto) => !tinha.has(foto));
  const saindo = [...tinha].filter((foto) => !tem.has(foto));

  if (entrando.length) {
    // `ordem` e a posicao no album; a chave primaria e (projeto_id, foto), e o
    // upsert cobre a corrida de dois autosaves proximos.
    const { error } = await supabase.from('projeto_fotos').upsert(
      entrando.map((galeria_foto_id) => ({
        projeto_id: projetoId,
        galeria_foto_id,
        ordem: usadas.indexOf(galeria_foto_id),
      })),
      { onConflict: 'projeto_id,galeria_foto_id' },
    );
    if (error) console.error('projeto_fotos: nao consegui registrar as fotos novas', error.message);
  }

  if (saindo.length) {
    // A foto saiu do album: a linha some do indice. Nao e a regra 14 (arquivo
    // do projeto nunca some em silencio) — o arquivo continua na galeria,
    // intocado; o que se apaga aqui e so a afirmacao "este album usa esta foto".
    const { error } = await supabase
      .from('projeto_fotos')
      .delete()
      .eq('projeto_id', projetoId)
      .in('galeria_foto_id', saindo);
    if (error) console.error('projeto_fotos: nao consegui soltar as fotos removidas', error.message);
  }
}
