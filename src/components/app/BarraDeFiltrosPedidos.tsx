'use client';

/**
 * Barra de filtros da lista de Pedidos.
 *
 * 15 filtros no total, todos persistidos na URL (regra do briefing):
 *   1. busca universal (numero/codigo/cliente/projeto/produto)
 *   2. numero
 *   3. codigo PT
 *   4. cliente
 *   5. projeto
 *   6. produto
 *   7. categoria / tipo
 *   8. filial
 *   9. canal
 *   10. de (data inicial)
 *   11. ate (data final)
 *   12. forma de pagamento
 *   13. status do pagamento
 *   14. status da producao
 *   15. status da entrega
 *
 * O `cliente` e a `filial` vem de selects populados pelo servidor (passados
 * como prop). Os outros sao inputs de texto/select estaticos.
 *
 * `useFiltrosNaURL` ja existe no kit e cuida de: paginacao resetada na
 * mudanca de filtro, sort, etc.
 */

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { COR, type Tom } from '@/components/ui/tokens';
import Botao from '@/components/ui/Botao';
import Selo from '@/components/ui/Selo';
import { moeda } from '@/lib/pedidos-termos';

const ESTADOS_PEDIDO = [
  { id: 'rascunho', rotulo: 'Rascunho' },
  { id: 'aguardando_pagamento', rotulo: 'Aguardando pagamento' },
  { id: 'pago', rotulo: 'Pago' },
  { id: 'em_producao', rotulo: 'Em producao' },
  { id: 'pronto', rotulo: 'Pronto' },
  { id: 'enviado', rotulo: 'Enviado' },
  { id: 'entregue', rotulo: 'Entregue' },
  { id: 'cancelado', rotulo: 'Cancelado' },
];

const CANAIS = ['loja', 'site', 'whatsapp', 'instagram', 'indicacao', 'outro'].map((c) => ({
  id: c,
  rotulo: c[0].toUpperCase() + c.slice(1),
}));

const FORMAS_PAGAMENTO = [
  { id: 'pix', rotulo: 'Pix' },
  { id: 'cartao', rotulo: 'Cartao' },
  { id: 'boleto', rotulo: 'Boleto' },
  { id: 'manual', rotulo: 'Manual' },
];

const STATUS_PAGAMENTO = [
  { id: 'pendente', rotulo: 'Pendente' },
  { id: 'aprovado', rotulo: 'Aprovado' },
  { id: 'recusado', rotulo: 'Recusado' },
  { id: 'estornado', rotulo: 'Estornado' },
  { id: 'expirado', rotulo: 'Expirado' },
];

const STATUS_PRODUCAO = [
  { id: 'fila', rotulo: 'Fila' },
  { id: 'aguardando', rotulo: 'Aguardando' },
  { id: 'preflight', rotulo: 'Pre-flight' },
  { id: 'arquivos_prontos', rotulo: 'Arquivos prontos' },
  { id: 'impressao', rotulo: 'Impressao' },
  { id: 'acabamento', rotulo: 'Acabamento' },
  { id: 'revisao', rotulo: 'Revisao' },
  { id: 'qualidade', rotulo: 'Qualidade' },
  { id: 'embalagem', rotulo: 'Embalagem' },
  { id: 'pronto', rotulo: 'Pronto' },
];

const STATUS_ENTREGA = [
  { id: 'aguardando', rotulo: 'Aguardando (legado)' },
  { id: 'aguardando_embalagem', rotulo: 'Aguardando embalagem' },
  { id: 'pronto_para_envio', rotulo: 'Pronto para envio' },
  { id: 'etiqueta_gerada', rotulo: 'Etiqueta gerada' },
  { id: 'aguardando_coleta', rotulo: 'Aguardando coleta' },
  { id: 'postado', rotulo: 'Postado' },
  { id: 'em_transito', rotulo: 'Em transito' },
  { id: 'entregue', rotulo: 'Entregue' },
  { id: 'problema_na_entrega', rotulo: 'Problema na entrega' },
  { id: 'retornado', rotulo: 'Retornado' },
  { id: 'devolvido', rotulo: 'Devolvido' },
];

export type OpcoesFiltro = { id: string; rotulo: string };

export default function BarraDeFiltrosPedidos({
  filiais,
  clientes,
  totalFiltrado,
}: {
  filiais: OpcoesFiltro[];
  clientes: OpcoesFiltro[];
  totalFiltrado: number;
}) {
  const router = useRouter();
  const busca = useSearchParams();
  const caminho = usePathname();
  const [pendente, iniciar] = useTransition();
  const [expandido, setExpandido] = useState(false);

  const valor = (k: string) => busca.get(k) ?? '';

  const setar = (mud: Record<string, string | null>) => {
    const p = new URLSearchParams(busca.toString());
    for (const [k, v] of Object.entries(mud)) {
      if (v === null || v === '') p.delete(k);
      else p.set(k, v);
    }
    p.delete('pagina');
    const s = p.toString();
    iniciar(() => router.push(s ? `${caminho}?${s}` : caminho));
  };

  const limpar = () => iniciar(() => router.push(caminho));

  const estiloInput: React.CSSProperties = {
    height: 36,
    padding: '0 12px',
    border: `1px solid ${COR.linha}`,
    borderRadius: 12,
    background: COR.papel,
    color: COR.tinta,
    fontSize: 13,
    fontFamily: 'inherit',
  };

  const filtrosAtivos = Array.from(busca.keys()).filter(
    (k) => k !== 'pagina' && busca.get(k),
  ).length;

  return (
    <section
      style={{
        background: COR.papel,
        border: `1px solid ${COR.linha}`,
        borderRadius: 16,
        padding: '14px 18px',
        boxShadow: '0 2px 8px rgba(11,18,32,.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      {/* linha 1: busca universal, numero, codigo, cliente, status, datas */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1fr 1.2fr 1fr 0.7fr 0.7fr auto',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <input
          name="busca"
          defaultValue={valor('busca')}
          placeholder="Busca universal (numero, codigo, cliente, projeto, produto)"
          aria-label="Busca universal"
          style={estiloInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setar({ busca: (e.currentTarget as HTMLInputElement).value || null });
          }}
        />
        <input
          name="numero"
          defaultValue={valor('numero')}
          placeholder="Numero"
          aria-label="Numero do pedido"
          style={estiloInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setar({ numero: (e.currentTarget as HTMLInputElement).value || null });
          }}
        />
        <input
          name="codigo"
          defaultValue={valor('codigo')}
          placeholder="PT-10482"
          aria-label="Codigo PT"
          style={estiloInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setar({ codigo: (e.currentTarget as HTMLInputElement).value || null });
          }}
        />
        <select
          value={valor('cliente')}
          aria-label="Cliente"
          onChange={(e) => setar({ cliente: e.target.value || null })}
          style={estiloInput}
        >
          <option value="">Cliente (todos)</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.rotulo}
            </option>
          ))}
        </select>
        <select
          value={valor('estado')}
          aria-label="Estado do pedido"
          onChange={(e) => setar({ estado: e.target.value || null })}
          style={estiloInput}
        >
          <option value="">Status (todos)</option>
          {ESTADOS_PEDIDO.map((e) => (
            <option key={e.id} value={e.id}>
              {e.rotulo}
            </option>
          ))}
        </select>
        <input
          type="date"
          name="de"
          defaultValue={valor('de')}
          aria-label="Data inicial"
          style={estiloInput}
          onChange={(e) => setar({ de: e.target.value || null })}
        />
        <input
          type="date"
          name="ate"
          defaultValue={valor('ate')}
          aria-label="Data final"
          style={estiloInput}
          onChange={(e) => setar({ ate: e.target.value || null })}
        />
        <Botao onClick={() => setExpandido((v) => !v)}>
          {expandido ? 'Menos' : 'Mais'}
        </Botao>
      </div>

      {/* linha 2 (expandida): filial, canal, projeto, produto, categoria, financeiro, etc */}
      {expandido && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr 1.2fr 1fr 1fr 1fr 1fr',
            gap: 8,
            alignItems: 'center',
          }}
        >
          <select
            value={valor('filial')}
            aria-label="Filial"
            onChange={(e) => setar({ filial: e.target.value || null })}
            style={estiloInput}
          >
            <option value="">Filial (todas)</option>
            {filiais.map((f) => (
              <option key={f.id} value={f.id}>
                {f.rotulo}
              </option>
            ))}
          </select>
          <select
            value={valor('canal')}
            aria-label="Canal"
            onChange={(e) => setar({ canal: e.target.value || null })}
            style={estiloInput}
          >
            <option value="">Canal (todos)</option>
            {CANAIS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.rotulo}
              </option>
            ))}
          </select>
          <input
            name="projeto"
            defaultValue={valor('projeto')}
            placeholder="UUID projeto"
            aria-label="Projeto"
            style={estiloInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setar({ projeto: (e.currentTarget as HTMLInputElement).value || null });
            }}
          />
          <input
            name="produto"
            defaultValue={valor('produto')}
            placeholder="Produto (descricao)"
            aria-label="Produto"
            style={estiloInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setar({ produto: (e.currentTarget as HTMLInputElement).value || null });
            }}
          />
          <input
            name="categoria"
            defaultValue={valor('categoria')}
            placeholder="Categoria (fotolivro, ...)"
            aria-label="Categoria"
            style={estiloInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setar({ categoria: (e.target as HTMLInputElement).value || null });
            }}
          />
          <select
            value={valor('forma_pagamento')}
            aria-label="Forma de pagamento"
            onChange={(e) => setar({ forma_pagamento: e.target.value || null })}
            style={estiloInput}
          >
            <option value="">Pagamento (todos)</option>
            {FORMAS_PAGAMENTO.map((f) => (
              <option key={f.id} value={f.id}>
                {f.rotulo}
              </option>
            ))}
          </select>
          <select
            value={valor('status_pagamento')}
            aria-label="Status do pagamento"
            onChange={(e) => setar({ status_pagamento: e.target.value || null })}
            style={estiloInput}
          >
            <option value="">Status pagto (todos)</option>
            {STATUS_PAGAMENTO.map((s) => (
              <option key={s.id} value={s.id}>
                {s.rotulo}
              </option>
            ))}
          </select>
          <select
            value={valor('status_producao')}
            aria-label="Status da producao"
            onChange={(e) => setar({ status_producao: e.target.value || null })}
            style={estiloInput}
          >
            <option value="">Producao (todos)</option>
            {STATUS_PRODUCAO.map((s) => (
              <option key={s.id} value={s.id}>
                {s.rotulo}
              </option>
            ))}
          </select>
          <select
            value={valor('status_entrega')}
            aria-label="Status da entrega"
            onChange={(e) => setar({ status_entrega: e.target.value || null })}
            style={estiloInput}
          >
            <option value="">Entrega (todos)</option>
            {STATUS_ENTREGA.map((s) => (
              <option key={s.id} value={s.id}>
                {s.rotulo}
              </option>
            ))}
          </select>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
        }}
      >
        {filtrosAtivos > 0 && (
          <>
            <span style={{ fontSize: 12, color: COR.apagado }}>
              {filtrosAtivos} filtro{filtrosAtivos === 1 ? '' : 's'} ativo
              {filtrosAtivos === 1 ? '' : 's'}
            </span>
            <Botao variante="secundario" onClick={limpar}>
              Limpar todos
            </Botao>
          </>
        )}
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 12.5, color: COR.texto }}>
          {totalFiltrado.toLocaleString('pt-BR')} pedido{totalFiltrado === 1 ? '' : 's'}
        </span>
      </div>
    </section>
  );
}
