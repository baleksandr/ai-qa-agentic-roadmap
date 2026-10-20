import type { StudyInterviewDeck } from './study-interview-types';
import { A2A_INTERVIEW_QUESTIONS } from './a2a-interview-questions';

export const A2A_INTERVIEW_DECK: StudyInterviewDeck = {
  deckId: 'concept-08-a2a-interview',
  headingUk: 'Перевір себе перед співбесідою',
  leadUk:
    'Спершу сформулюйте відповідь своїми словами. Потім відкрийте коротку та розгорнуту відповіді українською й англійською. Позначки зберігаються лише в цьому браузері.',
  answerBriefLabelUk: 'Коротка відповідь',
  answerDeepLabelUk: 'Розгорнута відповідь',
  answerBriefEnLabelUk: 'Short answer in English',
  answerDeepEnLabelUk: 'In more detail in English',
  pitchHeadingUk: 'Цільна відповідь (~30–45 с)',
  pitchUk:
    'A2A описує обмін між застосунками агентів: надіслати задачу, отримати стан і результат. У прикладі ABC-123 QA-сервіс передає dev-сервісу відомі факти про login_spec, а не вільний чат між моделями. Message, Task і результат задають контракт обміну; транспорт може бути HTTP з JSON. Моделі працюють всередині кожного сервісу, а код перевіряє автентифікацію, доступ до доказів і те, що «прийнято» не плутають із готовим patch. Як QA я перевіряю відмови зв’язку, повтори після timeout і те, що чужі артефакти не потрапляють у задачу.',
  pitchEn:
    'A2A defines how agent applications delegate work and return status and results. In ABC-123 the QA service sends structured facts about login_spec to the dev service—not free-form chat between models. Messages, tasks, and artifacts form the exchange contract; transport may be HTTP with JSON. Models run inside each service while code enforces authentication, evidence access, and the difference between “accepted” and a finished patch. As QA I test connectivity failures, retries after timeout, and that foreign artifacts never enter the task.',
  questions: A2A_INTERVIEW_QUESTIONS,
  nextLinks: [
    {
      to: '/topic/concept-17/study',
      label: 'Guardrails',
      hintUk: '— політики та обмеження після міжсервісного обміну.',
    },
  ],
};
