/** Icones do design (stroke 1.9, linecap/linejoin round). */
type P = { size?: number; className?: string };

const base = (size: number) => ({
  viewBox: '0 0 24 24',
  width: size,
  height: size,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
});

export const IconSparkle = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M5 19 19 5M15 5h4v4" />
    <path d="M7 4v4M5 6h4M17 15v4M15 17h4" />
  </svg>
);

export const IconFoto = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="4" width="18" height="16" rx="4" />
    <path d="m3.5 16 4.6-4.2 4 3.4 3.4-3 5 4.4" />
    <circle cx="8.6" cy="8.8" r="1.5" />
  </svg>
);

export const IconCheck = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M5 12.5 10 17.5 19 7" />
  </svg>
);

export const IconEmail = ({ size = 17, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="2.5" y="5" width="19" height="14" rx="3.5" />
    <path d="m3.5 7.5 8.5 6 8.5-6" />
  </svg>
);

export const IconCadeado = ({ size = 17, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="5" y="10.5" width="14" height="9" rx="2.5" />
    <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
  </svg>
);

export const IconSeta = ({ size = 17, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M5 12h13M12 5l7 7-7 7" />
  </svg>
);

export const IconBalao = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 5h16v10H9l-5 4z" />
  </svg>
);

export const IconFechar = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className} strokeWidth={2}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

export const IconInfo = ({ size = 17, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M9.8 9.6a2.3 2.3 0 1 1 3 2.2v1.4M12 16.6h.01" />
  </svg>
);

export const IconTique = ({ size = 12, className }: P) => (
  <svg {...base(size)} className={className} strokeWidth={3.4}>
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export const IconGrade = ({ size = 26, className }: P) => (
  <svg {...base(size)} className={className} strokeWidth={1.8}>
    <rect x="3" y="3" width="7.5" height="7.5" rx="2.4" />
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="2.4" />
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="2.4" />
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.4" />
  </svg>
);

export const IconGaleria = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="3" y="5" width="18" height="14" rx="3.5" />
    <path d="M7 5V3M17 5V3" />
    <circle cx="9" cy="11" r="1.6" />
    <path d="m4 18 5-4.4 3.4 3 3-2.6L20 18" />
  </svg>
);

export const IconLapis = ({ size = 26, className }: P) => (
  <svg {...base(size)} className={className} strokeWidth={1.8}>
    <path d="M5 19h3l9.5-9.5a2.1 2.1 0 0 0-3-3L5 16z" />
  </svg>
);

export const IconSino = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M18 15.5V11a6 6 0 1 0-12 0v4.5L4.5 18h15z" />
    <path d="M10 20.5a2.2 2.2 0 0 0 4 0" />
  </svg>
);

export const IconChevron = ({ size = 15, className }: P) => (
  <svg {...base(size)} className={className} strokeWidth={2}>
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export const IconSair = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M15 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v2M10 12h11M18 9l3 3-3 3" />
  </svg>
);

export const IconUsuario = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="8" r="3.4" />
    <path d="M5 20c.8-3.6 3.6-5.6 7-5.6s6.2 2 7 5.6" />
  </svg>
);

export const IconBusca = ({ size = 17, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
);

export const IconFiltro = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M4 6h16M7 12h10M10 18h4" />
  </svg>
);

export const IconOlho = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className} strokeWidth={1.8}>
    <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="2.8" />
  </svg>
);

export const IconAlerta = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className} strokeWidth={1.8}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 8v5M12 16.5h.01" />
  </svg>
);

export const IconRelogio = ({ size = 18, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5v5l3 2" />
  </svg>
);

export const IconMais = ({ size = 17, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const IconTresPontos = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className} strokeWidth={1.8}>
    <circle cx="12" cy="6" r="1.4" />
    <circle cx="12" cy="12" r="1.4" />
    <circle cx="12" cy="18" r="1.4" />
  </svg>
);

export const IconCompartilhar = ({ size = 16, className }: P) => (
  <svg {...base(size)} className={className} strokeWidth={1.8}>
    <circle cx="17.5" cy="6" r="2.6" />
    <circle cx="6.5" cy="12" r="2.6" />
    <circle cx="17.5" cy="18" r="2.6" />
    <path d="m8.9 10.7 6.2-3.4M8.9 13.3l6.2 3.4" />
  </svg>
);
