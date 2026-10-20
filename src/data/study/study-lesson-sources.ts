/** Оформлений блок «Джерела та примітки» (не показувати «V10 Concept N» учню). */
export type StudyLessonSourceKind = 'book' | 'teachingExample' | 'inApp';

export type StudyLessonSourceEntry = {
  id: string;
  kind: StudyLessonSourceKind;
  titleUk: string;
  /** Автор, організація або контекст видання. */
  attributionUk?: string;
  /** Лише перевірені посилання (внутрішні маршрути курсу або офіційні URL з інвентаря). */
  href?: string;
  /** Одне речення: що з уроку можна звірити. */
  verifyUk: string;
};

const BOOK_TITLE = 'AI Engineering';
const BOOK_ATTRIBUTION = 'Akshay Pachaar & Avi Chawla, 2025 Edition';

const BY_TOPIC: Record<string, StudyLessonSourceEntry[]> = {
  fundamentals: [
    {
      id: 'fund-book',
      kind: 'book',
      titleUk: BOOK_TITLE,
      attributionUk: BOOK_ATTRIBUTION,
      verifyUk:
        'Базові ідеї LLM, токени та навчання моделі — орієнтир для термінів у словнику fundamentals.',
    },
    {
      id: 'fund-example',
      kind: 'teachingExample',
      titleUk: 'Навчальний приклад',
      verifyUk:
        'Умовні сценарії з investigation і CI у наступних темах — для закріплення механізму, не звіт реального запуску.',
    },
  ],
  'concept-01': [
    {
      id: 'c01-book',
      kind: 'book',
      titleUk: BOOK_TITLE,
      attributionUk: BOOK_ATTRIBUTION,
      verifyUk:
        'Типи пам’яті для агентів і роль контексту — друк. с. 195–196; зв’язок RAG і memory — с. 143.',
    },
    {
      id: 'c01-example',
      kind: 'teachingExample',
      titleUk: 'Навчальний приклад',
      verifyUk:
        'Умовні runId, login_spec і investigation — узгоджені з іншими темами, не продакшн-дані.',
    },
  ],
  'concept-02': [
    {
      id: 'c02-book',
      kind: 'book',
      titleUk: BOOK_TITLE,
      attributionUk: BOOK_ATTRIBUTION,
      verifyUk:
        'Патерни агентів і deployment — орієнтири (друк. с. 199, 260); окремої глави «orchestration» у книзі немає.',
    },
    {
      id: 'c02-example',
      kind: 'teachingExample',
      titleUk: 'Навчальний приклад',
      verifyUk:
        'Nightly login_spec, гілки fix / retry / escalation — умовні дані для перевірок orchestration.',
    },
  ],
  'concept-03': [
    {
      id: 'c03-book',
      kind: 'book',
      titleUk: BOOK_TITLE,
      attributionUk: BOOK_ATTRIBUTION,
      verifyUk:
        'Що таке RAG і workflow системи — друк. с. 106; етапи offline і runtime — с. 113–115.',
    },
    {
      id: 'c03-example',
      kind: 'teachingExample',
      titleUk: 'Навчальний приклад',
      verifyUk:
        'QA Regression Investigation Agent, умовні INC-* і login_spec — для механізму RAG, не live wiki.',
    },
  ],
  'concept-04': [
    {
      id: 'c04-book',
      kind: 'book',
      titleUk: BOOK_TITLE,
      attributionUk: BOOK_ATTRIBUTION,
      verifyUk:
        'Building blocks і шари agentic AI — друк. с. 181 і 240; термін «harness» у книзі не вводиться окремо.',
    },
    {
      id: 'c04-example',
      kind: 'teachingExample',
      titleUk: 'Навчальний приклад',
      verifyUk:
        'readPlaywrightReport після login_spec — узгоджено з уроком Tool Calling, не фактичний виклик API.',
    },
  ],
  'concept-06': [
    {
      id: 'c06-book',
      kind: 'book',
      titleUk: BOOK_TITLE,
      attributionUk: BOOK_ATTRIBUTION,
      verifyUk:
        'Архітектура MCP, primitives і агенти з MCP — друк. с. 264+ (звіряти з актуальною специфікацією протоколу).',
    },
    {
      id: 'c06-example',
      kind: 'teachingExample',
      titleUk: 'Навчальний приклад',
      verifyUk: 'Читання CI через MCP після падіння login_spec — навчальний run, не prod tenant.',
    },
  ],
  'concept-07': [
    {
      id: 'c07-book',
      kind: 'book',
      titleUk: BOOK_TITLE,
      attributionUk: BOOK_ATTRIBUTION,
      verifyUk:
        'Skills як context engineering — розділ про Claude Skills, друк. с. 168 (екосистемний контекст, не 1:1 з UI курсу).',
    },
    {
      id: 'c07-example',
      kind: 'teachingExample',
      titleUk: 'Навчальний приклад',
      verifyUk: 'Investigation skill після login_spec — умовний пакет інструкцій і дозволів.',
    },
  ],
  'concept-10': [
    {
      id: 'c10-book',
      kind: 'book',
      titleUk: BOOK_TITLE,
      attributionUk: BOOK_ATTRIBUTION,
      verifyUk:
        'Building blocks агента і відмінність function calling від MCP — друк. с. 181 і 281.',
    },
    {
      id: 'c10-example',
      kind: 'teachingExample',
      titleUk: 'Навчальний приклад',
      verifyUk:
        'readPlaywrightReport і login_spec — для закріплення механізму, не результат реального tool run.',
    },
    {
      id: 'c10-atlas',
      kind: 'inApp',
      titleUk: 'Інтерактивна схема Tool Calling',
      href: '/agent-architecture?tab=tool-calling',
      verifyUk: 'Покроковий потік proposal → policy → handler на схемі курсу.',
    },
  ],
  'concept-11': [
    {
      id: 'c11-book',
      kind: 'book',
      titleUk: BOOK_TITLE,
      attributionUk: BOOK_ATTRIBUTION,
      verifyUk:
        'Планування як частина agent workflow і context engineering — друк. с. 158 (не окрема глава «Planning»).',
    },
    {
      id: 'c11-example',
      kind: 'teachingExample',
      titleUk: 'Навчальний приклад',
      verifyUk: 'План перевірок для timeout на #login-btn — умовний сценарій, не live agent trace.',
    },
  ],
  'concept-12': [
    {
      id: 'c12-book',
      kind: 'book',
      titleUk: BOOK_TITLE,
      attributionUk: BOOK_ATTRIBUTION,
      verifyUk:
        'Reasoning prompts і pattern ReAct — друк. с. 51 і 205 як орієнтири для grounding висновків.',
    },
    {
      id: 'c12-example',
      kind: 'teachingExample',
      titleUk: 'Навчальний приклад',
      verifyUk:
        'Timeout на #login-btn і перевірка через звіт/trace — навчальні фікстури, не prod логи.',
    },
  ],
  'concept-13': [
    {
      id: 'c13-book',
      kind: 'book',
      titleUk: BOOK_TITLE,
      attributionUk: BOOK_ATTRIBUTION,
      verifyUk:
        'Коли fine-tune, LoRA і межі повного FT — друк. с. 66+; порівняння prompt / RAG / fine-tune — с. 124.',
    },
    {
      id: 'c13-example',
      kind: 'teachingExample',
      titleUk: 'Навчальний приклад',
      verifyUk:
        'Гіпотетичний крок «донавчити модель агента» — для порівняння підходів, не план релізу.',
    },
  ],
  'concept-14': [
    {
      id: 'c14-book',
      kind: 'book',
      titleUk: BOOK_TITLE,
      attributionUk: BOOK_ATTRIBUTION,
      verifyUk:
        'Роль system prompt, reasoning prompts і структурованого виводу — друк. с. 49+.',
    },
    {
      id: 'c14-example',
      kind: 'teachingExample',
      titleUk: 'Навчальний приклад',
      verifyUk: 'System prompt і формат відповіді для login_spec — умовні шаблони курсу.',
    },
  ],
  'concept-15': [
    {
      id: 'c15-book',
      kind: 'book',
      titleUk: BOOK_TITLE,
      attributionUk: BOOK_ATTRIBUTION,
      verifyUk:
        'Навіщо vector database в RAG і embeddings — друк. с. 107–109.',
    },
    {
      id: 'c15-example',
      kind: 'teachingExample',
      titleUk: 'Навчальний приклад',
      verifyUk: 'Пошук фрагментів postmortem для investigation — умовний індекс, не prod store.',
    },
  ],
  'concept-09': [
    {
      id: 'c09-book',
      kind: 'book',
      titleUk: BOOK_TITLE,
      attributionUk: BOOK_ATTRIBUTION,
      verifyUk:
        'Патерни multi-agent systems — друк. с. 242 як орієнтир координації спеціалізованих агентів.',
    },
    {
      id: 'c09-example',
      kind: 'teachingExample',
      titleUk: 'Навчальний приклад',
      verifyUk:
        'ABC-123, Investigation і Coding Agent після login_spec — навчальний дизайн, не вимога двох агентів для кожного збою.',
    },
  ],
  'concept-16': [
    {
      id: 'c16-book',
      kind: 'book',
      titleUk: BOOK_TITLE,
      attributionUk: BOOK_ATTRIBUTION,
      verifyUk:
        'Context engineering workflow і agent design patterns — друк. с. 158 і 199 як загальні орієнтири.',
    },
    {
      id: 'c16-example',
      kind: 'teachingExample',
      titleUk: 'Навчальний приклад',
      verifyUk:
        'ABC-123, Agent A/B, handoff JSON і login_spec — фікстури для навчання, не контракт prod API.',
    },
  ],
  'concept-08': [
    {
      id: 'c08-a2a-spec',
      kind: 'inApp',
      titleUk: 'A2A Protocol — офіційна специфікація',
      href: 'https://a2a-protocol.org/latest/specification/',
      verifyUk:
        'Терміни Message, Task, статусу та результату в урокі звіряйте з офіційною специфікацією; навчальні TaskSpec і PatchProposal — лише приклад продукту.',
    },
    {
      id: 'c08-example',
      kind: 'teachingExample',
      titleUk: 'Навчальний приклад',
      verifyUk:
        'ABC-123, QA- і dev-сервіси, умовні структури TaskSpec і PatchProposal — для закріплення механізму, не опис конкретного комерційного продукту.',
    },
  ],
  'concept-17': [
    {
      id: 'c17-book',
      kind: 'book',
      titleUk: BOOK_TITLE,
      attributionUk: BOOK_ATTRIBUTION,
      verifyUk:
        'Guardrails і red teaming на рівні застосунку — друк. с. 193–194 і 352 (курс глибший за одну сторінку).',
    },
    {
      id: 'c17-example',
      kind: 'teachingExample',
      titleUk: 'Навчальний приклад',
      verifyUk:
        'read report vs createJira vs заборонений tool — сценарії для policy, не реальні credentials.',
    },
  ],
};

export function getStudyLessonSources(topicId: string): StudyLessonSourceEntry[] {
  return BY_TOPIC[topicId] ?? [];
}

export function hasStudyLessonSources(topicId: string): boolean {
  return getStudyLessonSources(topicId).length > 0;
}
