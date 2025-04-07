/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{html,js,jsx}',
    './index.html'
  ],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/container-queries")],
  // corePlugins: false,
}

