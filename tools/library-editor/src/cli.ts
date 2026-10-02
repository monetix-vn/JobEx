#!/usr/bin/env tsx
import { resolve } from 'node:path';
import { createEditorServer } from './server';

const args = process.argv.slice(2);
const opt = (name: string, fallback: string): string => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? (args[i + 1] ?? fallback) : fallback;
};
const dir = resolve(opt('library', 'library'));
const port = Number(opt('port', '5180'));

const server = createEditorServer(dir);
// Only this computer can reach it: the editor writes files.
server.listen(port, '127.0.0.1', () => {
  console.log(`People library editor: http://127.0.0.1:${port}/  (editing ${dir})`);
  console.log('Press Ctrl+C to stop. Saves keep a .bak copy of each file.');
});
