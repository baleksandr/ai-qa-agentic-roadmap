import type { RagFailureMeta } from './rag-failure-modes';

export type ToolCallingFailureSection = {
  headingUk: string;
  bodyUk: string;
};

export type ToolCallingFailureDetail = {
  id: string;
  titleUk: string;
  subtitleUk: string;
  meta: RagFailureMeta;
  /** Короткий рядок на лівій картці — не дублює панель */
  navTeaserUk: string;
  sections: ToolCallingFailureSection[];
};

/** Навчальні сценарії (умовно) — деталі §5 «Де може зламатися?» */
export const TOOL_CALLING_FAILURE_DETAILS: ToolCallingFailureDetail[] = [
  {
    id: 'tc-fail-hallucinated-tool',
    titleUk: 'Hallucinated tool name',
    subtitleUk: 'невідомий інструмент',
    meta: { index: 1, categoryUk: 'Schema', categoryClass: 'cat-grounding', severity: 'warning' },
    navTeaserUk: 'Назви немає в allow-list → помилка до I/O',
    sections: [
      {
        headingUk: 'Що сталося?',
        bodyUk:
          'Після падіння тесту модель запропонувала викликати readPlaywrightLogs, але такого інструмента немає серед доступних агенту. Можливо, модель придумала назву або список інструментів змінився.',
      },
      {
        headingUk: 'Де зупиняється процес?',
        bodyUk:
          'Harness звіряє назву з дозволеним списком до виконання будь-якого коду. Якщо збігу немає, він не шукає «майже схожу» функцію і не читає файли.',
      },
      {
        headingUk: 'Що бачимо?',
        bodyUk:
          'У trace є запропонований виклик і помилка unknown_tool; результату читання логів немає.',
      },
      {
        headingUk: 'Що робити?',
        bodyUk:
          'Повернути моделі контрольоване повідомлення про недоступний інструмент або завершити запуск — залежно від правил агента.',
      },
      {
        headingUk: 'Як перевіряє QA?',
        bodyUk:
          'Підставити невідому назву tool і перевірити, що жоден handler не викликався та агент не замінив її довільною іншою дією.',
      },
    ],
  },
  {
    id: 'tc-fail-invalid-args',
    titleUk: 'Invalid arguments',
    subtitleUk: 'неправильні аргументи',
    meta: { index: 2, categoryUk: 'Validation', categoryClass: 'cat-retrieval', severity: 'warning' },
    navTeaserUk: 'JSON / path → validation або path_denied',
    sections: [
      {
        headingUk: 'Що сталося?',
        bodyUk:
          'Модель вибрала наявний readPlaywrightReport, але передала неправильні дані: відсутній path, невірний тип поля або шлях виходить за дозволений каталог.',
      },
      {
        headingUk: 'Де зупиняється процес?',
        bodyUk:
          'Спочатку код перевіряє форму аргументів, потім — чи дозволено читати саме цей файл. Правильний JSON сам по собі ще не означає безпечний шлях.',
      },
      {
        headingUk: 'Що бачимо?',
        bodyUk: 'validation_error або path_denied; файл не відкривався.',
      },
      {
        headingUk: 'Що робити?',
        bodyUk:
          'Повернути конкретну безпечну помилку. Не виконувати запит із «виправленим навмання» шляхом.',
      },
      {
        headingUk: 'Як перевіряє QA?',
        bodyUk:
          'Спробувати пропущене поле, неправильний тип, ../ і символічне посилання, яке веде за межі дозволеного каталогу.',
      },
    ],
  },
  {
    id: 'tc-fail-wrong-tool',
    titleUk: 'Wrong tool chosen',
    subtitleUk: 'обрано не той інструмент',
    meta: { index: 3, categoryUk: 'Вибір', categoryClass: 'cat-grounding', severity: 'info' },
    navTeaserUk: 'Дозволений tool, але не для задачі',
    sections: [
      {
        headingUk: 'Що сталося?',
        bodyUk:
          'Агенту потрібен текст помилки зі звіту, але модель пропонує читати trace. Обидва інструменти можуть бути дозволені, проте обрана дія не наближає до відповіді.',
      },
      {
        headingUk: 'Чим це відрізняється від попередніх збоїв?',
        bodyUk:
          'Назва інструмента й аргументи можуть бути правильними. Проблема — у рішенні, що робити далі.',
      },
      {
        headingUk: 'Що бачимо?',
        bodyUk:
          'Зайвий виклик, додаткові витрати й затримку; агент може отримати дані, яких недостатньо для висновку.',
      },
      {
        headingUk: 'Що робити?',
        bodyUk:
          'Дати агенту зрозумілі описи інструментів і можливість переоцінити результат. Обмежити кількість безрезультатних кроків.',
      },
      {
        headingUk: 'Як перевіряє QA?',
        bodyUk:
          'На наборі сценаріїв оцінювати, чи агент обирає доречну дію і чи завершує задачу. Не робити один точний «перший tool» обов’язковим, якщо кілька шляхів однаково правильні.',
      },
    ],
  },
  {
    id: 'tc-fail-duplicate-write',
    titleUk: 'Duplicate side effect',
    subtitleUk: 'повторна дія із записом',
    meta: { index: 4, categoryUk: 'Idempotency', categoryClass: 'cat-policy', severity: 'danger' },
    navTeaserUk: 'createJiraIssue після timeout → другий тікет',
    sections: [
      {
        headingUk: 'Що сталося?',
        bodyUk:
          'createJiraIssue створив тікет, але відповідь Jira загубилася через timeout. Агент повторює виклик і може створити другий тікет про те саме падіння.',
      },
      {
        headingUk: 'Чому це небезпечно?',
        bodyUk:
          'На відміну від читання звіту, створення issue змінює зовнішню систему. Повтор після помилки не обов’язково означає, що перша спроба не виконалася.',
      },
      {
        headingUk: 'Що робити?',
        bodyUk:
          'Використати сталий ідентифікатор операції (idempotency key) або перевірку дубля, яка працює і після повторного запуску процесу. Підтвердження людини вирішує питання дозволу, але саме по собі не запобігає дублюванню.',
      },
      {
        headingUk: 'Як перевіряє QA?',
        bodyUk:
          'Імітувати успішне створення issue з втраченою відповіддю, потім повторити виклик. Очікування — один тікет, а агент повертає його ідентифікатор.',
      },
    ],
  },
  {
    id: 'tc-fail-huge-result',
    titleUk: 'Huge tool result',
    subtitleUk: 'завеликий результат',
    meta: { index: 5, categoryUk: 'Context', categoryClass: 'cat-ops', severity: 'warning' },
    navTeaserUk: 'Повний HTML → ліміт контексту',
    sections: [
      {
        headingUk: 'Що сталося?',
        bodyUk:
          'Інструмент прочитав повний Playwright HTML report і повернув його в контекст моделі. Там є багато розмітки й несуттєвих деталей.',
      },
      {
        headingUk: 'Що може піти не так?',
        bodyUk:
          'Контекст перевищить ліміт або стане дорогим і повільним. Якщо просто обрізати початок чи кінець, можна втратити саме повідомлення про помилку.',
      },
      {
        headingUk: 'Що робити?',
        bodyUk:
          'Зберегти повний артефакт окремо, а моделі передати структурований витяг: тест, помилка, важливі кроки, посилання на повний звіт. Позначити, що результат скорочений.',
      },
      {
        headingUk: 'Як перевіряє QA?',
        bodyUk:
          'На великому звіті перевірити ліміт розміру та збереження ключового доказу, особливо якщо помилка знаходиться наприкінці файлу.',
      },
    ],
  },
  {
    id: 'tc-fail-timeout',
    titleUk: 'Tool timeout / unavailable',
    subtitleUk: 'інструмент не відповів',
    meta: { index: 6, categoryUk: 'Операції', categoryClass: 'cat-ops', severity: 'info' },
    navTeaserUk: '503 / timeout у trace, без вигаданих логів',
    sections: [
      {
        headingUk: 'Що сталося?',
        bodyUk:
          'Агент запросив логи, але API повернув 503 або інструмент не завершився за відведений час.',
      },
      {
        headingUk: 'Що бачимо?',
        bodyUk:
          'У trace є виклик, тривалість і контрольована помилка. Агент не повинен зависнути назавжди чи сказати, що прочитав логи.',
      },
      {
        headingUk: 'Що робити?',
        bodyUk:
          'Обмежити час очікування. Для безпечного читання можливий повтор із паузою; для дії із записом повтор потребує захисту від дублювання. Якщо даних так і немає, агент чесно повідомляє, який доказ недоступний.',
      },
      {
        headingUk: 'Як перевіряє QA?',
        bodyUk:
          'Імітувати 503 і timeout, перевірити ліміт повторів, завершення run і відсутність вигаданого висновку на основі непрочитаних логів.',
      },
    ],
  },
  {
    id: 'tc-fail-permission',
    titleUk: 'Permission denied',
    subtitleUk: 'дія заборонена',
    meta: { index: 7, categoryUk: 'Policy', categoryClass: 'cat-security', severity: 'danger' },
    navTeaserUk: 'deny у trace · без side effect',
    sections: [
      {
        headingUk: 'Що сталося?',
        bodyUk:
          'Модель запропонувала прочитати файл поза дозволеною областю або створити Jira issue в проєкті, де агент не має права запису.',
      },
      {
        headingUk: 'Хто ухвалює рішення?',
        bodyUk:
          'Код перевіряє виконавця, інструмент, ціль дії та політику. Бажання моделі виконати дію не є дозволом.',
      },
      {
        headingUk: 'Що бачимо?',
        bodyUk:
          'У trace — deny і правило, яке спрацювало. Виклику зовнішнього API або читання забороненого файлу немає.',
      },
      {
        headingUk: 'Що робити?',
        bodyUk:
          'Зупинити цю дію й дати агенту безпечний результат «доступ заборонено». Не повторювати той самий запит, обходячи правило.',
      },
      {
        headingUk: 'Як перевіряє QA?',
        bodyUk:
          'Запустити сценарій з обмеженими правами й переконатися, що заборонена дія не мала побічного ефекту, а причина відмови записана без витоку секретів.',
      },
    ],
  },
];

export function getToolCallingFailureById(id: string): ToolCallingFailureDetail | undefined {
  return TOOL_CALLING_FAILURE_DETAILS.find((f) => f.id === id);
}
