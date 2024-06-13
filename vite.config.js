import react from '@vitejs/plugin-react';
import { viteExternalsPlugin } from 'vite-plugin-externals';

import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteExternalsPlugin({
      shogunApplicationConfig: 'shogunApplicationConfig'
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 8080
  },
  build: {
    rollupOptions: {
      external: 'shogunApplicationConfig'
    }
  }
});
