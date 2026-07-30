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
      // Expose the development app to devices on the same local network.
      // The API remains proxied locally to the backend, so students only need
      // the frontend LAN address.
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
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
