import type { StudyInterviewDeck } from './study-interview-types';
import {
  GR_CREATE_JIRA,
  GR_LOGIN_CONTEXT,
  GR_READ_REPORT,
} from './guardrails-teaching-thread';
import {
  GUARDRAILS_INTERVIEW_ANSWER_EN,
  GUARDRAILS_INTERVIEW_ANSWER_UK,
} from './guardrails-extra-sections';

export const GUARDRAILS_INTERVIEW_DECK: StudyInterviewDeck = {
  deckId: 'concept-17-guardrails-interview',
  headingUk: 'Перевір себе перед співбесідою',
  leadUk:
    'Відповідайте своїми словами, потім розгорніть підказку. Позначки зберігаються лише в цьому браузері.',
  pitchUk: GUARDRAILS_INTERVIEW_ANSWER_UK.replace(/\*\*/g, ''),
  pitchEn: GUARDRAILS_INTERVIEW_ANSWER_EN,
  questions: [
    {
      id: 'gr1',
      questionUk:
        'Що таке guardrails в агентній системі і чим вони відрізняються від правил лише в промпті?',
      answerUk: GUARDRAILS_INTERVIEW_ANSWER_UK,
      pitfallUk: 'Помилка: «ми написали в system prompt не чіпати prod» без коду policy.',
    },
    {
      id: 'gr2',
      questionUk: 'Що таке proposed action і хто приймає verdict allow / deny / needs_approval?',
      answerUk:
        'LLM повертає **пропозицію** (tool + args) — це ще не I/O. **Policy engine** (детермінований код) перевіряє actor, tool, resource і повертає allow, deny або needs_approval. Executor запускається **лише після allow** (і approval, якщо потрібно).',
      pitfallUk: 'Помилка: модель «вирішила», що можна писати в Jira.',
    },
    {
      id: 'gr3',
      questionUk: 'Наведіть навчальний приклад з createJiraIssue.',
      answerUk: `${GR_LOGIN_CONTEXT} Модель пропонує **${GR_CREATE_JIRA.toolName}** ${GR_CREATE_JIRA.argsExample}. ${GR_CREATE_JIRA.policyNote} У trace: propose → policy verdict → (approval) → executor або stop.`,
      pitfallUk: 'Помилка: створювати issue без запису policy decision у trace.',
    },
    {
      id: 'gr4',
      questionUk: 'Чим відрізняються input validator і output/schema validator?',
      answerUk:
        '**Input validator** санітизує вхід користувача й retrieved/RAG контент до моделі (ін’єкції, PII). **Output/schema validator** перевіряє structured відповідь моделі (tool_call JSON, формат) **до** policy і executor. Обидва — код, не LLM.',
      pitfallUk: 'Помилка: довіряти «модель сама відфільтрує» retrieved текст.',
    },
    {
      id: 'gr5',
      questionUk: 'Що таке tool permission matrix і sandbox?',
      answerUk:
        `**Matrix:** які tools і ресурси дозволені цьому actor/run. **Sandbox:** обмеження шляхів, URL, tenant — ${GR_READ_REPORT.sandboxNote} Навіть allow на read не означає довільний path.`,
      pitfallUk: 'Помилка: один глобальний allow на всі file tools.',
    },
    {
      id: 'gr6',
      questionUk: 'Що таке policy too permissive і indirect prompt injection?',
      answerUk:
        '**Too permissive:** правила дозволяють небезпечний write або broad resource. **Indirect injection:** інструкція в логах/RAG/звіті змушує модель запропонувати заборонену дію — policy має **fail closed**, не покладатися на «розуміння» моделі.',
      pitfallUk: 'Помилка: тестувати лише прямі prompt injection в chat.',
    },
    {
      id: 'gr7',
      questionUk: 'Навіщо human approval і що тестує QA на bypass?',
      answerUk:
        'Ризикові writes (Jira create, prod зміни) зупиняють run до **людини**. QA перевіряє: без approval немає executor span; після deny — немає side effect; спроби обійти UI approval або повторити write після retry.',
      pitfallUk: 'Помилка: auto-approve в staging «для швидкості» без тесту.',
    },
    {
      id: 'gr8',
      questionUk: 'Що логувати в observability для guardrails?',
      answerUk:
        '**policy decision**, rule id, actor, resource, tool, verdict; denied/approved actions; approval latency; correlation з runId/step. У курсі: createJiraIssue → jira-create-needs-approval; prod write → global-deny-prod-write.',
      pitfallUk: 'Помилка: лише «tool failed» без rule id.',
    },
    {
      id: 'gr9',
      questionUk: 'Як SDET тестує guardrails (мінімальна матриця)?',
      answerUk:
        'Сценарії з уроку: prompt injection, unauthorized resource, malformed args, privilege escalation, approval bypass, rate-limit abuse. Golden traces: очікуваний verdict на фіксований propose.',
      pitfallUk: 'Помилка: один happy-path read логів.',
    },
    {
      id: 'gr10',
      questionUk: 'Як guardrails пов’язані з tool calling і observability?',
      answerUk:
        '**Tool calling** — structured propose від LLM. **Guardrails** — validation + policy **між** propose і executor (concept-10 → 17). **Observability** (concept-18) — читати traces рішень policy і latency approval, не лише текст відповіді моделі.',
      pitfallUk: 'Помилка: observability без policy events.',
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
