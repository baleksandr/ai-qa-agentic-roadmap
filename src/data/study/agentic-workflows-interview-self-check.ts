import type { StudyInterviewDeck } from './study-interview-types';
import { AGENTIC_WORKFLOWS_INTERVIEW_QUESTIONS } from './agentic-workflows-interview-questions';

export const AGENTIC_WORKFLOWS_INTERVIEW_DECK: StudyInterviewDeck = {
  deckId: 'concept-16-agentic-workflows-interview',
  headingUk: 'Перевір себе перед співбесідою',
  leadUk:
    'Спершу сформулюйте відповідь своїми словами. Потім відкрийте коротку відповідь і пояснення на прикладі ABC-123. Позначки зберігаються лише в цьому браузері.',
  answerBriefLabelUk: 'Коротко українською',
  answerDeepLabelUk: 'Розберімо до гвинтиків',
  answerBriefEnLabelUk: 'Short answer in English',
  answerDeepEnLabelUk: 'In more detail',
  pitchHeadingUk: 'Цільна відповідь (~30–45 с)',
  pitchUk:
    'Agentic workflow пов’язує кілька задач в одному продуктовому сценарії. Після падіння login_spec перший агент може зібрати факти та передати другому структурований або інший погоджений результат із посиланнями на докази. Другий агент готує зміну лише за потрібної підстави, а CI перевіряє конкретну revision. Оркестрація керує готовністю задач і переходами між ними. Як QA я перевіряю контракт передачі, прив’язку до правильного run, умови запуску наступного етапу та фактичний результат CI.',
  pitchEn:
    'An agentic workflow connects tasks within a product scenario. After login_spec fails, one agent may gather evidence and hand the next agent a result with source references. The second agent proposes a change only when the evidence supports it, and CI checks a specific revision. Orchestration manages task readiness and transitions. As QA, I test the handoff contract, run identity, conditions for the next task, and the actual CI result.',
  questions: AGENTIC_WORKFLOWS_INTERVIEW_QUESTIONS,
  nextLinks: [
    {
      to: '/topic/concept-02/study',
      label: 'Orchestration',
      hintUk: '— як продукт запускає готові задачі й керує переходами між ними.',
    },
  ],
};
