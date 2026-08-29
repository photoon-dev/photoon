import Link from 'next/link';
import type { LinhaAuditoria, Periodo } from '@/lib/financeiro';

/**
 * Registro de ações da loja.
 *
 * Serve para responder "quem mexeu nisso e quando" — em especial nas
 * integrações de pagamento, onde a resposta vale dinheiro. A tela é só
 * leitura: histórico que se edita não é histórico.
 */

const CARD = 'rounded-[18px] border border-line bg-surface';
const CAMPO =
  'h-11 w-full rounded-[14px] border border-line bg-surface px-3.5 text-[14px] text-ink outline-none focus:border-blue';
const ROTULO = 'text-[12.5px] font-semibold text-ink-3';
const BOTAO =
  'flex h-11 items-center justify-center rounded-[14px] border border-line bg-surface px-4 text-[13.5px] font-semibold text-ink hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue';

const quando = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

/**
 * `gateway.conectado` vira "Gateway conectado".
 *
 * Um dicionário fixo ficaria desatualizado no dia em que outra frente
 * registrasse uma ação nova — e a tela mostraria a chave crua justamente para
 * o que ninguém conhece.
 */
const legivel = (acao: string) => {
  const t = acao.replace(/[._]/g, ' ');
  return t.charAt(0).toUpperCase() + t.slice(1);
};

export default function PainelAuditoria({
  linhas,
  acoes,
  total,
  pagina,
  porPagina,
  acao,
  periodo,
  temAlgumRegistro,
}: {
  linhas: LinhaAuditoria[];
  acoes: string[];
  total: number;
  pagina: number;
  porPagina: number;
  acao: string;
  periodo: Periodo;
  temAlgumRegistro: boolean;
}) {
  const paginas = Math.max(1, Math.ceil(total / porPagina));
  const url = (p: number) =>
    `/auditoria?de=${periodo.de}&ate=${periodo.ate}${acao ? `&acao=${encodeURIComponent(acao)}` : ''}&p=${p}`;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="m-0 text-[12.5px] font-semibold uppercase tracking-[1.2px] text-muted-2">
          Sistema · Auditoria
        </p>
        <h1 className="m-0 mt-1.5 text-[26px] font-extrabold tracking-[-.9px]">Auditoria</h1>
        <p className="m-0 mt-1.5 text-[13.5px] text-muted">
          Tudo o que foi feito nesta loja, na ordem em que aconteceu.
        </p>
      </div>

      <form method="get" action="/auditoria" className={`${CARD} flex flex-wrap items-end gap-3 p-4`}>
        <label className="flex flex-col gap-1.5">
          <span className={ROTULO}>Ação</span>
          <select name="acao" defaultValue={acao} className={`${CAMPO} w-[240px]`}>
            <option value="">Todas as ações</option>
            {acoes.map((a) => (
              <option key={a} value={a}>
                {legivel(a)}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={ROTULO}>De</span>
          <input type="date" name="de" defaultValue={periodo.de} className={`${CAMPO} w-[160px]`} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={ROTULO}>Até</span>
          <input type="date" name="ate" defaultValue={periodo.ate} className={`${CAMPO} w-[160px]`} />
        </label>
        <button type="submit" className={BOTAO}>
          Filtrar
        </button>
        <span className="ml-auto text-[12px] text-muted-2">
          {total.toLocaleString('pt-BR')} registros no recorte
        </span>
      </form>

      {!temAlgumRegistro ? (
        <section className={`${CARD} p-8 text-center`}>
          <p className="m-0 text-[15px] font-bold">Nenhuma ação registrada ainda</p>
          <p className="m-0 mx-auto mt-2 max-w-[520px] text-[13px] leading-[1.6] text-muted">
            O histórico começa a se encher assim que a loja for operada: conectar um gateway,
            responder um chamado, mudar um pedido. Nada é gravado retroativamente.
          </p>
        </section>
      ) : linhas.length === 0 ? (
        <section className={`${CARD} p-8 text-center`}>
          <p className="m-0 text-[15px] font-bold">Nada neste recorte</p>
          <p className="m-0 mt-2 text-[13px] text-muted">
            Há histórico nesta loja, mas não com esta ação e neste período. Amplie o intervalo ou
            escolha "Todas as ações".
          </p>
        </section>
      ) : (
        <section className={`${CARD} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-2 text-[11.5px] uppercase tracking-[.6px] text-muted-2">
                  <th className="px-6 py-3 font-semibold">Quando</th>
                  <th className="px-3 py-3 font-semibold">Ação</th>
                  <th className="px-3 py-3 font-semibold">Onde</th>
                  <th className="px-6 py-3 font-semibold">Detalhe</th>
                </tr>
              </thead>
              <tbody>
                {linhas.map((l) => (
                  <tr key={l.id} className="border-t border-line-2 align-top">
                    <td className="whitespace-nowrap px-6 py-3 text-[13px] text-ink-3">
                      {quando(l.criadoEm)}
                    </td>
                    <td className="px-3 py-3">
                      <span className="rounded-full bg-blue-soft px-2.5 py-1 text-[11.5px] font-bold text-blue">
                        {legivel(l.acao)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-[12.5px] text-muted">
                      {l.entidade ?? '—'}
                      {l.entidadeId && (
                        <span className="ml-1.5 text-[11px] text-muted-2">
                          {l.entidadeId.slice(0, 8)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-[12.5px] text-muted">
                      {l.detalhe && Object.keys(l.detalhe as object).length > 0 ? (
                        <code className="break-all text-[11.5px]">{JSON.stringify(l.detalhe)}</code>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {paginas > 1 && (
            <div className="flex items-center justify-between gap-3 border-t border-line px-6 py-4">
              <span className="text-[12.5px] text-muted">
                Página {pagina + 1} de {paginas}
              </span>
              <div className="flex gap-2">
                {pagina > 0 && (
                  <Link href={url(pagina - 1)} className={BOTAO}>
                    Anteriores
                  </Link>
                )}
                {pagina + 1 < paginas && (
                  <Link href={url(pagina + 1)} className={BOTAO}>
                    Seguintes
                  </Link>
                )}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
