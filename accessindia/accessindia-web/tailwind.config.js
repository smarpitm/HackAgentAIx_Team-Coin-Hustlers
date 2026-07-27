/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0f172a', // slate-900
        accent: {
          DEFAULT: '#f97316', // orange-500
          hover: '#ea580c',   // orange-600
          light: '#ffedd5',   // orange-100
        },
        card: '#1e293b',       // slate-800
        text: '#f4f4f5',       // zinc-100
        muted: '#9ca3af',      // gray-400
      },
    },
  },
  plugins: [],
}
