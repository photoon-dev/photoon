import { COR } from '@/components/ui/tokens';

/**
 * Cabeçalho de página do painel: grupo, título e uma linha de explicação.
 *
 * Nasceu na auditoria visual: Produção e Expedição eram as duas únicas telas do
 * menu sem `<h1>` nenhum. Além da inconsistência visível, isso quebra o leitor
 * de tela e a navegação por cabeçalho — quem chega na página não tem como saber
 * onde está sem ler o menu.
 *
 * Os valores são os mesmos que `/pedidos` e `/projetos` já usavam inline
 * (kicker 11px/1.4px maiúsculo, título 26px/800, apoio 13.5px). Aqui eles ficam
 * num lugar só, para a padronização seguinte não ter de caçar seis cópias.
 */
export default function CabecalhoPagina({
  grupo,
  titulo,
  descricao,
  acoes,
}: {
  /** O grupo do menu a que a tela pertence: "Operação", "Gestão"… */
  grupo: string;
  titulo: string;
  descricao?: string;
  /** Botões à direita, alinhados à base do título. */
  acoes?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: 260 }}>
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
          {grupo}
        </p>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: '-0.5px' }}>
          {titulo}
        </h1>
        {descricao && (
          <p style={{ margin: '4px 0 0', fontSize: 13.5, color: COR.apagado, maxWidth: '68ch' }}>
            {descricao}
          </p>
        )}
      </div>
      {acoes}
    </div>
  );
}
