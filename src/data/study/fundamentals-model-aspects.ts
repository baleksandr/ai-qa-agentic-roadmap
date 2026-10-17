import type { StudyTeachingCardsBundle } from './study-teaching-card-types';
import type { StudyTeachingCardPanel } from './study-teaching-card-types';
import { buildTeachingCardDetail, teachingPanelToFundamentals } from './study-teaching-card-types';

const LOGIN_THREAD =
  'Умовний навчальний сценарій: після падіння Playwright-тесту `login_spec` QA-агент надсилає в model API опис збою й trace; модель пропонує гіпотезу або tool call — це не змінює навчені параметри, лише використовує їх на цьому запиті.';

function step(
  key: string,
  titleUk: string,
  teaserUk: string,
  badge: string,
  panel: StudyTeachingCardPanel,
): StudyTeachingCardsBundle['steps'][number] {
  return {
    key,
    titleUk,
    teaserUk,
    cardBadgeUk: badge,
    fundamentalsPanel: teachingPanelToFundamentals(panel),
    detail: buildTeachingCardDetail(titleUk, teaserUk, panel, { cardBadgeUk: badge }),
  };
}

export const FUNDAMENTALS_MODEL_ASPECTS: StudyTeachingCardsBundle = {
  ariaLabel: 'Модель у застосунку: вибір, розмір і версія',
  presentation: 'concepts',
  conceptsHeadingUk: 'Три аспекти терміна «модель» — не кроки одного run',
  introCalloutLabelUk: 'Контекст',
  leadUk:
    '**Модель** у розмові про AI — не файл у вашому репозиторії, а навчені параметри (ваги) і спосіб обчислення на стороні runtime.\n\n' +
    'Застосунок звертається до неї за **model ID** і передає context окремого виклику — messages, RAG, tool results — без переписування ваг між запитами.',
  conceptGroups: [{ headingUk: 'У продукті', stepKeys: ['app-model', 'size', 'version'] }],
  steps: [
    step(
      'app-model',
      'Конкретна модель у застосунку',
      'Навчені параметри, model ID, окремий prompt/context на кожен виклик.',
      'Runtime',
      {
        whatUk:
          'Модель у продукті — це **навчені параметри** (ваги) і фіксована **архітектура обчислення** на стороні вендора або вашого runtime. **Model ID** — рядок у конфігурації, за яким застосунок просить «саме цю» доступну модель. **Prompt і context** (messages, RAG, tool results) — дані **окремого** inference-виклику: вони змінюють відповідь на цей запит, але самі по собі не переписують ваги між запитами.',
        inputUk:
          'Конфіг: model id; harness формує messages (system, user, tool) і параметри API (temperature, max_tokens).',
        outputUk:
          'Completion або tool_call; у usage — tokens; у логах — model id фактичного виклику.',
        linkUk:
          'Відрізняється від ML/deep learning на тікетах: там навчання; тут про **виклик уже навченої** моделі в агенті. Відрізняється від «просто prompt»: prompt без зміни model id не створює нову версію ваг.',
        exampleUk: LOGIN_THREAD,
        failureUk:
          'У інциденті в логах лише «ChatGPT», без model id і без збереженого context — неможливо відтворити, чому агент обрав інший tool.',
        testUk:
          'Contract-тест: заданий у конфігу model id збігається з полем у тілі запиту до API. У trace (без секретів): model id, correlation id run, hash або розмір context, список tool names — щоб порівняти два запуски login_spec.',
      },
    ),
    step(
      'size',
      'Розмір і можливості моделі',
      'Якість на **вашій** задачі, latency, вартість, tools — не лише «більша = краще».',
      'Вибір',
      {
        whatUk:
          'Різні model id відрізняються обсягом параметрів, довжиною context, підтримкою tools/vision і ціною. **Більша модель не завжди краща** для вузької задачі: інколи достатньо компактної для класифікації, а важливий investigation — окремим викликом до потужнішої. Вибір перевіряють **на своїх сценаріях**, а не за маркетинговою таблицею.',
        inputUk:
          'Один і той самий умовний набір падінь login_spec (опис, уривок trace, очікуваний тип дії агента).',
        outputUk:
          'Таблиця: model id → task success (чи допомогла investigation), groundedness, коректність tool choice, p95 latency, cost/request.',
        linkUk:
          'Поруч із training vs inference: тут порівнюємо **різні готові** model id без retrain; там — чи взагалі був training.',
        exampleUk:
          'Умовно: модель A швидше дає чернетку гіпотези для login_spec, але частіше пропонує зайвий tool; модель B повільніша, але рідше помиляється з read_report — вибір за пріоритетом продукту (швидкість vs точність).',
        failureUk:
          'Заміна на «найбільшу» модель без eval — зростання рахунку без вимірюваного виграшу на login_spec і подібних кейсах.',
        testUk:
          'A/B на фіксованому eval-наборі падінь; успіх — покращення або нейтральність за ключовими метриками без регресії safety/tool policy. Збережіть: model id обох прогонів, дату, seed/context (якщо є), метрики й 3–5 прикладів diff відповідей.',
      },
    ),
    step(
      'version',
      'Версія моделі та alias',
      'Alias може вказати на інші ваги без коміту в вашому коді.',
      'Release',
      {
        whatUk:
          '**Конкретна версія** — точний model id з датою/ревізією в назві. **Alias** (наприклад «latest») — вказівник, який вендор може перенаправити на нові ваги. Тоді ваш репозиторій не змінювався, а відповіді й tool behaviour — так. **Temperature** і інші параметри запиту — не «версія моделі», а налаштування **одного** inference.',
        inputUk:
          'Конфіг до/після оголошення вендора; той самий збережений сценарій login_spec.',
        outputUk:
          'Diff у completions, tool calls або метриках eval — сигнал оновити baseline або заблокувати реліз.',
        linkUk:
          'Ланцюг: змінився target alias або model id → інші відповіді на той самий context → **регресія якості** (eval) ловить зміну → рішення про pin версії або новий baseline.',
        exampleUk:
          'Умовно: після оновлення alias агент для login_spec інакше формулює гіпотезу про locator або частіше викликає read_trace — порівняння двох trace з однаковим вхідним тікетом показує diff без зміни коду агента.',
        failureUk:
          'У production лишається alias «latest» без моніторингу — нічний drift поведінки без відповідального релізу.',
        testUk:
          'У trace для розслідування (без PII): повний model id (не лише бренд), alias якщо використовувався, timestamp, temperature/max_tokens, finish_reason, id tool calls. Після зміни вендора — прогін збереженого eval login_spec; успіх — прийнятний diff або оновлений затверджений baseline.',
      },
    ),
  ],
};
