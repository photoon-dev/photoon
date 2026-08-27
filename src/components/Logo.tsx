/**
 * Marca Photoon — a lente dupla de `logo.svg` do projeto de design.
 *
 * Os dois O formam a lente. O segundo recebe o ponto de brilho em ciano,
 * nunca o primeiro e nunca os dois (Design System, seção 01).
 *
 * `tom="claro"` inverte os traços para fundos escuros.
 */
export default function Logo({
  width = 44,
  tom = 'escuro',
  id = 'logo',
}: {
  width?: number;
  tom?: 'escuro' | 'claro';
  id?: string;
}) {
  const traco = tom === 'claro' ? '#FFFFFF' : '#0B1220';

  return (
    <svg
      viewBox="0 0 124 72"
      width={width}
      height={(width * 72) / 124}
      role="img"
      aria-label="Photoon"
    >
      <defs>
        <linearGradient id={`lente-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2563EB" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
      </defs>
      <circle cx="34" cy="36" r="26" fill="none" stroke={traco} strokeWidth="7" />
      <circle cx="34" cy="36" r="11" fill={traco} />
      <circle cx="90" cy="36" r="26" fill="none" stroke={traco} strokeWidth="7" />
      <circle cx="90" cy="36" r="11" fill={`url(#lente-${id})`} />
      <circle cx="98" cy="19" r="5.5" fill="#06B6D4" />
    </svg>
  );
}

/** Logo com o nome ao lado, como no lockup. */
export function LogoLockup({
  width = 40,
  tom = 'escuro',
  id = 'lockup',
  legenda,
}: {
  width?: number;
  tom?: 'escuro' | 'claro';
  id?: string;
  legenda?: string;
}) {
  return (
    <span className="flex items-center gap-2.5">
      <Logo width={width} tom={tom} id={id} />
      <span className="leading-tight">
        <span
          className={`block text-[17px] font-extrabold tracking-[.5px] ${
            tom === 'claro' ? 'text-white' : 'text-ink'
          }`}
        >
          PHOTOON
        </span>
        {legenda && (
          <span
            className={`block text-[11.5px] ${tom === 'claro' ? 'text-white/60' : 'text-muted-2'}`}
          >
            {legenda}
          </span>
        )}
      </span>
    </span>
  );
}
