/** Розділ «Де код, а де LLM?» — один навчальний прохід readPlaywrightReport (concept-10). */

export type ToolCallingFlowStep = {
  step: number;
  titleUk: string;
  actorUk: 'Код' | 'LLM' | 'Код + людина';
  inputUk: string;
  actionUk: string;
  outputUk: string;
};

export const TOOL_CALLING_LLM_CODE_INTRO =
  'Після падіння `login_spec` harness готує запит і опис інструмента; модель лише пропонує виклик — читання звіту виконує код після перевірок. Умовні дані, навчальний приклад.';

export const TOOL_CALLING_LLM_CODE_STEPS: ToolCallingFlowStep[] = [
  {
    step: 1,
    titleUk: 'Harness готує запит і опис інструмента',
    actorUk: 'Код',
    inputUk:
      'Короткий failure summary з CI (`login_spec`, timeout на `#login-btn`); allow-list tools — перелік дозволених дій, який задає застосунок (наприклад лише `readPlaywrightReport` з полем `path`).',
    actionUk:
      'Збирає messages для моделі, додає опис tool schema (ім’я, призначення, типи аргументів), застосовує max steps — ліміт циклу harness (скільки разів можна повторити «модель → tool → модель»), а не «сила» LLM.',
    outputUk:
      'Запит до LLM: історія + текст збою + список доступних інструментів. Диск ще не читали.',
  },
  {
    step: 2,
    titleUk: 'LLM пропонує виклик',
    actorUk: 'LLM',
    inputUk: 'Підготовлений harness запит і allow-list.',
    actionUk:
      'Ймовірнісно обирає `readPlaywrightReport` і формує аргументи. Це пропозиція (tool call), не виконання I/O. Формат залежить від API постачальника — не завжди один і той самий «голий» JSON у всіх продуктах.',
    outputUk:
      'Структурована пропозиція, наприклад (умовно): ім’я `readPlaywrightReport`, arguments `{ "path": "playwright-report/index.html" }`. Файл ще не відкрито.',
  },
  {
    step: 3,
    titleUk: 'Код перевіряє назву, аргументи й права',
    actorUk: 'Код',
    inputUk: 'Пропозиція tool call від LLM; правила policy та ACL — хто має доступ до конкретного ресурсу (файл, проєкт Jira, API).',
    actionUk:
      'Validator: чи є tool у allow-list; чи валідний тип полів; sandbox path — чи path лишається в дозволеній теці (`playwright-report/`), без обходу через `../`. Для ризикового write (наприклад `createJiraIssue`) код може запросити approval у людини, зафіксувати рішення в trace — але approval не замінює idempotency від повторного write.',
    outputUk:
      'Allow або deny. При deny — безпечна помилка в context, handler не викликано. При allow для read — передача в tool handler.',
  },
  {
    step: 4,
    titleUk: 'Tool handler читає файл',
    actorUk: 'Код',
    inputUk: 'Дозволений canonical path у sandbox; handler для read звіту.',
    actionUk: 'Читає HTML з диску (або mock у тесті). LLM у цей момент не має прямого доступу до ФС.',
    outputUk:
      'Байти/HTML звіту або помилка IO. Це факт, якого не було на кроці 2.',
  },
  {
    step: 5,
    titleUk: 'Harness повертає результат у контекст',
    actorUk: 'Код',
    inputUk: 'Вміст файлу; ліміти розміру для наступного prompt.',
    actionUk:
      'Може обрізати великий HTML до snippet; додає tool result у messages (роль залежить від API). Записує trace: toolName, decision, duration, розмір result.',
    outputUk:
      'Повідомлення з результатом інструмента для наступного turn LLM — наприклад уривок з рядком про `#login-btn`.',
  },
  {
    step: 6,
    titleUk: 'LLM формує наступну відповідь',
    actorUk: 'LLM',
    inputUk: 'Оновлені messages, включно з tool result.',
    actionUk: 'Інтерпретує snippet і формує гіпотезу для QA — не «знає» файл без кроків 4–5.',
    outputUk:
      'Текстова відповідь з опорою на прочитаний фрагмент. QA звіряє з DOM/trace CI, не довіряє лише формулюванню.',
  },
];

export const TOOL_CALLING_RESPONSIBILITY_ROWS: { roleUk: string; doesUk: string }[] = [
  {
    roleUk: 'LLM',
    doesUk: 'Пропонує tool call і пояснює гіпотезу; не виконує I/O, не задає allow-list, не обходить sandbox.',
  },
  {
    roleUk: 'Код (harness, validator, handler, policy)',
    doesUk:
      'Allow-list, max steps, перевірка args, ACL, sandbox, виклик handler, tool result у context, trace, idempotency для write.',
  },
  {
    roleUk: 'Людина',
    doesUk:
      'Підтвердження ризикової дії (approval), коли політика вимагає; рішення записує код. Approval не замінює захист від дубля тікета при retry.',
  },
];

export const TOOL_CALLING_RISK_EXAMPLES = [
  {
    id: 'risk-path',
    titleUk: 'Не довіряйте аргументам моделі (небезпечний шлях)',
    bodyUk:
      'Модель може запропонувати `readPlaywrightReport` з path `playwright-report/../outside/secret.txt`. Код має відхилити path до читання — навіть якщо відповідь LLM звучить впевнено. Це не «погана модель», а нормальна межа: перевірка аргументів завжди в harness.',
  },
  {
    id: 'risk-jira',
    titleUk: 'Побічний ефект: повторне створення Jira issue',
    bodyUk:
      'Якщо `createJiraIssue` уже створив тікет, але відповідь API загубилася, повторний виклик може зробити другий issue. Idempotency key або dedup у коді стримує повторний write; схвалення людиною лише відповідає на питання «чи можна взагалі створювати», а не «чи вже створено».',
  },
];
