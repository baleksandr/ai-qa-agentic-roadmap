import type { FundamentalsCardPanel } from './fundamentals-card-panels';
import type { StudyLearnerPanelSection } from './study-learner-panel-sections';

function panel(
  sections: StudyLearnerPanelSection[],
  terms?: FundamentalsCardPanel['terms'],
): FundamentalsCardPanel {
  return { sections, terms: terms ?? [] };
}

function framed(labelUk: string, bodyUk: string): StudyLearnerPanelSection {
  return { type: 'plain', labelUk, bodyUk, framed: true };
}

function courseBadge(termUk: string): StudyLearnerPanelSection {
  return { type: 'plain', labelUk: 'Термін у курсі', bodyUk: termUk };
}

type QaPickItem = { key: string; titleUk: string; teaserUk: string; detailUk: string };

function qaPick(labelUk: string, pickAriaLabel: string, items: QaPickItem[]): StudyLearnerPanelSection {
  return {
    type: 'processStepPick',
    labelUk,
    pickAriaLabel,
    presentation: 'concepts',
    showActorInPanel: false,
    showStepIndexInPanel: false,
    showNestedCardNumberInPanel: true,
    navLayout: 'sidebar',
    navCompactTitleOnly: true,
    steps: items.map((item) => ({
      key: item.key,
      titleUk: item.titleUk,
      teaserUk: item.teaserUk,
      actorUk: '',
      detailUk: item.detailUk,
    })),
  };
}

function qaCheckBullets(items: string[]): string {
  return items.map((item) => `- ${item}`).join('\n');
}

function proposedMessageFieldsPick(): StudyLearnerPanelSection {
  return {
    type: 'processStepPick',
    labelUk: 'Що містить повідомлення',
    pickAriaLabel: 'Поля повідомлення пропонованої дії',
    presentation: 'concepts',
    showActorInPanel: false,
    showStepIndexInPanel: false,
    showNestedCardNumberInPanel: true,
    pickPanelDetailVariant: 'outcome',
    navLayout: 'sidebar',
    navCompactTitleOnly: true,
    leadUk:
      'Точний формат payload залежить від реалізації harness. Аргументи перевіряються за схемою відповідного інструмента. Навіть валідні аргументи ще не означають, що дія дозволена.',
    steps: [
      {
        key: 'gr-dt-msg-tool-name',
        titleUk: 'tool_name',
        teaserUk: 'Назва запропонованого інструмента',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Що це',
            bodyUk:
              'Назва інструмента, який модель пропонує викликати. Harness використовує її, щоб визначити відповідний інструмент у реєстрі доступних інструментів.',
          },
          {
            labelUk: 'Приклад login_spec',
            bodyUk:
              'Модель пропонує `readPlaywrightReport`, щоб отримати звіт про падіння тесту. Наявність цієї назви в пропозиції не означає, що інструмент зареєстрований, доступний цьому користувачу або дозволений для конкретного ресурсу.',
          },
          {
            labelUk: 'Що перевіряє QA',
            bodyUk: qaCheckBullets([
              'Невідома назва інструмента не запускає виконання.',
              'Зареєстрований інструмент проходить наступні перевірки.',
              'Назва інструмента в trace відповідає фактично запропонованому виклику.',
            ]),
          },
          {
            labelUk: 'Термінологія',
            labeledPairs: [
              { termUk: 'tool_name', explanationUk: 'поле з назвою запропонованого інструмента.' },
              {
                termUk: 'Tool registry',
                explanationUk:
                  'реєстр інструментів, які застосунок дозволяє викликати через визначений інтерфейс.',
              },
            ],
          },
        ],
      },
      {
        key: 'gr-dt-msg-arguments',
        titleUk: 'arguments',
        teaserUk: 'Параметри, з якими модель пропонує виклик',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Що це',
            bodyUk:
              'Аргументи — параметри виклику інструмента. Вони визначають, із якими даними має працювати інструмент, наприклад який файл прочитати або який ресурс перевірити.',
          },
          {
            labelUk: 'Приклад login_spec',
            bodyUk:
              'Модель пропонує `readPlaywrightReport` з параметром `path: "./playwright-report/index.html"`. Застосунок перевіряє структуру аргументів за схемою, а потім окремо перевіряє, чи дозволено читати цей шлях. Коректний формат параметра не гарантує доступу до файлу.',
          },
          {
            labelUk: 'Що перевіряє QA',
            bodyUk: qaCheckBullets([
              'Відсутні обов’язкові поля блокують виклик.',
              'Неправильні типи та параметри відхиляються.',
              'Шлях перевіряється за правилами доступу, а не лише за схемою.',
              'Некоректні або заборонені аргументи не спричиняють побічних ефектів.',
            ]),
          },
          {
            labelUk: 'Термінологія',
            labeledPairs: [
              {
                termUk: 'arguments',
                explanationUk: 'параметри, передані разом із пропозицією виклику інструмента.',
              },
              {
                termUk: 'Schema validation',
                explanationUk: 'перевірка структури, типів і допустимих параметрів виклику.',
              },
            ],
          },
        ],
      },
      {
        key: 'gr-dt-msg-run-id',
        titleUk: 'run_id та ідентифікатори повідомлень',
        teaserUk: 'Зв’язок пропозиції з конкретним запуском і trace',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Що це',
            bodyUk:
              'Ідентифікатори допомагають пов’язати пропозицію інструмента з конкретним запуском агента та відповідними повідомленнями. Набір полів залежить від реалізації harness.',
          },
          {
            labelUk: 'Приклад login_spec',
            bodyUk:
              'У trace потрібно встановити, до якого запуску належить пропозиція `readPlaywrightReport`, яке повідомлення її містило та яке рішення policy було ухвалено після цього.',
          },
          {
            labelUk: 'Що перевіряє QA',
            bodyUk: qaCheckBullets([
              'Пропозицію можна пов’язати з правильним запуском.',
              'Рішення policy та результат виконання не приписуються іншому виклику.',
              'У журналі можна відновити послідовність подій і причину відмови.',
            ]),
          },
          {
            labelUk: 'Термінологія',
            labeledPairs: [
              {
                termUk: 'run_id',
                explanationUk: 'ідентифікатор конкретного запуску workflow або агента.',
              },
              {
                termUk: 'Trace',
                explanationUk: 'послідовність пов’язаних подій, яка допомагає відновити перебіг виконання.',
              },
            ],
          },
        ],
      },
    ],
  };
}

function terminology(items: Array<{ termUk: string; bodyUk: string }>): StudyLearnerPanelSection {
  return { type: 'taxonomy', labelUk: 'Термінологія', items };
}

export const GUARDRAILS_DATA_TRANSFER_PROPOSED_PANEL: FundamentalsCardPanel = panel([
  courseBadge('Proposed action + arguments'),
  framed(
    'Що це',
    'Після відповіді LLM harness отримує структуровану пропозицію виклику інструмента. Вона містить ім’я інструмента та аргументи, а також може містити ідентифікатори запуску й повідомлення для трасування.\n\nЦе лише пропозиція. Вона ще не означає, що файл відкрито, HTTP-запит відправлено, Jira issue створено або запис у базі змінено.',
  ),
  proposedMessageFieldsPick(),
  {
    type: 'miniCards',
    labelUk: 'Приклад login_spec',
    layout: 'titledStack',
    items: [
      {
        titleUk: 'Trace',
        tone: 'neutral',
        bodyUk:
          'Після падіння login_spec модель пропонує виклик readPlaywrightReport із параметром path: "./playwright-report/index.html".\n\nУ trace це має бути видно як запропонований виклик інструмента. Сам факт появи пропозиції не доводить, що файл уже прочитано. Фактичне читання можливе лише після перевірок і допуску до executor.\n\nНе кожна система обов’язково використовує саме такі поля чи формат trace.',
      },
    ],
  },
  qaPick('Що перевіряє QA', 'Перевірки пропонованої дії', [
    {
      key: 'gr-dt-prop-not-exec',
      titleUk: 'Пропозиція не дорівнює виконанню',
      teaserUk: 'Після отримання tool call застосунок не виконує дію автоматично',
      detailUk:
        'Перевір, що після появи tool call у відповіді моделі застосунок не викликає executor одразу. Спочатку мають відбути перевірки схеми, policy та інші передбачені кроки. У trace пропозицію можна відокремити від фактичного виконання інструмента.',
    },
    {
      key: 'gr-dt-prop-args',
      titleUk: 'Аргументи перевіряються',
      teaserUk: 'Некоректні параметри не передаються на виконання',
      detailUk:
        'Передай відсутні обов’язкові поля, неправильні типи або зайві параметри. Такий виклик відхиляється до executor. Коректні аргументи не замінюють перевірку доступу в policy engine.',
    },
    {
      key: 'gr-dt-prop-side',
      titleUk: 'Відсутній побічний ефект',
      teaserUk: 'Без дозволу немає змін у зовнішніх системах',
      detailUk:
        'Якщо дія не отримала дозволу, Jira issue не створюється, заборонений файл не читається, а база даних не змінюється.',
    },
    {
      key: 'gr-dt-prop-audit',
      titleUk: 'Є слід для аудиту',
      teaserUk: 'У trace видно пропозицію та подальші етапи',
      detailUk:
        'У trace можна встановити, яку дію запропонувала модель і що сталося з нею на наступних етапах. Перевіряй фактично реалізований механізм журналювання, якщо trace і audit розділені.',
    },
  ]),
  terminology([
    { termUk: 'Proposed action', bodyUk: 'запропонована моделлю дія, яка ще не означає фактичного виконання.' },
    { termUk: 'Tool call', bodyUk: 'структурований виклик інструмента з його назвою та аргументами.' },
    { termUk: 'Arguments', bodyUk: 'параметри, які модель передає інструменту.' },
    {
      termUk: 'Harness',
      bodyUk: 'код застосунку, який керує взаємодією з моделлю, перевірками та виконанням інструментів.',
    },
    {
      termUk: 'Side effect',
      bodyUk: 'зміна поза моделлю, наприклад створення Jira issue, запис у базу або читання файлу.',
    },
  ]),
]);

export const GUARDRAILS_DATA_TRANSFER_POLICY_PANEL: FundamentalsCardPanel = panel([
  courseBadge('Policy decision'),
  framed(
    'Що це',
    'Policy engine — це код, який зіставляє контекст виклику з правилами доступу. Залежно від реалізації перевіряються actor, tool, ресурс і тип операції.\n\nРезультат перевірки — одне з рішень: ALLOW, DENY або NEEDS_APPROVAL.',
  ),
  {
    type: 'miniCards',
    labelUk: 'Можливі рішення',
    layout: 'titledStack',
    items: [
      {
        titleUk: 'ALLOW',
        tone: 'neutral',
        bodyUk:
          'Дію дозволено за правилами policy. Вона може перейти до наступних перевірок, але це ще не скасовує інших обов’язкових умов виконання.',
      },
      {
        titleUk: 'DENY',
        tone: 'neutral',
        bodyUk: 'Дію заборонено. Executor не повинен виконувати її.',
      },
      {
        titleUk: 'NEEDS_APPROVAL',
        tone: 'neutral',
        bodyUk:
          'Потрібне погодження. Workflow очікує на підтвердження, а до виконання можна переходити лише після перевірки погодження та інших необхідних умов.',
      },
    ],
  },
  {
    type: 'processStepPick',
    labelUk: 'Приклад login_spec',
    pickAriaLabel: 'Дозволений і заборонений шлях для readPlaywrightReport',
    presentation: 'concepts',
    showActorInPanel: false,
    showStepIndexInPanel: false,
    showNestedCardNumberInPanel: false,
    navLayout: 'sidebar',
    navCompactTitleOnly: true,
    steps: [
      {
        key: 'gr-dt-pol-allow',
        titleUk: 'Дозволений шлях',
        teaserUk: 'Файл у дозволеному sandbox',
        actorUk: '',
        detailUk:
          'readPlaywrightReport запитує файл у дозволеному sandbox. Policy може повернути ALLOW, якщо виклик відповідає налаштованим правилам.',
      },
      {
        key: 'gr-dt-pol-deny',
        titleUk: 'Заборонений шлях',
        teaserUk: 'Доступ до production secrets',
        actorUk: '',
        detailUk:
          'Той самий інструмент запитує файл із production secrets. Policy має повернути DENY, якщо правила забороняють доступ до цього ресурсу.',
      },
    ],
    pickConclusionUk:
      'Рішення залежить не лише від назви інструмента, а й від ресурсу та контексту. Назви reports-read-sandbox і deny-prod-secrets можна показувати як приклади rule ID, а не як гарантовані назви правил у кожній реалізації.',
  },
  {
    type: 'miniCards',
    labelUk: 'Що потрапляє в журнал',
    layout: 'titledStack',
    captionUk:
      'Журнал має допомогти відновити, чому конкретний виклик отримав певне рішення. Не записуй секрети або повні чутливі аргументи лише заради аудиту.',
    items: [
      {
        titleUk: 'Рішення',
        tone: 'neutral',
        bodyUk: 'allow, deny або needs_approval.',
      },
      {
        titleUk: 'Правило',
        tone: 'neutral',
        bodyUk: 'ідентифікатор правила, якщо його підтримує реалізація.',
      },
      {
        titleUk: 'Контекст',
        tone: 'neutral',
        bodyUk: 'actor, інструмент і ресурс у межах дозволеного журналювання.',
      },
      {
        titleUk: 'Причина',
        tone: 'neutral',
        bodyUk: 'пояснення, чому дію дозволено, відхилено або зупинено до погодження.',
      },
    ],
  },
  qaPick('Що перевіряє QA', 'Перевірки policy engine', [
    {
      key: 'gr-dt-pol-resources',
      titleUk: 'Один інструмент, різні ресурси',
      teaserUk: 'Дозволений і заборонений шлях отримують різні рішення',
      detailUk:
        'Однаковий tool call із дозволеним і забороненим шляхом отримує відповідні рішення згідно з policy.',
    },
    {
      key: 'gr-dt-pol-deny-stop',
      titleUk: 'DENY зупиняє виконання',
      teaserUk: 'Після відмови немає побічних ефектів',
      detailUk:
        'Після відмови немає фактичного читання, запису чи іншого побічного ефекту.',
    },
    {
      key: 'gr-dt-pol-approval',
      titleUk: 'Погодження є окремим етапом',
      teaserUk: 'NEEDS_APPROVAL не запускає дію одразу',
      detailUk:
        'NEEDS_APPROVAL не запускає дію до отримання та перевірки необхідного підтвердження.',
    },
    {
      key: 'gr-dt-pol-reason',
      titleUk: 'Причина доступна для перевірки',
      teaserUk: 'Рішення та причина без секретів',
      detailUk:
        'За trace або audit можна встановити рішення та причину, не розкриваючи секретів.',
    },
  ]),
  terminology([
    { termUk: 'Policy engine', bodyUk: 'компонент коду, який перевіряє дію за правилами доступу.' },
    {
      termUk: 'Policy decision / verdict',
      bodyUk: 'результат перевірки, наприклад ALLOW, DENY або NEEDS_APPROVAL.',
    },
    { termUk: 'Actor', bodyUk: 'користувач, агент або інший суб’єкт, від імені якого виконується дія.' },
    {
      termUk: 'Resource',
      bodyUk: 'об’єкт, до якого звертається дія, наприклад файл, Jira issue або endpoint.',
    },
    { termUk: 'Rule ID', bodyUk: 'ідентифікатор правила, яке застосували під час ухвалення рішення.' },
    {
      termUk: 'Audit log',
      bodyUk: 'журнал подій і рішень, потрібний для перевірки та розслідування.',
    },
  ]),
]);

export const GUARDRAILS_DATA_TRANSFER_SANITIZED_PANEL: FundamentalsCardPanel = panel([
  courseBadge('Sanitized input/output'),
  framed(
    'Що відбувається після виконання',
    'Після дозволеного виклику executor повертає результат інструмента. Перед додаванням цього результату до повідомлень наступного запиту LLM застосунок може перевірити формат і розмір, прибрати або замаскувати секрети та відкинути недозволені поля.\n\nКонкретні перевірки залежать від реалізації. Не стверджуй, що всі harness обов’язково мають однакові фільтри.',
  ),
  {
    type: 'miniCards',
    labelUk: 'Що перевіряється',
    layout: 'titledStack',
    items: [
      {
        titleUk: 'Формат і розмір',
        tone: 'neutral',
        bodyUk: 'Результат відповідає очікуваному формату та встановленим обмеженням розміру.',
      },
      {
        titleUk: 'Секрети й чутливі дані',
        tone: 'neutral',
        bodyUk:
          'Токени, ключі та інші чутливі значення не потрапляють у контекст моделі, якщо правила вимагають їх видалення або маскування.',
      },
      {
        titleUk: 'Вміст для наступного запиту',
        tone: 'neutral',
        bodyUk: 'У повідомлення LLM потрапляє лише той результат, який дозволено передавати далі.',
      },
    ],
  },
  framed(
    'Вхідні дані теж потребують перевірки',
    'Дані користувача та фрагменти з RAG можуть містити персональні дані, надмірний обсяг тексту або інструкції prompt injection. Застосунок має застосовувати відповідні перевірки та обмеження перед передаванням таких даних моделі. Сам факт очищення не означає, що будь-який prompt injection гарантовано виявлено.',
  ),
  {
    type: 'miniCards',
    labelUk: 'Приклад login_spec',
    layout: 'titledStack',
    captionUk:
      'Конкретний формат результату залежить від інструмента. Не вважай скорочений JSON обов’язковим результатом кожного читання.',
    items: [
      {
        titleUk: 'До перевірки',
        tone: 'neutral',
        bodyUk:
          'Результат читання Playwright-звіту може містити велику кількість HTML, stack trace та чутливі значення.',
      },
      {
        titleUk: 'Після перевірки',
        tone: 'neutral',
        bodyUk:
          'У контекст наступного запиту додається потрібний фрагмент звіту в межах установлених обмежень. Секрети маскуються або вилучаються відповідно до політики застосунку.',
      },
    ],
  },
  qaPick('Що перевіряє QA', 'Перевірки sanitized input/output', [
    {
      key: 'gr-dt-san-size',
      titleUk: 'Обмеження розміру',
      teaserUk: 'Великий результат обробляється за лімітами',
      detailUk: 'Надмірно великий результат обробляється згідно з установленими лімітами.',
    },
    {
      key: 'gr-dt-san-secrets',
      titleUk: 'Відсутність секретів',
      teaserUk: 'Секрети не потрапляють у наступний запит',
      detailUk:
        'У повідомленнях наступного запиту немає тестових секретів, які мали бути замасковані або вилучені.',
    },
    {
      key: 'gr-dt-san-useful',
      titleUk: 'Збереження корисних даних',
      teaserUk: 'Залишаються факти для діагностики',
      detailUk:
        'Після очищення залишаються потрібні для діагностики факти, наприклад статус тесту та релевантна помилка.',
    },
    {
      key: 'gr-dt-san-context',
      titleUk: 'Перевірка фактичного контексту',
      teaserUk: 'QA дивиться дані в запиті LLM',
      detailUk:
        'QA перевіряє саме дані, передані в наступний запит LLM, а не лише результат, який повернув інструмент.',
    },
  ]),
  terminology([
    {
      termUk: 'Sanitization',
      bodyUk: 'обробка даних перед передаванням далі, наприклад маскування секретів або видалення недозволених полів.',
    },
    {
      termUk: 'Input validation',
      bodyUk: 'перевірка вхідних даних на відповідність очікуваному формату та обмеженням.',
    },
    {
      termUk: 'Output validation',
      bodyUk: 'перевірка результату інструмента перед використанням у наступному кроці.',
    },
    {
      termUk: 'Context',
      bodyUk: 'дані та повідомлення, які застосунок передає моделі в конкретному запиті.',
    },
    {
      termUk: 'Prompt injection',
      bodyUk:
        'спроба вплинути на поведінку моделі через інструкції у вхідному вмісті, наприклад у документі або звіті.',
    },
    { termUk: 'PII', bodyUk: 'персональні дані, за якими можна ідентифікувати людину.' },
  ]),
]);
