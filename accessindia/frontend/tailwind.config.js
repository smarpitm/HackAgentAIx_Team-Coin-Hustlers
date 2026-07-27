/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f97316', // orange-500
          dark: '#ea580c', // orange-600
          light: '#fb923c', // orange-400
        },
        background: {
          DEFAULT: '#0f172a', // slate-900
          lighter: '#1e293b', // slate-800
          card: '#334155', // slate-700
        },
        text: {
          DEFAULT: '#f4f4f5', // zinc-100
          muted: '#a1a1aa', // zinc-400
        }
      }
    },
  },
  plugins: [],
}
