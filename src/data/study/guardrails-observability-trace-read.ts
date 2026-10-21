import { guardrailsNestedPick, qaBulletBody } from './guardrails-panel-helpers';

const TRACE_READ_OPTS = { flatDetailPanels: true } as const;

export const GUARDRAILS_OBS_TRACE_READ_PICK = guardrailsNestedPick(
  'Як читати trace одного run',
  'Навчальні ланцюжки подій для QA',
  [
    {
      key: 'gr-obs-trace-a',
      titleUk: 'Сценарій A — policy заблокувала запис',
      teaserUk: 'deny до executor, без події виконання',
      sections: [
        {
          labelUk: 'Очікуваний ланцюжок',
          bodyUk:
            '`tool_call_proposal` → `policy_decision: deny` → запис аудиту → завершення run або інша передбачена обробка відмови',
        },
        {
          labelUk: 'Що перевірити в trace',
          bodyUk: qaBulletBody([
            'Є `tool_call_proposal` для розглянутого запиту.',
            'Є `policy_decision: deny` до будь-якого executor.',
            'Немає `tool_execution_result` для цієї пропозиції.',
            'Є запис аудиту з причиною, якщо аудит налаштований.',
          ]),
        },
        {
          labelUk: 'Висновок QA',
          bodyUk:
            'Запис не повинен дійти до executor. Відсутність події виконання узгоджується з відмовою policy.',
        },
      ],
    },
    {
      key: 'gr-obs-trace-b',
      titleUk: 'Сценарій B — людина відхилила запит',
      teaserUk: 'approval_denied, не policy deny',
      sections: [
        {
          labelUk: 'Очікуваний ланцюжок',
          bodyUk:
            '`policy_decision: needs_approval` → `approval_requested` → `approval_denied` → завершення run або інша передбачена обробка відмови',
        },
        {
          labelUk: 'Що перевірити в trace',
          bodyUk: qaBulletBody([
            'Початковий вердикт `needs_approval`, а не `deny`.',
            'Подія `approval_denied` після запиту погодження.',
            'Відсутність executor після відмови людини.',
            'Причина завершення run відповідає відмові людини, а не policy deny.',
          ]),
        },
        {
          labelUk: 'Висновок QA',
          bodyUk:
            'Причина відмови — рішення людини, а не початковий вердикт policy. Executor не повинен запускатися.',
        },
      ],
    },
    {
      key: 'gr-obs-trace-c',
      titleUk: 'Сценарій C — схвалено, але re-check заборонив',
      teaserUk: 'approval_granted без executor',
      sections: [
        {
          labelUk: 'Очікуваний ланцюжок',
          bodyUk:
            '`policy_decision: needs_approval` → `approval_granted` → повторний `policy_decision: deny` → зупинка без executor',
        },
        {
          labelUk: 'Що перевірити в trace',
          bodyUk: qaBulletBody([
            'Є `approval_granted` для цього запиту.',
            'Після схвалення є повторний `policy_decision: deny`.',
            'Немає виклику executor після deny на re-check.',
            'Немає успішного `tool_execution_result` для цієї пропозиції.',
          ]),
        },
        {
          labelUk: 'Висновок QA',
          bodyUk:
            'Схвалення було записане, але виконання не відбулося. Система правильно застосувала повторну перевірку.',
        },
      ],
    },
    {
      key: 'gr-obs-trace-d',
      titleUk: 'Сценарій D — issue успішно створено',
      teaserUk: 'успіх підтверджує API, не лише allow',
      sections: [
        {
          labelUk: 'Очікуваний ланцюжок',
          bodyUk:
            '`policy_decision: allow` → `executor` → `jira_api_request` → успішний `tool_execution_result`\n\nЯкщо операція потребувала погодження, перед повторною перевіркою має бути відповідний ланцюжок `approval_granted` і повторний дозвіл.',
        },
        {
          labelUk: 'Що перевірити в trace',
          bodyUk: qaBulletBody([
            'Ланцюжок від `allow` (або повторного allow після approval) до executor.',
            'Подія звернення до Jira API, якщо вона логується окремо.',
            'Успішний `tool_execution_result` з ідентифікатором issue.',
            'Фінальний статус run узгоджується з фактом створення, а не лише з policy.',
          ]),
        },
        {
          labelUk: 'Висновок QA',
          bodyUk:
            'Успіх підтверджується фактичним результатом API, а не лише пропозицією моделі, `allow` або `approval_granted`.',
        },
        {
          labelUk: 'Нагадування',
          bodyUk:
            'Це навчальні приклади очікуваної поведінки, а не твердження, що в поточному репозиторії вже записуються саме такі назви подій. Перед прив’язкою до реалізації звір назви з кодом.',
        },
      ],
    },
  ],
  TRACE_READ_OPTS,
);

export const GUARDRAILS_OBS_LOGGING_RULES_UK = [
  'Не записуй API-токени, паролі, секрети та заголовки авторизації.',
  'Не дублюй повний вміст звітів, якщо для розслідування достатньо безпечного фрагмента або посилання на артефакт.',
  'Не записуй зайві персональні дані.',
  'Використовуй `run_id` та інші кореляційні ідентифікатори, якщо вони передбачені системою, щоб пов’язувати події одного розслідування.',
  'Фіксуй причини відмови так, щоб QA міг зрозуміти результат, але не отримував секрети.',
  'Обмежуй доступ до журналів відповідно до їхньої чутливості.',
];

export const GUARDRAILS_OBS_GLOSSARY_TERMS: Array<{ termUk: string; bodyUk: string }> = [
  { termUk: 'Trace', bodyUk: 'запис подій, який допомагає відновити перебіг одного run.' },
  { termUk: 'Run ID', bodyUk: 'ідентифікатор конкретного запуску агента.' },
  { termUk: 'Tool call proposal', bodyUk: 'структурована пропозиція моделі викликати інструмент.' },
  { termUk: 'Policy decision', bodyUk: 'рішення коду щодо дозволу на конкретну дію.' },
  { termUk: 'Executor', bodyUk: 'компонент, який запускає дозволений виклик інструмента.' },
  { termUk: 'Approval', bodyUk: 'процедура погодження дії людиною.' },
  { termUk: 'Audit event', bodyUk: 'запис про важливу дію або рішення для подальшої перевірки.' },
  { termUk: 'Tool execution result', bodyUk: 'фактичні дані або помилка, повернуті виконаним інструментом.' },
  {
    termUk: 'Post-approval policy re-check',
    bodyUk: 'повторна перевірка політики після схвалення людиною.',
  },
];
