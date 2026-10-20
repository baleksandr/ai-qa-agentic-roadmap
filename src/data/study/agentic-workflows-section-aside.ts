import type { StudyLessonAsideMeta, StudySectionAside } from './study-section-aside-types';

const BY_SECTION: Record<string, StudySectionAside> = {
  'Навіщо потрібні agentic workflows?': {
    sectionNoteUk:
      'Workflow пов’язує задачі та їхні результати. Агентний етап може мати власний harness run або бути частиною sub-workflow за архітектурою продукту. CI та перевірка умов — окремі задачі коду, їм не потрібен власний LLM run.',
  },
  Приклад: {
    sectionNoteUk:
      'Перший агент передає другому факти та їхні джерела. Другий готує конкретну версію зміни. Людина, якщо цього вимагає політика, схвалює визначену дію. CI окремо перевіряє результат зміни.',
  },
  'Agentic workflow і orchestration': {
    sectionNoteUk:
      'Workflow відповідає на питання «які задачі пов’язані та що вони передають». Orchestration відповідає на питання «коли, ким і за якими правилами ці задачі виконуються».',
  },
  'Де може зламатися?': {
    sectionNoteUk:
      'Наступний агент може діяти лише за результатом, який справді отримав і правильно розібрав. Відсутню передачу та несумісний формат не можна видавати за «доказів немає».',
  },
  Збої: {
    sectionNoteUk:
      'Наступний агент може діяти лише за результатом, який справді отримав і правильно розібрав. Відсутню передачу та несумісний формат не можна видавати за «доказів немає».',
  },
  Production: {
    sectionNoteUk:
      'Час етапів допомагає знайти затримку. Після часткового виконання workflow перевіряє фактичні наслідки й лише тоді застосовує передбачену продуктом наступну дію.',
  },
  'Запам’ятати та співбесіда': {
    sectionNoteUk:
      'На співбесіді простежте один результат через увесь workflow: який CI запуск виявив збій, який доказ Agent A передав Agent B, яку revision підготував Agent B і чи перевірив CI саме її.',
  },
};

export function getAgenticWorkflowsSectionAside(navTitle: string): StudySectionAside {
  const hit = Object.entries(BY_SECTION).find(([key]) => navTitle.startsWith(key));
  if (hit) return hit[1];
  return { suppressSectionContext: true };
}

export const AGENTIC_WORKFLOWS_ASIDE_META: StudyLessonAsideMeta = {
  sectionCount: 8,
  tocHint: '',
  schemaTitle: '',
  schemaBlurb: '',
  atlasTo: '',
  atlasLinkLabel: '',
  compactAside: true,
};
