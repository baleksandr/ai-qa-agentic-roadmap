/**
 * Витягує panelMarkdownUk / prereq для docs/RAG_REVIEW_BUNDLE.md
 * Запуск: node scripts/extract-rag-panels-for-review.mjs
 */
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

function extractPanelBlocks(path, label) {
  const raw = readFileSync(join(root, path), 'utf8');
  const blocks = [];
  const re = /panelMarkdownUk:\s*(?:studyPanelMarkdown\(\[([\s\S]*?)\]\)|`([\s\S]*?)`|studyPanelMarkdown\(([\s\S]*?)\))/g;
  let m;
  let i = 0;
  while ((m = re.exec(raw))) {
    i += 1;
    const body = m[2] ?? m[1] ?? m[3] ?? '';
    blocks.push({ index: i, snippet: body.slice(0, 80).replace(/\s+/g, ' ') });
  }
  const prereq = raw.match(/export const RAG_ONE_QUERY_PREREQUISITE = \{([\s\S]*?)\};/);
  return { label, path, panelCount: blocks.length, prereq: !!prereq, rawLength: raw.length };
}

const files = [
  'src/data/study/rag-one-query-step-details.ts',
  'src/data/study/rag-data-chain-stage-details.ts',
  'src/data/study/rag-chain-stage-details.ts',
  'src/data/study/rag-pipeline-component-details.ts',
  'src/data/study/rag-qa-check-details.ts',
  'src/data/study/rag-production-details.ts',
];

for (const f of files) {
  console.log(JSON.stringify(extractPanelBlocks(f, f)));
}
