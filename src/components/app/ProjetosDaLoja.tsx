'use client';

import { useRouter } from 'next/navigation';
import Tabela, { type Coluna } from '@/components/ui/Tabela';
import Paginacao from '@/components/ui/Paginacao';
import EstadoVazio from '@/components/ui/EstadoVazio';
import CartaoKPI from '@/components/ui/CartaoKPI';
import Selo from '@/components/ui/Selo';
import Botao from '@/components/ui/Botao';
import { useFiltrosNaURL } from '@/components/ui/useFiltrosNaURL';
import { COR } from '@/components/ui/tokens';
import BarraDeFiltrosProjetos, { type OpcoesFiltroProjeto } from '@/components/app/BarraDeFiltrosProjetos';
import {
  PROJETOS_POR_PAGINA,
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
 *
 * Densidade alinhada à lista de Pedidos: 6 KPIs em uma linha (versão compacta
 * do CartaoKPI), barra de filtros com 4 visíveis + drawer para os 6 extras,
 * tabela com a mesma altura de linha e tipografia.
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
    clientes: OpcoesFiltroProjeto[];
    produtos: OpcoesFiltroProjeto[];
    filiais: OpcoesFiltroProjeto[];
  };
  pagina: number;
  /** Falha na consulta — a tabela precisa dizer isso, não fingir lista vazia. */
  erro?: string | null;
}) {
  const router = useRouter();
  const f = useFiltrosNaURL();

  const num = (n: number) => n.toLocaleString('pt-BR');

  const colunas: Coluna<ProjetoDaLista>[] = [
    {
      chave: 'codigo',
      titulo: 'Codigo',
      largura: '100px',
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
      largura: 'minmax(180px, 1.4fr)',
      ordenavel: true,
      render: (p) => (
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontWeight: 600,
              color: COR.tinta,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {p.titulo}
          </div>
          <div style={{ fontSize: 11.5, color: COR.fraco, marginTop: 1 }}>
            {p.produto_nome ?? 'sem produto'}
            {p.produto_tamanho ? ` · ${p.produto_tamanho}` : ''}
          </div>
        </div>
      ),
    },
    {
      chave: 'cliente',
      titulo: 'Cliente',
      largura: 'minmax(150px, 1.1fr)',
      render: (p) => (
        <div style={{ minWidth: 0 }}>
          <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {p.clientes?.nome ?? 'sem cliente'}
          </div>
          {p.clientes?.email && (
            <div
              style={{
                fontSize: 11.5,
                color: COR.fraco,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {p.clientes.email}
            </div>
          )}
        </div>
      ),
    },
    {
      chave: 'paginas',
      titulo: 'Pags / lam / fotos',
      largura: '120px',
      alinha: 'right',
      ordenavel: true,
      render: (p) => (
        <span style={{ color: COR.apagado, fontVariantNumeric: 'tabular-nums' }}>
          {p.total_paginas ?? 0} · {laminas(p.total_paginas)} · {p.fotos_usadas ?? 0}
        </span>
      ),
    },
    {
      chave: 'editado',
      titulo: 'Editado',
      largura: '92px',
      ordenavel: true,
      render: (p) => <span style={{ color: COR.apagado }}>{dataCurta(p.atualizado_em)}</span>,
    },
    {
      chave: 'pedido',
      titulo: 'Pedido',
      largura: '100px',
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
          <span style={{ color: COR.fraco, fontSize: 11.5 }}>sem pedido</span>
        ),
    },
    {
      chave: 'status',
      titulo: 'Status',
      largura: '120px',
      ordenavel: true,
      render: (p) => {
        const t = termoProjeto(p.status);
        return <Selo tom={t.tom}>{t.rotulo}</Selo>;
      },
    },
    {
      chave: 'render',
      titulo: 'Render',
      largura: '116px',
      render: (p) => {
        if (!p.render) return <span style={{ color: COR.fraco, fontSize: 11.5 }}>nao iniciada</span>;
        const t = termoRender(p.render);
        return <Selo tom={t.tom}>{t.rotulo}</Selo>;
      },
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      {/* Cabecalho */}
      <div>
        <p
          style={{
            margin: '0 0 4px',
            fontSize: 11,
            letterSpacing: '1.4px',
            textTransform: 'uppercase',
            color: COR.fraco,
            fontWeight: 700,
          }}
        >
          Operacao
        </p>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>Projetos</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13.5, color: COR.apagado, maxWidth: '68ch' }}>
          Gerencie projetos criados pelos clientes e acompanhe edicao, arquivos e renderizacao.
        </p>
      </div>

      {/* 6 KPIs compactos em uma linha */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
          gap: 10,
        }}
      >
        <CartaoKPI
          rotulo="Abertos"
          valor={num(cards.abertos)}
          nota="rascunho ou em edicao"
          compacto
          href="/projetos?status=em_edicao"
        />
        <CartaoKPI
          rotulo="Aguardando"
          valor={num(cards.aguardandoFinalizacao)}
          nota="prontos ou com cliente"
          tom="ambar"
          compacto
          href="/projetos?status=pronto"
        />
        <CartaoKPI
          rotulo="Hoje"
          valor={num(cards.finalizadosHoje)}
          nota="fechados nas ultimas horas"
          tom="verde"
          compacto
        />
        <CartaoKPI
          rotulo="Com problemas"
          valor={num(cards.comProblema)}
          nota={cards.comProblema ? 'precisam de alguem' : 'nenhum'}
          tom={cards.comProblema ? 'coral' : 'neutro'}
          compacto
          href="/projetos?status=com_erro"
        />
        <CartaoKPI
          rotulo="Sem pedido"
          valor={num(cards.semPedido)}
          nota="ainda nao comprados"
          compacto
          href="/projetos?pedido=sem"
        />
        <CartaoKPI
          rotulo="Armazenamento"
          valor={tamanho(cards.bytes)}
          nota="arquivos dos projetos"
          compacto
        />
      </div>

      <BarraDeFiltrosProjetos
        clientes={opcoes.clientes}
        filiais={opcoes.filiais}
        totalFiltrado={total}
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
              descricao="Os filtros ativos nao deixaram nada. Limpe-os para ver a loja inteira."
              acao={
                <Botao variante="secundario" onClick={f.limpar}>
                  Limpar filtros
                </Botao>
              }
            />
          ) : temAlgum ? (
            <EstadoVazio titulo="Nenhum projeto ativo" descricao="Todos os projetos desta loja estao arquivados." />
          ) : (
            <EstadoVazio
              titulo="Nenhum projeto ainda"
              descricao="Assim que um cliente criar o primeiro album, ele aparece aqui — mesmo antes de virar pedido."
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
