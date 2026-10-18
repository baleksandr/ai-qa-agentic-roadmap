import type { FundamentalsCardPanel } from './fundamentals-card-panels';
import type { StudyPanelTermEntry } from './fundamentals-card-panels';

const flowStepPanel = (
  whoUk: string,
  inputUk: string,
  doesUk: string,
  nextUk: string,
  qaUk: string,
): FundamentalsCardPanel => ({
  sections: [
    { type: 'plain', labelUk: 'Хто діє', bodyUk: whoUk },
    { type: 'plain', labelUk: 'Що має на вході', bodyUk: inputUk },
    { type: 'plain', labelUk: 'Що робить', bodyUk: doesUk },
    { type: 'plain', labelUk: 'Що передає далі', bodyUk: nextUk },
    { type: 'plain', labelUk: 'Що перевіряє QA', bodyUk: qaUk },
  ],
});

const riskPanel = (bodyUk: string, qaUk: string, terms: StudyPanelTermEntry[]): FundamentalsCardPanel => ({
  sections: [
    { type: 'plain', labelUk: 'Пояснення', bodyUk },
    { type: 'plain', labelUk: 'Що перевіряє QA', bodyUk: qaUk },
  ],
  terms,
});

const rolePanel = (bodyUk: string): FundamentalsCardPanel => ({
  sections: [{ type: 'plain', labelUk: 'У цьому прикладі', bodyUk }],
});

export const TOOL_CALLING_LLM_CODE_STEP_1: FundamentalsCardPanel = {
  sections: [
    {
      type: 'definitionAccent',
      labelUk: 'Хто виконує цей крок',
      termUk: 'Код застосунку',
      termEn: 'agent harness',
      leadUk:
        'Після повідомлення CI про падіння login_spec цей код збирає відомі факти й готує запит до моделі. Він додає опис доступного інструмента readPlaywrightReport, щоб модель могла запропонувати його виклик. На цьому кроці код ще не читає звіт.',
    },
    {
      type: 'plain',
      labelUk: 'Що має на вході',
      bodyUk:
        'Повідомлення CI: login_spec не знайшов #login-btn. Звіт Playwright ще не прочитано.',
    },
    {
      type: 'plain',
      labelUk: 'Що робить',
      bodyUk:
        'Задає правила та ліміти run і формує перший запит до model API з відомим фактом про збій.',
    },
    {
      type: 'plain',
      labelUk: 'Що передає далі',
      bodyUk: 'Запит до model API з відомим фактом про збій і описом інструмента.',
    },
    {
      type: 'plain',
      labelUk: 'Що перевіряє QA',
      bodyUk: 'У запиті немає тексту звіту, який ще не читали.',
    },
  ],
};

export const TOOL_CALLING_LLM_CODE_STEP_2: FundamentalsCardPanel = flowStepPanel(
  'Мовна модель.',
  'Підготовлений кодом запит. Модель знає про timeout, але не знає вмісту звіту.',
  'Може повернути пропозицію readPlaywrightReport із аргументами. Це прохання до застосунку виконати дію, а не читання файла.',
  'Пропозицію інструмента для перевірки кодом.',
  'У trace пропозиція відокремлена від виконання. Модель не пише, ніби вже бачила звіт.',
);

export const TOOL_CALLING_LLM_CODE_STEP_3: FundamentalsCardPanel = flowStepPanel(
  'Код застосунку.',
  'Назву запропонованого інструмента, аргументи та правила доступу до артефакта.',
  'Окремо перевіряє, чи інструмент відомий, чи аргументи мають правильну форму й чи можна читати саме цей звіт. Запропонований моделлю шлях не вважають безпечним без перевірки.',
  'Якщо дозволено — перевірений запит до інструмента. Якщо відмовлено — причину відмови, без читання файла.',
  'Після deny інструмент не запускається. Відмову видно в trace.',
);

export const TOOL_CALLING_LLM_CODE_STEP_4: FundamentalsCardPanel = flowStepPanel(
  'Код інструмента — handler.',
  'Перевірений запит на читання дозволеного артефакта.',
  'Намагається відкрити файл звіту. Це перший крок, на якому програма справді звертається до файла. Якщо файл недоступний, повертає помилку.',
  'Фактично прочитаний фрагмент АБО помилку читання.',
  'Звернення було до правильного артефакта. Помилка не перетворилася на вигаданий вміст. Не обіцяй, що результат завжди HTML чи повний DOM.',
);

export const TOOL_CALLING_LLM_CODE_STEP_5: FundamentalsCardPanel = {
  sections: [
    { type: 'plain', labelUk: 'Хто діє', bodyUk: 'Harness.' },
    {
      type: 'plain',
      labelUk: 'Що має на вході',
      bodyUk: 'Дані або помилку, які повернув інструмент.',
    },
    {
      type: 'plain',
      labelUk: 'Що робить',
      bodyUk:
        'Зберігає фактичний результат. Якщо потрібен ще один виклик моделі, додає до запиту саме отриману інформацію. Якщо великий фрагмент скорочено, позначає його як неповний.',
    },
    {
      type: 'miniCards',
      labelUk: 'Що передає далі',
      layout: 'titledStack',
      items: [
        {
          titleUk: 'Розслідування продовжується',
          tone: 'allow',
          bodyUk:
            'Новий запит до моделі з фактично отриманим фрагментом звіту або з повідомленням про помилку читання, без вигаданого вмісту файла.',
        },
        {
          titleUk: 'Розслідування завершується',
          tone: 'end',
          bodyUk:
            'Код більше не викликає модель. Він передає людині статус run і лише ті факти, які вдалося отримати на цьому шляху.',
        },
      ],
    },
    {
      type: 'plain',
      labelUk: 'Що перевіряє QA',
      bodyUk: 'У наступному запиті немає даних, яких інструмент не повертав.',
    },
  ],
};

export const TOOL_CALLING_LLM_CODE_STEP_6: FundamentalsCardPanel = flowStepPanel(
  'Мовна модель, якщо код викликав її знову.',
  'Лише результат або помилку, які код справді передав.',
  'За отриманим фрагментом може уточнити гіпотезу. За помилки не може описувати вміст непрочитаного звіту. Навіть успішне читання фрагмента саме по собі не доводить причину timeout.',
  'Текст для перевірки кодом і QA. Причина збою може залишитися невідомою.',
  'Конкретні твердження відповідають отриманим даним, а непідтверджені висновки позначені як гіпотези.',
);

export const TOOL_CALLING_LLM_RISK_PATH: FundamentalsCardPanel = riskPanel(
  'Умовно модель просить прочитати шлях, який виходить за теку звітів. Навіть якщо назва інструмента правильна, код повинен перевірити кінцевий шлях до читання. За відмови файл не відкривають.',
  'У trace причина deny. Викликів handler немає.',
  [{ label: 'Sandbox', text: 'Обмежена область файлів, доступних конкретному інструменту.' }],
);

export const TOOL_CALLING_LLM_RISK_JIRA: FundamentalsCardPanel = riskPanel(
  'Умовно застосунок створив задачу в Jira, але не отримав відповідь через мережеву помилку. Якщо просто повторити запит, може з’явитися друга така сама задача. Код повинен мати правило проти дубля. Окремо policy може вимагати підтвердження людини перед створенням задачі. Підтвердження не визначає, чи задача вже створена.',
  'На повторі не створено другий issue. Якщо потрібне підтвердження, запис створюють лише після нього.',
  [
    {
      label: 'Idempotency key',
      text: 'Ідентифікатор операції, який допомагає розпізнати її повтор.',
    },
  ],
);

export const TOOL_CALLING_LLM_ROLE_MODEL: FundamentalsCardPanel = rolePanel(
  'Може запропонувати інструмент і пояснити гіпотезу. Не відкриває файл сама й не ухвалює рішення про доступ.',
);

export const TOOL_CALLING_LLM_ROLE_CODE: FundamentalsCardPanel = rolePanel(
  'Готує запит, перевіряє аргументи й дозвіл, викликає інструмент, записує результат та зупиняє цикл за правилами.',
);

export const TOOL_CALLING_LLM_ROLE_HUMAN: FundamentalsCardPanel = rolePanel(
  'Може перевірити висновок. Підтверджує конкретну ризикову дію до виконання лише тоді, коли цього вимагає policy продукту.',
);
