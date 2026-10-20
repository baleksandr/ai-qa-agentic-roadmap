import type { StudyInterviewDeck } from './study-interview-types';
import { MULTI_AGENT_INTERVIEW_QUESTIONS } from './multi-agent-interview-questions';

export const MULTI_AGENT_INTERVIEW_DECK: StudyInterviewDeck = {
  deckId: 'concept-09-multi-agent-interview',
  headingUk: 'Перевір себе перед співбесідою',
  leadUk:
      'Спершу сформулюйте відповідь своїми словами. Потім відкрийте коротку та розгорнуту відповіді українською й англійською. Позначки зберігаються лише в цьому браузері.',
  answerBriefLabelUk: 'Коротка відповідь',
  answerDeepLabelUk: 'Розгорнута відповідь',
  answerBriefEnLabelUk: 'Short answer in English',
  answerDeepEnLabelUk: 'In more detail in English',
  pitchHeadingUk: 'Цільна відповідь (~30–45 с)',
  pitchUk:
    'Multi-agent system розподіляє роботу між агентами, коли окремі ролі справді допомагають. У прикладі з login_spec один агент збирає докази, інший за потреби готує зміну, а третій її перевіряє. Код вирішує, кому передати задачу й які інструменти дозволити. Для QA важливо перевірити сам handoff: чи збережено джерела, чи гіпотеза не стала фактом і чи зміни різних виконавців не конфліктують.',
  pitchEn:
    'A multi-agent system splits work when separate roles are useful. In the login_spec example, one agent collects evidence, another may prepare a code change, and a third reviews it. Workflow code controls task routing and tool access. As QA, I check the handoff itself: whether sources are preserved, hypotheses remain unverified until supported, and concurrent changes do not conflict.',
  questions: MULTI_AGENT_INTERVIEW_QUESTIONS,
  nextLinks: [
    {
      to: '/topic/concept-02/study',
      label: 'Orchestration',
      hintUk: '— порядок',
    },
  ],
};
