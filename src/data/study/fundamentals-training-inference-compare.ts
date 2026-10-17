import type { StudyProcessCompareBundle } from './study-process-compare-types';

const LOGIN =
  'Умовний навчальний сценарій: QA-агент після падіння `login_spec` викликає model API — це inference, поки команда окремо не запустила retrain або fine-tuning.';

export const FUNDAMENTALS_TRAINING_INFERENCE_COMPARE: StudyProcessCompareBundle = {
  ariaLabel: 'Навчання моделі та використання (inference)',
  questionUk:
    'Що саме змінюється під час training і що відбувається, коли я щодня надсилаю запит до моделі?',
  footerUk:
    'Порівняння 1 — **IDE і Playwright-тест:** ви описуєте кроки тесту, IDE надсилає messages до вже навченої моделі й отримує текст. Параметри моделі в цьому запиті **не** оновлюються — лише формується context і відповідь. Це **inference**, не training.\n\nПорівняння 2 — **нова навчена версія:** команда зібрала датасет прикладів investigation, запустила training/fine-tuning і випустила **новий model id**. Тепер той самий prompt до агента login_spec може дати іншу відповідь — бо змінилися **ваги**, не лише context. Потрібна **регресія якості** на фіксованому eval-наборі до релізу в production.',
  cards: [
    {
      key: 'training',
      tier: 'primary',
      titleUk: 'Training',
      subtitleUk: 'Навчання',
      teaserUk: 'Дані з правильними відповідями → помилка → оновлення параметрів → нова версія моделі.',
      steps: [
        { labelUk: 'Вхід', textUk: 'Навчальні пари: вхід (наприклад текст) + правильна відповідь (label або еталонний текст).' },
        {
          labelUk: 'Дія',
          textUk: 'Модель робить прогноз, порівнює з еталоном, рахує помилку й кроками оптимізації змінює параметри.',
        },
        { labelUk: 'Результат', textUk: 'Новий checkpoint / model id з оновленими вагами.' },
      ],
      hallmarkUk: 'параметри ЗМІНЮЮТЬСЯ.',
      panel: {
        whatUk:
          'Training — окремий довгий процес, не ваш чат-запит. Модель багато разів бачить приклади з **правильною відповіддю** (label або зразок тексту), обчислює, наскільки прогноз помилковий, і **підкручує параметри**, щоб помилка зменшувалась. Після завершення з’являється **нова версія** ваг для подальшого inference.',
        exampleUk:
          `${LOGIN} Якщо команда fine-tune модель на парах «опис падіння login_spec → структурований висновок QA», змінюються ваги; наступний виклик API з тим самим текстом тікета може поводитися інакше — це вже ефект training, не «розумніший prompt».`,
        relationUk:
          'Відмінність від inference: під час training параметри рухаються; під час звичайного запиту користувача — ні. Відмінність від зміни prompt: prompt не створює новий checkpoint.',
        inputOutputUk:
          'Вхід: датасет (тисячі прикладів), гіперпараметри, базова модель. Вихід: новий model id / artifact для деплою.',
        qaUk:
          'Після training: прогін **фіксованого** eval (login_spec і суміжні сценарії), метрики до/після, збережені model id старої й нової версії, дата датасету. Успіх — покращення або прийнятний компроміс без критичної регресії по класах помилок і safety.',
      },
    },
    {
      key: 'inference',
      tier: 'primary',
      titleUk: 'Inference',
      subtitleUk: 'Використання моделі',
      teaserUk: 'Готова модель + новий запит → обчислена відповідь; ваги в цьому виклику не навчаються.',
      steps: [
        { labelUk: 'Вхід', textUk: 'Підготовлена модель (model id) + messages/context і параметри запиту.' },
        { labelUk: 'Дія', textUk: 'Forward-pass: модель обчислює токени, score класу або tool_call.' },
        { labelUk: 'Результат', textUk: 'Відповідь для користувача або harness (текст, JSON, tool proposal).' },
      ],
      hallmarkUk: 'навчальні параметри в цьому запиті НЕ змінюються.',
      panel: {
        whatUk:
          'Inference — кожен звичайний виклик model API. Ваги **зафіксовані**; ви подаєте новий запит (опис login_spec, trace у context, tools). Модель **обчислює** відповідь за один або кілька проходів генерації, але не запускає на цьому запиті цикл оновлення ваг.',
        exampleUk:
          'Умовно: ви просите IDE «допоможи написати Playwright-тест логіну» — IDE формує messages, модель генерує код. Це впливає лише на **цю** відповідь; завтра та сама модель з іншим context дасть інший текст, але ваги ті самі.',
        relationUk:
          'Поруч із training: IDE-запит = inference. Поруч із fine-tuning: додавання trace у context змінює **вхід** inference, не замінює job training.',
        inputOutputUk:
          'Вхід: model id, messages, tools schema, temperature. Вихід: completion, usage, tool_calls, finish_reason.',
        qaUk:
          'Перевірте: повний context у логах (без секретів), model id, latency, обробка помилок API. Для login_spec — чи відповідь спирається на tool/RAG, а не на вигадку; порівняйте два inference-прогони з однаковим model id і різним context.',
      },
    },
    {
      key: 'fine-tuning',
      tier: 'secondary',
      titleUk: 'Fine-tuning',
      subtitleUk: 'Додаткове навчання',
      teaserUk: 'Ще один training-цикл на ваших парах «вхід → еталон».',
      steps: [
        { labelUk: 'Вхід', textUk: 'Базова модель + ваш датасет прикладів.' },
        { labelUk: 'Результат', textUk: 'Окремий model id зі зміщеною поведінкою.' },
      ],
      hallmarkUk: 'це training, не inference.',
      panel: {
        whatUk:
          'Fine-tuning — **додаткове навчання**: ви готуєте приклади (наприклад бажані investigation-висновки для типових падінь), запускаєте training job, отримуєте **нові параметри**. Це не те саме, що відредагувати system prompt на один вечір.',
        exampleUk:
          `${LOGIN} Після fine-tuning агент стабільніше тримає формат «гіпотеза → доказ → наступний крок» — бо змінилися ваги, а не лише одна інструкція в prompt.`,
        relationUk:
          'Відповідь «навчання чи використання?» — **навчання**. Усі подальші чати з новим model id — inference.',
        qaUk:
          'Збережіть base model id і fine-tuned id; eval до/після на одному наборі login_spec; gate релізу, якщо регресія на safety або tool policy.',
      },
    },
    {
      key: 'prompt-context',
      tier: 'secondary',
      titleUk: 'Зміна prompt / context',
      subtitleUk: 'Дані запиту',
      teaserUk: 'Інший system prompt або trace у messages — той самий model id.',
      steps: [
        { labelUk: 'Суть', textUk: 'Змінюєте instructions, історію, RAG-chunk, tool results.' },
        { labelUk: 'Ефект', textUk: 'Інша відповідь без retrain.' },
      ],
      hallmarkUk: 'це inference, не training.',
      panel: {
        whatUk:
          'Зміна **system prompt**, додавання **trace login_spec** у context або нових tool results змінює те, що модель **бачить зараз**. Навчені параметри лишаються тими самими — змінюється лише вхід одного або серії inference-викликів.',
        exampleUk:
          'Умовно: без trace модель припускає «проблема locator»; після read_report у context — уточнює формулювання. Model id той самий, training не запускали.',
        relationUk:
          'Порівняйте з fine-tuning: context — швидкий експеримент; fine-tuning — зміна ваг і окремий реліз моделі.',
        qaUk:
          'Два прогони: однаковий model id, різний context — задокументуйте diff відповіді. Переконайтеся, що команда не сплутала «покращили prompt» з «випустили нову модель».',
      },
    },
  ],
};
