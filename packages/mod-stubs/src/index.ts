import type { Module } from '@je/contracts';
import { choiceModule } from './choice';
import { directorModule } from './director';
import { economyModule } from './economy';

export { choiceModule, directorModule, economyModule };

/** The stub module set used by Phase 0 tests and the headless runner. */
export const stubModules: readonly Module[] = [economyModule, directorModule, choiceModule];
