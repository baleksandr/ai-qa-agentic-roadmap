import type { FundamentalsCardPanel } from './fundamentals-card-panels';
import type { StudyLearnerPanelProcessStepPickSection } from './study-learner-panel-sections';

const pick = (
  labelUk: string,
  pickAriaLabel: string,
  steps: StudyLearnerPanelProcessStepPickSection['steps'],
) => ({
  type: 'processStepPick' as const,
  labelUk,
  pickAriaLabel,
  presentation: 'concepts' as const,
  showActorInPanel: false,
  showStepIndexInPanel: false,
  navLayout: 'sidebar' as const,
  steps,
});

export const HARNESS_ONE_RUN_STEP_1: FundamentalsCardPanel = {
  terms: [
    { label: 'runId', text: 'Ідентифікатор одного розслідування в застосунку, не плутати з CI run тесту.' },
    { label: 'артефакт', text: 'Посилання на звіт, trace або лог — ще не прочитаний вміст.' },
  ],
  sections: [
    {
      type: 'plain',
      labelUk: 'Простими словами',
      bodyUk:
        'Після падіння login_spec harness створює окремий запис розслідування з власним runId. Це не той самий ідентифікатор, що run тесту в CI: CI run — це запуск тестів у пайплайні, runId розслідування — внутрішній ключ, під яким код збирає кроки, policy і trace саме цього розбору. Плутати їх не можна — QA звіряє correlation у логах.',
    },
    {
      type: 'plain',
      labelUk: 'Вхід',
      bodyUk:
        'Повідомлення CI: login_spec, timeout під час пошуку #login-btn. Метадані тесту та посилання на артефакти (звіт Playwright, trace) для цього CI run.',
    },
    {
      type: 'plain',
      labelUk: 'Дія',
      bodyUk:
        'Код записує назву тесту, текст timeout, runId розслідування й прив’язує посилання на артефакти до цього runId. Жодного читання файлів на цьому кроці.',
    },
    {
      type: 'plain',
      labelUk: 'Результат',
      bodyUk:
        'У системі є runId розслідування з відомими фактами з CI. Посилання на звіт є в metadata, але вміст звіту ще не в state і не в messages моделі.',
    },
    {
      type: 'qaCheck',
      bodyUk:
        'Перевірити в trace або БД: тест login_spec, подія timeout на #login-btn і артефакти належать одному runId розслідування. runId розслідування ≠ ідентифікатор CI job/run тесту. Немає запису, що звіт уже прочитано.',
    },
  ],
};

export const HARNESS_ONE_RUN_STEP_2: FundamentalsCardPanel = {
  terms: [
    { label: 'messages', text: 'Повідомлення для model API — їх збирає код, не модель.' },
    { label: 'context', text: 'Лише факти, які застосунок уже має для цього runId.' },
  ],
  sections: [
    {
      type: 'plain',
      labelUk: 'Простими словами',
      bodyUk:
        'Harness формує перший запит до моделі: задача розслідування, відомі симптоми з CI і опис доступних інструментів. `messages[]` збирає код за правилами продукту. Модель бачить тільки те, що потрапило в цей масив.',
    },
    {
      type: 'plain',
      labelUk: 'Вхід',
      bodyUk:
        'runId розслідування, факти CI, registry інструментів, правила prompt без тексту непрочитаного звіту.',
    },
    {
      type: 'plain',
      labelUk: 'Дія',
      bodyUk:
        'Context builder додає system/user повідомлення, tool schemas і викликає model client, коли harness готовий до першого turn.',
    },
    {
      type: 'plain',
      labelUk: 'Результат',
      bodyUk:
        'Приклад змісту, який модель отримає (умовно):\n\n«Відомо: login_spec, timeout на #login-btn. Потрібно: запропонувати перевірку. Звіт: ще не отриманий».\n\nУ payload немає DOM, HTML звіту чи вигаданих деталей сторінки.',
    },
    {
      type: 'qaCheck',
      bodyUk:
        'Зіставити messages[] у trace з джерелами CI для цього runId. Переконатися, що немає вмісту непрочитаного Playwright-звіту, секретів і даних іншого run. Кожен факт у prompt має мати джерело в metadata або попередніх кроках harness.',
    },
  ],
};

export const HARNESS_ONE_RUN_STEP_3: FundamentalsCardPanel = {
  terms: [
    { label: 'tool call', text: 'Пропозиція викликати інструмент — ще без виконання.' },
    { label: 'гіпотеза', text: 'Текстова ідея про причину до перевірки фактами.' },
  ],
  sections: [
    {
      type: 'plain',
      labelUk: 'Простими словами',
      bodyUk:
        'Модель отримує підготовлений запит і повертає completion: або текст, або structured пропозицію інструмента. Обидва варіанти фіксуються в trace як відповідь моделі, не як читання звіту.',
    },
    {
      type: 'plain',
      labelUk: 'Вхід',
      bodyUk: 'messages[] і tool schemas з попереднього кроку harness.',
    },
    pick('Як відповіла модель', 'Два варіанти відповіді моделі на перший запит', [
      {
        key: 'text',
        titleUk: 'Відповіла текстом',
        teaserUk: 'Пояснення або гіпотеза без tool call',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Простими словами',
            bodyUk: 'Модель описує можливі причини timeout словами, не пропонуючи readPlaywrightReport. Текстова',
            labeledPairs: [
              {
                termUk: 'гіпотеза',
                explanationUk:
                  'не є встановленою причиною падіння — це припущення до перевірки доказами зі звіту, spec або trace.',
              },
            ],
          },
          {
            labelUk: 'Дія',
            bodyUk:
              'Model API повертає відповідь моделі. Це може бути текст або пропозиція викликати інструмент. Harness розбирає відповідь і вирішує, що дозволено зробити далі.',
          },
          {
            labelUk: 'Результат',
            bodyUk:
              'У trace — текст completion без пропозиції інструмента. Немає tool span і немає приписування моделі читання файлу.',
          },
        ],
        qaCheckUk:
          'У trace знайти саме відповідь моделі (completion). Переконатися, що в логах немає tool result і що текст не містить фактів з непрочитаного звіту як підтверджених.',
      },
      {
        key: 'tool',
        titleUk: 'Запропонувала readPlaywrightReport',
        teaserUk: 'Tool call з назвою та аргументами',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Простими словами',
            bodyUk:
              'Модель повертає structured відповідь API з пропозицією інструмента.',
            labeledLead: {
              termUk: 'tool call',
              explanationUk:
                'містить ім’я readPlaywrightReport і args (наприклад шлях до артефакту). Handler ще не викликали, файл не відкривали.',
            },
          },
          {
            labelUk: 'Дія',
            bodyUk:
              'Harness отримує пропозицію від model client і передає її на validation та policy на наступних кроках цього run.',
          },
          {
            labelUk: 'Результат',
            bodyUk:
              'У trace видно tool call proposal. Немає observation з вмістом звіту і немає side effect читання диску.',
          },
        ],
        qaCheckUk:
          'Відокремити в trace пропозицію tool від виконання read. Spy handler — 0 викликів до allow. Args збережені для кроку policy.',
      },
    ]),
    {
      type: 'plain',
      labelUk: 'Дія',
      bodyUk: 'Model client викликає API; harness зберігає raw completion і тип відповіді (текст або tool call).',
    },
    {
      type: 'plain',
      labelUk: 'Результат',
      bodyUk:
        'Відповідь API зафіксована під runId. Далі harness обробляє або текст, або пропозицію інструмента — без змішування з результатом читання.',
    },
    {
      type: 'qaCheck',
      bodyUk:
        'Для обраного варіанту перевірити trace: completion від моделі є, читання файлу відсутнє. Текстова гіпотеза не трактується як root cause без доказів.',
    },
  ],
};

export const HARNESS_ONE_RUN_STEP_4: FundamentalsCardPanel = {
  terms: [
    { label: 'policy', text: 'Allow, deny, needs_approval у коді harness.' },
    { label: 'validation', text: 'Перевірка схеми args до I/O.' },
  ],
  sections: [
    {
      type: 'plain',
      labelUk: 'Простими словами',
      bodyUk:
        'Перед читанням файлу harness перевіряє назву інструмента в registry, коректність args і policy для артефакта цього runId. Рішення фіксується в trace до виклику handler.',
    },
    {
      type: 'plain',
      labelUk: 'Вхід',
      bodyUk: 'Пропозиція readPlaywrightReport від моделі, tool registry, правила policy та ACL артефактів.',
    },
    pick('Наслідок перевірки', 'Allow, deny, некоректні args і needs_approval', [
      {
        key: 'allow',
        titleUk: 'Allow — перейти до читання',
        teaserUk: 'Args валідні, policy дозволяє read',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Простими словами',
            bodyUk:
              'Harness дозволяє виклик handler: назва в registry, args проходять schema, шлях у sandbox і runId узгоджений з артефактом.',
          },
          {
            labelUk: 'Результат',
            bodyUk: 'У trace — policy allow; далі можливий крок читання інструментом.',
          },
        ],
        qaCheckUk: 'Після allow у trace є рішення policy перед tool span; handler ще не обов’язково викликано на цьому ж мілісекундному записі — але deny не застосовано.',
      },
      {
        key: 'deny',
        titleUk: 'Deny — не запускати інструмент',
        teaserUk: 'Policy забороняє read для цього run',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Простими словами',
            bodyUk:
              'Policy повертає deny: handler readPlaywrightReport не викликають. Це результат перевірки harness, не помилка інструмента і не «порожній звіт».',
          },
          {
            labelUk: 'Результат',
            bodyUk: 'У state — відмова з причиною; немає tool result з диску.',
          },
        ],
        qaCheckUk: 'Spy handler: 0 викликів після deny. У trace видна причина відмови (policy), не file_not_found від handler.',
      },
      {
        key: 'invalid',
        titleUk: 'Некоректні аргументи — відхилити до читання',
        teaserUk: 'Schema fail до executor',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Простими словами',
            bodyUk:
              'Validator відхиляє args (невідоме поле, path поза sandbox, невалідний JSON). Executor не стартує — це не deny policy, а помилка формату пропозиції.',
          },
          {
            labelUk: 'Результат',
            bodyUk: 'Validation error у trace; читання диску не відбулося.',
          },
        ],
        qaCheckUk: 'Handler не викликано; у trace validation error зрозумілий для QA, без вигаданого вмісту звіту в messages.',
      },
      {
        key: 'needs-approval',
        titleUk: 'Needs approval — чекати людину',
        teaserUk: 'Якщо продукт вимагає підтвердження',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Простими словами',
            bodyUk:
              'Якщо політика продукту передбачає needs_approval, harness зупиняє автоматичне читання до рішення людини. Це очікування дозволу до виконання інструмента, не плутати з deny через ACL.',
          },
          {
            labelUk: 'Результат',
            bodyUk: 'Run у стані очікування approve; handler не викликано до підтвердження.',
          },
        ],
        qaCheckUk: 'Без approve немає tool span read. Після approve — той самий шлях, що allow.',
      },
    ]),
    {
      type: 'plain',
      labelUk: 'Дія',
      bodyUk: 'Registry lookup, schema validation, policy evaluation; запис рішення в trace і state.',
    },
    {
      type: 'plain',
      labelUk: 'Результат',
      bodyUk: 'Allow з args для executor, deny, validation error або needs_approval — без читання при відмові.',
    },
    {
      type: 'qaCheck',
      bodyUk:
        'Після deny або validation fail — нуль викликів handler. Причина відмови читабельна в trace. Needs_approval не обходиться через prompt моделі.',
    },
  ],
};

export const HARNESS_ONE_RUN_STEP_5: FundamentalsCardPanel = {
  terms: [
    { label: 'handler', text: 'Код readPlaywrightReport після allow.' },
    { label: 'tool result', text: 'Фрагмент артефакта або помилка I/O після виклику.' },
  ],
  sections: [
    {
      type: 'plain',
      labelUk: 'Простими словами',
      bodyUk:
        'Цей крок лише після allow. Якщо на попередньому кроці був deny або validation fail, handler не викликали — крок читання для цього turn взагалі не відбувся.',
    },
    {
      type: 'plain',
      labelUk: 'Вхід',
      bodyUk: 'Дозволені args, canonical path артефакту, runId розслідування.',
    },
    pick('Результат читання', 'Фрагмент артефакта або помилка після allow', [
      {
        key: 'fragment',
        titleUk: 'Отримано фрагмент',
        teaserUk: 'Інструмент повернув частину артефакту',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Простими словами',
            bodyUk:
              'Handler прочитав дозволений файл і повернув фрагмент (формат залежить від артефакта — не обіцяємо повний DOM і не HTML за замовчуванням). Фрагмент допомагає аналізу, але сам по собі не доводить причину timeout без зіставлення з spec, trace і контекстом пошуку #login-btn.',
          },
          {
            labelUk: 'Результат',
            bodyUk: 'Tool result у state з фактично прочитаними байтами/текстом згідно з handler.',
          },
        ],
        qaCheckUk:
          'Звірити фрагмент з fixture звіту в тесті. Не вимагати повного DOM. Висновок моделі пізніше має спиратися на цей result, а не на вигаданий вміст.',
      },
      {
        key: 'read-error',
        titleUk: 'Помилка читання',
        teaserUk: 'Файл недоступний, timeout I/O тощо',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Простими словами',
            bodyUk:
              'Після allow handler спробував read, але отримав помилку (наприклад відсутній файл, timeout). Вміст звіту залишається невідомим — harness передає помилку далі як факт, без вигаданого тексту звіту.',
          },
          {
            labelUk: 'Результат',
            bodyUk: 'Tool result з кодом/текстом помилки; не плутати з deny на етапі policy.',
          },
        ],
        qaCheckUk:
          'У messages наступного turn — помилка читання, не «успішний» snippet. Модель не повинна цитувати DOM, якого не було в tool result.',
      },
    ]),
    {
      type: 'plain',
      labelUk: 'Дія',
      bodyUk: 'Tool executor викликає handler readPlaywrightReport у sandbox (або mock у тесті).',
    },
    {
      type: 'plain',
      labelUk: 'Результат',
      bodyUk: 'Фрагмент артефакта або помилка читання записані для state manager — лише якщо allow був раніше.',
    },
    {
      type: 'qaCheck',
      bodyUk:
        'Якщо deny був раніше — цього кроку не було в trace. Якщо allow — є tool span з result або I/O error. Не змішувати deny policy з file_not_found після виклику handler.',
    },
  ],
};

export const HARNESS_ONE_RUN_STEP_6: FundamentalsCardPanel = {
  terms: [
    { label: 'state', text: 'Дані одного розслідування, які оновлює код harness.' },
    { label: 'observation', text: 'Tool result або помилка в messages для наступного turn.' },
  ],
  sections: [
    {
      type: 'prose',
      labelUk: 'Простими словами',
      labeledLead: {
        termUk: 'State',
        explanationUk:
          'збережені дані одного розслідування: кроки, фактично отримані результати інструментів, помилки та службові дані. Його оновлює код harness. State сам не викликає модель і не запускає інструменти.',
      },
      bodyUk:
        'Код записує результат або помилку разом із runId, а перед наступним викликом моделі бере зі стану потрібні дані.',
    },
    {
      type: 'plain',
      labelUk: 'Вхід',
      bodyUk: 'Tool result, помилка читання, відповідь моделі або запис deny — з поточного turn.',
    },
    {
      type: 'plain',
      labelUk: 'Дія',
      bodyUk:
        'State manager додає observation до історії run. Якщо stop rules дозволяють продовження, context builder готує наступний messages[] із цим результатом.',
    },
    {
      type: 'plain',
      labelUk: 'Результат',
      bodyUk:
        'Оновлений state під правильним runId. Для наступного виклику моделі — повідомлення з tool result або помилкою, без перетворення помилки на «прочитаний DOM».',
    },
    {
      type: 'qaCheck',
      bodyUk:
        'Перевірити, що observation у наступному prompt належить цьому runId. Помилка читання лишається помилкою в messages, не успішним фрагментом звіту.',
    },
  ],
};

export const HARNESS_ONE_RUN_STEP_7: FundamentalsCardPanel = {
  terms: [
    { label: 'stop condition', text: 'Правила завершення циклу harness.' },
    { label: 'max steps', text: 'Верхня межа кроків одного run.' },
  ],
  sections: [
    {
      type: 'plain',
      labelUk: 'Простими словами',
      bodyUk:
        'Harness після оновлення state вирішує, чи потрібен ще один turn моделі, чи показати людині підсумок, чи зупинити run. Відсутність нового tool call у відповіді моделі сама по собі не означає, що причину встановлено — код перевіряє stop rules і рівень доказів.',
    },
    {
      type: 'plain',
      labelUk: 'Вхід',
      bodyUk: 'State, лічильник кроків, остання відповідь моделі, накопичені tool results і stop rules продукту.',
    },
    pick('Що робить harness далі', 'Продовження, підсумок або зупинка', [
      {
        key: 'next-turn',
        titleUk: 'Наступний виклик моделі',
        teaserUk: 'Є дані для ще одного turn',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Простими словами',
            bodyUk:
              'Приклад: після фрагмента звіту harness додає observation у messages і знову викликає модель, бо stop rules і ліміт кроків дозволяють продовження, а висновок ще не сформовано за політикою продукту.',
          },
          {
            labelUk: 'Результат',
            bodyUk: 'Новий model turn під тим самим runId; лічильник кроків збільшився.',
          },
        ],
        qaCheckUk: 'У trace — другий model call після tool result; run не позначений completed без підстав.',
      },
      {
        key: 'summary',
        titleUk: 'Підсумок для людини',
        teaserUk: 'Достатньо доказів для UI',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Простими словами',
            bodyUk:
              'Приклад: модель дала текстовий висновок після tool result, stop rules дозволяють завершити, harness формує підсумок з позначенням рівня доказів (що підтверджено звітом, що лишається гіпотезою). Це не те саме, що «модель не запропонувала tool» — перевіряються умови завершення.',
          },
          {
            labelUk: 'Результат',
            bodyUk: 'Run completed з підсумком для UI; статус відрізняє впевнений факт від припущення.',
          },
        ],
        qaCheckUk: 'UI показує підсумок і рівень доказів. Відсутність tool call у останній відповіді без state не дає auto-complete.',
      },
      {
        key: 'stop',
        titleUk: 'Зупинка через ліміт або помилку',
        teaserUk: 'max steps, timeout, нестача прогресу',
        actorUk: '',
        detailSections: [
          {
            labelUk: 'Простими словами',
            bodyUk:
              'Приклад: mock LLM тричі пропонує той самий read без нових фактів у state — harness зупиняє run зі статусом max_steps. Інший приклад: критична помилка harness або timeout run — підсумок для людини з поясненням, що причину не встановлено.',
          },
          {
            labelUk: 'Результат',
            bodyUk: 'Run завершено з stop reason; UI не видає «успіх розслідування» без доказів.',
          },
        ],
        qaCheckUk:
          'Перевірити лічильник кроків, stop reason у trace і відображення в UI (max_steps, timeout, помилка). Не плутати з успішним підсумком.',
      },
    ]),
    {
      type: 'plain',
      labelUk: 'Дія',
      bodyUk: 'Застосування stop rules, підготовка наступного запиту або фіналізація run для UI.',
    },
    {
      type: 'plain',
      labelUk: 'Результат',
      bodyUk: 'Продовжений цикл, підсумок з рівнем доказів або зупинка зі зрозумілим статусом.',
    },
    {
      type: 'qaCheck',
      bodyUk:
        'Число кроків і stop reason у trace узгоджені з UI. Підсумок без tool result не видається за повне розслідування. Max steps зупиняє цикл без нескінченного read.',
    },
  ],
};
