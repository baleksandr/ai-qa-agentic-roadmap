import type { StudyInterviewDeck } from './study-interview-types';
import { TOOL_CALLING_INTERVIEW_QUESTIONS } from './tool-calling-interview-questions';

export const TOOL_CALLING_INTERVIEW_DECK: StudyInterviewDeck = {
  deckId: 'concept-10-tool-calling-interview',
  headingUk: 'Перевір себе перед співбесідою',
  leadUk:
    'Сформулюйте відповідь своїми словами, потім натисніть «Показати відповідь». Спочатку «Коротко», потім приклад. Позначки зберігаються лише в цьому браузері.',
  answerBriefLabelUk: 'Коротко',
  answerDeepLabelUk: 'На прикладі login_spec',
  pitchUk:
    'Tool Calling дає моделі змогу запропонувати інструмент, але не виконати його самій. Після збою login_spec модель може попросити прочитати звіт Playwright. Код перевіряє назву інструмента, аргументи та доступ до звіту. Лише після дозволу handler намагається прочитати файл і повертає дані або помилку. Якщо код викликає модель ще раз, він передає їй фактично отриманий результат. Як QA я окремо перевіряю пропозицію, дозвіл, виконання та відповідність висновку доказам.',
  pitchEn:
    'Tool calling lets the model propose an action, while the application controls whether it runs. After login_spec fails, the model may propose reading the Playwright report. The application checks the tool name, arguments, and access to that report. Only then does the handler attempt the read and return data or an error. If the model is called again, it receives the actual result. As QA, I check the proposal, permission decision, execution, and whether the conclusion matches the evidence.',
  questions: TOOL_CALLING_INTERVIEW_QUESTIONS,
  nextLinkCtaUk: 'Перейти до теми ↗',
  nextLinks: [
    {
      to: '/topic/concept-04/study',
      label: 'Agent Harness',
      hintUk: 'Де збирають allow-list tools, messages і цикл run.',
    },
    {
      to: '/topic/concept-17/study',
      label: 'Guardrails',
      hintUk: 'Allow, deny і approve перед executor.',
    },
    {
      to: '/agent-architecture?tab=tool-calling',
      label: 'Атлас Tool Calling',
      hintUk: 'Покрокова схема з панелями.',
    },
  ],
};
