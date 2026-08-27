import type { Lojista } from '@/lib/data';
import { IconSparkle, IconFoto, IconCheck } from '@/components/icons';

const DESTAQUES = [
  {
    Icone: IconSparkle,
    titulo: 'Álbum pronto em poucos cliques',
    texto: 'A assistência inteligente diagrama, respeita rostos e evita fotos repetidas.',
  },
  {
    Icone: IconFoto,
    titulo: 'Suas fotos já liberadas',
    texto: 'Sem enviar nada: a empresa cuidou disso para você.',
  },
  {
    Icone: IconCheck,
    titulo: 'Revisão antes de finalizar',
    texto: 'Avisamos páginas vazias e cortes antes do envio para produção.',
  },
];

/** Painel esquerdo da tela de login, com a marca do lojista. */
export default function HeroEntrar({ lojista }: { lojista: Lojista }) {
  const iniciais = lojista.nome
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();

  return (
    <div className="relative flex min-h-[620px] flex-col justify-between gap-10 overflow-hidden bg-[linear-gradient(150deg,#0B1220_0%,#152447_46%,#0E4F6B_100%)] px-12 py-11">
      <div className="pointer-events-none absolute -right-[90px] -top-[120px] h-[380px] w-[380px] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(37,99,235,.55),transparent_68%)]" />
      <div className="pointer-events-none absolute -bottom-[140px] -left-20 h-[340px] w-[340px] rounded-full bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,.4),transparent_70%)]" />

      <div className="relative flex items-center gap-3">
        {lojista.logo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={lojista.logo_url} alt={lojista.nome} className="h-10 w-auto object-contain" />
        ) : (
          <span className="flex h-10 w-10 flex-none items-center justify-center rounded-[13px] bg-[linear-gradient(135deg,#7C3AED,#EC4899)] text-[15px] font-extrabold text-white">
            {iniciais}
          </span>
        )}
        <div>
          <p className="m-0 text-base font-extrabold tracking-[-.2px] text-white">{lojista.nome}</p>
          <p className="m-0 mt-0.5 text-xs text-white/60">{lojista.slug}.photoon.com.br</p>
        </div>
      </div>

      <div className="relative flex max-w-[460px] flex-col gap-[30px]">
        <div>
          <span className="mb-[18px] inline-flex items-center gap-2 rounded-full bg-white/[.14] px-[13px] py-[7px] text-[11.5px] font-bold tracking-[.3px] text-white">
            <IconSparkle size={14} />
            Seus álbuns em um só lugar
          </span>
          <h1 className="m-0 mb-3.5 text-[40px] font-extrabold leading-[1.1] tracking-[-1.6px] text-white">
            Suas fotos já estão aqui. Vamos montar o álbum?
          </h1>
          <p className="m-0 text-[15px] leading-[1.65] text-white/75">
            {lojista.nome} liberou suas fotos. Escolha as imagens e a Photoon monta as páginas em
            minutos.
          </p>
        </div>

        <div className="flex flex-col gap-[18px]">
          {DESTAQUES.map(({ Icone, titulo, texto }) => (
            <div key={titulo} className="flex items-start gap-[13px]">
              <span className="flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl bg-white/[.16] text-white">
                <Icone />
              </span>
              <div className="min-w-0">
                <p className="m-0 text-[14.5px] font-bold text-white">{titulo}</p>
                <p className="m-0 mt-[3px] text-[13px] leading-[1.55] text-white/70">{texto}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="relative m-0 text-xs text-white/45">
        Tecnologia Photoon · seus dados ficam apenas com a {lojista.nome}
      </p>
    </div>
  );
}
