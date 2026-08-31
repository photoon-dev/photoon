'use client';

/**
 * Botão "Renderizar tudo" + modal de simulação.
 *
 * Dois passos:
 *   1. `simularRenderizacaoDoPedido(pedidoId)` — só lê. Devolve elegíveis e
 *      bloqueados com o motivo de cada bloqueio.
 *   2. Se o usuário confirmar, `enfileirarProjetosDoPedido(pedidoId)` — só
 *      então cria `render_jobs` (e só para os elegíveis; a checagem é
 *      refeita no servidor, então dois cliques em sequência não duplicam).
 *
 * O botão só aparece quando o pedido tem projetos. A simulação roda no abrir
 * do modal — clicar "Cancelar" não deixa nada no banco.
 */

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { COR, type Tom } from '@/components/ui/tokens';
import Botao from '@/components/ui/Botao';
import Modal from '@/components/ui/Modal';
import Selo from '@/components/ui/Selo';
import {
  enfileirarProjetosDoPedido,
  simularRenderizacaoDoPedido,
  type MotivoBloqueio,
  type ResultadoEnfileiramento,
  type ResultadoSimulacao,
} from '@/app/app/actions-render-pedido';

const MOTIVO_TOM: Record<MotivoBloqueio, Tom> = {
  fora_da_loja: 'coral',
  sem_vinculo: 'coral',
  arquivado: 'neutro',
  estado_incompativel: 'ambar',
  pre_flight_erro: 'coral',
  job_ativo: 'azul',
};

type Estado =
  | { tipo: 'fechado' }
  | { tipo: 'simulando' }
  | { tipo: 'simulado'; resultado: ResultadoSimulacao }
  | { tipo: 'enfileirando'; resultado: ResultadoSimulacao }
  | { tipo: 'feito'; resultado: ResultadoEnfileiramento };

export default function RenderizarTudoBotao({ pedidoId }: { pedidoId: string }) {
  const [estado, setEstado] = useState<Estado>({ tipo: 'fechado' });
  const [pendente, iniciar] = useTransition();
  const router = useRouter();

  const abrir = () => {
    setEstado({ tipo: 'simulando' });
    iniciar(async () => {
      const r = await simularRenderizacaoDoPedido(pedidoId);
      setEstado({ tipo: 'simulado', resultado: r });
    });
  };

  const fechar = () => {
    if (estado.tipo === 'enfileirando') return;
    setEstado({ tipo: 'fechado' });
  };

  const confirmar = () => {
    if (estado.tipo !== 'simulado') return;
    const sim = estado.resultado;
    setEstado({ tipo: 'enfileirando', resultado: sim });
    iniciar(async () => {
      const r = await enfileirarProjetosDoPedido(pedidoId);
      setEstado({ tipo: 'feito', resultado: r });
      router.refresh();
    });
  };

  const simulacao = estado.tipo === 'simulado' || estado.tipo === 'enfileirando' ? estado.resultado : null;
  const enfileiramento = estado.tipo === 'feito' ? estado.resultado : null;
  const aberto = estado.tipo !== 'fechado';

  return (
    <>
      <Botao
        variante="primario"
        onClick={abrir}
        disabled={pendente}
      >
        Renderizar tudo
      </Botao>

      <Modal
        aberto={aberto}
        aoFechar={fechar}
        titulo="Renderizar projetos do pedido"
        descricao="Cada projeto passa por cinco checagens antes de entrar na fila. Bloqueios aparecem com o motivo — não há reprocessamento silencioso."
        largura={680}
        rodape={
          <>
            <Botao variante="secundario" onClick={fechar} disabled={estado.tipo === 'enfileirando'}>
              {enfileiramento ? 'Fechar' : 'Cancelar'}
            </Botao>
            {simulacao && !enfileiramento && (
              <Botao
                variante="primario"
                onClick={confirmar}
                ocupado={estado.tipo === 'enfileirando'}
                disabled={simulacao.elegiveis.length === 0}
              >
                {estado.tipo === 'enfileirando'
                  ? 'Enfileirando…'
                  : `Enfileirar ${simulacao.elegiveis.length} projeto(s)`}
              </Botao>
            )}
          </>
        }
      >
        {estado.tipo === 'simulando' && <p style={{ color: COR.apagado, fontSize: 13.5 }}>Simulando…</p>}

        {simulacao && (
          <Simulacao
            sim={simulacao}
            executando={estado.tipo === 'enfileirando'}
          />
        )}

        {enfileiramento && <Resultado r={enfileiramento} />}
      </Modal>
    </>
  );
}

function Simulacao({
  sim,
  executando,
}: {
  sim: ResultadoSimulacao;
  executando: boolean;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <p style={{ margin: 0, fontSize: 13.5, color: COR.texto }}>{sim.resumo}</p>

      {sim.elegiveis.length > 0 && (
        <Secao titulo="Prontos para renderizar" tom="verde" quantidade={sim.elegiveis.length}>
          {sim.elegiveis.map((p) => (
            <Linha key={p.projeto_id} codigo={p.codigo} titulo={p.titulo} status={p.status} />
          ))}
        </Secao>
      )}

      {sim.bloqueados.length > 0 && (
        <Secao titulo="Bloqueados" tom="coral" quantidade={sim.bloqueados.length}>
          {sim.bloqueados.map((p) => (
            <div key={p.projeto_id} style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '8px 0' }}>
              <Linha codigo={p.codigo} titulo={p.titulo} status={p.status} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 12 }}>
                <Selo tom={MOTIVO_TOM[p.motivo]}>{p.motivo.replace(/_/g, ' ')}</Selo>
                <span style={{ fontSize: 12.5, color: COR.apagado }}>{p.descricao}</span>
              </div>
            </div>
          ))}
        </Secao>
      )}

      {executando && (
        <p style={{ margin: 0, fontSize: 12.5, color: COR.apagado }}>
          Reavaliando elegibilidade antes de criar cada job — cliques repetidos não duplicam.
        </p>
      )}
    </div>
  );
}

function Resultado({ r }: { r: ResultadoEnfileiramento }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Secao titulo="Jobs criados" tom="verde" quantidade={r.criados.length}>
        {r.criados.length === 0 && <p style={{ margin: 0, fontSize: 13, color: COR.apagado }}>Nenhum job novo.</p>}
        {r.criados.map((c) => (
          <Linha key={c.job_id} codigo={c.codigo} titulo={c.titulo} status={`job ${c.job_id.slice(0, 8)}`} />
        ))}
      </Secao>
      {r.pulados.length > 0 && (
        <Secao titulo="Pulados nesta rodada" tom="ambar" quantidade={r.pulados.length}>
          {r.pulados.map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
              <Selo tom={MOTIVO_TOM[p.motivo]}>{p.motivo.replace(/_/g, ' ')}</Selo>
              <span style={{ fontSize: 12.5, color: COR.apagado }}>{p.descricao}</span>
            </div>
          ))}
        </Secao>
      )}
    </div>
  );
}

function Secao({
  titulo,
  tom,
  quantidade,
  children,
}: {
  titulo: string;
  tom: Tom;
  quantidade: number;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <Selo tom={tom}>{titulo}</Selo>
        <span style={{ fontSize: 12, color: COR.apagado }}>{quantidade}</span>
      </div>
      <div style={{ borderTop: `1px solid ${COR.linhaClara}`, paddingTop: 4 }}>{children}</div>
    </div>
  );
}

function Linha({
  codigo,
  titulo,
  status,
}: {
  codigo: string | null;
  titulo: string;
  status: string;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: 12,
        alignItems: 'center',
        padding: '6px 0',
        fontSize: 13.5,
      }}
    >
      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: COR.tinta }}>{codigo ?? '—'}</span>
      <span style={{ color: COR.texto }}>{titulo}</span>
      <span style={{ fontSize: 12, color: COR.apagado }}>{status}</span>
    </div>
  );
}
