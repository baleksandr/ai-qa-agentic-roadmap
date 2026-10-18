import type { FundamentalsCardPanel } from './fundamentals-card-panels';
import type {
  StudyLearnerPanelProcessStepPickSection,
  StudyLearnerPanelSection,
} from './study-learner-panel-sections';

const cyclePick = (
  labelUk: string,
  pickAriaLabel: string,
  steps: StudyLearnerPanelProcessStepPickSection['steps'],
  options?: Pick<
    StudyLearnerPanelProcessStepPickSection,
    'showNestedCardNumberInPanel' | 'pickPanelDetailVariant'
  >,
): StudyLearnerPanelSection => ({
  type: 'processStepPick',
  labelUk,
  pickAriaLabel,
  presentation: 'concepts',
  showActorInPanel: false,
  showStepIndexInPanel: false,
  navLayout: 'rowAbovePanel',
  showNestedCardNumberInPanel: options?.showNestedCardNumberInPanel,
  pickPanelDetailVariant: options?.pickPanelDetailVariant,
  steps,
});

function cycleCardPanel(
  plainUk: string,
  middle: StudyLearnerPanelSection,
  qaUk: string,
  termLabel: string,
  termText: string,
): FundamentalsCardPanel {
  return {
    sections: [
      { type: 'plain', labelUk: 'Простими словами', bodyUk: plainUk },
      middle,
      { type: 'qaCheck', bodyUk: qaUk },
    ],
    terms: [{ label: termLabel, text: termText }],
  };
}

export const HARNESS_CYCLE_TEXT_RESPONSE: FundamentalsCardPanel = cycleCardPanel(
  'Текстова відповідь моделі ще не означає, що причину падіння встановлено. Harness перевіряє формат, якщо він заданий контрактом, і правила завершення. Висновок для людини має відповідати доступним доказам.',
  {
    type: 'plain',
    labelUk: 'Приклад login_spec',
    bodyUk:
      'Якщо доступний лише CI timeout на #login-btn, відповідь може назвати можливі причини й попросити код тесту або trace. Вона не повинна стверджувати, що прочитала звіт чи побачила DOM.',
  },
  'У фінальному тексті неперевірена причина позначена як гіпотеза. Статус UI не подає припущення як доведений результат.',
  'фінальна відповідь',
  'Текст, який застосунок вирішив показати людині після своїх перевірок. Відсутність нового tool call сама по собі не робить його правильним.',
);

export const HARNESS_CYCLE_TOOL_PROPOSAL: FundamentalsCardPanel = cycleCardPanel(
  'Модель повернула пропозицію readPlaywrightReport. Harness перевіряє, чи знає такий інструмент, чи правильні аргументи й чи дозволено читати артефакт саме цього run. Лише після успішних перевірок код запускає інструмент.',
  cyclePick(
    'Можливі результати перевірки',
    'Дозволено, відмовлено або потрібне підтвердження',
    [
      {
        key: 'allow',
        titleUk: 'Дозволено',
        teaserUk: 'Перевірки пройдено, код може запустити інструмент',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Коли так буває',
            bodyUk:
              'інструмент відомий, аргументи правильні, доступ до звіту цього run дозволений.',
          },
          {
            labelUk: 'Що робить код',
            bodyUk: 'передає перевірений запит інструменту.',
          },
          {
            labelUk: 'Чи запускається інструмент',
            bodyUk: 'так, після перевірок. Файл до цього моменту ще не прочитано.',
          },
        ],
        qaCheckUk:
          'Рішення allow записано до виклику executor. Інструмент отримав аргументи саме того run, який перевірили.',
      },
      {
        key: 'deny',
        titleUk: 'Відмовлено',
        teaserUk: 'Правила заборонили дію, інструмент не запускають',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Коли так буває',
            bodyUk: 'шлях веде до чужого артефакта або виходить за дозволену область.',
          },
          {
            labelUk: 'Що робить код',
            bodyUk: 'записує причину відмови.',
          },
          {
            labelUk: 'Чи запускається інструмент',
            bodyUk: 'ні. Помилки читання немає, бо читання навіть не починалося.',
          },
        ],
        qaCheckUk: 'У trace видно deny і його причину. Події виконання інструмента немає.',
      },
      {
        key: 'needs-approval',
        titleUk: 'Потрібне підтвердження',
        teaserUk: 'Можливий варіант політики для ризикової дії, не обов’язковий крок читання звіту',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Коли так буває',
            bodyUk:
              'правила продукту вимагають рішення людини для конкретної ризикової дії.',
          },
          {
            labelUk: 'Що робить код',
            bodyUk: 'призупиняє цю дію й чекає рішення.',
          },
          {
            labelUk: 'Чи запускається інструмент',
            bodyUk:
              'тільки після підтвердження. Якщо людина відхилила дію, інструмент не запускається.',
          },
        ],
        qaCheckUk:
          'До рішення людини немає виклику executor. Рішення й подальша дія належать одному run.',
      },
    ],
    { showNestedCardNumberInPanel: false, pickPanelDetailVariant: 'outcome' },
  ),
  'У trace рішення про дозвіл передує запуску інструмента. Після відмови немає виклику handler.',
  'validation',
  'Перевірка форми й значень аргументів у коді. Вона не замінює перевірку дозволу.',
);

export const HARNESS_CYCLE_TOOL_RESULT: FundamentalsCardPanel = cycleCardPanel(
  'Якщо читання було дозволено й інструмент викликано, він може повернути фрагмент звіту або помилку. Harness пов’язує отримане з runId. Якщо потрібен ще один виклик моделі, код передає їй саме цей результат або цю помилку.',
  cyclePick(
    'Два можливі результати',
    'Фрагмент даних або помилка після виклику інструмента',
    [
      {
        key: 'data',
        titleUk: 'Дані отримано',
        teaserUk: 'Інструмент повернув фактично прочитаний фрагмент',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Що сталося',
            bodyUk:
              'Після дозволу інструмент прочитав доступний артефакт і повернув фактично отриманий фрагмент звіту.',
          },
          {
            labelUk: 'Що робить код',
            bodyUk:
              'Harness прив’язує фрагмент до цього run і записує результат. Якщо розслідування продовжується, код додає фрагмент до наступного запиту моделі.',
          },
          {
            labelUk: 'Чого ще не знаємо',
            bodyUk:
              'Фрагмент може містити лише частину звіту. Сам факт успішного читання ще не доводить причину timeout на #login-btn.',
          },
          {
            labelUk: 'Що перевіряє QA',
            bodyUk:
              'Результат належить потрібному run. Конкретні твердження у висновку моделі підтверджуються прочитаним фрагментом.',
          },
        ],
      },
      {
        key: 'error',
        titleUk: 'Сталася помилка',
        teaserUk: 'Інструмент не повернув вміст звіту',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Що сталося',
            bodyUk:
              'Після дозволу інструмент спробував відкрити звіт, але повернув помилку. Наприклад, файл цього запуску не знайдено.',
          },
          {
            labelUk: 'Що робить код',
            bodyUk:
              'Harness записує помилку для цього run. За правилами продукту він може передати її моделі в наступному запиті або завершити розслідування з поясненням причини.',
          },
          {
            labelUk: 'Чого не сталося',
            bodyUk:
              'Вміст звіту не отримано. Код і модель не повинні описувати невідомий файл як прочитаний.',
          },
          {
            labelUk: 'Що перевіряє QA',
            bodyUk:
              'У trace видно спробу читання та її помилку. У стані run і наступній відповіді немає вигаданого вмісту звіту.',
          },
        ],
      },
    ],
    { showNestedCardNumberInPanel: false, pickPanelDetailVariant: 'outcome' },
  ),
  'Результат прив’язаний до правильного run. У наступному запиті моделі помилка залишається помилкою, а не перетворюється на вигаданий звіт.',
  'tool result',
  'Дані або помилка, які повернув фактично викликаний інструмент. Відмова policy не є результатом інструмента.',
);

export const HARNESS_CYCLE_STOP: FundamentalsCardPanel = {
  sections: [
    {
      type: 'plain',
      labelUk: 'Простими словами',
      bodyUk:
        'Harness обмежує роботу правилами продукту. Він може зупинити цикл, коли досягнуто ліміту кроків, вичерпано час або сталася помилка, після якої не можна продовжувати. Повтор запиту можливий лише за окремими правилами й не гарантується.',
    },
    {
      type: 'plain',
      labelUk: 'Що побачить людина',
      bodyUk:
        'UI показує статус і доступні факти. Якщо причина login_spec не встановлена, так і написано. Ліміт кроків або помилку не видають за успішний висновок.',
    },
    {
      type: 'qaCheck',
      bodyUk:
        'Кількість кроків не перевищує встановлену межу. Після зупинки інструмент не викликається. У trace й UI збігається причина завершення.',
    },
  ],
  terms: [
    {
      label: 'max steps',
      text: 'Найбільша дозволена кількість кроків циклу. Це обмеження коду, а не рішення моделі.',
    },
  ],
};
