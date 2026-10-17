/**
 * Перевірка парсингу Study Mode для RAG (concept-03).
 * Запуск: node scripts/verify-rag-study.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const md = readFileSync(join(root, 'content/concepts/03-rag.md'), 'utf8');
const studyPart = md.split(/^##\s+Study Mode\s*$/im)[1] ?? '';
let study = studyPart
  .replace(/^###\s+(QA-приклад|Failure modes|Запитання|Коротка відповідь)[\s\S]*$/im, '')
  .trim();

study = study.replace(/^#\s+[^\n]+\n+/, '').replace(/^Concept \d+\.[^\n]*\n+/im, '').trim();

const SOURCES_START = /^:::study-sources\s*$/m;
const SOURCES_END = /^:::study-sources-end\s*$/m;
let sourcesMarkdown = '';
const srcStart = study.search(SOURCES_START);
if (srcStart >= 0) {
  const after = study.slice(srcStart);
  const endRel = after.search(SOURCES_END);
  if (endRel >= 0) {
    sourcesMarkdown = after.replace(SOURCES_START, '').slice(0, endRel).trim();
    const endAbs = srcStart + endRel + ':::study-sources-end'.length;
    study = `${study.slice(0, srcStart).trim()}\n\n${study.slice(endAbs).trim()}`.trim();
  }
}

const FOOTER = /^(QA-приклад|Failure modes|Запитання)/i;
const chunks = study.split(/^#{2,3}\s+/m);
const sections = [];

for (const chunk of chunks) {
  if (!chunk.trim()) continue;
  const nl = chunk.indexOf('\n');
  const titleLine = (nl >= 0 ? chunk.slice(0, nl) : chunk).trim();
  const body = (nl >= 0 ? chunk.slice(nl + 1) : '').trim();
  if (/^QUICK VIEW/i.test(titleLine) || /^Concept \d+\./i.test(titleLine)) continue;
  if (FOOTER.test(titleLine)) break;
  sections.push({ title: titleLine, body });
}

const expectedStarts = [
  'Навіщо потрібен RAG?',
  'Як RAG працює в одному запиті?',
  'Як підготувати документи для пошуку?',
  'Де код, а де LLM?',
  'Де RAG може помилитися?',
  'Як QA це тестує?',
  'Що потрібно для production?',
  'Запам’ятати та співбесіда',
];

let ok = true;
const lines = [];
lines.push('=== RAG Study parse check ===');
lines.push(`Sections: ${sections.length} (expect 8)`);
sections.forEach((s, i) => {
  lines.push(`  ${i + 1}. ${s.title}`);
});

if (sections.length !== 8) {
  ok = false;
  lines.push('FAIL: expected 8 sections');
}

for (let i = 0; i < expectedStarts.length; i++) {
  if (!sections[i]?.title.startsWith(expectedStarts[i])) {
    ok = false;
    lines.push(`FAIL: section ${i + 1} title mismatch: got "${sections[i]?.title}"`);
  }
}

if (!sourcesMarkdown.includes('AI Engineering')) {
  ok = false;
  lines.push('FAIL: sources block missing or empty');
} else {
  lines.push(`OK: sources block (${sourcesMarkdown.length} chars)`);
}

const remember = sections[7]?.body ?? '';
if (/\*\*Крок \d+\.\*\*/.test(remember)) {
  ok = false;
  lines.push('FAIL: "Запам’ятати" section contains **Крок N.** markers');
}

const querySection = sections[1]?.body ?? '';
const stepCount = (querySection.match(/\*\*Крок \d+\.\*\*/g) ?? []).length;
if (stepCount !== 6) {
  ok = false;
  lines.push(`FAIL: query section should have 6 process steps, found ${stepCount}`);
} else {
  lines.push('OK: 6 steps in "одному запиті" section');
}

if (!/Передумова run/i.test(querySection)) {
  ok = false;
  lines.push('FAIL: query section missing offline prerequisite block');
} else {
  lines.push('OK: offline prerequisite before runtime steps');
}

const step1 = querySection.match(/\*\*Крок 1\.\*\*\s*([^\n]+)/)?.[1] ?? '';
if (/offline|індекс уже/i.test(step1)) {
  ok = false;
  lines.push(`FAIL: step 1 must not be offline prep: "${step1}"`);
} else if (!/упав|CI|harness|тест/i.test(step1)) {
  ok = false;
  lines.push(`FAIL: step 1 should start from test failure: "${step1}"`);
} else {
  lines.push('OK: step 1 is runtime test failure');
}

if (!/90\s*дн|датою інциденту/i.test(querySection)) {
  ok = false;
  lines.push('FAIL: query section should mention optional 90-day / incident date note');
} else {
  lines.push('OK: optional date filter noted in prose');
}

if (/Filters:.*incident_date_gte/i.test(querySection)) {
  ok = false;
  lines.push('FAIL: incident_date_gte should not appear as applied filter in fence');
} else {
  lines.push('OK: applied filters fence without incident_date_gte');
}

if (/last 90 days/i.test(querySection.split('```')[1] ?? '')) {
  ok = false;
  lines.push('FAIL: retrieval query text should not contain "last 90 days" (use filters)');
} else {
  lines.push('OK: query text vs date filter separated');
}

if (!/tenant=acme/i.test(querySection)) {
  ok = false;
  lines.push('FAIL: filters should include tenant=acme');
} else {
  lines.push('OK: tenant in filters');
}

const qaSection = sections[5]?.body ?? '';
if (
  !(/\*\*A\*\*/.test(qaSection) || /\*\*A\.\*\*/.test(qaSection)) ||
  !(/\*\*B\*\*/.test(qaSection) || /\*\*B\.\*\*/.test(qaSection)) ||
  !(/\*\*C\*\*/.test(qaSection) || /\*\*C\.\*\*/.test(qaSection))
) {
  ok = false;
  lines.push('FAIL: QA section should list checks A, B, C for groundedness');
} else {
  lines.push('OK: QA checks A/B/C documented');
}

const failureH4 = (sections[4]?.body.match(/^####\s+/gm) ?? []).length;
if (failureH4 < 6) {
  ok = false;
  lines.push(`FAIL: failure section expected >=6 #### cards, found ${failureH4}`);
} else {
  lines.push(`OK: ${failureH4} failure cards (#### headings)`);
}

lines.push(ok ? 'RESULT: PASS' : 'RESULT: FAIL');
console.log(lines.join('\n'));
process.exit(ok ? 0 : 1);
