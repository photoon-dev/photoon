'use client';

/**
 * Barra de filtros da lista de Pedidos.
 *
 * 4 filtros visiveis: Busca universal, Status, Cliente, Periodo.
 * Os 11 restantes ficam atras de "Mais filtros" (drawer):
 *   numero, codigo, projeto, produto, categoria, filial, canal,
 *   forma_pagamento, status_pagamento, status_producao, status_entrega, tipo
 *
 * Persistencia na URL via useFiltrosNaURL. Contador no botao "Mais filtros"
 * quando ha filtros adicionais ativos. Botao "Limpar filtros" zera tudo.
 *
 * Compacta e densa: tudo em uma linha, max-width 1240px (igual ao resto do
 * painel). Sem quebrar em varias linhas.
 */

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { COR, type Tom } from '@/components/ui/tokens';
import Botao from '@/components/ui/Botao';
import Selo from '@/components/ui/Selo';
import Modal from '@/components/ui/Modal';
export type OpcoesFiltro = { id: string; rotulo: string };

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
  { id: 'aguardando', rotulo: 'Aguardando' },
  { id: 'preflight', rotulo: 'Pre-flight' },
  { id: 'arquivos_prontos', rotulo: 'Arquivos prontos' },
  { id: 'impressao', rotulo: 'Impressao' },
  { id: 'acabamento', rotulo: 'Acabamento' },
  { id: 'qualidade', rotulo: 'Qualidade' },
  { id: 'embalagem', rotulo: 'Embalagem' },
  { id: 'pronto', rotulo: 'Pronto' },
];

const STATUS_ENTREGA = [
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

const estiloInput: React.CSSProperties = {
  height: 36,
  padding: '0 12px',
  border: `1px solid ${COR.linha}`,
  borderRadius: 10,
  background: COR.papel,
  color: COR.tinta,
  fontSize: 13,
  fontFamily: 'inherit',
};


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
  const [drawer, setDrawer] = useState(false);

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

  const limpar = () => {
    iniciar(() => router.push(caminho));
    setDrawer(false);
  };

  // Filtros da linha principal (4) + os do drawer (11)
  const PRINCIPAIS = new Set(['busca', 'estado', 'cliente', 'de', 'ate']);
  const todosAtivos = Array.from(busca.keys()).filter((k) => k !== 'pagina' && busca.get(k));
  const extrasAtivos = todosAtivos.filter((k) => !PRINCIPAIS.has(k)).length;

  return (
    <section
      style={{
        background: COR.papel,
        border: `1px solid ${COR.linha}`,
        borderRadius: 14,
        padding: '12px 14px',
        boxShadow: '0 2px 8px rgba(11,18,32,.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
    >
      {/* Linha principal: 4 filtros */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 1.2fr 1.4fr auto auto',
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
            if (e.key === 'Enter') {
              setar({ busca: (e.target as HTMLInputElement).value || null });
            }
          }}
        />
        <select
          value={valor('estado')}
          aria-label="Status do pedido"
          onChange={(e) => setar({ estado: e.target.value || null })}
          style={estiloInput}
        >
          <option value="">Status (todos)</option>
          {ESTADOS_PEDIDO.map((s) => (
            <option key={s.id} value={s.id}>
              {s.rotulo}
            </option>
          ))}
        </select>
        <select
          value={valor('cliente')}
          aria-label="Cliente"
          onChange={(e) => setar({ cliente: e.target.value || null })}
          style={estiloInput}
        >
          <option value="">Cliente (todos)</option>
          {clientes.slice(0, 200).map((c) => (
            <option key={c.id} value={c.id}>
              {c.rotulo}
            </option>
          ))}
        </select>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 6,
          }}
        >
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
        </div>
        <button
          type="button"
          onClick={() => setDrawer(true)}
          style={{
            height: 36,
            padding: '0 14px',
            border: `1px solid ${extrasAtivos > 0 ? COR.azul : COR.linha}`,
            borderRadius: 10,
            background: extrasAtivos > 0 ? COR.linha : COR.papel,
            color: extrasAtivos > 0 ? COR.azul : COR.texto,
            fontSize: 12.5,
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
          }}
        >
          Mais filtros
          {extrasAtivos > 0 && (
            <span
              style={{
                background: COR.azul,
                color: COR.papel,
                borderRadius: 999,
                padding: '1px 7px',
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {extrasAtivos}
            </span>
          )}
        </button>
        {todosAtivos.length > 0 ? (
          <button
            type="button"
            onClick={limpar}
            style={{
              height: 36,
              padding: '0 12px',
              border: 0,
              background: 'transparent',
              color: COR.coral,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              whiteSpace: 'nowrap',
            }}
          >
            Limpar filtros
          </button>
        ) : (
          <span />
        )}
      </div>

      <div
        style={{
          fontSize: 12,
          color: COR.apagado,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <span>
          {totalFiltrado.toLocaleString('pt-BR')} pedido{totalFiltrado === 1 ? '' : 's'}
        </span>
        {todosAtivos.length > 0 && (
          <span style={{ color: COR.fraco }}>·</span>
        )}
        {todosAtivos.length > 0 && (
          <span>
            {todosAtivos.length} filtro{todosAtivos.length === 1 ? '' : 's'} ativo
            {todosAtivos.length === 1 ? '' : 's'}
          </span>
        )}
      </div>

      {/* Drawer "Mais filtros" */}
      <Modal
        aberto={drawer}
        aoFechar={() => setDrawer(false)}
        titulo="Mais filtros"
        descricao="Os filtros abaixo se combinam com os da barra superior."
        lado
        largura={520}
        rodape={
          <>
            <Botao variante="secundario" onClick={limpar}>
              Limpar tudo
            </Botao>
            <Botao variante="primario" onClick={() => setDrawer(false)}>
              Aplicar
            </Botao>
          </>
        }
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 14,
          }}
        >
          <Campo label="Numero do pedido">
            <input
              defaultValue={valor('numero')}
              placeholder="1042"
              style={estiloInput}
              onBlur={(e) => setar({ numero: e.target.value || null })}
            />
          </Campo>
          <Campo label="Codigo PT">
            <input
              defaultValue={valor('codigo')}
              placeholder="PT-10482"
              style={estiloInput}
              onBlur={(e) => setar({ codigo: e.target.value || null })}
            />
          </Campo>
          <Campo label="Projeto (UUID)">
            <input
              defaultValue={valor('projeto')}
              placeholder="uuid"
              style={estiloInput}
              onBlur={(e) => setar({ projeto: e.target.value || null })}
            />
          </Campo>
          <Campo label="Produto">
            <input
              defaultValue={valor('produto')}
              placeholder="descricao do item"
              style={estiloInput}
              onBlur={(e) => setar({ produto: e.target.value || null })}
            />
          </Campo>
          <Campo label="Categoria / Tipo">
            <input
              defaultValue={valor('categoria') || valor('tipo')}
              placeholder="fotolivro, revelacao, ..."
              style={estiloInput}
              onBlur={(e) => setar({ categoria: e.target.value || null, tipo: e.target.value || null })}
            />
          </Campo>
          <Campo label="Filial">
            <select
              value={valor('filial')}
              style={estiloInput}
              onChange={(e) => setar({ filial: e.target.value || null })}
            >
              <option value="">Filial (todas)</option>
              {filiais.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.rotulo}
                </option>
              ))}
            </select>
          </Campo>
          <Campo label="Canal">
            <select
              value={valor('canal')}
              style={estiloInput}
              onChange={(e) => setar({ canal: e.target.value || null })}
            >
              <option value="">Canal (todos)</option>
              {CANAIS.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.rotulo}
                </option>
              ))}
            </select>
          </Campo>
          <Campo label="Forma de pagamento">
            <select
              value={valor('forma_pagamento')}
              style={estiloInput}
              onChange={(e) => setar({ forma_pagamento: e.target.value || null })}
            >
              <option value="">Forma (todas)</option>
              {FORMAS_PAGAMENTO.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.rotulo}
                </option>
              ))}
            </select>
          </Campo>
          <Campo label="Status do pagamento">
            <select
              value={valor('status_pagamento')}
              style={estiloInput}
              onChange={(e) => setar({ status_pagamento: e.target.value || null })}
            >
              <option value="">Status pagto (todos)</option>
              {STATUS_PAGAMENTO.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.rotulo}
                </option>
              ))}
            </select>
          </Campo>
          <Campo label="Status da producao">
            <select
              value={valor('status_producao')}
              style={estiloInput}
              onChange={(e) => setar({ status_producao: e.target.value || null })}
            >
              <option value="">Producao (todos)</option>
              {STATUS_PRODUCAO.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.rotulo}
                </option>
              ))}
            </select>
          </Campo>
          <Campo label="Status da entrega">
            <select
              value={valor('status_entrega')}
              style={estiloInput}
              onChange={(e) => setar({ status_entrega: e.target.value || null })}
            >
              <option value="">Entrega (todos)</option>
              {STATUS_ENTREGA.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.rotulo}
                </option>
              ))}
            </select>
          </Campo>
        </div>
      </Modal>
    </section>
  );
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.6px',
          textTransform: 'uppercase',
          color: COR.fraco,
        }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}
