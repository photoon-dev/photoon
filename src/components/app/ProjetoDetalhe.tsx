'use client';

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Abas from '@/components/ui/Abas';
import Ficha, { Campo } from '@/components/ui/Ficha';
import Tabela, { type Coluna } from '@/components/ui/Tabela';
import EstadoVazio from '@/components/ui/EstadoVazio';
import Selo from '@/components/ui/Selo';
import Botao from '@/components/ui/Botao';
import Confirmacao from '@/components/ui/Confirmacao';
import { COR } from '@/components/ui/tokens';
import { enfileirarProjeto } from '@/app/app/actions-render';
import {
  dataHora,
  laminas,
  tamanho,
  termoProjeto,
  termoRender,
} from '@/lib/projetos-termos';
import type {
  ArquivoDoProjeto,
  EventoDoProjeto,
  JobDoProjeto,
  ProjetoCompleto,
  ValidacaoDoProjeto,
  VersaoDoProjeto,
} from '@/lib/projetos';

/**
 * Detalhe administrativo do projeto — as seis abas do briefing.
 *
 * As abas leem tabelas diferentes porque são entidades diferentes: arquivo,
 * versão, validação e job de renderização não são campos do projeto. A aba
 * ativa vive na URL, então o link de "a aba de arquivos deste projeto" abre
 * onde deveria.
 *
 * Cada aba sem dado explica o que falta em vez de mostrar uma tabela vazia —
 * as tabelas do banco existem desde a 0015 e vão nascer preenchidas conforme
 * o editor e o renderizador começarem a escrever nelas.
 */

const SEVERIDADE: Record<string, { rotulo: string; tom: 'coral' | 'ambar' | 'azul' }> = {
  erro: { rotulo: 'Erro crítico', tom: 'coral' },
  aviso: { rotulo: 'Aviso', tom: 'ambar' },
  informacao: { rotulo: 'Informação', tom: 'azul' },
};

const REGRA: Record<string, string> = {
  dpi: 'DPI insuficiente',
  imagem_corrompida: 'Imagem corrompida',
  imagem_ausente: 'Imagem ausente',
  sangria: 'Sangria',
  area_segura: 'Área segura',
  rosto_no_corte: 'Rosto próximo ao corte',
  texto_fora: 'Texto fora da área segura',
  fonte_ausente: 'Fonte ausente',
  arquivo_incompativel: 'Arquivo incompatível',
  pagina_vazia: 'Página vazia',
};

const TIPO_ARQUIVO: Record<string, string> = {
  original: 'Originais',
  renderizado: 'Renderizados',
  preview: 'Previews',
  auxiliar: 'Auxiliares',
};

export default function ProjetoDetalhe({ dados }: { dados: ProjetoCompleto }) {
  const router = useRouter();
  const busca = useSearchParams();
  const [ocupado, iniciar] = useTransition();
  const [confirmando, setConfirmando] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const { projeto: p, pedido, arquivos, versoes, validacoes, eventos, jobs } = dados;

  const aba = busca.get('aba') ?? 'resumo';
  const trocarAba = (chave: string) => {
    const q = new URLSearchParams(busca.toString());
    if (chave === 'resumo') q.delete('aba');
    else q.set('aba', chave);
    const s = q.toString();
    router.push(s ? `?${s}` : '?');
  };

  const status = termoProjeto(p.status);
  const ultimoJob = jobs[0] ?? null;
  const erros = validacoes.filter((v) => v.severidade === 'erro').length;

  return (
    <div style={{ padding: '26px 30px 60px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* ------------------------------ cabeçalho ------------------------------ */}
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ minWidth: 0, flex: '1 1 340px' }}>
          <a href="/projetos" style={{ fontSize: 12.5, color: COR.apagado }}>
            ← Projetos
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', margin: '8px 0 6px' }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                fontVariantNumeric: 'tabular-nums',
                padding: '4px 10px',
                borderRadius: 8,
                background: COR.papelSuave,
                border: `1px solid ${COR.linha}`,
                color: COR.apagado,
              }}
            >
              {p.codigo ?? 'sem código'}
            </span>
            <Selo tom={status.tom}>{status.rotulo}</Selo>
            {ultimoJob && (
              <Selo tom={termoRender(ultimoJob.estado).tom}>
                Render: {termoRender(ultimoJob.estado).rotulo}
              </Selo>
            )}
            {p.arquivado_em && <Selo tom="neutro">Arquivado</Selo>}
          </div>
          <h1 style={{ margin: 0, fontSize: 27, fontWeight: 800, letterSpacing: '-0.5px' }}>
            {p.titulo}
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: COR.apagado }}>
            {p.clientes?.nome ?? 'sem cliente'}
            {p.produto_nome ? ` · ${p.produto_nome}` : ''}
            {pedido ? ' · ' : ''}
            {pedido && (
              <a href={`/pedidos/${pedido.id}`} style={{ fontWeight: 600 }}>
                Pedido {pedido.codigo ?? `#${pedido.numero}`}
              </a>
            )}
            {!pedido && ' · sem pedido'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Botao
            variante="primario"
            ocupado={ocupado}
            onClick={() => setConfirmando(true)}
          >
            {jobs.length ? 'Renderizar novamente' : 'Renderizar'}
          </Botao>
          <Botao variante="secundario" onClick={() => router.push(`/projetos/${p.id}/resumo`)}>
            Resumo
          </Botao>
          {pedido && (
            <Botao variante="secundario" onClick={() => router.push(`/pedidos/${pedido.id}`)}>
              Ver pedido
            </Botao>
          )}
        </div>
      </div>

      <Abas
        ativa={aba}
        aoTrocar={trocarAba}
        abas={[
          { chave: 'resumo', rotulo: 'Resumo' },
          { chave: 'capa', rotulo: 'Capa' },
          { chave: 'arquivos', rotulo: 'Arquivos', contagem: arquivos.length },
          { chave: 'validacao', rotulo: 'Validação', contagem: validacoes.length, alerta: erros > 0 },
          { chave: 'historico', rotulo: 'Histórico', contagem: eventos.length },
          { chave: 'versoes', rotulo: 'Versões', contagem: versoes.length },
        ]}
      />

      {aviso && (
        <p style={{ margin: 0, fontSize: 13.5, color: COR.ambar }}>{aviso}</p>
      )}

      <Confirmacao
        aberto={confirmando}
        aoFechar={() => setConfirmando(false)}
        titulo={jobs.length ? 'Renderizar este projeto de novo?' : 'Renderizar este projeto?'}
        descricao={
          'O projeto entra na fila e o worker gera capa, miolo, preview e o ZIP. ' +
          'Nada roda agora nesta tela — a renderização acontece fora, e você acompanha na Central.'
        }
        rotuloConfirmar="Colocar na fila"
        aoConfirmar={() =>
          iniciar(async () => {
            const r = await enfileirarProjeto(p.id, pedido?.id ?? null);
            if (!r.ok) setAviso(r.erro ?? 'Não foi possível enfileirar.');
            else router.push('/renderizacao');
          })
        }
      />

      {aba === 'resumo' && <AbaResumo dados={dados} />}
      {aba === 'capa' && <AbaCapa dados={dados} />}
      {aba === 'arquivos' && <AbaArquivos arquivos={arquivos} />}
      {aba === 'validacao' && <AbaValidacao validacoes={validacoes} />}
      {aba === 'historico' && <AbaHistorico eventos={eventos} jobs={jobs} />}
      {aba === 'versoes' && <AbaVersoes versoes={versoes} />}
    </div>
  );
}

// ---------------------------------------------------------------------------

function AbaResumo({ dados }: { dados: ProjetoCompleto }) {
  const { projeto: p, pedido } = dados;
  const naoUsadas = Math.max(0, (p.fotos_enviadas ?? 0) - (p.fotos_usadas ?? 0));

  // Layout 2 colunas no desktop: identificacao+datas a esquerda, produto+conteudo a
  // direita, capa+pedido embaixo em linha propria. Densidade alinhada a Pedidos.
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
        gap: 14,
        alignItems: 'start',
      }}
    >
      {/* Coluna esquerda */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Bloco titulo="Identificacao">
          <Linha rotulo="Codigo" valor={p.codigo} mono />
          <Linha rotulo="Nome" valor={p.titulo} />
          <Linha rotulo="Cliente" valor={p.clientes?.nome} />
          <Linha rotulo="E-mail" valor={p.clientes?.email} />
          <Linha rotulo="Filial" valor={p.filiais?.nome} />
          <Linha rotulo="Galeria" valor={p.galerias?.nome} />
        </Bloco>

        <Bloco titulo="Datas">
          <Linha rotulo="Criado em" valor={dataHora(p.criado_em)} />
          <Linha rotulo="Ultima alteracao" valor={dataHora(p.atualizado_em)} />
          <Linha rotulo="Finalizado em" valor={p.finalizado_em ? dataHora(p.finalizado_em) : '—'} />
          <Linha rotulo="Fechado em" valor={p.fechado_em ? dataHora(p.fechado_em) : '—'} />
        </Bloco>
      </div>

      {/* Coluna direita */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Bloco titulo="Produto e formato">
          <Linha rotulo="Produto" valor={p.produto_nome} />
          <Linha rotulo="Tamanho" valor={p.produto_tamanho} />
          <Linha rotulo="Formato aberto" valor={p.formato_aberto} />
          <Linha rotulo="Formato fechado" valor={p.formato_fechado} />
          <Linha
            rotulo="Dimensao"
            valor={p.largura_mm && p.altura_mm ? `${p.largura_mm} x ${p.altura_mm} mm` : null}
          />
          <Linha rotulo="Dorso" valor={p.dorso_mm ? `${p.dorso_mm} mm` : null} />
        </Bloco>

        <Bloco titulo="Conteudo">
          <Linha rotulo="Paginas" valor={String(p.total_paginas ?? 0)} />
          <Linha rotulo="Laminas" valor={laminas(p.total_paginas)} />
          <Linha rotulo="Fotos enviadas" valor={String(p.fotos_enviadas ?? 0)} />
          <Linha rotulo="Fotos utilizadas" valor={String(p.fotos_usadas ?? 0)} />
          <Linha rotulo="Nao utilizadas" valor={String(naoUsadas)} />
          <Linha rotulo="Tamanho total" valor={tamanho(p.bytes_total)} />
        </Bloco>
      </div>

      {/* Linha inferior ocupando as duas colunas */}
      <Bloco titulo="Capa e pedido" colSpan>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            gap: 0,
          }}
        >
          <Linha rotulo="Possui capa" valor={p.capa_url ? 'sim' : 'nao'} />
          <Linha rotulo="Tipo de capa" valor={p.capa_tipo} />
          <Linha rotulo="Dorso" valor={p.dorso_mm ? `${p.dorso_mm} mm` : null} />
          <Linha
            rotulo="Pedido"
            valor={
              pedido ? (
                <a href={`/pedidos/${pedido.id}`}>{pedido.codigo ?? `#${pedido.numero}`}</a>
              ) : (
                'sem pedido'
              )
            }
          />
        </div>
      </Bloco>
    </div>
  );
}

/* Bloco denso: rotulo na esquerda, valor na direita, divisor 1px entre linhas.
 * ColSpan = true faz o bloco ocupar as 2 colunas do grid do Resumo. */
function Bloco({
  titulo,
  children,
  colSpan,
}: {
  titulo: string;
  children: React.ReactNode;
  colSpan?: boolean;
}) {
  return (
    <section
      style={{
        background: COR.papel,
        border: `1px solid ${COR.linha}`,
        borderRadius: 14,
        boxShadow: '0 2px 8px rgba(11,18,32,.03)',
        overflow: 'hidden',
        gridColumn: colSpan ? '1 / -1' : undefined,
      }}
    >
      <header
        style={{
          padding: '10px 16px',
          borderBottom: `1px solid ${COR.linhaClara}`,
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: '1.2px',
          textTransform: 'uppercase',
          color: COR.fraco,
        }}
      >
        {titulo}
      </header>
      <div>{children}</div>
    </section>
  );
}

function Linha({
  rotulo,
  valor,
  mono,
}: {
  rotulo: string;
  valor: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.4fr',
        gap: 12,
        padding: '9px 16px',
        borderBottom: `1px solid ${COR.linhaClara}`,
        fontSize: 13,
      }}
    >
      <span style={{ color: COR.apagado, fontSize: 11.5, fontWeight: 600 }}>{rotulo}</span>
      <span
        style={{
          color: COR.tinta,
          fontFamily: mono ? 'monospace' : undefined,
          fontVariantNumeric: mono ? 'tabular-nums' : undefined,
          fontWeight: mono ? 700 : 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {valor ?? '—'}
      </span>
    </div>
  );
}

function AbaCapa({ dados }: { dados: ProjetoCompleto }) {
  const { projeto: p, arquivos } = dados;
  const daCapa = arquivos.filter((a) => /capa/i.test(a.nome));

  if (!p.capa_url && daCapa.length === 0) {
    return (
      <EstadoVazio
        titulo="Este projeto está sem uma capa ativa"
        descricao="Nenhuma capa foi escolhida nem gerada. A capa nasce quando o cliente escolhe um modelo no editor ou quando a renderização a produz."
      />
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Ficha titulo="Capa">
        <Campo rotulo="Status">{p.capa_url ? 'ativa' : 'sem preview'}</Campo>
        <Campo rotulo="Tipo">{p.capa_tipo}</Campo>
        <Campo rotulo="Dorso">{p.dorso_mm ? `${p.dorso_mm} mm` : null}</Campo>
        <Campo rotulo="Dimensão">
          {p.largura_mm && p.altura_mm ? `${p.largura_mm} × ${p.altura_mm} mm` : null}
        </Campo>
      </Ficha>

      {p.capa_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={p.capa_url}
          alt={`Capa de ${p.titulo}`}
          style={{
            maxWidth: 420,
            borderRadius: 16,
            border: `1px solid ${COR.linha}`,
            background: COR.papelSuave,
          }}
        />
      )}

      {daCapa.length > 0 && <AbaArquivos arquivos={daCapa} />}
    </div>
  );
}

function AbaArquivos({ arquivos }: { arquivos: ArquivoDoProjeto[] }) {
  const colunas: Coluna<ArquivoDoProjeto>[] = [
    { chave: 'nome', titulo: 'Nome', largura: 'minmax(180px, 2fr)', render: (a) => a.nome },
    { chave: 'tipo', titulo: 'Tipo', largura: '120px', render: (a) => TIPO_ARQUIVO[a.tipo] ?? a.tipo },
    { chave: 'bytes', titulo: 'Tamanho', largura: '96px', alinha: 'right', render: (a) => tamanho(a.bytes) },
    { chave: 'versao', titulo: 'Versão', largura: '72px', alinha: 'right', render: (a) => a.versao },
    { chave: 'criado', titulo: 'Data', largura: '148px', render: (a) => dataHora(a.criado_em) },
    {
      chave: 'checksum',
      titulo: 'Checksum',
      largura: '120px',
      render: (a) => (
        <span style={{ fontSize: 12, color: COR.fraco }} title={a.checksum ?? ''}>
          {a.checksum ? `${a.checksum.slice(0, 10)}…` : '—'}
        </span>
      ),
    },
    {
      chave: 'estado',
      titulo: 'Status',
      largura: '110px',
      render: (a) => (
        <Selo tom={a.estado === 'erro' ? 'coral' : a.estado === 'pendente' ? 'ambar' : 'verde'}>
          {a.estado}
        </Selo>
      ),
    },
  ];

  return (
    <Tabela
      colunas={colunas}
      linhas={arquivos}
      chaveDe={(a) => a.id}
      vazio={
        <EstadoVazio
          titulo="Nenhum arquivo ainda"
          descricao="Os arquivos aparecem aqui conforme o cliente envia as fotos e a renderização gera o PDF, o preview e o ZIP."
        />
      }
    />
  );
}

function AbaValidacao({ validacoes }: { validacoes: ValidacaoDoProjeto[] }) {
  const colunas: Coluna<ValidacaoDoProjeto>[] = [
    {
      chave: 'severidade',
      titulo: 'Severidade',
      largura: '128px',
      render: (v) => {
        const s = SEVERIDADE[v.severidade] ?? SEVERIDADE.aviso;
        return <Selo tom={s.tom}>{s.rotulo}</Selo>;
      },
    },
    { chave: 'regra', titulo: 'Problema', largura: '190px', render: (v) => REGRA[v.regra] ?? v.regra },
    { chave: 'pagina', titulo: 'Página', largura: '76px', alinha: 'right', render: (v) => v.pagina ?? '—' },
    { chave: 'elemento', titulo: 'Elemento', largura: '120px', render: (v) => v.elemento ?? '—' },
    { chave: 'descricao', titulo: 'Descrição', largura: 'minmax(200px, 2fr)', render: (v) => v.descricao },
    {
      chave: 'recomendacao',
      titulo: 'Ação recomendada',
      largura: 'minmax(160px, 1.4fr)',
      render: (v) => <span style={{ color: COR.apagado }}>{v.recomendacao ?? '—'}</span>,
    },
  ];

  return (
    <Tabela
      colunas={colunas}
      linhas={validacoes}
      chaveDe={(v) => v.id}
      vazio={
        <EstadoVazio
          titulo="Nenhum problema encontrado"
          descricao="O pré-flight roda antes da renderização e registra aqui o que precisa de atenção — DPI, sangria, área segura, fonte ausente."
        />
      }
    />
  );
}

function AbaHistorico({ eventos, jobs }: { eventos: EventoDoProjeto[]; jobs: JobDoProjeto[] }) {
  /* O histórico junta duas origens: o que o editor registra em `projeto_eventos`
   * e o que a renderização registra em `render_jobs`. São entidades separadas
   * no banco, e para quem lê a timeline é uma linha do tempo só. */
  const linhas = [
    ...eventos.map((e) => ({
      id: e.id,
      quando: e.criado_em,
      evento: e.descricao,
      autor: e.autor ?? 'cliente',
    })),
    ...jobs.map((j) => ({
      id: `job-${j.id}`,
      quando: j.criado_em,
      evento: `Renderização ${termoRender(j.estado).rotulo.toLowerCase()}${
        j.tentativa > 1 ? ` (tentativa ${j.tentativa})` : ''
      }`,
      autor: 'renderizador',
    })),
  ].sort((a, b) => (a.quando < b.quando ? 1 : -1));

  if (!linhas.length) {
    return (
      <EstadoVazio
        titulo="Nenhum evento registrado"
        descricao="O histórico guarda cada envio de foto, cada salvamento e cada renderização deste projeto."
      />
    );
  }

  return (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
      {linhas.map((l, i) => (
        <li key={l.id} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', alignSelf: 'stretch' }}>
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: 999,
                background: i === 0 ? COR.azul : COR.linhaClara,
                border: `2px solid ${i === 0 ? COR.azul : COR.linha}`,
                marginTop: 15,
                flex: '0 0 auto',
              }}
            />
            {i < linhas.length - 1 && <span style={{ flex: 1, width: 2, background: COR.linhaClara }} />}
          </div>
          <div style={{ padding: '12px 0', minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: COR.tinta }}>{l.evento}</div>
            <div style={{ fontSize: 12.5, color: COR.fraco }}>
              {dataHora(l.quando)} · {l.autor}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

function AbaVersoes({ versoes }: { versoes: VersaoDoProjeto[] }) {
  const colunas: Coluna<VersaoDoProjeto>[] = [
    { chave: 'versao', titulo: 'Versão', largura: '84px', alinha: 'right', render: (v) => `v${v.versao}` },
    { chave: 'criado', titulo: 'Criada em', largura: '160px', render: (v) => dataHora(v.criado_em) },
    { chave: 'motivo', titulo: 'Motivo', largura: 'minmax(180px, 2fr)', render: (v) => v.motivo ?? '—' },
    { chave: 'bytes', titulo: 'Tamanho', largura: '104px', alinha: 'right', render: (v) => tamanho(v.bytes) },
  ];

  return (
    <Tabela
      colunas={colunas}
      linhas={versoes}
      chaveDe={(v) => v.id}
      vazio={
        <EstadoVazio
          titulo="Nenhuma versão guardada"
          descricao="Uma versão é gravada quando o projeto é fechado ou reaberto — é o que permite voltar atrás sem depender de arquivo externo."
        />
      }
    />
  );
}
