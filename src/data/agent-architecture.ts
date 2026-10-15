export type ArchitectureNodeKind = 'step' | 'optional';

export type ArchitectureNode = {
  id: string;
  kind: ArchitectureNodeKind;
  title: string;
  summary: string;
  topicId: string;
};

export type ArchitectureAnnotation = {
  id: string;
  label: string;
  summary: string;
  topicId: string;
  /** id вузла циклу, біля якого показувати */
  attachToNodeId: string;
};

/** Один цикл QA Regression Investigation Agent (навчальна схема). */
export const ARCHITECTURE_CYCLE: ArchitectureNode[] = [
  {
    id: 'playwright-failed',
    kind: 'step',
    title: 'Playwright test failed',
    summary:
      'У CI або локально з’явився червоний тест: report, trace і logs — вхідні артефакти для розслідування, а не «контекст у голові моделі».',
    topicId: 'lab-0',
  },
  {
    id: 'user-starts',
    kind: 'step',
    title: 'Користувач запускає розслідування',
    summary:
      'Людина формує мету (ticket, failure id) і стартує agent run. Це межа між людським рішенням і автоматизованим циклом агента.',
    topicId: 'lab-7',
  },
  {
    id: 'harness',
    kind: 'step',
    title: 'Agent Harness збирає контекст',
    summary:
      'Harness створює runId, збирає system prompt, дозволені артефакти, tool definitions і поточний state перед викликом LLM.',
    topicId: 'concept-04',
  },
  {
    id: 'llm-decide',
    kind: 'step',
    title: 'LLM обирає наступну дію',
    summary:
      'Модель отримує зібраний context і повертає рішення: який tool викликати або чи достатньо evidence для висновку.',
    topicId: 'concept-14',
  },
  {
    id: 'tool-calling',
    kind: 'step',
    title: 'Tool Calling',
    summary:
      'Рішення моделі структурується у виклик інструмента (ім’я, аргументи). Далі працює не LLM, а зареєстрований handler.',
    topicId: 'concept-10',
  },
  {
    id: 'ts-tool',
    kind: 'step',
    title: 'TypeScript-інструмент читає report / trace / logs',
    summary:
      'Deterministic код з дозволеними шляхами читає Playwright report, trace або логи й повертає спостереження в harness.',
    topicId: 'concept-10',
  },
  {
    id: 'observation',
    kind: 'step',
    title: 'Результат повертається в контекст',
    summary:
      'Tool result додається до state та наступного model call. Тут зустрічаються short-term history, checkpoints і memory.',
    topicId: 'concept-01',
  },
  {
    id: 'loop-or-done',
    kind: 'step',
    title: 'LLM: наступний крок або висновок із доказами',
    summary:
      'Orchestration/harness вирішує, чи продовжити цикл, зробити retry чи завершити run зі структурованим висновком для людини.',
    topicId: 'concept-02',
  },
];

export const ARCHITECTURE_OPTIONAL: ArchitectureNode[] = [
  {
    id: 'mcp',
    kind: 'optional',
    title: 'MCP (за потреби)',
    summary: 'Стандартизоване підключення зовнішніх tools/data — не обов’язкове в кожному run.',
    topicId: 'concept-06',
  },
  {
    id: 'rag',
    kind: 'optional',
    title: 'RAG (за потреби)',
    summary: 'Дістає знання з docs/runbooks у context, коли їх немає в report/trace.',
    topicId: 'concept-03',
  },
  {
    id: 'vector-db',
    kind: 'optional',
    title: 'Vector Database (за потреби)',
    summary: 'Сховище embeddings для retrieval — додається, коли потрібен семантичний пошук по великій базі.',
    topicId: 'concept-15',
  },
];

export const ARCHITECTURE_ANNOTATIONS: ArchitectureAnnotation[] = [
  {
    id: 'memory',
    label: 'Memory & State',
    summary: 'State поточного run і memory з минулого — що harness повертає в context перед LLM.',
    topicId: 'concept-01',
    attachToNodeId: 'observation',
  },
  {
    id: 'guardrails',
    label: 'Guardrails',
    summary: 'Обмеження дозволених tools, шляхів і дій перед/після tool call.',
    topicId: 'concept-17',
    attachToNodeId: 'tool-calling',
  },
  {
    id: 'observability',
    label: 'Observability',
    summary: 'Traces, логи переходів state, tool latency — видимість усього циклу run.',
    topicId: 'concept-18',
    attachToNodeId: 'harness',
  },
  {
    id: 'evals',
    label: 'Evals',
    summary: 'Повторювані вимірювання якості траєкторії агента на reference failures.',
    topicId: 'concept-05',
    attachToNodeId: 'loop-or-done',
  },
];
