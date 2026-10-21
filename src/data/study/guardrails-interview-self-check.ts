import type { StudyInterviewDeck } from './study-interview-types';
import { GR_CREATE_JIRA, GR_LOGIN_CONTEXT } from './guardrails-teaching-thread';

const PITCH_UK =
  'Guardrails — це детерміновані обмеження навколо моделі в агентній системі. Промпт може порадити не чіпати production, але без коду це лише текст. Trusted application перевіряє вхід, схему виклику, policy на proposed action, sandbox і за потреби human approval. Executor не повинен виконувати заборонену дію, а для needs_approval — лише після належного погодження. Observability з rule id, actor і resource допомагає перевірити, що рішення справді спрацювало, і розслідувати інциденти.';

const PITCH_EN =
  'Guardrails are deterministic controls around the model in an agentic system. A prompt can say “don’t touch production,” but without code that is just text. Trusted application code validates input and the tool-call shape, runs policy on the proposed action, enforces sandbox limits, and uses human approval when required. The executor must not run a denied action, and for needs_approval it should run only after proper approval and any re-checks the system defines. Observability with rule id, actor, and resource helps verify decisions and investigate incidents.';

export const GUARDRAILS_INTERVIEW_DECK: StudyInterviewDeck = {
  deckId: 'concept-17-guardrails-interview',
  headingUk: 'Перевір себе перед співбесідою',
  leadUk:
    'Відповідайте своїми словами, потім розгорніть підказку. Позначки зберігаються лише в цьому браузері.',
  pitchUk: PITCH_UK,
  pitchEn: PITCH_EN,
  questions: [
    {
      id: 'gr1',
      questionUk:
        'Що таке guardrails в агентній системі і чим вони відрізняються від правил лише в промпті?',
      answerBriefUk:
        'Guardrails — обмеження, які забезпечує **надійний код** застосунку: validation, policy, sandbox і approval. Модель може лише **запропонувати** дію. Правила в промпті не зупиняють executor і не дають аудиту рішення.',
      answerBriefEn:
        'Guardrails are limits enforced by trusted application code: validation, policy, sandboxing, and approval. The model can only propose an action. Prompt-only rules do not stop the executor and do not give you an auditable policy decision.',
      pitfallUk: 'Вважати, що system prompt «не чіпати prod» замінює policy engine.',
    },
    {
      id: 'gr2',
      questionUk: 'Що таке proposed action і хто приймає verdict allow / deny / needs_approval?',
      answerBriefUk:
        '**Proposed action** — структурована пропозиція моделі викликати інструмент з аргументами, ще без side effect. **Policy engine** (код) повертає allow, deny або needs_approval за правилами для actor, tool і resource. Executor запускається лише після allow і потрібного approval, а при deny виконання не повинно відбутися.',
      answerBriefEn:
        'A proposed action is the model’s structured tool call with arguments—no side effect yet. The policy engine (code) returns allow, deny, or needs_approval based on rules for the actor, tool, and resource. The executor runs only after allow and any required approval; on deny, execution should not happen.',
      pitfallUk: 'Думати, що модель «дозволила» write в Jira, а не policy.',
    },
    {
      id: 'gr3',
      questionUk: 'Наведіть навчальний приклад з createJiraIssue.',
      answerBriefUk:
        `${GR_LOGIN_CONTEXT} Модель пропонує **${GR_CREATE_JIRA.toolName}** ${GR_CREATE_JIRA.argsExample}. ${GR_CREATE_JIRA.policyNote} У trace спочатку propose і policy verdict, потім approval за потреби, і лише тоді executor або зупинка без side effect.`,
      answerBriefEn:
        `In the course scenario the agent investigates a failing login test. The model proposes ${GR_CREATE_JIRA.toolName} with project QA and issue fields. Policy may return needs_approval for that write. The trace should show proposal and policy verdict first, then approval if required, and only then executor—or a stop with no Jira side effect.`,
      pitfallUk: 'Стверджувати, що issue створено, бачачи лише allow без результату API.',
    },
    {
      id: 'gr4',
      questionUk: 'Чим відрізняються input validator і output/schema validator?',
      answerBriefUk:
        '**Input validator** обробляє вхід користувача і недовірений retrieved контент до моделі. **Output/schema validator** перевіряє структуру відповіді моделі, зокрема tool_call JSON, **до** policy і executor. Authorization і sandbox вирішують інші задачі — дозвіл на ресурс і межі виконання.',
      answerBriefEn:
        'An input validator handles user input and untrusted retrieved content before it reaches the model. An output/schema validator checks the model’s structured response, including tool-call JSON, before policy and the executor. Authorization and sandbox address different concerns: permission on a resource and execution boundaries.',
      pitfallUk: 'Плутати «JSON валідний» з «дія дозволена policy».',
    },
    {
      id: 'gr5',
      questionUk: 'Що таке tool permission matrix і sandbox?',
      answerBriefUk:
        '**Permission matrix** задає, які tools і ресурси дозволені конкретному actor або run. **Sandbox** обмежує середовище виконання: шляхи, host, обліковки. Навіть при allow на read звіт з `./playwright-report/` executor не повинен читати довільний path поза volume.',
      answerBriefEn:
        'A permission matrix defines which tools and resources are allowed for a given actor or run. A sandbox limits the execution environment: paths, hosts, credentials. Even with allow to read a Playwright report, the executor should not read arbitrary paths outside the allowed volume.',
      pitfallUk: 'Один глобальний allow на всі file tools для всіх агентів.',
    },
    {
      id: 'gr6',
      questionUk: 'Що таке policy too permissive і indirect prompt injection?',
      answerBriefUk:
        '**Too permissive** — правила дозволяють небезпечний write або занадто широкий resource. **Indirect injection** — інструкція в звіті, логах або RAG змушує модель запропонувати заборонену дію. Policy і validation мають блокувати виконання, а для ризикових операцій при недоступній перевірці часто обирають fail closed, залежно від ризику системи.',
      answerBriefEn:
        'Too permissive policy allows a risky write or an overly broad resource. Indirect injection hides instructions in a report, logs, or RAG that push the model to propose a forbidden action. Policy and validation must block execution; for high-risk operations when checks are unavailable, many teams choose fail closed, depending on system risk.',
      pitfallUk: 'Тестувати лише прямі injection у chat, ігноруючи вміст артефактів.',
    },
    {
      id: 'gr7',
      questionUk: 'Навіщо human approval і що тестує QA на bypass?',
      answerBriefUk:
        'Approval зупиняє ризиковий write до рішення людини. Погодження має бути прив’язане до конкретного run, proposal і аргументів, а не бути універсальним токеном. QA перевіряє: без approval немає executor, після deny немає side effect, спроби обійти UI або повторити write після retry не проходять.',
      answerBriefEn:
        'Approval pauses a risky write until a human decides. Approval must bind to a specific run, proposal, and arguments—not a universal token. QA checks that without approval there is no executor, after deny there is no side effect, and attempts to bypass the UI or repeat a write after retry fail.',
      pitfallUk: 'Auto-approve в staging без тесту bypass між паралельними run.',
    },
    {
      id: 'gr8',
      questionUk: 'Що логувати в observability для guardrails?',
      answerBriefUk:
        'Фіксуйте **policy decision**, rule id, actor, resource, tool і verdict, події deny і approval, latency погодження, correlation з runId. У навчальному прикладі createJiraIssue пов’язаний з needs_approval, а prod write — з deny. Без цих полів не відповісти «чому deny» і «хто схвалив».',
      answerBriefEn:
        'Log policy decision, rule id, actor, resource, tool, and verdict, plus deny and approval events, approval latency, and correlation with runId. In the course example, createJiraIssue ties to needs_approval and prod writes to deny. Without these fields you cannot explain why something was denied or who approved it.',
      pitfallUk: 'Логувати лише «tool failed» без rule id і verdict.',
    },
    {
      id: 'gr9',
      questionUk: 'Як SDET тестує guardrails (мінімальна матриця)?',
      answerBriefUk:
        'Покрийте injection, unauthorized resource, malformed args, privilege escalation, approval bypass і rate-limit abuse. Для кожного сценарію зафіксуйте propose, очікуваний verdict і доказ у trace: немає executor після deny, немає side effect після відмови. Golden traces з фіксованим propose прискорюють регресію policy.',
      answerBriefEn:
        'Cover injection, unauthorized resources, malformed arguments, privilege escalation, approval bypass, and rate-limit abuse. For each case, record the proposal, expected verdict, and trace proof: no executor after deny, no side effect after rejection. Golden traces with a fixed proposal help regression-test policy.',
      pitfallUk: 'Один happy-path read звіту без негативних сценаріїв policy.',
    },
    {
      id: 'gr10',
      questionUk: 'Як guardrails пов’язані з tool calling і observability?',
      answerBriefUk:
        '**Tool calling** дає structured propose від LLM. **Guardrails** ставлять validation і policy **між** propose і executor. **Observability** дозволяє читати ці рішення в trace і метриках, а не лише фінальний текст моделі. Без policy events observability не доводить, що заборона спрацювала.',
      answerBriefEn:
        'Tool calling produces a structured proposal from the LLM. Guardrails add validation and policy between that proposal and the executor. Observability lets you read those decisions in traces and metrics, not just the model’s final text. Without policy events, observability cannot prove a block actually worked.',
      pitfallUk: 'Дивитися лише на відповідь користувачу, без policy spans.',
    },
  ],
  nextLinks: [
    {
      to: '/topic/concept-10/study',
      label: 'Tool Calling',
      hintUk: ' — propose tool_call до policy boundary.',
    },
    {
      to: '/topic/concept-18/study',
      label: 'Observability',
      hintUk: ' — traces policy decision і approval.',
    },
    {
      to: '/agent-architecture?tab=guardrails',
      label: 'Атлас Guardrails',
      hintUk: ' — policy flow на карті архітектури.',
    },
  ],
};
