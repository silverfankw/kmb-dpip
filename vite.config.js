import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite';
import svgr from "vite-plugin-svgr";


// https://vitejs.dev/config/
export default defineConfig({
  base: "/kmb-dpip/",
  plugins: [react(), tailwindcss(), svgr()],
  server: {
    open: true
  }
})
