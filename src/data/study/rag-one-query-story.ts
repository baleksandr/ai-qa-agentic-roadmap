/** Одна навчальна історія run — джерело текстів UI (узгоджено з 03-rag.md). */
export const RAG_ONE_QUERY_STORY_INTRO =
  'Тест упав. Код шукає схожі минулі інциденти. Із знайденого залишає тільки те, що дозволено показати цьому запуску та корисно для питання. Вибрані уривки передає моделі. Модель пропонує можливу причину. QA перевіряє її на поточних доказах.';

export type RagStoryStep = {
  titleUk: string;
  teaserUk: string;
  whatUk: string;
  whoUk: string;
  nextUk: string;
  techMarkdownUk: string;
};

export const RAG_ONE_QUERY_STORY_STEPS: RagStoryStep[] = [
  {
    titleUk: 'Тест упав',
    teaserUk: 'Playwright повідомив про падіння; harness отримав trace.',
    whatUk:
      'На staging впав автотест `login_spec` (умовно): таймаут на `#login-btn`. У CI є повідомлення Playwright і шлях до trace (наприклад `ci-8842`).',
    whoUk: 'CI та harness (код).',
    nextUk: 'Harness передає симптом у пошук — крок 2.',
    techMarkdownUk:
      'Signal CI: статус, excerpt логу, `trace id`. LLM ще не викликалась. Offline-індекс `index-v12` уже існує — див. розділ «Як підготувати документи».',
  },
  {
    titleUk: 'Знайшли схожі документи',
    teaserUk: 'Код сформував запит до пошуку за симптомом.',
    whatUk:
      'Harness (без LLM) відправив у пошук текст про симптом і обмеження середовища — tenant, staging, сервіс auth. Пошук повернув кандидатів серед минулих інцидентів.',
    whoUk: 'Harness і search service (код).',
    nextUk: 'Список кандидатів і дозволених результатів — крок 3.',
    techMarkdownUk:
      '**Query (умовно):** `login timeout staging #login-btn similar incidents`\n\n**Фільтри в прикладі:** `tenant=acme`, `env=staging`, `service=auth`.\n\n**Примітка:** пошук можна додатково обмежити «останніми 90 днями», якщо реалізація підтримує фільтр за **датою інциденту** в metadata — у цьому навчальному UI це не показано як уже застосований фільтр.',
  },
  {
    titleUk: 'Відібрали те, що можна показати',
    teaserUk: 'Три стани одного набору: знайдено → дозволено → передано LLM.',
    whatUk:
      'Це **один** набір даних у трьох станах, не три окремі процеси. INC-442 і INC-318 — дозволені результати пошуку. У **цьому** прикладі до моделі передали лише INC-442; INC-318 залишився поза prompt як менш доречний.',
    whoUk: 'Код (фільтри доступу, відбір, опційно rerank).',
    nextUk: 'У prompt потрапляє лише вибраний уривок — крок 4.',
    techMarkdownUk:
      '**Candidates** — сирі збіги similarity.\n\n**Authorized hits** — після tenant/ACL і metadata.\n\n**Selected evidence** — те, що реально в `messages[]`. У прикладі: лише `chk-442-a` / INC-442.\n\nRetrieval/rerank **scores** — для інженерів у trace; не «ймовірність правди».',
  },
  {
    titleUk: 'Передали вибране моделі',
    teaserUk: 'LLM бачить лише опис падіння й один уривок INC-442.',
    whatUk:
      'Context builder зібрав короткий prompt: system-правило агента, **один** фрагмент postmortem INC-442 і user-turn із CI. Блок Retrieved context — це **зовнішні дані з документа**, не системні інструкції: текст «з wiki» не стає новими правилами для агента. INC-318 модель у **цьому** виклику не бачить.',
    whoUk: 'Context builder (код) → generative LLM.',
    nextUk: 'LLM формує гіпотезу — крок 5.',
    techMarkdownUk:
      'Формат `messages[]`, token budget, `chunk_id` у trace. Інструкції всередині знайденого chunk (prompt injection) мають лишатися **даними для аналізу**, не policy — див. failure mode «Ін’єкція в документ».',
  },
  {
    titleUk: 'Модель висунула гіпотезу',
    teaserUk: '«Схоже на попередню зміну селектора» — не доведена причина сьогодні.',
    whatUk:
      'Модель з посиланням на INC-442 пропонує: селектор `#login-btn` змінився — схоже на минулий інцидент. Це **гіпотеза**, не підтверджена причина сьогоднішнього падіння.',
    whoUk: 'LLM (ймовірнісно).',
    nextUk: 'Код і QA перевіряють — крок 6.',
    techMarkdownUk: 'Citation `INC-442` ≠ встановлена root cause. RAG не створює Jira ticket сам.',
  },
  {
    titleUk: 'Перевірили гіпотезу',
    teaserUk: 'Три шари перевірки; QA може підтвердити, спростувати або не мати висновку.',
    whatUk:
      'Спочатку код перевіряє технічну коректність citation, потім змістову відповідність тексту INC-442, окремо — чи пояснює це **сьогоднішнє** падіння. Перша перевірка не замінює наступні. QA фіксує один із трьох висновків: гіпотеза підтверджена, спростована або **доказів недостатньо** (DOM/trace/logs не дають чіткої відповіді).',
    whoUk: 'Harness (код) і QA (людина).',
    nextUk: 'Зафіксований висновок QA — кінець цього run (або подальше розслідування).',
    techMarkdownUk:
      'Код: A — `source_id` ∈ selected evidence. B — теза vs текст chunk. QA: C — oracle поточного збою. Окремо від цього — метрики groundedness у розділі про перевірки якості.',
  },
];

export const RAG_FORBIDDEN_TENANT_CARD = {
  titleUk: 'Інший tenant — був би заборонений',
  bodyUk:
    'Навчальна картка: документ чужого клієнта не потрапив би в дозволені результати для tenant acme. Текст не показуємо — це не «безпечний» hit з реального пошуку.',
};

export const RAG_LLM_PROMPT_SNIPPET = {
  userUk: 'login_spec failed staging, timeout #login-btn, trace ci-8842',
  retrievedBadgeUk: 'Retrieved context · зовнішній документ',
  retrievedUk:
    'INC-442: селектор #login-btn змінився на data-test=login-submit; тест чекав старий id …',
  retrievedNoteUk:
    'Це цитата з postmortem, не system policy. Якщо в документі є «ігноруй інструкції» — це не стає командою агенту; harness тримає system окремо.',
  noteUk: 'INC-318 у цьому run не в блоці Retrieved context.',
};

export const RAG_STEP6_CHECKS = [
  {
    layerUk: 'Технічна (код)',
    bodyUk: 'Посилання INC-442 є серед фрагментів, які **реально передали** LLM у цьому run (не лише «був у пошуку»).',
  },
  {
    layerUk: 'Змістовна',
    bodyUk: 'Твердження про зміну селектора справді є в тексті фрагмента INC-442 — правильний id біля хибної тези не проходить цю перевірку.',
  },
  {
    layerUk: 'Поточний збій (QA)',
    bodyUk: 'Сьогоднішній DOM, Playwright trace і логи CI підтверджують або **не** підтверджують цю причину для поточного падіння.',
  },
] as const;

export const RAG_STEP6_QA_OUTCOMES = [
  { labelUk: 'Підтверджена', hintUk: 'Oracle узгоджується з гіпотезою.' },
  { labelUk: 'Спростована', hintUk: 'Докази сьогодні вказують на іншу причину.' },
  { labelUk: 'Доказів недостатньо', hintUk: 'Trace/DOM/logs не дають чіткої відповіді — не вимушуйте бінарний висновок.' },
] as const;

export const RAG_HYPOTHESIS_EXAMPLE =
  'Схоже на попередню зміну селектора (#login-btn → data-test=login-submit), див. INC-442.';
