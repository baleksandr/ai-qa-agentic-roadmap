import type { FundamentalsCardPanel } from './fundamentals-card-panels';
import type {
  StudyLearnerPanelProcessStepPickSection,
  StudyLearnerPanelSection,
} from './study-learner-panel-sections';

const PRODUCTION_NESTED_HINT_UK =
  'Оберіть картку, щоб прочитати пояснення поруч. На телефоні воно з’явиться під картками.';

const productionNestedPick = (
  labelUk: string,
  pickAriaLabel: string,
  steps: StudyLearnerPanelProcessStepPickSection['steps'],
): StudyLearnerPanelSection => ({
  type: 'processStepPick',
  labelUk,
  pickAriaLabel,
  presentation: 'concepts',
  showActorInPanel: false,
  showStepIndexInPanel: false,
  navLayout: 'sidebar',
  interactionHintUk: PRODUCTION_NESTED_HINT_UK,
  steps,
});

const traceTraceStep = (
  key: string,
  titleUk: string,
  teaserUk: string,
  detailUk: string,
  qaCheckUk: string,
): StudyLearnerPanelProcessStepPickSection['steps'][number] => ({
  key,
  titleUk,
  teaserUk,
  actorUk: '',
  detailUk,
  qaCheckUk,
});

const TRACE_WHAT_TO_LOOK_STEPS: StudyLearnerPanelProcessStepPickSection['steps'] = [
  traceTraceStep(
    'model-request',
    'Запит моделі',
    'Які факти код передав моделі',
    'Перевірте, чи запит містив повідомлення CI про timeout на #login-btn і правильний runId. Якщо звіт Playwright ще не читали, його вмісту тут немає.',
    'Зіставити кожен переданий факт із його джерелом.',
  ),
  traceTraceStep(
    'tool-proposal',
    'Пропозиція інструмента',
    'Що модель попросила зробити',
    'Відповідь моделі може містити пропозицію readPlaywrightReport з аргументами. Це ще не означає, що файл відкрили.',
    'Побачити окремо назву інструмента й аргументи, не плутати пропозицію з виконанням.',
  ),
  traceTraceStep(
    'policy',
    'Рішення policy',
    'Чи дозволив код конкретний виклик',
    'Після перевірки назви, аргументів і доступу код фіксує дозвіл, відмову або очікування підтвердження, якщо воно потрібне. Для відмови важлива конкретна причина.',
    'Рішення передує виконанню. Після deny події запуску інструмента немає.',
  ),
  traceTraceStep(
    'execution',
    'Виконання',
    'Чи справді запустили інструмент',
    'Лише після необхідних перевірок executor викликає handler. У trace ця подія відокремлена від пропозиції моделі. Якщо був deny, виконання не відбувається.',
    'Звірити виклик із дозволом, runId і артефактом.',
  ),
  traceTraceStep(
    'result',
    'Результат',
    'Що інструмент фактично повернув',
    'Після запуску інструмент повертає прочитані дані або помилку. Успіх не гарантує повного DOM, а помилка не є доказом вмісту непрочитаного звіту.',
    'Перевірити, що наступний запит моделі отримав саме цей результат або помилку, якщо run продовжився.',
  ),
  traceTraceStep(
    'completion',
    'Завершення',
    'Чим закінчився run',
    'Код фіксує підсумок для людини або причину зупинки, наприклад max_steps чи timeout. Завершення через ліміт не можна показувати як успішно знайдену причину падіння.',
    'Статус у trace відповідає статусу в UI та доступним доказам.',
  ),
];

const VERSION_QA_TIMING_STEPS: StudyLearnerPanelProcessStepPickSection['steps'] = [
  traceTraceStep(
    'before-release',
    'До випуску',
    'Перевірити контракт до оновлення',
    'Порівняйте назву readPlaywrightReport, опис аргументів для моделі, validator і те, що приймає handler. Якщо змінено поле path, підготовлений tool call має або працювати з новим контрактом, або отримувати зрозумілу помилку.',
    'Integration-тести для дозволеного виклику та для старого формату аргументів.',
  ),
  traceTraceStep(
    'after-release',
    'Після випуску',
    'Помітити нові помилки після оновлення',
    'Порівняйте частоту помилок validation і фактичних помилок інструмента до та після випуску. Це різні проблеми: у першому випадку інструмент не стартує, у другому він стартував, але не повернув потрібних даних.',
    'Відкрити кілька trace із новими помилками та визначити етап збою.',
  ),
  traceTraceStep(
    'during-rca',
    'Під час розбору',
    'Відновити версію конкретного run',
    'Для збою login_spec знайдіть версію коду harness і контракту інструмента, з якими відбувся цей run. Лише тоді можна зрозуміти, чому конкретну пропозицію моделі прийняли або відхилили.',
    'Не приписувати старому run поведінку поточної версії застосунку.',
  ),
];

export const HARNESS_PRODUCTION_TRACE: FundamentalsCardPanel = {
  sections: [
    {
      type: 'plain',
      labelUk: 'Простими словами',
      bodyUk:
        'Коли login_spec падає, застосунок створює окреме розслідування. Його ідентифікатор пов’язує події цього розслідування. У trace QA бачить, що модель запропонувала, яке рішення ухвалив код, чи викликав інструмент і що той повернув.',
    },
    productionNestedPick(
      'Що шукати в trace',
      'Запит моделі, пропозиція, policy, виконання, результат і завершення',
      TRACE_WHAT_TO_LOOK_STEPS,
    ),
    {
      type: 'plain',
      labelUk: 'Приклад login_spec',
      bodyUk:
        'QA знаходить розслідування за runId і бачить: модель запропонувала readPlaywrightReport, policy дозволила читання, інструмент повернув помилку. Отже, фінальний текст не може посилатися на нібито прочитаний звіт.',
    },
    {
      type: 'plain',
      labelUk: 'Що перевіряє QA',
      bodyUk:
        'Події мають правильний порядок і належать одному розслідуванню. Чутливі дані не потрапляють до логів без потреби.',
    },
  ],
  terms: [
    { label: 'trace', text: 'Запис подій, за яким можна відновити перебіг run.' },
    {
      label: 'correlation ID',
      text:
        'Ідентифікатор, який допомагає пов’язати події та запити однієї операції. У конкретній реалізації він може збігатися з runId або бути окремим полем. Не називай їх завжди тотожними.',
    },
  ],
};

const HARNESS_METRICS_KIND_STEPS: StudyLearnerPanelProcessStepPickSection['steps'] = [
  {
    key: 'latency',
    titleUk: 'Час роботи',
    teaserUk: 'Тривалість run і окремих викликів',
    actorUk: '',
    detailUk:
      'Вимірюють тривалість усього розслідування та окремих звернень до моделі й інструмента. Якщо після оновлення читання звіту стало довшим, QA може зіставити зміну з конкретним етапом. Сам по собі швидкий run не доводить правильного висновку.',
    qaCheckUk: 'Порівняти час до й після оновлення для схожих сценаріїв.',
  },
  {
    key: 'tool-errors',
    titleUk: 'Помилки інструментів',
    teaserUk: 'Невдалі read після фактичного виклику',
    actorUk: '',
    detailUk:
      'Показують частку фактичних викликів readPlaywrightReport, що завершилися помилкою. Відмови policy рахують окремо: за них інструмент не запускався.',
    qaCheckUk: 'Перевірити, що після deploy збільшення помилок не маскується як успішне читання.',
  },
  {
    key: 'max-steps',
    titleUk: 'Зупинка через ліміт',
    teaserUk: 'Run без звичайного завершення',
    actorUk: '',
    detailUk:
      'Показує частку розслідувань, що дійшли до max steps без звичайного завершення. Зростання може вказувати на повторні пропозиції інструмента або іншу проблему циклу. Причину встановлюють за trace конкретних run.',
    qaCheckUk: 'Порівняти статуси й відкрити приклади run, у яких спрацював ліміт.',
  },
];

const HARNESS_SLI_SLO_SLA_STEPS: StudyLearnerPanelProcessStepPickSection['steps'] = [
  {
    key: 'sli',
    titleUk: 'SLI — що виміряли',
    teaserUk: 'Конкретний показник за період',
    actorUk: '',
    detailSections: [
      {
        labelUk: 'Service Level Indicator',
        bodyUk:
          'Конкретний показник роботи сервісу. Наприклад, частка розслідувань login_spec, які завершилися з відповіддю протягом заданого часу. Для показника треба визначити, які run рахують і за який період.',
      },
    ],
  },
  {
    key: 'slo',
    titleUk: 'SLO — якої цілі прагнемо',
    teaserUk: 'Ціль для показника SLI',
    actorUk: '',
    detailSections: [
      {
        labelUk: 'Service Level Objective',
        bodyUk:
          'Ціль для показника SLI за визначений період. Умовний приклад: «Не менше 95% таких run завершуються протягом 30 секунд за тиждень». Цифри тут лише навчальні, не реальна ціль нашого продукту.',
      },
    ],
  },
  {
    key: 'sla',
    titleUk: 'SLA — що пообіцяли в угоді',
    teaserUk: 'Домовленість про рівень сервісу',
    actorUk: '',
    detailSections: [
      {
        labelUk: 'Service Level Agreement',
        bodyUk:
          'Домовленість із користувачем або замовником про рівень сервісу. Вона може визначати, як вимірюють виконання та що відбувається, якщо обіцянку не виконано. Не кожне внутрішнє SLO є частиною SLA.',
      },
    ],
  },
  {
    key: 'together',
    titleUk: 'Разом на прикладі',
    teaserUk: 'Як пов’язані три поняття',
    actorUk: '',
    detailSections: [
      {
        labelUk: 'На прикладі',
        labeledPairs: [
          { termUk: 'SLI', explanationUk: 'виміряли частку run, що завершилися за 30 секунд.' },
          { termUk: 'SLO', explanationUk: 'команда поставила ціль: щонайменше 95% за тиждень.' },
          {
            termUk: 'SLA',
            explanationUk:
              'якщо таке зобов’язання внесене в угоду, там описано обіцянку й умови її застосування.',
          },
        ],
      },
    ],
  },
];

export const HARNESS_PRODUCTION_METRICS: FundamentalsCardPanel = {
  sections: [
    productionNestedPick('Три види метрик', 'Час, помилки інструментів і зупинка через ліміт', HARNESS_METRICS_KIND_STEPS),
    productionNestedPick(
      'SLI vs SLO vs SLA — одна картина',
      'Показник, ціль, угода та приклад',
      HARNESS_SLI_SLO_SLA_STEPS,
    ),
    {
      type: 'prose',
      labelUk: 'Що означає SLO',
      labeledLead: {
        termUk: 'SLO',
        explanationUk:
          '(Service Level Objective) — цільовий рівень роботи сервісу за визначений період.',
      },
      bodyUk:
        'Команда може встановити ціль для часу відповіді або частки помилок. Саме значення цілі визначає продукт, а не модель. Не кожна метрика з дашборду автоматично є SLO.',
    },
    {
      type: 'courseLessonLink',
      topicId: 'reference-library',
      linkLabelUk: 'Детальніше: SLI vs SLO vs SLA',
    },
  ],
};

export const HARNESS_PRODUCTION_VERSIONS: FundamentalsCardPanel = {
  sections: [
    {
      type: 'plain',
      labelUk: 'Простими словами',
      bodyUk:
        'Після зміни інструмента readPlaywrightReport старий формат аргументів може перестати відповідати новим правилам. Тому команда фіксує версії коду й схеми та перевіряє їхню сумісність до випуску.',
    },
    {
      type: 'plain',
      labelUk: 'Приклад login_spec',
      bodyUk:
        'Раніше інструмент приймав поле path. У новій версії контракт змінили. Перед оновленням QA перевіряє, що код, опис інструмента для моделі та валідатор погоджені між собою. Інакше модель може запропонувати аргументи, які новий handler уже не приймає.',
    },
    productionNestedPick(
      'Коли QA перевіряє сумісність',
      'До випуску, після випуску та під час розбору',
      VERSION_QA_TIMING_STEPS,
    ),
  ],
  terms: [
    {
      label: 'tool schema',
      text: 'Опис полів і типів аргументів, які приймає інструмент.',
    },
  ],
};
