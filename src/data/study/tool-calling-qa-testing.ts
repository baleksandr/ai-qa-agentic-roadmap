/** Практичний розділ «Як QA це тестує?» (concept-10). Навчальні приклади — у репозиторії немає live agent harness tests. */

export type ToolCallingQaTestLevel = {
  id: string;
  badgeUk: string;
  titleUk: string;
  bodyUk: string;
};

export type ToolCallingQaCategory = {
  id: string;
  titleUk: string;
  subtitleUk: string;
  navTeaserUk: string;
  setupUk: string;
  actionUk: string;
  expectUk: string;
  mustNotUk: string;
  evidenceUk: string;
};

export type ToolCallingGwtScenario = {
  id: string;
  titleUk: string;
  givenUk: string;
  whenUk: string;
  thenUk: string;
  mustNotUk: string;
  evidenceUk: string;
};

export const TOOL_CALLING_QA_LEVELS: ToolCallingQaTestLevel[] = [
  {
    id: 'tc-qa-level-handler',
    badgeUk: '',
    titleUk: 'Одна функція',
    bodyUk: 'Перевіряємо, що функція читання повертає вміст тестового файлу або зрозумілу помилку.',
  },
  {
    id: 'tc-qa-level-harness',
    badgeUk: '',
    titleUk: 'Код навколо моделі',
    bodyUk:
      'Підставляємо готову пропозицію інструмента й дивимося, як застосунок перевіряє її та виконує або відхиляє.',
  },
  {
    id: 'tc-qa-level-llm',
    badgeUk: '',
    titleUk: 'Модель у повному сценарії',
    bodyUk:
      'Перевіряємо, чи модель обирає доречну дію та чи її відповідь спирається на фактично отриманий результат.',
  },
];

export const TOOL_CALLING_QA_CATEGORIES: ToolCallingQaCategory[] = [
  {
    id: 'tc-qa-schema',
    titleUk: 'Schema / invalid args',
    subtitleUk: 'формат і типи аргументів',
    navTeaserUk: 'Без LLM — відхилити до I/O',
    setupUk:
      'Allow-list з `readPlaywrightReport` (поле `path` обов’язкове). Фікстура: порожній `playwright-report/index.html` у тестовому каталозі. Mock LLM не потрібен — готуєте JSON tool_call вручну або через test helper.',
    actionUk:
      'Викликати harness з tool_call: (а) відсутнє `path`; (б) `path` число замість рядка; (в) зайве поле, яке schema не дозволяє.',
    expectUk:
      'Статус validation_error (або еквівалент вашого застосунку); tool message або помилка в context з людською причиною; крок run не переходить до успішного handler.',
    mustNotUk: 'Handler не відкриває файл; у trace немає allow + duration успішного read.',
    evidenceUk:
      'Assert на код помилки validator; spy на handler — 0 викликів; запис у trace: `decision=deny`, reason=schema.',
  },
  {
    id: 'tc-qa-sandbox',
    titleUk: 'Sandbox path',
    subtitleUk: 'вихід за дозволену теку',
    navTeaserUk: '`../` і symlink',
    setupUk:
      'Тестова структура: `playwright-report/index.html` (дозволено) і файл `outside-secret.txt` поруч із sandbox. На Windows і Linux перевірте path на кшталт `playwright-report/../outside-secret.txt` або symlink у sandbox, що вказує назовні (якщо ОС дозволяє в CI).',
    actionUk:
      'Harness + tool_call `readPlaywrightReport` з небезпечним path; окремо — валідний `playwright-report/index.html`.',
    expectUk:
      'Небезпечний path → path_denied / sandbox_violation; валідний → snippet містить очікуваний рядок з фікстури (наприклад timeout на `#login-btn`).',
    mustNotUk:
      'Вміст `outside-secret.txt` не потрапляє в tool result і не в наступний prompt LLM; не покладайтеся на «системні» шляхи на кшталт `/etc` — тест має бути переносним.',
    evidenceUk:
      'Spy на fs.readFile / handler: для deny — жодного read поза whitelist; для allow — лише canonical path у sandbox.',
  },
  {
    id: 'tc-qa-permission',
    titleUk: 'Permission denied',
    subtitleUk: 'policy до executor',
    navTeaserUk: 'deny без side effect',
    setupUk:
      'Користувач/run з роллю «read-only reports». Tool `createJiraIssue` у registry, але policy забороняє write для цього actor. Mock LLM повертає tool_call createJiraIssue з валідним JSON.',
    actionUk: 'Harness обробляє tool_call через policy engine (без обходу «бо тест»).',
    expectUk:
      'Verdict deny; tool result для LLM — безпечне повідомлення «доступ заборонено»; rule id у trace.',
    mustNotUk: 'Жодного HTTP до Jira mock/real; у сховищі issues не з’являється новий запис.',
    evidenceUk:
      'Spy на Jira client — 0 POST; trace: policy_decision=deny, rule_id заповнений, без витоку секретів у message.',
  },
  {
    id: 'tc-qa-duplicate',
    titleUk: 'Duplicate write',
    subtitleUk: 'idempotency після retry',
    navTeaserUk: 'другий createJiraIssue',
    setupUk:
      'Mock Jira: перший POST створює QA-101, але harness «втрачає» відповідь (симуляція timeout). Idempotency key = hash(runId + step + args). Другий tool_call з тими самими args.',
    actionUk: 'Двічі виконати execute path для createJiraIssue (або один retry після timeout).',
    expectUk:
      'У mock лише один issue; другий виклик повертає той самий key QA-101 або «already_created».',
    mustNotUk: 'Не два тікети з однаковим summary; approve людини сам по собі не замінює dedup.',
    evidenceUk:
      'Лічильник POST у mock === 1; trace містить idempotency_hit або duplicate_suppressed на другому кроці.',
  },
  {
    id: 'tc-qa-truncation',
    titleUk: 'Truncation',
    subtitleUk: 'великий HTML → snippet',
    navTeaserUk: 'ключовий доказ збережено',
    setupUk:
      'Фікстура `large-report.html` (>100 KB) з рядком помилки в кінці файлу. Policy: max tool result bytes для LLM = 4 KB.',
    actionUk: 'Успішний readPlaywrightReport → harness truncate перед додаванням у messages.',
    expectUk:
      'У tool message — фрагмент із рядком помилки; повний файл у artifact store / test tmp з посиланням у trace.',
    mustNotUk: 'Не передавати весь HTML у наступний turn LLM; не обрізати так, що зникає рядок про `#login-btn`.',
    evidenceUk:
      'Assert довжини content у messages < ліміту; assert substring ключового доказу; artifact id у trace.',
  },
  {
    id: 'tc-qa-trace',
    titleUk: 'Trace',
    subtitleUk: 'спостережуваність run',
    navTeaserUk: 'toolName, decision, duration',
    setupUk:
      'Будь-який з попередніх сценаріїв (наприклад валідний read). Увімкнений trace sink (файл, OpenTelemetry mock, in-memory buffer).',
    actionUk: 'Один повний run tool step після allow.',
    expectUk:
      'Записи: proposed toolName, redacted/hash args, allow/deny, durationMs, resultBytes (або error code).',
    mustNotUk: 'Секрети та повний path prod у trace не в plain text, якщо політика вимагає redaction.',
    evidenceUk:
      'Snapshot trace JSON у тесті; ручна перевірка в UI investigation після навчального run.',
  },
];

export const TOOL_CALLING_QA_GWT_SCENARIOS: ToolCallingGwtScenario[] = [
  {
    id: 'tc-gwt-bad-path',
    titleUk: 'readPlaywrightReport — небезпечний шлях (навчальний GWT)',
    givenUk:
      'У тестовому workspace є `playwright-report/index.html` і файл `../outside-playwright/secret.txt` (поза sandbox). Harness налаштований дозволяти лише префікс `playwright-report/`.',
    whenUk:
      'Harness отримує tool_call: `{ "name": "readPlaywrightReport", "arguments": { "path": "playwright-report/../outside-playwright/secret.txt" } }` (без виклику LLM).',
    thenUk:
      'Крок завершується з path_denied або validation sandbox; tool message описує відмову без вмісту secret.txt.',
    mustNotUk: 'Handler не читає secret.txt; у messages немає вмісту забороненого файлу.',
    evidenceUk:
      'Unit/integration тест: spy handler + assert trace.decision === "deny". У цьому репозиторії курсу **немає** готового harness test suite — приклад для вашого агента.',
  },
  {
    id: 'tc-gwt-duplicate-jira',
    titleUk: 'createJiraIssue — повтор після втраченої відповіді (навчальний GWT)',
    givenUk:
      'Mock Jira: перший create повертає QA-101, але harness симулює timeout до збереження відповіді. Idempotency store порожній.',
    whenUk:
      'Другий виклик createJiraIssue з тими самими args і тим самим idempotency key після retry.',
    thenUk:
      'У mock залишається один issue QA-101; агент отримує той самий key у tool result.',
    mustNotUk: 'Другий POST не створює QA-102.',
    evidenceUk:
      'Assert count(createIssue) === 1; trace містить duplicate або idempotency_hit. **Навчальний** сценарій — не результат запуску тестів у цьому repo.',
  },
];

export const TOOL_CALLING_QA_NO_AUTOMATED_TESTS_NOTE =
  'У репозиторії курсу немає інтеграційних тестів agent harness — нижче навчальні шаблони Given/When/Then для вашого проєкту QA Regression Agent.';
