/** Змістовний вступ «Про що цей розділ» для інтерактивних блоків Guardrails (concept-17). */

export const GUARDRAILS_TOPIC_INTRO_WHY =
  'У цьому розділі розглянемо, чому пропозиція LLM не є дозволом на виконання дії. На прикладі login_spec простежимо, як застосунок перевіряє виклики інструментів, блокує заборонені дії та не допускає побічних ефектів до проходження перевірок.';

export const GUARDRAILS_TOPIC_INTRO_FULL_EXAMPLE =
  'У цьому розділі розглянемо одну політику доступу на чотирьох прикладах: читання логів дозволено, запис у production БД заборонено, створення Jira bug потребує підтвердження, а видалення issue недоступне, оскільки відповідного інструмента немає в реєстрі. Це допоможе побачити, чому різні дії одного агента отримують різні рішення.';

export const GUARDRAILS_TOPIC_INTRO_COMPONENTS =
  'У цьому розділі розглянемо, з яких частин складається захист агента: перевірок вхідних і вихідних даних, правил доступу до інструментів, ізоляції середовища, списків дозволених і заборонених дій, лімітів та механізму погодження людиною. Для кожного компонента важливо розуміти його призначення й те, яку перевірку має виконувати QA.';

export const GUARDRAILS_TOPIC_INTRO_DATA_TRANSFER =
  'У цьому розділі на прикладі login_spec розберемо послідовність guardrails для одного tool call: що передається між моделлю, policy engine та executor на кожному етапі. Оберіть картку ліворуч, щоб побачити повне пояснення етапу.';

export const GUARDRAILS_TOPIC_INTRO_SEQUENCE =
  'У цьому розділі розглянемо шлях дії від перевірки вхідних даних до виконання інструмента. На кожному етапі є своя відповідальність: модель пропонує дію, код перевіряє її коректність і дозволеність, людина за потреби погоджує ризикову операцію, а executor виконує лише допущену дію.';

export const GUARDRAILS_TOPIC_INTRO_LLM_CODE =
  'Розберемо, які рішення в роботі guardrails приймає мовна модель, які перевірки виконує код застосунку та де потрібне підтвердження людини. На прикладі падіння login_spec простежимо шлях від пропозиції інструмента до перевірки доступу й фактичного виконання.';

export const GUARDRAILS_LLM_CODE_PRINCIPLE_UK =
  'LLM може запропонувати дію, але не надає собі дозволу на її виконання. Код перевіряє структуру виклику, права доступу та інші обов’язкові умови. Якщо політика вимагає людського погодження, дія чекає на нього.';

export const GUARDRAILS_TOPIC_INTRO_FAILURES =
  'Розглянемо типові помилки в захисті агента: неправильні параметри, обхід policy, помилки в обробці погодження, повторне виконання дії та витік даних. Для кожного випадку визначимо, який результат має побачити QA і який побічний ефект не повинен відбутися.';

export const GUARDRAILS_TOPIC_INTRO_SECURITY =
  'Розглянемо, які ресурси й межі доступу потрібно захистити в агенті: файли, секрети, production-системи, Jira та дані користувачів. Визначимо, як обмежувати повноваження інструментів і чому вміст документів або відповіді моделі не можуть самостійно змінювати правила доступу.';

export const GUARDRAILS_TOPIC_INTRO_QA_TESTS =
  'Розглянемо, як перевіряти guardrails не лише за позитивними сценаріями, а й за спробами обійти обмеження. Побудуємо перевірки для ALLOW, DENY і NEEDS_APPROVAL, невалідних аргументів, невідомих інструментів та відсутності побічних ефектів після відмови.';

export const GUARDRAILS_TOPIC_INTRO_OBSERVABILITY =
  'Розглянемо, які дані потрібні для розслідування роботи агента в production: запропоновані виклики, рішення policy, статус погодження, результат виконання та причини відмови. Визначимо, як пов’язувати події одного запуску, не записуючи зайвих секретів у журнали.';

export const GUARDRAILS_TOPIC_INTRO_PRODUCTION =
  'Розглянемо, що потрібно врахувати перед запуском guardrails у production: централізовані правила доступу, безпечну конфігурацію, обробку помилок, таймаути, повторні спроби, ідемпотентність ризикових дій і контроль погоджень. Відокремимо демонстраційний приклад від вимог до реальної системи.';

export const GUARDRAILS_TOPIC_INTRO_REMEMBER =
  'Підсумуємо ключові принципи guardrails і підготуємося пояснити їх на співбесіді. Повторимо різницю між schema та policy, значення ALLOW, DENY і NEEDS_APPROVAL, роль executor та способи перевірити, що заборонена дія не спричиняє побічних ефектів.';

export function getGuardrailsSectionTopicIntro(sectionTitle?: string): string | undefined {
  const t = (sectionTitle ?? '').toLowerCase();
  if (t.includes('навіщо') && t.includes('guardrail')) return GUARDRAILS_TOPIC_INTRO_WHY;
  if (t.includes('простий приклад') || t.includes('повний простий')) return GUARDRAILS_TOPIC_INTRO_FULL_EXAMPLE;
  if (t === 'компоненти' || t.startsWith('компоненти ')) return GUARDRAILS_TOPIC_INTRO_COMPONENTS;
  if (t.includes('передається між')) return GUARDRAILS_TOPIC_INTRO_DATA_TRANSFER;
  if (t.includes('послідовність')) return GUARDRAILS_TOPIC_INTRO_SEQUENCE;
  if (t.includes('код') && t.includes('llm')) return GUARDRAILS_TOPIC_INTRO_LLM_CODE;
  if (t.includes('впасти') || t.includes('failure')) return GUARDRAILS_TOPIC_INTRO_FAILURES;
  if (t.includes('security') || t.includes('захистити')) return GUARDRAILS_TOPIC_INTRO_SECURITY;
  if (t.includes('тестувати') || t.includes('qa/sdet')) return GUARDRAILS_TOPIC_INTRO_QA_TESTS;
  if (t.includes('observability')) return GUARDRAILS_TOPIC_INTRO_OBSERVABILITY;
  if (t.includes('production considerations')) return GUARDRAILS_TOPIC_INTRO_PRODUCTION;
  if (t.includes('запам') || t.includes('співбесід')) return GUARDRAILS_TOPIC_INTRO_REMEMBER;
  return undefined;
}
