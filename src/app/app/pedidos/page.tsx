import { redirect } from 'next/navigation';
import { identidadeLojista, lojaAtual, numerosDaLoja, planoDaLoja } from '@/lib/lojista';
import { listarPedidos } from '@/lib/pedidos';
import PedidosDoDesign from '@/components/app/PedidosDoDesign';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const atual = await lojaAtual();
  if (!atual) redirect('/');

  // Os filtros vivem na URL: assim o lojista guarda o link de "pedidos
  // atrasados" e o botão de voltar do navegador funciona.
  const q = await searchParams;
  const filtros = {
    estado: q.estado ?? '',
    de: q.de ?? '',
    ate: q.ate ?? '',
    busca: q.busca ?? '',
    pagina: Number(q.pagina ?? 0) || 0,
  };

  const [dados, ident, numeros, plano] = await Promise.all([
    listarPedidos(atual.id, filtros),
    identidadeLojista(),
    numerosDaLoja(atual.id),
    planoDaLoja(atual.id),
  ]);

  return (
    <PedidosDoDesign
      painel={{
        lojaNome: atual.nome,
        usuarioNome: ident.nome,
        usuarioCargo: ident.email,
        numeros,
        plano: plano ? { nome: plano.nome, limite: plano.limite_projetos } : null,
      }}
      pedidos={dados.pedidos}
      total={dados.total}
      naoVistos={dados.naoVistos}
      filtros={filtros}
    />
  );
}
