import type { FundamentalsCardPanel } from './fundamentals-card-panels';
import type { StudyLearnerPanelSection } from './study-learner-panel-sections';

const qaCategoryPanel = (
  prepareUk: string,
  qaDoesUk: string | StudyLearnerPanelSection,
  expectUk: string,
  provesUk: string,
): FundamentalsCardPanel => ({
  sections: [
    { type: 'plain', labelUk: 'Що підготувати', bodyUk: prepareUk },
    ...(typeof qaDoesUk === 'string'
      ? [{ type: 'plain' as const, labelUk: 'Що робить QA', bodyUk: qaDoesUk }]
      : [qaDoesUk]),
    { type: 'plain', labelUk: 'Очікуваний результат', bodyUk: expectUk },
    { type: 'plain', labelUk: 'Що доводить перевірка', bodyUk: provesUk },
  ],
});

const QA_SCHEMA_ACTIONS_PICK: StudyLearnerPanelSection = {
  type: 'processStepPick',
  labelUk: 'Що робить QA',
  pickAriaLabel: 'Неправильна пропозиція для перевірки форми',
  presentation: 'concepts',
  showActorInPanel: false,
  showStepIndexInPanel: false,
  navLayout: 'sidebar',
  steps: [
    {
      key: 'no-path',
      titleUk: 'Не вказали файл',
      teaserUk: 'Пропозиція без обов’язкового поля',
      actorUk: '',
      detailUk:
        'Передають пропозицію без вказаного файлу. Після запуску перевіряють, чи викликали функцію читання файла.',
    },
    {
      key: 'wrong-type',
      titleUk: 'Неправильний тип',
      teaserUk: 'Замість назви файла — число',
      actorUk: '',
      detailUk:
        'Передають пропозицію, де замість текстового шляху передано число. Після запуску перевіряють, чи викликали функцію читання файла.',
    },
    {
      key: 'extra-field',
      titleUk: 'Заборонене поле',
      teaserUk: 'Поле, якого немає в схемі',
      actorUk: '',
      detailUk:
        'Передають пропозицію з полем, яке схема забороняє. Після запуску перевіряють, чи викликали функцію читання файла. Використовуйте лише поля, які схема справді не дозволяє.',
    },
  ],
};

export const TOOL_CALLING_QA_CAT_SCHEMA: FundamentalsCardPanel = qaCategoryPanel(
  'Є інструмент читання звіту. Для тесту потрібні три окремі неправильні пропозиції: не вказали файл, замість назви файла передали число, додали поле, яке схема справді забороняє. Назви полів звір із контрактом у проєкті.',
  QA_SCHEMA_ACTIONS_PICK,
  'Код пояснює, що саме неправильно в аргументах. Файл жодного разу не читають. Якщо схема дозволяє додаткові поля, не використовуй їх як приклад помилки.',
  'Некоректна форма зупиняється до виконання інструмента. Вона ще нічого не каже про права доступу для правильних аргументів.',
);

const QA_PATH_ACTIONS_PICK: StudyLearnerPanelSection = {
  type: 'processStepPick',
  labelUk: 'Що робить QA',
  pickAriaLabel: 'Шлях до файла в тесті',
  presentation: 'concepts',
  showActorInPanel: false,
  showStepIndexInPanel: false,
  navLayout: 'sidebar',
  steps: [
    {
      key: 'allowed',
      titleUk: 'Дозволений звіт',
      teaserUk: 'Файл у тестовій теці',
      actorUk: '',
      detailUk: 'Передають шлях до дозволеного звіту і перевіряють, що вміст відповідає фікстурі.',
    },
    {
      key: 'outside',
      titleUk: 'Шлях за межами теки',
      teaserUk: 'Файл поза дозволеною областю',
      actorUk: '',
      detailUk:
        'Окремо передають шлях із виходом за межі теки. Перевіряють, що зовнішній файл не відкрили.',
    },
    {
      key: 'symlink',
      titleUk: 'Symlink за потреби',
      teaserUk: 'Лише якщо середовище підтримує',
      actorUk: '',
      detailUk:
        'Якщо тестує symlink, спочатку перевіряють, що його підтримує тестове середовище, потім запускають сценарій.',
    },
  ],
};

export const TOOL_CALLING_QA_CAT_SANDBOX: FundamentalsCardPanel = qaCategoryPanel(
  'У тестовій теці є дозволений файл звіту та окремий файл поза цією текою. У них різний текст, щоб одразу помітити помилкове читання.',
  QA_PATH_ACTIONS_PICK,
  'Дозволений файл можна прочитати. Зовнішній файл не відкривають, і його текст не з’являється ані в результаті інструмента, ані в наступному запиті моделі.',
  'Код перевіряє фактичне розташування файла, а не лише те, що написаний шлях починається зі слів playwright-report.',
);

export const TOOL_CALLING_QA_CAT_PERMISSION: FundamentalsCardPanel = qaCategoryPanel(
  'Застосунок знає інструмент createJiraIssue, але тестовому користувачу дозволено лише читати звіти. Створення задачі для нього заборонене.',
  'Підставляє коректну пропозицію створити задачу. Стежить за рішенням policy й викликом клієнта Jira.',
  'Policy повертає відмову. Запит на створення задачі в Jira не надсилають. Причину видно в trace.',
  'Наявність інструмента у списку не дає кожному користувачу права його запускати.',
);

export const TOOL_CALLING_QA_CAT_DUPLICATE: FundamentalsCardPanel = qaCategoryPanel(
  'Тестова Jira створює одну задачу, але відповідь про її створення для застосунку губиться. Застосунок не знає, чи перша спроба завершилася.',
  'Повторює ту саму операцію так, як це зробив би продукт після втраченої відповіді. Перевіряє кількість створених задач і те, який ідентифікатор отримав застосунок.',
  'Якщо продукт має захист від повтору, у Jira залишається одна задача. Застосунок отримує її ідентифікатор або статус, який дозволяє знайти створений запис. Кількість HTTP-запитів може бути більшою за один — не вимагай рівно один POST без перевірки конкретного механізму захисту.',
  'Повтор після timeout не створює дубль. Підтвердження людини саме по собі цього не гарантує.',
);

export const TOOL_CALLING_QA_CAT_TRUNCATION: FundamentalsCardPanel = qaCategoryPanel(
  'Великий тестовий звіт, у якому потрібне повідомлення про збій стоїть ближче до кінця.',
  'Запускає читання й переглядає саме той фрагмент, який код підготував для моделі. Порівнює його з повним тестовим звітом.',
  'Наступний запит не перевищує встановлений бюджет. Якщо фрагмент скорочено, це явно позначено. Важливий доказ збережено або система повідомляє, що даних недостатньо. Код не називає скорочений текст повним звітом.',
  'Обмеження розміру не приховує нестачу доказів.',
);

const QA_TRACE_ACTIONS_PICK: StudyLearnerPanelSection = {
  type: 'processStepPick',
  labelUk: 'Що робить QA',
  pickAriaLabel: 'Дозволений і заборонений виклик',
  presentation: 'concepts',
  showActorInPanel: false,
  showStepIndexInPanel: false,
  navLayout: 'sidebar',
  steps: [
    {
      key: 'allow',
      titleUk: 'Дозволене читання',
      teaserUk: 'Один успішний виклик',
      actorUk: '',
      detailUk:
        'Відкривають записи розслідування. Порівнюють пропозицію моделі, рішення коду, факт запуску інструмента та результат.',
    },
    {
      key: 'deny',
      titleUk: 'Відмова policy',
      teaserUk: 'Виклик, який код відхилив',
      actorUk: '',
      detailUk:
        'Відкривають записи розслідування. Перевіряють причину відмови та відсутність події читання файла.',
    },
  ],
};

export const TOOL_CALLING_QA_CAT_TRACE: FundamentalsCardPanel = qaCategoryPanel(
  'Один дозволений виклик читання й один виклик, який policy відхиляє.',
  QA_TRACE_ACTIONS_PICK,
  'За дозволу видно фактичне виконання й результат або помилку. Після відмови видно причину відмови, але немає події читання файла. Чутливий вміст не потрапляє в логи без потреби.',
  'За trace можна відрізнити те, що модель запропонувала, від того, що код справді виконав.',
);

const gwtPanel = (
  wasUk: string,
  actionUk: string,
  expectUk: string,
  proofUk: string,
): FundamentalsCardPanel => ({
  sections: [
    { type: 'plain', labelUk: 'Було', bodyUk: wasUk },
    { type: 'plain', labelUk: 'Дія', bodyUk: actionUk },
    { type: 'plain', labelUk: 'Очікування', bodyUk: expectUk },
    { type: 'plain', labelUk: 'Доказ для QA', bodyUk: proofUk },
  ],
});

export const TOOL_CALLING_QA_GWT_BAD_PATH: FundamentalsCardPanel = gwtPanel(
  'Тест створив дозволений звіт та окремий файл поза дозволеною текою.',
  'Код отримав пропозицію readPlaywrightReport із шляхом до зовнішнього файла.',
  'Код відмовив до читання. Вміст зовнішнього файла не потрапив до відповіді чи наступного запиту моделі.',
  'У trace причина відмови, викликів функції читання зовнішнього файла немає.',
);

export const TOOL_CALLING_QA_GWT_JIRA: FundamentalsCardPanel = gwtPanel(
  'Тестова Jira створила задачу, але відповідь до застосунку не дійшла.',
  'Застосунок повторив операцію за своїми правилами.',
  'За наявності заявленого продуктом захисту від повтору в Jira одна задача, а застосунок отримав або відновив її ідентифікатор.',
  'Кількість створених задач дорівнює одному. Не ототожнюй це з кількістю HTTP-запитів.',
);
