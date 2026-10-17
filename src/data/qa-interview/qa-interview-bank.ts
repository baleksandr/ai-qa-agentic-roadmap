import type { StudyInterviewQuestion } from '../study/study-interview-types';
import { topicStudyHref } from '../../lib/topicStudyHref';

/** Категорія питань у банку QA-співбесіди (майбутні теми — нові записи в `categories`). */
export type QaInterviewCategory = {
  categoryId: string;
  titleUk: string;
  questions: StudyInterviewQuestion[];
};

export type QaInterviewBank = {
  bankId: string;
  pageTitleUk: string;
  pageLeadUk: string;
  categories: QaInterviewCategory[];
};

const AI_BASICS_IN_QA_QUESTIONS: StudyInterviewQuestion[] = [
  {
    id: 'ai-basics-daily-ai',
    questionUk: 'Як ви використовуєте AI у щоденній роботі QA?',
    answerBriefUk:
      'AI може допомогти скласти чернетку тест-кейсів, пояснити незнайомий код, запропонувати Playwright-тест або підсумувати вимоги. Я перевіряю результат перед використанням: чи відповідає він вимогам, чи існують згадані API й селектори та чи проходить тест. Приклад на співбесіді варто описувати лише з власного досвіду, не видаючи навчальний сценарій за реальний проєкт.',
    pitfallUk: 'Описувати login_spec або інші приклади курсу як свій робочий кейс.',
  },
  {
    id: 'ai-basics-tools',
    questionUk: 'З якими AI-інструментами ви працювали?',
    answerBriefUk:
      'Назвіть тільки ті інструменти, якими справді користувалися, наприклад ChatGPT, Claude або GitHub Copilot. Для кожного додайте одну конкретну задачу та спосіб перевірки результату. Якщо досвіду з певним інструментом немає, не включайте його до відповіді.',
    pitfallUk: 'Перелічити всі популярні назви, ніби ви щодня користуєтесь кожним із них.',
  },
  {
    id: 'ai-basics-replace-qa',
    questionUk: 'Чи може AI замінити QA-інженера?',
    answerBriefUk:
      'AI може прискорити підготовку чернеток і аналіз даних. Але команді все одно потрібно визначити, що саме перевіряти, оцінити ризики, зіставити висновки з доказами й прийняти рішення про якість продукту. Тому відповідальність за перевірку результату та рішення про реліз залишається за людьми й процесами команди.',
    pitfallUk: 'Сказати, що «достатньо одного промпту» і ручне тестування більше не потрібне.',
  },
  {
    id: 'ai-basics-prompt-engineering',
    questionUk: 'Що таке prompt engineering?',
    answerBriefUk:
      'Це підготовка інструкцій і контексту для задачі моделі: що потрібно зробити, які дані дозволено використати, який формат відповіді очікується та як позначати невизначеність. Чіткіший запит може допомогти отримати корисніший результат, але не гарантує правильності. QA перевіряє результат за вимогами й фактичними даними.',
    pitfallUk: 'Вважати, що ідеальний промпт замінює перевірку фактів і тестів.',
  },
  {
    id: 'ai-basics-limitation',
    questionUk: 'Назвіть одне обмеження AI у тестуванні.',
    answerBriefUk:
      'Модель може впевнено назвати неіснуючий селектор або зробити висновок без актуального звіту тесту. Наприклад, після падіння login_spec вона припускає, що змінився локатор. Поки QA не звірив це з DOM, кодом тесту й trace відповідного запуску, таку відповідь не можна подавати як установлену причину.',
    pitfallUk: 'Прийняти впевнену гіпотезу моделі без DOM, коду тесту й trace цього run.',
  },
];

/** Єдине джерело питань для розділу «Питання для QA-співбесіди» на карті маршруту. */
export const QA_INTERVIEW_BANK: QaInterviewBank = {
  bankId: 'qa-interview',
  pageTitleUk: 'Питання для QA-співбесіди',
  pageLeadUk:
    'Питання згруповані за темами. Сформулюйте відповідь своїми словами, потім відкрийте підказку. Позначки самооцінки зберігаються лише в цьому браузері.',
  categories: [
    {
      categoryId: 'ai-basics-in-qa-work',
      titleUk: 'Основи AI в роботі QA',
      questions: AI_BASICS_IN_QA_QUESTIONS,
    },
  ],
};

export const QA_INTERVIEW_BANK_NEXT_LINKS = [
  {
    to: topicStudyHref('fundamentals'),
    label: 'Основи AI та LLM',
    hintUk: '— словник курсу перед concepts.',
  },
  {
    to: topicStudyHref('concept-14'),
    label: 'Prompt Engineering',
    hintUk: '— інструкції й формат у messages.',
  },
  {
    to: topicStudyHref('concept-03'),
    label: 'RAG',
    hintUk: '— зовнішні факти перед відповіддю.',
  },
];
