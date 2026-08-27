import Link from 'next/link';
import type { Cliente, Galeria, Projeto } from '@/lib/data';
import { criarProjeto } from '@/app/actions';
import { IconGaleria, IconCheck, IconSeta, IconMais } from '@/components/icons';

/** Faixa de destaque do topo de "Meus projetos". */
export default function HeroProjetos({
  cliente,
  galeria,
  projetos,
  nomeLojista,
}: {
  cliente: Cliente;
  galeria: Galeria | null;
  projetos: Projeto[];
  nomeLojista: string;
}) {
  const primeiroNome = (cliente.nome ?? cliente.email.split('@')[0]).split(' ')[0];
  const prontos = projetos.filter((p) => p.status === 'pronto');
  const emAndamento =
    projetos.find((p) => p.status === 'em_edicao' || p.status === 'com_pendencias') ??
    projetos.find((p) => p.status === 'nao_iniciado');

  // Progresso do pedido = media do progresso dos albuns.
  const progresso = projetos.length
    ? Math.round(projetos.reduce((t, p) => t + p.progresso, 0) / projetos.length)
    : 0;

  const podeCriarMais = galeria ? projetos.length < galeria.max_albuns : false;

  return (
    <section className="relative overflow-hidden rounded-control bg-[linear-gradient(140deg,#0B1220_0%,#1B2350_48%,#123F63_100%)] px-[34px] py-[30px]">
      <div className="pointer-events-none absolute -right-[70px] -top-[120px] h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle_at_40%_40%,rgba(99,102,241,.42),transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-[140px] left-[30%] h-[300px] w-[300px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,.3),transparent_72%)]" />

      <div className="relative grid items-center gap-7 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
        <div className="min-w-0">
          {galeria && (
            <span className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-white/[.22] bg-white/[.12] px-3 py-1.5 text-[11.5px] font-bold text-[#EDE9FE] backdrop-blur-[14px]">
              <IconGaleria size={14} />
              {galeria.nome}
            </span>
          )}

          <h1 className="m-0 mb-2.5 text-[32px] font-extrabold leading-[1.12] tracking-[-1.2px] text-white">
            {prontos.length > 0
              ? `Olá, ${primeiroNome}. Falta pouco para o seu álbum.`
              : `Olá, ${primeiroNome}. Vamos montar seu álbum?`}
          </h1>

          <p className="m-0 mb-5 text-[14.5px] leading-[1.6] text-white/[.74]">
            A <strong className="text-white">{nomeLojista}</strong> liberou{' '}
            {galeria ? `${galeria.total_fotos} fotos e ` : ''}
            {projetos.length} {projetos.length === 1 ? 'projeto' : 'projetos'}.
            {prontos.length > 0 &&
              ` ${prontos.length} ${prontos.length === 1 ? 'já está pronto' : 'já estão prontos'} para finalizar.`}
          </p>

          <div className="flex flex-wrap gap-2.5">
            {prontos[0] && (
              <Link
                href={`/projetos/${prontos[0].id}`}
                className="flex h-[46px] items-center gap-[9px] whitespace-nowrap rounded-field bg-white px-5 text-[14.5px] font-bold text-ink hover:bg-cyan-surface"
              >
                <IconCheck size={17} />
                Revisar e finalizar
              </Link>
            )}
            {emAndamento && (
              <Link
                href={`/editor/${emAndamento.id}`}
                className="flex h-[46px] items-center gap-[9px] whitespace-nowrap rounded-field bg-[linear-gradient(135deg,#7C5CFF,#4F46E5)] px-5 text-[14.5px] font-bold text-white shadow-[0_10px_24px_rgba(90,66,214,.42)] hover:brightness-[1.06]"
              >
                <IconSeta size={17} />
                {emAndamento.status === 'nao_iniciado' ? 'Começar o álbum' : 'Continuar editando'}
              </Link>
            )}
            {podeCriarMais && (
              <form action={criarProjeto}>
                <input type="hidden" name="galeria_id" value={galeria!.id} />
                <input type="hidden" name="titulo" value="Novo álbum" />
                <button
                  type="submit"
                  className="flex h-[47px] items-center gap-[9px] whitespace-nowrap rounded-field border border-white/30 bg-white/[.12] px-5 text-[14.5px] font-semibold text-white backdrop-blur-[16px] hover:bg-white/20"
                >
                  <IconMais size={17} />
                  Criar outro álbum
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="min-w-0">
          <div className="rounded-control border border-white/20 bg-[rgba(23,25,64,.42)] px-5 py-[18px] shadow-[0_18px_40px_rgba(10,12,36,.34)] backdrop-blur-[18px]">
            <div className="mb-2.5 flex items-baseline justify-between gap-3">
              <span className="text-[12.5px] text-white/70">Progresso do pedido</span>
              <span className="text-[13px] font-extrabold text-white">{progresso}%</span>
            </div>
            <div className="mb-[18px] h-2 rounded-full bg-white/[.16]">
              <div
                className="h-full rounded-full bg-[linear-gradient(90deg,#A78BFA,#E9E5FF)]"
                style={{ width: `${progresso}%` }}
              />
            </div>
            <div className="grid grid-cols-3 gap-3.5">
              {[
                { n: projetos.length, r: projetos.length === 1 ? 'projeto' : 'projetos' },
                { n: galeria?.total_fotos ?? 0, r: 'fotos liberadas' },
                { n: prontos.length, r: prontos.length === 1 ? 'pronto' : 'prontos' },
              ].map(({ n, r }) => (
                <div key={r} className="min-w-0">
                  <p className="m-0 text-2xl font-extrabold tracking-[-.8px] text-white">{n}</p>
                  <p className="m-0 mt-[3px] whitespace-nowrap text-xs text-white/[.66]">{r}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
