/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#F97316',
          light: '#FB923C',
          dark: '#EA6C0A',
        },
        bg: {
          primary: '#111827',
          secondary: '#111827',
        },
        surface: {
          DEFAULT: '#1F2937',
          raised: '#374151',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#9CA3AF',
          muted: '#6B7280',
        }
      },
    },
  },
  plugins: [],
}
