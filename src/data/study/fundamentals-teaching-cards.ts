import type { StudyTeachingCardsBundle } from './study-teaching-card-types';
import { buildTeachingCardDetail } from './study-teaching-card-types';
import { FUNDAMENTALS_MODEL_ASPECTS } from './fundamentals-model-aspects';
import { FUNDAMENTALS_ML_TICKET_CARDS } from './fundamentals-ml-ticket-cards';
import { FUNDAMENTALS_DL_CONCEPT_CARDS } from './fundamentals-dl-concept-cards';
import { FUNDAMENTALS_TRANSFORMER_CARDS } from './fundamentals-transformer-cards';
import { FUNDAMENTALS_TOKENIZATION_CARDS } from './fundamentals-tokenization-cards';
import { FUNDAMENTALS_CONTEXT_WINDOW_CARDS } from './fundamentals-context-window-cards';
import { FUNDAMENTALS_MESSAGES_ROLES_CARDS } from './fundamentals-messages-roles-cards';
import { FUNDAMENTALS_NEXT_TOKEN_CARDS } from './fundamentals-next-token-cards';
import { FUNDAMENTALS_SAMPLING_PARAMS_CARDS } from './fundamentals-sampling-params-cards';

const QA_THREAD =
  'Навчальний приклад: після падіння `login_spec` QA просить агента пояснити кроки й запропонувати Playwright-тест логіну.';

/** Генерація відповіді LLM — пілотний ланцюг для розділу 6. */
const LLM_GENERATION_FLOW: StudyTeachingCardsBundle = {
  ariaLabel: 'Як LLM генерує відповідь на один запит',
  leadUk:
    'Один виклик моделі — це не «магічна відповідь», а цикл над контекстом. Нижче — п’ять кроків, які повторюються, доки не з’явиться готова відповідь або не спрацює ліміт.',
  flowArrowLine:
    'текст запиту → токени → контекст моделі → вибір наступного токена → відповідь',
  steps: [
    {
      key: 'prompt',
      titleUk: 'Текст запиту',
      teaserUk: 'Повідомлення user/system у застосунку.',
      cardActorUk: 'Код + людина',
      cardBadgeUk: 'Messages',
      detail: buildTeachingCardDetail(
        'Текст запиту',
        'Повідомлення user/system у застосунку.',
        {
          whatUk:
            'Це те, що застосунок передає моделі як задачу: system-інструкції, історія діалогу, фрагменти RAG і поточний запит користувача або агента.',
          inputUk:
            'Рядки з UI або harness: ролі `system`, `user`, `assistant`, інколи `tool` після попередніх кроків run.',
          outputUk: 'Структурований масив messages, готовий до токенізації.',
          linkUk:
            'Попереднього кроку в одному виклику ще немає — це старт ланцюга. Далі harness або API-клієнт віддає текст токенізатору.',
          exampleUk:
            `${QA_THREAD} У messages потрапляють: «Поясни падіння login_spec» + уривок trace + system-правило «не вигадуй шляхи до файлів».`,
          failureUk:
            'У prompt потрапляють секрети з trace, застаріла історія або суперечливі інструкції — модель відповідає впевнено, але не по фактах.',
          testUk:
            'У логах або тестовому spy перевірте склад `messages[]` перед викликом API: ролі, розмір, відсутність токенів доступу.',
        },
        { visualKey: 'query', cardActorUk: 'Код + людина', cardBadgeUk: 'Messages' },
      ),
    },
    {
      key: 'tokenize',
      titleUk: 'Токенізація',
      teaserUk: 'Текст → послідовність token IDs.',
      cardActorUk: 'Код (tokenizer)',
      cardBadgeUk: 'Tokenizer',
      detail: buildTeachingCardDetail(
        'Токенізація',
        'Текст → послідовність token IDs.',
        {
          whatUk:
            'Токенізація — перетворення тексту на числові ідентифікатори токенів. Модель обчислює над ID, а не над «літерами в голові».',
          inputUk: 'Рядки з messages після нормалізації кодування.',
          outputUk: 'Масив token IDs фіксованої довжини в межах context window.',
          linkUk:
            'Бере текст запиту з попереднього кроку. Передає IDs у шари transformer на наступному кроці.',
          exampleUk:
            'Фраза «read Playwright report» розбивається на кілька токенів; довгі tool schemas у prompt з’їдають ліміт ще до відповіді.',
          failureUk:
            'Несподіване розбиття (код, українська, JSON) дає більше токенів, ніж очікували — запит обрізається або стає дорогим.',
          testUk:
            'Порівняйте token count у відповіді API (`usage.prompt_tokens`) з оцінкою для того ж тексту в playground провайдера.',
        },
        { visualKey: 'parse', cardActorUk: 'Код (tokenizer)', cardBadgeUk: 'Tokenizer' },
      ),
    },
    {
      key: 'context',
      titleUk: 'Контекст у моделі',
      teaserUk: 'Transformer обробляє зв’язки між токенами.',
      cardActorUk: 'LLM (inference)',
      cardBadgeUk: 'Transformer',
      detail: buildTeachingCardDetail(
        'Контекст у моделі',
        'Transformer обробляє зв’язки між токенами.',
        {
          whatUk:
            'На inference модель з фіксованими вагами проганяє token IDs через шари transformer: кожен токен «бачить» інші в межах context window.',
          inputUk: 'Token IDs + позиційні коди + параметри виклику (model id).',
          outputUk: 'Внутрішнє представлення, з якого рахують ймовірності наступного токена.',
          linkUk:
            'Йде після токенізації. Результат — вхід для кроку вибору наступного токена; після вибору новий токен знову додається в контекст.',
          exampleUk:
            'Якщо в context є stack trace `login_spec`, модель сильніше асоціює наступні токени з login/locator — але це не гарантія правильного висновку.',
          failureUk:
            'Занадто довгий або шумний context (дублікати logs, цілий wiki) — якість падає, зокрема факти «в середині» губляться.',
          testUk:
            'A/B той самий запит з коротким і з роздутим context: метрики task success і час відповіді.',
        },
        { visualKey: 'context', cardActorUk: 'LLM (inference)', cardBadgeUk: 'Transformer' },
      ),
    },
    {
      key: 'sample',
      titleUk: 'Вибір наступного токена',
      teaserUk: 'Ймовірності → один токен (sampling).',
      cardActorUk: 'LLM + код API',
      cardBadgeUk: 'Sampling',
      detail: buildTeachingCardDetail(
        'Вибір наступного токена',
        'Ймовірності → один токен (sampling).',
        {
          whatUk:
            'Модель видає розподіл ймовірностей на наступний токен; за правилами sampling (temperature, top_p) обирається один варіант і додається до відповіді.',
          inputUk: 'Логіти/ймовірності з останнього шару + параметри генерації.',
          outputUk: 'Один новий token ID, який декодер перетворює на текстовий фрагмент.',
          linkUk:
            'Після обробки контексту. Обраний токен повертається в контекст — цикл повторюється, доки не буде stop або max_tokens.',
          exampleUk:
            'Перший токен відповіді може бути `import` для Playwright-тесту; наступні залежать від уже згенерованого коду в context.',
          failureUk:
            'При високій temperature модель «пливе» між формулюваннями; при низькій — застрягає в шаблоні. Обидва варіанти ламають стабільні regression-тести.',
          testUk:
            'Два запуски з однаковим seed і temperature=0 — текст має збігатися; з temperature>0 — фіксуйте допустимий діапазон у evals.',
        },
        { visualKey: 'llm', cardActorUk: 'LLM + код API', cardBadgeUk: 'Sampling' },
      ),
    },
    {
      key: 'answer',
      titleUk: 'Відповідь run',
      teaserUk: 'Зібраний текст або structured output.',
      cardActorUk: 'Код (client)',
      cardBadgeUk: 'Completion',
      detail: buildTeachingCardDetail(
        'Відповідь run',
        'Зібраний текст або structured output.',
        {
          whatUk:
            'Після серії кроків sampling клієнт збирає фінальний рядок або JSON. Це ще не виконання tools — лише текст/структура від моделі.',
          inputUk: 'Потік згенерованих токенів до stop sequence або ліміту.',
          outputUk:
            'Рядок assistant message або JSON для парсера (structured output); далі harness вирішує, чи викликати tool.',
          linkUk:
            'Завершує один цикл генерації. Наступний крок у агенті — валідація формату, policy, tool handler — уже поза «чистим» LLM.',
          exampleUk:
            `${QA_THREAD} Модель повертає план кроків і пропозицію ` +
            '`readPlaywrightReport` — harness має перевірити path і лише потім читати файл.',
          failureUk:
            'Гарна форма тексту з хибним фактом (hallucination), зламаний JSON, або відповідь довша за ліміт — run обривається посеред речення.',
          testUk:
            'Перевіряйте schema parser, groundedness на facts з RAG/trace, а не лише «чи звучить нормально».',
        },
        { visualKey: 'step', cardActorUk: 'Код (client)', cardBadgeUk: 'Completion' },
      ),
    },
  ],
};

const BY_SECTION: Record<string, StudyTeachingCardsBundle> = {
  'glossary-02': FUNDAMENTALS_ML_TICKET_CARDS,
  'glossary-03': FUNDAMENTALS_DL_CONCEPT_CARDS,
  'glossary-04': FUNDAMENTALS_MODEL_ASPECTS,
  'glossary-06': LLM_GENERATION_FLOW,
  'glossary-07': FUNDAMENTALS_TRANSFORMER_CARDS,
  'glossary-08': FUNDAMENTALS_TOKENIZATION_CARDS,
  'glossary-09': FUNDAMENTALS_CONTEXT_WINDOW_CARDS,
  'glossary-10': FUNDAMENTALS_MESSAGES_ROLES_CARDS,
  'glossary-11': FUNDAMENTALS_NEXT_TOKEN_CARDS,
  'glossary-12': FUNDAMENTALS_SAMPLING_PARAMS_CARDS,
};

export function getFundamentalsTeachingCards(sectionId: string): StudyTeachingCardsBundle | null {
  return BY_SECTION[sectionId] ?? null;
}
