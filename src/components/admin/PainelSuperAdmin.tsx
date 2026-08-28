'use client';

import type { LojaResumo, NumerosDaPlataforma } from '@/lib/lojista';
import { criarLoja, alternarLoja } from '@/app/admin/actions';

const CARD = 'rounded-[18px] border border-line bg-surface';
const CAMPO =
  'h-11 w-full rounded-[14px] border border-line bg-surface px-3.5 text-[14px] text-ink outline-none focus:border-blue';
const ROTULO = 'text-[12.5px] font-semibold text-ink-3';
const BOTAO_PRIMARIO =
  'flex h-11 items-center justify-center gap-2 rounded-[14px] bg-lente px-4 text-[13.5px] font-bold text-white shadow-card hover:brightness-[1.06]';
const BOTAO =
  'flex h-9 items-center justify-center rounded-[12px] border border-line bg-surface px-3 text-[12.5px] font-semibold text-ink-3 hover:border-[#D6E2FC] hover:bg-blue-soft hover:text-blue';

const n = (v: number) => v.toLocaleString('pt-BR');

export default function PainelSuperAdmin({
  lojas,
  numeros,
  dominio,
  email,
}: {
  lojas: LojaResumo[];
  numeros: NumerosDaPlataforma;
  dominio: string;
  email: string;
}) {
  const kpis = [
    { rotulo: 'Lojas', valor: numeros.lojas },
    { rotulo: 'Clientes finais', valor: numeros.clientes },
    { rotulo: 'Álbuns', valor: numeros.projetos },
    { rotulo: 'Fotos liberadas', valor: numeros.fotos },
  ];

  return (
    <div className="min-h-screen bg-page">
      <header className="flex min-h-[72px] flex-wrap items-center gap-4 border-b border-line bg-surface px-7 py-3">
        <span className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-ink text-[13px] font-extrabold text-white">
            SA
          </span>
          <span>
            <span className="block text-[15px] font-extrabold tracking-[-.2px]">Photoon</span>
            <span className="block text-[11.5px] text-muted-2">super admin</span>
          </span>
        </span>

        <div className="flex-1" />

        <span className="text-[13px] text-muted">{email}</span>
        <form action="/auth/sair" method="post">
          <button
            type="submit"
            className="h-10 rounded-[12px] border border-line px-3.5 text-[13px] font-semibold text-ink-3 hover:bg-coral-surface hover:text-[#E11D48]"
          >
            Sair
          </button>
        </form>
      </header>

      <main className="mx-auto flex max-w-[1200px] animate-riseIn flex-col gap-5 px-7 py-7">
        <div>
          <h1 className="m-0 text-[26px] font-extrabold tracking-[-.9px]">Plataforma</h1>
          <p className="m-0 mt-1.5 text-[13.5px] text-muted">
            Todas as lojas, com os números de cada uma.
          </p>
        </div>

        {/* ---------------- números ---------------- */}
        <div className="grid gap-4 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
          {kpis.map((k) => (
            <div key={k.rotulo} className={`${CARD} px-5 py-4`}>
              <p className="m-0 text-[12.5px] text-muted-2">{k.rotulo}</p>
              <p className="m-0 mt-1 text-[29px] font-extrabold tracking-[-1px]">{n(k.valor)}</p>
            </div>
          ))}
        </div>

        {/* ---------------- nova loja ---------------- */}
        <form action={criarLoja} className={`${CARD} p-6`}>
          <p className="m-0 mb-1 text-[15px] font-bold">Nova loja</p>
          <p className="m-0 mb-4 text-[12.5px] text-muted">
            O endereço vira <span className="font-semibold">slug.{dominio}</span> e o certificado é
            emitido na primeira visita.
          </p>
          <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <label className="flex flex-col gap-1.5">
              <span className={ROTULO}>Nome</span>
              <input name="nome" required placeholder="Estúdio Fulano" className={CAMPO} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={ROTULO}>Endereço</span>
              <input
                name="slug"
                required
                pattern="[a-z0-9][a-z0-9\-]{1,48}[a-z0-9]"
                placeholder="estudiofulano"
                className={CAMPO}
              />
            </label>
            <div className="flex items-end">
              <button type="submit" className={BOTAO_PRIMARIO}>
                Criar loja
              </button>
            </div>
          </div>
        </form>

        {/* ---------------- lojas ---------------- */}
        {lojas.length === 0 ? (
          <div className={`${CARD} px-6 py-14 text-center`}>
            <p className="m-0 text-[15px] font-bold">Nenhuma loja</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {lojas.map((l) => (
              <div key={l.id} className={`${CARD} flex flex-wrap items-center gap-4 px-6 py-4`}>
                <span className="flex h-11 w-11 flex-none items-center justify-center overflow-hidden rounded-[14px] bg-blue-soft text-[13px] font-bold text-blue">
                  {l.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={l.logo_url} alt="" className="h-full w-full object-contain" />
                  ) : (
                    l.nome.slice(0, 2).toUpperCase()
                  )}
                </span>

                <div className="min-w-[200px] flex-1">
                  <p className="m-0 text-[15px] font-bold">{l.nome}</p>
                  <a
                    href={`https://${l.slug}.${dominio}/entrar`}
                    className="m-0 text-[12.5px] text-blue hover:underline"
                  >
                    {l.slug}.{dominio}
                  </a>
                </div>

                {[
                  ['Equipe', l.lojista_membros?.[0]?.count ?? 0],
                  ['Clientes', l.clientes?.[0]?.count ?? 0],
                  ['Álbuns', l.projetos?.[0]?.count ?? 0],
                ].map(([rot, val]) => (
                  <div key={rot as string} className="min-w-[76px] text-right">
                    <p className="m-0 text-[12px] text-muted-2">{rot}</p>
                    <p className="m-0 text-[15px] font-extrabold">{n(val as number)}</p>
                  </div>
                ))}

                <span
                  className={`rounded-full px-3 py-1.5 text-[11.5px] font-bold ${
                    l.ativo ? 'bg-green-surface text-[#059669]' : 'bg-coral-surface text-coral'
                  }`}
                >
                  {l.ativo ? 'Ativa' : 'Desativada'}
                </span>

                <form action={alternarLoja}>
                  <input type="hidden" name="lojista_id" value={l.id} />
                  <input type="hidden" name="ativo" value={String(!l.ativo)} />
                  <button type="submit" className={BOTAO}>
                    {l.ativo ? 'Desativar' : 'Reativar'}
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}

        <p className="m-0 text-[12px] leading-[1.6] text-muted-2">
          Desativar a loja tira o endereço do ar: o cliente deixa de conseguir entrar e o
          certificado não é mais emitido. Os dados ficam intactos.
        </p>
      </main>
    </div>
  );
}
