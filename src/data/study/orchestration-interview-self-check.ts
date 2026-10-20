import type { StudyInterviewDeck } from './study-interview-types';
import { ORCHESTRATION_INTERVIEW_QUESTIONS } from './orchestration-interview-questions';

export const ORCHESTRATION_INTERVIEW_DECK: StudyInterviewDeck = {
  deckId: 'concept-02-orchestration-interview',
  headingUk: 'Перевір себе перед співбесідою',
  leadUk:
    'Скажіть відповідь вголос одним-двома реченнями. Потім розгорніть коротке пояснення й приклад. Позначки зберігаються лише в цьому браузері.',
  answerBriefLabelUk: 'Коротко українською',
  answerDeepLabelUk: 'Розберімо до гвинтиків',
  answerBriefEnLabelUk: 'Short answer in English',
  answerDeepEnLabelUk: 'In more detail',
  pitchHeadingUk: 'Цільна відповідь (~30–45 с)',
  pitchUk:
    'Orchestration координує задачі всього workflow: чекає потрібних результатів CI, передає готову роботу агентам і визначає наступний маршрут після фактичного результату. Для ABC-123 investigation не має читати звіт до його появи, а review має стосуватися конкретної версії зміни. Усередині investigation окремий harness керує моделлю та інструментами. Код контролює дозволи, повтори й точки схвалення. Як QA я перевіряю порядок подій, ізоляцію workflow, повторну доставку та причини переходів у trace.',
  pitchEn:
    'Orchestration coordinates the wider workflow: it waits for required CI results, dispatches ready work to agents, and chooses the next route after actual outcomes. For ABC-123, investigation must not treat an unpublished report as available, and review must target a specific revision. Within investigation, a harness manages the model and tools. Code enforces permissions, retry limits, and approval gates. As QA, I check event order, workflow isolation, duplicate delivery, and transition reasons in the trace.',
  questions: ORCHESTRATION_INTERVIEW_QUESTIONS,
  nextLinkCtaUk: 'Що вивчити далі',
  nextLinks: [
    {
      to: '/topic/concept-16/study',
      label: 'Agentic Workflows',
      hintUk: '— як будувати складніші маршрути задач',
    },
    {
      to: '/topic/concept-04/study',
      label: 'Agent Harness',
      hintUk: '— як код керує одним агентним run',
    },
  ],
};
