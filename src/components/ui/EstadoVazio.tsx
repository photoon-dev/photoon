import { COR } from '@/components/ui/tokens';

/**
 * O que aparece quando não há nada.
 *
 * Tabela sem linha e sem explicação parece defeito. Aqui ela diz o que
 * aconteceu e, quando existe, o que fazer para ter a primeira linha.
 *
 * `filtrado` separa dois casos que se parecem e não são: "esta loja ainda não
 * tem pedido" e "nenhum pedido casa com este filtro". O segundo pede um botão
 * de limpar, não um convite a cadastrar.
 */
export default function EstadoVazio({
  titulo,
  descricao,
  acao,
  filtrado = false,
}: {
  titulo: string;
  descricao?: string;
  acao?: React.ReactNode;
  filtrado?: boolean;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        padding: '54px 26px',
        textAlign: 'center',
      }}
    >
      <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke={COR.fraco}
           strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {filtrado ? (
          <>
            <path d="M3.5 5.5h17l-6.5 7.5v5.5l-4 2v-7.5z" />
          </>
        ) : (
          <>
            <rect x="3.5" y="5" width="17" height="14" rx="3.5" />
            <path d="M3.5 10h17M8.5 14h7" />
          </>
        )}
      </svg>
      <p style={{ margin: 0, fontSize: 14.5, fontWeight: 600, color: COR.tinta2 }}>{titulo}</p>
      {descricao && (
        <p style={{ margin: 0, fontSize: 13, color: COR.fraco, maxWidth: '46ch' }}>{descricao}</p>
      )}
      {acao && <div style={{ marginTop: 8 }}>{acao}</div>}
    </div>
  );
}
