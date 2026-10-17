import type { ArchitectureSchema } from '../../types/architecture-simulation';

export const HARNESS_SCHEMA: ArchitectureSchema = {
  id: 'harness',
  tabLabel: 'Agent Harness',
  title: 'Agent Harness',
  subtitle: 'Код збирає context, керує циклом, лімітами та завершенням run',
  disclaimer: 'Harness — deterministic оболонка навколо LLM. Навчальна симуляція циклу run.',
  svgLabel: 'Agent harness loop',
  viewW: 1000,
  viewH: 500,
  nodes: [
    { id: 'trigger', label: 'Run Start', shortLabel: 'Start', role: 'human', topicId: 'lab-7', x: 40, y: 240, w: 150, h: 56, mobileOrder: 1 },
    { id: 'harness', label: 'Harness', shortLabel: 'Harness', role: 'code', topicId: 'concept-04', x: 240, y: 200, w: 160, h: 72, mobileOrder: 2 },
    { id: 'state', label: 'State / runId', shortLabel: 'State', role: 'data', topicId: 'concept-01', x: 240, y: 80, w: 140, h: 56, mobileOrder: 3 },
    { id: 'builder', label: 'Context builder', shortLabel: 'Context', role: 'code', topicId: 'concept-04', x: 460, y: 120, w: 150, h: 64, mobileOrder: 4 },
    { id: 'llm', label: 'LLM', shortLabel: 'LLM', role: 'llm', topicId: 'concept-14', x: 680, y: 120, w: 120, h: 64, mobileOrder: 5 },
    { id: 'tools', label: 'Tools / validation', shortLabel: 'Tools', role: 'tool', topicId: 'concept-10', x: 680, y: 280, w: 150, h: 64, mobileOrder: 6 },
    { id: 'stop', label: 'Stop rules', shortLabel: 'Stop', role: 'code', topicId: 'concept-04', x: 460, y: 400, w: 140, h: 56, mobileOrder: 7 },
    { id: 'out', label: 'Run Result', shortLabel: 'Result', role: 'outcome', topicId: 'lab-8', x: 820, y: 400, w: 150, h: 64, mobileOrder: 8 },
  ],
  edges: [
    { id: 'e-tr-h', from: 'trigger', to: 'harness', label: 'goal + artifacts' },
    { id: 'e-h-state', from: 'harness', to: 'state', label: 'init / update' },
    { id: 'e-h-builder', from: 'harness', to: 'builder', label: 'assemble' },
    { id: 'e-builder-llm', from: 'builder', to: 'llm', label: 'messages' },
    { id: 'e-llm-tools', from: 'llm', to: 'tools', label: 'tool_call | text' },
    { id: 'e-tools-h', from: 'tools', to: 'harness', label: 'observation' },
    { id: 'e-h-loop', from: 'harness', to: 'builder', label: 'next step', loop: true, cx: 360, cy: 300 },
    { id: 'e-h-stop', from: 'harness', to: 'stop', label: 'check limits' },
    { id: 'e-stop-out', from: 'stop', to: 'out', label: 'final' },
  ],
  steps: [
    {
      id: 'h1', title: 'Ініціалізація run', activeNodes: ['trigger', 'harness', 'state'], activeEdges: ['e-tr-h', 'e-h-state'], markerEdgeId: 'e-tr-h',
      panel: {
        what: 'runId, початковий state, шлях до артефактів, ліміти кроків.', who: 'Harness (код).',
        input: 'Failure event', output: 'state JSON', why: 'Відновлюваний і керований запуск.', risks: 'Без state — хаотичні повтори.',
        qaAgent: 'Regression investigation стартує з test name + report path.',
      },
    },
    {
      id: 'h2', title: 'Збір context', activeNodes: ['harness', 'builder', 'llm'], activeEdges: ['e-h-builder', 'e-builder-llm'], markerEdgeId: 'e-builder-llm',
      panel: {
        what: 'System prompt, tools, history, tool results, RAG/CAG блоки за політикою.', who: 'Context builder у harness.',
        input: 'state + policies', output: 'messages[]', why: 'LLM бачить лише передане.', risks: 'Context overflow.',
        qaAgent: 'CAG rules + останні tool results у messages.',
      },
    },
    {
      id: 'h3', title: 'Відповідь моделі', activeNodes: ['llm', 'tools'], activeEdges: ['e-builder-llm', 'e-llm-tools'], markerEdgeId: 'e-llm-tools',
      panel: {
        what: 'Текст (можливий фінал) або tool call.', who: 'LLM.',
        input: 'messages', output: 'completion', why: 'Probabilistic рішення в циклі.', risks: 'Невалідний JSON tool call.',
        qaAgent: 'Перший виклик часто readPlaywrightReport.',
      },
    },
    {
      id: 'h4', title: 'Tool path або текст', activeNodes: ['tools', 'harness', 'stop'], activeEdges: ['e-llm-tools', 'e-tools-h', 'e-h-stop'], markerEdgeId: 'e-tools-h',
      panel: {
        what: 'Validation + tool execution; state оновлюється observation.', who: 'Harness + tools (код).',
        input: 'tool_call or final text', output: 'state++ / candidate final', why: 'Замикає agent loop.', risks: 'Tool exception без retry policy.',
        qaAgent: 'Evidence з report додається в state перед наступним LLM call.',
      },
    },
    {
      id: 'h5', title: 'Петля або завершення', activeNodes: ['harness', 'builder', 'stop', 'out'], activeEdges: ['e-h-loop', 'e-h-stop', 'e-stop-out'], markerEdgeId: 'e-stop-out',
      panel: {
        what: 'max_steps, достатньо evidence, structured final, human gate.', who: 'Stop rules у harness (код).',
        input: 'state + last output', output: 'continue | final answer', why: 'Агент не нескінченний.', risks: 'Stop занадто рано — «даних недостатньо» без спроб.',
        qaAgent: 'Фінальний bug draft або honest insufficient data.',
      },
    },
  ],
  exitConditions: [
    'Structured final answer пройшла schema validation.',
    'Досягнуто max_steps — graceful stop.',
    'Критична помилка tool/API — run failed з trace.',
  ],
};
