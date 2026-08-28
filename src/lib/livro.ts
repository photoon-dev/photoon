/**
 * Realismo do álbum aberto — o que falta ao desenho do design.
 *
 * O design já entrega a capa dura, a espessura do miolo, o vinco e o papel.
 * O que não entrega, e é justamente o que denuncia a falsificação, é que a
 * PÁGINA é plana: as fotos ficam num plano reto por cima de um papel que
 * finge estar curvado (o `skewY(-.25deg)` age só na camada de papel).
 *
 * Aqui está o que soma:
 *   1. a página vira um plano em 3D, inclinado para o vinco — a foto inclina
 *      junto, que é o efeito da referência;
 *   2. a queda de luz e a sombra da dobra passam POR CIMA da foto, como no
 *      livro real, onde a dobra escurece a imagem em vez de passar atrás.
 *
 * Nada aqui redesenha o que o design já fez.
 */

/** Inclinação de cada página, em graus. Acima de ~4 vira leque. */
const CURVA = 2.2;
/** Distância do observador. Menor = curvatura mais forte. */
const PERSPECTIVA = 2400;

/**
 * Plano em 3D da página. Aplicado à `<section>` de cada lado, arrasta as fotos
 * junto — é isto que faz o papel parecer papel.
 */
export function curvaturaPagina(lado: 'esquerda' | 'direita'): React.CSSProperties {
  const esq = lado === 'esquerda';
  return {
    perspective: `${PERSPECTIVA}px`,
    perspectiveOrigin: esq ? '100% 50%' : '0% 50%',
    transformStyle: 'preserve-3d',
    transform: `rotateY(${esq ? CURVA : -CURVA}deg)`,
    transformOrigin: esq ? 'right center' : 'left center',
  };
}

/**
 * Luz e sombra da dobra, acima das fotos.
 *
 * `multiply` para escurecer sem lavar a cor; a sombra é curta e forte junto ao
 * vinco, e a luz cai da borda externa para dentro.
 */
export function luzPagina(lado: 'esquerda' | 'direita'): React.CSSProperties {
  const esq = lado === 'esquerda';
  const aoVinco = esq ? 'to right' : 'to left';
  return {
    position: 'absolute',
    inset: 0,
    zIndex: 5,
    pointerEvents: 'none',
    mixBlendMode: 'multiply',
    background: [
      `linear-gradient(${aoVinco}, rgba(40,30,18,0) 76%, rgba(40,30,18,.09) 91%, rgba(40,30,18,.26) 100%)`,
      `radial-gradient(130% 105% at ${esq ? '2% 45%' : '98% 45%'}, rgba(255,248,232,.20), transparent 58%)`,
    ].join(','),
  };
}

/* ---------------------------------------------------------------------------
   Zoom

   O original crescia o livro por `max-height`/`max-width` calculados, contra um
   palco sem recorte: passando de certo ponto o livro ficava maior que a área e
   empurrava o resto da tela. Vira `scale`, que não altera o fluxo, num palco
   que recorta.
   --------------------------------------------------------------------------- */

export const ZOOM_MIN = 30;
export const ZOOM_MAX = 200;
export const ZOOM_PASSO = 12;
export const ZOOM_PADRAO = 64;

export const limitarZoom = (z: number) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, z));

export function estiloPalco(): React.CSSProperties {
  return {
    flex: '1 1 auto',
    minWidth: 0,
    minHeight: 150,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    perspective: '2200px',
  };
}

/**
 * Proporção de UMA página (a lâmina aberta é 2.04:1, dividida ao meio).
 *
 * O enquadramento da foto precisa disto: sem saber se a caixa é mais larga ou
 * mais alta que a foto, não dá para dimensionar a imagem preservando a
 * proporção — e o navegador acaba esticando a foto para caber.
 */
export const PAGINA_AR = 2.04 / 2;

export function estiloLivro(zoom: number): React.CSSProperties {
  return {
    position: 'relative',
    width: '86%',
    maxWidth: '900px',
    aspectRatio: '2.04 / 1',
    flex: 'none',
    transform: `scale(${(zoom / ZOOM_PADRAO).toFixed(3)})`,
    transformOrigin: 'center center',
    transition: 'transform .18s ease-out',
    filter: 'drop-shadow(0 24px 34px rgba(30,45,75,.18))',
  };
}

/**
 * Estilo completo de uma página: o papel do design mais a curvatura.
 *
 * A curvatura precisa ficar aqui, e não no contêiner dos quadros: lá dentro
 * ela criava um contexto de empilhamento que engolia o `z-index` das alças de
 * seleção, e nada no palco podia ser arrastado.
 */
export function estiloPagina(lado: 'esquerda' | 'direita'): string {
  const esq = lado === 'esquerda';
  const c = curvaturaPagina(lado);
  return [
    'position:relative',
    'overflow:hidden',
    // `container-type` faz `cqw` medir contra a PÁGINA. É o que permite o texto
    // ter o mesmo tamanho relativo na tela a 64% e no papel a 300 dpi.
    'container-type:inline-size',
    `border-radius:${esq ? '14px 2px 5px 10px' : '2px 14px 10px 5px'}`,
    'background:radial-gradient(circle at 50% 45%, rgba(0,0,0,.018), transparent 50%),' +
      `linear-gradient(${esq ? '90deg' : '270deg'},#FFFFFF,#FFFEFB)`,
    `box-shadow:inset ${esq ? '-18px' : '18px'} 0 26px -26px rgba(0,0,0,.9), inset 0 1px 0 rgba(255,255,255,.8)`,
    `perspective:${c.perspective}`,
    `perspective-origin:${c.perspectiveOrigin}`,
    'transform-style:preserve-3d',
    `transform:${c.transform}`,
    `transform-origin:${c.transformOrigin}`,
  ].join(';');
}
