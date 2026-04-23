import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Proxy API calls to Express — avoids CORS issues in dev
    proxy: {
      '/auth'           : 'http://localhost:5000',
      '/submissions'    : 'http://localhost:5000',
      '/analytics'      : 'http://localhost:5000',
      '/recommendations': 'http://localhost:5000',
    },
  },
});
