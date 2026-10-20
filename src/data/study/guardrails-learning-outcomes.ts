/** «Що я зрозумію» — concept-17 Guardrails (компактні Neon HUD картки). */

export const GUARDRAILS_LEARNING_OUTCOMES_LEAD_UK =
  'Ви зрозумієте, чому промпт не гарантує безпеку, як Guardrails перевіряють дії моделі та як працюють schema, policy, approval і executor.';

export type GuardrailsLearningOutcomeStage = {
  titleUk: string;
  bodyUk: string;
};

export const GUARDRAILS_LEARNING_OUTCOME_STAGES: GuardrailsLearningOutcomeStage[] = [
  {
    titleUk: 'Пропозиція ≠ дозвіл',
    bodyUk: 'Модель пропонує дію, але код перевіряє, чи дозволено її виконувати.',
  },
  {
    titleUk: 'Schema — формат',
    bodyUk: 'Перевіряє поля, типи й параметри. Валідні дані не гарантують доступу.',
  },
  {
    titleUk: 'Policy — доступ',
    bodyUk:
      '`ALLOW` — дозволити · `DENY` — заборонити · `NEEDS_APPROVAL` — погодження.',
  },
  {
    titleUk: 'Approval та Executor',
    bodyUk:
      'Якщо потрібне погодження, виконання чекає. `Executor` запускає дію лише після перевірки дозволу.',
  },
  {
    titleUk: 'QA — безпека',
    bodyUk:
      'Перевір блокування заборонених дій, відсутність побічних ефектів і захист від `prompt injection`.',
  },
];

export type GuardrailsSummaryCard = {
  titleUk: string;
  bodyUk: string;
};

export const GUARDRAILS_SUMMARY_CARDS: GuardrailsSummaryCard[] = [
  {
    titleUk: 'Пропозиція ≠ дозвіл',
    bodyUk:
      'Модель пропонує текст або tool_call. Система перевіряє схему та права. Рішення ALLOW, DENY або NEEDS_APPROVAL приймає контрольний код, а не LLM.',
  },
  {
    titleUk: 'Приклад login_spec',
    bodyUk:
      'readPlaywrightReport — дозволено за наявності прав; createJiraIssue — погодження, якщо цього вимагає політика; deleteProductionDb — відмова, якщо інструмент або права не дозволяють операцію.',
  },
  {
    titleUk: 'Що перевіряє QA',
    bodyUk:
      'Невідомий інструмент не виконується; некоректна схема блокує виклик; DENY не спричиняє побічного ефекту; prompt injection не обходить policy; рішення та причини можна перевірити в аудиті.',
  },
];
