'use client';

import { useRouter } from 'next/navigation';
import Tabela, { type Coluna } from '@/components/ui/Tabela';
import BarraDeFiltros, { type Filtro } from '@/components/ui/BarraDeFiltros';
import Paginacao from '@/components/ui/Paginacao';
import EstadoVazio from '@/components/ui/EstadoVazio';
import CartaoKPI from '@/components/ui/CartaoKPI';
import Selo from '@/components/ui/Selo';
import Botao from '@/components/ui/Botao';
import { useFiltrosNaURL } from '@/components/ui/useFiltrosNaURL';
import { COR } from '@/components/ui/tokens';
import {
  PROJETOS_POR_PAGINA,
  STATUS_PROJETO,
  dataCurta,
  laminas,
  tamanho,
  termoProjeto,
  termoRender,
  type ProjetoDaLista,
} from '@/lib/projetos-termos';

/**
 * Central de Projetos.
 *
 * PROJETO é entidade própria e esta tela existe por causa disso: o lojista
 * precisa achar um projeto que ainda não virou pedido — que é justamente o que
 * a tela de Pedidos não mostra.
 *
 * Não há `Projetos.dc.html` no design; a tela é montada com o kit
 * (`src/components/ui`), que usa os mesmos valores do Design System das telas
 * transliteradas. Preferi isso a inventar um `.dc.html` que ninguém desenhou.
 *
 * Filtros e ordenação vivem na URL: o lojista guarda o link de "com erro, da
 * filial Centro" e o botão de voltar funciona.
 */
export default function ProjetosDaLoja({
  projetos,
  total,
  cards,
  temAlgum,
  opcoes,
  pagina,
  erro,
}: {
  projetos: ProjetoDaLista[];
  total: number;
  cards: {
    abertos: number;
    aguardandoFinalizacao: number;
    finalizadosHoje: number;
    comProblema: number;
    semPedido: number;
    bytes: number;
  };
  temAlgum: boolean;
  opcoes: {
    clientes: { valor: string; rotulo: string }[];
    produtos: { valor: string; rotulo: string }[];
    filiais: { valor: string; rotulo: string }[];
  };
  pagina: number;
  /** Falha na consulta — a tabela precisa dizer isso, não fingir lista vazia. */
  erro?: string | null;
}) {
  const router = useRouter();
  const f = useFiltrosNaURL();

  const num = (n: number) => n.toLocaleString('pt-BR');

  const filtros: Filtro[] = [
    { chave: 'status', rotulo: 'Status', opcoes: STATUS_PROJETO.map((s) => ({ valor: s.id, rotulo: s.rotulo })) },
    { chave: 'cliente', rotulo: 'Cliente', opcoes: opcoes.clientes },
    { chave: 'produto', rotulo: 'Produto', opcoes: opcoes.produtos },
    { chave: 'filial', rotulo: 'Filial', opcoes: opcoes.filiais },
    { chave: 'pedido', rotulo: 'Pedido', opcoes: [
      { valor: 'com', rotulo: 'com pedido' },
      { valor: 'sem', rotulo: 'sem pedido' },
    ] },
    { chave: 'capa', rotulo: 'Capa', opcoes: [
      { valor: 'com', rotulo: 'com capa' },
      { valor: 'sem', rotulo: 'sem capa' },
    ] },
    { chave: 'render', rotulo: 'Renderização', opcoes: [
      { valor: 'sim', rotulo: 'renderizado' },
      { valor: 'nao', rotulo: 'não renderizado' },
      { valor: 'erro', rotulo: 'com erro' },
    ] },
    { chave: 'arquivados', rotulo: 'Arquivados', opcoes: [{ valor: 'sim', rotulo: 'só arquivados' }] },
  ];

  const colunas: Coluna<ProjetoDaLista>[] = [
    {
      chave: 'codigo',
      titulo: 'Código',
      largura: '112px',
      ordenavel: true,
      render: (p) => (
        <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: COR.tinta }}>
          {p.codigo ?? '—'}
        </span>
      ),
    },
    {
      chave: 'titulo',
      titulo: 'Projeto',
      largura: 'minmax(180px, 1.5fr)',
      ordenavel: true,
      render: (p) => (
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 600, color: COR.tinta, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {p.titulo}
          </div>
          <div style={{ fontSize: 12, color: COR.fraco }}>
            {p.produto_nome ?? 'sem produto'}
            {p.produto_tamanho ? ` · ${p.produto_tamanho}` : ''}
          </div>
        </div>
      ),
    },
    {
      chave: 'cliente',
      titulo: 'Cliente',
      largura: 'minmax(150px, 1.2fr)',
      render: (p) => (
        <div style={{ minWidth: 0 }}>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {p.clientes?.nome ?? 'sem cliente'}
          </div>
          {p.clientes?.email && (
            <div style={{ fontSize: 12, color: COR.fraco, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {p.clientes.email}
            </div>
          )}
        </div>
      ),
    },
    {
      chave: 'paginas',
      titulo: 'Págs · lâm · fotos',
      largura: '132px',
      alinha: 'right',
      ordenavel: true,
      render: (p) => (
        <span style={{ color: COR.apagado }}>
          {p.total_paginas ?? 0} · {laminas(p.total_paginas)} · {p.fotos_usadas ?? 0}
        </span>
      ),
    },
    {
      chave: 'editado',
      titulo: 'Última edição',
      largura: '110px',
      ordenavel: true,
      render: (p) => <span style={{ color: COR.apagado }}>{dataCurta(p.atualizado_em)}</span>,
    },
    {
      chave: 'pedido',
      titulo: 'Pedido',
      largura: '104px',
      render: (p) =>
        p.pedido ? (
          <a
            href={`/pedidos/${p.pedido.id}`}
            onClick={(e) => e.stopPropagation()}
            style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 600 }}
          >
            {p.pedido.codigo ?? `#${p.pedido.numero}`}
          </a>
        ) : (
          <span style={{ color: COR.fraco }}>sem pedido</span>
        ),
    },
    {
      chave: 'status',
      titulo: 'Status',
      largura: '146px',
      ordenavel: true,
      render: (p) => {
        const t = termoProjeto(p.status);
        return <Selo tom={t.tom}>{t.rotulo}</Selo>;
      },
    },
    {
      chave: 'render',
      titulo: 'Renderização',
      largura: '128px',
      render: (p) => {
        if (!p.render) return <span style={{ color: COR.fraco }}>não iniciada</span>;
        const t = termoRender(p.render);
        return <Selo tom={t.tom}>{t.rotulo}</Selo>;
      },
    },
  ];

  return (
    <div style={{ padding: '26px 30px 60px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <p style={{ margin: '0 0 8px', fontSize: 12, letterSpacing: '1.6px', textTransform: 'uppercase', color: COR.fraco, fontWeight: 700 }}>
          Operação
        </p>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, letterSpacing: '-0.6px' }}>Projetos</h1>
        <p style={{ margin: '8px 0 0', fontSize: 14.5, color: COR.apagado, maxWidth: '68ch' }}>
          Gerencie projetos criados pelos clientes e acompanhe edição, arquivos e renderização.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(168px, 1fr))', gap: 14 }}>
        <CartaoKPI rotulo="Projetos abertos" valor={num(cards.abertos)} nota="rascunho ou em edição" href="/projetos?status=em_edicao" />
        <CartaoKPI rotulo="Aguardando finalização" valor={num(cards.aguardandoFinalizacao)} nota="prontos ou com o cliente" tom="ambar" href="/projetos?status=pronto" />
        <CartaoKPI rotulo="Finalizados hoje" valor={num(cards.finalizadosHoje)} nota="fechados nas últimas horas" tom="verde" />
        <CartaoKPI rotulo="Com problemas" valor={num(cards.comProblema)} nota={cards.comProblema ? 'precisam de alguém' : 'nenhum'} tom={cards.comProblema ? 'coral' : 'neutro'} href="/projetos?status=com_erro" />
        <CartaoKPI rotulo="Sem pedido" valor={num(cards.semPedido)} nota="ainda não comprados" href="/projetos?pedido=sem" />
        <CartaoKPI rotulo="Armazenamento" valor={tamanho(cards.bytes)} nota="arquivos dos projetos" />
      </div>

      <BarraDeFiltros
        placeholder="Buscar por código, projeto, cliente, e-mail, pedido ou produto"
        filtros={filtros}
        valor={f.valor}
        aoMudar={f.aplicar}
        aoLimpar={f.limpar}
        temFiltro={f.filtrado}
        acoes={
          <Botao variante="secundario" onClick={() => router.refresh()}>
            Atualizar
          </Botao>
        }
      />

      <Tabela
        colunas={colunas}
        linhas={projetos}
        chaveDe={(p) => p.id}
        ordem={f.ordem}
        aoOrdenar={f.ordenarPor}
        aoAbrir={(p) => router.push(`/projetos/${p.id}`)}
        carregando={f.pendente}
        erro={erro ? { mensagem: erro, tentarDeNovo: () => router.refresh() } : null}
        vazio={
          f.filtrado ? (
            <EstadoVazio
              filtrado
              titulo="Nenhum projeto neste recorte"
              descricao="Os filtros ativos não deixaram nada. Limpe-os para ver a loja inteira."
              acao={<Botao variante="secundario" onClick={f.limpar}>Limpar filtros</Botao>}
            />
          ) : temAlgum ? (
            <EstadoVazio titulo="Nenhum projeto ativo" descricao="Todos os projetos desta loja estão arquivados." />
          ) : (
            <EstadoVazio
              titulo="Nenhum projeto ainda"
              descricao="Assim que um cliente criar o primeiro álbum, ele aparece aqui — mesmo antes de virar pedido."
            />
          )
        }
        rodape={
          <Paginacao
            pagina={pagina}
            porPagina={PROJETOS_POR_PAGINA}
            total={total}
            aoIr={(p) => f.aplicar({ pagina: p || null }, { manterPagina: true })}
          />
        }
      />
    </div>
  );
}
