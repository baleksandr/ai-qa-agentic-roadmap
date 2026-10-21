import type { StudyLessonAsideMeta, StudySectionAside } from './study-section-aside-types';

const BY_SECTION: Record<string, StudySectionAside> = {
  'Навіщо guardrails': {
    sectionNoteUk:
      'Модель може запропонувати будь-яку дію, але право на виконання визначає код. Guardrails перевіряють кожен виклик до того, як він спричинить реальні зміни.',
  },
  'Повний простий приклад': {
    sectionNoteUk:
      'Різні інструменти мають різні правила доступу: читання дозволених логів може бути дозволене, запис у production БД — заборонений, а створення Jira bug — вимагати підтвердження. Інструмент, якого немає в реєстрі, викликати не можна.',
  },
  Компоненти: {
    sectionNoteUk:
      'Validators перевіряють дані, policy matrix визначає дозволені дії, sandbox обмежує доступ до ресурсів, а allow/deny lists, budgets і approval UI додають контроль доступу, витрат і ризикових операцій. Це окремі шари захисту, які працюють разом.',
  },
  'Що передається між': {
    sectionNoteUk:
      'Модель передає пропозицію дії з аргументами, policy engine повертає рішення, а executor виконує лише допущені виклики. Результат інструмента перевіряється перед передаванням у наступний контекст LLM.',
  },
  Послідовність: {
    sectionNoteUk:
      'Guardrails проходять послідовні перевірки: вхідні дані, відповідь моделі, схема виклику, policy, погодження та виконання. DENY зупиняє дію, а NEEDS_APPROVAL призупиняє її до підтвердження.',
  },
  'Де код, а де LLM': {
    sectionNoteUk:
      'LLM аналізує дані й пропонує наступну дію, але не визначає власні права. Код перевіряє аргументи, доступ і умови виконання, а ризикові операції передає на погодження людині.',
  },
  'впасти': {
    sectionNoteUk:
      'Занадто permissive policy, різні правила для MCP і local tools, false positive — типові зони регресії.',
  },
  Security: {
    sectionNoteUk: 'Least privilege, sandbox, audit trail — guardrails як шар безпеки, не «порада в prompt».',
  },
  тестувати: {
    sectionNoteUk:
      'Unauthorized resource, malformed args, approval bypass, rate limit — очікуваний deny у trace для кожного кейсу.',
  },
  Observability: {
    sectionNoteTrackCard: {
      titleUk: 'Для ефективного production debug важливо фіксувати:',
      rows: [
        {
          labelUk: 'Policy decision',
          bodyUk: 'яке рішення ухвалила система: `allow` чи `deny`.',
        },
        {
          labelUk: 'Rule ID',
          bodyUk: 'яке правило вплинуло на рішення.',
        },
        {
          labelUk: 'Actor і resource',
          bodyUk: 'хто виконав дію та до якого ресурсу звертався.',
        },
        {
          labelUk: 'Approval latency',
          bodyUk: 'скільки часу тривало очікування погодження.',
        },
      ],
      footnoteUk:
        'Ці дані допомагають зрозуміти, хто виконив дію, чому її дозволили або заблокували та де виникла затримка.',
    },
  },
  Production: {
    sectionNoteUk: 'Audit rule_id і version policies разом із deploy harness.',
  },
  Запам: {
    sectionNoteUk: 'Guardrails — trusted code навколо моделі, не частина weights.',
  },
};

export function getGuardrailsSectionAside(navTitle: string): StudySectionAside {
  const hit = Object.entries(BY_SECTION).find(([key]) => navTitle.toLowerCase().includes(key.toLowerCase()));
  if (hit) return hit[1];
  return { suppressSectionContext: true };
}

export const GUARDRAILS_ASIDE_META: StudyLessonAsideMeta = {
  sectionCount: 8,
  tocHint: '',
  schemaTitle: '',
  schemaBlurb: '',
  atlasTo: '/agent-architecture?tab=agent',
  atlasLinkLabel: 'Схема агента з policy',
};
