/**
 * Те саме, що route-panel-browser-check.mjs (історична назва).
 */
import { spawnSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const script = join(dirname(fileURLToPath(import.meta.url)), 'route-panel-browser-check.mjs');
const r = spawnSync(process.execPath, [script], { stdio: 'inherit' });
process.exit(r.status ?? 1);
