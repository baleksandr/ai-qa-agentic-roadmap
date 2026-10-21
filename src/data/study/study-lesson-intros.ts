import { getStudyLessonHero } from './study-lesson-heroes';

const PART_II_OUTCOMES: Record<string, string> = {
  'concept-05': `**Evals** — регресія на golden set після зміни prompt, RAG або моделі; harness запускає кейси з метриками, не один demo run.

golden cases → harness → scores → CI gate`,
  'concept-06': `**MCP** — harness як client до серверів tools (CI, tracker); policy лишається в застосунку.

harness → MCP server → зовнішній API → observation`,
  'concept-07': `**Skills** звужують tools і instructions під задачу (investigation vs write).

router → skill bundle → harness loop`,
  'concept-08': `**A2A** — структуровані повідомлення між агентами на різних сервісах.

investigation → delegate TaskSpec → coding agent`,
  'concept-09': '',
  'concept-11': `**Planning** — явний план кроків investigation до хаотичних tools.

plan JSON → validate steps → execute / replan`,
  'concept-12': `**Reasoning** має спиратися на tool/RAG facts після login_spec.

symptom → гіпотези → tools → оновлений висновок`,
  'concept-14': `**Prompt engineering** — role, constraints, format у messages[].

system + context → LLM → schema validate`,
  'concept-16': '',
  'concept-18':
    'Після уроку ви зможете пояснити, як trace і метрики допомагають відновити перебіг run агента, пов’язати події одного запуску та знайти причину затримки або помилки за записами системи, а не лише за текстом відповіді.',
  'concept-19': `**Benchmarks** допомагають вибрати base model; domain evals — gate релізу.

public bench + internal login_spec set`,
  'concept-20': `**Production** — SLO, deploy, cost, degraded mode навколо агента.

alert → workflow → investigation → incident learnings`,
};

const PART_II_BLURBS: Record<string, string> = {
  'concept-05': 'Як ловити регресію investigation агента набором кейсів і метрик.',
  'concept-06': 'Стандарт MCP для підключення CI/Jira tools до harness.',
  'concept-07':
    'Повторювані інструкції для розбору login_spec: skill, модель і код перевірки доступу.',
  'concept-08': 'Протокол A2A між агентами на різних сервісах.',
  'concept-09':
    'Ролі Investigation і Coding, handoff із доказами та окремі межі доступу після падіння login_spec для ABC-123.',
  'concept-11':
    'План перевірок під час розслідування login_spec: мета, наступні кроки, виконання та перегляд після нових фактів.',
  'concept-12': 'Міркування моделі з прив’язкою до evidence з tools.',
  'concept-13': 'Коли fine-tune, а коли prompt і RAG для фактів.',
  'concept-14': 'Дизайн system prompt і format для надійнішої поведінки.',
  'concept-15': 'Векторний індекс у ланцюгу RAG після login_spec.',
  'concept-16':
    'Задачі, handoff і гілки після timeout login_spec: що передають між етапами і коли виправлення коду справді готують.',
  'concept-18': 'Traces і метрики для QA розбору run у prod.',
  'concept-19': 'Benchmarks vs ваші golden evals для investigation.',
  'concept-20': 'Експлуатація investigation агента в production.',
};

export type StudyOutcomesLessonHint = {
  labelUk: string;
  textUk: string;
};

/** Підказки під outcomes (окрема зелена картка), не в markdown-потоці. */
export function getStudyOutcomesLessonHint(_topicId: string): StudyOutcomesLessonHint | null {
  return null;
}

/** Розширений блок «Що я зрозумію» + короткий опис уроку в змісті */
export function buildStudyLearningOutcomes(topicId: string, quickViewRaw: string): string {
  const trimmed = quickViewRaw.replace(/\s+/g, ' ').trim();
  if (topicId === 'fundamentals') {
    return '';
  }
  if (topicId === 'concept-01') {
    return '';
  }
  if (topicId === 'concept-02') {
    return '';
  }
  if (topicId === 'concept-16') {
    return '';
  }
  if (topicId === 'concept-09') {
    return '';
  }
  if (topicId === 'concept-04') {
    return '';
  }
  if (topicId === 'concept-03') {
    return `Перед відповіддю застосунок **знаходить** доречні фрагменти ваших документів і **додає** їх у запит до моделі. Модель не має прямого доступу до внутрішньої wiki чи архіву інцидентів — пошук виконує код.

запит → пошук фрагментів → контекст моделі → відповідь

Окремо існує **підготовка знань** (індексація документів) і **один запит під час investigation** — не змішуйте їх на одній схемі в голові.

підготовка знань → індексація → searchable store`;
  }
  if (topicId === 'concept-10') {
    return 'Після уроку ви відрізняєте пропозицію моделі від виконання в коді та пояснюєте один прохід readPlaywrightReport після login_spec без плутання тексту з дією.';
  }
  if (
    topicId === 'concept-06' ||
    topicId === 'concept-14' ||
    topicId === 'concept-12' ||
    topicId === 'concept-15' ||
    topicId === 'concept-13' ||
    topicId === 'concept-07' ||
    topicId === 'concept-11' ||
    topicId === 'concept-17' ||
    topicId === 'concept-18'
  ) {
    return '';
  }
  if (PART_II_OUTCOMES[topicId]) return PART_II_OUTCOMES[topicId];
  return trimmed;
}

export function getLessonOutcomesFlowAriaLabel(topicId: string): string {
  return getStudyLessonHero(topicId)?.outcomesFlowAriaLabel ?? 'Схема з уроку';
}

export function getLessonNavBlurb(topicId: string): string | null {
  if (topicId === 'fundamentals') {
    return 'Словник 1–20: від AI/ML до токенів, context і переходу до агентів — з картками для ключових ланцюгів.';
  }
  if (topicId === 'concept-01') {
    return 'Чому run investigation не «забувається» між кроками: state, memory і хто формує контекст для LLM.';
  }
  if (topicId === 'concept-02') {
    return 'Хто координує кроки після timeout на #login-btn: порядок задач, вибір гілки за результатом, повтори та зупинки перед ризиковою дією.';
  }
  if (topicId === 'concept-16') {
    return 'Як workflow з’єднує задачі після падіння login_spec: handoff фактів, гілка за доказом і перевірка конкретної revision, а не «виправ усе» після кожного збою.';
  }
  if (topicId === 'concept-04') {
    return 'Як звичайний код перетворює LLM на агента з tools, loop і tracing після login_spec.';
  }
  if (topicId === 'concept-03') {
    return 'Від проблеми внутрішніх документів — через один запит QA-агента — до індексації, ролей коду/LLM і перевірок.';
  }
  if (topicId === 'concept-10') {
    return 'Від «текст ≠ дія» — через один tool_call у investigation — до harness, policy, handler і перевірок QA.';
  }
  if (topicId === 'concept-14') {
    return 'Від розмитого «поясни падіння» — до запиту з доказами, частин messages і перевірки відповіді після login_spec.';
  }
  if (topicId === 'concept-17') {
    return 'Як обмежити й перевірити дії агента: політики, валідатори, sandbox і approvals — окремо від «розуму» LLM.';
  }
  if (PART_II_BLURBS[topicId]) return PART_II_BLURBS[topicId];
  return null;
}
