import type { StudyInterviewDeck } from './study-interview-types';
import { MCP_INTERVIEW_QUESTIONS } from './mcp-interview-questions';

export const MCP_INTERVIEW_DECK: StudyInterviewDeck = {
  deckId: 'concept-06-mcp-interview',
  headingUk: 'Перевір себе перед співбесідою',
  leadUk:
    'Сформулюйте відповідь своїми словами, потім натисніть «Показати відповідь». У відповіді — чотири окремі блоки українською та англійською, потім типова помилка. Позначки зберігаються лише в цьому браузері.',
  answerBriefLabelUk: 'Коротко українською',
  answerDeepLabelUk: 'Докладніше українською',
  answerBriefEnLabelUk: 'Short answer in English',
  answerDeepEnLabelUk: 'Detailed answer in English',
  pitchHeadingUk: 'Цільна відповідь для співбесіди, приблизно 30–45 секунд',
  pitchUk:
    'MCP задає спосіб взаємодії застосунку агента з серверами, які надають інструменти й дані. Після падіння login_spec умовний CI-сервер може надати інструмент читання артефакта. Модель лише пропонує виклик. Код застосунку перевіряє аргументи та доступ, MCP client передає дозволений запит, а сервер повертає дані або помилку. Як QA я відділяю в trace пропозицію від виконання й перевіряю, що чужий артефакт не прочитали, а помилку не видали за результат.',
  pitchEn:
    'MCP defines how an agent application interacts with servers that expose tools and data. After a login_spec failure, a CI server may provide a tool for retrieving an artifact. The model only proposes a call. The application checks its arguments and access rules, an MCP client sends an allowed request, and the server returns data or an error. As QA, I distinguish proposals from execution and verify that unauthorized artifacts are not read and errors are not presented as retrieved data.',
  questions: MCP_INTERVIEW_QUESTIONS,
  nextLinkCtaUk: 'Перейти до теми ↗',
  nextLinks: [
    {
      to: '/topic/concept-10/study',
      label: 'Tool Calling',
      hintUk: '— чим пропозиція моделі відрізняється від виконання інструмента',
    },
    {
      to: '/topic/concept-04/study',
      label: 'Agent Harness',
      hintUk: '— як код перевіряє дії та керує перебігом run',
    },
  ],
};
