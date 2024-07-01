import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteExternalsPlugin } from 'vite-plugin-externals';

import theme from './theme';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/admin',
  css: {
    preprocessorOptions: {
      less: {
        math: 'always',
        relativeUrls: true,
        javascriptEnabled: true,
        modifyVars: theme
      },
    },
  },
  define: {
    PROJECT_VERSION: JSON.stringify(process.env.npm_package_version)
  },
  plugins: [
    react(),
    viteExternalsPlugin({
      shogunApplicationConfig: 'shogunApplicationConfig'
    })
  ],
  server: {
    host: '0.0.0.0',
    port: 8080,
    strictPort: true
  },
  build: {
    rollupOptions: {
      external: 'shogunApplicationConfig'
    }
  }
});
