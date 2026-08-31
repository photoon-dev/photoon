'use client';

import { COR, type Tom } from '@/components/ui/tokens';
import Selo from '@/components/ui/Selo';
import EstadoVazio from '@/components/ui/EstadoVazio';
import {
  ESTADOS_EXPEDICAO,
  dataCurta,
  dataHora,
  termo,
} from '@/lib/pedidos-termos';
import type { EnderecoEnvio, LinhaExpedicao, PedidoResumo } from '@/lib/pedidos';

const ENVIO_TOM: Record<string, Tom> = {
  aguardando: 'neutro',
  postado: 'azul',
  em_transito: 'ciano',
  entregue: 'verde',
  devolvido: 'coral',
};

const rotuloEndereco = (e: EnderecoEnvio | null) => {
  if (!e) return 'Sem endereço cadastrado';
  const partes = [
    e.rua,
    e.numero ? `nº ${e.numero}` : null,
    e.complemento,
    e.bairro,
    e.cidade,
    e.uf,
    e.cep,
  ].filter(Boolean);
  return partes.length ? partes.join(', ') : 'Endereço incompleto';
};

/**
 * Aba Entrega do detalhe do pedido.
 *
 * Mostra o estado do envio, transportadora, código de rastreio, datas e o
 * endereço que a etiqueta vai usar. Os dados vêm de `getPedido.expedicao` — a
 * Fase 10 vai ampliar com volumes, peso, dimensões, SLA e modalidade, sem
 * mexer aqui.
 */
export default function EntregaDoPedido({
  pedido,
  expedicao,
}: {
  pedido: PedidoResumo;
  expedicao: LinhaExpedicao[];
}) {
  const envio = expedicao[0] ?? null;

  if (!envio) {
    return (
      <EstadoVazio
        titulo="Pedido ainda não tem envio"
        descricao="A ficha de expedição é aberta quando o pedido passa para 'pronto' (ou manualmente)."
      />
    );
  }

  const tEnvio = termo(ESTADOS_EXPEDICAO, envio.estado);
  const end = envio.endereco as EnderecoEnvio | null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Cabeçalho */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: COR.tinta }}>
          Envio do pedido #{pedido.numero}
        </h2>
        <Selo tom={ENVIO_TOM[envio.estado] ?? 'neutro'}>{tEnvio.rotulo}</Selo>
        {envio.rastreio && (
          <span
            style={{
              fontSize: 12,
              fontFamily: 'monospace',
              color: COR.azul,
              fontWeight: 700,
            }}
          >
            {envio.rastreio}
          </span>
        )}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 12,
        }}
      >
        <Campo rotulo="Transportadora" valor={envio.transportadora ?? 'Não definida'} />
        <Campo rotulo="Postado em" valor={envio.postado_em ? dataHora(envio.postado_em) : '—'} />
        <Campo rotulo="Entregue em" valor={envio.entregue_em ? dataHora(envio.entregue_em) : '—'} />
        <Campo rotulo="Atualizado em" valor={dataHora(envio.atualizado_em)} />
        <Campo rotulo="Prazo do pedido" valor={pedido.prazo_em ? dataCurta(pedido.prazo_em) : '—'} />
      </div>

      {/* Endereço */}
      <div
        style={{
          background: COR.papel,
          border: `1px solid ${COR.linha}`,
          borderRadius: 20,
          padding: '18px 22px',
          boxShadow: '0 2px 8px rgba(11,18,32,.03)',
        }}
      >
        <p
          style={{
            margin: '0 0 4px',
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '1.1px',
            textTransform: 'uppercase',
            color: COR.fraco,
          }}
        >
          Endereço de entrega
        </p>
        <p style={{ margin: 0, fontSize: 14, color: COR.tinta, lineHeight: 1.55 }}>
          {rotuloEndereco(end)}
        </p>
        {end?.quem_recebe && (
          <p style={{ margin: '4px 0 0', fontSize: 12.5, color: COR.apagado }}>
            Receber: {end.quem_recebe}
          </p>
        )}
      </div>
    </div>
  );
}

function Campo({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div
      style={{
        background: COR.papel,
        border: `1px solid ${COR.linha}`,
        borderRadius: 16,
        padding: '12px 14px',
      }}
    >
      <p
        style={{
          margin: '0 0 3px',
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: '1.1px',
          textTransform: 'uppercase',
          color: COR.fraco,
        }}
      >
        {rotulo}
      </p>
      <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: COR.tinta }}>
        {valor}
      </p>
    </div>
  );
}
