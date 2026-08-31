import { MENU_LOJISTA, rotaLegada } from '@/lib/rotas-lojista';

/**
 * Faixa no topo de uma tela que saiu do menu.
 *
 * Regra 17 do briefing: migrar a funcionalidade primeiro, remover a página
 * depois. Entre uma coisa e outra a página continua respondendo — quem tinha o
 * link salvo não bate num 404 — mas diz, em uma linha, para onde a
 * funcionalidade foi. Quando `migrado` virar true a página some e a rota vira
 * redirect.
 */
export default function AvisoRotaLegada({ rota }: { rota: string }) {
  const legada = rotaLegada(rota);
  if (!legada) return null;

  // O destino pode ainda não existir — Financeiro e Cupons nascem em fases
  // seguintes. Oferecer o botão nesse caso seria trocar uma página viva por um
  // 404: melhor dizer para onde vai e não levar a lugar nenhum ainda.
  const base = legada.para.split('?')[0];
  const pronto =
    legada.migrado || MENU_LOJISTA.some((m) => m.rota === base && m.pronto);

  return (
    <div
      role="status"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
        margin: '0 0 20px',
        padding: '13px 18px',
        borderRadius: 14,
        background: '#FEF3E2',
        border: '1px solid #FADFB4',
        color: '#8A5A12',
        fontSize: 13.5,
      }}
    >
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#B45309"
           strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" style={{ flex: '0 0 auto' }}>
        <circle cx="12" cy="12" r="8.5" /><path d="M12 8.2v4.4M12 15.9h.01" />
      </svg>
      <span>
        Esta página saiu do menu. A funcionalidade está indo para <b>{legada.destino}</b>.
      </span>
      {pronto && <a
        href={legada.para}
        style={{
          marginLeft: 'auto',
          padding: '7px 14px',
          borderRadius: 10,
          background: '#FFFFFF',
          border: '1px solid #FADFB4',
          color: '#8A5A12',
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}
      >
        Ir para o novo lugar
      </a>}
    </div>
  );
}
