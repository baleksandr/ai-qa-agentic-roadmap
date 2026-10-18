import type { StudyInterviewDeck, StudyInterviewQuestion } from './study-interview-types';

export function makeStudyInterviewDeck(
  deckId: string,
  pitchUk: string,
  pitchEn: string,
  questions: StudyInterviewQuestion[],
  nextLinks: StudyInterviewDeck['nextLinks'],
): StudyInterviewDeck {
  return {
    deckId,
    headingUk: 'Перевір себе перед співбесідою',
    leadUk:
      'Сформулюйте відповідь своїми словами, потім розгорніть «Коротко» і «До гвинтиків». Позначки — лише в цьому браузері.',
    pitchUk,
    pitchEn,
    questions,
    nextLinks,
  };
}

export function q(
  id: string,
  questionUk: string,
  brief: string,
  deep: string,
  pitfall: string,
): StudyInterviewQuestion {
  return {
    id,
    questionUk,
    answerBriefUk: brief,
    answerDeepUk: deep,
    pitfallUk: pitfall,
  };
}

const MEMORY_QUESTIONS: StudyInterviewQuestion[] = [
  q(
    'c01-q1',
    'Чим відрізняється state від memory в agentic системі?',
    'State — знімок поточного run (крок, статус, останні observations). Memory — збережене з минулого, що harness може знову додати в контекст.',
    'Після `login_spec` harness тримає `runId` і `step` у state. Факт «минулого разу ламався селектор» може жити в long-term memory, якщо політика дозволяє. LLM не читає сховище напряму — лише те, що context builder поклав у `messages[]`.',
    'Плутати «модель пам’ятає чат» з реальним збереженням у БД без harness.',
  ),
  q(
    'c01-q2',
    'Хто вирішує, який шмат history потрапить у наступний виклик LLM?',
    'Context builder і політики retention — код harness, не модель.',
    'Перед другим turn після `readPlaywrightReport` builder може: залишити system, user goal, останній tool result, короткий summary старих turns. Якщо історія довга — summarization з логом у trace.',
    'Вважати, що «автоматично все попереднє в контексті» без лімітів токенів.',
  ),
  q(
    'c01-q3',
    'Навіщо checkpoint у investigation run?',
    'Щоб після рестарту pod продовжити той самий run без повторення небезпечних дій.',
    'Checkpoint зберігає state після кроку N. QA: kill процес → restore → той самий `runId`/`step`, без другого write-tool. Idempotent handlers допомагають при duplicate retry.',
    'Тестувати лише happy path без crash recovery.',
  ),
  q(
    'c01-q4',
    'Як memory може зашкодити новому investigation?',
    'Старий факт з іншого продукту або tenant потрапляє в prompt і зміщує гіпотезу.',
    'Умова: memory з payment flow. Дія: новий run login-only. Очікування: фільтр по `productArea`/tenant у builder. Доказ: spy на payload до model API.',
    'Ігнорувати tenant isolation у тестах memory.',
  ),
  q(
    'c01-q5',
    'Що перевірити в trace щодо memory/state перед співбесідою?',
    'Переходи `step`, `checkpointId`, що саме пішло в context — без секретів у логах.',
    'QA дивиться: state після кожного tool, розмір prompt, чи не зник `lastObservation` після summarization. Відповідь LLM — гіпотеза; факти run — у state/trace.',
    'Перевіряти лише фінальний текст відповіді моделі.',
  ),
];

export const MEMORY_STATE_INTERVIEW_DECK: StudyInterviewDeck = {
  deckId: 'concept-01-memory-interview',
  headingUk: 'Перевір себе перед співбесідою',
  leadUk:
    'Сформулюйте відповідь своїми словами, потім розгорніть «Коротко» і «До гвинтиків». Позначки — лише в цьому браузері.',
  pitchUk:
    'Investigation після login_spec — це довгий run. State тримає «де ми зараз», memory — «що з минулого дозволено підказати», а context builder збирає prompt. Модель не є базою даних.',
  pitchEn:
    'After login_spec, investigation is a long run. State holds where we are; memory holds what we may reuse; the context builder assembles the prompt. The model is not a database.',
  questions: MEMORY_QUESTIONS,
  nextLinks: [
    { to: '/topic/concept-04/study', label: 'Agent Harness', hintUk: '— хто зберігає state у loop.' },
    { to: '/topic/concept-03/study', label: 'RAG', hintUk: '— зовнішні факти з індексу, не memory run.' },
  ],
};

const ORCHESTRATION_QUESTIONS: StudyInterviewQuestion[] = [
  q(
    'c02-q1',
    'Що робить orchestration у продукті з кількома агентами?',
    'Керує порядком кроків workflow: ready tasks, routing, retries, human gates — код, не LLM.',
    'Після nightly `login_spec` orchestrator може: дочекатися CI artifacts → запустити investigation agent → за результатом направити на fix, flake retry або escalation. Це не заміна harness всередині одного agent run.',
    'Думати, що LLM «сама знає порядок» між CI і Jira.',
  ),
  q(
    'c02-q2',
    'Чим orchestration відрізняється від harness?',
    'Harness — loop одного run (model + tools). Orchestration — граф між сервісами/агентами.',
    'Investigation harness виконує tool calls. Orchestrator вирішує, чи взагалі стартувати investigation і що робити після його висновку.',
    'Змішувати один tool loop з workflow між командами.',
  ),
  q(
    'c02-q3',
    'Що таке human gate в workflow?',
    'Крок blocked до явного approve людини — наприклад зміна prod config.',
    'Код ставить статус `needs_approval`; UI пише audit `approvedBy`. LLM може *запропонувати* дію, але не обходить gate.',
    'Покладатися на «не роби це» в system prompt без enforcement.',
  ),
  q(
    'c02-q4',
    'Який ризик duplicate event у bus?',
    'Два investigation run на один `ci_finished`.',
    'QA: той самий `eventId` двічі → один run (idempotent consumer). Trace: два `workflowId` — баг.',
    'Не тестувати idempotency подій.',
  ),
  q(
    'c02-q5',
    'Як QA перевіряє retry policy orchestrator?',
    'Flake CI → обмежена кількість rerun з backoff у trace.',
    'Умова: позначений flake. Дія: fail CI. Очікування: рівно N rerun, потім escalate. Не має бути нескінченного циклу.',
    'Плутати orchestrator retry з harness tool retry без лімітів.',
  ),
];

export const ORCHESTRATION_INTERVIEW_DECK: StudyInterviewDeck = {
  deckId: 'concept-02-orchestration-interview',
  headingUk: 'Перевір себе перед співбесідою',
  leadUk: 'Відповідайте вголос коротко, потім розгорніть деталі. Позначки — локально в браузері.',
  pitchUk:
    'Без диригента CI, investigation і coding agent можуть стартувати в хаосі. Orchestration — детермінований граф і політики переходів.',
  pitchEn:
    'Without a conductor, CI, investigation, and coding agents start in chaos. Orchestration is a deterministic graph and transition policies.',
  questions: ORCHESTRATION_QUESTIONS,
  nextLinks: [
    { to: '/topic/concept-16/study', label: 'Agentic Workflows', hintUk: '— складніші workflow.' },
    { to: '/topic/concept-04/study', label: 'Agent Harness', hintUk: '— виконання одного run.' },
  ],
};

const HARNESS_QUESTIONS: StudyInterviewQuestion[] = [
  q(
    'c04-q1',
    'Навіщо потрібен agent harness, якщо вже є API моделі?',
    'API дає змогу надіслати моделі запит і отримати відповідь. Harness додає код, який керує даними, інструментами, дозволами та завершенням розслідування.',
    'Після падіння login_spec код передає моделі повідомлення CI. Модель може запропонувати прочитати Playwright-звіт. Harness перевіряє доступ, викликає інструмент, записує результат або помилку й вирішує, чи потрібен ще один запит до моделі. Кожну дію можна відновити за trace.',
    'Приписувати одному виклику моделі читання файлу й керування циклом.',
  ),
  q(
    'c04-q2',
    'Де закінчується роль моделі в tool call?',
    'Модель повертає пропозицію інструмента та аргументи. Перевірку дозволу й саму дію виконує код.',
    'У відповіді моделі з’являється readPlaywrightReport. Код перевіряє, чи знає такий інструмент, чи правильні аргументи та чи доступний звіт цього запуску. Якщо перевірки пройдено, handler намагається прочитати файл. Він повертає дані або помилку. Якщо доступ заборонено, читання не починається.',
    'Вважати появу tool call у відповіді доказом виконаного читання.',
  ),
  q(
    'c04-q3',
    'Що таке stop condition?',
    'Це правило коду, яке визначає, коли розслідування потрібно завершити або зупинити.',
    'Harness може зупинити цикл після досягнення ліміту кроків, вичерпання часу або помилки, з якою продукт не продовжує роботу. Він також може показати підсумок після перевірки відповіді та доступних доказів. Якщо модель просто повернула текст без нового інструмента, це ще не гарантує правильного висновку.',
    'Сподіватися, що модель завжди сама вчасно завершить роботу.',
  ),
  q(
    'c04-q4',
    'Як перевірити harness окремо від якості моделі?',
    'Замінити модель підставними відповідями й перевірити, як код реагує на кожну з них.',
    'В одному тесті підставна модель пропонує дозволене читання звіту. В іншому — доступ до чужого звіту. Ще в одному — повторює ту саму дію до ліміту. QA перевіряє виклики handler, рішення policy, збережений результат і причину завершення. Якість тексту справжньої моделі оцінюють окремо на наборі випадків.',
    'Покладатися лише на перевірку зі справжньою моделлю, коли вона може щоразу відповісти інакше.',
  ),
  q(
    'c04-q5',
    'Що потрібно бачити в production?',
    'Події конкретного розслідування, частоту помилок, час роботи та версії коду й контрактів.',
    'За ідентифікатором розслідування QA знаходить запит моделі, її пропозицію, рішення policy, фактичний виклик інструмента та його результат. Метрики показують, чи зросли затримки, помилки читання й зупинки через ліміт. Версії допомагають зрозуміти, з яким контрактом інструмента працював конкретний запуск.',
    'Зберігати тільки фінальну відповідь, за якою неможливо встановити, чи інструмент справді працював.',
  ),
];

export const AGENT_HARNESS_INTERVIEW_DECK: StudyInterviewDeck = {
  deckId: 'concept-04-harness-interview',
  headingUk: 'Перевір себе перед співбесідою',
  leadUk:
    'Спробуйте відповісти вголос. Потім відкрийте пояснення та позначте, чи можете повторити відповідь своїми словами.',
  answerBriefLabelUk: 'Коротко',
  answerDeepLabelUk: 'До гвинтиків',
  pitchUk:
    'Agent harness — це код, який керує роботою моделі під час розслідування. Після падіння login_spec він передає моделі відомі факти. Якщо модель пропонує прочитати звіт, код перевіряє аргументи й дозвіл, а потім викликає інструмент. Отримані дані або помилку він записує й за потреби передає моделі для наступного кроку. Harness також зупиняє цикл за правилами продукту. QA окремо перевіряє поведінку цього коду та обґрунтованість висновку моделі.',
  pitchEn:
    'An agent harness is the application code that controls a model during an investigation. After login_spec fails, it sends the model the known facts. If the model proposes reading a report, the harness checks the arguments and permission before running the tool. It records the data or error, may pass it to the model for another turn, and stops the run according to application rules. QA tests the harness behavior and the model’s conclusions separately.',
  questions: HARNESS_QUESTIONS,
  nextLinks: [
    {
      to: '/topic/concept-10/study',
      label: 'Tool Calling — як модель пропонує інструмент і як код отримує результат',
      hintUk: '',
    },
    {
      to: '/topic/concept-17/study',
      label: 'Guardrails — як код перевіряє дозволи перед дією',
      hintUk: '',
    },
  ],
};

/** Decks для PART II (крім еталонів 03, 10, 17 — окремі файли). Доповнюється по пакетах rollout. */
export const PART_II_INTERVIEW_BY_TOPIC: Record<string, StudyInterviewDeck> = {
  'concept-01': MEMORY_STATE_INTERVIEW_DECK,
  'concept-02': ORCHESTRATION_INTERVIEW_DECK,
  'concept-04': AGENT_HARNESS_INTERVIEW_DECK,
};
