import type { StudyInterviewDeck } from './study-interview-types';
import { PLANNING_INTERVIEW_QUESTIONS } from './planning-interview-questions';

export const PLANNING_INTERVIEW_DECK: StudyInterviewDeck = {
  deckId: 'concept-11-planning-interview',
  headingUk: 'Перевір себе перед співбесідою',
  leadUk:
    'Спочатку сформулюйте відповідь своїми словами. Потім відкрийте коротку відповідь і докладне пояснення на прикладі login_spec. Позначки прогресу зберігаються лише в цьому браузері.',
  answerBriefLabelUk: 'Коротко українською',
  answerDeepLabelUk: 'Розберімо до гвинтиків',
  answerBriefEnLabelUk: 'Short answer in English',
  answerDeepEnLabelUk: 'In more detail',
  pitchHeadingUk: 'Цільна відповідь (~30–45 с)',
  pitchUk:
    'Planning допомагає агенту визначити, які докази перевірити після падіння login_spec. Повідомлення CI вже дає симптом — timeout на #login-btn, але не причину. Модель може запропонувати план і виклик звіту. Код перевіряє форму плану та окремо контролює кожну дію. Після фактичного результату агент уточнює кроки або завершує run. Як QA я зіставляю план із trace, перевіряю відмови в доступі, реакцію на помилки й зупинку повторів.',
  pitchEn:
    'Planning helps an agent choose which evidence to check after login_spec fails. CI gives us the symptom — a timeout on #login-btn — but not the cause. The model may propose a plan and a report read. Code validates the plan and separately controls each action. After an actual result, the agent updates its next steps or stops. As QA, I compare the plan with the trace and test access denials, read errors, and repeated planning.',
  questions: PLANNING_INTERVIEW_QUESTIONS,
  nextLinkCtaUk: 'Що вивчити далі',
  nextLinks: [
    {
      to: '/topic/concept-12/study',
      label: 'Reasoning',
      hintUk: '— як агент зіставляє гіпотези з фактично отриманими даними',
    },
  ],
};
