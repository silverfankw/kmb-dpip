import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from 'tailwindcss';

// https://vitejs.dev/config/
export default defineConfig({
  base: "/kmb-dpip/",
  plugins: [react(), tailwindcss()],
  server: {
    open: true
  }
})