/**
 * Dependency-boundary rules (development plan, section 2). One place, plain data.
 *
 * Layer of a package is decided by its folder and short name (the part after "@je/").
 */

export interface LayerRule {
  layer: string;
  /** Short names of workspace packages it may import (public API only). */
  mayImport: string[] | 'any-package';
  /** External (npm) packages allowed in src. Test folders may use any external package. */
  externals: string[];
  /** Node built-ins allowed in src (packages are browser-safe, so normally false). */
  nodeBuiltins: boolean;
}

export function ruleFor(dir: 'packages' | 'tools', shortName: string): LayerRule | undefined {
  if (dir === 'tools') {
    return { layer: 'tool', mayImport: 'any-package', externals: [], nodeBuiltins: true };
  }
  if (shortName === 'contracts') {
    return { layer: 'contracts', mayImport: [], externals: [], nodeBuiltins: false };
  }
  if (shortName === 'kernel' || shortName === 'rules') {
    return { layer: shortName, mayImport: ['contracts'], externals: [], nodeBuiltins: false };
  }
  if (shortName === 'client-web') {
    return {
      layer: 'client',
      mayImport: ['contracts', 'kernel'],
      externals: [],
      nodeBuiltins: false,
    };
  }
  if (shortName.startsWith('mod-')) {
    return {
      layer: 'module',
      mayImport: ['contracts', 'kernel', 'rules'],
      externals: EXTERNALS_BY_PACKAGE[shortName] ?? [],
      nodeBuiltins: false,
    };
  }
  return undefined;
}

/** Third-party runtime dependencies a package is explicitly allowed to have. */
export const EXTERNALS_BY_PACKAGE: Record<string, string[]> = {
  'mod-content': ['ajv'],
};
