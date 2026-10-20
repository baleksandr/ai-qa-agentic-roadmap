import type { StudyInterviewDeck, StudyInterviewQuestion } from './study-interview-types';

export function makeStudyInterviewDeck(
  deckId: string,
  pitchUk: string,
  pitchEn: string,
  questions: StudyInterviewQuestion[],
  nextLinks: StudyInterviewDeck['nextLinks'],
): StudyInterviewDeck {
  return {
    deckId,
    headingUk: 'Перевір себе перед співбесідою',
    leadUk:
      'Сформулюйте відповідь своїми словами, потім розгорніть «Коротко» і «До гвинтиків». Позначки — лише в цьому браузері.',
    pitchUk,
    pitchEn,
    questions,
    nextLinks,
  };
}

export function q(
  id: string,
  questionUk: string,
  brief: string,
  deep: string,
  pitfall: string,
): StudyInterviewQuestion {
  return {
    id,
    questionUk,
    answerBriefUk: brief,
    answerDeepUk: deep,
    pitfallUk: pitfall,
  };
}

import { ORCHESTRATION_INTERVIEW_DECK } from './orchestration-interview-self-check';

const HARNESS_QUESTIONS: StudyInterviewQuestion[] = [
  q(
    'c04-q1',
    'Навіщо потрібен agent harness, якщо вже є API моделі?',
    'API дає змогу надіслати моделі запит і отримати відповідь. Harness додає код, який керує даними, інструментами, дозволами та завершенням розслідування.',
    'Після падіння login_spec код передає моделі повідомлення CI. Модель може запропонувати прочитати Playwright-звіт. Harness перевіряє доступ, викликає інструмент, записує результат або помилку й вирішує, чи потрібен ще один запит до моделі. Кожну дію можна відновити за trace.',
    'Приписувати одному виклику моделі читання файлу й керування циклом.',
  ),
  q(
    'c04-q2',
    'Де закінчується роль моделі в tool call?',
    'Модель повертає пропозицію інструмента та аргументи. Перевірку дозволу й саму дію виконує код.',
    'У відповіді моделі з’являється readPlaywrightReport. Код перевіряє, чи знає такий інструмент, чи правильні аргументи та чи доступний звіт цього запуску. Якщо перевірки пройдено, handler намагається прочитати файл. Він повертає дані або помилку. Якщо доступ заборонено, читання не починається.',
    'Вважати появу tool call у відповіді доказом виконаного читання.',
  ),
  q(
    'c04-q3',
    'Що таке stop condition?',
    'Це правило коду, яке визначає, коли розслідування потрібно завершити або зупинити.',
    'Harness може зупинити цикл після досягнення ліміту кроків, вичерпання часу або помилки, з якою продукт не продовжує роботу. Він також може показати підсумок після перевірки відповіді та доступних доказів. Якщо модель просто повернула текст без нового інструмента, це ще не гарантує правильного висновку.',
    'Сподіватися, що модель завжди сама вчасно завершить роботу.',
  ),
  q(
    'c04-q4',
    'Як перевірити harness окремо від якості моделі?',
    'Замінити модель підставними відповідями й перевірити, як код реагує на кожну з них.',
    'В одному тесті підставна модель пропонує дозволене читання звіту. В іншому — доступ до чужого звіту. Ще в одному — повторює ту саму дію до ліміту. QA перевіряє виклики handler, рішення policy, збережений результат і причину завершення. Якість тексту справжньої моделі оцінюють окремо на наборі випадків.',
    'Покладатися лише на перевірку зі справжньою моделлю, коли вона може щоразу відповісти інакше.',
  ),
  q(
    'c04-q5',
    'Що потрібно бачити в production?',
    'Події конкретного розслідування, частоту помилок, час роботи та версії коду й контрактів.',
    'За ідентифікатором розслідування QA знаходить запит моделі, її пропозицію, рішення policy, фактичний виклик інструмента та його результат. Метрики показують, чи зросли затримки, помилки читання й зупинки через ліміт. Версії допомагають зрозуміти, з яким контрактом інструмента працював конкретний запуск.',
    'Зберігати тільки фінальну відповідь, за якою неможливо встановити, чи інструмент справді працював.',
  ),
];

export const AGENT_HARNESS_INTERVIEW_DECK: StudyInterviewDeck = {
  deckId: 'concept-04-harness-interview',
  headingUk: 'Перевір себе перед співбесідою',
  leadUk:
    'Спробуйте відповісти вголос. Потім відкрийте пояснення та позначте, чи можете повторити відповідь своїми словами.',
  answerBriefLabelUk: 'Коротко',
  answerDeepLabelUk: 'До гвинтиків',
  pitchUk:
    'Agent harness — це код, який керує роботою моделі під час розслідування. Після падіння login_spec він передає моделі відомі факти. Якщо модель пропонує прочитати звіт, код перевіряє аргументи й дозвіл, а потім викликає інструмент. Отримані дані або помилку він записує й за потреби передає моделі для наступного кроку. Harness також зупиняє цикл за правилами продукту. QA окремо перевіряє поведінку цього коду та обґрунтованість висновку моделі.',
  pitchEn:
    'An agent harness is the application code that controls a model during an investigation. After login_spec fails, it sends the model the known facts. If the model proposes reading a report, the harness checks the arguments and permission before running the tool. It records the data or error, may pass it to the model for another turn, and stops the run according to application rules. QA tests the harness behavior and the model’s conclusions separately.',
  questions: HARNESS_QUESTIONS,
  nextLinks: [
    {
      to: '/topic/concept-10/study',
      label: 'Tool Calling — як модель пропонує інструмент і як код отримує результат',
      hintUk: '',
    },
    {
      to: '/topic/concept-17/study',
      label: 'Guardrails — як код перевіряє дозволи перед дією',
      hintUk: '',
    },
  ],
};

/** Decks для PART II (крім еталонів 03, 10, 17 — окремі файли). Доповнюється по пакетах rollout. */
export const PART_II_INTERVIEW_BY_TOPIC: Record<string, StudyInterviewDeck> = {
  'concept-02': ORCHESTRATION_INTERVIEW_DECK,
  'concept-04': AGENT_HARNESS_INTERVIEW_DECK,
};
