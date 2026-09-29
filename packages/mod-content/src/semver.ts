export type Semver = [number, number, number];

export function parseSemver(text: string): Semver | undefined {
  const m = /^(\d+)\.(\d+)\.(\d+)$/.exec(text);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : undefined;
}

/** True when `have` is at least `need`. Unparseable input compares as not satisfying. */
export function semverAtLeast(have: string, need: string): boolean {
  const a = parseSemver(have);
  const b = parseSemver(need);
  if (!a || !b) return false;
  for (let i = 0; i < 3; i++) {
    if ((a[i] as number) !== (b[i] as number)) return (a[i] as number) > (b[i] as number);
  }
  return true;
}
