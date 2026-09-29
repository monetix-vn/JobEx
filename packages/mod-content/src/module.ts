import { CONTRACTS_VERSION } from '@je/contracts';
import type { Module, ModuleHost, ModuleInstance, ModuleManifest } from '@je/contracts';
import type { ContentRegistry } from './registry';

export const manifest: ModuleManifest = {
  id: 'mod-content',
  version: '0.1.0',
  priority: 0,
  consumes: ['run.started'],
  emits: ['content.loaded'],
  contractsVersion: CONTRACTS_VERSION,
};

export interface ContentModuleConfig {
  registry: ContentRegistry;
}

/**
 * Standard module factory. The composition root loads and validates packs (async, through a
 * ContentSourcePort) and passes the registry in as this module's config.
 */
export function createModule(host: ModuleHost): ModuleInstance {
  const config = host.config as Partial<ContentModuleConfig> | undefined;
  const registry = config?.registry;
  if (!registry) throw new Error('mod-content needs config.registry (a validated ContentRegistry)');
  return {
    handlers: {
      'run.started': () => [
        {
          type: 'content.loaded',
          payload: {
            packs: registry.packs.map((p) => ({ id: p.id, version: p.version })),
            counts: registry.counts(),
          },
        },
      ],
    },
    snapshot: () => ({ packs: registry.packs.map((p) => p.id), counts: registry.counts() }),
  };
}

export const contentModule: Module = { manifest, createModule };
