// Runs on `pnpm install` (the "prepare" script): point git at the repo's hooks. Never fails an install.
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';

if (existsSync('.git') && existsSync('.githooks')) {
  spawnSync('git', ['config', 'core.hooksPath', '.githooks'], { stdio: 'ignore' });
}
