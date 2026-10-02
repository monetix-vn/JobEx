#!/usr/bin/env tsx
import { resolve } from 'node:path';
import { createSaveHost } from './server';

const args = process.argv.slice(2);
const opt = (name: string, fallback: string): string => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? (args[i + 1] ?? fallback) : fallback;
};
const dir = resolve(opt('dir', 'saves'));
const port = Number(opt('port', '5190'));

const server = createSaveHost(dir);
// Only this computer can reach it: it writes files.
server.listen(port, '127.0.0.1', () => {
  console.log(`JobEx save host: http://127.0.0.1:${port}/  (worlds are kept in ${dir})`);
  console.log(
    'Leave this window open while you play. Press Ctrl+C to stop. Saves keep a .bak copy; deleted worlds go to .trash.',
  );
});
