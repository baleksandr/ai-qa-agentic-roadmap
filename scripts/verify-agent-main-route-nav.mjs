/**
 * Перевірка довжини списку основного маршруту для навігації «Перехід».
 * Запуск: node scripts/verify-agent-main-route-nav.mjs
 */
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

// Minimal inline mirror of getAgentMainRouteTransitionEdgeIds logic for CI without TS import
const STATE_AFTER_START = ['e-harness-state-write', 'e-state-harness-read'];
const MAIN_ROUTE_SPINE = [
  'e-human-harness',
  ...STATE_AFTER_START,
  'e-harness-llm',
  'e-llm-harness-call',
  'e-validation-tools',
  'e-tools-tool-ingest',
  'e-tool-ingest-llm-refine',
  'e-llm-refine-prepare',
  'e-prepare-result',
];
const RAG = ['e-harness-rag-query', 'e-rag-rag-enrich', 'e-rag-enrich-llm'];
const MCP = ['e-validation-mcp', 'e-mcp-tools'];

function buildIds(present, flags) {
  const ids = [];
  for (const edgeId of MAIN_ROUTE_SPINE) {
    if (edgeId === 'e-harness-llm' && flags.showRag) {
      for (const id of RAG) if (present.has(id)) ids.push(id);
      continue;
    }
    if (edgeId === 'e-validation-tools' && flags.showMcp) {
      for (const id of MCP) if (present.has(id)) ids.push(id);
      continue;
    }
    if (present.has(edgeId)) ids.push(edgeId);
  }
  return ids;
}

const schemaPath = new URL('../src/data/architecture/schema-agent.ts', import.meta.url);
const text = readFileSync(schemaPath, 'utf8');
const edgeIds = [...text.matchAll(/id: '(e-[^']+)'/g)].map((m) => m[1]);
const basePresent = new Set(edgeIds.filter((id) => id.startsWith('e-')));

const cases = [
  { label: 'no opts', flags: { showRag: false, showMcp: false }, want: 10 },
  { label: 'RAG', flags: { showRag: true, showMcp: false }, want: 12 },
  { label: 'MCP', flags: { showRag: false, showMcp: true }, want: 11 },
  { label: 'both', flags: { showRag: true, showMcp: true }, want: 13 },
];

for (const c of cases) {
  const present = new Set(basePresent);
  if (c.flags.showRag) {
    present.delete('e-harness-llm');
    RAG.forEach((id) => present.add(id));
  }
  if (c.flags.showMcp) {
    present.delete('e-validation-tools');
    MCP.forEach((id) => present.add(id));
  }
  const ids = buildIds(present, c.flags);
  const ok = ids.length === c.want;
  console.log(`${ok ? 'OK' : 'FAIL'} ${c.label}: ${ids.length} (want ${c.want})`, ids.join(', '));
  if (!ok) process.exitCode = 1;
}
