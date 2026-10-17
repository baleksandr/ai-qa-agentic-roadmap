import type { StudyTeachingCardsBundle } from './study-teaching-card-types';
import { fundamentalsTeachingStep } from './fundamentals-teaching-step';

export const FUNDAMENTALS_TOKENIZATION_CARDS: StudyTeachingCardsBundle = {
  ariaLabel: 'Текст «Playwright automation» в одному виклику LLM',
  leadUk:
    '**Токен** — одиниця тексту для моделі. **Токенізація** — розбиття рядка на токени. **Token ID** — ціле число зі словника моделі. Точні межі токенів і числа ID залежать від **tokenizer конкретної моделі** — нижче умовна послідовність без вигаданих id.',
  flowArrowLine: 'текст → токенізатор → token IDs → представлення → обчислення моделі',
  steps: [
    fundamentalsTeachingStep(
      'text',
      'Текст',
      'Рядок у prompt, як бачить застосунок.',
      {
        whatUk: 'Unicode-рядок у messages — наприклад фраза в user message під час investigation login_spec.',
        inputUk: 'Зібрані messages.',
        outputUk: 'Рядок для tokenizer.',
        linkUk: 'Частина input у context window; зазвичай у user message.',
        exampleUk: 'Умовно: `"Playwright automation"` у запиті про тест логіну.',
        failureUk: 'Невидимі символи змінюють розбиття — token count «стрибає».',
        testUk: 'Fixture exact bytes prompt; порівняння usage.prompt_tokens.',
      },
      'Вхід',
    ),
    fundamentalsTeachingStep(
      'tokenize',
      'Токенізація',
      'Правила розбиття рядка на токени.',
      {
        whatUk:
          '**Токенізатор** (частина стеку моделі) застосовує правила моделі: слова, підслова, пробіли. Це не «розріз по пробілах» і не однакове для всіх model id.',
        inputUk: 'Текстовий рядок.',
        outputUk: 'Послідовність токенів (символьні фрагменти) перед ID.',
        linkUk: 'Між текстом і token IDs.',
        exampleUk: 'Та сама фраза може дати 2–4 токени залежно від моделі — не фіксуйте число в тестах без tokenizer.',
        failureUk: 'Очікувати однакове розбиття між різними model id.',
        testUk: 'Офіційний tokenizer API для вашого model id у CI smoke.',
      },
      'Tokenizer',
    ),
    fundamentalsTeachingStep(
      'ids',
      'Token IDs',
      'Числовий словник моделі.',
      {
        whatUk:
          'Кожен токен отримує **token ID** — ціле число. Модель на inference працює з масивом IDs, не з «літерами в голові».',
        inputUk: 'Токени після tokenize.',
        outputUk: 'Масив цілих чисел довжиною ≤ context window.',
        linkUk: 'Ліміт context window застосовується до суми IDs input + output.',
        exampleUk: 'Довгий HTML з read_playwright_report може дати сотні IDs — з’їдає history.',
        failureUk: 'Обрізання context — критичний рядок trace не потрапив у масив.',
        testUk: 'QA: довгий report + ліміт токенів — assert, що ключовий факт або в prompt, або в truncated marker у логах.',
      },
      'IDs',
    ),
    fundamentalsTeachingStep(
      'repr',
      'Внутрішні представлення',
      'Вектори токенів у LLM, не RAG embeddings документів.',
      {
        whatUk:
          'Модель перетворює token IDs на **внутрішні числові представлення** (embedding шару) і змішує їх у transformer. Це **інше**, ніж **embeddings документів для RAG** — ті готують окремий індекс для пошуку chunk, а не forward pass чату.',
        inputUk: 'Token IDs + таблиця embeddings навченої моделі.',
        outputUk: 'Тензор для attention-шарів.',
        linkUk: 'Deep learning — представлення тексту; RAG — окремий vector store для chunk.',
        exampleUk: 'Токени «locator» і «timeout» у trace отримують представлення, що впливають на наступні токени відповіді.',
        failureUk: 'Плутати RAG vector з token embedding у LLM — різні pipeline.',
        testUk: 'Trace: chunk_id з retrieval vs prompt_tokens LLM — різні лічильники.',
      },
      'LLM',
    ),
    fundamentalsTeachingStep(
      'forward',
      'Обчислення моделі',
      'Forward pass на inference.',
      {
        whatUk: 'Фіксовані **параметри** моделі обчислюють розподіл на наступний токен; ваги не змінюються під час вашого запиту.',
        inputUk: 'Представлення всіх токенів context.',
        outputUk: 'Ймовірності наступного токена → цикл next-token prediction.',
        linkUk: 'Замикає ланцюг токенізації перед sampling.',
        exampleUk: 'Після обчислення модель «продовжує» пояснення trace — ще не виконання tool.',
        failureUk: 'Timeout API — інфраструктура, не «поганий prompt».',
        testUk: 'p95 latency і помилки API окремо від groundedness eval.',
      },
      'Inference',
    ),
  ],
};
