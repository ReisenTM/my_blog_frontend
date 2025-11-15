import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

const devTarget = process.env.VITE_DEV_API_TARGET ?? 'http://127.0.0.1:8083';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: devTarget,
        changeOrigin: true,
      },
    },
  },
});
