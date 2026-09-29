import { CONTRACTS_VERSION, type Handler, type Module } from '@je/contracts';

export function makeModule(
  id: string,
  options: {
    priority?: number;
    consumes?: string[];
    emits?: string[];
    handlers?: (host: Parameters<Module['createModule']>[0]) => Record<string, Handler>;
    snapshot?: () => unknown;
  } = {},
): Module {
  return {
    manifest: {
      id,
      version: '1.0.0',
      priority: options.priority ?? 50,
      consumes: options.consumes ?? [],
      emits: options.emits ?? [],
      contractsVersion: CONTRACTS_VERSION,
    },
    createModule: (host) => ({
      handlers: options.handlers?.(host) ?? {},
      snapshot: options.snapshot ?? (() => ({})),
    }),
  };
}
