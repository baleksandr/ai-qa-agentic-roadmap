/** Урок Observability у Guardrails Study Mode (блоки A–H) */

export const GUARDRAILS_OBS_SOURCE_MARKDOWN = `### 10. Observability — що потрібно бачити в production?
policy decision, rule id, actor, resource, denied/approved actions, approval latency.

### 11. Production considerations (уривок з курсу)
У production важливо думати не лише про happy path, а про versioning, backward compatibility, latency,
cost, retries, idempotency, rate limits, concurrency, degradation/fallback, data retention, deployment,
monitoring і incident response.`;

export type ObservabilityFieldLesson = {
  id: string;
  titleUk: string;
  termEn: string;
  teaserUk: string;
  plainUk: string;
  sourceUk: string;
  whereUk: string;
  investigationUk: string;
  qaAgentUk: string;
};

export const GUARDRAILS_OBS_FIELDS: ObservabilityFieldLesson[] = [
  {
    id: 'policy-decision',
    titleUk: 'Рішення політики',
    termEn: 'policy decision',
    teaserUk: 'allow, deny або needs_approval — вердикт коду, не моделі.',
    plainUk:
      'Після пропозиції LLM policy engine записує один із трьох вердиктів: allow (дозвіл спробувати виконати), deny (заборонено, executor не викликається), needs_approval (run чекає на людину). allow не означає успіх Jira API — лише що код дозволив перейти до executor.',
    sourceUk:
      'Policy engine порівнює actor, tool, resource і action з матрицею. При повторній перевірці після approval_granted код знову оцінює політику й актуальність запиту (той самий run, той самий tool, не прострочений approval).',
    whereUk: 'Подія в журналі та span у trace одного run. У метриках — агрегати по типу рішення (окремо від approval_granted і від успіху API).',
    investigationUk:
      '«Чому tool не виконався або run стоїть?» — політика, validation, очікування людини чи помилка мережі?',
    qaAgentUk:
      'Після propose createJiraIssue у trace: needs_approval — issue ще немає. deny — немає executor span. allow на execute — є спроба API, але успіх дивіться в окремій події tool_result або executor_error.',
  },
  {
    id: 'rule-id',
    titleUk: 'Ідентифікатор правила',
    termEn: 'rule id',
    teaserUk: 'Який рядок політики спрацював.',
    plainUk:
      'rule id — ім’я конкретного правила в конфігу. Два deny підряд розрізняються саме rule id.',
    sourceUk: 'Policy engine при match записує id правила з YAML/коду.',
    whereUk: 'Подія + trace поруч із policy_decision. Метрики: group by rule_id (топ deny).',
    investigationUk: '«Яке правило змінити в PR після регресії?»',
    qaAgentUk:
      'createJiraIssue → jira-create-needs-approval. Спроба prod write → global-deny-prod-write. Golden trace у CI фіксує очікуваний rule id.',
  },
  {
    id: 'actor',
    titleUk: 'Ініціатор (actor)',
    termEn: 'actor',
    teaserUk: 'CI bot, користувач UI або service account.',
    plainUk: 'actor — хто несе відповідальність за run. Той самий tool може мати allow для CI і deny для guest.',
    sourceUk: 'Harness при старті run з authentication / job context.',
    whereUk: 'Подія, trace. Метрики: deny_rate по actor.',
    investigationUk: '«Чому вчора allow, сьогодні deny при тому ж tool?» — часто інший actor.',
    qaAgentUk: 'ci-regression-bot — read і create з approval. guest-demo — deny на create Jira.',
  },
  {
    id: 'resource',
    titleUk: 'Ресурс',
    termEn: 'resource',
    teaserUk: 'На що саме спрямована дія.',
    plainUk:
      'resource відповідає на «на що»: jira:project/QA, file:/work/reports/…. Tool name сам по собі resource не замінює.',
    sourceUk: 'Harness нормалізує аргументи tool (project key, path) перед policy.',
    whereUk: 'Подія, trace. Рідше — метрики по типу resource.',
    investigationUk: '«Чому два readReport — allow і deny?» — різний resource.',
    qaAgentUk:
      'createJiraIssue → jira:project/QA. readPlaywrightReport → file:/work/reports/index.html. Порівняйте args у trace з полем resource.',
  },
  {
    id: 'denied-approved-metrics',
    titleUk: 'Лічильники deny та схвалень',
    termEn: 'denied / approved actions',
    teaserUk: 'Агрегат багатьох runs — дашборд, не trace.',
    plainUk:
      'Метрики рахують policy deny, needs_approval, approval_granted, approval_denied, executor success/error. approval_granted ≠ issue створено. deny spike — привід розібратися, не автоматично «атака».',
    sourceUk: 'Агрегатор з audit stream за вікно часу.',
    whereUk: 'Метрики та дашборд. Не підміняйте trace одного run графіком.',
    investigationUk:
      '«Після релізу стало більше блокувань?» — дивіться deny_rate (10 з 10 000 ≠ 10 з 20).',
    qaAgentUk:
      'Після eval на staging порівняйте deny_rate з baseline. Окремо лічильники approval_granted і jira_issue_created.',
  },
  {
    id: 'approval-latency',
    titleUk: 'Затримка підтвердження',
    termEn: 'approval latency',
    teaserUk: 'Від needs_approval до approval_granted або відхилення.',
    plainUk:
      'Час очікування на людину між needs_approval і approval_granted / approval_denied. Не включає час виклику Jira API після схвалення.',
    sourceUk: 'Різниця timestamp у audit між відповідними подіями.',
    whereUk: 'Trace (два spans), метрика p95 на дашборді.',
    investigationUk: '«Чому run «висить»?» — черга approval vs людина не відповіла.',
    qaAgentUk:
      'Симулюйте approve через 3 хв — перевірте approval_latency_ms. Після approval_granted має бути re-check policy, потім executor.',
  },
];

export const GUARDRAILS_OBS_EVENT_EXAMPLE_JSON = `{
  "event": "policy_decision",
  "run_id": "run-teach-8f3a",
  "tool": "createJiraIssue",
  "actor": "principal:ci-regression-bot",
  "resource": "jira:project/QA",
  "policy_decision": "needs_approval",
  "rule_id": "jira-create-needs-approval",
  "timestamp": "2026-03-15T14:00:12Z"
}`;

export const GUARDRAILS_OBS_APPROVAL_GRANTED_JSON = `{
  "event": "approval_granted",
  "run_id": "run-teach-8f3a",
  "approval_id": "appr-teach-001",
  "approver": "qa-lead@example.com",
  "timestamp": "2026-03-15T14:03:40Z"
}`;

export const GUARDRAILS_OBS_EXECUTOR_SUCCESS_JSON = `{
  "event": "tool_execution_result",
  "run_id": "run-teach-8f3a",
  "tool": "createJiraIssue",
  "policy_decision": "allow",
  "rule_id": "jira-create-needs-approval",
  "status": "success",
  "jira_issue_key": "QA-1234",
  "timestamp": "2026-03-15T14:03:42Z"
}`;

export const GUARDRAILS_OBS_EXECUTOR_ERROR_JSON = `{
  "event": "tool_execution_result",
  "run_id": "run-teach-8f3a",
  "tool": "createJiraIssue",
  "policy_decision": "allow",
  "status": "error",
  "error_code": "JIRA_503",
  "message": "Jira temporarily unavailable",
  "timestamp": "2026-03-15T14:03:42Z"
}`;

export const GUARDRAILS_OBS_DENY_JSON = `{
  "event": "policy_decision",
  "run_id": "run-teach-deny-01",
  "tool": "createJiraIssue",
  "policy_decision": "deny",
  "rule_id": "guest-no-jira-write",
  "note": "executor_not_invoked"
}`;

export const GUARDRAILS_OBS_APPROVAL_DENIED_JSON = `{
  "event": "approval_denied",
  "run_id": "run-teach-reject-02",
  "approval_id": "appr-teach-002",
  "approver": "qa-lead@example.com",
  "note": "executor_not_invoked"
}`;

export const GUARDRAILS_OBS_SCENARIO_OUTCOMES = [
  {
    id: 'deny',
    titleUk: 'deny — політика заборонила',
    bodyUk:
      'Є policy_decision: deny. Немає approval_granted, немає executor span, issue в Jira не з’являється.',
  },
  {
    id: 'approval-reject',
    titleUk: 'needs_approval → людина відхилила',
    bodyUk:
      'Є needs_approval, потім approval_denied. Повторна перевірка до executor не доходить. Issue не створено.',
  },
  {
    id: 'approval-success',
    titleUk: 'Схвалено → re-check → API успіх',
    bodyUk:
      'needs_approval → approval_granted → policy re-check allow → executor → tool_execution_result success з QA-1234. approval_granted сам по собі issue не створює.',
  },
  {
    id: 'approval-jira-error',
    titleUk: 'Схвалено → allow execute → помилка Jira API',
    bodyUk:
      'Після approval_granted і allow на execute є tool_execution_result з status error (наприклад JIRA_503). Політика спрацювала, API впало — це окрема подія для on-call.',
  },
] as const;

export const GUARDRAILS_OBS_REMEMBER = [
  'LLM пропонує — код вирішує, записує події й лише потім викликає executor.',
  'allow = дозвіл спробувати, не гарантія успіху API. approval_granted ≠ issue створено.',
  'Подія → trace одного run → метрики багатьох runs (графік на дашборді, не в trace).',
  'needs_approval, approval_granted, approval_denied, allow execute, API success/error — різні події.',
  'Spike deny дивіться разом із deny_rate і rule_id, без ярликів «атака» без доказів.',
];
