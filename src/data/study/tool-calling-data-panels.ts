import type { FundamentalsCardPanel } from './fundamentals-card-panels';
import type { StudyLearnerPanelSection } from './study-learner-panel-sections';

const WHAT_REALLY_HAPPENS_LABEL = 'Що відбувається насправді';

const TOOL_RESULT_OUTCOMES_PICK: StudyLearnerPanelSection = {
  type: 'processStepPick',
  labelUk: 'Два можливі результати',
  pickAriaLabel: 'Результат або помилка після виклику інструмента',
  presentation: 'concepts',
  showActorInPanel: false,
  showStepIndexInPanel: false,
  navLayout: 'sidebar',
  interactionHintUk: 'Оберіть варіант, щоб прочитати пояснення.',
  steps: [
    {
      key: 'data',
      titleUk: 'Дані',
      teaserUk: 'Повернуто прочитаний фрагмент',
      actorUk: '',
      detailUk:
        'Інструмент повернув прочитаний фрагмент. Він може бути неповним. Код може передати цей фрагмент моделі для наступної відповіді.',
    },
    {
      key: 'error',
      titleUk: 'Помилка',
      teaserUk: 'Вміст звіту не отримали',
      actorUk: '',
      detailUk:
        'Інструмент не повернув вміст звіту. Код записує помилку. Модель не може описувати непрочитаний файл.',
    },
  ],
};

export const TOOL_CALLING_DATA_SCHEMA: FundamentalsCardPanel = {
  sections: [
    {
      type: 'plain',
      labelUk: 'Простими словами',
      bodyUk:
        'До відповіді моделі код передає їй опис readPlaywrightReport: що робить інструмент і які аргументи потрібні для пропозиції виклику. Це інструкція про форму можливої дії. Вона ще не містить вмісту звіту й не дає дозволу читати будь-який файл.',
    },
    {
      type: 'plain',
      labelUk: WHAT_REALLY_HAPPENS_LABEL,
      bodyUk:
        'Після падіння login_spec harness у запиті до моделі передає опис [[readPlaywrightReport]]: який звіт можна читати і які поля аргументів очікуються.\n\nЦе зробив код, не модель. Модель ще не повернула пропозицію виклику, перевірка шляху не починалася, результат з диску відсутній.',
    },
    {
      type: 'plain',
      labelUk: 'Що перевіряє QA',
      bodyUk:
        'Назва й форма аргументів у запиті моделі відповідають тому, що код справді підтримує. Зайвих інструментів у запиті немає.',
    },
  ],
  terms: [
    { label: 'Tool schema', text: 'Опис інструмента й очікуваної форми його аргументів.' },
    {
      label: 'Tool registry',
      text: 'Перелік інструментів, які знає застосунок. Запис у registry не замінює перевірку дозволу для конкретного виклику.',
    },
  ],
};

export const TOOL_CALLING_DATA_PROPOSAL: FundamentalsCardPanel = {
  sections: [
    {
      type: 'plain',
      labelUk: 'Простими словами',
      bodyUk:
        'Модель може повернути назву readPlaywrightReport та аргументи, які пропонує передати інструменту. Це її відповідь на запит. Код іще має перевірити назву, форму аргументів та доступ до конкретного звіту.',
    },
    {
      type: 'plain',
      labelUk: WHAT_REALLY_HAPPENS_LABEL,
      bodyUk:
        'Код повідомив моделі, що їй доступний інструмент [[readPlaywrightReport]]. Модель відповіла: «Прочитай звіт тесту login_spec».\n\nПоки що це лише [[пропозиція]]. Код має виконати [[перевірку]] шляху і дозволу, викликати інструмент та отримати [[результат]]. Лише після цього можна сказати, що звіт намагалися прочитати.\n\nЯкщо інструмент повернув помилку, звіт не вважається прочитаним.',
    },
    {
      type: 'miniCards',
      labelUk: 'Приклад',
      captionUk: 'Приклад показує принцип роботи. Формат аргументів залежить від застосунку.',
      layout: 'titledStack',
      items: [
        {
          titleUk: 'Запропонована дія',
          tone: 'neutral',
          bodyUk:
            'Модель запропонувала викликати readPlaywrightReport, щоб отримати звіт тесту login_spec.',
        },
        {
          titleUk: 'Що передала модель',
          tone: 'neutral',
          bodyUk:
            'Назву інструмента й аргументи для виклику. Це пропозиція, яку код ще має перевірити.',
        },
        {
          titleUk: 'Що сталося з файлом',
          tone: 'neutral',
          bodyUk:
            'Файл поки не відкривали. Читання можливе лише після перевірки аргументів і дозволу.',
        },
      ],
    },
    {
      type: 'plain',
      labelUk: 'Що перевіряє QA',
      bodyUk:
        'У trace пропозиція має власну подію. Не можна позначати звіт як прочитаний лише тому, що модель назвала інструмент.',
    },
  ],
  terms: [
    { label: 'Tool call', text: 'Структурована пропозиція моделі викликати інструмент.' },
    { label: 'Arguments', text: 'Запропоновані моделлю вхідні дані для інструмента. Їх перевіряє код.' },
  ],
};

export const TOOL_CALLING_DATA_RESULT: FundamentalsCardPanel = {
  sections: [
    {
      type: 'plain',
      labelUk: 'Простими словами',
      bodyUk:
        'Якщо код дозволив дію та викликав інструмент, той повертає фактично прочитані дані або помилку. Це вже не пропозиція моделі, а результат спроби читання.',
    },
    {
      type: 'plain',
      labelUk: WHAT_REALLY_HAPPENS_LABEL,
      bodyUk:
        'Після перевірки policy harness викликав [[readPlaywrightReport]] для login_spec. Handler повернув фрагмент звіту або помилку читання — це вже результат виконання, а не пропозиція моделі.\n\nЯкщо раніше було deny, спроби читання не було, і звіт не вважається прочитаним.',
    },
    TOOL_RESULT_OUTCOMES_PICK,
    {
      type: 'plain',
      labelUk: 'Що перевіряє QA',
      bodyUk:
        'Результат відповідає фактичному виконанню. У наступному запиті моделі немає даних, яких інструмент не повертав.',
    },
  ],
  terms: [{ label: 'Tool result', text: 'Дані або помилка фактично викликаного інструмента.' }],
};
