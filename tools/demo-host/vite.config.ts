import { defineConfig } from 'vite';

// One config for dev and both builds. `vite build` gives the normal multi-file site;
// `vite build --mode single` gives one classic script that scripts/inline.mjs folds into a
// single HTML file that opens straight from disk (file:// blocks module scripts).
export default defineConfig(({ mode }) => ({
  root: import.meta.dirname,
  build: {
    outDir: mode === 'single' ? 'dist-single' : 'dist',
    emptyOutDir: true,
    target: 'es2022',
    ...(mode === 'single'
      ? {
          modulePreload: false,
          rollupOptions: { output: { format: 'iife', inlineDynamicImports: true } },
        }
      : {}),
  },
}));
