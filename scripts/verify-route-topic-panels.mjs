/**
 * Усі topicId на навчальній карті мають запис у route-topic-side-panels.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const registryPath = join(root, 'src/data/learning-map.registry.ts');
const registrySrc = readFileSync(registryPath, 'utf8');
const topicIds = [...registrySrc.matchAll(/topicId:\s*'([^']+)'/g)].map((m) => m[1]);
const unique = [...new Set(topicIds)];

const panelSrc = [
  'src/data/review/route-topic-side-panels.ts',
  'src/data/review/route-topic-side-panels-extra.ts',
]
  .map((p) => readFileSync(join(root, p), 'utf8'))
  .join('\n');

const missing = unique.filter((id) => !panelSrc.includes(`'${id}':`));
if (missing.length) {
  console.error('verify-route-topic-panels: missing panels for:', missing.join(', '));
  process.exit(1);
}
console.log(`verify-route-topic-panels: ok (${unique.length} topics)`);
