import { TC_ONE_FLOW_RUNTIME_STEPS } from './tool-calling-runtime-steps';

export type ToolCallingStage = {
  index: number;
  titleUk: string;
  /** Дослівно з §2 markdown (runtime крок) */
  summaryUk: string;
  qaUk: string;
};

const MECHANISM_TITLES = [
  'Harness і tool schemas',
  'LLM: tool_call',
  'Validation і policy',
  'Tool handler і I/O',
  'Tool result у context',
] as const;

const QA_BY_STEP: Record<number, string> = {
  1: 'У trace на кожному кроці — та сама версія списку tools, що й у запиті.',
  2: 'Golden context → очікуваний перший tool (не обов’язково біт-в-біт args).',
  3: 'При deny немає executor span; rule id і причина — у trace.',
  4: 'Шлях лише в sandbox (наприклад playwright-report/).',
  5: 'max_steps не перевищено; у snippet лишився фрагмент, важливий для висновку.',
};

export const TOOL_CALLING_STAGES: ToolCallingStage[] = TC_ONE_FLOW_RUNTIME_STEPS.map((s, i) => ({
  index: s.step,
  titleUk: MECHANISM_TITLES[i] ?? `Крок ${s.step}`,
  summaryUk: s.lessonUk,
  qaUk: QA_BY_STEP[s.step] ?? '',
}));
