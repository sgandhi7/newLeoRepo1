import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
//import EnvironmentPlugin from 'vite-plugin-environment';
import eslint from 'vite-plugin-eslint';
import tsconfigPaths from 'vite-tsconfig-paths';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const safeEnv: Record<string, string> = {};
for (const key in process.env) {
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) {
    safeEnv[key] = process.env[key] as string;
  }
}
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths(), eslint()],
  /*EnvironmentPlugin('all')],*/
  resolve: {
    alias: {
      '~uswds': path.resolve(__dirname, 'node_modules/@uswds/uswds'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ['node_modules/@uswds/uswds/packages'],
      },
    },
    postcss: {
      plugins: [autoprefixer],
    },
  },
  define: {
    'process.env': JSON.stringify(safeEnv),
  },
  server: {
    open: true,
    port: 8080,
    proxy: {
      '/api': {
        target: 'https://dvasquez-seattle-vcqoi.eastus.inference.ml.azure.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
