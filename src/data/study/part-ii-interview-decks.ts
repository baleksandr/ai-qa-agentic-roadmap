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
    'Навіщо agent harness, якщо вже є LLM API?',
    'Щоб зібрати context, loop tool calls, policy, state, stop rules і trace — реальна система, не чат.',
    'Після `login_spec` harness: `createRun` → `buildContext` → `model.complete` → parse `tool_call` → validate → handler → оновити state → repeat до stop.',
    'Вважати один виклик API повноцінним агентом.',
  ),
  q(
    'c04-q2',
    'Де закінчується роль LLM у tool call?',
    'На structured пропозиції (ім’я tool + args). I/O виконує handler після policy.',
    'Модель повертає `readPlaywrightReport`; harness перевіряє registry і path; handler читає файл. Диск — не в моделі.',
    'Довіряти args без schema validation.',
  ),
  q(
    'c04-q3',
    'Що таке stop condition?',
    'Max steps, timeout, фінальна text-відповідь без tool — правила коду.',
    'Infinite loop: mock LLM завжди tool_call → harness зупиняє з `max_steps` у trace. QA перевіряє без «розумної» моделі.',
    'Надіятися, що модель «сама зупиниться».',
  ),
  q(
    'c04-q4',
    'Як тестувати harness окремо від якості LLM?',
    'Mock model API: фіксовані tool_call / text; assert policy і state.',
    'Рівні: handler unit, harness integration з mock LLM, evals LLM окремо. Trace має spans `model` і `tool` з correlation id.',
    'E2E лише з live LLM без контролю варіантів.',
  ),
  q(
    'c04-q5',
    'Що логувати в production для harness?',
    'Latency per turn, tool errors, % run на max steps, версія tool schemas.',
    'Деградація: spike tool timeouts → alert. Deploy schemas разом із harness для сумісності.',
    'Логувати лише фінальну відповідь користувачу.',
  ),
];

export const AGENT_HARNESS_INTERVIEW_DECK: StudyInterviewDeck = {
  deckId: 'concept-04-harness-interview',
  headingUk: 'Перевір себе перед співбесідою',
  leadUk: 'Коротко вголос → розгорніть підказки. Позначки — у цьому браузері.',
  pitchUk:
    'Harness перетворює LLM на агента: loop, tools, policy, tracing. Investigation після login_spec неможливий без цього шару.',
  pitchEn:
    'The harness turns an LLM into an agent: loop, tools, policy, tracing. Investigation after login_spec is impossible without this layer.',
  questions: HARNESS_QUESTIONS,
  nextLinks: [
    { to: '/topic/concept-10/study', label: 'Tool Calling', hintUk: '— формат tool_call.' },
    { to: '/topic/concept-17/study', label: 'Guardrails', hintUk: '— policy перед executor.' },
  ],
};

/** Decks для PART II (крім еталонів 03, 10, 17 — окремі файли). Доповнюється по пакетах rollout. */
export const PART_II_INTERVIEW_BY_TOPIC: Record<string, StudyInterviewDeck> = {
  'concept-01': MEMORY_STATE_INTERVIEW_DECK,
  'concept-02': ORCHESTRATION_INTERVIEW_DECK,
  'concept-04': AGENT_HARNESS_INTERVIEW_DECK,
};
