import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'dev',
  build: {
      lib: {
        entry: path.resolve(__dirname, 'src/index.js'),
        name: 'grammix',
        formats: ['es'],
        fileName: () => 'grammix.mjs',
      },
    outDir: path.resolve(__dirname, 'preview'),
    minify: true,
    target: 'esnext',
    emptyOutDir: false
  }
});