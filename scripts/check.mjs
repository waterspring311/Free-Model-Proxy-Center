import { readdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';

let failed = false;
for (const directory of ['server', 'scripts', 'tests']) {
  for (const file of readdirSync(directory).filter(name => name.endsWith('.mjs'))) {
    const result = spawnSync(process.execPath, ['--check', path.join(directory, file)], { stdio: 'inherit' });
    if (result.status !== 0) failed = true;
  }
}
process.exitCode = failed ? 1 : 0;
