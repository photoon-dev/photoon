import { redirect } from 'next/navigation';
import { lojaAtual } from '@/lib/lojista';
import { listarPedidos } from '@/lib/pedidos';
import { createClient } from '@/lib/supabase/server';
import PedidosDoDesign from '@/components/app/PedidosDoDesign';
import BarraDeFiltrosPedidos, { type OpcoesFiltro } from '@/components/app/BarraDeFiltrosPedidos';
import ShellLojista from '@/components/app/ShellLojista';
import { MODULO } from '@/lib/rotas-lojista';
import '../app.css';

export const dynamic = 'force-dynamic';

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const loja = await lojaAtual();
  if (!loja) redirect('/');

  // Os 15 filtros vivem na URL.
  const q = await searchParams;
  const filtros = {
    busca: q.busca ?? '',
    numero: q.numero ?? '',
    codigo: q.codigo ?? '',
    cliente: q.cliente ?? '',
    projeto: q.projeto ?? '',
    produto: q.produto ?? '',
    categoria: q.categoria ?? '',
    tipo: q.tipo ?? q.categoria ?? '',
    filial: q.filial ?? '',
    canal: q.canal ?? '',
    de: q.de ?? '',
    ate: q.ate ?? '',
    estado: q.estado ?? '',
    forma_pagamento: q.forma_pagamento ?? '',
    status_pagamento: q.status_pagamento ?? '',
    status_producao: q.status_producao ?? '',
    status_entrega: q.status_entrega ?? '',
    pagina: Number(q.pagina ?? 0) || 0,
  };

  // Pre-fetch das opcoes de filial/cliente para os selects da barra.
  const supabase = await createClient();
  const [{ data: filiais }, { data: clientes }] = await Promise.all([
    supabase
      .from('filiais')
      .select('id, nome')
      .eq('lojista_id', loja.id)
      .eq('ativo', true)
      .order('nome')
      .limit(200),
    supabase
      .from('clientes')
      .select('id, nome, email')
      .eq('lojista_id', loja.id)
      .order('nome')
      .limit(500),
  ]);

  const filiaisOpcoes: OpcoesFiltro[] = (filiais ?? []).map((f) => ({
    id: f.id as string,
    rotulo: f.nome as string,
  }));
  const clientesOpcoes: OpcoesFiltro[] = (clientes ?? []).map((c) => ({
    id: c.id as string,
    rotulo: `${c.nome ?? 'Sem nome'}${c.email ? ` · ${c.email}` : ''}`,
  }));

  const dados = await listarPedidos(loja.id, filtros);

  return (
    <ShellLojista ativo={MODULO['Pedidos']}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <BarraDeFiltrosPedidos
          filiais={filiaisOpcoes}
          clientes={clientesOpcoes}
          totalFiltrado={dados.total}
        />
        <PedidosDoDesign
          pedidos={dados.pedidos}
          total={dados.total}
          naoVistos={dados.naoVistos}
          filtros={filtros}
        />
      </div>
    </ShellLojista>
  );
}
