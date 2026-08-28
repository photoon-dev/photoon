/**
 * Aparência física do álbum aberto.
 *
 * O canvas era um retângulo branco com uma linha no meio: lia-se como um
 * formulário, não como um livro impresso. Aqui está o que separa um do outro,
 * na ordem em que o olho percebe:
 *
 *   1. capa rígida sobrando pouco além do miolo (a "canaleta");
 *   2. espessura do miolo nas bordas externas — as folhas empilhadas;
 *   3. sombra da dobra, simétrica e curta, no vinco central;
 *   4. curvatura: cada página é um plano inclinado em 3D, então a FOTO
 *      inclina junto. É o que faz o papel parecer papel;
 *   5. queda de luz da borda externa para o vinco, acompanhando a curva.
 *
 * O ponto 4 é o que dá o efeito da referência: não é uma sombra desenhada por
 * cima, é a foto de fato deformada pela perspectiva.
 */

/** Quanto a capa sobra além do miolo, em % da página. */
const CANALETA = 1.8;
/** Inclinação de cada página, em graus. Acima de ~4 vira leque. */
const CURVA = 2.4;
/** Distância do observador. Menor = curvatura mais forte. */
const PERSPECTIVA = 2600;

export type Papel = {
  /** Cor do papel. Marfim lê melhor que branco puro sob luz quente. */
  fundo: string;
  /** Cor da capa dura. */
  capa: string;
};

export const PAPEL_PADRAO: Papel = { fundo: '#FCFAF5', capa: '#1B2A4A' };

/** O palco: recorta e dá profundidade. Sem `overflow`, o zoom vaza. */
export function estiloPalco(): React.CSSProperties {
  return {
    flex: '1 1 auto',
    minWidth: 0,
    minHeight: 150,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // O zoom antigo crescia o livro por `max-height`/`max-width` contra um
    // palco sem recorte: passando de certo ponto o livro saía da área e
    // empurrava o resto da tela.
    overflow: 'hidden',
    perspective: `${PERSPECTIVA}px`,
    perspectiveOrigin: '50% 50%',
  };
}

/**
 * O livro. O zoom vira `scale`, não medida — assim a proporção nunca muda e
 * nada pode transbordar do palco recortado.
 */
export function estiloLivro(zoom: number, papel: Papel = PAPEL_PADRAO): React.CSSProperties {
  return {
    position: 'relative',
    width: '92%',
    aspectRatio: '2.04 / 1',
    transform: `scale(${(zoom / 64).toFixed(3)})`,
    transformOrigin: 'center center',
    transition: 'transform .18s ease-out',
    transformStyle: 'preserve-3d',
    background: papel.capa,
    // A capa dura sobra além do miolo dos quatro lados.
    padding: `${CANALETA}% ${CANALETA}%`,
    borderRadius: '3px 6px 6px 3px',
    boxShadow:
      '0 30px 60px -18px rgba(18,28,48,.42), 0 8px 18px -8px rgba(18,28,48,.28), inset 0 0 0 1px rgba(255,255,255,.06)',
  };
}

/**
 * Uma página. `lado` decide para onde ela se inclina: as duas caem em direção
 * ao vinco, como um livro aberto sobre a mesa.
 */
export function estiloPagina(lado: 'esquerda' | 'direita', papel: Papel = PAPEL_PADRAO): React.CSSProperties {
  const esq = lado === 'esquerda';
  return {
    position: 'relative',
    width: '50%',
    height: '100%',
    background: papel.fundo,
    overflow: 'hidden',
    // A inclinação é o efeito: a página é um plano em 3D, então tudo que está
    // dentro dela — inclusive a foto — inclina junto.
    transform: `rotateY(${esq ? CURVA : -CURVA}deg)`,
    transformOrigin: esq ? 'right center' : 'left center',
    borderRadius: esq ? '2px 0 0 2px' : '0 2px 2px 0',
  };
}

/**
 * Camada sobre a página com a luz e a sombra do vinco.
 *
 * Fica ACIMA das fotos de propósito: no livro real a dobra escurece a foto,
 * não passa por trás dela.
 */
export function estiloLuz(lado: 'esquerda' | 'direita'): React.CSSProperties {
  const esq = lado === 'esquerda';
  const paraOVinco = esq ? 'to right' : 'to left';
  return {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    background: [
      // sombra da dobra: curta e forte junto ao vinco
      `linear-gradient(${paraOVinco}, rgba(28,22,14,0) 78%, rgba(28,22,14,.10) 92%, rgba(28,22,14,.30) 100%)`,
      // queda de luz acompanhando a curvatura da folha
      `linear-gradient(${paraOVinco}, rgba(255,250,235,.16) 0%, rgba(255,250,235,0) 46%)`,
      // vinheta suave nas bordas externas
      `radial-gradient(120% 100% at ${esq ? '0% 50%' : '100% 50%'}, rgba(255,252,244,.14), transparent 60%)`,
    ].join(','),
    mixBlendMode: 'multiply',
  };
}

/**
 * Espessura do miolo na borda externa: as folhas empilhadas que se veem de
 * lado. É um detalhe pequeno e é o que mais denuncia a falsificação quando
 * falta.
 */
export function estiloMiolo(lado: 'esquerda' | 'direita'): React.CSSProperties {
  const esq = lado === 'esquerda';
  return {
    position: 'absolute',
    top: '1.5%',
    bottom: '1.5%',
    [esq ? 'left' : 'right']: '-0.9%',
    width: '0.9%',
    pointerEvents: 'none',
    background: `repeating-linear-gradient(${esq ? 'to left' : 'to right'},
      #F4EFE4 0px, #F4EFE4 1px, #D9D0BE 1px, #D9D0BE 2px)`,
    borderRadius: esq ? '3px 0 0 3px' : '0 3px 3px 0',
    boxShadow: `inset ${esq ? '' : '-'}2px 0 4px rgba(60,48,30,.22)`,
  } as React.CSSProperties;
}

/** O vinco central: a linha onde as duas páginas se encontram. */
export function estiloVinco(): React.CSSProperties {
  return {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: '2.4%',
    transform: 'translateX(-50%)',
    pointerEvents: 'none',
    zIndex: 6,
    background:
      'linear-gradient(to right, rgba(30,22,10,0) 0%, rgba(30,22,10,.22) 38%, rgba(40,30,16,.34) 50%, rgba(30,22,10,.22) 62%, rgba(30,22,10,0) 100%)',
  };
}

/**
 * A folha que vira.
 *
 * O bug da "tela azul": as duas faces usavam `backface-visibility:hidden`, de
 * modo que a 90° nenhuma delas era desenhada e via-se ATRAVÉS do livro — o
 * azul era o gradiente dos quadros vazios da página de baixo. Agora as faces
 * são opacas, a folha ganha fundo de papel e a sombra acompanha o giro.
 */
export function estiloFolhaVirando(sentido: 'next' | 'prev' | null): React.CSSProperties {
  if (!sentido) return { display: 'none' };
  const paraFrente = sentido === 'next';
  return {
    position: 'absolute',
    top: 0,
    bottom: 0,
    [paraFrente ? 'left' : 'right']: '50%',
    width: '50%',
    zIndex: 20,
    transformStyle: 'preserve-3d',
    transformOrigin: paraFrente ? 'left center' : 'right center',
    pointerEvents: 'none',
    animation: `${paraFrente ? 'flipNext' : 'flipPrev'} 880ms cubic-bezier(.56,.08,.18,.96) both`,
  } as React.CSSProperties;
}

export function estiloFaceFolha(
  face: 'frente' | 'verso',
  sentido: 'next' | 'prev' | null,
  papel: Papel = PAPEL_PADRAO,
): React.CSSProperties {
  const frente = face === 'frente';
  const paraFrente = sentido === 'next';
  return {
    position: 'absolute',
    inset: 0,
    overflow: 'hidden',
    // Opaca: é o que impede de enxergar através do livro no meio do giro.
    background: papel.fundo,
    backfaceVisibility: 'hidden',
    transform: frente ? undefined : `rotateY(${paraFrente ? 180 : -180}deg)`,
    boxShadow: frente
      ? `${paraFrente ? '-' : ''}12px 0 28px rgba(30,22,10,.16)`
      : `${paraFrente ? '' : '-'}12px 0 28px rgba(30,22,10,.16)`,
  };
}

/** Limites do zoom, em %. */
export const ZOOM_MIN = 30;
export const ZOOM_MAX = 200;
export const ZOOM_PASSO = 12;
export const ZOOM_PADRAO = 64;

export const limitarZoom = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));
