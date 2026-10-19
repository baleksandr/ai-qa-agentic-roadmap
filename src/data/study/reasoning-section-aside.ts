import type { StudySectionAside } from './study-section-aside-types';

const BY_SECTION: Record<string, StudySectionAside> = {
  'Навіщо reasoning в агенті?': {
    sectionNoteUk:
      'Reasoning тут — перегляд припущень за доступними даними, а не показ внутрішнього ланцюга думок моделі.',
  },
  'Де це в розслідуванні login_spec?': {
    sectionNoteUk:
      'Відомий лише симптом timeout. Гіпотези не подавайте як установлену причину до перевірки.',
  },
  'З чого складається механізм?': {
    sectionNoteUk:
      'Модель пропонує й пояснює. Код передає факти, викликає інструменти й тримає ліміти run.',
  },
  'Послідовність': {
    sectionNoteUk:
      'Цей блок — рішення після відповіді моделі, а не повтор хронології з §2.',
  },
  'Де код, а де LLM?': {
    sectionNoteUk:
      'Модель не бачить звіт, доки код не передасть вміст. Схвалення людини — лише для ризикових дій за політикою.',
  },
  'Де може зламатися?': {
    sectionNoteUk:
      'Шукайте твердження без доказу, вигаданий вміст після помилки читання та зациклення без нових фактів.',
  },
  'Як QA це тестує?': {
    sectionNoteStyle: 'compact-strip',
    sectionNoteUk:
      'Спочатку перевірте передачу даних кодом. Потім оцініть, чи висновок моделі підтримують отримані факти.',
  },
  Production: {
    sectionNoteStyle: 'compact-strip',
    sectionNoteUk:
      'У production trace має пояснювати рішення агента, а журнали — не розкривати зайві дані.',
  },
  'Запам’ятати та співбесіда': {
    sectionNoteUk:
      'Гіпотеза вказує, що перевірити. Висновок не виходить за межі отриманих даних.',
  },
};

export function getReasoningSectionAside(navTitle: string): StudySectionAside {
  const exact = BY_SECTION[navTitle];
  if (exact) return exact;
  const hit = Object.entries(BY_SECTION).find(([key]) => navTitle.startsWith(key));
  if (hit) return hit[1];
  return { sectionNoteUk: 'Повний зміст розділу — у центральному блоці уроку.' };
}

export const REASONING_ASIDE_META = {
  sectionCount: 9,
  tocHint: '',
  schemaTitle: 'Схема курсу',
  schemaBlurb: 'Інтерактивний цикл агента з панелями на кроках:',
  atlasTo: '/agent-architecture?tab=agent',
  atlasLinkLabel: 'Відкрити схему агента',
  compactAside: true,
} as const;
