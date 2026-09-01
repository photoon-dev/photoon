'use client';

/**
 * Barra de filtros da Central de Projetos.
 *
 * 4 filtros visiveis: Busca universal, Status, Cliente, Periodo.
 * Os 6 restantes ficam atras de "Mais filtros" (drawer):
 *   produto, filial, pedido (com/sem), capa (com/sem), render, arquivados
 *
 * Persistencia na URL (sem hook intermediario: igual a Pedidos). Contador
 * no botao "Mais filtros" quando ha filtros adicionais ativos. Botao
 * "Limpar filtros" zera tudo.
 *
 * Compacta e densa, no mesmo padrao da barra de Pedidos.
 */

import { useState, useTransition } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { COR } from '@/components/ui/tokens';
import Botao from '@/components/ui/Botao';
import Modal from '@/components/ui/Modal';
import { STATUS_PROJETO } from '@/lib/projetos-termos';

export type OpcoesFiltroProjeto = { id: string; rotulo: string };

const estiloInput: React.CSSProperties = {
  // Sem `minWidth: 0` o input tem largura minima intrinseca e estoura a celula
  // do grid mesmo com `minmax(0, …)` na coluna.
  minWidth: 0,
  height: 36,
  padding: '0 12px',
  border: `1px solid ${COR.linha}`,
  borderRadius: 10,
  background: COR.papel,
  color: COR.tinta,
  fontSize: 13,
  fontFamily: 'inherit',
};

export default function BarraDeFiltrosProjetos({
  clientes,
  filiais,
  totalFiltrado,
}: {
  clientes: OpcoesFiltroProjeto[];
  filiais: OpcoesFiltroProjeto[];
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
    p.delete('ordem');
    const s = p.toString();
    iniciar(() => router.push(s ? `${caminho}?${s}` : caminho));
  };

  const limpar = () => {
    iniciar(() => router.push(caminho));
    setDrawer(false);
  };

  // 4 principais + 6 no drawer
  const PRINCIPAIS = new Set(['busca', 'status', 'cliente', 'criadoDe', 'criadoAte', 'editadoDe']);
  const todosAtivos = Array.from(busca.keys()).filter((k) => k !== 'pagina' && k !== 'ordem' && busca.get(k));
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
          // `1fr` em Grid e `minmax(auto, 1fr)`: o minimo `auto` impede a coluna
          // de encolher abaixo do conteudo. Com o placeholder longo da busca e
          // os `option` de cliente (nome + e-mail), as colunas recusavam
          // encolher e a barra vazava para fora da tela — 394px em 1024 e 52px
          // em 1366, com os dois ultimos filtros inalcancaveis. `minmax(0, …)`
          // devolve o direito de encolher.
          gridTemplateColumns:
            'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1.2fr) minmax(0, 1.4fr) auto auto',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <input
          name="busca"
          defaultValue={valor('busca')}
          placeholder="Buscar por codigo, projeto, cliente, e-mail, pedido ou produto"
          aria-label="Busca universal"
          style={estiloInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setar({ busca: (e.target as HTMLInputElement).value || null });
            }
          }}
        />
        <select
          value={valor('status')}
          aria-label="Status do projeto"
          onChange={(e) => setar({ status: e.target.value || null })}
          style={estiloInput}
        >
          <option value="">Status (todos)</option>
          {STATUS_PROJETO.map((s) => (
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
            name="criadoDe"
            defaultValue={valor('criadoDe')}
            aria-label="Criado de"
            style={estiloInput}
            onChange={(e) => setar({ criadoDe: e.target.value || null })}
          />
          <input
            type="date"
            name="criadoAte"
            defaultValue={valor('criadoAte')}
            aria-label="Criado ate"
            style={estiloInput}
            onChange={(e) => setar({ criadoAte: e.target.value || null })}
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
          {totalFiltrado.toLocaleString('pt-BR')} projeto{totalFiltrado === 1 ? '' : 's'}
        </span>
        {todosAtivos.length > 0 && (
          <>
            <span style={{ color: COR.fraco }}>·</span>
            <span>
              {todosAtivos.length} filtro{todosAtivos.length === 1 ? '' : 's'} ativo
              {todosAtivos.length === 1 ? '' : 's'}
            </span>
          </>
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
          <Campo label="Produto">
            <input
              defaultValue={valor('produto')}
              placeholder="fotolivro, revelacao, ..."
              style={estiloInput}
              onBlur={(e) => setar({ produto: e.target.value || null })}
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
          <Campo label="Pedido">
            <select
              value={valor('pedido')}
              style={estiloInput}
              onChange={(e) => setar({ pedido: e.target.value || null })}
            >
              <option value="">Pedido (todos)</option>
              <option value="com">com pedido</option>
              <option value="sem">sem pedido</option>
            </select>
          </Campo>
          <Campo label="Capa">
            <select
              value={valor('capa')}
              style={estiloInput}
              onChange={(e) => setar({ capa: e.target.value || null })}
            >
              <option value="">Capa (todas)</option>
              <option value="com">com capa</option>
              <option value="sem">sem capa</option>
            </select>
          </Campo>
          <Campo label="Renderizacao">
            <select
              value={valor('render')}
              style={estiloInput}
              onChange={(e) => setar({ render: e.target.value || null })}
            >
              <option value="">Render (todos)</option>
              <option value="sim">renderizado</option>
              <option value="nao">nao renderizado</option>
              <option value="erro">com erro</option>
            </select>
          </Campo>
          <Campo label="Editado desde">
            <input
              type="date"
              defaultValue={valor('editadoDe')}
              style={estiloInput}
              onChange={(e) => setar({ editadoDe: e.target.value || null })}
            />
          </Campo>
          <Campo label="Arquivados" full>
            <label
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                fontSize: 13,
                color: COR.texto,
                cursor: 'pointer',
              }}
            >
              <input
                type="checkbox"
                checked={valor('arquivados') === 'sim'}
                onChange={(e) => setar({ arquivados: e.target.checked ? 'sim' : null })}
                style={{ accentColor: COR.azul }}
              />
              Mostrar apenas projetos arquivados
            </label>
          </Campo>
        </div>
      </Modal>
    </section>
  );
}

function Campo({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4, gridColumn: full ? '1 / -1' : undefined }}>
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
