import { getStudyLessonHero } from './study-lesson-heroes';
import { TOOL_CALLING_LEARNER_FLOW_ARROW_LINE } from './tool-calling-learner-flow';

/** Розширений блок «Що я зрозумію» + короткий опис уроку в змісті */
export function buildStudyLearningOutcomes(topicId: string, quickViewRaw: string): string {
  const trimmed = quickViewRaw.replace(/\s+/g, ' ').trim();
  if (topicId === 'concept-03') {
    return `Перед відповіддю застосунок **знаходить** доречні фрагменти ваших документів і **додає** їх у запит до моделі. Модель не має прямого доступу до внутрішньої wiki чи архіву інцидентів — пошук виконує код.

запит → пошук фрагментів → контекст моделі → відповідь

Окремо існує **підготовка знань** (індексація документів) і **один запит під час investigation** — не змішуйте їх на одній схемі в голові.

підготовка знань → індексація → searchable store`;
  }
  if (topicId === 'concept-10') {
    return `Модель може **запропонувати** виклик tool (ім’я й JSON args), але **не виконує** читання звітів і HTTP — це harness, policy і tool handler після перевірок.

Один run після \`login_spec\` (наприклад \`readPlaywrightReport\`) — це весь ланцюг нижче: CI summary і schemas готує код, модель повертає tool_call, після перевірок handler читає файл, snippet потрапляє в messages, далі — наступний turn LLM.

${TOOL_CALLING_LEARNER_FLOW_ARROW_LINE}`;
  }
  if (topicId === 'concept-17') {
    return `**Guardrails** — шар **детермінованого коду** навколо LLM: політики, перевірки, sandbox і підтвердження людиною. Модель може запропонувати tool call або текст, але **не вирішує**, чи можна читати prod, писати в БД чи створювати Jira.

Після уроку ви зможете:

- пояснити, **чому** без guardrails agent небезпечний (prompt injection, hallucinated permissions);
- відрізнити **пропозицію LLM** від **дозволу та виконання в коді**;
- назвати основні шари: input/output validation, permission matrix, sandbox, rate limits, human approval;
- пройти **ланцюг під капотом** (вхід → модель → schema → policy → approval → executor);
- перенести це на **QA Regression Agent**: що дозволено лише read-only, що потребує human approval, чого немає в tool registry.

${trimmed ? `\nКоротке формулювання курсу: ${trimmed}` : ''}`;
  }
  return quickViewRaw;
}

export function getLessonOutcomesFlowAriaLabel(topicId: string): string {
  return getStudyLessonHero(topicId)?.outcomesFlowAriaLabel ?? 'Схема з уроку';
}

export function getLessonNavBlurb(topicId: string): string | null {
  if (topicId === 'concept-03') {
    return 'Від проблеми внутрішніх документів — через один запит QA-агента — до індексації, ролей коду/LLM і перевірок.';
  }
  if (topicId === 'concept-10') {
    return 'Від «текст ≠ дія» — через один tool_call у investigation — до harness, policy, handler і перевірок QA.';
  }
  if (topicId === 'concept-17') {
    return 'Як обмежити й перевірити дії агента: політики, валідатори, sandbox і approvals — окремо від «розуму» LLM.';
  }
  return null;
}
