import type { StudyTeachingCardsBundle } from './study-teaching-card-types';
import { fundamentalsTeachingStep } from './fundamentals-teaching-step';

export const FUNDAMENTALS_CONTEXT_WINDOW_CARDS: StudyTeachingCardsBundle = {
  ariaLabel: 'Що входить у context одного виклику',
  presentation: 'concepts',
  conceptsHeadingUk: 'Частини context window — один виклик, не ланцюг API',
  introCalloutLabelUk: 'Контекст',
  leadUk:
    '**Context window (контекстне вікно)** — максимум токенів, які модель може врахувати в одному виклику.\n\n' +
    'Застосунок сам збирає, що передати в messages; API не підтягує минулі чати автоматично.',
  conceptGroups: [
    {
      headingUk: 'Що займає ліміт',
      stepKeys: ['instructions', 'user-task', 'history', 'docs', 'tools', 'limits'],
    },
  ],
  steps: [
    fundamentalsTeachingStep(
      'instructions',
      'Інструкції (system / developer)',
      'Правила, формат, межі поведінки.',
      {
        whatUk: 'Хто додає: **команда продукту / harness**. Навіщо: стабільні правила investigation. Шум: дубльовані довгі policy, застарілі інструкції.',
        inputUk: 'Конфіг агента, версія policy.',
        outputUk: 'Повідомлення з роллю system або developer у messages.',
        linkUk: 'Ролі messages у виклику.',
        exampleUk: '«Не вигадуй шляхи до файлів; використовуй лише дозволені tools» для login_spec.',
        failureUk: 'Суперечливі system-рядки в різних середовищах.',
        testUk: 'Порівняти system prompt staging vs prod; перевірити відсутність секретів у логах.',
      },
      'Policy',
    ),
    fundamentalsTeachingStep(
      'user-task',
      'Поточний запит',
      'Задача користувача або агента зараз.',
      {
        whatUk: 'Хто додає: **користувач або orchestrator**. Навіщо: що зробити в цьому кроці. Шум: надто довгий дубль тікета.',
        inputUk: 'Текст задачі, id інциденту.',
        outputUk: 'User message у масиві.',
        linkUk: 'Після instructions, перед tool results попередніх кроків.',
        exampleUk: '«Поясни падіння login_spec і запропонуй наступний крок QA».',
        failureUk: 'PII в user message без redaction.',
        testUk: 'Fixture запиту без токенів доступу; перевірка маскування в trace.',
      },
      'User',
    ),
    fundamentalsTeachingStep(
      'history',
      'Історія діалогу',
      'Попередні user/assistant повідомлення.',
      {
        whatUk:
          'Хто додає: **клієнт** (чат UI або harness), який зберігає thread і **передає заново** потрібні репліки. Модель не «пам’ятає» минулий тиждень без цього.',
        inputUk: 'Збережений thread id, обрізана історія.',
        outputUk: 'Серія assistant/user messages у поточному виклику.',
        linkUk: 'Роль assistant у messages.',
        exampleUk: 'Другий крок investigation: в історії вже є перша гіпотеза моделі.',
        failureUk: 'Випадково відправили чужий thread — витік контексту.',
        testUk: 'Тест isolation tenant/session; довжина history у логах.',
      },
      'Пам’ять',
    ),
    fundamentalsTeachingStep(
      'docs',
      'Документи, RAG, код',
      'Фрагменти з індексу або репозиторію.',
      {
        whatUk: 'Хто додає: **RAG pipeline або harness** після search. Навіщо: факти для grounded відповіді. Шум: зайві chunk, дубль wiki, застарілий postmortem.',
        inputUk: 'Retrieval query, chunk ids.',
        outputUk: 'Текст у user/system або tool-augmented messages.',
        linkUk: 'Не плутати з tool result після read file.',
        exampleUk: 'Chunk postmortem login_spec у prompt перед відповіддю.',
        failureUk: 'Chunk без ACL — витік чужого tenant.',
        testUk: 'Перевірка chunk_id у trace і відповідності citation.',
      },
      'RAG',
    ),
    fundamentalsTeachingStep(
      'tools',
      'Tools: описи й результати',
      'Schema в prompt; результати після виконання кодом.',
      {
        whatUk:
          '**Tool definitions** додає harness (що дозволено). **Tool results** — після виконання handler (наприклад фрагмент report). Це **input поточного** виклику, не «майбутня відповідь» моделі.',
        inputUk: 'OpenAPI/tool schema; payload після read_report.',
        outputUk: 'Messages role=tool або structured blocks (залежить від API).',
        linkUk: 'Роль tool у messages; токени з’їдають ліміт вікна.',
        exampleUk: 'Після read_playwright_report у context з’являється snippet HTML — ще не assistant text.',
        failureUk: 'Величезний tool result без truncation — вибиває history.',
        testUk: 'Max size tool result; чи критичний факт залишився після trim.',
      },
      'Tools',
    ),
    fundamentalsTeachingStep(
      'limits',
      'Вікно, input і output budget',
      'Три різні обмеження в одному виклику.',
      {
        whatUk:
          '**Context window** — верхня межа токенів для всього виклику. **Input** — те, що ви **вже передали** (instructions + history + tools + …). **Output budget** — скільки токенів **дозволено згенерувати** (max_tokens / reserved у API). Майбутня відповідь **не** лежить у prompt як готовий текст.',
        inputUk: 'Ліміт моделі + max_tokens у запиті.',
        outputUk: 'Completion + finish_reason (напр. length).',
        linkUk: 'Lost in the middle у довгому prompt; max output tokens у sampling.',
        exampleUk:
          'Скорочення trace «для економії» випадково прибрало рядок про locator — модель не «забула», їй просто не передали.',
        failureUk: 'Плутати input tokens у bill з «місцем під відповідь».',
        testUk: 'Лог prompt_tokens vs completion_tokens; assert критичний факт у trimmed context.',
      },
      'Ліміти',
    ),
  ],
};
