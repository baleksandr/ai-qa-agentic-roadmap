import type { StudySectionAside } from './study-section-aside-types';

const BY_SECTION: Record<string, StudySectionAside> = {
  'Навіщо потрібні memory і state?': {
    sectionNoteLabeledLines: [
      { term: 'State', textUk: 'дані поточного розслідування.' },
      { term: 'Memory', textUk: 'відомості, збережені для майбутніх запусків.' },
      { term: 'Context builder', textUk: 'код, який вибирає дані для наступного запиту моделі.' },
    ],
  },
  'Де це в одному run після login_spec?': {
    sectionNoteTrackCard: {
      titleUk: 'Що простежуємо',
      rows: [
        {
          labelUk: 'Початок',
          bodyUk: 'CI повідомляє про timeout, код створює runId і початковий state.',
        },
        {
          labelUk: 'Під час run',
          bodyUk: 'кроки, checkpoint, context builder і відповіді моделі накопичуються в одному state.',
        },
        {
          labelUk: 'Пам’ять',
          bodyUk: 'минулі примітки можуть допомогти в context builder, але не замінюють факти поточного збою.',
        },
      ],
      footnoteUk: 'У trace кожна подія має належати правильному runId.',
    },
  },
  'З чого складається механізм?': {
    sectionNoteUk:
      'Розділяйте збереження поточного run, історію повідомлень, checkpoint і підготовку запиту до моделі.',
  },
  'Послідовність під капотом': {
    sectionNoteLabeledLines: [
      {
        term: 'Код застосунку',
        textUk:
          'створює run, зберігає його стан і готує запит до моделі.',
      },
      {
        term: 'Модель',
        textUk:
          'отримує підготовлений запит і повертає відповідь або пропозицію наступної дії. Далі код знову вирішує, що робити.',
      },
    ],
  },
  'Де код, а де LLM?': {
    sectionNoteUk: 'Модель не читає сховище memory напряму — лише переданий контекст.',
  },
  'Де може зламатися?': {
    sectionNoteUk: 'Шукайте змішання run, стару memory замість звіту та втрату state після рестарту.',
  },
  'Як QA це тестує?': {
    sectionNoteLabeledLines: [
      {
        term: 'Відновлення',
        textUk:
          'можливе лише тоді, коли застосунок зберігає потрібний стан і має механізм продовження run після перезапуску.',
      },
      {
        term: 'Ізоляція',
        textUk: 'між користувачами та run, зміст messages[] перед викликом моделі.',
      },
    ],
  },
  'Production і observability': {
    sectionNoteUk: 'Логи переходів state і читань memory без секретів у відкритому вигляді.',
  },
  'Запам’ятати та співбесіда': {
    sectionNoteUk:
      'Короткий блок «Запам’ятати», п’ять питань з відповідями UA/EN і прикладом login_spec, цільна відповідь для співбесіди.',
  },
};

export function getMemoryStateSectionAside(navTitle: string): StudySectionAside {
  const exact = BY_SECTION[navTitle];
  if (exact) return exact;
  const hit = Object.entries(BY_SECTION).find(([key]) => navTitle.startsWith(key));
  if (hit) return hit[1];
  return { sectionNoteUk: 'Повний зміст розділу — у центральному блоці уроку.' };
}

export const MEMORY_STATE_ASIDE_META = {
  sectionCount: 8,
  tocHint: '',
  schemaTitle: 'Схема курсу',
  schemaBlurb: 'Цикл агента зі state і context builder на схемі harness:',
  atlasTo: '/agent-architecture?tab=agent',
  atlasLinkLabel: 'Відкрити схему агента',
  compactAside: true,
} as const;
