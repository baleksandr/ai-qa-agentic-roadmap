import type { FundamentalsCardPanel } from './fundamentals-card-panels';
import type { StudyPanelTermEntry } from './fundamentals-card-panels';
import type { StudyLearnerPanelSection } from './study-learner-panel-sections';

function harnessPartPanel(
  plainUk: string,
  receivesUk: string,
  doesUk: string,
  returnsUk: string,
  exampleUk: string,
  qaUk: string,
  terms: StudyPanelTermEntry[],
  extraSections: StudyLearnerPanelSection[] = [],
): FundamentalsCardPanel {
  const sections: StudyLearnerPanelSection[] = [
    { type: 'plain', labelUk: 'Простими словами', bodyUk: plainUk },
    { type: 'plain', labelUk: 'Що отримує', bodyUk: receivesUk },
    { type: 'plain', labelUk: 'Що робить', bodyUk: doesUk },
    { type: 'plain', labelUk: 'Що повертає', bodyUk: returnsUk },
    { type: 'plain', labelUk: 'Приклад login_spec', bodyUk: exampleUk },
    ...extraSections,
    { type: 'qaCheck', bodyUk: qaUk },
  ];
  return { sections, terms };
}

export const HARNESS_COMPONENT_CONTEXT: FundamentalsCardPanel = harnessPartPanel(
  'Context builder збирає повідомлення для model API: правила задачі розслідування, факти з CI і, за потреби, уже відомі результати попередніх кроків цього run. Це код, не модель — він вирішує, що саме потрапить у наступний запит.',
  'CI summary з timeout на #login-btn для login_spec, runId розслідування, metadata артефактів без їхнього вмісту, попередні tool results, якщо вони вже є в state.',
  'Формує messages[], додає опис доступних інструментів з registry і не підмішує текст непрочитаного Playwright-звіту.',
  'Готовий payload для model client: messages і tool schemas без вигаданого DOM чи HTML звіту.',
  'У messages лише: «Відомо: login_spec, timeout на #login-btn. Потрібно запропонувати перевірку. Звіт: ще не отриманий». Якщо read уже виконали раніше в цьому run, фрагмент результату може додатися до наступного запиту за правилами продукту.',
  'Кожен факт у messages[] має джерело в CI, state або tool result цього runId. Немає вмісту звіту до фактичного read. runId у payload узгоджений із trace.',
  [
    {
      label: 'messages[]',
      text: 'Набір повідомлень (ролі system, user, assistant тощо), який застосунок надсилає в model API для цього виклику.',
    },
    { label: 'context builder', text: 'Код, який обирає дані для конкретного turn моделі.' },
  ],
);

export const HARNESS_COMPONENT_MODEL_CLIENT: FundamentalsCardPanel = {
  sections: [
    {
      type: 'termDefinition',
      termUk: 'Model client',
      explanationUk:
        'шар коду, який надсилає підготовлений harness запит до API моделі й повертає відповідь або повідомлення про помилку. Це код для зв’язку з моделлю, а не сама модель.',
    },
    {
      type: 'plain',
      labelUk: 'Що отримує',
      bodyUk: 'Підготовлені messages[], параметри виклику, ідентифікатор run для correlation у логах.',
    },
    {
      type: 'plain',
      labelUk: 'Що робить',
      bodyUk:
        'Виконує HTTP/SDK виклик, обробляє timeout і retry за політикою продукту. Якщо провайдер віддає потокову відповідь, збирає chunks за правилами цього API.',
    },
    {
      type: 'plain',
      labelUk: 'Що повертає',
      bodyUk:
        'Текст completion, structured tool call proposal або помилка API (мережа, 429, 5xx) для подальшої обробки harness.',
    },
    {
      type: 'plain',
      labelUk: 'Приклад login_spec',
      bodyUk:
        'Після login_spec перший виклик повертає пропозицію readPlaywrightReport або текстову гіпотезу — harness фіксує raw completion у trace під runId.',
    },
    {
      type: 'qaCheck',
      bodyUk:
        'Відповідь в trace прив’язана до runId і model id. Перевірити обробку timeout і що мережевий успіх не трактується як правильний висновок моделі. Не вимагати однакових полів у всіх провайдерів — перевіряти контракт вашого клієнта.',
    },
  ],
  terms: [
    { label: 'model client', text: 'Код виклику model API, не LLM.' },
    { label: 'completion', text: 'Відповідь моделі на цей виклик, як її повернув API.' },
  ],
};

export const HARNESS_COMPONENT_REGISTRY: FundamentalsCardPanel = harnessPartPanel(
  'Tool registry описує, які інструменти існують у застосунку та яку форму мають їхні аргументи. Це довідник для коду, не виконавець дій.',
  'Конфігурація продукту: імена tools (наприклад readPlaywrightReport) і JSON schema args.',
  'Надає validator і harness імена та схеми для перевірки пропозиції моделі до executor.',
  'Відомий tool проходить до validation; невідоме ім’я відхиляється до handler.',
  'readPlaywrightReport є в registry для login_spec, але наявність у списку не означає дозвіл читати будь-який path — policy вирішує окремо. Вигадана назва tool від моделі відхиляється.',
  'При невідомому імені — відхилення до executor, 0 викликів handler. Registry не підміняє policy.',
  [
    {
      label: 'registry',
      text: 'Перелік відомих інструментів і їхніх описів для коду harness.',
    },
    {
      label: 'schema',
      text: 'Опис полів і типів аргументів tool для перевірки форми пропозиції.',
    },
  ],
);

export const HARNESS_COMPONENT_POLICY: FundamentalsCardPanel = harnessPartPanel(
  'Policy layer перевіряє конкретний запит: чи можна виконати цю дію з цими args для артефакта саме цього run після перевірки форми. Це окремий шар від registry і від schema validation.',
  'Пропозиція tool після validation, ACL артефактів, правила продукту для login_spec run.',
  'Повертає allow (перехід до executor), deny (заборона без I/O) або needs_approval (очікування людини, якщо продукт це передбачає).',
  'Рішення policy в trace і state; при deny або needs_approval без approve executor не запускають.',
  'Модель пропонує read для path звіту run-42: validation OK, policy allow — далі executor. Той самий tool з path іншого run — deny без читання.',
  'Після deny — нуль викликів executor, причина в trace. Needs_approval без approve — немає tool span read. Не змішувати відмову registry, schema fail і policy deny.',
  [
    { label: 'allow', text: 'Код дозволяє перейти до виконання інструмента.' },
    { label: 'deny', text: 'Код забороняє дію без виклику handler.' },
    { label: 'needs_approval', text: 'Очікування рішення людини до виконання, якщо так налаштовано.' },
  ],
);

export const HARNESS_COMPONENT_EXECUTOR: FundamentalsCardPanel = harnessPartPanel(
  'Tool executor запускається лише після registry, validation і policy allow (і approve, якщо потрібно). Він доручає handler виконати дозволену операцію.',
  'Дозволені args, runId, canonical path до артефакту після policy.',
  'Викликає handler (наприклад readPlaywrightReport) у sandbox; не викликається при deny або очікуванні approval.',
  'Tool result: фрагмент прочитаних даних або помилка читання після спроби I/O — не гарантовано HTML і не повний DOM.',
  'Після allow executor читає звіт login_spec run; QA звіряє артефакт із runId. Після deny на policy цей компонент не працював — у trace немає tool execution span.',
  'Spy handler: 0 викликів після deny. При allow перевірити runId у логах і що результат не вигаданий поза tool result.',
  [
    {
      label: 'tool executor',
      text: 'Код, який запускає handler після дозволу policy.',
    },
    { label: 'handler', text: 'Реалізація конкретного інструмента (read файлу тощо).' },
  ],
);

export const HARNESS_COMPONENT_STATE: FundamentalsCardPanel = {
  sections: [
    {
      type: 'plain',
      labelUk: 'Простими словами',
      bodyUk:
        'State manager зберігає дані одного розслідування: події CI, відповіді моделі, рішення policy, tool results, помилки, статус run. Стан оновлює код harness. Це не учасник, який сам викликає API моделі.',
    },
    {
      type: 'labeledLines',
      labelUk: 'Що отримує',
      items: [
        {
          termUk: 'Відповідь моделі',
          explanationUk: 'текст або пропозиція інструмента',
        },
        {
          termUk: 'Рішення policy',
          explanationUk: 'дозвіл, відмова або очікування підтвердження',
        },
        {
          termUk: 'Результат інструмента',
          explanationUk: 'фактично отримані дані або помилка, якщо інструмент викликали',
        },
        {
          termUk: 'Дані запуску',
          explanationUk: 'runId, час і статус кроку',
        },
      ],
    },
    {
      type: 'plain',
      labelUk: 'Як читати список',
      bodyUk:
        'Це можливі події протягом run. Вони не обов’язково виникають усі за один turn.',
    },
    {
      type: 'plain',
      labelUk: 'Що робить',
      bodyUk:
        'Записує зміни під runId. Для наступного turn context builder читає потрібну частину state і готує messages.',
    },
    {
      type: 'plain',
      labelUk: 'Що повертає',
      bodyUk: 'Оновлений state для UI, наступного model turn або фіналізації run.',
    },
    {
      type: 'plain',
      labelUk: 'Приклад login_spec',
      bodyUk:
        'Після read у state з’являється tool result або помилка читання, прив’язані до runId login_spec. Вони не змішуються з іншим розслідуванням.',
    },
    {
      type: 'qaCheck',
      bodyUk:
        'Дані різних runId не змішуються. Помилка читання в state не перетворюється на «успішний DOM» у messages.',
    },
  ],
  terms: [
    { label: 'state', text: 'Збережені факти одного run розслідування.' },
    { label: 'observation', text: 'Результат tool або помилка для наступного turn.' },
  ],
};

export const HARNESS_COMPONENT_LIMITS: FundamentalsCardPanel = harnessPartPanel(
  'Ця частина коду обмежує час очікування, кількість повторів і загальну довжину циклу harness. Правила задає конфігурація продукту.',
  'Таймери викликів API і tools, лічильники retry, лічильник кроків циклу, stop rules.',
  'Перериває завислі виклики, застосовує backoff для retry у дозволених межах, зупиняє run на max steps.',
  'Timeout помилка, продовження з обмеженням або stop reason (max_steps, timeout run).',
  'Після timeout model API може бути невідомо, чи попередній запит завершився на стороні провайдера — harness не обіцяє автоматичний безпечний повтор без політики продукту.',
  'Немає нескінченного циклу read без прогресу. Ліміти max steps і timeout відображаються в trace і UI.',
  [{ label: 'stop rules', text: 'Умови завершення циклу harness.' }],
  [
    {
      type: 'miniCards',
      labelUk: 'Три різні обмеження',
      layout: 'titledStack',
      items: [
        {
          titleUk: 'Timeout виклику',
          tone: 'neutral',
          bodyUk:
            'Межа часу очікування відповіді model API або виконання інструмента. Після перевищення harness фіксує помилку timeout; попередня операція могла завершитися невідомо для клієнта.',
        },
        {
          titleUk: 'Retry',
          tone: 'neutral',
          bodyUk:
            'Обмежена повторна спроба за правилами продукту (backoff, max attempts). Не нескінченний повтор одного й того самого read без прогресу в state.',
        },
        {
          titleUk: 'Max steps',
          tone: 'neutral',
          bodyUk:
            'Верхня межа кількості кроків усього циклу harness для одного runId. Досягнення ліміту зупиняє run навіть якщо модель знову пропонує tool.',
        },
      ],
    },
  ],
);

export const HARNESS_COMPONENT_TRACING: FundamentalsCardPanel = harnessPartPanel(
  'Tracing фіксує події harness під runId: виклики моделі, рішення policy, спроби executor, результати або помилки. Це не доступ до «думок» моделі й не місце для секретів.',
  'Події з model client, policy, executor, state updates під час run.',
  'Емітить spans і структуровані логи з correlation id (runId).',
  'Trace для відновлення порядку: пропозиція tool ≠ виконання; deny без tool execution span.',
  'У trace login_spec: span model call з tool call proposal, span policy allow, span tool read з result або I/O error. При deny немає span виконання інструмента.',
  'За deny перевірити відсутність tool execution. Пропозиція моделі видна окремо від handler. У прикладах trace без реальних токенів і секретів.',
  [
    { label: 'span', text: 'Один запис події в trace (model, policy, tool).' },
    { label: 'correlation id', text: 'Спільний runId для зшивки подій.' },
  ],
);
