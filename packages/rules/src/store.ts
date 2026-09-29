import type { ExprValue } from '@je/contracts';
import type { Scope } from './expr';

/**
 * A module's read-only mirror of another module's state, rebuilt from `sim.stateChanged`
 * events. Nobody mutates the owner's state; everyone else keeps a copy like this to evaluate
 * conditions.
 */
export class VarStore {
  private readonly vars = new Map<string, ExprValue>();

  /** Applies a `sim.stateChanged` payload: a full snapshot replaces everything. */
  apply(change: { full: boolean; vars: Record<string, ExprValue> }): void {
    if (change.full) this.vars.clear();
    for (const [path, value] of Object.entries(change.vars)) this.vars.set(path, value);
  }

  get(path: string): ExprValue | undefined {
    return this.vars.get(path);
  }

  number(path: string, fallback = 0): number {
    const value = this.vars.get(path);
    return typeof value === 'number' ? value : fallback;
  }

  readonly scope: Scope = (path) => this.vars.get(path);
}
