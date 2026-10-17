import type { StudyInterviewDeck } from './study-interview-types';
import type { KeyIdeaBullet } from '../../types/lessonBlocks';

export const PROMPT_PE_REMEMBER_BULLETS: KeyIdeaBullet[] = [
  {
    termUk: 'Prompt engineering',
    bodyUk:
      '— команда визначає задачу, доступний контекст, інструкції та бажаний формат відповіді. Це впливає на поведінку під час виклику моделі.',
  },
  {
    termUk: 'Параметри моделі',
    bodyUk:
      '— зміна prompt не перенавчає модель і не змінює її ваги. Fine-tuning, якщо використовується, — окремий процес навчання.',
  },
  {
    termUk: 'Перевірка QA',
    bodyUk:
      '— окремо оцінюють зміст відповіді, структуру, роботу на контрольних прикладах і стійкість до небажаних інструкцій у вхідних даних. Дозволи на дії перевіряє код.',
  },
];

export const PROMPT_PE_INTERVIEW_DECK: StudyInterviewDeck = {
  deckId: 'concept-14-prompt-engineering-interview',
  headingUk: 'Перевір себе перед співбесідою',
  leadUk:
    'Спочатку сформулюйте відповідь своїми словами, потім розгорніть «Коротко для співбесіди» і «Розберімо до гвинтиків». Блок «Цільна відповідь» — зразок для підготовки, не обов’язково дослівно. Позначки зберігаються лише в цьому браузері.',
  questions: [
    {
      id: 'c14-q1',
      questionUk: 'Чим prompt engineering відрізняється від guardrails?',
      answerBriefUk:
        'Prompt engineering задає моделі задачу, контекст і бажаний формат відповіді. Guardrails — це обмеження та перевірки навколо цієї роботи: наприклад, перевірка структури, прав на інструмент і результату перед небезпечною дією. Інструкція в prompt допомагає, але сама не гарантує дотримання правила.',
      answerDeepUk: `Для login_spec у prompt можна попросити: «Розділи відомий факт, гіпотезу й потрібні докази. Не стверджуй, що бачив trace, якщо його не передали». Це спосіб спрямувати відповідь моделі.

Код окремо перевіряє потрібні поля відповіді, назву й аргументи запропонованого інструмента та права доступу до run. Якщо policy повернула deny, handler не запускають, навіть якщо модель переконливо просить виконати дію.

Якщо у знайденому RAG-документі написано «ігноруй правила», цей текст не може змінити policy застосунку.`,
      pitfallUk:
        'Вважати фразу «не змінюй production» у prompt достатнім захистом. Якщо дія доступна, потрібна перевірка дозволу в коді до її виконання.',
    },
  ],
  pitchUk:
    'Prompt engineering — це спосіб сформулювати для моделі задачу: які дані вона отримує, яких інструкцій має дотримуватися і в якому форматі повернути результат. Наприклад, після падіння login_spec я можу попросити відокремити факт із CI від гіпотез і назвати докази, яких бракує. Але prompt не гарантує правдивості відповіді й не замінює перевірок у застосунку. Код має перевірити структуру відповіді, права на запропонований інструмент і заблокувати заборонену дію. Як QA я б перевіряв ці шари окремо: корисність відповіді на контрольних прикладах, валідність формату й відсутність виконання після policy deny.',
  pitchEn:
    'Prompt engineering defines the task, context, instructions, and expected output format for a model. After a login_spec failure, I could ask it to separate the CI observation from possible causes and name the evidence needed to check each one. A prompt alone does not guarantee that the answer is correct or that an action is safe. Application code must validate the response and check permissions before executing a proposed tool. As a QA engineer, I would test answer quality on reference cases, validate the output format, and confirm that a denied action is never executed.',
  nextLinks: [
    {
      to: '/topic/concept-03/study',
      label: 'RAG',
      hintUk: ' — як застосунок знаходить документи й передає їх моделі як контекст.',
    },
  ],
};
