import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const concepts = [
  [1, 'memory-state', 'Memory & State'],
  [2, 'orchestration', 'Orchestration'],
  [3, 'rag', 'RAG'],
  [4, 'agent-harness', 'Agent Harness'],
  [5, 'evals', 'Evals'],
  [6, 'mcp', 'MCP'],
  [7, 'skills', 'Skills'],
  [8, 'a2a', 'A2A'],
  [9, 'multi-agent-system', 'Multi-Agent System'],
  [10, 'tool-calling', 'Tool Calling'],
  [11, 'planning', 'Planning'],
  [12, 'reasoning', 'Reasoning'],
  [13, 'fine-tuning', 'Fine-tuning'],
  [14, 'prompt-engineering', 'Prompt Engineering'],
  [15, 'vector-database', 'Vector Database'],
  [16, 'agentic-workflows', 'Agentic Workflows'],
  [17, 'guardrails', 'Guardrails'],
  [18, 'observability', 'Observability'],
  [19, 'evaluation-benchmarks', 'Evaluation Benchmarks'],
  [20, 'agents-production', 'AI Agents in Production'],
];

const template = fs.readFileSync(path.join(root, 'content/_stub-template.md'), 'utf8');

function writeStub(filePath, title, docxSection) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  if (fs.existsSync(filePath)) return;
  const body = template
    .replaceAll('{{TITLE}}', title)
    .replaceAll('{{DOCX_SECTION}}', docxSection);
  fs.writeFileSync(filePath, body, 'utf8');
}

for (const [num, slug, name] of concepts) {
  const id = String(num).padStart(2, '0');
  writeStub(
    path.join(root, `content/concepts/${id}-${slug}.md`),
    `Concept ${id} — ${name}`,
    `PART II — Concept ${num}`,
  );
}

writeStub(
  path.join(root, 'content/fundamentals/ai-llm-fundamentals.md'),
  'AI / LLM Fundamentals',
  'Fundamentals (DOCX)',
);

writeStub(
  path.join(root, 'content/reference/reference-library.md'),
  'Reference Library',
  'Reference Library (DOCX)',
);

for (let n = 0; n <= 9; n++) {
  writeStub(
    path.join(root, `content/labs/lab-${n}.md`),
    `Lab ${n} — QA Regression Investigation Agent`,
    `Lab ${n} (DOCX)`,
  );
}

console.log('Stubs created (skipped existing files).');
