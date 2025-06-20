import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite';
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/kmb-dpip/",
  plugins: [
    react(
      {
        babel: {
          plugins: [],
          babelrc: true, // Use .babelrc.js for configuration
        },
      }
    ),
    tailwindcss(),
    svgr()],
  server: {
    open: true
  }
})
