'use client';

import { useState } from 'react';
import AjudaDesign, { CSS_PSEUDO } from '@/components/design/AjudaDesign';
import MenuCliente from '@/components/cliente/MenuCliente';
import { useCascaCliente, type LojaDaCasca } from '@/components/cliente/useCascaCliente';
import type { Notificacao } from '@/lib/data';

/**
 * Central de ajuda do cliente com o layout do design.
 *
 * A tela não veio no zip — `Cliente Ajuda.dc.html` é referenciado pelas outras
 * telas mas não estava no pacote. Foi escrita na mesma casca de
 * `Cliente Minha conta.dc.html` e vive no mesmo caminho das demais: o markup é
 * transliterado por `tools/dc2tsx.py`, e aqui só entra o dado.
 *
 * O conteúdo é o mesmo do painel anterior, escrito a partir do que o editor de
 * fato faz: cada resposta descreve um caminho que existe na tela. Onde algo
 * ainda não existe, a resposta diz isso em vez de prometer.
 */

const PASSOS: [string, string][] = [
  ['A loja libera suas fotos', 'Você recebe o acesso por e-mail e as fotos aparecem na galeria.'],
  ['Você monta o álbum', 'Escolha as fotos, o layout de cada página, fundos, textos e elementos.'],
  ['Revisa e finaliza', 'O sistema avisa se alguma página está sem foto antes de enviar à loja.'],
  ['A loja produz', 'A partir daí é com o estúdio: impressão, acabamento e entrega.'],
];

const DUVIDAS: [string, string][] = [
  [
    'Preciso terminar o álbum de uma vez?',
    'Não. Tudo o que você faz é salvo sozinho, poucos segundos depois de cada mudança. Pode fechar a aba e voltar depois — o indicador no alto da tela mostra "Salvo agora" quando terminou de gravar.',
  ],
  [
    'Como coloco uma foto na página?',
    'Clique na foto no painel da esquerda: ela entra no quadro selecionado, ou no primeiro quadro vazio da lâmina. As fotos já usadas ficam com uma marca verde.',
  ],
  [
    'Dá para mudar o recorte de uma foto?',
    'Sim. Selecione a foto na página e use o painel da direita: Preencher, Encaixar, Girar e Espelhar, mais os campos de zoom e rotação. Arrastar a foto move o recorte dentro do quadro.',
  ],
  [
    'O que são a linha laranja e a área mais clara na borda?',
    'É a margem de corte. A parte clareada fica fora da página depois que o papel é aparado — evite deixar rosto ou texto ali.',
  ],
  [
    'Como encontro as fotos de uma pessoa específica?',
    'Na galeria e no painel de fotos há "Pessoas nesta galeria": cada bolinha é um rosto reconhecido. Tocar numa delas mostra só as fotos em que a pessoa aparece.',
  ],
  [
    'Posso desfazer?',
    'Sim, com Ctrl+Z (ou ⌘Z no Mac), e Ctrl+Shift+Z para refazer. Os botões de desfazer e refazer também ficam no alto da tela.',
  ],
  [
    'Como troco a ordem das páginas?',
    'Na tira de miniaturas embaixo, arraste a lâmina para a posição que quiser. A capa fica sempre em primeiro.',
  ],
  [
    'Como vejo o álbum como vai ficar?',
    'O botão "Prévia" abre o álbum sem as marcas do editor, com controles para passar as páginas e reproduzir sozinho.',
  ],
  [
    'Quanto vai custar?',
    'O valor aparece no editor e muda conforme você adiciona páginas e fotos além do que o modelo inclui. Quem define os preços é a loja.',
  ],
  [
    'Errei e apaguei uma foto da página. E agora?',
    'A foto continua na galeria — apagar do quadro não apaga do acervo. É só clicar nela de novo.',
  ],
];

const BOTAO_CLARO =
  'height:46px;padding:0 20px;display:flex;align-items:center;gap:9px;border:1px solid #E6EAF2;' +
  'border-radius:12px;background:#FFFFFF;color:#0B1220;font-size:14px;font-weight:600';

export default function AjudaDoDesign({
  dono,
  loja,
  notificacoes,
}: {
  dono: { nome: string; email: string; sub: string };
  loja: LojaDaCasca;
  notificacoes: Notificacao[];
}) {
  const casca = useCascaCliente({ dono, loja, notificacoes });
  const [busca, setBusca] = useState('');
  const [aberta, setAberta] = useState<number | null>(0);

  const termo = busca.trim().toLowerCase();
  const achadas = DUVIDAS.map((d, i) => ({ d, i })).filter(
    ({ d }) => !termo || (d[0] + d[1]).toLowerCase().includes(termo),
  );

  const telefone = (loja.telefone ?? '').replace(/\D/g, '');

  return (
    <div className="om-cliente">
      <style dangerouslySetInnerHTML={{ __html: CSS_PSEUDO }} />
      <AjudaDesign
        v={{
          ...casca,

          subtitulo: `Como montar seu álbum na ${loja.nome}, do começo ao fim.`,

          busca,
          buscar: (e: React.ChangeEvent<HTMLInputElement>) => setBusca(e.target.value),
          contagem:
            achadas.length === DUVIDAS.length
              ? `${DUVIDAS.length} dúvidas`
              : `${achadas.length} de ${DUVIDAS.length}`,

          passos: PASSOS.map(([titulo, texto], i) => ({ n: String(i + 1), titulo, texto })),

          duvidas: achadas.map(({ d, i }) => {
            const on = aberta === i;
            return {
              pergunta: d[0],
              resposta: d[1],
              cartao: `overflow:hidden;border-radius:14px;border:1px solid ${on ? '#D6E2FC' : '#E6EAF2'};background:#FFFFFF`,
              seta:
                'display:flex;color:#9AA7BC;flex:0 0 auto;transition:transform .2s ease;' +
                `transform:rotate(${on ? 180 : 0}deg)`,
              respostaEstilo: on
                ? 'margin:0;padding:16px 20px 18px;border-top:1px solid #F0F3F9;font-size:13.5px;line-height:1.7;color:#46536A'
                : 'display:none',
              alternar: () => setAberta((a) => (a === i ? null : i)),
            };
          }),

          vazioEstilo: achadas.length
            ? 'display:none'
            : 'margin:0;padding:34px;text-align:center;font-size:13.5px;color:#9AA7BC;' +
              'border:1px solid #E6EAF2;border-radius:14px;background:#FFFFFF',
          vazioTexto: `Nada encontrado para “${busca.trim()}”. Fale com a loja que a gente resolve.`,

          recado:
            `Quem cuida do seu álbum é a ${loja.nome}. Fale com eles — respondem melhor que ` +
            'qualquer manual.',
          // Sem contato cadastrado o botão some: um "mailto:" vazio abre o
          // programa de e-mail sem destinatário, o que é pior que não ter botão.
          hrefEmail: loja.email ? `mailto:${loja.email}` : '#',
          estiloEmail: loja.email ? BOTAO_CLARO : 'display:none',
          hrefWhatsapp: telefone ? `https://wa.me/${telefone}` : '#',
          estiloWhatsapp: telefone ? BOTAO_CLARO : 'display:none',
        }}
      />
      <MenuCliente />
    </div>
  );
}
