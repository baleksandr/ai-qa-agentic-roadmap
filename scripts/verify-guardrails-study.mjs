/**
 * Локальна перевірка парсингу Study Mode для Guardrails (без tsx).
 * Запуск: node scripts/verify-guardrails-study.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const md = readFileSync(join(root, 'content/concepts/17-guardrails.md'), 'utf8');
const studyPart = md.split(/^##\s+Study Mode\s*$/im)[1] ?? '';
const study = studyPart
  .replace(/^###\s+(QA-приклад|Failure modes|Запитання|Коротка відповідь)[\s\S]*$/im, '')
  .trim();

const GLOBAL_STEP = /^(\d{2,})\.\s+(\d+\))\s*(.*)$/;
const FOOTER = /^(QA-приклад|Failure modes|Запитання)/i;

function stripNum(t) {
  return t.replace(/^(\d{1,2})(\.\d+)+\.\s+/, '').replace(/^(\d{1,2})\.\s+/, '').trim();
}

const chunks = study.replace(/^###\s+QUICK VIEW[\s\S]*?(?=^###\s+)/im, '').trim().split(/^###\s+/m);
const sections = [];

for (const chunk of chunks) {
  if (!chunk.trim()) continue;
  const nl = chunk.indexOf('\n');
  const titleLine = (nl >= 0 ? chunk.slice(0, nl) : chunk).trim();
  const body = (nl >= 0 ? chunk.slice(nl + 1) : '').trim();
  if (/^QUICK VIEW/i.test(titleLine) || /^Concept \d+\./i.test(titleLine)) continue;
  if (FOOTER.test(titleLine)) break;
  if (GLOBAL_STEP.test(titleLine)) continue;
  sections.push({ sourceTitle: titleLine, bare: stripNum(titleLine), body });
}

const readerTitles = sections.map((s, i) => `${i + 1}. ${s.bare}`);
const bad114 = sections.some((s) => GLOBAL_STEP.test(s.sourceTitle) || /^\d{3,}\.\s/.test(s.sourceTitle));
const stepSection = sections.find((s) => /крок за кроком/i.test(s.bare));
const stepCount = stepSection
  ? (stepSection.body.match(/^\d+\.\s+/gm) ?? []).length +
    (stepSection.body.match(/\*\*Крок \d+\.\*\*/g) ?? []).length
  : 0;

let ok = true;
const lines = [];

lines.push('=== Guardrails Study parse check ===');
lines.push(`Sections: ${sections.length} (expect 15)`);
lines.push('Reader nav titles:');
readerTitles.forEach((t) => lines.push(`  - ${t}`));

if (sections.length !== 15) {
  ok = false;
  lines.push('FAIL: expected 15 sections');
}
if (bad114) {
  ok = false;
  lines.push('FAIL: found 114-style section titles');
}
if (!readerTitles[0]?.startsWith('1. ')) {
  ok = false;
  lines.push(`FAIL: first section should start with "1." got: ${readerTitles[0]}`);
}
if (readerTitles.some((t) => t.match(/^0\./))) {
  ok = false;
  lines.push('FAIL: found section numbered 0');
}
if (!stepSection) {
  ok = false;
  lines.push('FAIL: missing "крок за кроком" section');
} else if (stepCount < 6) {
  ok = false;
  lines.push(`FAIL: expected 6 steps in step section, found ${stepCount}`);
} else {
  lines.push(`OK: step section "${stepSection.bare}" has ${stepCount} step lines in source body`);
}

const flowSample = sections[0]?.body ?? '';
const hasBranchAscii = flowSample.includes('├─') && flowSample.includes('↓');
lines.push(hasBranchAscii ? 'OK: branch ASCII present in section 1 body (renderer should convert)' : 'WARN: branch ASCII not in section 1');

lines.push(ok ? '\nRESULT: PASS' : '\nRESULT: FAIL');
console.log(lines.join('\n'));
process.exit(ok ? 0 : 1);
