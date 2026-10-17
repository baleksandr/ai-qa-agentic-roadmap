export type ProcessStepHelp = {
  titleUk: string;
  explainUk: string;
  actor: 'code' | 'llm' | 'human' | 'code+llm';
  actorLabel: string;
  qaUk: string;
};

export const GUARDRAILS_UNDER_THE_HOOD_INTRO =
  'Під капотом — **один прохід guardrails на кожну відповідь або tool call**: спочатку код фільтрує вхід, потім LLM лише **пропонує**, далі знову **код** перевіряє формат і права, за потреби зупиняється на **людині**, і лише після allow щось реально виконується. Модель сама не «дозволяє» небезпечні дії.';

/** Ключ — нормалізований початок рядка з уроку (EN) */
const STEP_HELP: Array<{ match: RegExp; help: ProcessStepHelp }> = [
  {
    match: /input checks/i,
    help: {
      titleUk: 'Перевірка всього, що йде в модель',
      explainUk:
        'Промпт, RAG-фрагменти й вкладення проходять input checks: розмір, ін’єкції, заборонений контент, PII. Погане не потрапляє в context LLM.',
      actor: 'code',
      actorLabel: 'Код (input validator)',
      qaUk: 'Перед розслідуванням regression — перевірка, що в context не потрапили сирі секрети з trace.',
    },
  },
  {
    match: /model генерує|generates response/i,
    help: {
      titleUk: 'Модель пропонує текст або tool call',
      explainUk:
        'LLM генерує відповідь або structured tool call (ім’я tool + аргументи). Це пропозиція виклику, не виконання side effect.',
      actor: 'llm',
      actorLabel: 'LLM',
      qaUk: 'Наприклад: модель пропонує виклик readPlaywrightReport — це ще не читання диска, лише пропозиція.',
    },
  },
  {
    match: /validator перевіряє schema|structured validator/i,
    help: {
      titleUk: 'Перевірка формату виклику',
      explainUk:
        'Harness перевіряє JSON/schema: чи існує tool, чи типи аргументів правильні, чи немає зайвих полів.',
      actor: 'code',
      actorLabel: 'Код (schema validator)',
      qaUk: 'Відхилення вигаданого path до report або невалідного JSON від моделі.',
    },
  },
  {
    match: /policy engine/i,
    help: {
      titleUk: 'Рішення політики: allow / deny / approval',
      explainUk:
        'Policy engine дивиться: хто виконує (actor), який tool, який ресурс, яка дія. Результат — дозволити, заборонити або відправити на підтвердження людиною (allow / deny / needs_approval).',
      actor: 'code',
      actorLabel: 'Код (policy engine)',
      qaUk: 'Читання звіту — allow; створення ticket у Jira — лише після human approval.',
    },
  },
  {
    match: /human approval/i,
    help: {
      titleUk: 'Зупинка на людині для ризикових дій',
      explainUk:
        'Якщо політика вимагає approval, run чекає: QA lead підтверджує в UI або ticket. До цього executor не викликає небезпечний API.',
      actor: 'human',
      actorLabel: 'Людина + код (workflow)',
      qaUk: 'Публікація bug у Jira або повторний prod-run — типові кандидати на human approval.',
    },
  },
  {
    match: /executor|лише після allow/i,
    help: {
      titleUk: 'Виконання tool лише після дозволу',
      explainUk:
        'Executor (код tool handler або MCP adapter) реально читає файл, викликає API тощо. Це відбувається **тільки** якщо попередні кроки дали allow (і approval, якщо треба).',
      actor: 'code',
      actorLabel: 'Код (executor)',
      qaUk: 'Після allow executor повертає фрагмент звіту в context; модель продовжує аналіз.',
    },
  },
];

export function lookupGuardrailsProcessStep(stepText: string): ProcessStepHelp | null {
  for (const { match, help } of STEP_HELP) {
    if (match.test(stepText)) return help;
  }
  return null;
}
