import type { ArchitectureSchema } from '../../types/architecture-simulation';

export const TOOL_CALLING_SCHEMA: ArchitectureSchema = {
  id: 'tool-calling',
  tabLabel: 'Tool Calling',
  title: 'Tool Calling',
  subtitle: 'Модель пропонує виклик → код перевіряє → функція виконується → результат у context',
  disclaimer: 'Навчальна схема. LLM не виконує I/O — лише structured tool call.',
  svgLabel: 'Tool calling flow',
  viewW: 1000,
  viewH: 480,
  nodes: [
    { id: 'harness', label: 'Harness', shortLabel: 'Harness', role: 'code', topicId: 'concept-04', x: 80, y: 220, w: 140, h: 64, mobileOrder: 1 },
    { id: 'llm', label: 'LLM', shortLabel: 'LLM', role: 'llm', topicId: 'concept-10', x: 300, y: 220, w: 120, h: 64, mobileOrder: 2 },
    { id: 'validate', label: 'Validation / policy', shortLabel: 'Validate', role: 'code', topicId: 'concept-17', x: 480, y: 220, w: 160, h: 64, mobileOrder: 3 },
    { id: 'tool', label: 'Tool function', shortLabel: 'Tool', role: 'tool', topicId: 'concept-10', x: 700, y: 220, w: 140, h: 64, mobileOrder: 4 },
    { id: 'io', label: 'Report / API / CLI', shortLabel: 'I/O', role: 'data', topicId: 'lab-6', x: 700, y: 380, w: 150, h: 56, mobileOrder: 5 },
    { id: 'ctx', label: 'Model context', shortLabel: 'Context', role: 'data', topicId: 'concept-04', x: 300, y: 400, w: 140, h: 56, mobileOrder: 6 },
  ],
  edges: [
    { id: 'e-h-llm', from: 'harness', to: 'llm', label: 'schemas + messages' },
    { id: 'e-llm-v', from: 'llm', to: 'validate', label: 'tool_call' },
    { id: 'e-v-tool', from: 'validate', to: 'tool', label: 'allow' },
    { id: 'e-tool-io', from: 'tool', to: 'io', label: 'execute' },
    { id: 'e-io-tool', from: 'io', to: 'tool', label: 'raw data', cx: 820, cy: 300 },
    { id: 'e-tool-h', from: 'tool', to: 'harness', label: 'normalized result' },
    { id: 'e-h-ctx', from: 'harness', to: 'ctx', label: 'tool message' },
    { id: 'e-ctx-llm', from: 'ctx', to: 'llm', label: 'next turn' },
  ],
  steps: [
    {
      id: 't1', title: 'Schemas у запиті', activeNodes: ['harness', 'llm'], activeEdges: ['e-h-llm'], markerEdgeId: 'e-h-llm',
      panel: {
        what: 'Harness передає tool definitions разом із messages до API.', who: 'Harness (код).',
        input: 'tools[] + messages', output: 'LLM API request', why: 'Модель знає дозволені імена й аргументи.', risks: 'Занадто багато tools — поганий вибір.',
        qaAgent: 'readPlaywrightReport, readTrace — у whitelist regression agent.',
      },
    },
    {
      id: 't2', title: 'LLM пропонує виклик', activeNodes: ['llm', 'validate'], activeEdges: ['e-h-llm', 'e-llm-v'], markerEdgeId: 'e-llm-v',
      panel: {
        what: 'Structured output: tool name + JSON arguments.', who: 'LLM пропонує, не виконує.',
        input: 'Context', output: 'tool_call object', why: 'Розділення міркування й I/O.', risks: 'Hallucinated tool або args.',
        qaAgent: 'Модель обирає readReport після failure summary.',
      },
    },
    {
      id: 't3', title: 'Перевірка перед виконанням', activeNodes: ['validate', 'tool'], activeEdges: ['e-llm-v', 'e-v-tool'], markerEdgeId: 'e-v-tool',
      panel: {
        what: 'JSON schema, allow-list tool, path sandbox, guardrails.', who: 'TypeScript harness.',
        input: 'tool_call', output: 'allow | deny', why: 'Безпека та коректність.', risks: 'Пропуск небезпечного write tool.',
        qaAgent: 'Deny читання поза playwright-report/.',
      },
    },
    {
      id: 't4', title: 'Виконання tool', activeNodes: ['tool', 'io', 'harness'], activeEdges: ['e-v-tool', 'e-tool-io', 'e-io-tool', 'e-tool-h'], markerEdgeId: 'e-tool-io',
      panel: {
        what: 'Deterministic handler читає файл або викликає API.', who: 'Tool code / MCP adapter.',
        input: 'Validated args', output: 'Structured tool result', why: 'Факти з реальних систем.', risks: 'Timeout, великий payload.',
        qaAgent: 'HTML snippet з report у tool result message.',
      },
    },
    {
      id: 't5', title: 'Результат у наступний turn', activeNodes: ['harness', 'ctx', 'llm'], activeEdges: ['e-tool-h', 'e-h-ctx', 'e-ctx-llm'], markerEdgeId: 'e-ctx-llm',
      panel: {
        what: 'Harness додає role=tool message; цикл може повторитись.', who: 'Harness merge.',
        input: 'tool result', output: 'Оновлені messages', why: 'LLM бачить observation для наступного рішення.', risks: 'Цикл без max steps.',
        qaAgent: 'Після report — модель вирішує чи потрібен trace.',
      },
    },
  ],
};
