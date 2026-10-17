import { getStudyLessonHero } from './study-lesson-heroes';
import { TOOL_CALLING_LEARNER_FLOW_ARROW_LINE } from './tool-calling-learner-flow';

const PART_II_OUTCOMES: Record<string, string> = {
  'concept-05': `**Evals** — регресія на golden set після зміни prompt, RAG або моделі; harness запускає кейси з метриками, не один demo run.

golden cases → harness → scores → CI gate`,
  'concept-06': `**MCP** — harness як client до серверів tools (CI, tracker); policy лишається в застосунку.

harness → MCP server → зовнішній API → observation`,
  'concept-07': `**Skills** звужують tools і instructions під задачу (investigation vs write).

router → skill bundle → harness loop`,
  'concept-08': `**A2A** — структуровані повідомлення між агентами на різних сервісах.

investigation → delegate TaskSpec → coding agent`,
  'concept-09': `**Multi-agent** — різні ролі й policies; координує orchestration.

investigation agent → artifact → coding agent`,
  'concept-11': `**Planning** — явний план кроків investigation до хаотичних tools.

plan JSON → validate steps → execute / replan`,
  'concept-12': `**Reasoning** має спиратися на tool/RAG facts після login_spec.

symptom → гіпотези → tools → оновлений висновок`,
  'concept-13': `**Fine-tuning** змінює weights; свіжі postmortem — RAG, не tune.

train job → model version → eval gate`,
  'concept-14': `**Prompt engineering** — role, constraints, format у messages[].

system + context → LLM → schema validate`,
  'concept-15': `**Vector DB** — Top-K similarity для chunks у RAG; ACL у коді.

query embed → search → filtered chunks → prompt`,
  'concept-16': `**Agentic workflows** — сценарій з handoff між агентами.

triage → investigate → fix proposal → CI`,
  'concept-18': `**Observability** — trace spans model/tool/policy з correlation id.

run → spans → on-call debug`,
  'concept-19': `**Benchmarks** допомагають вибрати base model; domain evals — gate релізу.

public bench + internal login_spec set`,
  'concept-20': `**Production** — SLO, deploy, cost, degraded mode навколо агента.

alert → workflow → investigation → incident learnings`,
};

const PART_II_BLURBS: Record<string, string> = {
  'concept-05': 'Як ловити регресію investigation агента набором кейсів і метрик.',
  'concept-06': 'Стандарт MCP для підключення CI/Jira tools до harness.',
  'concept-07': 'Модульні skills і менший allow-list tools для investigation.',
  'concept-08': 'Протокол A2A між агентами на різних сервісах.',
  'concept-09': 'Кілька агентів з різними ролями після nightly failure.',
  'concept-11': 'План кроків investigation і replan після нових facts.',
  'concept-12': 'Міркування моделі з прив’язкою до evidence з tools.',
  'concept-13': 'Коли fine-tune, а коли prompt і RAG для фактів.',
  'concept-14': 'Дизайн system prompt і format для надійнішої поведінки.',
  'concept-15': 'Векторний індекс у ланцюгу RAG після login_spec.',
  'concept-16': 'End-to-end workflow з handoff між агентами.',
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
    return `**Fundamentals** дає спільні слова для всього курсу: що таке LLM на inference, як текст стає токенами, що таке context window і чому відповідь моделі — не база даних.

текст запиту → токени → context → next-token → відповідь (цикл)`;
  }
  if (topicId === 'concept-01') {
    return `Модель не пам’ятає минулий HTTP-запит сама. **State** — де зараз цей run investigation; **memory** — що зберегли з минулого; **context builder** (код) вирішує, що покласти в \`messages[]\` перед LLM.

падіння login_spec → runId і state → кроки tools → checkpoint → context → LLM`;
  }
  if (topicId === 'concept-02') {
    return `Кілька агентів і CI без спільного **оркестратора** дають хаос порядку. Orchestration — код workflow: ready tasks, routing, retries, **human gates** — не заміна harness всередині одного run.

CI artifacts ready → investigation task → гілка fix / retry / escalate → approve?`;
  }
  if (topicId === 'concept-04') {
    return `**Harness** — програмний runtime навколо LLM: збирає context, викликає model API, перевіряє policy і виконує tools.

Без harness investigation після \`login_spec\` лишається чатом — немає Playwright, state між кроками й trace для QA.

goal → loop → model → tool decision → handler → state → stop`;
  }
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
  if (topicId === 'concept-14') {
    return 'Ви навчитеся складати запит до моделі для розбору падіння тесту: передавати факти, формулювати задачу, задавати формат відповіді й перевіряти результат.';
  }
  if (PART_II_OUTCOMES[topicId]) return PART_II_OUTCOMES[topicId];
  return quickViewRaw;
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
    return 'Хто визначає порядок після nightly failure: workflow, черги, retries і approvals між агентами.';
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
