import type { StudyLessonAsideMeta, StudySectionAside } from './study-section-aside-types';

const BY_SECTION: Record<string, StudySectionAside> = {
  'Навіщо потрібна orchestration?': {
    sectionNoteUk:
      'Оркестрація узгоджує готовність задач, версії результатів і переходи після помилок. Для ABC-123 це стосується кількох учасників одночасно.',
  },
  'Де це в investigation після login_spec?': {
    sectionNoteUk:
      'Готовність даних відкриває investigation. Його фактичний результат визначає наступну гілку. Людина долучається там, де цього потребує задача або правило доступу.',
  },
  'З чого складається механізм?': {
    sectionNoteUk:
      'Модель workflow визначає залежності. Механізм запуску передає готову задачу виконавцю. Спільний стан і записи подій дозволяють перевірити, що відбулося насправді.',
  },
  'Послідовність під капотом': {
    sectionNoteUk:
      'Workflow зберігає, що вже сталося. Оркестратор запускає готову задачу, отримує її фактичний результат і за правилами продукту визначає наступний перехід.',
  },
  'Де код, а де LLM?': {
    sectionNoteUk:
      'CI повідомляє, що сталося з тестом. Модель допомагає розібрати збій. Код координує задачі й контролює виконання. Людина вирішує лише ті питання, які workflow передає їй за правилами продукту.',
  },
  'Де може зламатися?': {
    sectionNoteUk:
      'Під час розбору збою перевіряйте, яка задача була готова, яку подію отримали й чому orchestrator обрав наступну гілку. Фінальний статус без цього маршруту може приховати помилку.',
  },
  'Як QA це тестує?': {
    sectionNoteUk:
      'У тесті orchestration перевіряйте події, переходи й фактичні виклики. Правильний фінальний текст не доводить, що workflow дотримався порядку та дозволів.',
  },
  Production: {
    sectionNoteUk:
      'Час і повтори показують, де workflow затримується. Статуси очікування пояснюють, чого бракує для наступного кроку. Версія workflow дозволяє зрозуміти, за якими правилами працює кожне розслідування.',
  },
  Запам: {
    sectionNoteUk: 'Orchestration — порядок і правила між учасниками. Не LLM.',
  },
};

export function getOrchestrationSectionAside(navTitle: string): StudySectionAside {
  const hit = Object.entries(BY_SECTION).find(([key]) => navTitle.startsWith(key));
  if (hit) return hit[1];
  return { suppressSectionContext: true };
}

export const ORCHESTRATION_ASIDE_META: StudyLessonAsideMeta = {
  sectionCount: 8,
  tocHint: '',
  schemaTitle: '',
  schemaBlurb: '',
  atlasTo: '',
  atlasLinkLabel: '',
  compactAside: true,
};
