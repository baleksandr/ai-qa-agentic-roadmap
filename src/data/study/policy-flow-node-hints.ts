import type { StudyHintItem } from './study-hint-types';

/** Підказки для блоків схеми policy → approval → executor */
export const POLICY_FLOW_NODE_HINTS: StudyHintItem[] = [
  {
    id: 'llm-propose',
    titleUk: 'Пропозиція моделі (propose)',
    termEn: 'tool call proposal',
    teaserUk: 'LLM лише пропонує виклик — ще без рішення політики.',
    sections: [
      {
        labelUk: 'Що відбувається',
        bodyUk:
          'Модель повертає структуровану пропозицію: який tool викликати (наприклад createJiraIssue) і з якими аргументами. Це **не** виконання в Jira і **не** вердикт allow/deny.',
      },
      {
        labelUk: 'У trace / логах',
        bodyUk:
          'Шукайте подію propose або span з іменем tool до policy_decision. Якщо далі немає policy — run зламався раніше (валідація схеми, harness).',
      },
      {
        labelUk: 'Типова помилка',
        bodyUk: 'Вважати, що «модель створила тікет» — до executor і успішної відповіді API тікета ще немає.',
      },
    ],
    exampleUk: 'propose createJiraIssue(project=QA, summary=…) → наступний крок validate + policy.',
  },
  {
    id: 'validate-policy',
    titleUk: 'Валідація і політика в коді',
    termEn: 'validate + policy engine',
    teaserUk: 'TypeScript перевіряє аргументи й застосовує правила.',
    sections: [
      {
        labelUk: 'Що відбувається',
        bodyUk:
          'Harness нормалізує аргументи, перевіряє схему tool, потім policy engine порівнює **actor**, **tool**, **resource** і **action** з матрицею правил. Результат — один вердикт: deny, allow або needs_approval.',
      },
      {
        labelUk: 'Чому це не LLM',
        bodyUk: 'Вердикт детермінований і тестований у CI. Модель не «вирішує», чи можна в prod писати в Jira.',
      },
      {
        labelUk: 'У trace / логах',
        bodyUk: 'Подія policy_decision з полями policy_decision, rule_id, run_id. Кожна гілка схеми починається тут.',
      },
    ],
    qaUk: 'Golden trace у CI: для одного входу очікуваний rule_id і вердикт.',
  },
  {
    id: 'policy-deny',
    titleUk: 'Вердикт deny',
    termEn: 'policy decision: deny',
    teaserUk: 'Заборонено — executor не викликається.',
    sections: [
      {
        labelUk: 'Що означає',
        bodyUk:
          'Код заборонив дію за правилом (наприклад global-deny-prod-write). Run зупиняється **до** Jira API. Це стосується і першої перевірки, і re-check після approval, якщо умови вже не виконуються.',
      },
      {
        labelUk: 'У trace / логах',
        bodyUk: 'policy_decision: deny, rule_id, audit. Немає executor span, немає tool_execution_result success.',
      },
      {
        labelUk: 'Метрики',
        bodyUk: 'deny_rate, group by rule_id — щоб знайти правило, яке «ріже» найбільше.',
      },
    ],
    exampleUk: 'guest-demo + create Jira → deny, rule global-deny-guest.',
  },
  {
    id: 'audit-deny',
    titleUk: 'Audit при deny',
    termEn: 'audit event',
    teaserUk: 'Запис для розслідування без виклику executor.',
    sections: [
      {
        labelUk: 'Що фіксується',
        bodyUk:
          'Хто просив (actor), який tool, яке rule_id спрацювало, що саме заборонено. Це доказ для security і QA: «дія не виконалась навмисно».',
      },
      {
        labelUk: 'У trace / логах',
        bodyUk: 'Може бути note executor_not_invoked або окрема audit-подія поруч із policy_decision deny.',
      },
    ],
    qaUk: 'У тесті після deny перевірте відсутність HTTP до Jira (mock не викликався).',
  },
  {
    id: 'policy-allow',
    titleUk: 'Вердикт allow (перша перевірка)',
    termEn: 'policy decision: allow',
    teaserUk: 'Дозвіл спробувати виконати — не успіх API.',
    sections: [
      {
        labelUk: 'Що означає',
        bodyUk:
          'Політика дозволила перейти до executor без людини. **allow** = «код не блокує спробу», а не «тікет створено».',
      },
      {
        labelUk: 'Зв’язок із схемою',
        bodyUk: 'Гілка allow зливається з allow execute після approval: обидві ведуть до executor → Jira API.',
      },
      {
        labelUk: 'У trace / логах',
        bodyUk: 'policy_decision allow → далі executor span. Успіх/помилка — в tool_execution_result.',
      },
    ],
  },
  {
    id: 'needs-approval',
    titleUk: 'Вердикт needs_approval',
    termEn: 'policy decision: needs_approval',
    teaserUk: 'Run чекає на людину — issue ще не створюється.',
    sections: [
      {
        labelUk: 'Що означає',
        bodyUk:
          'Дія не заборонена назавжди, але потребує схвалення (наприклад create Jira для QA-агента). Run «пауза» до approval_granted або approval_denied.',
      },
      {
        labelUk: 'У trace / логах',
        bodyUk: 'policy_decision needs_approval, rule_id (часто jira-create-needs-approval). Немає executor до схвалення.',
      },
      {
        labelUk: 'Метрики',
        bodyUk: 'approval_latency — від needs_approval до granted/denied, без часу Jira API.',
      },
    ],
    exampleUk: '«Чому run висить?» — перевірте чергу approval, чи людина ще не натиснула.',
  },
  {
    id: 'human-reject',
    titleUk: 'Людина відхилила',
    termEn: 'human rejection',
    teaserUk: 'Рішення оператора — не вердикт моделі.',
    sections: [
      {
        labelUk: 'Що відбувається',
        bodyUk: 'У UI approval людина натискає «відхилити». Система записує approval_denied і **не** переходить до re-check execute.',
      },
      {
        labelUk: 'У trace / логах',
        bodyUk: 'Після needs_approval з’являється approval_denied з approval_id. Executor span відсутній.',
      },
    ],
  },
  {
    id: 'approval-denied',
    titleUk: 'Подія approval_denied',
    termEn: 'approval_denied',
    teaserUk: 'Схвалення не дано — executor не викликається.',
    sections: [
      {
        labelUk: 'Що означає',
        bodyUk: 'Фінал гілки approval для відмови. Issue в Jira не з’являється. Це окрема подія від policy deny — тут політика могла б дозволити після людини, але людина сказала «ні».',
      },
      {
        labelUk: 'У trace / логах',
        bodyUk: 'approval_denied, approval_id, run_id. Немає approval_granted, немає executor.',
      },
    ],
    qaUk: 'Сценарій: needs_approval → reject → переконайтесь, що Jira mock = 0 викликів.',
  },
  {
    id: 'human-approve',
    titleUk: 'Людина схвалила',
    termEn: 'human approval',
    teaserUk: 'Дозвіл людини — ще не виконання в Jira.',
    sections: [
      {
        labelUk: 'Що відбувається',
        bodyUk: 'Оператор підтверджує дію в UI. Далі код **обов’язково** робить re-check — схвалення не скасовує політику й не гарантує, що запит ще актуальний.',
      },
      {
        labelUk: 'Типова помилка',
        bodyUk: 'Думати, що після кліку «Approve» тікет уже в Jira — спочатку approval_granted, потім код, потім API.',
      },
    ],
  },
  {
    id: 'approval-granted',
    titleUk: 'Подія approval_granted',
    termEn: 'approval_granted',
    teaserUk: 'Схвалено людиною — issue ще не створено.',
    sections: [
      {
        labelUk: 'Що означає',
        bodyUk:
          'Фіксація факту схвалення (approval_id, час). **Не** означає createIssue success. Наступний крок — re-check policy і актуальність аргументів того ж run.',
      },
      {
        labelUk: 'У trace / логах',
        bodyUk: 'approval_granted між needs_approval і другим policy_decision (allow execute або deny).',
      },
      {
        labelUk: 'Метрики',
        bodyUk: 'Рахуйте approval_granted окремо від jira_issue_created / tool success.',
      },
    ],
    exampleUk: 'Є approval_granted, але deny на re-check — executor знову не викликається (наприклад прострочений approval).',
  },
  {
    id: 'recheck-policy',
    titleUk: 'Re-check після схвалення',
    termEn: 'post-approval policy re-check',
    teaserUk: 'Код знову перевіряє політику й чи той самий запит.',
    sections: [
      {
        labelUk: 'Що перевіряється',
        bodyUk:
          'Той самий run і tool, чи не змінились права actor, чи не прострочено approval, чи аргументи не змінились після паузи. Людина схвалила — але код може відмовити.',
      },
      {
        labelUk: 'У trace / логах',
        bodyUk: 'Другий policy_decision після approval_granted: allow (execute) або deny (stop).',
      },
    ],
    qaUk: 'Тест: approve, потім змінити політику в staging — очікуйте deny на re-check.',
  },
  {
    id: 'allow-execute',
    titleUk: 'allow execute',
    termEn: 'allow execute',
    teaserUk: 'Після re-check — дозвіл викликати executor.',
    sections: [
      {
        labelUk: 'Що означає',
        bodyUk: 'Політика дозволила фактичний виклик Jira API для цього run. Далі лише технічний ризик: мережа, 503, валідація на стороні Jira.',
      },
      {
        labelUk: 'Відмінність від allow',
        bodyUk: 'Перший allow — без людини. allow execute — після needs_approval і approval_granted. Обидва ведуть до одного executor.',
      },
    ],
  },
  {
    id: 'executor-jira',
    titleUk: 'Executor → Jira API',
    termEn: 'tool executor',
    teaserUk: 'Єдине місце реального HTTP до Jira.',
    sections: [
      {
        labelUk: 'Що відбувається',
        bodyUk: 'Ізольований шар викликає API з service account, таймаутами, retry політикою. LLM до HTTP не підключається.',
      },
      {
        labelUk: 'У trace / логах',
        bodyUk: 'Executor span, request id, latency. Результат — окрема подія success або error.',
      },
    ],
    qaUk: 'Contract test executor + mock Jira для success і 503.',
  },
  {
    id: 'executor-success',
    titleUk: 'Успіх API (success)',
    termEn: 'tool_execution_result: success',
    teaserUk: 'Тікет реально створено — наприклад QA-1234.',
    sections: [
      {
        labelUk: 'Що означає',
        bodyUk: 'Jira повернула успіх, ключ issue записано в результат tool. Це кінець «щасливої» гілки після allow.',
      },
      {
        labelUk: 'У trace / логах',
        bodyUk: 'tool_execution_result status success, issue key QA-1234, correlation з run_id.',
      },
    ],
  },
  {
    id: 'executor-error',
    titleUk: 'Помилка API (error)',
    termEn: 'tool_execution_result: error',
    teaserUk: 'Політика пройдена — впала Jira, наприклад JIRA_503.',
    sections: [
      {
        labelUk: 'Що означає',
        bodyUk: 'Guardrails спрацювали, але зовнішній сервіс недоступний або відхилив запит. Це **не** deny політики — окрема подія для on-call і ретраїв.',
      },
      {
        labelUk: 'У trace / логах',
        bodyUk: 'tool_execution_result status error, code JIRA_503. Є executor span, немає issue key.',
      },
      {
        labelUk: 'Для QA',
        bodyUk: 'Перевіряйте, що алерт на 503 не плутають із deny_rate spike.',
      },
    ],
  },
];

export const POLICY_FLOW_HINT_BY_ID = Object.fromEntries(
  POLICY_FLOW_NODE_HINTS.map((h) => [h.id, h]),
) as Record<string, StudyHintItem>;
