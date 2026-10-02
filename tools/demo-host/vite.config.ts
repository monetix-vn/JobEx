import { execSync } from 'node:child_process';
import { defineConfig } from 'vite';

/** What the page shows so the player can tell which version they are running. */
function buildInfo(): { commit: string; date: string } {
  let commit = 'unknown';
  try {
    commit = execSync('git rev-parse --short HEAD', { cwd: import.meta.dirname })
      .toString()
      .trim();
  } catch {
    /* not a git checkout */
  }
  return { commit, date: new Date().toISOString().slice(0, 16).replace('T', ' ') };
}

// One config for dev and both builds. `vite build` gives the normal multi-file site;
// `vite build --mode single` gives one classic script that scripts/inline.mjs folds into a
// single HTML file that opens straight from disk (file:// blocks module scripts).
export default defineConfig(({ mode }) => ({
  root: import.meta.dirname,
  define: { __BUILD_INFO__: JSON.stringify(buildInfo()) },
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
