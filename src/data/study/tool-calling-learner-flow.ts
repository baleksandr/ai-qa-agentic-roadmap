/** Єдиний навчальний ланцюг: один run `login_spec` = повний механізм (hero, §3 ribbon). */
export const TOOL_CALLING_LEARNER_FLOW_STAGES: string[] = [
  'CI summary',
  'Harness',
  'LLM (tool_call)',
  'validation / policy',
  'handler',
  'результат у messages',
  'LLM',
];

export const TOOL_CALLING_LEARNER_FLOW_ARROW_LINE = TOOL_CALLING_LEARNER_FLOW_STAGES.join(' → ');

/** Перший ряд схеми §3 / hero: вхід + пропозиція; другий — виконання і відповідь. */
export const TOOL_CALLING_LEARNER_FLOW_FIRST_ROW = 4;
