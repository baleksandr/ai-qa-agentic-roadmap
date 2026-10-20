import type { StudyLessonAsideMeta, StudySectionAside } from './study-section-aside-types';

const BY_SECTION: Record<string, StudySectionAside> = {
  'Навіщо guardrails': {
    sectionNoteUk:
      'Оберіть картку ліворуч: пропозиція моделі, schema, policy та approval перед executor. Промпт не замінює перевірку прав у коді.',
  },
  'Повний простий приклад': {
    sectionNoteUk:
      'Навчальний ланцюжок: read звіту → Jira з approve → заборонений tool відхиляється до handler. Injection у postmortem — межа untrusted data.',
  },
  Компоненти: {
    sectionNoteUk:
      'Validators, matrix, sandbox, allow/deny lists, budgets і approval UI — окремі шари trusted code.',
  },
  'Що передається між': {
    sectionNoteUk:
      'Proposed action + args → policy decision → sanitized input/output між кроками harness.',
  },
  Послідовність: {
    sectionNoteUk:
      'Input checks → відповідь моделі → schema → policy engine → human gate → executor — у такому порядку в trace.',
  },
  'Де код, а де LLM': {
    sectionNoteUk:
      'LLM лише пропонує; verdict і виконання — код. Risky writes — людина після needs_approval.',
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
    sectionNoteUk: 'policy decision, rule id, actor, resource, approval latency — мінімум для prod debug.',
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
