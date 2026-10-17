/**
 * Генерує markdown-додаток з панелей для docs/RAG_REVIEW_BUNDLE.md
 * node scripts/build-rag-review-bundle-appendix.mjs > docs/_rag_panels_generated.md
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function extractBacktickPanels(src, fileLabel) {
  const out = [`## Панелі з \`${fileLabel}\`\n`];
  const titleRe = /titleUk:\s*'([^']+)'/g;
  const titles = [...src.matchAll(titleRe)].map((m) => m[1]);
  const panelRe = /panelMarkdownUk:\s*`([\s\S]*?)`/g;
  const panels = [...src.matchAll(panelRe)].map((m) => m[1].trim());
  const studyPanelBlocks = [...src.matchAll(/panelMarkdownUk:\s*studyPanelMarkdown\(\[([\s\S]*?)\]\)/g)].map(
    (m) => m[1],
  );

  let pi = 0;
  let si = 0;
  const lines = src.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].match(/titleUk:\s*'([^']+)'/);
    if (!t) continue;
    const title = t[1];
    const rest = lines.slice(i, i + 40).join('\n');
    let body = '';
    if (rest.includes('panelMarkdownUk: `')) {
      const m = rest.match(/panelMarkdownUk:\s*`([\s\S]*?)`/);
      body = m?.[1]?.trim() ?? '';
    } else if (rest.includes('panelMarkdownUk: studyPanelMarkdown')) {
      const block = studyPanelBlocks[si++];
      body = block
        .replace(/label:\s*'([^']+)'/g, '\n**$1**\n')
        .replace(/body:\s*\n?\s*'([^']*)'/g, (_, b) => b + '\n')
        .replace(/body:\s*\n?\s*"([^"]*)"/g, (_, b) => b + '\n')
        .replace(/,\s*$/gm, '');
    }
    if (body) {
      out.push(`### ${title}\n\n${body}\n`);
      pi++;
    }
  }
  out.push(`\n_Витягнуто panel-блоків (backtick + studyPanelMarkdown): ~${pi}_\n`);
  return out.join('\n');
}

function extractPrereq(src) {
  const m = src.match(/panelMarkdownUk:\s*`([\s\S]*?)`,\s*terms:/);
  if (!m) {
    const m2 = src.match(/RAG_ONE_QUERY_PREREQUISITE = \{[\s\S]*?panelMarkdownUk:\s*`([\s\S]*?)`/);
    return m2?.[1]?.trim() ?? '';
  }
  return '';
}

const oneQuery = readFileSync(join(root, 'src/data/study/rag-one-query-step-details.ts'), 'utf8');
const prereqSrc = readFileSync(join(root, 'src/data/study/rag-query-flow-steps.ts'), 'utf8');
const prereqMd = prereqSrc.match(/panelMarkdownUk:\s*`([\s\S]*?)`/)?.[1]?.trim() ?? '';

console.log('# Додаток: повні тексти інтерактивних панелей (автогенерація)\n');
console.log('> Згенеровано `scripts/build-rag-review-bundle-appendix.mjs` з TS-джерел. Терміни (`terms[]`) дублюються в UI як `StudyPanelTerms` під панеллю.\n');

console.log('## Передумова run (`rag-query-flow-steps.ts`)\n');
console.log(prereqMd);
console.log('\n');
console.log(extractBacktickPanels(oneQuery, 'rag-one-query-step-details.ts'));

for (const f of [
  'src/data/study/rag-data-chain-stage-details.ts',
  'src/data/study/rag-chain-stage-details.ts',
  'src/data/study/rag-pipeline-component-details.ts',
]) {
  const src = readFileSync(join(root, f), 'utf8');
  console.log(extractBacktickPanels(src, f));
}

// QA + production — meansUk fields
function extractQaProduction(path, label) {
  const src = readFileSync(join(root, path), 'utf8');
  console.log(`## Панелі \`${label}\` (meansUk / whyUk / howUk / qaUk)\n`);
  const entries = [...src.matchAll(/^\s{2}([^:\n{]+):\s*\{/gm)];
  for (const e of entries) {
    const key = e[1].trim().replace(/^'|'$/g, '');
    const start = e.index;
    const slice = src.slice(start, start + 2500);
    const means = slice.match(/meansUk:\s*\n?\s*'([^']*)'/)?.[1];
    const why = slice.match(/whyUk:\s*\n?\s*'([^']*)'/)?.[1];
    const how = slice.match(/howUk:\s*\n?\s*'([^']*)'/)?.[1];
    const qa = slice.match(/qaUk:\s*\n?\s*'([^']*)'/)?.[1];
    if (!means && !slice.includes('meansUk:')) continue;
    console.log(`### ${key}\n`);
    if (means) console.log(`**Що це?** ${means}\n`);
    if (why) console.log(`**Навіщо?** ${why}\n`);
    if (how) console.log(`**Як?** ${how}\n`);
    if (qa) console.log(`**QA.** ${qa}\n`);
  }
}

extractQaProduction('src/data/study/rag-qa-check-details.ts', 'rag-qa-check-details.ts');
extractQaProduction('src/data/study/rag-production-details.ts', 'rag-production-details.ts');
