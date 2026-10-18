import type { FundamentalsCardPanel } from './fundamentals-card-panels';
import type {
  StudyLearnerPanelProcessStepPickSection,
  StudyLearnerPanelSection,
} from './study-learner-panel-sections';

const FAILURE_NESTED_HINT_UK =
  'Оберіть випадок, щоб прочитати пояснення. На телефоні воно з’явиться під картками.';

const failureNestedPick = (
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
  navLayout: 'rowAbovePanel',
  interactionHintUk: FAILURE_NESTED_HINT_UK,
  steps,
});

export const HARNESS_FAILURE_LOOP: FundamentalsCardPanel = {
  sections: [
    {
      type: 'plain',
      labelUk: 'Ситуація',
      bodyUk:
        'Модель повторно пропонує readPlaywrightReport для того самого артефакта без нового запитання чи нового факту.',
    },
    {
      type: 'plain',
      labelUk: 'Що відбувається',
      bodyUk:
        'Кожне повторення витрачає час і може збільшувати кількість викликів моделі та інструмента. Сам факт повтору не означає, що причина login_spec стала зрозумілішою.',
    },
    {
      type: 'plain',
      labelUk: 'Реакція коду',
      bodyUk:
        'Harness перевіряє ліміт кроків перед наступною дією. Досягнувши max steps, завершує run з відповідним статусом. Виявлення однакових повторних викликів за аргументами можливе як додаткове правило продукту, але не є обов’язковою властивістю кожного harness.',
    },
    {
      type: 'plain',
      labelUk: 'Що перевіряє QA',
      bodyUk:
        'На mock-відповідях, що постійно пропонують той самий read, run зупиняється не пізніше встановленої межі. Після зупинки нових викликів handler немає. UI показує ліміт, а не вигаданий успішний висновок.',
    },
  ],
  terms: [
    {
      label: 'max steps',
      text: 'Встановлена кодом верхня межа кроків розслідування.',
    },
  ],
};

export const HARNESS_FAILURE_INVALID_ARGS: FundamentalsCardPanel = {
  sections: [
    failureNestedPick('Два різні випадки некоректних аргументів', 'Зламаний формат або недозволений шлях', [
      {
        key: 'bad-format',
        titleUk: 'Зламаний формат',
        teaserUk: 'Код не може прочитати аргументи пропозиції',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Ситуація',
            bodyUk:
              'Модель запропонувала readPlaywrightReport, але аргументи передано в неправильному форматі або бракує обов’язкового поля. Код не отримав коректного набору значень для виклику інструмента.',
          },
          {
            labelUk: 'Де зупиняється',
            bodyUk: 'Під час розбору або перевірки форми аргументів, до перевірки доступу й до executor.',
          },
          {
            labelUk: 'Що перевіряє QA',
            bodyUk: 'У trace вказана помилка формату чи схеми. Handler не викликано.',
          },
        ],
        terms: [
          {
            label: 'schema validation',
            text: 'Перевірка обов’язкових полів, типів і дозволених значень.',
          },
        ],
      },
      {
        key: 'bad-path',
        titleUk: 'Недозволений шлях',
        teaserUk: 'Форма аргументів правильна, але читати цей файл не можна',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Ситуація',
            bodyUk:
              'Модель передала коректно оформлений шлях, але він веде поза дозволену область або до артефакта іншого run. Правильний формат не дає права читати файл.',
          },
          {
            labelUk: 'Де зупиняється',
            bodyUk: 'Під час перевірки шляху й доступу, до executor.',
          },
          {
            labelUk: 'Що перевіряє QA',
            bodyUk: 'Зафіксовано причину відмови. Не було виклику handler і читання файлу.',
          },
        ],
        terms: [
          {
            label: 'перевірка доступу',
            text: 'Рішення коду, чи дозволено цю дію для конкретного артефакта й run.',
          },
        ],
      },
    ]),
  ],
};

export const HARNESS_FAILURE_FORBIDDEN: FundamentalsCardPanel = {
  sections: [
    failureNestedPick('Два різні випадки заборони', 'Невідомий інструмент або відмова policy', [
      {
        key: 'unknown-tool',
        titleUk: 'Невідомий інструмент',
        teaserUk: 'Такої дії немає в переліку інструментів застосунку',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Ситуація',
            bodyUk:
              'Модель назвала інструмент, якого код застосунку не зареєстрував. Текст моделі не може створити новий інструмент або запустити довільну функцію.',
          },
          {
            labelUk: 'Де зупиняється',
            bodyUk: 'Під час перевірки назви за registry, ще до оцінки дозволу на конкретний файл.',
          },
          {
            labelUk: 'Що перевіряє QA',
            bodyUk: 'Невідома назва відхилена. Executor не запускався.',
          },
        ],
        terms: [
          {
            label: 'tool registry',
            text: 'Перелік інструментів, відомих застосунку, та опис їхніх аргументів.',
          },
        ],
      },
      {
        key: 'no-access',
        titleUk: 'Немає доступу',
        teaserUk: 'Інструмент відомий, але цей артефакт читати заборонено',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Ситуація',
            bodyUk:
              'readPlaywrightReport є в registry, а аргументи мають правильну форму. Проте запит стосується артефакта іншого run. Policy відхиляє конкретний виклик.',
          },
          {
            labelUk: 'Де зупиняється',
            bodyUk: 'Після перевірки назви й аргументів, перед executor.',
          },
          {
            labelUk: 'Що перевіряє QA',
            bodyUk: 'У trace видно policy deny для конкретного run. Немає події читання файлу.',
          },
        ],
        terms: [
          { label: 'policy deny', text: 'Рішення коду заборонити конкретну дію.' },
        ],
      },
    ]),
  ],
};

export const HARNESS_FAILURE_LARGE_RESULT: FundamentalsCardPanel = {
  sections: [
    {
      type: 'plain',
      labelUk: 'Ситуація',
      bodyUk:
        'Інструмент повернув великий звіт. Якщо додати його повністю до наступних messages, запит може перевищити допустимий розмір або встановлений бюджет.',
    },
    {
      type: 'plain',
      labelUk: 'Реакція коду',
      bodyUk:
        'Код застосовує правило продукту: вибирає потрібний фрагмент, явно скорочує результат або зупиняє крок із помилкою. Якщо частину звіту відкинули, у trace видно факт скорочення. Не подавай скорочений фрагмент як повний звіт.',
    },
    {
      type: 'plain',
      labelUk: 'Що перевіряє QA',
      bodyUk:
        'У наступному запиті видно, який фрагмент передано і чи результат було скорочено. Висновок моделі не стверджує факти з тієї частини звіту, яку їй не передали. Якщо даних недостатньо, UI повідомляє про це.',
    },
  ],
  terms: [
    {
      label: 'ліміт контексту',
      text: 'Межа обсягу інформації, яку можна передати моделі в одному виклику.',
    },
  ],
};
