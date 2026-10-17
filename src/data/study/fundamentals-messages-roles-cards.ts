import type { StudyTeachingCardsBundle } from './study-teaching-card-types';
import { fundamentalsTeachingStep } from './fundamentals-teaching-step';

export const FUNDAMENTALS_MESSAGES_ROLES_CARDS: StudyTeachingCardsBundle = {
  ariaLabel: 'Ролі messages у виклику моделі',
  presentation: 'concepts',
  conceptsHeadingUk: 'Ролі в масиві messages — не кроки pipeline',
  introCalloutLabelUk: 'Контекст',
  leadUk:
    'Сучасні API приймають масив messages з ролями (system, user, assistant, tool тощо). Точні назви й формат залежать від провайдера.\n\n' +
    'Нижче — типовий зміст для QA-агента після падіння login_spec.',
  conceptGroups: [{ headingUk: 'Ролі', stepKeys: ['system', 'user', 'assistant', 'tool'] }],
  steps: [
    fundamentalsTeachingStep(
      'system',
      'System / developer',
      'Політики, формат, межі.',
      {
        whatUk: 'Зазвичай містить правила investigation, формат відповіді, заборони. **Формує harness**, не модель.',
        inputUk: 'Версія policy з репозиторію.',
        outputUk: 'Перше (або окремі developer) messages.',
        linkUk: 'Блок інструкцій у context window.',
        exampleUk: '«Використовуй tools для звіту; не стверджуй факт без tool result».',
        failureUk: 'Не гарантує дотримання без перевірок і tools — лише задає рамку.',
        testUk: 'Чи потрапляє актуальний system у кожен виклик; без секретів у логах.',
      },
      'Policy',
    ),
    fundamentalsTeachingStep(
      'user',
      'User',
      'Поточна задача й дані від людини/системи.',
      {
        whatUk: 'Запит QA, фрагмент тікета, опис падіння login_spec, вкладені документи як текст.',
        inputUk: 'UI або orchestrator.',
        outputUk: 'User message(s).',
        linkUk: 'Поточний запит користувача в context.',
        exampleUk: '«Тест login_spec упав: element not found #login-btn».',
        failureUk: 'Не гарантує, що модель має повний trace — лише те, що передали.',
        testUk: 'Fixture user message у contract-тесті API клієнта.',
      },
      'Задача',
    ),
    fundamentalsTeachingStep(
      'assistant',
      'Assistant',
      'Попередні відповіді моделі в thread.',
      {
        whatUk: 'Історія згенерованих реплік і попередніх tool_call у форматі API — для наступного кроку діалогу.',
        inputUk: 'Збережений thread.',
        outputUk: 'Assistant messages у наступному запиті.',
        linkUk: 'Цикл next-token створює нові assistant tokens.',
        exampleUk: 'Перша гіпотеза «перевірте locator» перед другим викликом з tool result.',
        failureUk: 'Підміна assistant текстом від людини без мітки — плутає audit.',
        testUk: 'Порядок user/assistant/tool у логах відповідає реальному flow.',
      },
      'Історія',
    ),
    fundamentalsTeachingStep(
      'tool',
      'Tool result',
      'Результат виконання інструмента **кодом**.',
      {
        whatUk:
          'Після handler (read report, search) у messages потрапляє structured/text результат. Це **не** доказ, що модель сама виконала HTTP або читала диск — лише що **код** повернув payload.',
        inputUk: 'Output handler після policy check.',
        outputUk: 'Message role=tool (або еквівалент API).',
        linkUk: 'Tools у messages; у курсі — окремий урок tool calling.',
        exampleUk: 'Snippet HTML звіту після дозволеного read_playwright_report.',
        failureUk: 'Підроблений tool result у тесті без реального handler.',
        testUk: 'Trace містить correlation id handler; PII redacted; порядок після tool_call.',
      },
      'Доказ',
    ),
  ],
};
