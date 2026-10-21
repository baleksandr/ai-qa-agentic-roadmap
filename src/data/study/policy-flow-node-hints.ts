import type { StudyHintItem } from './study-hint-types';

/**
 * Підказки до інтерактивної схеми policy → approval → executor.
 * Назви подій узгоджені з навчальними прикладами trace курсу (guardrails-observability-lesson.ts), не з окремим production runtime у цьому репозиторії.
 */
export const POLICY_FLOW_NODE_HINTS: StudyHintItem[] = [
  {
    id: 'llm-propose',
    titleUk: 'Пропозиція моделі (propose)',
    termEn: 'tool call proposal',
    teaserUk: 'Модель формує пропозицію виклику інструмента — ще без рішення політики й без запиту до Jira.',
    sections: [
      {
        labelUk: 'Що відбувається',
        bodyUk:
          'Модель повертає структуровану пропозицію: який інструмент викликати, наприклад `createJiraIssue`, і з якими аргументами. Це ще не рішення політики і не фактичний виклик API.',
      },
      {
        labelUk: 'Що перевірити в trace',
        listItemsUk: [
          'Подія `tool_call_proposal` (або еквівалент у вашій реалізації) перед `validate_arguments` і `policy_decision`.',
          'Назву інструмента та аргументи окремо від подій виконання.',
          'Відсутність `tool_execution_result` на цьому етапі.',
        ],
      },
      {
        labelUk: 'Типова помилка',
        bodyUk:
          'Стверджувати, що модель уже створила тікет. До підтвердженого успішного результату API тікет не можна вважати створеним.',
      },
    ],
    exampleUk: '`tool_call_proposal` → перевірка аргументів → рішення політики.',
  },
  {
    id: 'validate-policy',
    titleUk: 'Валідація і політика в коді',
    termEn: 'validate + policy engine',
    teaserUk: 'Код перевіряє аргументи й застосовує правила доступу — окремо від відповіді моделі.',
    sections: [
      {
        labelUk: 'Що відбувається',
        listItemsUk: [
          'Валідація перевіряє, чи аргументи відповідають схемі інструмента.',
          'Policy engine оцінює, чи дозволена дія за правилами продукту (вердикт `deny`, `allow` або `needs_approval`, якщо такі результати підтримує реалізація).',
          'Валідні аргументи ще не означають дозволу на виконання.',
        ],
      },
      {
        labelUk: 'Чому це не рішення LLM',
        bodyUk:
          'Якщо політика реалізована в коді harness, вердикт можна тестувати окремо від формулювань моделі. Детермінованість залежить від правил і стану системи, а не від «інтуїції» LLM.',
      },
      {
        labelUk: 'Що перевірити в trace',
        listItemsUk: [
          'Подія `policy_decision` з фактичним вердиктом.',
          'Поле `rule_id`, якщо реалізація його записує (у навчальному прикладі — так).',
          '`run_id` або інший кореляційний ідентифікатор, якщо він є в подіях run.',
        ],
      },
    ],
    qaUk:
      'Якщо є golden trace або інтеграційний тест: для фіксованого входу порівняйте очікуваний `rule_id` і вердикт з фактичним `policy_decision`.',
  },
  {
    id: 'policy-deny',
    titleUk: 'Вердикт deny (перша перевірка)',
    termEn: 'policy decision: deny',
    teaserUk: 'Політика заборонила дію до виклику executor.',
    sections: [
      {
        labelUk: 'Що означає',
        bodyUk:
          'Код заборонив дію за правилом політики. Для цієї гілки executor не повинен викликатися, а запит на створення issue не повинен надходити до Jira.',
      },
      {
        labelUk: 'Що перевірити в trace',
        listItemsUk: [
          '`policy_decision: deny` на першій перевірці після пропозиції.',
          '`rule_id`, якщо записується (навчальний приклад: `guest-no-jira-write`).',
          'Відсутність фактичного виконання інструмента після заборони.',
          'Опційно: `note: executor_not_invoked` або audit-подія — лише якщо так налаштовано в продукті.',
        ],
      },
      {
        labelUk: 'Метрики',
        bodyUk:
          'Показники на кшталт `deny_rate` і групування за `rule_id` корисні для observability, якщо їх збирає продукт. У цьому навчальному репозиторії вони описані як орієнтир, а не як наявний сервіс.',
      },
    ],
    exampleUk: 'Пропозиція `createJiraIssue` → `policy_decision: deny` → executor не викликається.',
  },
  {
    id: 'policy-deny-recheck',
    titleUk: 'Вердикт deny після схвалення',
    termEn: 'policy decision: deny (re-check)',
    teaserUk: 'Відмова на повторній перевірці — інший етап, ніж deny на першій перевірці.',
    sections: [
      {
        labelUk: 'Що означає',
        bodyUk:
          'Людина могла схвалити дію (`approval_granted`), але код при повторній перевірці політики знову повернув `deny`. Executor для цього запиту не викликається.',
      },
      {
        labelUk: 'Що перевірити в trace',
        listItemsUk: [
          'Є `approval_granted` для цього run.',
          'Другий `policy_decision: deny` після схвалення, а не замість першого `needs_approval`.',
          'Немає виклику executor і немає успішного `tool_execution_result`.',
        ],
      },
      {
        labelUk: 'Типова помилка',
        bodyUk: 'Плутати цей deny з відмовою людини (`approval_denied`) або з першим deny до approval.',
      },
    ],
    qaUk:
      'Якщо середовище дозволяє: схваліть запит, змініть політику або строк дії схвалення — очікуйте deny на re-check без виклику Jira mock.',
  },
  {
    id: 'audit-deny',
    titleUk: 'Audit при deny',
    termEn: 'audit event',
    teaserUk: 'Додатковий запис для розслідування — не обов’язковий у кожній реалізації.',
    sections: [
      {
        labelUk: 'Що фіксується',
        bodyUk:
          'У продуктах часто зберігають actor, tool, `rule_id` і причину відмови, щоб пояснити, чому дія навмисно не виконалась. Формат залежить від audit pipeline.',
      },
      {
        labelUk: 'Що перевірити в trace',
        bodyUk:
          'У навчальному JSON для deny може бути `note: executor_not_invoked`. Якщо в вашому trace такого поля немає, орієнтуйтесь на `policy_decision: deny` і відсутність executor.',
      },
    ],
    qaUk: 'Після deny перевірте mock або spy зовнішнього API: викликів не було.',
  },
  {
    id: 'policy-allow',
    titleUk: 'Вердикт allow (перша перевірка)',
    termEn: 'policy decision: allow',
    teaserUk: 'Політика дозволила перейти до виконання без очікування на людину.',
    sections: [
      {
        labelUk: 'Що означає',
        bodyUk:
          'Код не блокує спробу виконання. Це ще не означає, що Jira API успішно створив issue.',
      },
      {
        labelUk: 'Зв’язок із схемою',
        bodyUk:
          'Гілка першого `allow` зливається з дозволом після re-check (`allow execute`) в спільний executor → Jira API, якщо архітектура продукту так влаштована.',
      },
      {
        labelUk: 'Що перевірити в trace',
        listItemsUk: [
          '`policy_decision: allow` перед викликом executor.',
          'Фактичний перехід до виконання (подія executor або `tool_execution_result`).',
          'Результат API окремо від вердикту allow.',
        ],
      },
    ],
  },
  {
    id: 'needs-approval',
    titleUk: 'Вердикт needs_approval',
    termEn: 'policy decision: needs_approval',
    teaserUk: 'Дія потребує схвалення людини — executor ще не запускається.',
    sections: [
      {
        labelUk: 'Що означає',
        bodyUk:
          'Політика не заборонила дію назавжди, але вимагає рішення уповноваженої людини. До `approval_granted` або `approval_denied` виконання інструмента не починається.',
      },
      {
        labelUk: 'Що перевірити в trace',
        listItemsUk: [
          '`policy_decision: needs_approval` і відсутність executor до рішення людини.',
          '`rule_id`, якщо записується (навчальний приклад: `jira-create-needs-approval`).',
          'Стан очікування без `tool_execution_result`.',
        ],
      },
      {
        labelUk: 'Метрики',
        bodyUk:
          '`approval_latency` (час від `needs_approval` до рішення людини) — корисна метрика для продукту, якщо її збирають. Не плутайте з часом виклику Jira API після схвалення.',
      },
    ],
  },
  {
    id: 'human-reject',
    titleUk: 'Людина відхилила дію',
    termEn: 'human rejection',
    teaserUk: 'Рішення оператора в UI — не вердикт моделі й не policy deny.',
    sections: [
      {
        labelUk: 'Що відбувається',
        bodyUk:
          'Оператор відхиляє запит у інтерфейсі погодження. Система не повинна переходити до виконання інструмента для цього запиту.',
      },
      {
        labelUk: 'Типова помилка',
        bodyUk: 'Шукати причину в policy deny, хоча початковий вердикт був `needs_approval`.',
      },
    ],
  },
  {
    id: 'approval-denied',
    titleUk: 'Подія approval_denied',
    termEn: 'approval_denied',
    teaserUk: 'Зафіксована відмова людини — не те саме, що `policy decision: deny`.',
    sections: [
      {
        labelUk: 'Що означає',
        listItemsUk: [
          '`deny` — заборона політики на етапі перевірки правил.',
          '`approval_denied` — людина не надала схвалення після `needs_approval`.',
        ],
      },
      {
        labelUk: 'Що перевірити в trace',
        listItemsUk: [
          'Подія `approval_denied` після `needs_approval`.',
          'Відсутність `approval_granted` і executor для цього запиту.',
          'Поля `approval_id` і `run_id`, якщо реалізація їх записує.',
        ],
      },
    ],
    qaUk: 'Сценарій needs_approval → відхилення людиною: mock Jira не отримує викликів.',
  },
  {
    id: 'human-approve',
    titleUk: 'Людина схвалила дію',
    termEn: 'human approval',
    teaserUk: 'Клік «схвалити» сам по собі не створює issue.',
    sections: [
      {
        labelUk: 'Що відбувається',
        bodyUk:
          'Оператор підтверджує дію в UI. Далі harness виконує наступний крок, передбачений реалізацією (часто запис `approval_granted` і повторна перевірка політики).',
      },
      {
        labelUk: 'Типова помилка',
        bodyUk: 'Вважати схвалення людиною доказом створення тікета в Jira.',
      },
    ],
  },
  {
    id: 'approval-granted',
    titleUk: 'Подія approval_granted',
    termEn: 'approval_granted',
    teaserUk: 'Фіксація схвалення — не підтвердження успіху Jira API.',
    sections: [
      {
        labelUk: 'Що означає',
        bodyUk:
          'Записано факт, що людина дозволила продовжити обробку запиту. Issue ще не створено, поки немає успішного результату виконання інструмента.',
      },
      {
        labelUk: 'Що перевірити в trace',
        listItemsUk: [
          'Зв’язок `approval_granted` з тим самим `run_id`, що й пропозиція.',
          'Наступний етап після схвалення (re-check або executor — залежно від продукту).',
          'Поля `approval_id` і час події, якщо вони є в схемі події.',
        ],
      },
      {
        labelUk: 'Метрики',
        bodyUk:
          'Рекомендація для продукту: рахувати `approval_granted` окремо від успішно створених issue (`tool_execution_result: success`).',
      },
    ],
  },
  {
    id: 'recheck-policy',
    titleUk: 'Повторна перевірка після схвалення',
    termEn: 'post-approval policy re-check',
    teaserUk: 'Код перевіряє політику й актуальність запиту після `approval_granted`, якщо цей крок реалізовано.',
    sections: [
      {
        labelUk: 'Що перевіряється',
        bodyUk:
          'Можуть перевірятися права actor, незмінність аргументів, строк дії схвалення або відповідність тому самому run. Конкретний набір залежить від коду harness, не від моделі.',
      },
      {
        labelUk: 'Можливі результати',
        listItemsUk: [
          '`deny` — виконання зупиняється (див. блок deny після схвалення на схемі).',
          'Дозвіл на виконання — перехід до `allow execute` і executor.',
        ],
      },
    ],
    qaUk:
      'Тест зміни політики під час очікування на схвалення має сенс лише там, де re-check і політика дійсно налаштовані в середовищі.',
  },
  {
    id: 'allow-execute',
    titleUk: 'allow execute',
    termEn: 'allow execute',
    teaserUk: 'Навчальне позначення дозволу перейти до executor після re-check.',
    sections: [
      {
        labelUk: 'Що означає',
        bodyUk:
          'Політика дозволила фактичний виклик інструмента для цього run. Це не гарантує успіх зовнішнього API.',
      },
      {
        labelUk: 'Відмінність від першого allow',
        listItemsUk: [
          'Перший `allow` — без очікування на людину після першої `policy_decision`.',
          '`allow execute` — після `needs_approval`, `approval_granted` і повторної перевірки.',
          'Обидва шляхи можуть зійтися в один executor, якщо так зроблено в коді.',
        ],
      },
    ],
  },
  {
    id: 'executor-jira',
    titleUk: 'Executor → Jira API',
    termEn: 'tool executor',
    teaserUk: 'Шар коду, який виконує дозволений зовнішній виклик.',
    sections: [
      {
        labelUk: 'Що відбувається',
        bodyUk:
          'Executor викликає Jira API (або mock у тестах) після дозволу політики. LLM не виконує HTTP-запити напряму.',
      },
      {
        labelUk: 'Що перевірити в trace',
        listItemsUk: [
          'Факт спроби виконання після дозволу.',
          'Технічні деталі без секретів: latency, коди помилок, correlation id.',
          'Окрема подія результату (`tool_execution_result` у навчальних прикладах).',
        ],
      },
    ],
    qaUk: 'Якщо є тестовий executor або mock Jira: перевірте успішну відповідь і помилку зовнішнього сервісу.',
  },
  {
    id: 'executor-success',
    titleUk: 'Успіх API (success)',
    termEn: 'tool_execution_result: success',
    teaserUk: 'Успіх підтверджує фактичний результат виконання, не лише allow.',
    sections: [
      {
        labelUk: 'Що означає',
        bodyUk:
          'Зовнішній сервіс повернув успіх, і результат виконання містить підтвердження (наприклад ключ issue). Ключ на кшталт `QA-1234` на схемі — умовний приклад.',
      },
      {
        labelUk: 'Що перевірити в trace',
        listItemsUk: [
          '`tool_execution_result` зі статусом success.',
          'Зв’язок із `run_id` того самого розслідування.',
          'Ключ issue або інше поле відповіді API, якщо воно записується.',
        ],
      },
    ],
  },
  {
    id: 'executor-error',
    titleUk: 'Помилка API (error)',
    termEn: 'tool_execution_result: error',
    teaserUk: 'Помилка API — не відмова політики.',
    sections: [
      {
        labelUk: 'Що означає',
        bodyUk:
          'Політика могла дозволити дію, але зовнішній сервіс не виконав її успішно. Код `JIRA_503` на схемі — умовний приклад недоступності Jira.',
      },
      {
        labelUk: 'Що перевірити в trace',
        listItemsUk: [
          'Факт спроби виконання (executor або `tool_execution_result`).',
          'Код або повідомлення помилки без витоку секретів.',
          'Відсутність підтвердженого успішного ключа issue.',
        ],
      },
      {
        labelUk: 'Для QA',
        bodyUk: 'Помилка API не повинна обліковуватись як `policy_decision: deny`.',
      },
    ],
  },
];

export const POLICY_FLOW_HINT_BY_ID = Object.fromEntries(
  POLICY_FLOW_NODE_HINTS.map((h) => [h.id, h]),
) as Record<string, StudyHintItem>;
