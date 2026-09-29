import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { ContentSourcePort } from '@je/contracts';

/** ContentSourcePort over a directory on disk. */
export function directorySource(root: string): ContentSourcePort {
  const list = (dir: string, prefix: string, out: string[]): string[] => {
    for (const name of readdirSync(dir).sort()) {
      if (name === 'node_modules' || name.startsWith('.')) continue;
      const full = join(dir, name);
      const rel = prefix ? `${prefix}/${name}` : name;
      if (statSync(full).isDirectory()) list(full, rel, out);
      else out.push(rel);
    }
    return out;
  };
  return {
    list: async () => list(root, '', []),
    read: async (path) => readFileSync(join(root, path), 'utf8'),
  };
}
