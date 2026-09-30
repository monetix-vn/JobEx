import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect } from 'vitest';

const FILE = join(import.meta.dirname, 'pins.json');

/**
 * Golden fingerprints: a fixed seed must keep producing exactly the same run. They change only when
 * behaviour changes on purpose, and then `pnpm pin:update` rewrites them (never edit by hand).
 */
export function expectPin(name: string, actual: string): void {
  const pins = JSON.parse(readFileSync(FILE, 'utf8')) as Record<string, string>;
  if (process.env.UPDATE_PINS === '1') {
    if (pins[name] !== actual) {
      writeFileSync(FILE, `${JSON.stringify({ ...pins, [name]: actual }, null, 2)}\n`);
    }
    return;
  }
  expect(
    actual,
    `pin "${name}" moved; if the behaviour change is intended run: pnpm pin:update`,
  ).toBe(pins[name]);
}
