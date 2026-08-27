import type { Config } from 'tailwindcss';

/**
 * Tokens extraidos de `Design System.dc.html`.
 * Azul profundo como base, azul eletrico e ciano como energia.
 * Cor tem funcao: azul = acao, ciano = dados, verde = feito,
 * ambar = atencao, coral = risco.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B1220',        // texto e base
        'ink-2': '#34405A',
        'ink-3': '#46536A',    // rotulos
        muted: '#6B7A90',      // texto secundario
        'muted-2': '#9AA7BC',  // placeholder / terciario
        line: '#E6EAF2',       // bordas
        'line-2': '#F0F3F9',
        page: '#F4F7FC',       // fundo frio
        surface: '#FFFFFF',
        'surface-2': '#F8FAFE',
        blue: '#2563EB',       // acao primaria
        'blue-hover': '#1D4FD7',
        'blue-soft': '#F1F5FD',
        'blue-surface': '#EAF0FF',
        cyan: '#06B6D4',       // energia e dados
        'cyan-surface': '#E4F8FC',
        green: '#10B981',
        'green-surface': '#E6F8F1',
        amber: '#F59E0B',
        'amber-surface': '#FEF3E2',
        coral: '#F43F5E',
        'coral-surface': '#FFF1F3',
        'indigo-surface': '#EDEBFE',
      },
      borderRadius: {
        chip: '10px',
        control: '14px',
        field: '16px',
        card: '24px',
        hero: '30px',
      },
      backgroundImage: {
        // gradiente lente: CTA e estado ativo
        lente: 'linear-gradient(135deg,#2563EB,#06B6D4)',
      },
      boxShadow: {
        cta: '0 10px 24px rgba(37,99,235,.28)',
        card: '0 8px 18px rgba(37,99,235,.24)',
        modal: '0 30px 70px rgba(11,18,32,.3)',
      },
      keyframes: {
        riseIn: {
          from: { transform: 'translateY(12px)', opacity: '0' },
          to: { transform: 'none', opacity: '1' },
        },
      },
      animation: { riseIn: 'riseIn .5s cubic-bezier(.2,.8,.2,1) both' },
    },
  },
  plugins: [],
};
export default config;
