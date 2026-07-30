import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react({
        include: '**/*.{jsx,js}'
      })
    ],
    server: {
      port: 5173,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_TARGET || 'http://localhost:3000',
          changeOrigin: true
        }
      }
    }
  };
});
