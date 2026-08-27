import type { Config } from 'tailwindcss';

// Tokens provisorios. Substituir pelos valores reais do Design System.dc.html
// quando o import do Claude Design estiver disponivel.
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'rgb(var(--ph-bg) / <alpha-value>)',
        surface: 'rgb(var(--ph-surface) / <alpha-value>)',
        border: 'rgb(var(--ph-border) / <alpha-value>)',
        fg: 'rgb(var(--ph-fg) / <alpha-value>)',
        muted: 'rgb(var(--ph-muted) / <alpha-value>)',
        brand: 'rgb(var(--ph-brand) / <alpha-value>)',
        'brand-fg': 'rgb(var(--ph-brand-fg) / <alpha-value>)',
      },
      borderRadius: { xl: '14px', '2xl': '20px' },
    },
  },
  plugins: [],
};
export default config;
