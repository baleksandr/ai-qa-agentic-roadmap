import type { StudyTeachingCardsBundle } from './study-teaching-card-types';
import { fundamentalsTeachingStep } from './fundamentals-teaching-step';

export const FUNDAMENTALS_TRANSFORMER_CARDS: StudyTeachingCardsBundle = {
  ariaLabel: 'Transformer для LLM — інтуїція без формул',
  presentation: 'concepts',
  conceptsHeadingUk: 'Чотири ідеї про transformer — аспекти, не кроки виклику',
  introCalloutLabelUk: 'Контекст',
  leadUk:
    '**Transformer** — архітектурна основа багатьох сучасних LLM: модель враховує зв’язки між токенами в межах context window.\n\n' +
    'Нижче — інтуїція без формул, на прикладі trace login_spec у context агента.',
  conceptGroups: [
    {
      headingUk: 'Архітектура й context',
      stepKeys: ['arch', 'context-links', 'attention', 'not-all-pairs', 'litm'],
    },
  ],
  steps: [
    fundamentalsTeachingStep(
      'arch',
      'Архітектура моделі',
      'Схема шарів, не конкретні ваги.',
      {
        whatUk:
          '**Архітектура** описує тип і порядок блоків (attention, feed-forward тощо). **Навчені параметри** заповнюють цю схему після training. Ви обираєте model id, а не малюєте шари вручну.',
        inputUk: 'Специфікація моделі від вендора.',
        outputUk: 'Готовий inference endpoint.',
        linkUk: 'Deep learning — архітектура vs параметри; model id вказує checkpoint.',
        exampleUk: 'Різні model id можуть мати різну глибину context або підтримку tools.',
        failureUk: 'Плутати «transformer» з усім AI.',
        testUk: 'Документація продукту: яка архітектура сімейства і який model id у prod.',
      },
      'Основа',
    ),
    fundamentalsTeachingStep(
      'context-links',
      'Зв’язки між токенами',
      'Модель змішує інформацію в межах context window.',
      {
        whatUk:
          'У межах одного виклику кожен токен **може використовувати** інформацію від інших токенів context (через attention-механізм). Тому порядок і складність prompt мають значення.',
        inputUk: 'Усі token IDs поточного виклику.',
        outputUk: 'Оновлені представлення перед прогнозом наступного токена.',
        linkUk: 'Token IDs після токенізації; далі — що входить у context window.',
        exampleUk: 'Слово «locator» у trace і слово «timeout» в одному context впливають на наступні токени відповіді.',
        failureUk: 'Думати, що токени ізольовані один від одного.',
        testUk: 'Змінити порядок двох речень у prompt — порівняти, чи змінилася відповідь (на фіксованому model id).',
      },
      'Context',
    ),
    fundamentalsTeachingStep(
      'attention',
      'Attention (інтуїція)',
      'Механізм «на що звернути увагу» між токенами.',
      {
        whatUk:
          '**Attention** — спосіб, яким модель на кожному шарі **зважує**, які інші токени в context важливіші для поточного. Без формул: це не пошук у Google, а внутрішнє змішування представлень.',
        inputUk: 'Представлення токенів у шарі.',
        outputUk: 'Змішані представлення для наступного шару.',
        linkUk: 'Пояснює, чому релевантний фрагмент trace може підсилити правильні токени відповіді.',
        exampleUk: 'Умовний trace login_spec: рядок про зміну locator може отримати більшу вагу при генерації висновку.',
        failureUk: 'Вважати attention «пам’яттю між сесіями» — лише поточний context.',
        testUk: 'Чи цитує агент фрагмент trace, який реально був у messages (groundedness).',
      },
      'Механізм',
    ),
    fundamentalsTeachingStep(
      'not-all-pairs',
      'Не «кожен бачить усіх» буквально',
      'Спрощення для навчання, не повний опис генерації.',
      {
        whatUk:
          'Фраза «кожен токен бачить усі інші» — **грубе спрощення** для навчання. На практиці є ліміти context, маски, оптимізації; генерація йде **крок за кроком**, а не одним махом.',
        inputUk: 'Довжина context і правила API.',
        outputUk: 'Поступова генерація відповіді.',
        linkUk: 'Далі — цикл next-token prediction.',
        exampleUk: 'Дуже довгий trace обрізається — «невидимі» токени не беруть участі взагалі.',
        failureUk: 'Очікувати, що модель «прочитала» 200 сторінок з тією ж увагою, що й перший абзац.',
        testUk: 'Перевірка, що критичний рядок не випав через truncation.',
      },
      'Уточнення',
    ),
    fundamentalsTeachingStep(
      'litm',
      'Lost in the middle',
      'Доказ посередині довгого context іноді гірше враховується.',
      {
        whatUk:
          '**Lost in the middle** — спостереження: у **дуже довгому** context важливий фрагмент **посередині** іноді використовується гірше, ніж на початку чи в кінці. Це **не гарантія** для кожної моделі й кожного prompt.',
        inputUk: 'Довгий trace login_spec із ключовим рядком про locator посередині.',
        outputUk: 'Відповідь агента без згадки locator — можлива ознака проблеми context, не «дурість» моделі.',
        linkUk: 'Шум і ліміт context window — окремо від повного опису transformer.',
        exampleUk:
          'Умовно: 80 рядків trace, зміна locator на рядку 40 — QA перевіряє, чи є цитата/опора в відповіді після read_report.',
        failureUk: 'Вважати lost in the middle законом природи без вимірювань на вашому стеку.',
        testUk: 'A/B: той самий доказ на початку vs посередині synthetic long context; метрика groundedness.',
      },
      'QA',
    ),
  ],
};
