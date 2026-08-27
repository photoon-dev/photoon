/** Marca Photoon: lente com raios, mascarada sobre o gradiente azul→ciano. */
export default function MarcaPhotoon({ size = 36, id = 'ph' }: { size?: number; id?: string }) {
  const raios = [
    [33.6, 20],
    [26.8, 31.7779],
    [13.2, 31.7779],
    [6.4, 20],
    [13.2, 8.2221],
    [26.8, 8.2221],
  ] as const;
  const furos = [
    [25.889, 23.4],
    [20, 26.8],
    [14.111, 23.4],
    [14.111, 16.6],
    [20, 13.2],
    [25.889, 16.6],
  ] as const;

  return (
    <svg viewBox="0 0 40 40" width={size} height={size} role="img" aria-label="Photoon">
      <defs>
        <linearGradient id={`grad-${id}`} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2563EB" />
          <stop offset="1" stopColor="#06B6D4" />
        </linearGradient>
        <mask id={`mask-${id}`}>
          <rect width="40" height="40" fill="black" />
          <g fill="white" stroke="white">
            <circle cx="20" cy="20" r="6.2" />
            {raios.map(([x, y]) => (
              <g key={`${x}-${y}`}>
                <line x1="20" y1="20" x2={x} y2={y} strokeWidth="3.6" strokeLinecap="round" />
                <circle cx={x} cy={y} r="4.6" stroke="none" />
              </g>
            ))}
          </g>
          <g fill="black">
            {furos.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="2.2" />
            ))}
          </g>
          <path
            d="M16.43 18.7A3.8 3.8 0 0 1 21.3 16.43"
            fill="none"
            stroke="black"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </mask>
      </defs>
      <rect width="40" height="40" fill={`url(#grad-${id})`} mask={`url(#mask-${id})`} />
    </svg>
  );
}
