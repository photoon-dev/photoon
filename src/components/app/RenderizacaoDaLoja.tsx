'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Tabela, { type Coluna } from '@/components/ui/Tabela';
import BarraDeFiltros, { type Filtro } from '@/components/ui/BarraDeFiltros';
import Paginacao from '@/components/ui/Paginacao';
import EstadoVazio from '@/components/ui/EstadoVazio';
import CartaoKPI from '@/components/ui/CartaoKPI';
import Selo from '@/components/ui/Selo';
import Botao from '@/components/ui/Botao';
import Confirmacao from '@/components/ui/Confirmacao';
import { useFiltrosNaURL } from '@/components/ui/useFiltrosNaURL';
import { COR } from '@/components/ui/tokens';
import { cancelarJob, reprocessar } from '@/app/app/actions-render';
import {
  CANCELAVEIS,
  ESTADOS_JOB,
  JOBS_POR_PAGINA,
  duracao,
  rotuloEtapa,
  termoJob,
  type JobDaLista,
} from '@/lib/render-termos';
// Só o tipo: `import type` some na compilação e não puxa o client do Supabase.
import type { PainelRender } from '@/lib/render';

/**
 * Central de Renderização.
 *
 * O briefing pede que ela saia de dentro de Produção e tenha módulo próprio, e
 * a razão é operacional: a fila trava por motivo técnico (arquivo corrompido,
 * worker fora) e quem resolve isso não é quem imprime.
 *
 * A tela não renderiza nada — lê a fila e enfileira. Quem renderiza é o worker.
 */
export default function RenderizacaoDaLoja({
  jobs,
  total,
  cards,
  servico,
  temAlgum,
  workers,
  pagina,
  erro,
}: PainelRender & {
  workers: { valor: string; rotulo: string }[];
  pagina: number;
  erro?: string | null;
}) {
  const router = useRouter();
  const f = useFiltrosNaURL();
  const [ocupado, iniciar] = useTransition();
  const [cancelando, setCancelando] = useState<JobDaLista | null>(null);

  const num = (n: number) => n.toLocaleString('pt-BR');
  const seg = (s: number | null) =>
    s === null ? '—' : s < 60 ? `${s}s` : `${Math.floor(s / 60)}min ${s % 60}s`;

  const filtros: Filtro[] = [
    {
      chave: 'estado',
      rotulo: 'Status',
      opcoes: [
        { valor: 'andamento', rotulo: 'em andamento' },
        ...ESTADOS_JOB.map((e) => ({ valor: e.id, rotulo: e.rotulo })),
      ],
    },
    { chave: 'worker', rotulo: 'Worker', opcoes: workers },
  ];

  const colunas: Coluna<JobDaLista>[] = [
    {
      chave: 'projeto',
      titulo: 'Projeto',
      largura: 'minmax(180px, 1.6fr)',
      render: (j) => (
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: COR.tinta, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {j.projetos?.codigo ?? '—'} · {j.projetos?.titulo ?? 'projeto removido'}
          </div>
          <div style={{ fontSize: 12, color: COR.fraco }}>
            {j.projetos?.clientes?.nome ?? 'sem cliente'}
            {j.projetos?.produto_nome ? ` · ${j.projetos.produto_nome}` : ''}
          </div>
        </div>
      ),
    },
    {
      chave: 'pedido',
      titulo: 'Pedido',
      largura: '100px',
      render: (j) =>
        j.pedidos ? (
          <a href={`/pedidos/${j.pedidos.id}`} onClick={(e) => e.stopPropagation()}>
            {j.pedidos.codigo ?? `#${j.pedidos.numero}`}
          </a>
        ) : (
          <span style={{ color: COR.fraco }}>—</span>
        ),
    },
    {
      chave: 'etapa',
      titulo: 'Etapa',
      largura: '124px',
      render: (j) => <span style={{ color: COR.apagado }}>{rotuloEtapa(j.etapa)}</span>,
    },
    {
      chave: 'progresso',
      titulo: 'Progresso',
      largura: '120px',
      ordenavel: true,
      render: (j) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 6, borderRadius: 999, background: COR.linha, overflow: 'hidden' }}>
            <div
              style={{
                width: `${j.progresso}%`,
                height: '100%',
                borderRadius: 999,
                background: j.estado === 'erro' ? COR.coral : COR.gradiente,
              }}
            />
          </div>
          <span style={{ fontSize: 12, color: COR.fraco, fontVariantNumeric: 'tabular-nums' }}>
            {j.progresso}%
          </span>
        </div>
      ),
    },
    {
      chave: 'tempo',
      titulo: 'Tempo',
      largura: '92px',
      alinha: 'right',
      render: (j) => <span style={{ color: COR.apagado }}>{duracao(j.iniciado_em, j.concluido_em)}</span>,
    },
    {
      chave: 'worker',
      titulo: 'Worker',
      largura: '110px',
      render: (j) => <span style={{ color: COR.apagado }}>{j.render_workers?.nome ?? '—'}</span>,
    },
    {
      chave: 'estado',
      titulo: 'Status',
      largura: '130px',
      ordenavel: true,
      render: (j) => {
        const t = termoJob(j.estado);
        return (
          <Selo tom={t.tom} titulo={j.erro_mensagem ?? undefined}>
            {t.rotulo}
            {j.tentativa > 1 ? ` · ${j.tentativa}ª` : ''}
          </Selo>
        );
      },
    },
    {
      chave: 'acoes',
      titulo: 'Ações',
      largura: '164px',
      render: (j) => (
        <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
          {j.estado === 'erro' && (
            <Botao
              variante="secundario"
              ocupado={ocupado}
              style={{ height: 32, padding: '0 11px', fontSize: 12.5 }}
              onClick={() => iniciar(async () => { await reprocessar(j.id); router.refresh(); })}
            >
              Reprocessar
            </Botao>
          )}
          {CANCELAVEIS.includes(j.estado) && (
            <Botao
              variante="suave"
              style={{ height: 32, padding: '0 11px', fontSize: 12.5, color: COR.coral }}
              onClick={() => setCancelando(j)}
            >
              Cancelar
            </Botao>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: '26px 30px 60px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <p style={{ margin: '0 0 8px', fontSize: 12, letterSpacing: '1.6px', textTransform: 'uppercase', color: COR.fraco, fontWeight: 700 }}>
          Operação
        </p>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: '-0.6px' }}>
          Central de Renderização
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: 14.5, color: COR.apagado, maxWidth: '68ch' }}>
          A fila que transforma projeto em arquivo de impressão. Renderização é um módulo
          próprio: a fila trava por motivo técnico, e quem resolve isso não é quem imprime.
        </p>
      </div>

      {/* ---------------------------- estado do serviço --------------------- */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          flexWrap: 'wrap',
          padding: '14px 20px',
          borderRadius: 16,
          background: servico.online ? '#E6F8F1' : '#FFF1F3',
          border: `1px solid ${servico.online ? '#BFEBD9' : '#FBD5DC'}`,
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 9, fontWeight: 700, fontSize: 14, color: servico.online ? COR.verde : COR.coral }}>
          <span style={{ width: 9, height: 9, borderRadius: 999, background: 'currentColor' }} />
          Renderer {servico.online ? 'online' : 'offline'}
        </span>
        <span style={{ fontSize: 13, color: COR.apagado }}>
          Workers ativos: <b>{servico.ativos}</b> de {servico.total || '—'}
        </span>
        <span style={{ fontSize: 13, color: COR.apagado }}>
          Fila: <b>{cards.naFila}</b>
        </span>
        <span style={{ fontSize: 13, color: COR.apagado }}>
          Tempo médio: <b>{seg(cards.tempoMedio)}</b>
        </span>
        {!servico.online && servico.total === 0 && (
          <span style={{ fontSize: 12.5, color: COR.apagado }}>
            Nenhum worker registrado ainda — a fila acumula até um subir.
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 14 }}>
        <CartaoKPI rotulo="Na fila" valor={num(cards.naFila)} nota="aguardando worker" href="/renderizacao?estado=na_fila" />
        <CartaoKPI rotulo="Processando" valor={num(cards.processando)} nota="em andamento" tom="azul" href="/renderizacao?estado=andamento" />
        <CartaoKPI rotulo="Prontos" valor={num(cards.prontos)} nota="arquivos gerados" tom="verde" href="/renderizacao?estado=pronto" />
        <CartaoKPI rotulo="Com erro" valor={num(cards.comErro)} nota={cards.comErro ? 'precisam de alguém' : 'nenhum'} tom={cards.comErro ? 'coral' : 'neutro'} href="/renderizacao?estado=erro" />
        <CartaoKPI rotulo="Tempo médio" valor={seg(cards.tempoMedio)} nota="mediana em 24 h" />
        <CartaoKPI rotulo="Jobs em 24 h" valor={num(cards.ultimas24h)} nota="criados no período" />
      </div>

      <BarraDeFiltros
        placeholder="Buscar pelo código do projeto"
        filtros={filtros}
        valor={f.valor}
        aoMudar={f.aplicar}
        aoLimpar={f.limpar}
        temFiltro={f.filtrado}
        acoes={<Botao variante="secundario" onClick={() => router.refresh()}>Atualizar</Botao>}
      />

      <Tabela
        colunas={colunas}
        linhas={jobs}
        chaveDe={(j) => j.id}
        ordem={f.ordem}
        aoOrdenar={f.ordenarPor}
        aoAbrir={(j) => router.push(`/renderizacao/${j.id}`)}
        carregando={f.pendente}
        erro={erro ? { mensagem: erro, tentarDeNovo: () => router.refresh() } : null}
        vazio={
          f.filtrado ? (
            <EstadoVazio
              filtrado
              titulo="Nenhum job neste recorte"
              acao={<Botao variante="secundario" onClick={f.limpar}>Limpar filtros</Botao>}
            />
          ) : temAlgum ? (
            <EstadoVazio titulo="A fila está vazia" descricao="Todos os jobs desta loja já terminaram." />
          ) : (
            <EstadoVazio
              titulo="Nenhuma renderização ainda"
              descricao="Um job nasce quando alguém manda renderizar um projeto, pela tela do projeto ou pela do pedido."
            />
          )
        }
        rodape={
          <Paginacao
            pagina={pagina}
            porPagina={JOBS_POR_PAGINA}
            total={total}
            aoIr={(p) => f.aplicar({ pagina: p || null }, { manterPagina: true })}
          />
        }
      />

      <Confirmacao
        aberto={cancelando !== null}
        aoFechar={() => setCancelando(null)}
        titulo="Cancelar esta renderização?"
        descricao={
          cancelando
            ? `O job do projeto ${cancelando.projetos?.codigo ?? ''} para de andar e o projeto volta a "Pronto". Os arquivos já gerados continuam onde estão.`
            : ''
        }
        rotuloConfirmar="Cancelar job"
        motivo
        aoConfirmar={async (motivo) => {
          if (!cancelando) return;
          await cancelarJob(cancelando.id, motivo ?? 'sem motivo informado');
          router.refresh();
        }}
      />
    </div>
  );
}
