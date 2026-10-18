import type { StudyInterviewDeck } from './study-interview-types';

export type ReasoningRememberConceptMiniCard = {
  titleUk: string;
  bodyUk: string;
};

export const REASONING_REMEMBER_CONCEPT_MINI_CARDS: ReasoningRememberConceptMiniCard[] = [
  {
    titleUk: 'Гіпотеза',
    bodyUk: 'Припущення, яке підказує наступну перевірку.',
  },
  {
    titleUk: 'Доказ',
    bodyUk: 'Дані, які агент фактично отримав.',
  },
  {
    titleUk: 'Висновок',
    bodyUk: 'Відповідь у межах доступних доказів.',
  },
];

export const REASONING_INTERVIEW_DECK: StudyInterviewDeck = {
  deckId: 'concept-12-reasoning',
  headingUk: 'Перевір себе перед співбесідою',
  leadUk:
    'Сформулюйте відповідь своїми словами, потім натисніть «Показати відповідь». У відповіді — блоки «Коротко», приклад login_spec, перевірка QA та типова помилка.',
  answerBriefLabelUk: 'Коротко',
  questions: [
    {
      id: 'c12-q1',
      questionUk: 'Чим гіпотеза відрізняється від факту?',
      answerBriefUk:
        'Факт — те, що підтверджують наявні дані. Гіпотеза — можливе пояснення, яке ще потрібно перевірити.',
      deepInfoCards: [
        {
          titleUk: 'На прикладі login_spec',
          bodyUk:
            'CI повідомив, що тест не дочекався #login-btn. Це факт про виконання тесту. «Селектор застарів» — лише гіпотеза, доки відповідні дані звіту або trace її не підтримають.',
        },
        {
          titleUk: 'Як перевірить QA',
          bodyUk:
            'Дає моделі тільки повідомлення CI й перевіряє, що вона не називає конкретну причину встановленою. Після передачі тестового фрагмента звіряє конкретні твердження з цим фрагментом.',
        },
      ],
      pitfallUk: 'Приймати впевнений тон відповіді за доказ.',
    },
    {
      id: 'c12-q2',
      questionUk: 'Що робити, якщо звіт не вдалося прочитати?',
      answerBriefUk: 'Зберегти помилку як помилку. Не вдавати, що звіт прочитано.',
      deepInfoCards: [
        {
          titleUk: 'На прикладі login_spec',
          bodyUk:
            'readPlaywrightReport повернув «файл не знайдено». Код записує це для поточного run. Агент може запропонувати інше дозволене джерело або завершити розслідування з непідтвердженою причиною.',
        },
        {
          titleUk: 'Як перевірить QA',
          bodyUk:
            'Підставляє помилку читання. Перевіряє, що наступний запит до моделі та підсумок для людини не містять вигаданого DOM чи рядків звіту.',
        },
      ],
      pitfallUk: 'Сприймати помилку як порожній звіт і дозволяти моделі описувати його вміст.',
    },
    {
      id: 'c12-q3',
      questionUk: 'Як QA помітить твердження без доказу?',
      answerBriefUk:
        'Порівняє кожне конкретне твердження відповіді з даними, які модель справді отримала.',
      deepInfoCards: [
        {
          titleUk: 'На прикладі login_spec',
          bodyUk:
            'Якщо у вхідних даних є лише timeout, фраза «у звіті видно відсутню кнопку» не має підстав. Якщо інструмент повернув фрагмент, QA перевіряє, чи справді в ньому є факт, на який посилається відповідь.',
        },
        {
          titleUk: 'Як перевірить QA',
          bodyUk:
            'Зіставляє вхід моделі, результат інструмента й фінальну відповідь у trace або тестових даних. Не вимагай спеціального посилання в UI, якщо продукт його не підтримує.',
        },
      ],
      pitfallUk: 'Оцінювати лише переконливість тексту, не перевіряючи джерело тверджень.',
    },
  ],
  pitchUk:
    'Після падіння login_spec агент знає про timeout на #login-btn, але ще не знає причини. Модель може висунути гіпотезу й запропонувати перевірку. Код вирішує, чи дозволено викликати інструмент, і передає моделі фактично отримані дані або помилку. Модель має уточнювати висновок за цими даними. Як QA я окремо перевіряю передачу результатів кодом і те, чи кожне конкретне твердження відповіді підтримане доступними доказами.',
  pitchEn:
    'After login_spec fails, the agent knows the timeout on #login-btn but not the root cause yet. The model may propose a hypothesis and suggest a check. Code decides whether a tool call is allowed and passes back real data or an error. The model should refine its conclusion from that evidence. As QA I verify code-side data transfer separately from whether each specific claim in the answer is supported by available evidence.',
  nextLinks: [
    {
      to: '/topic/concept-04/study',
      label: 'Agent Harness',
      hintUk: 'Loop, policy і trace навколо викликів моделі.',
    },
  ],
};
