import type { StudySectionAside } from './study-section-aside-types';

/** Concept-04: короткі нотатки в правій колонці (повний зміст — у центрі). */
const BY_SECTION: Record<string, StudySectionAside> = {
  'Навіщо потрібен harness?': {
    sectionNoteTermUk: 'Harness',
    sectionNoteExplanationUk:
      'Код застосунку навколо моделі. Він готує запит, перевіряє запропоновані дії та керує кроками розслідування.',
  },
  'Один run після login_spec': {
    sectionNoteTrackCard: {
      titleUk: 'Як простежити один run',
      rows: [
        {
          labelUk: 'Початок',
          bodyUk: 'CI повідомляє про падіння login_spec, код створює runId.',
        },
        {
          labelUk: 'Кроки',
          bodyUk:
            'під цим runId записують виклики моделі, рішення про дозвіл і результати інструментів.',
        },
        {
          labelUk: 'Завершення',
          bodyUk: 'trace показує підсумок або причину зупинки.',
        },
      ],
      footnoteUk: 'За runId QA може зібрати події одного розслідування в правильному порядку.',
    },
  },
  'З чого складається harness?': {
    sectionNoteUk:
      'Розділяйте model client, policy, executor і state. Кожна частина має свою відповідальність у trace.',
  },
  'Послідовність циклу (loop)': {
    sectionNoteUk:
      'Після deny немає виклику інструмента. Після allow результат інструмента — факт, а не текст моделі.',
  },
  'Де код, а де LLM?': {
    sectionNoteUk:
      'Модель пропонує й пояснює. Harness перевіряє, викликає tools і вирішує, чи продовжувати run.',
  },
  'Де може зламатися?': {
    sectionNoteUk:
      'Спочатку визначте шар: пропозиція, validation, policy, executor чи запис state.',
  },
  'Як QA це тестує?': {
    sectionNoteUk:
      'Оберіть рівень перевірки в центральному блоці: handler, harness або разом із моделлю.',
  },
  'Production і observability': {
    sectionNoteUk:
      'Trace має зшивати події одного runId без секретів. Пропозиція моделі ≠ виконання інструмента.',
  },
  'Запам’ятати та співбесіда': {
    sectionNoteUk:
      'Поясніть відповідь на прикладі login_spec: хто перевіряє tool call і де зупиняється run.',
  },
};

export function getHarnessSectionAside(navTitle: string): StudySectionAside {
  const exact = BY_SECTION[navTitle];
  if (exact) return exact;
  const hit = Object.entries(BY_SECTION).find(([key]) => navTitle.startsWith(key));
  if (hit) return hit[1];
  return {
    suppressSectionContext: true,
  };
}

export const HARNESS_ASIDE_META = {
  sectionCount: 9,
  tocHint: '',
  schemaTitle: 'Схема курсу',
  schemaBlurb: 'Інтерактивний цикл агента з панелями на кроках:',
  atlasTo: '/agent-architecture?tab=harness',
  atlasLinkLabel: 'Відкрити схему Agent Harness',
  compactAside: true,
} as const;
