'use client';

import { COR, RAIO } from '@/components/ui/tokens';

/**
 * Busca e filtros de uma listagem.
 *
 * Os valores vêm da URL (`useFiltrosNaURL`) e voltam para ela — quem usa esta
 * barra não guarda estado próprio. A busca só dispara ao enviar o formulário:
 * consultar a cada tecla digitada em uma tabela do servidor é uma ida ao banco
 * por letra.
 */

export type Opcao = { valor: string; rotulo: string };

export type Filtro = {
  chave: string;
  rotulo: string;
  opcoes: Opcao[];
};

export default function BarraDeFiltros({
  placeholder,
  filtros,
  valor,
  aoMudar,
  aoLimpar,
  temFiltro,
  acoes,
}: {
  placeholder: string;
  filtros: Filtro[];
  valor: (chave: string) => string;
  aoMudar: (mudancas: Record<string, string | null>) => void;
  aoLimpar: () => void;
  temFiltro: boolean;
  /** Botões à direita: exportar, novo, ações em massa. */
  acoes?: React.ReactNode;
}) {
  const campo: React.CSSProperties = {
    height: 42,
    padding: '0 14px',
    borderRadius: RAIO.campo,
    border: `1px solid ${COR.linha}`,
    background: COR.papel,
    fontFamily: 'inherit',
    fontSize: 13.5,
    color: COR.tinta,
  };

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center' }}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const dados = new FormData(e.currentTarget);
          aoMudar({ busca: String(dados.get('busca') ?? '') || null });
        }}
        style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 1 280px', maxWidth: 460, ...campo }}
      >
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke={COR.fraco}
             strokeWidth="2" strokeLinecap="round" style={{ flex: '0 0 auto' }}>
          <circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" />
        </svg>
        <input
          name="busca"
          defaultValue={valor('busca')}
          placeholder={placeholder}
          aria-label={placeholder}
          style={{ flex: 1, minWidth: 0, border: 0, background: 'transparent', fontFamily: 'inherit', fontSize: 13.5, color: COR.tinta }}
        />
      </form>

      {filtros.map((f) => (
        <select
          key={f.chave}
          value={valor(f.chave)}
          aria-label={f.rotulo}
          onChange={(e) => aoMudar({ [f.chave]: e.target.value || null })}
          style={{ ...campo, cursor: 'pointer', maxWidth: 210 }}
        >
          <option value="">{f.rotulo}: todos</option>
          {f.opcoes.map((o) => (
            <option key={o.valor} value={o.valor}>
              {o.rotulo}
            </option>
          ))}
        </select>
      ))}

      {temFiltro && (
        <button
          type="button"
          onClick={aoLimpar}
          style={{
            height: 42,
            padding: '0 14px',
            borderRadius: RAIO.campo,
            border: `1px solid ${COR.linha}`,
            background: 'transparent',
            fontFamily: 'inherit',
            fontSize: 13.5,
            fontWeight: 600,
            color: COR.apagado,
            cursor: 'pointer',
          }}
        >
          Limpar filtros
        </button>
      )}

      {acoes && <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>{acoes}</div>}
    </div>
  );
}
