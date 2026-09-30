import type { PackManifest } from '@je/contracts';
import type { Diagnostic } from './diagnostics';
import type { RawPack } from './load';

/** Layer rank first, then dependencies, then id, so the order is stable. Cycles are reported. */
export function orderPacks(
  packs: { pack: RawPack; manifest: PackManifest }[],
  rank: (m: PackManifest) => number,
  push: (d: Diagnostic) => void,
): { pack: RawPack; manifest: PackManifest }[] {
  const pending = [...packs].sort(
    (a, b) => rank(a.manifest) - rank(b.manifest) || (a.manifest.id < b.manifest.id ? -1 : 1),
  );
  const done = new Set<string>();
  const known = new Set(packs.map((p) => p.manifest.id));
  const out: typeof packs = [];
  while (pending.length > 0) {
    const index = pending.findIndex((p) =>
      (p.manifest.depends_on ?? []).every((d) => done.has(d) || !known.has(d)),
    );
    if (index === -1) {
      push({
        severity: 'error',
        code: 'pack.cycle',
        message: `dependency cycle among: ${pending.map((p) => p.manifest.id).join(', ')}`,
      });
      out.push(...pending);
      break;
    }
    const [next] = pending.splice(index, 1);
    done.add((next as (typeof packs)[number]).manifest.id);
    out.push(next as (typeof packs)[number]);
  }
  return out;
}
