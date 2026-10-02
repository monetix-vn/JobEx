import { describe, expect, it } from 'vitest';
import { play } from './helpers';

/**
 * Performance guard (WORLD-PLAN M0). A full simulated year of the heaviest job must stay far below a
 * second on a normal machine; the limit is generous so a slow CI machine does not flake, and tight enough
 * to catch an accidental quadratic loop. The people-tier budgets (50 weekly, 500 monthly, 3000 yearly) get
 * their own tests when the world engine exists.
 */
describe('performance budget', () => {
  it('plays a full year of a job well inside the budget', async () => {
    for (const scenario of ['sales-year', 'it-year', 'hr-year']) {
      const started = performance.now();
      await play(scenario, 'perf-1', 'en', undefined, { policy: 'first' });
      const elapsed = performance.now() - started;
      expect(elapsed, scenario).toBeLessThan(5000);
    }
  });
});
