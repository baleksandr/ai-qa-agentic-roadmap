import type { StudyInterviewDeck } from './study-interview-types';
import { SKILLS_INTERVIEW_QUESTIONS } from './skills-interview-questions';

export const SKILLS_INTERVIEW_DECK: StudyInterviewDeck = {
  deckId: 'concept-07-skills-interview',
  headingUk: 'Перевір себе перед співбесідою',
  leadUk:
    'Спершу сформулюйте відповідь своїми словами. Потім відкрийте коротку відповідь і пояснення на прикладі login_spec. Позначки прогресу зберігаються лише в цьому браузері.',
  answerBriefLabelUk: 'Коротко українською',
  answerDeepLabelUk: 'Розберімо до гвинтиків',
  answerBriefEnLabelUk: 'Short answer in English',
  answerDeepEnLabelUk: 'In more detail',
  pitchHeadingUk: 'Цільна відповідь (~30–45 с)',
  pitchUk:
    'Skill — це повторювана інструкція для певної задачі агента. Наприклад, після падіння login_spec вона може підказати спершу назвати симптом, потім сформувати гіпотези й перевірити звіт. Спосіб вибору skill залежить від системи. Якщо модель пропонує інструмент, код усе одно перевіряє його аргументи й доступ до артефакта. Як QA я перевіряю доречність інструкції, поведінку на випадках із даними та без них, сумісність з інструментами й редакцію skill для run.',
  pitchEn:
    'A skill packages reusable instructions for a specific agent task. After login_spec fails, it can guide the agent to state the symptom, form hypotheses, and check the report. How a skill is selected depends on the system. Code still validates proposed tool calls and access to artifacts. As QA, I test skill selection, behavior with and without evidence, tool compatibility, and the skill revision used in each run.',
  questions: SKILLS_INTERVIEW_QUESTIONS,
  nextLinkCtaUk: 'Що вивчити далі',
  nextLinks: [
    {
      to: '/topic/concept-04/study',
      label: 'Agent Harness',
      hintUk: '— як застосунок керує викликами моделі, інструментами та завершенням run',
    },
  ],
};
