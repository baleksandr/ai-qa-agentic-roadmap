import type { ArchitectureSchema } from '../../types/architecture-simulation';

export const COMBINED_SCHEMA: ArchitectureSchema = {
  id: 'combined',
  tabLabel: 'У спільному агенті',
  title: 'QA Regression Investigation Agent',
  subtitle: 'CAG, RAG, tools/MCP і harness в одному run (не ланцюг RAG→CAG→MCP)',
  disclaimer: 'Навчальна схема: блоки RAG і MCP опційні залежно від сценарію. Обов’язкові для демо: harness, LLM, tools до артефактів, CAG rules.',
  svgLabel: 'Комбінована архітектура QA regression agent',
  viewW: 1040,
  viewH: 560,
  nodes: [
    { id: 'fail', label: 'Playwright failed', shortLabel: 'Failure', role: 'human', topicId: 'lab-7', x: 30, y: 40, w: 150, h: 56, mobileOrder: 1 },
    { id: 'harness', label: 'Harness', shortLabel: 'Harness', role: 'code', topicId: 'concept-04', x: 220, y: 120, w: 150, h: 64, mobileOrder: 2 },
    { id: 'cag', label: 'CAG: QA rules / bug format', shortLabel: 'CAG', role: 'data', topicId: 'concept-20', x: 30, y: 200, w: 180, h: 56, mobileOrder: 3 },
    { id: 'rag', label: 'RAG Incidents', shortLabel: 'RAG', role: 'data', topicId: 'concept-03', x: 30, y: 300, w: 180, h: 56, mobileOrder: 4, optional: true },
    { id: 'tools', label: 'TS tools / MCP', shortLabel: 'Tools', role: 'tool', topicId: 'concept-10', x: 420, y: 280, w: 150, h: 56, mobileOrder: 5 },
    { id: 'artifacts', label: 'Report, trace, Jira', shortLabel: 'Artifacts', role: 'data', topicId: 'lab-6', x: 620, y: 280, w: 160, h: 56, mobileOrder: 6 },
    { id: 'llm', label: 'LLM', shortLabel: 'LLM', role: 'llm', topicId: 'concept-14', x: 420, y: 120, w: 120, h: 64, mobileOrder: 7 },
    { id: 'validate', label: 'Validation', shortLabel: 'Validate', role: 'code', topicId: 'concept-05', x: 600, y: 120, w: 140, h: 64, mobileOrder: 8 },
    { id: 'out', label: 'Result', shortLabel: 'Result', role: 'outcome', topicId: 'lab-8', x: 800, y: 120, w: 200, h: 64, mobileOrder: 9 },
  ],
  edges: [
    { id: 'e-fail-harness', from: 'fail', to: 'harness', label: 'failure event' },
    { id: 'e-cag-harness', from: 'cag', to: 'harness', label: 'stable rules' },
    { id: 'e-rag-harness', from: 'rag', to: 'harness', label: 'retrieved chunks', optional: true },
    { id: 'e-harness-llm', from: 'harness', to: 'llm', label: 'context' },
    { id: 'e-llm-validate', from: 'llm', to: 'validate', label: 'tool call?' },
    { id: 'e-validate-tools', from: 'validate', to: 'tools', label: 'approved' },
    { id: 'e-tools-artifacts', from: 'tools', to: 'artifacts', label: 'read' },
    { id: 'e-artifacts-harness', from: 'artifacts', to: 'harness', label: 'evidence', cx: 500, cy: 400 },
    { id: 'e-validate-out', from: 'validate', to: 'out', label: 'stop OK' },
    { id: 'e-harness-loop', from: 'harness', to: 'llm', label: 'loop', cx: 320, cy: 80, optional: true },
  ],
  steps: [
    {
      id: 'x1', title: 'Старт run', activeNodes: ['fail', 'harness', 'cag'], activeEdges: ['e-fail-harness', 'e-cag-harness'], markerEdgeId: 'e-fail-harness',
      panel: {
        what: 'Harness отримує signal про failed test і підключає CAG rules (bug format, severity).', who: 'Harness (код).',
        input: 'test name, error snippet', output: 'Initial messages + policy', why: 'Стабільний QA context без retrieval.', risks: 'Без harness — хаотичні виклики API.',
        qaAgent: 'Обов’язковий блок для демо regression investigation.',
      },
    },
    {
      id: 'x2', title: 'Опційний RAG', activeNodes: ['rag', 'harness'], activeEdges: ['e-rag-harness'], markerEdgeId: 'e-rag-harness',
      panel: {
        what: 'Якщо потрібно — programmatic search схожих інцидентів, chunks у context.', who: 'Search code, не LLM.',
        input: 'Query з harness', output: '0..N evidence chunks', why: 'Не завжди потрібен для простого flake.', risks: 'Шумні chunks гірше ніж без RAG.',
        qaAgent: 'Опційно: велика база postmortems — увімкнути retrieval.',
      },
    },
    {
      id: 'x3', title: 'LLM аналізує докази', activeNodes: ['harness', 'llm'], activeEdges: ['e-harness-llm', 'e-harness-loop'], markerEdgeId: 'e-harness-llm',
      panel: {
        what: 'Модель бачить failure + rules + (можливо) RAG hits, пропонує наступну дію.', who: 'LLM.',
        input: 'messages', output: 'text або tool_call', why: 'Центр міркування, не виконавець tools.', risks: 'Hallucinated root cause.',
        qaAgent: '«Спочатку readPlaywrightReport».',
      },
    },
    {
      id: 'x4', title: 'Validation + tools/MCP', activeNodes: ['llm', 'validate', 'tools', 'artifacts'], activeEdges: ['e-llm-validate', 'e-validate-tools', 'e-tools-artifacts', 'e-artifacts-harness'], markerEdgeId: 'e-tools-artifacts',
      panel: {
        what: 'Код перевіряє tool call, TS tool або MCP client читає report/trace/Jira.', who: 'Validate = код, read = tool/server.',
        input: 'Approved tool + args', output: 'Structured evidence', why: 'Актуальні дані з систем, не з пам’яті моделі.', risks: 'MCP down — fallback policy.',
        qaAgent: 'Обов’язковий доступ до артефактів для демо; MCP — один із способів.',
      },
    },
    {
      id: 'x5', title: 'Петля або завершення', activeNodes: ['harness', 'llm', 'validate', 'out'], activeEdges: ['e-artifacts-harness', 'e-harness-loop', 'e-validate-out'], markerEdgeId: 'e-validate-out',
      panel: {
        what: 'Harness додає evidence, знову LLM, поки не stop condition: висновок з доказами або honest insufficient data.', who: 'Harness керує циклом, LLM пропонує.',
        input: 'New tool results', output: 'Final report / stop', why: 'Умови зупинки в коді, не лише «модель сказала стоп».', risks: 'Max steps без висновку.',
        qaAgent: 'Результат: bug draft з citations або «потрібен trace вручну».',
      },
    },
  ],
  optionalToggleLabel: 'Показати опційний RAG',
};
