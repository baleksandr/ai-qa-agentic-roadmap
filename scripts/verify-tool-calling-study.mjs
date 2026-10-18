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
  'Які дані передаються під час Tool Calling?',
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

const bundlesSrc = readFileSync(join(root, 'src/data/study/tool-calling-study-bundles.ts'), 'utf8');
if (study.includes('readPlaywrightReport') || bundlesSrc.includes('readPlaywrightReport')) {
  console.log('OK: teaching tool name');
} else {
  ok = false;
  console.log('FAIL: missing readPlaywrightReport');
}

const dataPanels = readFileSync(join(root, 'src/data/study/tool-calling-data-panels.ts'), 'utf8');
const dataExports = (dataPanels.match(/export const TOOL_CALLING_DATA_/g) ?? []).length;
if (dataExports === 3) console.log('OK: 3 data-transfer panels in data');
else {
  ok = false;
  console.log(`FAIL: expected 3 data panels, found ${dataExports}`);
}
if (
  dataPanels.includes('Що відбувається насправді') &&
  dataPanels.includes('Два можливі результати') &&
  !dataPanels.includes('На пальцях')
) {
  console.log('OK: data panel section labels');
} else {
  ok = false;
  console.log('FAIL: data panels missing expected section copy');
}
if (bundlesSrc.includes('TOOL_CALLING_DATA_TRANSFER_BUNDLE') && bundlesSrc.includes('Опис інструмента')) {
  console.log('OK: data transfer teaching bundle');
} else {
  ok = false;
  console.log('FAIL: missing TOOL_CALLING_DATA_TRANSFER_BUNDLE');
}

const failPanelsSrc = readFileSync(join(root, 'src/data/study/tool-calling-failure-panels.ts'), 'utf8');
const failPanelExports = (failPanelsSrc.match(/export const TOOL_CALLING_FAIL_/g) ?? []).length;
if (failPanelExports === 7) console.log('OK: 7 failure mode panels in data');
else {
  ok = false;
  console.log(`FAIL: expected 7 failure panels, found ${failPanelExports}`);
}
if (
  bundlesSrc.includes('TOOL_CALLING_FAILURE_BUNDLE') &&
  failPanelsSrc.includes('Як QA відтворює') &&
  failPanelsSrc.includes('Невідомий інструмент')
) {
  console.log('OK: failure teaching bundle');
} else {
  ok = false;
  console.log('FAIL: missing TOOL_CALLING_FAILURE_BUNDLE or panel copy');
}

const detailsSrc = readFileSync(join(root, 'src/data/study/tool-calling-failure-details.ts'), 'utf8');
const detailBlocks = (detailsSrc.match(/id:\s*'tc-fail-/g) ?? []).length;
if (detailBlocks === 7) console.log('OK: 7 failure detail panels in data');
else {
  ok = false;
  console.log(`FAIL: expected 7 failure details, found ${detailBlocks}`);
}

const llmPanelsPath = join(root, 'src/data/study/tool-calling-llm-code-panels.ts');
const llmPanelsSrc = readFileSync(llmPanelsPath, 'utf8');
const llmSteps = (llmPanelsSrc.match(/export const TOOL_CALLING_LLM_CODE_STEP_/g) ?? []).length;
if (llmSteps === 6) console.log('OK: 6 LLM/code boundary step panels');
else {
  ok = false;
  console.log(`FAIL: expected 6 LLM/code step panels, found ${llmSteps}`);
}
if (llmPanelsSrc.includes('Хто діє') && llmPanelsSrc.includes('Що перевіряє QA')) {
  console.log('OK: LLM/code panel section labels');
} else {
  ok = false;
  console.log('FAIL: LLM/code panels missing section labels');
}
if (!study.includes('Never trust args')) console.log('OK: no raw Never trust args in markdown');
else {
  ok = false;
  console.log('FAIL: replace Never trust args with Ukrainian examples in UI');
}

const qaPath = join(root, 'src/data/study/tool-calling-qa-testing.ts');
const qaSrc = readFileSync(qaPath, 'utf8');
/** Три рівні тестування (handler / harness / +LLM) — id `tc-qa-level-*` */
const qaLevels = (qaSrc.match(/id:\s*'tc-qa-level-/g) ?? []).length;
if (qaLevels === 3) console.log('OK: 3 QA test levels (handler, harness, +LLM)');
else {
  ok = false;
  console.log(`FAIL: expected 3 QA test levels, found ${qaLevels}`);
}
const qaPanelsPath = join(root, 'src/data/study/tool-calling-qa-panels.ts');
const qaPanelsSrc = readFileSync(qaPanelsPath, 'utf8');
const qaCats = (qaPanelsSrc.match(/export const TOOL_CALLING_QA_CAT_/g) ?? []).length;
if (qaCats === 6) console.log('OK: 6 QA category panels');
else {
  ok = false;
  console.log(`FAIL: expected 6 QA category panels, found ${qaCats}`);
}
if (bundlesSrc.includes('TOOL_CALLING_QA_GWT_BUNDLE') && bundlesSrc.includes('Заборонений шлях')) {
  console.log('OK: QA GWT teaching bundle');
} else {
  ok = false;
  console.log('FAIL: missing QA GWT bundle');
}

const prodPanelsPath = join(root, 'src/data/study/tool-calling-production-panels.ts');
const prodPanelsSrc = readFileSync(prodPanelsPath, 'utf8');
const prodExports = (prodPanelsSrc.match(/export const TOOL_CALLING_PROD_/g) ?? []).length;
if (prodExports === 5) console.log('OK: 4 production panels + trace JSON sample');
else {
  ok = false;
  console.log(`FAIL: expected 5 production exports, found ${prodExports}`);
}
if (
  bundlesSrc.includes('TOOL_CALLING_PRODUCTION_BUNDLE') &&
  prodPanelsSrc.includes('Пропозиція') &&
  prodPanelsSrc.includes('Зворотна сумісність')
) {
  console.log('OK: production teaching bundle');
} else {
  ok = false;
  console.log('FAIL: missing TOOL_CALLING_PRODUCTION_BUNDLE or panel copy');
}
if (!study.includes('| **Trace** |')) console.log('OK: no legacy production table in markdown');
else {
  ok = false;
  console.log('FAIL: remove production table from markdown (use teaching cards)');
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
if (!questionsSrc.includes('```json')) console.log('OK: no raw JSON blocks in interview answers');
else {
  ok = false;
  console.log('FAIL: remove JSON code blocks from tool-calling interview answers');
}
const rememberSrc = readFileSync(join(root, 'src/data/study/tool-calling-remember.ts'), 'utf8');
if (rememberSrc.includes('Модель пропонує') && rememberSrc.includes('QA дивиться на докази')) {
  console.log('OK: remember summary cards');
} else {
  ok = false;
  console.log('FAIL: missing tool-calling remember cards');
}

console.log(ok ? 'RESULT: PASS' : 'RESULT: FAIL');
process.exit(ok ? 0 : 1);
