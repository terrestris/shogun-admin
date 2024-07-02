import federation from '@originjs/vite-plugin-federation';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { viteExternalsPlugin } from 'vite-plugin-externals';
import topLevelAwait from 'vite-plugin-top-level-await';

import config from './package.json';

const deps = config.dependencies;

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
    topLevelAwait({
      // The export name of top-level await promise for each chunk module
      promiseExportName: '__tla',
      // The function to generate import names of top-level await promise in each chunk module
      promiseImportName: i => `__tla_${i}`
    }),
    viteExternalsPlugin({
      shogunApplicationConfig: 'shogunApplicationConfig'
    }),
    federation({
      name: 'SHOGunAdminClient',
      remotes: {
        // The module federation is handled dynamically, see loadPlugins() in src/index.tsx
        // for the implementation.
        // Since vite requires at least a single entry in the remotes to not throw an error,
        // this is just a placholder entry.
        ignore: 'me.js'
      },
      shared: {
        react: {
          requiredVersion: deps.react
        },
        'react-dom': {
          requiredVersion: deps['react-dom']
        },
        'react-router-dom': {
          requiredVersion: deps['react-router-dom']
        },
        'react-i18next': {
          requiredVersion: deps['react-i18next']
        }
      }
    })
  ],
  server: {
    origin: '/admin',
    host: '0.0.0.0',
    port: 8080,
    strictPort: true
  },
  build: {
    modulePreload: false,
    // The remote style takes effect only when the build.target option in the
    // vite.config.ts file is higher than that of "es2020".
    target: 'esnext',
    cssCodeSplit: false,
    outDir: 'dist/build',
    rollupOptions: {
      external: 'shogunApplicationConfig'
    }
  }
});
