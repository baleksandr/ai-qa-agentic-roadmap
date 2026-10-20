import type { StudySectionAside } from './study-section-aside-types';

/** Concept-10: лише короткі нотатки в правій колонці (повний зміст — у центрі). */
const BY_SECTION: Record<string, StudySectionAside> = {
  'Навіщо потрібен tool calling?': {
    sectionNoteUk:
      'Текст моделі може підказати дію. Інструмент запускає код застосунку після перевірок.',
  },
  'Один виклик tool у run investigation': {
    sectionNoteUk:
      'Простежте, у який момент з’являються фактичні дані зі звіту. Пропозиція моделі з’являється раніше за читання файла.',
  },
  'Які дані передаються під час Tool Calling?': {
    sectionNoteUk:
      'Опис інструмента, пропозиція моделі й результат виконання — три різні повідомлення. Перевіряйте, яке з них справді доступне на кожному етапі.',
  },
  'Де код, а де LLM?': {
    sectionNoteUk:
      'Модель пропонує й пояснює. Код перевіряє доступ, виконує дію та керує розслідуванням.',
  },
  'Де може зламатися?': {
    sectionNoteUk:
      'Спершу визначте місце збою: пропозиція, перевірка, виконання чи обробка результату. Від цього залежить перевірка QA.',
  },
  'Як QA це тестує?': {
    sectionNoteUk:
      'Виберіть категорію в центральному блоці. Її панель показує вхідні дані, дію QA й очікуваний результат.',
  },
  'Production і observability': {
    sectionNoteUk:
      'За trace відрізняйте пропозицію моделі від рішення коду й виконання інструмента. Повне пояснення кожної метрики — у картках ліворуч.',
  },
  'Запам’ятати та співбесіда': {
    sectionNoteUk:
      'Спробуйте пояснити відповідь своїми словами до відкриття підказки. Для прикладу використайте один збій login_spec.',
  },
};

export function getToolCallingSectionAside(navTitle: string): StudySectionAside {
  const exact = BY_SECTION[navTitle];
  if (exact) return exact;
  const hit = Object.entries(BY_SECTION).find(([key]) => navTitle.startsWith(key));
  if (hit) return hit[1];
  return {
    suppressSectionContext: true,
  };
}

export const TOOL_CALLING_ASIDE_META = {
  sectionCount: 8,
  tocHint: '',
  schemaTitle: 'Схема курсу',
  schemaBlurb: 'Інтерактивний ланцюг з поясненнями на кожному кроці:',
  atlasTo: '/agent-architecture?tab=tool-calling',
  atlasLinkLabel: 'Відкрити схему Tool Calling',
  compactAside: true,
} as const;
