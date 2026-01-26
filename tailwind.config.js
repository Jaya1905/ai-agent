/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
        brandBrown: '#2f1e14',
        brandGold: '#814c27',
        brandGoldHover: '#9b5b38',
        },
    },
    },
  plugins: [],
}