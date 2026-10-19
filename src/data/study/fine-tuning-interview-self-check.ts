import type { StudyInterviewDeck } from './study-interview-types';
import { FINE_TUNING_INTERVIEW_QUESTIONS } from './fine-tuning-interview-questions';

export const FINE_TUNING_INTERVIEW_DECK: StudyInterviewDeck = {
  deckId: 'concept-13-fine-tuning-interview',
  headingUk: 'Перевір себе перед співбесідою',
  leadUk:
    'Спочатку дай відповідь своїми словами. Потім розгорни коротку відповідь і пояснення на прикладі login_spec. Позначки прогресу зберігаються лише в цьому браузері.',
  answerBriefLabelUk: 'Коротко українською',
  answerDeepLabelUk: 'Розберімо до гвинтиків',
  answerBriefEnLabelUk: 'Short answer in English',
  answerDeepEnLabelUk: 'In more detail',
  pitchHeadingUk: 'Цільна відповідь (~30–45 с)',
  pitchUk:
    'Fine-tuning допомагає навчити модель повторюваної поведінки, наприклад відокремлювати факт про падіння login_spec від гіпотез і наступних перевірок. Але він не відкриває поточний Playwright-звіт і не замінює пошук у postmortem. Застосунок окремо передає доступні факти та контролює виклики інструментів. Як QA я порівнюю нову версію з початковою на незалежних випадках, перевіряю регресії та дивлюся, яку версію використав кожен run.',
  pitchEn:
    'Fine-tuning can teach a model a recurring behavior, such as separating the login_spec failure symptom from hypotheses and follow-up checks. It does not read the current Playwright report or replace retrieval from postmortems. The application supplies available facts and controls tool execution. As QA, I compare the candidate with the baseline on held-out cases, check for regressions, and track which model version handled each run.',
  questions: FINE_TUNING_INTERVIEW_QUESTIONS,
  nextLinkCtaUk: 'Перейти до теми ↗',
  nextLinks: [
    {
      to: '/topic/concept-03/study',
      label: 'RAG',
      hintUk: '— як застосунок знаходить і передає моделі доречні фрагменти документів',
    },
  ],
};
