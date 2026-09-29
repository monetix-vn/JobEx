import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('no dynamic code execution', () => {
  it('the rules package source never uses eval, Function or dynamic import', () => {
    const dir = join(import.meta.dirname, '..', 'src');
    for (const name of readdirSync(dir)) {
      // Strip comments so documentation may mention the words.
      const code = readFileSync(join(dir, name), 'utf8')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '');
      expect(code, name).not.toMatch(/\beval\s*\(/);
      expect(code, name).not.toMatch(/\bnew\s+Function\b|\bFunction\s*\(/);
      expect(code, name).not.toMatch(/\bimport\s*\(/);
      expect(code, name).not.toMatch(/\bsetTimeout\s*\(\s*['"`]/);
    }
  });
});
