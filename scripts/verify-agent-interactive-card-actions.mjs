/**
 * Перевірка написів дій на інтерактивних картках агента (статичний grep).
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const labelSrc = readFileSync(
  join(root, 'src/components/agent-arch/ArchInteractiveActionLabel.tsx'),
  'utf8',
);

const required = [
  'Показати зв’язок →',
  'Зв’язок показано ✓',
  'Відкрити пояснення →',
  'Пояснення відкрито ✓',
  'Перейти до уроку ↗',
];

const missing = required.filter((s) => !labelSrc.includes(s));
if (missing.length) {
  console.error('verify-agent-interactive-card-actions: missing strings:', missing.join(', '));
  process.exit(1);
}

const panel = readFileSync(join(root, 'src/components/agent-arch/ArchitectureSimStepPanel.tsx'), 'utf8');
if (!panel.includes("kind=\"showLink\"") || !panel.includes('arch-node-conn-card')) {
  console.error('verify-agent-interactive-card-actions: connection cards not wired');
  process.exit(1);
}

console.log('verify-agent-interactive-card-actions: ok');
