import type { StudyTeachingCardsBundle } from './study-teaching-card-types';
import { fundamentalsTeachingStep } from './fundamentals-teaching-step';

export const FUNDAMENTALS_SAMPLING_PARAMS_CARDS: StudyTeachingCardsBundle = {
  ariaLabel: 'Параметри вибору та завершення генерації',
  presentation: 'concepts',
  conceptsHeadingUk: 'Параметри API генерації — окремі налаштування, не кроки run',
  introCalloutLabelUk: 'Контекст',
  leadUk:
    'Після того як модель порахувала ймовірності наступного токена, параметри sampling керують вибором і завершенням генерації.\n\n' +
    'Вони зменшують або збільшують варіативність, але не перетворюють модель на джерело істини.',
  conceptGroups: [
    {
      headingUk: 'Sampling',
      stepKeys: ['temperature', 'top-p', 'max-out', 'stop', 'seed'],
    },
  ],
  steps: [
    fundamentalsTeachingStep(
      'temperature',
      'Temperature',
      'Вплив на випадковість вибору токена.',
      {
        whatUk:
          'Регулює **спосіб** вибору наступного токена з розподілу. **Не** вимірює «правдивість» чи якість фактів.',
        inputUk: 'temperature у запиті API.',
        outputUk: 'Більш або менш різноманітний текст при тому ж context.',
        linkUk: 'Крок sampling у циклі next-token.',
        exampleUk: 'Низька temperature для стабільного JSON-звіту investigation; вища — для варіантів формулювань.',
        failureUk: 'Думати, що temperature=0 гарантує істину.',
        testUk: 'Eval змісту на фіксованому eval-наборі, не лише «чи той самий текст».',
      },
      'Sampling',
    ),
    fundamentalsTeachingStep(
      'top-p',
      'top_p (nucleus)',
      'Обмеження набору кандидатів-токенів.',
      {
        whatUk:
          'Залишає найімовірніші токени, поки їх сумарна ймовірність не досягне **p**. Це **не** «ймовірність правильного слова».',
        inputUk: 'top_p разом із розподілом моделі.',
        outputUk: 'Відфільтрований вибір токена.',
        linkUk: 'Працює разом із temperature.',
        exampleUk: 'top_p=0.9 відсікає рідкісні токени на кінці довгої відповіді.',
        failureUk: 'Плутати з confidence score класифікатора ML.',
        testUk: 'Документуйте top_p у trace поруч із temperature.',
      },
      'Sampling',
    ),
    fundamentalsTeachingStep(
      'max-out',
      'Max output tokens',
      'Ліміт довжини згенерованої відповіді.',
      {
        whatUk:
          'Обмежує, скільки токенів може **згенерувати** модель у цьому виклику. При перевищенні відповідь **обривається**; поле статусу (наприклад finish_reason=length) залежить від API.',
        inputUk: 'max_tokens / max_completion_tokens у запиті.',
        outputUk: 'Обрізаний completion.',
        linkUk: 'Бюджет output у межах context window.',
        exampleUk: 'Занадто малий ліміт — JSON schema обрізано, парсер падає.',
        failureUk: 'Вважати обрив «відмовою» моделі без перевірки finish_reason.',
        testUk: 'Assert finish_reason і повний parse structured output.',
      },
      'Ліміт',
    ),
    fundamentalsTeachingStep(
      'stop',
      'Stop sequences',
      'Рядки, на яких зупиняють генерацію.',
      {
        whatUk: 'Harness задає stop-токени/рядки, щоб модель не генерувала зайве після закриття JSON або маркера.',
        inputUk: 'Список stop у API.',
        outputUk: 'Зупинка до max_tokens.',
        linkUk: 'Кінець циклу next-token.',
        exampleUk: 'Stop після `}` у JSON tool args.',
        failureUk: 'Stop спрацьовує всередині потрібного коду в markdown fence.',
        testUk: 'Тести з навмисним stop у fixture prompt.',
      },
      'Stop',
    ),
    fundamentalsTeachingStep(
      'seed',
      'Seed',
      'Спроба відтворюваності вибору.',
      {
        whatUk:
          'Деякі API підтримують **seed** для sampling. **Seed і temperature 0 не дають** універсальної гарантії побайтово однакової відповіді на різному залізі/версіях.',
        inputUk: 'seed + інші параметри.',
        outputUk: 'Можливо ближчі прогони в CI.',
        linkUk: 'Детермінізм коду vs ймовірність вибору токена.',
        exampleUk: 'Два CI-прогони з seed — порівняти, але мати tolerance у eval.',
        failureUk: 'Exact string match як єдиний критерій automation.',
        testUk: 'Schema + task success; фіксуйте model id і параметри в trace.',
      },
      'CI',
    ),
  ],
};
