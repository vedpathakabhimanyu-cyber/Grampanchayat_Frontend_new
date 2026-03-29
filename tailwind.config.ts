import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F6FAFD',   // Very light blue/white
          100: '#E8F2F9',
          200: '#B3CFE5',  // Light blue
          300: '#8DB8D9',
          400: '#6FA1CC',
          500: '#4A7FA7',  // Medium blue
          600: '#3A6685',
          700: '#2A5068',
          800: '#1A3D63',  // Deep blue
          900: '#0A1931',  // Dark navy
        },
        government: {
          orange: '#FF9933',
          green: '#138808',
          blue: '#1A3D63',
        },
        navy: {
          darkest: '#0A1931',
          deep: '#1A3D63',
          medium: '#4A7FA7',
          light: '#B3CFE5',
          lightest: '#F6FAFD',
        }
      },
      fontSize: {
        'xs': 'var(--font-size-small)',
        'sm': 'var(--font-size-small)',
        'base': 'var(--font-size-base)',
        'lg': 'var(--font-size-h4)',
        'xl': 'var(--font-size-h3)',
        '2xl': 'var(--font-size-h2)',
        '3xl': 'var(--font-size-h1)',
        'h1': 'var(--font-size-h1)',
        'h2': 'var(--font-size-h2)',
        'h3': 'var(--font-size-h3)',
        'h4': 'var(--font-size-h4)',
      },
      lineHeight: {
        'body': 'var(--line-height-body)',
        'heading': 'var(--line-height-heading)',
      }
    },
  },
  plugins: [],
};
export default config;
