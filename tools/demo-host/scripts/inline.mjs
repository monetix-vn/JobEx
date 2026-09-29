/* global process, console */
// Folds the single-mode build (index.html + one JS file) into self-contained HTML files:
//   JobEx-play.html     opens in the player's last language, else the browser's
//   JobEx-play-vi.html  opens in Vietnamese
// Both work straight from disk (file:// blocks module scripts, so the script is inlined).
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = resolve(import.meta.dirname, '..', 'dist-single');
const outDir = resolve(process.argv[2] ?? join(import.meta.dirname, '..', '..', '..'));

const assets = join(dist, 'assets');
const jsFiles = readdirSync(assets).filter((f) => f.endsWith('.js'));
if (jsFiles.length !== 1) {
  throw new Error(`expected one JS file in ${assets}, found ${jsFiles.length}`);
}

// A literal closing script tag inside inline JS would end the element early.
const CLOSE = '</' + 'script';
const ESCAPED = '<' + String.fromCharCode(92) + '/script';
const js = readFileSync(join(assets, jsFiles[0]), 'utf8').split(CLOSE).join(ESCAPED);

const html = readFileSync(join(dist, 'index.html'), 'utf8');
const tag = new RegExp('<script\\b[^>]*\\bsrc="[^"]*"[^>]*>' + '<\\/script>' + '\\s*');
if (!tag.test(html)) throw new Error('no external script tag found in index.html');
const stripped = html.replace(tag, '');

function write(name, prelude) {
  const out = join(outDir, name);
  writeFileSync(
    out,
    stripped.replace('</body>', () => `<script>${prelude}${js}${CLOSE}>\n</body>`),
  );
  console.log(`wrote ${out}`);
}

write('JobEx-play.html', '');
write('JobEx-play-vi.html', 'window.JOBEX_FORCE_LANG="vi";');
