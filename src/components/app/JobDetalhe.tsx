'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Ficha, { Campo } from '@/components/ui/Ficha';
import Tabela, { type Coluna } from '@/components/ui/Tabela';
import EstadoVazio from '@/components/ui/EstadoVazio';
import Selo from '@/components/ui/Selo';
import Botao from '@/components/ui/Botao';
import { COR } from '@/components/ui/tokens';
import { reprocessar } from '@/app/app/actions-render';
import { ETAPAS_JOB, duracao, rotuloEtapa, termoJob } from '@/lib/render-termos';
import { dataHora, tamanho } from '@/lib/projetos-termos';
import type { JobCompleto, LinhaDeLog } from '@/lib/render';

/**
 * Detalhe de um job de renderização.
 *
 * O que esta tela precisa responder quando a fila trava: em que etapa parou,
 * há quanto tempo, o que o worker disse e qual arquivo saiu. Por isso a régua
 * das sete etapas vem antes de tudo — é a resposta à primeira pergunta.
 *
 * A stack técnica fica atrás de um `<details>` fechado: quem opera a produção
 * não precisa dela na cara, e quem precisa sabe onde procurar.
 */
export default function JobDetalhe({ dados }: { dados: JobCompleto }) {
  const router = useRouter();
  const [ocupado, iniciar] = useTransition();
  const { job, logs, arquivos } = dados;

  const t = termoJob(job.estado);
  const etapaAtual = ETAPAS_JOB.findIndex((e) => e.id === job.etapa);
  const falhou = job.estado === 'erro';

  const colunasArquivo: Coluna<JobCompleto['arquivos'][number]>[] = [
    { chave: 'nome', titulo: 'Nome', largura: 'minmax(160px, 2fr)', render: (a) => a.nome },
    { chave: 'tipo', titulo: 'Tipo', largura: '112px', render: (a) => a.tipo },
    { chave: 'bytes', titulo: 'Tamanho', largura: '100px', alinha: 'right', render: (a) => tamanho(a.bytes) },
    {
      chave: 'checksum',
      titulo: 'Checksum',
      largura: '128px',
      render: (a) => (
        <span style={{ fontSize: 12, color: COR.fraco }} title={a.checksum ?? ''}>
          {a.checksum ? `${a.checksum.slice(0, 12)}…` : '—'}
        </span>
      ),
    },
    { chave: 'destino', titulo: 'Destino', largura: '120px', render: (a) => a.bucket },
    {
      chave: 'estado',
      titulo: 'Status',
      largura: '104px',
      render: (a) => (
        <Selo tom={a.estado === 'erro' ? 'coral' : a.estado === 'pendente' ? 'ambar' : 'verde'}>
          {a.estado}
        </Selo>
      ),
    },
  ];

  return (
    <div style={{ padding: '26px 30px 60px', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ minWidth: 0, flex: '1 1 340px' }}>
          <a href="/renderizacao" style={{ fontSize: 12.5, color: COR.apagado }}>
            ← Central de Renderização
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', margin: '8px 0 6px' }}>
            <Selo tom={t.tom}>{t.rotulo}</Selo>
            {job.tentativa > 1 && <Selo tom="ambar">{job.tentativa}ª tentativa</Selo>}
          </div>
          <h1 style={{ margin: 0, fontSize: 25, fontWeight: 800, letterSpacing: '-0.5px' }}>
            {job.projetos?.codigo ?? 'projeto removido'} · {job.projetos?.titulo ?? ''}
          </h1>
          <p style={{ margin: '6px 0 0', fontSize: 14, color: COR.apagado }}>
            {job.projetos?.clientes?.nome ?? 'sem cliente'}
            {job.pedidos && (
              <>
                {' · '}
                <a href={`/pedidos/${job.pedidos.id}`} style={{ fontWeight: 600 }}>
                  Pedido {job.pedidos.codigo ?? `#${job.pedidos.numero}`}
                </a>
              </>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {job.projetos && (
            <Botao variante="secundario" onClick={() => router.push(`/projetos/${job.projetos!.id}`)}>
              Abrir projeto
            </Botao>
          )}
          {falhou && (
            <Botao
              variante="primario"
              ocupado={ocupado}
              onClick={() => iniciar(async () => {
                const r = await reprocessar(job.id);
                if (r.ok && 'id' in r) router.push(`/renderizacao/${r.id}`);
                else router.refresh();
              })}
            >
              Reprocessar
            </Botao>
          )}
        </div>
      </div>

      {/* ------------------------- régua das sete etapas ------------------------ */}
      <section
        style={{
          background: COR.papel,
          border: `1px solid ${COR.linha}`,
          borderRadius: 20,
          padding: '20px 22px',
          boxShadow: '0 2px 8px rgba(11,18,32,.03)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700 }}>Andamento</h2>
          <span style={{ fontSize: 13, color: COR.apagado }}>{job.progresso}%</span>
        </div>
        <div style={{ height: 8, borderRadius: 999, background: COR.linha, overflow: 'hidden', marginBottom: 18 }}>
          <div
            style={{
              width: `${job.progresso}%`,
              height: '100%',
              borderRadius: 999,
              background: falhou ? COR.coral : COR.gradiente,
            }}
          />
        </div>
        <ol style={{ display: 'flex', flexWrap: 'wrap', gap: 10, listStyle: 'none', margin: 0, padding: 0 }}>
          {ETAPAS_JOB.map((e, i) => {
            const passou = etapaAtual > i;
            const agora = etapaAtual === i;
            return (
              <li
                key={e.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 7,
                  padding: '7px 13px',
                  borderRadius: 999,
                  fontSize: 12.5,
                  fontWeight: agora ? 700 : 500,
                  background: agora ? (falhou ? '#FFF1F3' : '#EAF0FF') : passou ? '#E6F8F1' : COR.papelSuave,
                  color: agora ? (falhou ? COR.coral : COR.azul) : passou ? COR.verde : COR.fraco,
                  border: `1px solid ${agora ? (falhou ? '#FBD5DC' : '#D6E2FC') : COR.linha}`,
                }}
              >
                {passou ? '✓' : `${i + 1}`} {e.rotulo}
              </li>
            );
          })}
        </ol>
      </section>

      <Ficha titulo="O job">
        <Campo rotulo="ID">{job.id.slice(0, 8)}…</Campo>
        <Campo rotulo="Worker">{job.render_workers?.nome}</Campo>
        <Campo rotulo="Etapa atual">{rotuloEtapa(job.etapa)}</Campo>
        <Campo rotulo="Tentativa">{job.tentativa}</Campo>
        <Campo rotulo="Criado em">{dataHora(job.criado_em)}</Campo>
        <Campo rotulo="Iniciado em">{job.iniciado_em ? dataHora(job.iniciado_em) : null}</Campo>
        <Campo rotulo="Finalizado em">{job.concluido_em ? dataHora(job.concluido_em) : null}</Campo>
        <Campo rotulo="Duração">{duracao(job.iniciado_em, job.concluido_em)}</Campo>
        <Campo rotulo="Destino">{job.destino}</Campo>
      </Ficha>

      {falhou && (
        <section
          style={{
            background: '#FFF1F3',
            border: '1px solid #FBD5DC',
            borderRadius: 20,
            padding: '18px 22px',
          }}
        >
          <h2 style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 700, color: COR.coral }}>
            A renderização falhou
          </h2>
          <p style={{ margin: '0 0 6px', fontSize: 14, color: COR.tinta2 }}>
            <b>{job.erro_codigo ?? 'erro'}</b> · na etapa {rotuloEtapa(job.etapa)}
          </p>
          <p style={{ margin: 0, fontSize: 14, color: COR.tinta2 }}>
            {job.erro_mensagem ?? 'Sem mensagem registrada.'}
          </p>
          {job.erro_stack && (
            <details style={{ marginTop: 12 }}>
              <summary style={{ cursor: 'pointer', fontSize: 13, color: COR.apagado }}>
                Detalhe técnico
              </summary>
              <pre
                style={{
                  margin: '10px 0 0',
                  padding: 12,
                  borderRadius: 12,
                  background: COR.papel,
                  border: `1px solid ${COR.linha}`,
                  fontSize: 12,
                  overflowX: 'auto',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {job.erro_stack}
              </pre>
            </details>
          )}
        </section>
      )}

      <div>
        <h2 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700 }}>Arquivos gerados</h2>
        <Tabela
          colunas={colunasArquivo}
          linhas={arquivos}
          chaveDe={(a) => a.id}
          vazio={
            <EstadoVazio
              titulo="Nenhum arquivo ainda"
              descricao="Os arquivos aparecem quando o job chega na etapa de upload — capa, miolo, preview e o ZIP."
            />
          }
        />
      </div>

      <div>
        <h2 style={{ margin: '0 0 12px', fontSize: 16, fontWeight: 700 }}>Log técnico</h2>
        <Log linhas={logs} />
      </div>
    </div>
  );
}

function Log({ linhas }: { linhas: LinhaDeLog[] }) {
  if (!linhas.length) {
    return (
      <EstadoVazio
        titulo="Sem log"
        descricao="Cada etapa do worker escreve aqui. Um job que nunca saiu da fila ainda não tem o que registrar."
      />
    );
  }

  const cor = (s: string) => (s === 'erro' ? COR.coral : s === 'aviso' ? COR.ambar : COR.apagado);

  return (
    <div
      style={{
        background: COR.papel,
        border: `1px solid ${COR.linha}`,
        borderRadius: 20,
        padding: '8px 0',
        boxShadow: '0 2px 8px rgba(11,18,32,.03)',
        maxHeight: 380,
        overflowY: 'auto',
      }}
    >
      {linhas.map((l) => (
        <div
          key={l.id}
          style={{
            display: 'grid',
            gridTemplateColumns: '150px 118px 1fr',
            gap: 12,
            padding: '7px 22px',
            fontSize: 12.5,
            alignItems: 'baseline',
          }}
        >
          <span style={{ color: COR.fraco, fontVariantNumeric: 'tabular-nums' }}>
            {dataHora(l.criado_em)}
          </span>
          <span style={{ color: COR.fraco }}>{rotuloEtapa(l.etapa)}</span>
          <span style={{ color: cor(l.severidade), overflowWrap: 'anywhere' }}>{l.mensagem}</span>
        </div>
      ))}
    </div>
  );
}
