/**
 * Тексти §2 «Один виклик tool у run investigation» — джерело: content/concepts/10-tool-calling.md
 * (не вигадувати; зміни спочатку в markdown, потім тут).
 */
export const TC_ONE_FLOW_INTRO =
  'Навчальний приклад (умовно): після таймауту `#login-btn` harness уже передав LLM tool schemas і короткий опис збою з CI. Модель пропонує перший крок — прочитати HTML звіт.';

export const TC_ONE_FLOW_ALLOW_LIST_FENCE = `allow-list tools: readPlaywrightReport(path), readTrace(...), …  — оголошує harness`;

export const TC_ONE_FLOW_TOOL_CALL_FENCE = `tool_call (пропозиція LLM):
  name: readPlaywrightReport
  arguments: { "path": "./playwright-report/index.html" }`;

export type ToolCallingRuntimeStep = {
  step: number;
  /** Дослівно з markdown **Крок N.** */
  lessonUk: string;
};

export const TC_ONE_FLOW_RUNTIME_STEPS: ToolCallingRuntimeStep[] = [
  {
    step: 1,
    lessonUk: 'Harness отримав failure summary з CI (код, не LLM).',
  },
  {
    step: 2,
    lessonUk: 'LLM повертає `tool_call` — пропозиція виклику, не виконання I/O.',
  },
  {
    step: 3,
    lessonUk: 'Validation: schema, sandbox path (лише `playwright-report/`), policy allow/deny.',
  },
  {
    step: 4,
    lessonUk: 'Tool handler читає файл; диск і мережа — у handler, не в LLM.',
  },
  {
    step: 5,
    lessonUk: 'Harness додає `role=tool` message (часто обрізаний snippet) → наступний turn LLM.',
  },
];

export const TC_ONE_FLOW_TRACE_NOTE =
  'У trace має бути ланцюг: proposed call → allow/deny → duration → розмір result.';
