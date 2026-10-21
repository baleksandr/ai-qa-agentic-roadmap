import type { StudyHintItem } from './study-hint-types';

/** Ланцюг «що передається» між LLM → policy → executor (§3) */
export const GUARDRAILS_DATA_TRANSFER_HINTS: StudyHintItem[] = [
  {
    id: 'proposed-action',
    titleUk: 'Пропонована дія та аргументи',
    termEn: 'Proposed action + arguments',
    teaserUk: 'Модель сформувала tool call — диск і API ще не чіпали.',
    sections: [
      {
        labelUk: 'Що це',
        bodyUk:
          'Після відповіді LLM harness отримує **структуровану пропозицію**: ім’я tool, JSON-аргументи, інколи текстовий коментар. Це повідомлення в черзі рішень, а не side effect у світі.',
      },
      {
        labelUk: 'Що всередині',
        bodyUk:
          'Типовий payload: `tool_name`, `arguments`, `run_id`, посилання на message id. Аргументи мають відповідати schema tool — але schema ще перевіряється окремим кроком.',
      },
      {
        labelUk: 'Чого ще немає',
        bodyUk:
          'Немає гарантії дозволу (policy), немає реального HTTP/файлового I/O, немає запису в Jira. Якщо run зупиниться на deny — executor ніколи не побачить цей виклик як команду до виконання.',
      },
    ],
    exampleUk:
      'Модель повертає readPlaywrightReport з path: "./playwright-report/index.html". У trace це «proposed tool call», файл на диску ще не відкритий.',
    qaUk:
      'У тесті regression-агента перевірте: після propose без allow у audit є запис про виклик, але немає side effect (немає нового issue, немає write у БД).',
  },
  {
    id: 'policy-decision',
    titleUk: 'Рішення policy engine',
    termEn: 'policy decision (allow / deny / needs_approval)',
    teaserUk: 'Код порівнює пропозицію з матрицею правил — не модель «вирішує».',
    sections: [
      {
        labelUk: 'Що це',
        bodyUk:
          'Policy engine (звичайний код) зіставляє **actor** (хто run), **tool**, **resource** (path, issue key, endpoint) і **action** (read/write/delete) з правилами. Результат — один з verdict: allow, deny, needs_approval.',
      },
      {
        labelUk: 'Як читати схему policy',
        bodyUk:
          'Три гілки allow / deny / human approval — це **альтернативи одного рішення**, не три кроки підряд. Після deny run не йде в executor, після needs_approval чекає людину.',
      },
      {
        labelUk: 'Що пишеться в audit',
        bodyUk:
          'Обов’язково: policy decision, rule id, actor, resource. Без цього в production не відповісти «чому заблокували».',
      },
    ],
    exampleUk:
      'Той самий readPlaywrightReport з path у sandbox — allow, rule id `reports-read-sandbox`. Той самий tool з path на production secrets — deny, rule id `deny-prod-secrets`.',
    qaUk:
      'Парний тест: однаковий tool, різний resource — різний verdict. Переконайтеся, що rule id потрапляє в trace.',
  },
  {
    id: 'sanitized-io',
    titleUk: 'Очищений вхід і вихід',
    termEn: 'sanitized input/output',
    teaserUk: 'У context агента лише те, що пройшло фільтри та ліміти.',
    sections: [
      {
        labelUk: 'Що це',
        bodyUk:
          'Після allow executor повертає результат tool. Перед тим як додати його в messages для наступного кроку LLM, harness застосовує **output validation**: обрізання розміру, маскування секретів, заборона небезпечних полів.',
      },
      {
        labelUk: 'Вхід у модель',
        bodyUk:
          'User/RAG контент теж проходить input checks (PII, injection patterns, max length). Модель не бачить «сирий світ» — лише дозволений зріз даних.',
      },
      {
        labelUk: 'Навіщо QA це знає',
        bodyUk:
          'Якщо в trace з’являється повний API key або 10 МБ HTML звіту — це збій sanitization, навіть якщо policy була allow.',
      },
    ],
    exampleUk:
      'Після read звіту в context потрапляє скорочений JSON зі статусами тестів, без stack trace з токенами. Сирий HTML з диска без ліміту — ознака проблеми.',
    qaUk:
      'Assert у eval: tool result у messages не містить pattern секретів, розмір snippet ≤ політики harness.',
  },
];

export type GuardrailsFailureModeDetail = {
  titleUk: string;
  termEn: string;
  teaserUk: string;
  whatUk: string;
  symptomUk: string;
  mitigationUk: string;
  terms: Array<{ termUk: string; bodyUk: string }>;
};

export const GUARDRAILS_FAILURE_MODES_LIST: GuardrailsFailureModeDetail[] = [
  {
    titleUk: 'Політика занадто м’яка',
    termEn: 'Policy too permissive',
    teaserUk:
      'Агент отримує права, ширші за заплановані, наприклад запис там, де мав бути лише read-only',
    whatUk:
      'Правила дозволяють агенту більше, ніж команда задумала. Наприклад, інструмент може отримати дозвіл на запис у production, хоча для цього сценарію мав бути дозволений лише перегляд даних. Policy Engine може працювати технічно правильно, але сама конфігурація правил залишається небезпечною.',
    symptomUk:
      'У тестовому або staging-середовищі агент успішно викликає ризиковий інструмент, наприклад записує дані або створює issue без потрібного погодження. В аудиті з’являються рішення `allow` для дій, які за погодженою матрицею доступу мали бути заборонені або потребували підтвердження.',
    mitigationUk:
      'Застосувати принцип найменших привілеїв: за замовчуванням не надавати доступ, а дозволяти лише конкретні комбінації інструмента, ресурсу та дії. Для запису в production визначити окремі явні правила. Не використовувати широкі дозволи, які випадково охоплюють небезпечні операції.',
    terms: [
      {
        termUk: 'Policy too permissive',
        bodyUk: 'правила доступу дозволяють більше дій, ніж потрібно для безпечної роботи.',
      },
      {
        termUk: 'Least privilege',
        bodyUk: 'принцип найменших привілеїв, за яким компонент отримує лише ті права, які потрібні для його завдання.',
      },
    ],
  },
  {
    titleUk: 'Обхід Guardrails через непряму ін’єкцію',
    termEn: 'Guardrail bypass via indirect prompt injection',
    teaserUk:
      'Шкідлива інструкція надходить із документа, логу або задачі, а не безпосередньо з чату',
    whatUk:
      'Недовірений текст із зовнішнього джерела, наприклад RAG, логів або Jira ticket, містить інструкцію, яка намагається змусити агента порушити правила. Модель може сприйняти цей текст як інструкцію та запропонувати небезпечний виклик інструмента.',
    symptomUk:
      'Після отримання документа або читання логів агент пропонує небезпечну дію та обґрунтовує її вмістом знайденого тексту. Перевірка формату аргументів може пройти успішно, адже аргументи структурно правильні. Але правильний формат не робить саму дію дозволеною.\n\nВалідація формату перевіряє структуру та допустимі значення, а не гарантує семантичну безпечність довільного тексту. Тому критичні обмеження мають застосовуватися в коді перед виконанням дії.',
    mitigationUk:
      'Не покладатися лише на системний промпт або прохання до моделі бути обережною. Зовнішній текст потрібно трактувати як недовірені дані. Критичні обмеження реалізувати в коді, який перевіряє фактичну дію перед виконанням. За потреби застосовувати ізоляцію середовища, обмеження доступу та додаткову перевірку retrieved content. Реєструвати рішення щодо викликів інструментів, не записуючи чутливі дані без необхідності.',
    terms: [
      {
        termUk: 'Indirect prompt injection',
        bodyUk:
          'спроба вплинути на поведінку моделі через недовірений текст, отриманий із зовнішнього джерела, а не через пряме повідомлення користувача.',
      },
      {
        termUk: 'Guardrail bypass',
        bodyUk: 'ситуація, у якій запланований механізм захисту не зупиняє дію, яку мав обмежити.',
      },
    ],
  },
  {
    titleUk: 'Хибні спрацювання блокують роботу',
    termEn: 'False positives block work',
    teaserUk:
      'Надто суворі правила блокують дозволені read-only дії та заважають завершити задачу',
    whatUk:
      'Політика або інша перевірка надмірно обмежує безпечну дію. Наприклад, помилкове правило блокує читання звіту в дозволеній тестовій теці. Агент стає формально обережним, але не може виконати легітимне завдання.',
    symptomUk:
      'Run завершується відмовою під час безпечного читання. Агент може повторно пропонувати ту саму дію, отримувати повторні відмови або завершувати розслідування без потрібних даних. У метриках збільшується кількість відмов для сценаріїв, які мають бути дозволені.',
    mitigationUk:
      'Розділити правила читання й запису. Явно визначити дозволені шляхи для тестових звітів і логів. Перевіряти зміни політик на наборі позитивних і негативних регресійних тестів. Не послаблювати доступ до production лише для того, щоб виправити блокування безпечного читання.',
    terms: [
      {
        termUk: 'False positive',
        bodyUk: 'хибне спрацювання, коли захист визначає безпечну або дозволену дію як таку, що потрібно заблокувати.',
      },
      {
        termUk: 'Regression test',
        bodyUk: 'тест, який повторно перевіряє вже визначену поведінку після змін у коді або правилах.',
      },
      {
        termUk: 'Positive test',
        bodyUk: 'перевірка того, що дозволена дія успішно виконується.',
      },
      {
        termUk: 'Negative test',
        bodyUk: 'перевірка того, що заборонена або некоректна дія не призводить до виконання.',
      },
      {
        termUk: 'CI (Continuous Integration)',
        bodyUk: 'автоматичний запуск перевірок під час інтеграції змін у коді.',
      },
      {
        termUk: 'Side effect',
        bodyUk: 'зміна зовнішнього стану внаслідок виконання дії, наприклад запис даних у базу.',
      },
    ],
  },
  {
    titleUk: 'Різні правила для різних tools',
    termEn: 'Inconsistent policy across tools',
    teaserUk:
      'Однакова дія отримує різні рішення залежно від інструмента або шляху виклику',
    whatUk:
      'Один і той самий намір, наприклад створити bug, може пройти через Jira MCP, внутрішній handler або інший API. Якщо кожен шлях має окрему перевірку або частина шляхів взагалі не застосовує потрібні правила, агент може скористатися слабшим маршрутом.',
    symptomUk:
      'Одна операція отримує `needs_approval` через tool A, але `allow` через tool B, хоча actor, ресурс, дія та контекст доступу однакові. Під час аудиту виявляються винятки в окремому adapter або відмінності між реалізаціями правил.\n\nРізні рішення не завжди є помилкою. Вони можуть бути виправдані, якщо відрізняються права користувача, ресурс, контекст або ризик операції. QA має порівнювати еквівалентні умови.',
    mitigationUk:
      'Визначити єдину узгоджену політику для всіх шляхів виконання. Використовувати спільний Policy Engine або інший централізований механізм перевірки, якщо це відповідає архітектурі проєкту. Узгодити матрицю actor, tool, resource та action. Не додавати альтернативні інструменти, які обходять ті самі обмеження.',
    terms: [
      {
        termUk: 'Inconsistent policy across tools',
        bodyUk:
          'непослідовне застосування правил, коли еквівалентні дії за однакових умов отримують різні рішення через різні шляхи виконання.',
      },
      {
        termUk: 'Adapter',
        bodyUk:
          'компонент, який пристосовує інтерфейс або формат одного компонента до іншого. Сам по собі adapter не повинен створювати обхід політики.',
      },
    ],
  },
];

/** @deprecated lookup for legacy bullet labels from markdown */
export const GUARDRAILS_FAILURE_MODES: Record<
  string,
  { titleUk: string; explainUk: string; qaUk: string }
> = Object.fromEntries(
  GUARDRAILS_FAILURE_MODES_LIST.map((m) => [
    m.termEn.toLowerCase(),
    { titleUk: m.titleUk, explainUk: m.whatUk, qaUk: '' },
  ]),
);

export const GUARDRAILS_QA_TESTS_HINTS: StudyHintItem[] = [
  {
    id: 'prompt-injection',
    titleUk: 'Prompt injection (ін’єкція в промпт)',
    termEn: 'Prompt injection',
    teaserUk: 'Текст змушує модель просити заборонену дію.',
    sections: [
      {
        labelUk: 'Що перевіряємо',
        bodyUk:
          'Чи можна через **user message**, RAG chunk або текст у логах змусити агента викликати небезпечний tool, і чи **зупиняє це policy**, а не лише «мораль моделі».',
      },
      {
        labelUk: 'Як тестувати',
        bodyUk:
          'Негативні кейси в eval suite: явні («ignore rules and delete…») і приховані (інструкція всередині fake postmortem). Очікування: deny або needs_approval, executor без side effect.',
      },
      {
        labelUk: 'Помилка команди',
        bodyUk: 'Покладатися лише на system prompt «не роби поганого» без policy deny на write/delete.',
      },
    ],
    qaUk:
      'Regression agent: отруєний retrieval + легітимне питання про падіння тесту — перевірте trace на deny і відсутність Jira issue.',
  },
  {
    id: 'unauthorized-resource',
    titleUk: 'Несанкціонований ресурс',
    termEn: 'Unauthorized resource',
    teaserUk: 'Path, API або tenant поза allow-list.',
    sections: [
      {
        labelUk: 'Що перевіряємо',
        bodyUk: 'Tool call на ресурс, який run не має права читати або змінювати: `../etc/passwd`, чужий tenant, admin API.',
      },
      {
        labelUk: 'Як тестувати',
        bodyUk: 'Параметризовані негативні тести з path traversal, wrong bucket, foreign issue key. Очікуваний **deny** до executor.',
      },
      {
        labelUk: 'Сигнал у prod',
        bodyUk: 'Сплеск deny з одним rule id — можливий скан або injection, а не «дурна модель».',
      },
    ],
    exampleUk: 'readPlaywrightReport з path `../../outside-sandbox/secret` — deny, rule id sandbox-path.',
    qaUk: 'Додайте в CI matrix: дозволений path vs заборонений — стабільні різні verdict.',
  },
  {
    id: 'malformed-args',
    titleUk: 'Невалідні аргументи',
    termEn: 'Malformed arguments',
    teaserUk: 'Schema validator ловить зламаний JSON і типи.',
    sections: [
      {
        labelUk: 'Що перевіряємо',
        bodyUk: 'Harness відхиляє виклик **до policy**, якщо аргументи не відповідають JSON schema tool: зайві поля, невірні типи, порожні обов’язкові поля.',
      },
      {
        labelUk: 'Як тестувати',
        bodyUk: 'Мок відповіді моделі з `path: 123` замість string, або з полем `__proto__`. Очікування: validation error, tool не виконується.',
      },
      {
        labelUk: 'Відмінність від policy deny',
        bodyUk: 'Malformed — «неправильна форма», unauthorized — «правильна форма, але заборонений ресурс».',
      },
    ],
    qaUk: 'Assert у логах: validation_failed, без запису policy allow.',
  },
  {
    id: 'privilege-escalation',
    titleUk: 'Підвищення привілеїв',
    termEn: 'Privilege escalation',
    teaserUk: 'Ланцюг викликів дає більше прав, ніж на старті run.',
    sections: [
      {
        labelUk: 'Що перевіряємо',
        bodyUk: 'Чи не може агент після read-only кроків отримати write/admin tool або інший credential через побічні ефекти або помилку state.',
      },
      {
        labelUk: 'Як тестувати',
        bodyUk: 'Сценарій: спочатку read log, потім модель просить `adminWrite` або зміну role. Policy має лишатися на рівні стартового actor.',
      },
      {
        labelUk: 'Де ламається',
        bodyUk: 'Окремий tool з ширшими правами без тієї ж матриці, спільний token між runs.',
      },
    ],
    qaUk: 'Після серії read-only tool calls — негативний write у prod має deny з тим самим actor.',
  },
  {
    id: 'approval-bypass',
    titleUk: 'Обхід human approval',
    termEn: 'Approval bypass',
    teaserUk: 'Ризикова дія без зафіксованого OK людини.',
    sections: [
      {
        labelUk: 'Що перевіряємо',
        bodyUk: 'Дії з verdict needs_approval **не виконуються**, поки в audit немає approval id / timestamp / approver. Перевіряємо race (два паралельні executor) і баги workflow.',
      },
      {
        labelUk: 'Як тестувати',
        bodyUk: 'Спроба create Jira issue без кроку approve в UI, автотест чекає на pending state, потім симулює approve і лише тоді бачить issue.',
      },
      {
        labelUk: 'Що в trace',
        bodyUk: 'Ланцюжок: needs_approval → approval_granted (id) → allow execute. Будь-який пропуск — defect.',
      },
    ],
    qaUk: 'Негатив: force execute API без approval — 403 і немає issue в Jira.',
  },
  {
    id: 'rate-limit-abuse',
    titleUk: 'Зловживання rate limits',
    termEn: 'Rate-limit abuse',
    teaserUk: 'Нескінченний цикл LLM ↔ tool вичерпує бюджет.',
    sections: [
      {
        labelUk: 'Що перевіряємо',
        bodyUk: 'Чи зупиняє harness run при **max_steps**, token/cost cap, RPM на зовнішні API. Інакше один run може «покласти» Jira або LLM billing.',
      },
      {
        labelUk: 'Як тестувати',
        bodyUk: 'Сценарій з моделлю, що в циклі викликає той самий tool, очікування: graceful stop, audit reason `budget_exceeded`, без лавини HTTP.',
      },
      {
        labelUk: 'Відмінність від functional bug',
        bodyUk: 'Це не «неправильна відповідь», а **operational guardrail** — так само важливий для production, як deny на write.',
      },
    ],
    qaUk: 'У regression run задайте max_steps=5 і перевірте, що 6-й propose не доходить до executor.',
  },
];

export const GUARDRAILS_SECURITY_HINTS: StudyHintItem[] = [
  {
    id: 'least-privilege',
    titleUk: 'Найменші привілеї (least privilege)',
    termEn: 'Least privilege',
    teaserUk: 'Run отримує лише ті tools і ресурси, що потрібні для задачі.',
    sections: [
      {
        labelUk: 'Що це',
        bodyUk:
          'Кожен run має **обмежений набір** tool names, paths, API scopes. За замовчуванням deny, allow лише явно для конкретної пари tool + resource.',
      },
      {
        labelUk: 'Чому не «дай агенту все»',
        bodyUk: 'Модель probabilistic — навіть з хорошим промптом може попросити зайве. Менше прав = менша площа blast radius при injection або багу.',
      },
      {
        labelUk: 'На практиці',
        bodyUk: 'Regression agent: read звіт і логи — так, write prod БД — ні, create Jira — лише після approval.',
      },
    ],
    qaUk: 'Рев’ю permission matrix: чи немає wildcard allow на write для всього harness.',
  },
  {
    id: 'defense-in-depth',
    titleUk: 'Багаторівневий захист (defense in depth)',
    termEn: 'Defense in depth',
    teaserUk: 'Кілька незалежних перевірок підряд.',
    sections: [
      {
        labelUk: 'Що це',
        bodyUk: 'Один збій не відкриває все: **input** → **schema** → **policy** → **sandbox на executor** → **output filter**. Промпт — не рівень із цього списку.',
      },
      {
        labelUk: 'Приклад ланцюга',
        bodyUk: 'Injection у RAG може обійти «м’який» input filter, але policy deny на delete, якщо policy помилкова — sandbox не дає вийти за межі директорії.',
      },
      {
        labelUk: 'Для тест-дизайну',
        bodyUk: 'Окремі тести на кожен шар, не один e2e «все добре».',
      },
    ],
    qaUk: 'Карта тестів: який негативний кейс б’є в який шар (validation vs policy vs sandbox).',
  },
  {
    id: 'sandbox',
    titleUk: 'Sandbox (ізоляція виконання)',
    termEn: 'Sandbox',
    teaserUk: 'Обмежений диск, мережа й credentials на executor/MCP.',
    sections: [
      {
        labelUk: 'Що це',
        bodyUk: 'Executor і MCP server працюють з **окремими** обліковками, chroot/volume, egress rules. Навіть при allow tool не може читати довільний host.',
      },
      {
        labelUk: 'Що ламається без sandbox',
        bodyUk: 'Allow на «read file» перетворюється на читання `/etc/passwd` або kube secrets, якщо path не обмежений ОС-рівнем.',
      },
      {
        labelUk: 'MCP',
        bodyUk: 'Сервер MCP — такий самий trust boundary: які tools він реєструє і під яким account ходить у Jira/GitHub.',
      },
    ],
    exampleUk: 'Playwright report лише з volume `/work/reports`, MCP Jira — service account без admin.',
    qaUk: 'Pen-test path traversal після allow — файл поза volume недоступний.',
  },
  {
    id: 'auditability',
    titleUk: 'Аудит (auditability)',
    termEn: 'Auditability',
    teaserUk: 'Кожне рішення можна відтворити після інциденту.',
    sections: [
      {
        labelUk: 'Що це',
        bodyUk: 'Кожен allow / deny / needs_approval / approval_granted пишеться з **rule id**, **actor**, **resource**, timestamp. Без цього security review перетворюється на здогадки.',
      },
      {
        labelUk: 'Зв’язок з observability',
        bodyUk:
          'Ті самі поля, що в розділі про observability: rule id, actor, resource, timestamp — без них не відповісти «чому deny» і «хто схвалив».',
      },
      {
        labelUk: 'Retention',
        bodyUk: 'Логи policy мають жити достатньо довго для compliance і retro після релізу нової політики.',
      },
    ],
    qaUk: 'Після тестового deny у staging знайдіть запис у trace за runId за < 1 хв.',
  },
];

export const GUARDRAILS_PRODUCTION_TOPICS = [
  'Versioning політик і tool schemas — backward compatibility при deploy.',
  'Latency: policy check на кожному tool call не повинен «вбити» run.',
  'Cost і rate limits на LLM + зовнішні API.',
  'Retries з idempotency для безпечних read, обережно з write.',
  'Concurrency: паралельні runs не ділять один approval state.',
  'Degradation: якщо policy service недоступний — fail closed, не open.',
  'Data retention логів policy рішень (compliance).',
  'Monitoring + incident response коли spike deny або bypass спроб.',
];

export const GUARDRAILS_INTERVIEW_QUESTION_UK =
  'Що таке guardrails в агентній системі і чим вони відрізняються від «поради в промпті»?';

export const GUARDRAILS_INTERVIEW_QUESTION_EN =
  'What are guardrails in an agentic system, and how are they different from putting rules only in the prompt?';

export const GUARDRAILS_INTERVIEW_ANSWER_UK =
  'Guardrails — детерміновані обмеження навколо моделі. Модель може **запропонувати** дію, але permissions, validation, sandbox і approval має забезпечувати **надійний код application**, а не промпт.';

export const GUARDRAILS_INTERVIEW_ANSWER_EN =
  'Guardrails are deterministic controls around the model. The model may propose an action, but permissions, validation, sandboxing and approval must be enforced by trusted application code.';

export const GUARDRAILS_REMEMBER_UK =
  'Не зубри визначення. Намалюй flow від входу до виходу і для **кожної стрілки** відповідай: хто виконує (LLM / код / людина), що передається, де state, де policy. Якщо відновлюєш без шпаргалки — тема засвоєна.';
