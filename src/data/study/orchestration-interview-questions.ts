import type { StudyInterviewQuestion } from './study-interview-types';

export const ORCHESTRATION_INTERVIEW_QUESTIONS: StudyInterviewQuestion[] = [
  {
    id: 'c02-q1',
    questionUk: 'Що робить orchestration, коли в продукті працюють кілька агентів?',
    answerBriefUk:
      'Вона координує задачі між CI, агентами, інструментами й людьми: перевіряє залежності, передає готову роботу виконавцю та обробляє результат.',
    answerBriefEn:
      'It coordinates tasks across CI, agents, tools, and people: checking dependencies, dispatching ready work, and handling results.',
    answerDeepUk:
      'Для ABC-123 CI спочатку повідомляє про падіння login_spec. Playwright-звіт може з’явитися пізніше. Workflow не позначає читання звіту виконаним до появи артефакта. Після investigation система за отриманими фактами визначає наступну задачу: перевірити інше джерело, передати доведений дефект Coding Agent або попросити допомоги людини. Це можливі гілки, а не обов’язкові кроки одна за одною.',
    answerDeepEn:
      'For ABC-123, CI first reports that login_spec failed, while the Playwright report may arrive later. The workflow does not treat the report as read before it is available. After investigation, actual evidence determines whether to check another source, assign a supported fix, or ask a person for help. These are possible branches, not mandatory consecutive steps.',
    pitfallUk:
      'Вважати, що кожен учасник сам знає актуальний стан усього workflow без передачі результатів і правил переходу.',
  },
  {
    id: 'c02-q2',
    questionUk: 'Чим orchestration відрізняється від harness одного агента?',
    answerBriefUk:
      'Harness керує кроками всередині задачі агента. Orchestration координує окремі задачі та їхніх виконавців у ширшому workflow.',
    answerBriefEn:
      'A harness manages steps within an agent task. Orchestration coordinates tasks and their owners across the wider workflow.',
    answerDeepUk:
      'QA Investigation Agent може мати власний harness: звернення до моделі, перевірку readPlaywrightReport, отримання результату й правила зупинки. Workflow для ABC-123 вирішує, коли дати агенту цю задачу та що робити після її завершення. Ці ролі можуть реалізовуватися в одному застосунку, тому різниця — у відповідальності, а не обов’язково в кількості сервісів.',
    answerDeepEn:
      'The QA Investigation Agent’s harness may call the model, validate readPlaywrightReport, collect the tool result, and enforce stop rules. The ABC-123 workflow decides when to start that investigation and what task follows its result. Both roles can live in one application; the distinction is their responsibility.',
    pitfallUk: 'Плутати внутрішній цикл model → tool → model із переходом між CI, investigation і review.',
  },
  {
    id: 'c02-q3',
    questionUk: 'Що таке human gate?',
    answerBriefUk:
      'Це точка workflow, у якій конкретна дія чекає явного рішення людини, якщо цього вимагають правила продукту.',
    answerBriefEn:
      'It is a point in the workflow where a specific action waits for an explicit human decision when product rules require one.',
    answerDeepUk:
      'Для ABC-123 агент підготував пропозицію змінити production config. Код показує людині конкретну дію та ставить її на паузу. Після схвалення код перевіряє чинні умови й виконує дозволений крок. Після відхилення дії немає. Назви статусу й audit-полів залежать від продукту. Схвалення не доводить, що зовнішня операція вже успішно завершилася.',
    answerDeepEn:
      'For ABC-123, an agent proposes a production configuration change. Code presents the specific action to a person and pauses it. After approval, code checks the current conditions and performs the allowed step. After rejection, no change is made. Status and audit field names depend on the product, and approval is distinct from successful execution.',
    pitfallUk: 'Вважати фразу «попроси підтвердження» в prompt достатнім технічним захистом від виконання дії.',
  },
  {
    id: 'c02-q4',
    questionUk: 'Чим небезпечна повторна доставка події CI?',
    answerBriefUk:
      'Та сама логічна подія може двічі створити задачу або workflow, якщо обробник не розпізнає повтор.',
    answerBriefEn:
      'The same logical CI event may create duplicate tasks or workflows if the consumer does not recognize a repeated delivery.',
    answerDeepUk:
      'У тесті двічі надсилають повідомлення про завершення того самого CI запуску login_spec для ABC-123. Очікування — один логічний investigation, якщо саме так визначено правилами продукту. Обробник може використовувати eventId або інший стійкий ключ, пов’язаний із CI запуском. Сам факт існування поля eventId не захищає від дубля, якщо результат його обробки не збережено надійно.',
    answerDeepEn:
      'The test delivers the completion event for the same login_spec CI run and ABC-123 twice. If product rules call for one investigation per CI run, only one logical investigation should result. The consumer may use an eventId or another stable key. An eventId alone is insufficient unless processing is recorded reliably.',
    pitfallUk: 'Перевіряти лише одинарну доставку та пропускати повтор після перезапуску обробника.',
  },
  {
    id: 'c02-q5',
    questionUk: 'Як QA перевіряє правила повторів?',
    answerBriefUk:
      'Імітує помилки, рахує фактичні спроби й перевіряє, що повтори припиняються за правилами продукту.',
    answerBriefEn:
      'QA simulates failures, counts actual attempts, and verifies that retries stop according to product rules.',
    answerDeepUk:
      'QA налаштовує тимчасову помилку CI job і наперед фіксує межу спроб. Перевіряє, чи початковий запуск входить до лічильника, які помилки дозволяють повтор та чи застосовується пауза, якщо вона налаштована. Якщо всі дозволені спроби завершилися помилкою, новий job не стартує. Якщо успіх настав раніше, система не витрачає решту спроб. Подальша передача людині можлива лише тоді, коли її передбачають правила workflow.',
    answerDeepEn:
      'QA configures a transient CI job failure and a known attempt limit. The test checks whether the initial run counts toward that limit, which errors are retryable, and whether any configured delay is applied. No job starts after the limit. If a run succeeds earlier, retries stop immediately. Human escalation happens only if the workflow defines it.',
    pitfallUk:
      'Вимагати «рівно N повторів» за будь-якого результату або вважати backoff обов’язковим для кожного продукту.',
  },
];
