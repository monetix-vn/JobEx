// Folds the single-mode build (index.html + one JS file) into one self-contained HTML file.
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = resolve(import.meta.dirname, '..', 'dist-single');
const out = resolve(
  process.argv[2] ?? join(import.meta.dirname, '..', '..', '..', 'JobEx-play.html'),
);

const assets = join(dist, 'assets');
const jsFiles = readdirSync(assets).filter((f) => f.endsWith('.js'));
if (jsFiles.length !== 1)
  throw new Error(`expected one JS file in ${assets}, found ${jsFiles.length}`);
const js = readFileSync(join(assets, jsFiles[0]), 'utf8').replaceAll('</script', '<\/script');

const html = readFileSync(join(dist, 'index.html'), 'utf8');
const tag = /<script\b[^>]*\bsrc="[^"]*"[^>]*><\/script>\s*/;
if (!tag.test(html)) throw new Error('no external script tag found in index.html');
const stripped = html.replace(tag, '');
writeFileSync(
  out,
  stripped.replace('</body>', () => `<script>${js}</script>\n</body>`),
);
console.log(`wrote ${out}`);
