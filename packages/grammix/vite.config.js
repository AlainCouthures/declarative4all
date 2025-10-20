import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

const primaryOutDir = path.resolve(__dirname, 'bin');
const secondaryOutDir = path.resolve(__dirname, 'demo');
const thirdOutDir = path.resolve(__dirname, 'examples');

function copyBuiltFilePlugin({ srcDir, destDir, fileName }) {
  return {
    name: 'copy-built-file-plugin',
    apply: 'build',
    async closeBundle() {
      const fsp = fs.promises;
      const srcFile = path.join(srcDir, fileName);
      const destFile = path.join(destDir, fileName);
      try {
        await fsp.copyFile(srcFile, destFile);
        console.log(`Copied ${srcFile} -> ${destFile}`);
      } catch (err) {
        if (this && typeof this.warn === 'function') this.warn(`copy-built-file-plugin: failed to copy ${srcFile} to ${destFile}: ${err}`);
        else console.warn(`copy-built-file-plugin: failed to copy ${srcFile} to ${destFile}: ${err}`);
      }
    },
  };
}

export default defineConfig({
  root: 'dev',
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'grammix',
      formats: ['es'],
      fileName: () => 'grammix.mjs',
    },
    outDir: primaryOutDir,
    minify: true,
    target: 'esnext',
    emptyOutDir: false,
  },
  plugins: [
    copyBuiltFilePlugin({ srcDir: primaryOutDir, destDir: secondaryOutDir, fileName: 'grammix.mjs' }),
    copyBuiltFilePlugin({ srcDir: primaryOutDir, destDir: thirdOutDir, fileName: 'grammix.mjs' }),],
});