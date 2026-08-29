'use client';

import { useState } from 'react';
import Link from 'next/link';

/**
 * Central de ajuda do cliente.
 *
 * Escrita a partir do que o editor de fato faz — não é texto genérico. Cada
 * resposta descreve um caminho que existe na tela; quando algo ainda não
 * existe, a resposta diz isso em vez de prometer.
 */

type Duvida = { p: string; r: React.ReactNode };

const PASSOS: [string, string][] = [
  ['1. A loja libera suas fotos', 'Você recebe o acesso por e-mail e as fotos aparecem na galeria.'],
  ['2. Você monta o álbum', 'Escolha as fotos, o layout de cada página, fundos, textos e elementos.'],
  ['3. Revisa e finaliza', 'O sistema avisa se alguma página está sem foto antes de enviar à loja.'],
  ['4. A loja produz', 'A partir daí é com o estúdio: impressão, acabamento e entrega.'],
];

const DUVIDAS: Duvida[] = [
  {
    p: 'Preciso terminar o álbum de uma vez?',
    r: 'Não. Tudo o que você faz é salvo sozinho, poucos segundos depois de cada mudança. Pode fechar a aba e voltar depois — o indicador no alto da tela mostra "Salvo agora" quando terminou de gravar.',
  },
  {
    p: 'Como coloco uma foto na página?',
    r: 'Clique na foto no painel da esquerda: ela entra no quadro selecionado, ou no primeiro quadro vazio da lâmina. As fotos já usadas ficam com uma marca verde.',
  },
  {
    p: 'Dá para mudar o recorte de uma foto?',
    r: 'Sim. Selecione a foto na página e use o painel da direita: Preencher, Encaixar, Girar e Espelhar, mais os campos de zoom e rotação. Arrastar a foto move o recorte dentro do quadro.',
  },
  {
    p: 'O que são a linha laranja e a área mais clara na borda?',
    r: 'É a margem de corte. A parte clareada fica fora da página depois que o papel é aparado — evite deixar rosto ou texto ali.',
  },
  {
    p: 'Como encontro as fotos de uma pessoa específica?',
    r: 'Na galeria e no painel de fotos há "Pessoas nesta galeria": cada bolinha é um rosto reconhecido. Tocar numa delas mostra só as fotos em que a pessoa aparece.',
  },
  {
    p: 'Posso desfazer?',
    r: 'Sim, com Ctrl+Z (ou ⌘Z no Mac), e Ctrl+Shift+Z para refazer. Os botões de desfazer e refazer também ficam no alto da tela.',
  },
  {
    p: 'Como troco a ordem das páginas?',
    r: 'Na tira de miniaturas embaixo, arraste a lâmina para a posição que quiser. A capa fica sempre em primeiro.',
  },
  {
    p: 'Como vejo o álbum como vai ficar?',
    r: 'O botão "Prévia" abre o álbum sem as marcas do editor, com controles para passar as páginas e reproduzir sozinho.',
  },
  {
    p: 'Quanto vai custar?',
    r: 'O valor aparece no editor e muda conforme você adiciona páginas e fotos além do que o modelo inclui. Quem define os preços é a loja.',
  },
  {
    p: 'Errei e apaguei uma foto da página. E agora?',
    r: 'A foto continua na galeria — apagar do quadro não apaga do acervo. É só clicar nela de novo.',
  },
];

export default function PainelAjuda({
  loja,
  email,
  telefone,
}: {
  loja: string;
  email?: string | null;
  telefone?: string | null;
}) {
  const [aberta, setAberta] = useState<number | null>(0);
  const [busca, setBusca] = useState('');

  const filtradas = DUVIDAS.filter(
    (d) =>
      !busca.trim() ||
      (d.p + String(d.r)).toLowerCase().includes(busca.toLowerCase().trim()),
  );

  return (
    <div className="mx-auto flex max-w-[820px] flex-col gap-5">
      <div>
        <h1 className="m-0 text-[26px] font-extrabold tracking-[-.9px]">Ajuda</h1>
        <p className="m-0 mt-1.5 text-[13.5px] text-muted">
          Como montar seu álbum na {loja}, do começo ao fim.
        </p>
      </div>

      <section className="rounded-[18px] border border-line bg-surface p-6">
        <p className="m-0 mb-4 text-[15px] font-bold">Como funciona</p>
        <ol className="m-0 flex list-none flex-col gap-3 p-0">
          {PASSOS.map(([t, d], i) => (
            <li key={t} className="flex gap-3">
              <span className="flex h-7 w-7 flex-none items-center justify-center rounded-full bg-blue-soft text-[12.5px] font-bold text-blue">
                {i + 1}
              </span>
              <span>
                <span className="block text-[13.5px] font-bold">{t.replace(/^\d\.\s*/, '')}</span>
                <span className="block text-[12.5px] leading-[1.55] text-muted">{d}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      <div>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar na ajuda"
          className="h-12 w-full rounded-[16px] border border-line bg-surface px-4 text-[14px] outline-none focus:border-blue"
        />
      </div>

      <section className="flex flex-col gap-2">
        {filtradas.length === 0 && (
          <p className="m-0 rounded-[18px] border border-line bg-surface px-6 py-8 text-center text-[13.5px] text-muted">
            Nada encontrado para “{busca}”. Fale com a loja que a gente resolve.
          </p>
        )}
        {filtradas.map((d) => {
          const i = DUVIDAS.indexOf(d);
          const on = aberta === i;
          return (
            <div key={d.p} className="overflow-hidden rounded-[16px] border border-line bg-surface">
              <button
                onClick={() => setAberta(on ? null : i)}
                aria-expanded={on}
                className="flex w-full items-center gap-3 px-5 py-4 text-left"
              >
                <span className="flex-1 text-[14px] font-semibold">{d.p}</span>
                <span className={`text-muted-2 transition-transform ${on ? 'rotate-180' : ''}`}>
                  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </button>
              {on && (
                <p className="m-0 border-t border-line-2 px-5 py-4 text-[13px] leading-[1.65] text-ink-3">
                  {d.r}
                </p>
              )}
            </div>
          );
        })}
      </section>

      <section className="rounded-[18px] border border-line bg-[linear-gradient(160deg,#F1F5FD,#E4F8FC)] p-6">
        <p className="m-0 text-[15px] font-bold">Não achou o que precisava?</p>
        <p className="m-0 mt-1 text-[12.5px] leading-[1.55] text-muted">
          Quem cuida do seu álbum é a {loja}. Fale com eles — respondem melhor que qualquer manual.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/meus-projetos"
            className="flex h-11 items-center rounded-[14px] bg-lente px-5 text-[13.5px] font-bold text-white shadow-card hover:brightness-[1.06]"
          >
            Voltar aos meus álbuns
          </Link>
          {email && (
            <a
              href={`mailto:${email}`}
              className="flex h-11 items-center rounded-[14px] border border-line bg-surface px-5 text-[13.5px] font-semibold text-ink-3 hover:border-[#D6E2FC] hover:text-blue"
            >
              Escrever para a loja
            </a>
          )}
          {telefone && (
            <a
              href={`https://wa.me/${telefone.replace(/\D/g, '')}`}
              className="flex h-11 items-center rounded-[14px] border border-line bg-surface px-5 text-[13.5px] font-semibold text-ink-3 hover:border-[#D6E2FC] hover:text-blue"
            >
              Falar no WhatsApp
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
