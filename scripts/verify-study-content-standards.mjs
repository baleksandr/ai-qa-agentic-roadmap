#!/usr/bin/env node
/**
 * Автоперевірки єдиного стандарту навчального контенту (не заміна ручного UI-огляду).
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(root, '..');

const errors = [];
const warnings = [];

function walk(dir, ext, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) walk(p, ext, out);
    else if (name.endsWith(ext)) out.push(p);
  }
  return out;
}

function read(p) {
  return fs.readFileSync(p, 'utf8');
}

// 1. «Запам’ятати» у concepts — без службових рядків
const REMEMBER_FORBIDDEN =
  /^(нижче\s*[—–-]|оберіть|натисніть|подивіться панел|клікніть|інтерактивний блок|після підключення deck)/i;

for (const file of walk(path.join(repo, 'content/concepts'), '.md')) {
  const md = read(file);
  const m = md.match(/###\s*Запам’ятати[\s\S]*?(?=###\s|:::study-sources|$)/i);
  if (!m) continue;
  const body = m[0].replace(/^###[^\n]*\n/, '');
  for (const line of body.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('|') || t.startsWith('---')) continue;
    if (REMEMBER_FORBIDDEN.test(t)) {
      errors.push(`${path.relative(repo, file)}: «Запам’ятати» містить службовий рядок: ${t.slice(0, 72)}…`);
    }
  }
}

// 2. Fundamentals JSON — без diagram/flow/code поруч із teaching-картками (дубль процесу)
const fundJson = path.join(repo, 'content/fundamentals/ai-llm-fundamentals.study.json');
if (fs.existsSync(fundJson)) {
  const sections = JSON.parse(read(fundJson)).sections ?? [];
  const withTeaching = new Set([
    'glossary-02', 'glossary-03', 'glossary-04', 'glossary-06', 'glossary-07',
    'glossary-08', 'glossary-09', 'glossary-10', 'glossary-11', 'glossary-12',
    'glossary-13', 'glossary-14', 'glossary-15', 'glossary-16', 'glossary-17',
    'glossary-18', 'glossary-19', 'glossary-20',
  ]);
  const KEY_IDEA_FORBIDDEN =
    /(картки нижче|на картці нижче|оберіть картку|§\s*\d|у цьому розділі покажемо)/i;
  for (const sec of sections) {
    if (withTeaching.has(sec.id)) {
      const dup = (sec.blocks ?? []).some((b) =>
        ['diagram', 'flow', 'code'].includes(b.type),
      );
      if (dup) {
        errors.push(`fundamentals ${sec.id}: diagram/flow/code дублює teaching-картки`);
      }
    }
    for (const block of sec.blocks ?? []) {
      if (block.type === 'keyIdea') {
        const keyText =
          typeof block.text === 'string'
            ? block.text
            : (block.bullets ?? []).map((b) => `${b.termUk ?? ''} ${b.bodyUk}`).join(' ');
        if (keyText && KEY_IDEA_FORBIDDEN.test(keyText)) {
          errors.push(`fundamentals ${sec.id}: keyIdea містить службовий текст, не висновок`);
        }
      }
      if (block.type === 'definitionAccent' && typeof block.leadUk === 'string') {
        const lead = block.leadUk.trim();
        if (lead && !/^[А-ЯІЇЄҐA-Z«"(\[]/.test(lead)) {
          errors.push(`fundamentals ${sec.id}: definitionAccent.leadUk має починатися з великої літери`);
        }
        if (/\*\*[^*]+\*\*/.test(lead) && !lead.includes(' — ')) {
          // ** дозволено лише якщо рендериться parseLessonBold (перевірка компонента нижче)
        }
      }
    }
  }
}

// 3. Панельні дані — без службових «§N» у тексті для учня
const studyData = walk(path.join(repo, 'src/data/study'), '.ts');
const learnerFieldRe =
  /(whatUk|exampleUk|relationUk|linkUk|testUk|qaUk|teaserUk|bodyUk|leadUk|rememberUk|thesisUk):\s*['`]/;
for (const file of studyData) {
  const rel = path.relative(repo, file);
  const lines = read(file).split('\n');
  lines.forEach((line, i) => {
    if (!learnerFieldRe.test(line) && !/\bUk:\s*['`]/.test(line)) return;
    if (/\b§\s*\d+/.test(line)) {
      errors.push(`${rel}:${i + 1}: § у навчальному тексті панелі`);
    }
  });
}

// 4. Labs — «Запам’ятати» / службові рядки
for (const file of walk(path.join(repo, 'content/labs'), '.md')) {
  const md = read(file);
  if (/###\s*Запам’ятати/i.test(md)) {
    const m = md.match(/###\s*Запам’ятати[\s\S]*?(?=###\s|:::|$)/i);
    if (m) {
      for (const line of m[0].split('\n')) {
        const t = line.trim();
        if (REMEMBER_FORBIDDEN.test(t)) {
          errors.push(`${path.relative(repo, file)}: службовий рядок у «Запам’ятати»`);
        }
      }
    }
  }
}

// 5. Markdown strong ≠ колір терміна (спільний рендер)
const mdBodyPath = path.join(repo, 'src/components/MarkdownBody.tsx');
const mdBody = read(mdBodyPath);
const strongBlock = mdBody.match(/components\.strong[\s\S]*?},/)?.[0] ?? '';
if (strongBlock.includes('study-term-accent')) {
  errors.push('MarkdownBody: <strong> не повинен отримувати study-term-accent');
}
const lessonRich = read(path.join(repo, 'src/components/lesson/lessonRichText.tsx'));
const boldFn = lessonRich.match(/export function parseLessonBold[\s\S]*?^}/m)?.[0] ?? '';
if (boldFn.includes('study-term-accent')) {
  errors.push('parseLessonBold: ** не повинен мапитися на study-term-accent');
}
const defAccent = read(path.join(repo, 'src/components/lesson/StudyDefinitionAccent.tsx'));
if (!defAccent.includes('parseLessonBold')) {
  errors.push('StudyDefinitionAccent: leadUk має рендеритися через parseLessonBold');
}

// 6. Inline ** / ` — симуляція parseLessonBold (без браузера)
function tokenizeStudyLessonInline(text) {
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    if (text.startsWith('[[', i)) {
      const close = text.indexOf(']]', i + 2);
      if (close !== -1) {
        tokens.push({ type: 'term', value: text.slice(i + 2, close) });
        i = close + 2;
        continue;
      }
    }
    if (text.startsWith('**', i)) {
      const close = text.indexOf('**', i + 2);
      if (close !== -1) {
        tokens.push({ type: 'bold', value: text.slice(i + 2, close) });
        i = close + 2;
        continue;
      }
    }
    if (text[i] === '`') {
      const close = text.indexOf('`', i + 1);
      if (close !== -1) {
        tokens.push({ type: 'code', value: text.slice(i + 1, close) });
        i = close + 1;
        continue;
      }
    }
    let next = text.length;
    const nTerm = text.indexOf('[[', i);
    const nBold = text.indexOf('**', i);
    const nCode = text.indexOf('`', i);
    if (nTerm !== -1) next = Math.min(next, nTerm);
    if (nBold !== -1) next = Math.min(next, nBold);
    if (nCode !== -1) next = Math.min(next, nCode);
    if (next > i) {
      tokens.push({ type: 'text', value: text.slice(i, next) });
      i = next;
    } else {
      tokens.push({ type: 'text', value: text[i] });
      i += 1;
    }
  }
  return tokens;
}

function renderStudyLessonInlinePlain(text) {
  return tokenizeStudyLessonInline(text)
    .map((t) => t.value)
    .join('');
}

function findStudyInlineMarkupArtifacts(text) {
  const issues = [];
  if (/\\[*`]/.test(text)) issues.push('escaped \\* or \\` in source');
  const plain = renderStudyLessonInlinePlain(text);
  if (/\*\*/.test(plain)) issues.push('unparsed ** in rendered output');
  return issues;
}

const halluPath = path.join(repo, 'src/data/study/fundamentals-hallucination-cards.ts');
if (fs.existsSync(halluPath)) {
  const hallu = read(halluPath);
  const re = /'((?:\\.|[^'\\])*)'/g;
  let m;
  while ((m = re.exec(hallu)) !== null) {
    const raw = m[1].replace(/\\n/g, '\n');
    if (raw.includes('**QA-перевірка:**')) {
      errors.push(
        'fundamentals-hallucination-cards.ts: використайте qaCheckUk / type qaCheck, не **QA-перевірка:** у тексті',
      );
    }
    if (!/\*\*|`|#/.test(raw)) continue;
    for (const issue of findStudyInlineMarkupArtifacts(raw)) {
      errors.push(`fundamentals-hallucination-cards.ts: ${issue} — …${raw.slice(0, 56)}…`);
    }
  }
}

const flowStageCard = path.join(repo, 'src/components/lesson/StudyFlowStageCard.tsx');
if (fs.existsSync(flowStageCard) && /glyphForKey/.test(read(flowStageCard))) {
  errors.push('StudyFlowStageCard.tsx: не повертай glyphForKey (службові STP, Q, PAR …)');
}

const UI_HINT_FORBIDDEN = /Оберіть\s+(крок|картку|поняття|рівень|орієнтир|категорію|перевірку|збій|тему|поле|сценарій|принцип)\s+ліворуч/i;
const allowHintFiles = new Set(['StudyInteractionHint.tsx', 'StudyPageCardsHint.tsx']);
for (const file of walk(path.join(repo, 'src/components/lesson'), '.tsx')) {
  const base = path.basename(file);
  if (allowHintFiles.has(base)) continue;
  const src = read(file);
  if (src.includes('StudyInteractionHint')) {
    errors.push(`${path.relative(repo, file)}: не імпортуй StudyInteractionHint — лише StudyPageCardsHint на сторінці`);
  }
  if (UI_HINT_FORBIDDEN.test(src)) {
    errors.push(`${path.relative(repo, file)}: приберіть дубльовану UI-підказку «оберіть … ліворуч»`);
  }
}

console.log(`verify:study-standards — ${errors.length} error(s), ${warnings.length} warning(s)`);
if (warnings.length) {
  console.log('\nWarnings (переглянути):');
  warnings.slice(0, 40).forEach((w) => console.log('  •', w));
  if (warnings.length > 40) console.log(`  … +${warnings.length - 40}`);
}
if (errors.length) {
  console.log('\nErrors:');
  errors.forEach((e) => console.log('  ✗', e));
  process.exit(1);
}
console.log('OK');
