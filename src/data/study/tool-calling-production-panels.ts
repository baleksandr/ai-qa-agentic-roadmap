import type { FundamentalsCardPanel } from './fundamentals-card-panels';
import type { StudyLearnerPanelSection } from './study-learner-panel-sections';

const traceEventsPick = (): StudyLearnerPanelSection => ({
  type: 'processStepPick',
  labelUk: 'П’ять подій trace',
  pickAriaLabel: 'Події trace для readPlaywrightReport',
  presentation: 'concepts',
  showActorInPanel: false,
  showStepIndexInPanel: false,
  navLayout: 'sidebar',
  steps: [
    {
      key: 'proposal',
      titleUk: 'Пропозиція моделі',
      teaserUk: 'Запит на readPlaywrightReport',
      actorUk: '',
      detailUk:
        'Модель повернула прохання викликати readPlaywrightReport. У trace видно назву запропонованого інструмента та зв’язок із цим розслідуванням. На цьому етапі файл іще не відкривали.',
      qaCheckUk: 'Не сплутати пропозицію з виконанням.',
    },
    {
      key: 'decision',
      titleUk: 'Рішення коду',
      teaserUk: 'Дозвіл або відмова',
      actorUk: '',
      detailUk:
        'Harness перевірив назву інструмента, аргументи та доступ до потрібного звіту. Він записав дозвіл або конкретну причину відмови.',
      qaCheckUk: 'Рішення стоїть перед виконанням. Після deny немає виклику handler.',
    },
    {
      key: 'exec',
      titleUk: 'Виконання інструмента',
      teaserUk: 'Лише після allow',
      actorUk: '',
      detailUk:
        'Лише після дозволу код викликав інструмент читання. Якщо policy відмовила, цього запису в trace не повинно бути.',
      qaCheckUk: 'Подія належить правильному розслідуванню й правильному артефакту.',
    },
    {
      key: 'result',
      titleUk: 'Результат читання',
      teaserUk: 'Фрагмент або помилка',
      actorUk: '',
      detailUk:
        'Викликаний інструмент повернув фактично прочитаний фрагмент або помилку. Помилка означає, що вміст звіту не можна називати отриманим фактом.',
      qaCheckUk: 'Наступний запит моделі відповідає отриманим даним або помилці.',
    },
    {
      key: 'stop',
      titleUk: 'Завершення розслідування',
      teaserUk: 'Продовження або зупинка',
      actorUk: '',
      detailUk:
        'Harness або продовжив роботу з отриманими даними, або завершив run із певним статусом. Зупинка через ліміт чи помилку не дорівнює успішно знайденій причині.',
      qaCheckUk: 'Статус у trace збігається з тим, що бачить користувач.',
    },
  ],
});

const versionLifecyclePick = (): StudyLearnerPanelSection => ({
  type: 'processStepPick',
  labelUk: 'Три моменти життєвого циклу',
  pickAriaLabel: 'Коли перевіряти версію контракту інструмента',
  presentation: 'concepts',
  showActorInPanel: false,
  showStepIndexInPanel: false,
  navLayout: 'sidebar',
  steps: [
    {
      key: 'before',
      titleUk: 'До випуску',
      teaserUk: 'Одна версія аргументів',
      actorUk: '',
      detailUk:
        'На тестовому виклику перевірити, що модельний опис, validator і handler працюють з однією версією аргументів.',
    },
    {
      key: 'after',
      titleUk: 'Після випуску',
      teaserUk: 'Чи не зросли відхилення',
      actorUk: '',
      detailUk:
        'Подивитися, чи не побільшало відхилених пропозицій і помилок інструмента порівняно з попередньою версією.',
    },
    {
      key: 'rca',
      titleUk: 'Під час розбору',
      teaserUk: 'Версія в trace',
      actorUk: '',
      detailUk:
        'Знайти в trace версію контракту для конкретного run. Не пояснювати старий збій правилами нової версії.',
    },
  ],
});

export const TOOL_CALLING_PROD_TRACE_JSON_SAMPLE = `{
  "toolName": "readPlaywrightReport",
  "decision": "allow",
  "durationMs": 42,
  "resultBytes": 8192
}`;

export const TOOL_CALLING_PROD_TRACE: FundamentalsCardPanel = {
  sections: [
    {
      type: 'prose',
      labelUk: 'Простими словами',
      labeledLead: {
        termUk: 'Trace',
        explanationUk: 'послідовність записів про конкретне розслідування.',
      },
      bodyUk:
        'Trace допомагає QA відповісти на конкретні питання: що запропонувала модель, що дозволив код, чи запускали інструмент і який результат він повернув. Одна фінальна відповідь у чаті не показує цих подій.',
    },
    traceEventsPick(),
    {
      type: 'collapsibleTraceSample',
      summaryUk: 'Показати умовний запис trace',
      jsonExample: TOOL_CALLING_PROD_TRACE_JSON_SAMPLE,
      fieldExplanations: [
        {
          termUk: 'toolName',
          explanationUk: 'назва інструмента, про який ідеться в цьому навчальному прикладі',
        },
        {
          termUk: 'decision',
          explanationUk: 'рішення коду. Значення allow означає, що конкретний виклик дозволили',
        },
        {
          termUk: 'durationMs',
          explanationUk: 'умовно 42 мілісекунди роботи інструмента після його запуску',
        },
        {
          termUk: 'resultBytes',
          explanationUk:
            'умовно 8192 байти повернутого результату. Ця цифра не доводить правильності його змісту',
        },
      ],
      calloutUk:
        'Це умовний зведений запис для навчання, а не формат API чи trace цього проєкту. У реальній системі рішення, виконання й результат можуть бути різними подіями. Після deny інструмент не працював, тож durationMs і resultBytes не слід показувати як метрики його виконання.',
    },
    {
      type: 'plain',
      labelUk: 'Що перевіряє QA',
      bodyUk:
        'Після deny немає події виконання. Події належать одному розслідуванню. У логи не записано секрети чи повний вміст файла без потреби. Якщо аргументи приховано або замінено ідентифікатором, із trace все одно зрозуміло, яку дію перевіряли.',
    },
  ],
  terms: [
    { label: 'Redaction', text: 'Приховування чутливих частин даних перед записом у лог.' },
    { label: 'Тривалість виклику', text: 'Час від початку до завершення конкретної операції.' },
  ],
};

export const TOOL_CALLING_PROD_VERSIONING: FundamentalsCardPanel = {
  sections: [
    {
      type: 'plain',
      labelUk: 'Простими словами',
      bodyUk:
        'Модель отримує опис інструмента, а код перевіряє та виконує його аргументи. Якщо змінити опис, validator або handler неузгоджено, пропозиція може перестати працювати після випуску.',
    },
    {
      type: 'plain',
      labelUk: 'На прикладі login_spec',
      bodyUk:
        'Модель отримала опис readPlaywrightReport, у якому для вибору звіту потрібен аргумент path. Після оновлення застосунок почав очікувати інший формат. Якщо оновити тільки validator, а опис для моделі залишити старим, модель продовжить пропонувати старі аргументи. Код відхилятиме їх до читання. Саме тому опис, перевірка й handler повинні погоджуватися між собою.',
    },
    versionLifecyclePick(),
  ],
  terms: [
    {
      label: 'Зворотна сумісність',
      text: 'Здатність нової версії працювати зі старим форматом там, де продукт це обіцяє. Вона не виникає автоматично після зміни схеми.',
    },
  ],
};

export const TOOL_CALLING_PROD_RATE_LIMIT: FundamentalsCardPanel = {
  sections: [
    {
      type: 'plain',
      labelUk: 'Відповідь із лімітом',
      bodyUk:
        'Зовнішній сервіс, наприклад Jira, відмовив приймати нові запити через обмеження частоти. Код може обмежено повторити спробу за правилами продукту або показати зрозумілу помилку.',
    },
    {
      type: 'plain',
      labelUk: 'Невідомий результат запису',
      bodyUk:
        'Якщо відповідь на createJiraIssue загубилася, код може не знати, чи задачу вже створили. Перш ніж повторювати запис, потрібен захист від дубля або перевірка попереднього результату. Просте очікування після rate limit саме по собі цього не вирішує.',
    },
    {
      type: 'labeledLines',
      labelUk: 'Що перевіряє QA',
      items: [
        { termUk: 'Кількість повторів', explanationUk: 'обмежена' },
        { termUk: 'Людина', explanationUk: 'бачить стан операції' },
        {
          termUk: 'Повтор запису',
          explanationUk:
            'не створює дві однакові задачі, якщо продукт обіцяє захист від дубля',
        },
      ],
    },
  ],
  terms: [
    { label: 'Rate limit', text: 'Обмеження кількості запитів до сервісу за певний час.' },
    { label: 'Throttle', text: 'Навмисне сповільнення надсилання запитів застосунком, якщо продукт використовує таке правило.' },
  ],
};

export const TOOL_CALLING_PROD_MAX_STEPS: FundamentalsCardPanel = {
  sections: [
    {
      type: 'plain',
      labelUk: 'Простими словами',
      bodyUk:
        'Після результату інструмента застосунок може знову викликати модель. Якщо модель постійно пропонує той самий інструмент, час і витрати зростають. Тому код обмежує кількість кроків розслідування.',
    },
    {
      type: 'plain',
      labelUk: 'На прикладі login_spec',
      bodyUk:
        'Модель кілька разів поспіль просить прочитати той самий звіт, хоча нових даних не з’явилося. Перед новим кроком код перевіряє межу. Після її досягнення не викликає модель та інструмент знову. У trace й UI зазначено, що цикл завершено через ліміт, а причина падіння може залишатися невідомою.',
    },
    {
      type: 'plain',
      labelUk: 'Що перевіряє QA',
      bodyUk:
        'На підставній моделі, що повторює пропозицію, перевіряє кількість кроків і відсутність нових викликів інструмента після зупинки. UI показує max_steps як причину зупинки, а не як успішний висновок.',
    },
  ],
  terms: [
    { label: 'Max steps', text: 'Найбільша кількість кроків циклу, яку дозволяє код для одного run.' },
  ],
};
