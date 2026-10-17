import type { ArchitectureSchema, SimAux, SimEdge, SimNode, SimStep } from '../../types/architecture-simulation';

const nodes: SimNode[] = [
  { id: 'human', label: 'Human / CI', shortLabel: 'Human / CI', role: 'human', topicId: 'lab-7', x: 40, y: 220, w: 150, h: 72, mobileOrder: 1 },
  { id: 'harness', label: 'Agent Harness', shortLabel: 'Harness', role: 'code', topicId: 'concept-04', x: 280, y: 200, w: 168, h: 80, mobileOrder: 3 },
  { id: 'llm', label: 'LLM', shortLabel: 'LLM', role: 'llm', topicId: 'concept-14', x: 560, y: 200, w: 140, h: 80, mobileOrder: 4 },
  { id: 'validation', label: 'Validation', shortLabel: 'Validation', role: 'code', topicId: 'concept-17', x: 430, y: 360, w: 160, h: 68, mobileOrder: 6 },
  { id: 'tools', label: 'TypeScript Tools', shortLabel: 'TS Tools', role: 'code', topicId: 'concept-10', x: 280, y: 480, w: 168, h: 72, mobileOrder: 7 },
  { id: 'artifacts', label: 'Playwright Failed', shortLabel: 'PW Failed', role: 'data', topicId: 'lab-0', x: 40, y: 460, w: 170, h: 72, mobileOrder: 8 },
  { id: 'state', label: 'State', shortLabel: 'State', role: 'code', topicId: 'concept-01', x: 300, y: 60, w: 128, h: 56, mobileOrder: 2 },
  { id: 'result', label: 'Result', shortLabel: 'Result', role: 'outcome', topicId: 'lab-8', x: 760, y: 420, w: 180, h: 80, mobileOrder: 9 },
];

const edges: SimEdge[] = [
  { id: 'e-human-harness', from: 'human', to: 'harness', label: 'start run' },
  { id: 'e-harness-llm', from: 'harness', to: 'llm', label: 'prompt' },
  { id: 'e-llm-harness-call', from: 'llm', to: 'validation', label: 'tool call', cx: 520, cy: 300 },
  { id: 'e-validation-tools', from: 'validation', to: 'tools', label: 'allow' },
  { id: 'e-tools-artifacts', from: 'tools', to: 'artifacts', label: 'read' },
  { id: 'e-artifacts-tools', from: 'artifacts', to: 'tools', label: 'files', cx: 120, cy: 520 },
  { id: 'e-tools-harness', from: 'tools', to: 'harness', label: 'result', cx: 280, cy: 400 },
  { id: 'e-harness-llm-loop', from: 'harness', to: 'llm', label: 'context', loop: true, cx: 420, cy: 120 },
  { id: 'e-harness-state', from: 'harness', to: 'state', label: 'state' },
  { id: 'e-harness-result', from: 'harness', to: 'result', label: 'final' },
  { id: 'e-llm-done', from: 'llm', to: 'harness', label: 'answer', cx: 480, cy: 140 },
];

const aux: SimAux[] = [
  { id: 'guardrails', label: 'Guardrails', summary: 'Перевірка tools, шляхів і аргументів навколо виклику.', topicId: 'concept-17' },
  { id: 'observability', label: 'Observability', summary: 'Traces і логи всього run паралельно циклу.', topicId: 'concept-18' },
  { id: 'evals', label: 'Evals', summary: 'Оцінка траєкторії після run, не всередині live-циклу.', topicId: 'concept-05' },
  { id: 'mcp', label: 'MCP (опційно)', summary: 'Альтернативний спосіб підключити tools.', topicId: 'concept-06', optional: true },
  { id: 'rag', label: 'RAG (опційно)', summary: 'Пошук знань, коли їх немає в report.', topicId: 'concept-03', optional: true },
];

const steps: SimStep[] = [
  {
    id: 's1', title: 'Playwright test failed', activeNodes: ['human', 'artifacts'], activeEdges: ['e-human-harness'], markerEdgeId: 'e-human-harness',
    panel: {
      what: 'Тест login.spec.ts завершився помилкою. Це сигнал почати розслідування, а не доказ причини збою.',
      who: 'Playwright у CI або локально виконав тест. Людина або CI окремо запускає агента.',
      input: 'test name, error text, paths to report / trace / logs (вміст файлів ще не читали).',
      output: 'Подія падіння та шляхи до артефактів.',
      recipient: 'Agent Harness.',
      why: 'Агент має знати, яке падіння розбирати і де шукати докази.',
      unknown: 'Чи баг у застосунку, тесті, даних чи середовищі.',
      risks: 'Відсутній артефакт, неправильний шлях, секрети в логах.',
      qaAgent: 'Після червоного regression у CI — старт run з ./playwright-report/.',
    },
  },
  {
    id: 's2', title: 'Harness prepares context', activeNodes: ['human', 'harness', 'state'], activeEdges: ['e-human-harness', 'e-harness-llm', 'e-harness-state'], markerEdgeId: 'e-harness-llm',
    panel: {
      what: 'Harness збирає runId, system prompt, опис помилки, tool schemas і записує state.',
      who: 'Agent Harness (TypeScript), не LLM.',
      input: 'messages[], tools[], metadata падіння, попередній state.',
      output: 'HTTP-запит до LLM API з повним context.',
      recipient: 'LLM provider.',
      why: 'Модель бачить лише те, що передали в prompt — не «магічно» знає про CI.',
      unknown: 'Який tool call запропонує модель.',
      risks: 'Занадто великий context, витік секретів у messages.',
      qaAgent: 'Дозволені tools: readReport, readLogs, readTrace у sandbox.',
    },
  },
  {
    id: 's3', title: 'LLM requests a tool', activeNodes: ['harness', 'llm', 'validation'], activeEdges: ['e-harness-llm', 'e-llm-harness-call'], markerEdgeId: 'e-llm-harness-call',
    panel: {
      what: 'LLM повертає structured tool call (ім’я + JSON args), наприклад readPlaywrightReport.',
      who: 'LLM пропонує. Диск і API ще не чіпали.',
      input: 'Context + tool definitions з harness.',
      output: 'Proposed tool call (ще без allow/deny).',
      recipient: 'Validation / policy у harness.',
      why: 'Спочатку зібрати факти з report, потім висновок.',
      unknown: 'Чи пройде path validation і policy.',
      risks: 'Вигаданий path, неіснуючий tool name.',
      qaAgent: 'Очікуваний перший крок — read report, не draft bug у Jira.',
    },
  },
  {
    id: 's4', title: 'Перевірка виклику', activeNodes: ['validation', 'llm', 'harness'], activeEdges: ['e-llm-harness-call', 'e-validation-tools'], markerEdgeId: 'e-validation-tools',
    panel: {
      what: 'Whitelist tool, sandbox path, schema args.', who: 'TypeScript harness + guardrails.',
      input: 'Tool call від LLM', output: 'allow | deny', why: 'Безпека перед виконанням.', risks: 'Path traversal.',
      qaAgent: 'Перевірка, що читаємо лише дозволену директорію звіту.',
    },
  },
  {
    id: 's5', title: 'TS читає report', activeNodes: ['tools', 'artifacts', 'harness'], activeEdges: ['e-validation-tools', 'e-tools-artifacts', 'e-artifacts-tools', 'e-tools-harness'], markerEdgeId: 'e-tools-harness',
    panel: {
      what: 'Handler readReport повертає snippet у harness.', who: 'TypeScript tool.',
      input: 'path до report', output: 'tool result message', why: 'Доказ у context для LLM.', risks: 'Великий HTML у context.',
      qaAgent: 'Фактичне читання playwright-report робить код, не модель.',
    },
  },
  {
    id: 's6', title: 'LLM: потрібні logs/trace', activeNodes: ['harness', 'llm', 'state'], activeEdges: ['e-harness-llm-loop', 'e-llm-harness-call'], markerEdgeId: 'e-harness-llm-loop',
    panel: {
      what: 'Модель запитує ще tool після report.', who: 'LLM + harness цикл.',
      input: 'Context + попередній result', output: 'Новий tool call', why: 'Петля agentic run.', risks: 'Без max steps — нескінченний цикл.',
      qaAgent: 'Типовий другий крок — trace або CI logs для login failure.',
    },
  },
  {
    id: 's7', title: 'Читання logs/trace', activeNodes: ['tools', 'artifacts', 'harness', 'llm'], activeEdges: ['e-validation-tools', 'e-tools-artifacts', 'e-tools-harness', 'e-harness-llm-loop'], markerEdgeId: 'e-tools-harness',
    panel: {
      what: 'Повтор tool chain → результат у harness → знову LLM.', who: 'TS tools + harness.',
      input: 'readTrace / readLogs', output: 'Фрагменти в context', why: 'Зв’язати symptom з кроком тесту.', risks: 'Trace занадто великий.',
      qaAgent: 'Агент збирає докази перед draft bug report.',
    },
  },
  {
    id: 's8', title: 'Висновок і stop', activeNodes: ['llm', 'harness', 'result', 'state'], activeEdges: ['e-llm-done', 'e-harness-result', 'e-harness-state'], markerEdgeId: 'e-harness-result',
    panel: {
      what: 'Structured висновок, валідація schema, кінець run.', who: 'LLM текст, harness stop rules.',
      input: 'Повний context', output: 'summary + evidence + draftBug', why: 'Артефакт для людини.', risks: 'Висновок без evidence.',
      qaAgent: 'Результат — висновок з посиланнями на report/trace або «даних недостатньо».',
    },
  },
];

export const AGENT_SCHEMA: ArchitectureSchema = {
  id: 'agent',
  tabLabel: 'Агент: загальний цикл',
  title: 'Загальна схема агента',
  subtitle: 'Один навчальний run QA Regression Investigation Agent',
  disclaimer: 'Навчальна симуляція. Не реальний agent run і не виконує код на вашій машині.',
  svgLabel: 'Загальний цикл QA Regression Investigation Agent',
  viewW: 1000,
  viewH: 520,
  nodes,
  edges,
  steps,
  exitConditions: [
    'Достатньо доказів — фінальна відповідь після валідації.',
    'Ліміт кроків — harness зупиняє цикл.',
    'Помилка tool/API — run завершується з помилкою.',
  ],
  aux,
  optionalToggleLabel: 'Показати MCP / RAG (опційно)',
};
