import type { FundamentalsCardPanel } from './fundamentals-card-panels';
import type { StudyTeachingCardsBundle } from './study-teaching-card-types';
import { fundamentalsConceptStep } from './fundamentals-teaching-step';

/** Навчальний приклад у training (не змішувати з eval). */
export const ML_TRAIN_TICKET_QUESTION_UK =
  '«Як змінити адресу доставки?» — клас question. Мітку підтвердила людина в triage, не модель.';

/** Тікет для перевірки узагальнення / eval — не входив у training. */
export const ML_HOLDOUT_TICKET_BUG_UK =
  '«Після оновлення кнопка Checkout неактивна» — очікуваний клас bug за людською розміткою на eval. Цього тексту не було в навчальних прикладах.';

function panelLabels(): FundamentalsCardPanel {
  return {
    terms: [
      {
        label: 'мітка класу (label)',
        text: 'Погоджена категорія тікета в даних після triage, а не «абсолютна істина».',
      },
      {
        label: 'навчальний набір (training set)',
        text: 'Різноманітні розмічені тікети, на яких підлаштовують модель.',
      },
    ],
    sections: [
      {
        type: 'prose',
        labelUk: 'Простими словами',
        labeledLead: {
          termUk: 'Label',
          explanationUk:
            'людська мітка класу (bug або question), яку зберігають у датасеті разом із текстом тікета.',
        },
        bodyUk:
          'Один тікет не навчить класифікатор. Команда збирає набір із сотень і тисяч різних звернень, щоб модель бачила різні формулювання обох класів. Спірні тікети не «закривають наосліп»: їх відкладають, додають у guideline або зводять до двох незалежних оцінювачів.',
      },
      {
        type: 'miniCards',
        labelUk: 'Приклади з датасету (умовно)',
        captionUk: 'Три різні тікети з навчального набору, не один повторений зразок.',
        items: [
          {
            titleUk: 'Тікет A',
            bodyUk:
              'Текст: «Кнопка Save сіра після редагування профілю». Label: bug. Причина мітки: після збереження дані не оновлюються, це дефект продукту.',
          },
          {
            titleUk: 'Тікет B',
            bodyUk:
              'Текст: «Як змінити адресу доставки?». Label: question. Причина мітки: користувач питає про процедуру, без повідомлення про поломку.',
          },
          {
            titleUk: 'Тікет C',
            bodyUk:
              'Текст: «Помилка 500 на checkout». Label: bug. Причина мітки: підтверджений збій сервера, не питання «як користуватися».',
          },
        ],
      },
      {
        type: 'plain',
        labelUk: 'Хто вирішує неоднозначність',
        bodyUk:
          'Lead сапорту або QA за guideline triage: якщо формулювання схоже на питання, але є stack trace — ескалація на bug. Мітку не ставить модель і не один скрипт без правил. Помилковий label у датасеті навчить модель повторювати ту саму помилку.',
      },
      {
        type: 'plain',
        labelUk: 'Для QA investigation',
        bodyUk:
          'Перед retrain: spot-check випадкової вибірки labels, окремо спірні тікети з двома оцінювачами. Переконайтеся, що eval-тікети ще не потрапили в training (це тема наступної групи карток, але розділення планують заздалегідь).',
      },
    ],
    rememberUk:
      'Класифікатор вчиться на наборі розмічених тікетів. Label — погоджена мітка після triage, не безпомилкова істина.',
  };
}

function panelTrain(): FundamentalsCardPanel {
  return {
    terms: [
      {
        label: 'параметри (ваги, weights)',
        text: 'Числа всередині моделі, які змінюються під час training.',
      },
      {
        label: 'training (навчання)',
        text: 'Багаторазовий прохід по навчальному набору з оновленням параметрів.',
      },
    ],
    sections: [
      {
        type: 'prose',
        labelUk: 'Простими словами',
        bodyUk:
          'Модель багато разів бачить пари «текст → label» і змінює параметри (ваги), щоб рідше помилятися на навчальних прикладах. Це не те саме, що одне правило if у коді: закономірності витягуються з даних. Порівняння: явне правило «якщо в тексті є слово error → bug» задає інженер у конфігурації, а training підлаштовує ваги на прикладах без ручного переліку всіх фраз.',
      },
      {
        type: 'miniCards',
        labelUk: 'Один крок training (навчально)',
        items: [
          {
            titleUk: 'Вхід',
            bodyUk: 'Тікет B з навчального набору: «Як змінити адресу доставки?»',
          },
          {
            titleUk: 'Мітка в даних',
            bodyUk: 'question (підтвердила людина в triage).',
          },
          {
            titleUk: 'Прогноз моделі (до кінця training)',
            bodyUk: 'Спочатку може помилитися, наприклад bug. Після багатьох проходів по набору параметри зміщуються, щоб частіше збігатися з labels на training.',
          },
        ],
      },
      {
        type: 'plain',
        labelUk: 'Що змінюється, а що ні',
        bodyUk:
          'Під час training оновлюються параметри моделі, а не текст тікетів у базі. QA не «бачить» внутрішні матриці в UI, але фіксує версію моделі, датасет id і метрики на eval після навчання.',
      },
      {
        type: 'plain',
        labelUk: 'Для QA investigation',
        bodyUk:
          'Перевірте, що в продукті немає прихованого if, який дублює або суперечить ML-маршрутизації (це дефект інтеграції). Окремо: чи eval не змішали з training.',
      },
    ],
    rememberUk:
      'Training підлаштовує параметри на навчальному наборі. Висока якість лише на training ще не означає надійну роботу на нових тікетах.',
  };
}

function panelGeneralize(): FundamentalsCardPanel {
  return {
    terms: [
      {
        label: 'inference (виконання моделі)',
        text: 'Застосування вже навченої моделі до нового тікета.',
      },
      {
        label: 'score',
        text: 'Числова оцінка від API. Не завжди дорівнює ймовірності класу.',
      },
    ],
    sections: [
      {
        type: 'prose',
        labelUk: 'Простими словами',
        bodyUk:
          'Узагальнення — це поведінка на тікетах, яких не було в training. Один вдалий прогноз на новому зверненні ще не доводить, що модель стабільно працює на всіх майбутніх текстах.',
      },
      {
        type: 'miniCards',
        labelUk: 'Один новий тікет (eval)',
        items: [
          {
            titleUk: 'Текст',
            bodyUk: '«Після оновлення кнопка Checkout неактивна» — цього формулювання не було в навчальних прикладах.',
          },
          {
            titleUk: 'Прогноз моделі',
            bodyUk: 'Наприклад bug зі score 0.82 (інтерпретація score — у документації API).',
          },
          {
            titleUk: 'Мітка людини на eval',
            bodyUk:
              'bug після перевірки очікуваної поведінки (кнопка має бути активною), а не лише тому, що фраза «звучить страшно».',
          },
        ],
      },
      {
        type: 'plain',
        labelUk: 'Висновок для QA',
        bodyUk:
          'Якщо прогноз збігся з label на одному hold-out тікеті — це добрий знак, але не заміна метрик на всьому контрольному наборі.',
      },
    ],
    rememberUk:
      'Inference на новому тексті показує узагальнення. Один збіг label і прогнозу не замінює eval на наборі.',
  };
}

function panelEvalSplit(): FundamentalsCardPanel {
  return {
    terms: [
      {
        label: 'hold-out / eval',
        text: 'Контрольні тікети з labels, які не використовували в training цієї версії моделі.',
      },
      {
        label: 'recall (повнота) для bug',
        text: 'Яку частку справжніх bug модель позначила як bug.',
      },
      {
        label: 'precision (точність) для bug',
        text: 'Яка частка прогнозів bug справді bug за міткою людини.',
      },
    ],
    sections: [
      {
        type: 'prose',
        labelUk: 'Простими словами',
        bodyUk:
          'Перед стартом training команди відокремлюють контрольний набір. Модель не повинна «бачити» eval-тікети під час підлаштування параметрів. Якщо той самий або майже ідентичний текст потрапив і в training, і в eval, метрики виглядають кращими, ніж є насправді.',
      },
      {
        type: 'plain',
        labelUk: 'Числовий приклад (bug)',
        bodyUk:
          'На eval 10 тікетів справді bug. Модель позначила bug у 8 випадках, з них 6 справжні bug, а 2 були question. Тоді bug recall = 6/10 (знайшли шість із десяти справжніх bug). Bug precision = 6/8 (шість із восьми прогнозів bug були правильними). Recall відповідає на питання «чи не пропускаємо bug», precision — «чи не засипаємо чергу хибними bug».',
      },
      {
        type: 'plain',
        labelUk: 'Чому accuracy оманлива',
        bodyUk:
          'Якщо в eval 90 question і 10 bug, модель, яка завжди каже question, отримає 90% accuracy, але пропустить усі bug. Тому для triage дивляться метрики окремо по класах і confusion matrix, а не одну загальну цифру.',
      },
      {
        type: 'plain',
        labelUk: 'Для QA investigation',
        bodyUk:
          'Зафіксуйте eval dataset id. Автоматична перевірка перетину з training перед кожним retrain. Порівнюйте прогноз моделі з людськими мітками на hold-out.',
      },
    ],
    rememberUk:
      'Hold-out відокремлюють до training. Метрики по класах показують, чи не «ховаються» рідкісні bug за високою accuracy.',
  };
}

function panelQuality(): FundamentalsCardPanel {
  return {
    terms: [
      {
        label: 'дисбаланс класів (class imbalance)',
        text: 'Одного класу в даних набагато більше, ніж іншого.',
      },
      {
        label: 'confusion matrix',
        text: 'Таблиця, скільки прогнозів потрапило в кожну комбінацію «справжній клас / прогноз».',
      },
    ],
    sections: [
      {
        type: 'prose',
        labelUk: 'Простими словами',
        bodyUk:
          'Три різні причини поганої якості на різних етапах життєвого циклу моделі. Тут не про drift у production (окрема картка), а про те, що псує навчання й оцінку зараз.',
      },
      {
        type: 'miniCards',
        labelUk: 'Три причини',
        items: [
          {
            titleUk: 'Помилкові labels',
            bodyUk:
              'Приклад: question позначили як bug поспіхом. Перевірка: аудит вибірки labels, дві незалежні оцінки на спірних тікетах.',
          },
          {
            titleUk: 'Дисбаланс класів',
            bodyUk:
              'Приклад: 95% question у training, модель завжди відповідає question. Перевірка: метрики bug окремо, збалансовані вибірки або ваги класів за політикою ML-команди.',
          },
          {
            titleUk: 'Нові типи звернень у даних',
            bodyUk:
              'Приклад: у training не було тікетів про оплату, а в eval з’явилися. Перевірка: confusion matrix на свіжій розміченій вибірці, чи не зник bug-клас повністю.',
          },
        ],
      },
      {
        type: 'plain',
        labelUk: 'Для QA investigation',
        bodyUk:
          'Не зводьте падіння якості лише до «зламалась модель». Спочатку відокремте labels, дисбаланс і склад вхідних текстів.',
      },
    ],
    rememberUk:
      'Якість псують помилкові мітки, дисбаланс і нові теми в даних. Кожна причина має свою перевірку.',
  };
}

function panelRetrain(): FundamentalsCardPanel {
  return {
    terms: [
      {
        label: 'retrain (повторне навчання)',
        text: 'Нове навчання на оновленому або очищеному датасеті.',
      },
      {
        label: 'регресія якості',
        text: 'Погіршення метрик нової версії порівняно зі старою на тому самому eval.',
      },
    ],
    sections: [
      {
        type: 'prose',
        labelUk: 'Простими словами',
        labeledLead: {
          termUk: 'Retrain',
          explanationUk: 'повторне навчання, після якого з’являється нова версія параметрів (model version).',
        },
        bodyUk:
          'Команда порівнює версію A і B на одному й тому самому hold-out, щоб побачити, що покращилось і що погіршилось. Регресія якості — це саме погіршення на узгоджених сценаріях, а порівняння допомагає її помітити до deploy.',
      },
      {
        type: 'miniCards',
        labelUk: 'Порівняння A vs B (умовно)',
        items: [
          {
            titleUk: 'Bug recall',
            bodyUk: 'Було 0.55, стало 0.62 — більше справжніх bug знаходять.',
          },
          {
            titleUk: 'Bug precision',
            bodyUk: 'Було 0.70, стало 0.64 — частіше помилково ставлять bug.',
          },
          {
            titleUk: 'Рішення продукту',
            bodyUk: 'Команда зважує пороги triage: чи приймати B, якщо recall зріс, але precision впав.',
          },
        ],
      },
      {
        type: 'plain',
        labelUk: 'Для QA investigation',
        bodyUk:
          'Gate перед релізом: фіксований eval id, diff метрик і прикладів помилок по класах. Одна загальна accuracy без розбивки не достатня.',
      },
    ],
    rememberUk:
      'Після retrain порівнюють версії на одному eval. Регресія — погіршення, яке таке порівняння має виявити.',
  };
}

function panelDrift(): FundamentalsCardPanel {
  return {
    terms: [
      {
        label: 'drift (зміна розподілу даних)',
        text: 'Нові тікети за темами або формулюваннями відрізняються від періоду training.',
      },
    ],
    sections: [
      {
        type: 'prose',
        labelUk: 'Простими словами',
        labeledLead: {
          termUk: 'Drift',
          explanationUk:
            'змінився склад вхідних тікетів у production, хоча код класифікатора і версія моделі не оновлювалися.',
        },
        bodyUk:
          'Це сигнал зібрати свіжу розмічену вибірку і перевірити метрики. Це не автоматичний доказ, що модель зламалась, і не автоматична команда «робити retrain завтра».',
      },
      {
        type: 'miniCards',
        labelUk: 'До / після (умовно)',
        items: [
          {
            titleUk: 'До запуску платіжного шлюзу',
            bodyUk: '5% тікетів містять слово «payment» у навчальному періоді.',
          },
          {
            titleUk: 'Через місяць у production',
            bodyUk: '35% нових тікетів про оплату та відмови картки.',
          },
          {
            titleUk: 'Дія команди',
            bodyUk: 'Моніторинг тем, ручна вибірка з labels, eval на свіжих даних, потім рішення про retrain.',
          },
        ],
      },
      {
        type: 'plain',
        labelUk: 'Зв’язок з іншими картками',
        bodyUk:
          'Регресія після retrain — порівняння двох версій моделі на одному eval. Drift — зміна світу вхідних тікетів. Обидва приводять до перевірки якості, але причини різні.',
      },
      {
        type: 'plain',
        labelUk: 'Для QA investigation',
        bodyUk:
          'Dashboard частоти тем. При різкому spike — не висновуйте «баг у коді» без перевірки labels і eval на новій вибірці.',
      },
    ],
    rememberUk:
      'Drift — зміна складу звернень. Спочатку перевірка на свіжих даних, retrain лише як рішення команди після аналізу.',
  };
}

export const FUNDAMENTALS_ML_TICKET_CARDS: StudyTeachingCardsBundle = {
  ariaLabel: 'ML на прикладі класифікатора тікетів bug / question',
  presentation: 'concepts',
  conceptsHeadingUk: 'Сім понять однієї історії triage — не кроки одного виклику',
  introCalloutLabelUk: 'Одна історія',
  leadUk:
    '**Умовний сценарій курсу.** Команда хоче автоматично направляти звернення в дві черги — bug і question.\n\n' +
    'Люди розбирають історичні тікети й ставлять погоджені мітки класу.\n\n' +
    'Дані одразу ділять на навчальні й контрольні (hold-out), щоб оцінювання не змішували з навчанням.\n\n' +
    'Модель вчиться на багатьох різних розмічених тікетах. Модель перевіряють на контрольних тікетах, яких вона не бачила під час training.\n\n' +
    'Після запуску команда стежить за новими зверненнями, оцінює якість і порівнює версії після retrain.',
  conceptGroups: [
    {
      headingUk: 'Дані до навчання',
      stepKeys: ['labels'],
    },
    {
      headingUk: 'Навчання та перевірка',
      stepKeys: ['train', 'generalize', 'eval-split'],
    },
    {
      headingUk: 'Якість у production',
      stepKeys: ['quality', 'retrain-regress', 'drift'],
    },
  ],
  steps: [
    fundamentalsConceptStep(
      'labels',
      'Навчальні приклади та label',
      'Набір різних тікетів із мітками від людини.',
      panelLabels(),
      'Дані',
    ),
    fundamentalsConceptStep(
      'train',
      'Навчання з даних',
      'Параметри моделі змінюються на навчальному наборі.',
      panelTrain(),
      'Training',
    ),
    fundamentalsConceptStep(
      'generalize',
      'Узагальнення',
      'Новий тікет, якого не було в training.',
      panelGeneralize(),
      'Inference',
    ),
    fundamentalsConceptStep(
      'eval-split',
      'Окремі дані для оцінювання',
      'Hold-out відокремлюють до training.',
      panelEvalSplit(),
      'Eval',
    ),
    fundamentalsConceptStep(
      'quality',
      'Що псує якість',
      'Labels, дисбаланс, нові теми в даних.',
      panelQuality(),
      'Ризики',
    ),
    fundamentalsConceptStep(
      'retrain-regress',
      'Retrain і регресія',
      'Версія A vs B на одному eval.',
      panelRetrain(),
      'Release',
    ),
    fundamentalsConceptStep(
      'drift',
      'Drift (зміна даних)',
      'Новий склад тікетів у production.',
      panelDrift(),
      'Моніторинг',
    ),
  ],
};
