import type { ContentTypes, ContentView, Locale, PackKind, PackManifest } from '@je/contracts';

export type { ContentTypes };

export interface RegistryData {
  /** Packs in resolved layer order (core first). */
  packs: PackManifest[];
  items: { [K in PackKind]: Map<string, ContentTypes[K]> };
  locales: Record<Locale, Map<string, string>>;
}

/** Read-only view of merged, validated content. Later layers already override earlier ones. */
export class ContentRegistry implements ContentView {
  constructor(private readonly data: RegistryData) {}

  get packs(): readonly PackManifest[] {
    return this.data.packs;
  }

  get<K extends PackKind>(kind: K, id: string): ContentTypes[K] | undefined {
    return this.data.items[kind].get(id);
  }

  all<K extends PackKind>(kind: K): ContentTypes[K][] {
    return [...this.data.items[kind].values()];
  }

  text(locale: Locale, key: string): string | undefined {
    return this.data.locales[locale].get(key);
  }

  counts(): Record<string, number> {
    const out: Record<string, number> = {};
    for (const kind of Object.keys(this.data.items) as PackKind[]) {
      out[kind] = this.data.items[kind].size;
    }
    return out;
  }
}
