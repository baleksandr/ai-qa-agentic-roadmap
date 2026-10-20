import type { StudyLessonAsideMeta, StudySectionAside } from './study-section-aside-types';

const BY_SECTION: Record<string, StudySectionAside> = {
  'Навіщо кілька агентів': {
    sectionNoteUk:
      'Investigation збирає факти. Coding готує зміну за наявності підстави. Review перевіряє саме цю версію зміни. Передача між ними має зберігати доказ і правильні ідентифікатори.',
  },
  Приклад: {
    sectionNoteUk:
      'Agent A передає докази, Agent B готує patch. Код контролює доступ до репозиторію та відокремлює пропозицію зміни від її фактичного запису.',
  },
  'Де код, а де LLM': {
    sectionNoteUk:
      'Кожен агент має власний run моделі. Handoff, маршрут і allow-list — відповідальність коду координації, не тексту prompt.',
  },
  'Де може зламатися': {
    sectionNoteUk:
      'Перевіряйте конфлікт доступів, цикли делегування й те, чи гіпотеза investigation не стала підставою для write без evidence.',
  },
  'Запам’ятати': {
    sectionNoteUk:
      'На співбесіді простежте handoff ABC-123: який CI запуск, яке спостереження з джерелом і чи мав Coding Agent право готувати зміну.',
  },
};

export function getMultiAgentSectionAside(navTitle: string): StudySectionAside {
  const hit = Object.entries(BY_SECTION).find(([key]) => navTitle.startsWith(key));
  if (hit) return hit[1];
  return { suppressSectionContext: true };
}

export const MULTI_AGENT_ASIDE_META: StudyLessonAsideMeta = {
  sectionCount: 5,
  tocHint: '',
  schemaTitle: '',
  schemaBlurb: '',
  atlasTo: '',
  atlasLinkLabel: '',
};
