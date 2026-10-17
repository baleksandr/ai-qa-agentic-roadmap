/**
 * Smoke: Study Mode concept-10 (еталон RAG — 8 розділів).
 * node scripts/verify-tool-calling-study.mjs
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const md = readFileSync(join(root, 'content/concepts/10-tool-calling.md'), 'utf8');
const studyPart = md.split(/^##\s+Study Mode\s*$/im)[1] ?? '';
let study = studyPart.replace(/^#\s+[^\n]+\n+/, '').trim();

const SOURCES_START = /^:::study-sources\s*$/m;
const srcStart = study.search(SOURCES_START);
if (srcStart >= 0) {
  study = study.slice(0, srcStart).trim();
}

const chunks = study.split(/^###\s+/m);
const sections = [];
for (const chunk of chunks) {
  if (!chunk.trim()) continue;
  const nl = chunk.indexOf('\n');
  const title = (nl >= 0 ? chunk.slice(0, nl) : chunk).trim();
  if (/^Concept 10/i.test(title)) continue;
  sections.push(title);
}

const expected = [
  'Навіщо потрібен tool calling?',
  'Один виклик tool у run investigation',
  'З чого складається механізм?',
  'Де код, а де LLM?',
  'Де може зламатися?',
  'Як QA це тестує?',
  'Production і observability',
  'Запам’ятати та співбесіда',
];

let ok = sections.length === 8;
console.log('Sections:', sections.length);
sections.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));

for (let i = 0; i < expected.length; i++) {
  if (!sections[i]?.startsWith(expected[i])) {
    ok = false;
    console.log(`FAIL title ${i + 1}: expected "${expected[i]}" got "${sections[i]}"`);
  }
}

if (study.includes('readPlaywrightReport')) console.log('OK: teaching tool name');
else {
  ok = false;
  console.log('FAIL: missing readPlaywrightReport');
}

const step1 = 'Harness отримав failure summary з CI (код, не LLM).';
if (study.includes(step1)) console.log('OK: runtime step 1 in markdown');
else {
  ok = false;
  console.log('FAIL: missing runtime step 1 prose');
}

const failureHeadings = [
  'Hallucinated tool name',
  'Invalid arguments',
  'Wrong tool chosen',
  'Duplicate side effect',
  'Huge tool result',
  'Tool timeout / unavailable',
  'Permission denied',
];
const failCount = failureHeadings.filter((h) => study.includes(`#### ${h}`)).length;
if (failCount === 7) console.log('OK: 7 failure mode headings in markdown');
else {
  ok = false;
  console.log(`FAIL: expected 7 failure headings, found ${failCount}`);
}

const detailsSrc = readFileSync(join(root, 'src/data/study/tool-calling-failure-details.ts'), 'utf8');
const detailBlocks = (detailsSrc.match(/id:\s*'tc-fail-/g) ?? []).length;
if (detailBlocks === 7) console.log('OK: 7 failure detail panels in data');
else {
  ok = false;
  console.log(`FAIL: expected 7 failure details, found ${detailBlocks}`);
}

const llmCodePath = join(root, 'src/data/study/tool-calling-llm-code-flow.ts');
const llmCodeSrc = readFileSync(llmCodePath, 'utf8');
const llmSteps = (llmCodeSrc.match(/step:\s*\d/g) ?? []).length;
if (llmSteps === 6) console.log('OK: 6 LLM/code boundary steps');
else {
  ok = false;
  console.log(`FAIL: expected 6 LLM/code steps, found ${llmSteps}`);
}
if (!study.includes('Never trust args')) console.log('OK: no raw Never trust args in markdown');
else {
  ok = false;
  console.log('FAIL: replace Never trust args with Ukrainian examples in UI');
}

const qaPath = join(root, 'src/data/study/tool-calling-qa-testing.ts');
const qaSrc = readFileSync(qaPath, 'utf8');
const qaCats = (qaSrc.match(/id:\s*'tc-qa-/g) ?? []).length;
if (qaCats === 6) console.log('OK: 6 QA test categories');
else {
  ok = false;
  console.log(`FAIL: expected 6 QA categories, found ${qaCats}`);
}
if (qaSrc.includes('TOOL_CALLING_QA_GWT_SCENARIOS') && qaSrc.includes('readPlaywrightReport')) {
  console.log('OK: QA GWT scenarios');
} else {
  ok = false;
  console.log('FAIL: missing QA GWT scenarios');
}
if (!study.includes('/etc')) console.log('OK: no /etc in tool-calling study markdown');
else {
  ok = false;
  console.log('FAIL: remove /etc from study markdown (use portable sandbox paths)');
}

const questionsPath = join(root, 'src/data/study/tool-calling-interview-questions.ts');
const questionsSrc = readFileSync(questionsPath, 'utf8');
const idCount = (questionsSrc.match(/id:\s*'tc\d+'/g) ?? []).length;
if (idCount !== 10) {
  ok = false;
  console.log(`FAIL: expected 10 interview questions, found ${idCount}`);
} else {
  console.log('OK: 10 interview questions');
}
if (!questionsSrc.includes('answerBriefUk') || !questionsSrc.includes('answerDeepUk')) {
  ok = false;
  console.log('FAIL: interview deck must use answerBriefUk + answerDeepUk');
} else {
  console.log('OK: interview two-tier answers');
}

console.log(ok ? 'RESULT: PASS' : 'RESULT: FAIL');
process.exit(ok ? 0 : 1);
