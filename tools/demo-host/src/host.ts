import type { Transport } from '@je/client-web';
import { Run } from '@je/kernel';
import { stubModules } from '@je/mod-stubs';

/**
 * Composition root: builds an in-process run (stage 0 in the scaling path) and exposes it to the
 * client as a Transport. Moving the run into a Worker or onto a server only changes this file.
 */
export function createInProcessHost(seed: string): { run: Run; transport: Transport } {
  const run = new Run({ seed, modules: stubModules });
  run.start();
  const transport: Transport = {
    subscribe: (listener) => run.observe(listener),
    send: (type, payload) => {
      run.submit(type, payload);
    },
  };
  return { run, transport };
}
