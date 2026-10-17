import type { StudyInterviewDeck } from './study-interview-types';
import { TOOL_CALLING_INTERVIEW_QUESTIONS } from './tool-calling-interview-questions';

export const TOOL_CALLING_INTERVIEW_DECK: StudyInterviewDeck = {
  deckId: 'concept-10-tool-calling-interview',
  headingUk: 'Перевір себе перед співбесідою',
  leadUk:
    'Сформулюйте відповідь своїми словами, потім натисніть «Показати відповідь». Спочатку прочитайте блок «Коротко для співбесіди», потім «Розберімо до гвинтиків». Позначки зберігаються лише в цьому браузері.',
  pitchUk:
    'Після падіння login_spec агент не «відкриває звіт силою думки». Модель може запропонувати виклик readPlaywrightReport з аргументами, а harness перевіряє tool, шлях і права; лише потім handler читає файл і повертає уривок у контекст. Окремо для write-дій на кшталт createJiraIssue потрібні approve і захист від дубля при retry. Як QA я дивлюся trace: пропозиція → allow/deny → результат, а не лише гарний текст відповіді.',
  pitchEn:
    'After login_spec fails, the agent does not open the report by imagination. The model may propose readPlaywrightReport with arguments; the harness validates the tool, path, and permissions; only then does the handler read the file and return a snippet to context. For writes like createJiraIssue we need approval and deduplication on retries. As QA I inspect the trace—proposal, allow/deny, result—not just polished wording.',
  questions: TOOL_CALLING_INTERVIEW_QUESTIONS,
  nextLinks: [
    {
      to: '/topic/concept-04/study',
      label: 'Agent Harness',
      hintUk: '— де збирають allow-list tools, messages і цикл run.',
    },
    {
      to: '/topic/concept-17/study',
      label: 'Guardrails',
      hintUk: '— allow / deny / approve перед executor.',
    },
    {
      to: '/agent-architecture?tab=tool-calling',
      label: 'Атлас Tool Calling',
      hintUk: '— покрокова схема з панелями.',
    },
  ],
};
