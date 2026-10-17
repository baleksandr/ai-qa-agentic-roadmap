import type { FundamentalsCardPanel } from './fundamentals-card-panels';
import type { StudyTeachingCardsBundle } from './study-teaching-card-types';
import { fundamentalsConceptStep } from './fundamentals-teaching-step';

/** Повні Study-уроки з `topics.registry` (маршрут «Увесь маршрут»). */
const COURSE_LESSON_RAG_TOPIC_ID = 'concept-03';
const COURSE_LESSON_MCP_TOPIC_ID = 'concept-06';

const nestedConceptPick = {
  presentation: 'concepts' as const,
  showActorInPanel: false,
  showStepIndexInPanel: false,
};

function panelLlmSlm(): FundamentalsCardPanel {
  return {
    sections: [
      {
        type: 'processStepPick',
        labelUk: 'Простими словами',
        pickAriaLabel: 'LLM і SLM — два типи мовних моделей',
        presentation: 'concepts',
        showActorInPanel: false,
        showStepIndexInPanel: false,
        pickConclusionLabelUk: 'Як обирати',
        pickConclusionUk:
          'Порівнюйте конкретні моделі на однакових задачах за якістю, часом і вартістю.',
        steps: [
          {
            key: 'llm',
            titleUk: 'LLM · Large Language Model',
            teaserUk: 'Велика мовна модель для роботи з текстом',
            actorUk: '',
            detailUk:
              'LLM обробляє переданий текст і генерує відповідь. Слово «велика» стосується масштабу моделі, але не гарантує, що відповідь правильна або що модель найкраща для будь-якої задачі.\n\n' +
              'У нашому прикладі їй можна передати опис падіння login_spec і отриманий звіт. Висновок про причину падіння перевіряють за звітом, а не за розміром моделі.',
            qaCheckUk:
              'На фіксованих прикладах перевірити, чи висновок підтверджений trace і чи модель позначає припущення як припущення.',
            terms: [
              {
                label: 'LLM (Large Language Model)',
                text: 'велика мовна модель',
              },
              {
                label: 'model id',
                text: 'ідентифікатор конкретної моделі або її версії в API',
              },
            ],
          },
          {
            key: 'slm',
            titleUk: 'SLM · Small Language Model',
            teaserUk: 'Менша мовна модель, яку оцінюють під конкретну задачу',
            actorUk: '',
            detailUk:
              'SLM теж працює з текстом, але має менший масштаб. Її можуть обрати для вузької задачі, якщо результати тестів показують достатню якість за прийнятного часу й вартості. Назва SLM сама собою не гарантує, що ця модель швидша за кожну LLM.\n\n' +
              'Наприклад, меншу модель можна перевірити для сортування повідомлень про падіння тестів за категоріями. Якщо вона плутає критичні збої, нижча вартість не робить її придатною для цієї задачі.',
            qaCheckUk:
              'На одному контрольному наборі виміряти помилки по категоріях, час і вартість. Порівнювати конкретні model id за однакових умов.',
            terms: [
              {
                label: 'SLM (Small Language Model)',
                text: 'менша мовна модель',
              },
              {
                label: 'eval',
                text: 'перевірка якості на заздалегідь визначених прикладах',
              },
            ],
          },
        ],
      },
    ],
  };
}

function panelVlm(): FundamentalsCardPanel {
  return {
    sections: [
      {
        type: 'processStepPick',
        labelUk: 'Як VLM працює з цим скріншотом',
        pickAriaLabel: 'Три кроки: скріншот, обробка VLM, перевірка відповіді',
        presentation: 'concepts',
        showActorInPanel: false,
        showStepIndexInPanel: false,
        pickConclusionLabelUk: 'Висновок',
        pickConclusionUk:
          'Скріншот підтверджує, що кнопку видно. Причину timeout встановлюють за кодом тесту, DOM і trace.',
        steps: [
          {
            key: 'screenshot',
            titleUk: 'Застосунок передає скріншот',
            teaserUk: 'Скріншот того run login_spec, де був timeout',
            actorUk: '',
            detailUk:
              'Застосунок бере скріншот саме того запуску login_spec, де стався timeout, і додає його до запиту разом із запитанням про кнопку входу.',
            qaCheckUk:
              'У trace перевірити run id і джерело скріншота: файл або вкладення належить саме цьому запуску, а не іншому тесту чи старому артефакту.',
            terms: [
              {
                label: 'run',
                text: 'Один запуск тесту або агентного сценарію з власними артефактами й trace.',
              },
              {
                label: 'login_spec',
                text: 'Навчальний Playwright-тест входу, який у курсі використовують у прикладах розслідування.',
              },
            ],
          },
          {
            key: 'vlm-process',
            titleUk: 'VLM обробляє зображення',
            teaserUk: 'Зображення й текст у запиті до моделі',
            actorUk: '',
            detailUk:
              'VLM (Vision-Language Model) обробляє передане зображення разом із текстовим запитанням. Модель сама не відкриває браузер і не отримує скріншот, поки застосунок його не передав.',
            qaCheckUk:
              'У логах harness немає кроку «браузер від моделі»; перед викликом VLM видно підготовку запиту з вкладеним або посиланням на скріншот від застосунку.',
            terms: [
              {
                label: 'VLM (Vision-Language Model)',
                text: 'Модель, що разом обробляє зображення й текстовий запит.',
              },
              {
                label: 'модальність',
                text: 'Тип даних на вході, наприклад текст або зображення.',
              },
            ],
          },
          {
            key: 'verify-answer',
            titleUk: 'Відповідь потрібно перевірити',
            teaserUk: 'Видимість на скріншоті не дорівнює селектору в DOM',
            actorUk: '',
            detailUk:
              'VLM повідомляє, що бачить на зображенні кнопку «Увійти». QA звіряє опис із переданим скріншотом і перевіряє, чи це скріншот потрібного run. Скріншот показує вигляд сторінки, але не доводить, що HTML-селектор кнопки — #login-btn.',
            qaCheckUk:
              'Порівняти текст відповіді VLM із файлом скріншота цього run; окремо відкрити DOM і trace запуску та перевірити фактичний селектор кнопки в момент збою, не покладаючись лише на опис моделі.',
            terms: [
              {
                label: 'селектор',
                text: 'Рядок у коді тесту (наприклад #login-btn), за яким Playwright шукає елемент у DOM.',
              },
              {
                label: 'DOM',
                text: 'Структура сторінки в момент run; селектор має відповідати реальному елементу.',
              },
            ],
          },
        ],
      },
      {
        type: 'plain',
        labelUk: 'Приклад login_spec',
        bodyUk:
          'Тест шукає кнопку за селектором #login-btn і завершується timeout. На скріншоті цього запуску видно кнопку “Увійти”, і VLM повідомляє про неї. Але за скріншотом не можна визначити HTML-селектор. QA відкриває DOM і trace цього запуску та перевіряє, який селектор був у кнопки в момент збою.',
      },
      {
        type: 'plain',
        labelUk: 'Зв’язок',
        bodyUk:
          'VLM описує тип вхідних даних і можливості моделі. Одна конкретна модель може поєднувати кілька можливостей, тому LLM і VLM не обов’язково взаємовиключні «коробки».',
      },
    ],
  };
}

function panelSpecializedNames(): FundamentalsCardPanel {
  return {
    sections: [
      {
        type: 'prose',
        labelUk: 'Простими словами',
        bodyUk:
          'У курсі скорочення MLM, SAM і LCM означають три різні речі: навчання мовної моделі, виділення областей на зображенні та швидка генерація зображень. Це не один спільний «тип AI» і не три взаємовиключні розміри LLM.',
      },
      {
        type: 'processStepPick',
        labelUk: 'Три спеціалізовані назви',
        pickAriaLabel: 'MLM, SAM і LCM у матеріалах курсу',
        presentation: 'concepts',
        showActorInPanel: false,
        showStepIndexInPanel: false,
        conceptGroups: [
          {
            headingUk: 'Окремі значення в курсі',
            stepKeys: ['mlm', 'sam', 'lcm'],
          },
        ],
        steps: [
          {
            key: 'mlm',
            titleUk: 'MLM — masked language modeling',
            teaserUk: 'Навчання відновлювати приховані частини тексту',
            actorUk: '',
            detailUk:
              'MLM (Masked Language Model) — підхід до навчання, коли модель відновлює приховані фрагменти вхідного тексту. Класичний приклад: речення з пропуском [MASK], який модель має заповнити. Це опис способу навчання, а не ще один «розмір» LLM поруч із SLM.\n\nЗ цієї назви не варто робити висновок, що кожна модель з позначкою MLM — готовий продукт для chat-completion у вашому агенті.',
            exampleUk:
              'У навчанні модель бачить «The login button is [MASK]» і прогнозує пропущене слово. У production-агенті для login_spec ви скоріше бачите autoregressive LLM, ніж окремий «MLM-сервіс» у trace.',
            qaCheckUk:
              'Якщо в документації продукту згадується MLM, звірте, чи це про етап навчання, а не про ім’я chat-моделі в API. У trace шукайте model id фактичного inference-виклику.',
            terms: [
              {
                label: 'MLM (Masked Language Model)',
                text: 'Модель або етап навчання з відновленням прихованих токенів у тексті.',
              },
              {
                label: 'autoregressive generation',
                text: 'Покрокове передбачення наступного токена, типовий режим chat-моделей.',
              },
            ],
          },
          {
            key: 'sam',
            titleUk: 'SAM — Segment Anything Model',
            teaserUk: 'Виділення області на зображенні маскою',
            actorUk: '',
            detailUk:
              'SAM (Segment Anything Model) — спеціалізована модель комп’ютерного зору для сегментації. Вона виділяє пікселі об’єкта або області за підказкою (точка, рамка тощо), а не формує текстову відповідь про UI.\n\nЗ цієї назви не варто робити висновок, що SAM сама встановлює причину падіння login_spec або замінює перевірку trace.',
            exampleUk:
              'На скріншоті сторінки SAM виділила область кнопки входу. QA звіряє маску з розміткою або зображенням цього run. Виділення області не доводить root cause timeout.',
            qaCheckUk:
              'Перевірити, що маска відповідає потрібному скріншоту run, межі кнопки коректні на контрольних прикладах і що висновок про падіння тесту спирається на trace, а не лише на маску.',
            terms: [
              {
                label: 'SAM (Segment Anything Model)',
                text: 'Модель для виділення областей на зображенні.',
              },
              {
                label: 'segmentation',
                text: 'Поділ зображення на області або маски пікселів.',
              },
            ],
          },
          {
            key: 'lcm',
            titleUk: 'LCM — Latent Consistency Model',
            teaserUk: 'Швидша генерація зображень у latent-просторі',
            actorUk: '',
            detailUk:
              'LCM (Latent Consistency Model) — підхід у генерації зображень, орієнтований на якісний результат за меншу кількість кроків sampling. Це напрям generative vision, а не стандартна частина кожного agent run з текстом і інструментами.\n\nЗ цієї назви не варто робити висновок, що LCM замінює LLM у розслідуванні login_spec або вбудований у кожен AI-продукт курсу.',
            exampleUk:
              'Команда генерує навчальний макет екрана для презентації. Це не той самий процес, що читання Playwright-звіту через harness після падіння login_spec.',
            qaCheckUk:
              'Якщо продукт використовує генерацію зображень, тестуйте якість і час окремо від agent trace login_spec. Не змішуйте метрики image-gen із task success розслідування.',
            terms: [
              {
                label: 'LCM (Latent Consistency Model)',
                text: 'Сімейство підходів до швидшої генерації зображень.',
              },
              {
                label: 'generative vision',
                text: 'Генерація або синтез зображень моделлю, не текстовий chat.',
              },
            ],
          },
        ],
      },
    ],
  };
}

function panelMoe(): FundamentalsCardPanel {
  return {
    sections: [
      {
        type: 'processStepPick',
        labelUk: 'Mixture of Experts у моделі',
        pickAriaLabel: 'Experts і router у MoE',
        ...nestedConceptPick,
        steps: [
          {
            key: 'experts',
            titleUk: 'Experts — блоки всередині моделі',
            teaserUk: 'Частини однієї моделі, які беруть участь в обчисленні',
            actorUk: '',
            detailUk:
              'MoE означає Mixture of Experts — «суміш експертів». Тут expert — внутрішній обчислювальний блок моделі. Це не людина, не окремий агент і не інструмент, який викликає harness. У деяких MoE-моделях під час обробки частини вхідних даних працює вибрана частина таких блоків.',
            qaCheckUk:
              'Оцінювати відповідь конкретної моделі на контрольних прикладах. Не вигадувати окремі API-виклики «до кожного експерта», якщо продукт їх не має.',
            terms: [
              {
                label: 'MoE (Mixture of Experts)',
                text: 'Архітектура з кількома внутрішніми блоками та маршрутизацією між ними.',
              },
              {
                label: 'expert',
                text: 'Внутрішній обчислювальний блок моделі, а не агент чи людина.',
              },
            ],
          },
          {
            key: 'router',
            titleUk: 'Router — вибір блоків',
            teaserUk: 'Внутрішній механізм визначає, які блоки використати',
            actorUk: '',
            detailUk:
              'Router у MoE спрямовує частину обчислення до вибраних experts. Це відбувається всередині моделі. Не плутати з router застосунку, який може обирати між різними model id для різних задач.',
            exampleUk:
              'Застосунок викликав одну модель для login_spec. Її внутрішні обчислення не перетворюються через MoE на кілька агентних run.',
            qaCheckUk:
              'У trace розрізняти зовнішній вибір model id застосунком і те, що продукт узагалі не спостерігає як окремі tool calls.',
            terms: [
              {
                label: 'router',
                text: 'Внутрішній механізм MoE, який обирає experts для частини обчислення.',
              },
              {
                label: 'model id',
                text: 'Ідентифікатор версії моделі, яку застосунок викликає через API.',
              },
            ],
          },
        ],
      },
      {
        type: 'plain',
        labelUk: 'Зв’язок',
        bodyUk:
          'LLM або інша модель може бути побудована з MoE. Це інша ознака, ніж розмір моделі чи наявність зображення на вході.',
      },
    ],
  };
}

function panelRag(): FundamentalsCardPanel {
  return {
    sections: [
      {
        type: 'processStepPick',
        labelUk: 'Три частини RAG',
        pickAriaLabel: 'Пошук, передача контексту й перевірка відповіді RAG',
        ...nestedConceptPick,
        steps: [
          {
            key: 'retrieval',
            titleUk: 'Пошук джерел',
            teaserUk: 'Застосунок шукає фрагменти документів',
            actorUk: '',
            detailUk:
              'Для запитання про login_spec застосунок може знайти звіт або документ. Результат пошуку — це ще не відповідь моделі й не доказ актуальності документа.',
            qaCheckUk:
              'Чи знайдено доречний фрагмент, чи користувач має до нього доступ і чи документ стосується потрібного run.',
            terms: [
              {
                label: 'retrieval',
                text: 'Етап пошуку релевантних фрагментів у сховищі.',
              },
              {
                label: 'chunk',
                text: 'Фрагмент документа, який можуть передати моделі як контекст.',
              },
            ],
          },
          {
            key: 'context',
            titleUk: 'Передавання моделі',
            teaserUk: 'Знайдені фрагменти додають до запиту',
            actorUk: '',
            detailUk:
              'Код застосунку передає дозволені фрагменти як контекст. Модель отримує лише те, що їй передали, і формує відповідь. Вона не «пам’ятає» автоматично весь архів документів.',
            qaCheckUk:
              'У trace перевірити, які саме фрагменти й версії документів потрапили до запиту.',
            terms: [
              {
                label: 'RAG (Retrieval-Augmented Generation)',
                text: 'Пошук контексту перед генерацією відповіді моделлю.',
              },
              {
                label: 'context',
                text: 'Текст і дані, які застосунок додає до запиту моделі в цьому виклику.',
              },
            ],
          },
          {
            key: 'grounding',
            titleUk: 'Перевірка відповіді',
            teaserUk: 'Джерело має справді підтверджувати висновок',
            actorUk: '',
            detailUk:
              'Модель може процитувати старий postmortem про login_spec. Посилання існує, але причина сьогоднішнього падіння підтверджується лише актуальними доказами цього run.',
            qaCheckUk:
              'Звірити конкретне твердження з текстом джерела, його датою та trace поточного запуску.',
            terms: [
              {
                label: 'citation',
                text: 'Посилання моделі на фрагмент або документ у відповіді.',
              },
              {
                label: 'grounding',
                text: 'Зв’язок твердження з перевіреними доказами, а не лише з наявністю citation.',
              },
            ],
          },
        ],
      },
      {
        type: 'courseLessonLink',
        topicId: COURSE_LESSON_RAG_TOPIC_ID,
        linkLabelUk: 'Повний урок: RAG',
      },
    ],
  };
}

function panelMcp(): FundamentalsCardPanel {
  return {
    sections: [
      {
        type: 'processStepPick',
        labelUk: 'MCP у застосунку',
        pickAriaLabel: 'Підключення MCP і дозвіл на виконання',
        ...nestedConceptPick,
        steps: [
          {
            key: 'connect',
            titleUk: 'Підключення',
            teaserUk: 'Стандартний спосіб надати застосунку інструменти та джерела',
            actorUk: '',
            detailUk:
              'MCP розшифровується як Model Context Protocol. Він описує взаємодію між застосунком і під’єднаним сервером інструментів або даних. Це протокол підключення, а не назва моделі.',
            exampleUk:
              'Для investigation може бути доступний інструмент читання звіту, якщо застосунок його підключив.',
            qaCheckUk:
              'Перевірити, які інструменти справді доступні цьому користувачу й цьому run.',
            terms: [
              {
                label: 'MCP (Model Context Protocol)',
                text: 'Протокол підключення інструментів і джерел до застосунку.',
              },
              {
                label: 'server',
                text: 'Під’єднаний сервіс інструментів або даних за правилами MCP.',
              },
              {
                label: 'tool',
                text: 'Функція або сервіс, який застосунок може викликати після підключення.',
              },
            ],
          },
          {
            key: 'policy-exec',
            titleUk: 'Дозвіл і виконання',
            teaserUk: 'Підключений інструмент не означає необмежений доступ',
            actorUk: '',
            detailUk:
              'Опис інструмента може потрапити до запиту моделі. Якщо модель запропонувала виклик, код застосунку перевіряє аргументи й права перед виконанням. Сам протокол не скасовує policy продукту.',
            exampleUk:
              'Запит прочитати звіт чужого run відхиляють до читання файлу.',
            qaCheckUk:
              'Перевірити policy deny та відсутність виконання інструмента після відмови.',
            terms: [
              {
                label: 'permission',
                text: 'Дозвіл користувача або роль на конкретну дію або ресурс.',
              },
              {
                label: 'policy',
                text: 'Правила застосунку, які дозволяють або відхиляють дію після пропозиції моделі.',
              },
            ],
          },
        ],
      },
      {
        type: 'courseLessonLink',
        topicId: COURSE_LESSON_MCP_TOPIC_ID,
        linkLabelUk: 'Повний урок: MCP',
      },
    ],
  };
}

function panelHarnessAgent(): FundamentalsCardPanel {
  return {
    sections: [
      {
        type: 'processStepPick',
        labelUk: 'Harness і agent у циклі',
        pickAriaLabel: 'Код керування harness і agent run',
        ...nestedConceptPick,
        steps: [
          {
            key: 'harness',
            titleUk: 'Harness — код керування',
            teaserUk: 'Готує запит, перевіряє дозволи й виконує дозволені дії',
            actorUk: '',
            detailUk:
              'Harness — код застосунку навколо моделі. Він збирає контекст, перевіряє policy, викликає інструменти, зберігає стан run і може обмежувати кількість кроків. Модель пропонує readPlaywrightReport, але файл читає код після перевірки дозволу.',
            qaCheckUk:
              'Після policy deny в trace є відмова й немає виконання handler.',
            terms: [
              {
                label: 'harness',
                text: 'Код, який керує викликами моделі, інструментами й лімітами run.',
              },
              {
                label: 'policy',
                text: 'Правила дозволу або відмови дій у застосунку.',
              },
              {
                label: 'state',
                text: 'Дані run між кроками: messages, результати tools, лічильники.',
              },
            ],
          },
          {
            key: 'agent',
            titleUk: 'Agent — виконання задачі в циклі',
            teaserUk: 'Модель і код можуть разом зробити кілька керованих кроків',
            actorUk: '',
            detailUk:
              'У цьому уроці agent — система, де застосунок використовує модель у циклі: запитує, перевіряє запропоновану дію, виконує дозволене, повертає результат моделі й продовжує до відповіді або зупинки. Довга відповідь моделі сама по собі ще не свідчить, що інструмент виконався.',
            exampleUk:
              'Для login_spec модель запропонувала прочитати звіт, harness виконав читання, а наступний виклик моделі отримав результат.',
            qaCheckUk:
              'У trace підтвердити порядок: пропозиція → policy → виконання → результат → наступний виклик.',
            terms: [
              {
                label: 'agent run',
                text: 'Виконання задачі від запиту до результату або зупинки в керованому циклі.',
              },
              {
                label: 'tool result',
                text: 'Дані, які handler повернув після виконання інструмента і передали моделі далі.',
              },
            ],
          },
        ],
      },
    ],
  };
}

export const FUNDAMENTALS_MODEL_LANDSCAPE_CARDS: StudyTeachingCardsBundle = {
  ariaLabel: 'Ландшафт моделей і шарів навколо них',
  presentation: 'concepts',
  conceptsHeadingUk: 'Карта понять для login_spec',
  introCalloutLabelUk: 'Одна історія',
  leadUk:
    'Уявіть розслідування падіння login_spec. Модель може прочитати опис помилки й запропонувати пояснення. Якщо їй потрібен актуальний звіт, код застосунку отримує його через дозволений інструмент. Назва моделі відповідає на питання «чим обробляємо дані», а RAG, MCP, harness і agent описують інші частини системи.',
  conceptGroups: [
    {
      headingUk: 'Яку модель використовуємо',
      stepKeys: ['llm', 'vlm', 'spec'],
    },
    {
      headingUk: 'Як вона може бути влаштована',
      stepKeys: ['moe'],
    },
    {
      headingUk: 'Що працює навколо моделі',
      stepKeys: ['rag', 'mcp', 'harness'],
    },
  ],
  steps: [
    fundamentalsConceptStep(
      'llm',
      'LLM і SLM',
      'Обидві працюють із мовою, але розмір сам по собі не визначає якість.',
      panelLlmSlm(),
    ),
    fundamentalsConceptStep(
      'vlm',
      'VLM — модель, що працює із зображенням і текстом',
      'Може відповідати на запитання про переданий скріншот.',
      panelVlm(),
    ),
    fundamentalsConceptStep(
      'spec',
      'Спеціалізовані назви: MLM, SAM, LCM',
      'Три різні скорочення з окремими значеннями в матеріалах курсу.',
      panelSpecializedNames(),
    ),
    fundamentalsConceptStep(
      'moe',
      'MoE — спосіб побудови моделі',
      'Усередині моделі є кілька обчислювальних блоків, між якими спрямовують роботу.',
      panelMoe(),
    ),
    fundamentalsConceptStep(
      'rag',
      'RAG — пошук перед відповіддю',
      'Застосунок знаходить документи й передає їх моделі як контекст.',
      panelRag(),
    ),
    fundamentalsConceptStep(
      'mcp',
      'MCP — спосіб під’єднати можливості',
      'Протокол взаємодії застосунку з зовнішніми інструментами й даними.',
      panelMcp(),
    ),
    fundamentalsConceptStep(
      'harness',
      'Harness і agent',
      'Код керує порядком дій, а агент виконує задачу в цьому циклі.',
      panelHarnessAgent(),
    ),
  ],
};
