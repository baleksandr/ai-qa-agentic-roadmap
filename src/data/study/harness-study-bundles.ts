import type { StudyAfterInteractiveSummary } from './study-teaching-card-types';
import { fundamentalsConceptStep } from './fundamentals-teaching-step';
import {
  HARNESS_CYCLE_STOP,
  HARNESS_CYCLE_TEXT_RESPONSE,
  HARNESS_CYCLE_TOOL_PROPOSAL,
  HARNESS_CYCLE_TOOL_RESULT,
} from './harness-cycle-panels';
import {
  HARNESS_LLM_CODE_APP,
  HARNESS_LLM_CODE_HUMAN,
  HARNESS_LLM_CODE_MODEL,
} from './harness-llm-code-panels';
import {
  HARNESS_COMPONENT_CONTEXT,
  HARNESS_COMPONENT_EXECUTOR,
  HARNESS_COMPONENT_LIMITS,
  HARNESS_COMPONENT_MODEL_CLIENT,
  HARNESS_COMPONENT_POLICY,
  HARNESS_COMPONENT_REGISTRY,
  HARNESS_COMPONENT_STATE,
  HARNESS_COMPONENT_TRACING,
} from './harness-components-panels';
import {
  HARNESS_ONE_RUN_STEP_1,
  HARNESS_ONE_RUN_STEP_2,
  HARNESS_ONE_RUN_STEP_3,
  HARNESS_ONE_RUN_STEP_4,
  HARNESS_ONE_RUN_STEP_5,
  HARNESS_ONE_RUN_STEP_6,
  HARNESS_ONE_RUN_STEP_7,
} from './harness-one-run-panels';
import { harnessComponentPanel } from './harness-study-panels';
import {
  HARNESS_FAILURE_FORBIDDEN,
  HARNESS_FAILURE_INVALID_ARGS,
  HARNESS_FAILURE_LARGE_RESULT,
  HARNESS_FAILURE_LOOP,
} from './harness-failure-panels';
import {
  HARNESS_PRODUCTION_METRICS,
  HARNESS_PRODUCTION_TRACE,
  HARNESS_PRODUCTION_VERSIONS,
} from './harness-production-panels';
import {
  HARNESS_QA_TEST_DENY,
  HARNESS_QA_TEST_EVAL_GROUNDING,
  HARNESS_QA_TEST_HANDLER_ARTIFACT,
  HARNESS_QA_TEST_INVALID_PROPOSAL,
  HARNESS_QA_TEST_MAX_STEPS,
  HARNESS_QA_TEST_RESULT_VS_ERROR,
} from './harness-qa-test-panels';
import type { StudyTeachingCardsBundle } from './study-teaching-card-types';

export const HARNESS_WHY_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Навіщо потрібен agent harness',
  presentation: 'concepts',
  conceptsHeadingUk: 'Один приклад login_spec',
  steps: [
    fundamentalsConceptStep(
      'why-model-proposal',
      'Модель пропонує',
      'Може запропонувати прочитати звіт. Сама файл не відкриває.',
      harnessComponentPanel(
        'Модель бачить лише те, що код уже поклав у запит: повідомлення CI, правила задачі, опис доступних інструментів. Вона може пояснити timeout словами або запропонувати readPlaywrightReport — це пропозиція в відповіді API, а не виконана дія.',
        'Messages про login_spec і timeout на #login-btn без вмісту непрочитаного звіту.',
        'Генерує текст або structured пропозицію tool call (ім’я інструмента й args).',
        'У trace з’являється пропозиція readPlaywrightReport; файл на диску ще не відкривали.',
        'У відповіді немає підтвердженого DOM зі звіту. Пропозиція tool ≠ виконання read.',
        [
          { label: 'tool call', text: 'Пропозиція моделі викликати інструмент із аргументами.' },
          { label: 'гіпотеза', text: 'Можливе пояснення, яке треба перевірити фактами.' },
        ],
      ),
    ),
    fundamentalsConceptStep(
      'why-code-checks',
      'Код перевіряє',
      'Перевіряє назву інструмента, аргументи й дозвіл на читання.',
      harnessComponentPanel(
        'Agent harness — код застосунку навколо моделі: він парсить відповідь, звіряє назву інструмента з tool registry, валідує аргументи й застосовує policy (allow, deny, needs_approval) до будь-якого читання файлу.',
        'Пропозиція readPlaywrightReport від моделі, конфіг registry і правила policy для цього runId.',
        'Відхиляє невідомий tool і невалідні args до handler; при deny фіксує відмову в trace без читання диску.',
        'Allow з дозволеними args для executor або deny / validation error без side effect.',
        'Spy на handler: при policy deny — 0 викликів read. Невідома назва tool з відповіді моделі не запускає код.',
        [
          {
            label: 'agent harness',
            text: 'Програмний каркас навколо LLM: context, виклик API, перевірки, loop і tracing.',
          },
          {
            label: 'tool registry',
            text: 'Allow-list інструментів, які застосунок уміє виконати, і JSON schema їхніх аргументів.',
          },
          { label: 'policy', text: 'Правила в коді: чи можна виконати пропозицію на цьому run.' },
        ],
      ),
    ),
    fundamentalsConceptStep(
      'why-tool',
      'Інструмент читає',
      'Після дозволу намагається прочитати звіт і повертає дані або помилку.',
      harnessComponentPanel(
        'Розділяйте два різні результати. **Deny** (відмова policy або validation на етапі harness) означає, що handler інструмента **не викликали** — у trace є рішення harness, але немає читання файлу. Це не «порожній tool result» і не помилка handler. **Allow** означає, що handler справді запустили: він намагається прочитати артефакт звіту в sandbox і повертає фактично прочитаний фрагмент (формат залежить від файлу — не обіцяйте собі саме HTML) або помилку читання після виклику (наприклад відсутній файл, timeout I/O). file_not_found після allow — це вже результат виконання інструмента; deny — ні.',
        'Пропозиція від моделі вже пройшла registry і policy: при deny сюди не доходять; при allow — дозволені args (canonical path, runId).',
        'При **allow** handler readPlaywrightReport виконує read на диску або mock у тесті. При **deny** на попередньому кроці harness handler не стартує — інструмент не читав звіт.',
        'При allow: фрагмент прочитаного артефакта в state run або запис помилки читання для наступного turn. При deny: у state лишається відмова harness без виклику handler — не змішуйте з file_not_found.',
        'Given deny, when run, then spy handler — 0 викликів, у trace policy/validation deny. Given allow і відсутній файл, when read, then tool result — помилка читання, не вигаданий вміст звіту. Given allow і валідний артефакт, when read, then фрагмент узгоджується з fixture, без припущення про формат HTML.',
        [
          { label: 'handler', text: 'Код конкретного інструмента після policy.' },
          { label: 'tool result', text: 'Фактичні дані або помилка виконання.' },
        ],
      ),
    ),
    fundamentalsConceptStep(
      'why-stop-continue',
      'Код вирішує, що далі',
      'Передає результат моделі для наступного кроку або завершує розслідування.',
      harnessComponentPanel(
        'Після відповіді моделі або tool result harness оновлює state run і вирішує: ще один turn моделі, підсумок для людини або stop condition — max steps, timeout run, фінальна відповідь без нового tool або помилка, з якою продукт не продовжує цикл. **Відсутність нового tool call у відповіді моделі сама по собі не доводить**, що висновок готовий показати: код перевіряє stop rules, чи є достатньо доказів у state і чи дозволяє політика продукту завершити run текстом без додаткових дій.',
        'Поточний state, лічильник кроків, відповідь моделі, накопичені tool results і рішення harness (allow/deny, помилки читання).',
        'Застосовує stop rules, оцінює чи можна завершити з наявними фактами, готує наступний запит або закриває run із статусом.',
        'Новий model turn з observation у messages, підсумок для UI за виконаних умов завершення або stop (наприклад max_steps, timeout, нестача даних для висновку).',
        'Mock LLM повертає лише текст без tool call, але state порожній — harness не повинен позначати run «готовим» лише через відсутність tool call. Mock з циклом read без прогресу зупиняється на max steps. UI відрізняє підсумок від stop через помилку чи нестачу даних.',
        [
          {
            label: 'stop condition',
            text: 'Правило в коді, коли harness більше не продовжує цикл (ліміт кроків, час, фінальна відповідь).',
          },
          { label: 'observation', text: 'Результат tool або помилка, які потрапляють у наступний turn.' },
        ],
      ),
    ),
  ],
};

export const HARNESS_ONE_RUN_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Сім кроків одного run після login_spec',
  presentation: 'process',
  introCalloutLabelUk: 'Одна історія',
  /** Два етапи без дубля сім кроків у верхній схемі (компонент показує ribbon лише від 3+). */
  flowArrowLine: 'повідомлення CI → підсумок або зупинка',
  introScenarioCard: {
    titleUk: 'Одна історія',
    bodyUk:
      'CI повідомив, що login_spec зупинився під час пошуку #login-btn. Причина ще невідома, звіт Playwright не прочитано. Простежмо один можливий шлях розслідування: від повідомлення CI до підсумку або зупинки. На кроках перевірки й читання можливі відмова та помилка — їх теж покажемо.',
    flowLineUk: '',
  },
  steps: [
    fundamentalsConceptStep(
      'run-1',
      'Створити розслідування',
      'Код пов’язує збій CI з окремим runId.',
      HARNESS_ONE_RUN_STEP_1,
    ),
    fundamentalsConceptStep(
      'run-2',
      'Підготувати запит',
      'Код передає моделі відомі факти, без непрочитаного звіту.',
      HARNESS_ONE_RUN_STEP_2,
    ),
    fundamentalsConceptStep(
      'run-3',
      'Отримати пропозицію',
      'Модель відповідає текстом або пропонує прочитати звіт.',
      HARNESS_ONE_RUN_STEP_3,
    ),
    fundamentalsConceptStep(
      'run-4',
      'Перевірити дозвіл',
      'Код перевіряє інструмент, аргументи й доступ до звіту.',
      HARNESS_ONE_RUN_STEP_4,
    ),
    fundamentalsConceptStep(
      'run-5',
      'Спробувати прочитати звіт',
      'Лише після дозволу інструмент повертає дані або помилку.',
      HARNESS_ONE_RUN_STEP_5,
    ),
    fundamentalsConceptStep(
      'run-6',
      'Записати результат',
      'Код пов’язує отримане з цим run і за потреби готує наступний запит.',
      HARNESS_ONE_RUN_STEP_6,
    ),
    fundamentalsConceptStep(
      'run-7',
      'Продовжити чи завершити',
      'Код перевіряє правила зупинки й наявність доказів.',
      HARNESS_ONE_RUN_STEP_7,
    ),
  ],
};

export const HARNESS_COMPONENTS_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Компоненти agent harness',
  presentation: 'concepts',
  introCalloutLabelUk: 'З яких частин складається harness',
  leadUk:
    'У прикладі login_spec код має підготувати дані для моделі, отримати її відповідь, перевірити запропоновану дію, за потреби прочитати звіт і зберегти результат. Нижче — частини коду, які відповідають за різні задачі. Це не вісім обов’язкових викликів у кожному run: наприклад, без пропозиції інструмента executor може взагалі не запускатися.',
  steps: [
    fundamentalsConceptStep(
      'context-builder',
      'Context builder',
      'Збирає для моделі відомі факти про цей run.',
      HARNESS_COMPONENT_CONTEXT,
    ),
    fundamentalsConceptStep(
      'model-client',
      'Model client',
      'Надсилає запит моделі й приймає відповідь або помилку.',
      HARNESS_COMPONENT_MODEL_CLIENT,
    ),
    fundamentalsConceptStep(
      'tool-registry',
      'Tool registry',
      'Описує відомі інструменти та форму їхніх аргументів.',
      HARNESS_COMPONENT_REGISTRY,
    ),
    fundamentalsConceptStep(
      'policy',
      'Policy layer',
      'Вирішує, чи дозволена конкретна дія.',
      HARNESS_COMPONENT_POLICY,
    ),
    fundamentalsConceptStep(
      'executor',
      'Tool executor',
      'Запускає дозволений інструмент.',
      HARNESS_COMPONENT_EXECUTOR,
    ),
    fundamentalsConceptStep(
      'state',
      'State manager',
      'Зберігає перебіг цього розслідування.',
      HARNESS_COMPONENT_STATE,
    ),
    fundamentalsConceptStep(
      'retry-timeout',
      'Retry / timeout',
      'Обмежує очікування та повтори.',
      HARNESS_COMPONENT_LIMITS,
    ),
    fundamentalsConceptStep(
      'tracing',
      'Tracing',
      'Фіксує, що справді відбулося.',
      HARNESS_COMPONENT_TRACING,
    ),
  ],
};

export const HARNESS_CYCLE_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Варіанти після відповіді моделі',
  presentation: 'concepts',
  introCalloutLabelUk: 'Що відбувається після відповіді моделі',
  leadUk:
    'У §2 ми простежили один можливий шлях розслідування. Але після кожного звернення до моделі harness має перевірити, що саме вона повернула. Від цього залежить наступна дія: показати обережний підсумок, перевірити інструмент, передати результат для нового виклику або зупинити run. Повтор запиту не є обов’язковим.',
  steps: [
    fundamentalsConceptStep(
      'text-stop',
      'Модель відповіла текстом',
      'Код перевіряє текст і вирішує, чи можна показати його людині.',
      HARNESS_CYCLE_TEXT_RESPONSE,
    ),
    fundamentalsConceptStep(
      'tool-branch',
      'Модель запропонувала інструмент',
      'Код перевіряє назву, аргументи та дозвіл до виконання.',
      HARNESS_CYCLE_TOOL_PROPOSAL,
    ),
    fundamentalsConceptStep(
      'after-tool',
      'Інструмент повернув результат',
      'Код записує дані або помилку й вирішує, чи потрібен новий виклик моделі.',
      HARNESS_CYCLE_TOOL_RESULT,
    ),
    fundamentalsConceptStep(
      'cycle-stop',
      'Run потрібно зупинити',
      'Код завершує роботу за правилами та показує зрозумілий статус.',
      HARNESS_CYCLE_STOP,
    ),
  ],
};

export const HARNESS_LLM_CODE_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Де код, а де LLM у harness',
  presentation: 'concepts',
  introCalloutLabelUk: 'Хто ухвалює яке рішення',
  leadUk:
    'Після збою login_spec модель може запропонувати перевірку, але не отримує доступ до файлу сама. Код застосунку перевіряє пропозицію, керує інструментом і зберігає результат. Людина долучається до рішень, для яких продукт передбачив її участь.',
  steps: [
    fundamentalsConceptStep(
      'llc-app',
      'Код застосунку',
      'Готує дані, перевіряє дозволи, виконує дії та керує run.',
      HARNESS_LLM_CODE_APP,
    ),
    fundamentalsConceptStep(
      'llc-model',
      'Мовна модель',
      'Формує текст або пропонує дію на основі отриманого контексту.',
      HARNESS_LLM_CODE_MODEL,
    ),
    fundamentalsConceptStep(
      'llc-human',
      'Людина за потреби',
      'Перевіряє висновок або підтверджує дію, коли це потрібно.',
      HARNESS_LLM_CODE_HUMAN,
    ),
  ],
};

export const HARNESS_QA_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Шість перевірок harness для QA',
  presentation: 'concepts',
  steps: [
    fundamentalsConceptStep(
      'harness-qa-handler',
      'Прочитано правильний файл',
      'Функція читання повертає текст потрібного файлу або помилку',
      HARNESS_QA_TEST_HANDLER_ARTIFACT,
    ),
    fundamentalsConceptStep(
      'harness-qa-deny',
      'Заборона справді блокує дію',
      'Після deny інструмент не запускається',
      HARNESS_QA_TEST_DENY,
    ),
    fundamentalsConceptStep(
      'harness-qa-invalid',
      'Некоректна пропозиція відхиляється',
      'Невідомий інструмент і зламані аргументи зупиняються до виконання',
      HARNESS_QA_TEST_INVALID_PROPOSAL,
    ),
    fundamentalsConceptStep(
      'harness-qa-result',
      'Дані й помилка не плутаються',
      'Наступний крок отримує фактичний результат інструмента',
      HARNESS_QA_TEST_RESULT_VS_ERROR,
    ),
    fundamentalsConceptStep(
      'harness-qa-max-steps',
      'Цикл має межу',
      'Повтор однієї пропозиції не створює нескінченний run',
      HARNESS_QA_TEST_MAX_STEPS,
    ),
    fundamentalsConceptStep(
      'harness-qa-eval',
      'Висновок спирається на факти',
      'Оцінюємо твердження моделі за доступними доказами',
      HARNESS_QA_TEST_EVAL_GROUNDING,
    ),
  ],
};

export const HARNESS_PRODUCTION_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Production і observability harness',
  presentation: 'concepts',
  introCalloutLabelUk: 'Як зрозуміти, що відбулося після запуску',
  leadUk:
    'У production QA не може покладатися лише на фінальну відповідь агента. Потрібно відновити події конкретного розслідування, побачити повторювані проблеми в метриках і знати, з якою версією коду та схем працював run.',
  steps: [
    fundamentalsConceptStep(
      'prod-trace',
      'Події одного run',
      'За ідентифікатором знайдіть запити моделі, рішення коду й виклики інструментів',
      HARNESS_PRODUCTION_TRACE,
    ),
    fundamentalsConceptStep(
      'prod-metrics',
      'Метрики роботи',
      'Покажіть, чи стали run повільнішими, помилковими або зацикленими',
      HARNESS_PRODUCTION_METRICS,
    ),
    fundamentalsConceptStep(
      'prod-versions',
      'Версії та оновлення',
      'Знайдіть, яка версія harness і схеми працювала під час run',
      HARNESS_PRODUCTION_VERSIONS,
    ),
  ],
};

export const HARNESS_FAILURE_BUNDLE: StudyTeachingCardsBundle = {
  ariaLabel: 'Де може зламатися harness',
  presentation: 'concepts',
  introCalloutLabelUk: 'Чотири типові ризики',
  leadUk:
    'У кожному з цих випадків модель може повернути переконливий текст, але саме код має обмежити виконання та записати причину зупинки. На прикладі login_spec перевіримо, де виникає проблема, що робить застосунок і що має побачити QA.',
  steps: [
    fundamentalsConceptStep(
      'harness-fail-loop',
      'Модель повторює ту саму дію',
      'Знову пропонує прочитати звіт, хоча нових фактів немає',
      HARNESS_FAILURE_LOOP,
    ),
    fundamentalsConceptStep(
      'harness-fail-args',
      'Аргументи інструмента некоректні',
      'Зламаний формат або недозволений шлях',
      HARNESS_FAILURE_INVALID_ARGS,
    ),
    fundamentalsConceptStep(
      'harness-fail-forbidden',
      'Дію заборонено',
      'Невідомий інструмент або немає доступу до артефакта',
      HARNESS_FAILURE_FORBIDDEN,
    ),
    fundamentalsConceptStep(
      'harness-fail-large',
      'Результат завеликий',
      'Звіт не вміщується в наступний запит до моделі',
      HARNESS_FAILURE_LARGE_RESULT,
    ),
  ],
};

export const HARNESS_REMEMBER_SUMMARY: StudyAfterInteractiveSummary = {
  sectionTitleUk: '',
  cards: [
    {
      titleUk: 'Модель пропонує',
      bodyUk:
        'Модель може сформулювати гіпотезу або запропонувати readPlaywrightReport. Пропозиція інструмента ще не означає, що файл прочитали.',
    },
    {
      titleUk: 'Код перевіряє та виконує',
      bodyUk:
        'Harness перевіряє назву інструмента, аргументи й дозвіл. Лише після цього код може запустити читання звіту.',
    },
    {
      titleUk: 'Код керує завершенням',
      bodyUk:
        'Harness зберігає результат або помилку й застосовує правила зупинки. Наявність текстової відповіді моделі сама не доводить, що причина збою встановлена.',
    },
    {
      titleUk: 'QA перевіряє різні речі окремо',
      bodyUk:
        'Unit-тести перевіряють конкретну функцію. Integration-тести перевіряють поведінку harness із підставною моделлю. Evals перевіряють обґрунтованість відповідей моделі.',
    },
  ],
};
