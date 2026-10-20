import { isStudyReadyForLearning } from '../study/study-ready-for-learning';
import { getRouteTopicSidePanel } from './route-topic-side-panels';
import { buildReviewMarkdownFromRoutePanel } from '../../lib/reviewFromRoutePanel';

/**
 * Review Mode для бічної панелі та /topic/:id.
 * Теми з ✓ на карті — з панелі «Увесь маршрут»; інші — запис тут або ## Review Mode у markdown.
 */
export function getEnrichedReviewMarkdown(topicId: string, fallbackFromFile: string): string {
  if (isStudyReadyForLearning(topicId)) {
    const panel = getRouteTopicSidePanel(topicId);
    if (panel) return buildReviewMarkdownFromRoutePanel(panel);
  }
  return REVIEW_BY_TOPIC_ID[topicId] ?? fallbackFromFile;
}

const REVIEW_BY_TOPIC_ID: Record<string, string> = {
  'concept-02': `**Проблема:** CI, investigation agent і coding agent без «диригента» стартують у хаотичному порядку після nightly failure.

**Ідея:** orchestration — **код workflow**: ready tasks, routing, retries, human gates між сервісами.

**У агенті:** orchestrator чекає CI artifacts, потім запускає investigation; за результатом — fix, flake retry або escalation.

:::review-steps
CI ready | Код / CI | Артефакти звіту доступні
Investigation | Harness+LLM | Run після login_spec
Gate | Людина+код | Approve небезпечні гілки
:::

**Для QA:** idempotent events; max retries; порядок подій у bus/trace.

**Запам’ятати:** orchestration ≠ tool loop всередині одного run.`,

  'concept-05': `**Проблема:** зміна prompt/RAG ламає investigation непомітно, якщо перевіряти лише один ручний прогін.

**Ідея:** **evals** — golden set + метрики на фіксованому harness (tool choice, groundedness).

**У агенті:** після зміни system prompt для login_spec сценаріїв — CI eval gate.

:::review-steps
Dataset | Код | Кейси з очікуваними tools/chunks
Run | Harness | Mock або recorded LLM
Score | Код | Pass rate vs baseline
:::

**Для QA:** не плутати з production observability.

**Запам’ятати:** eval = регресія якості.`,

  'concept-08': `**Проблема:** агенти на різних сервісах не можуть безпечно «передавати задачу» вільним чатом.

**Ідея:** **A2A** — структуровані повідомлення delegate/status/result між агентами.

**У агенті:** investigation делегує coding agent TaskSpec + evidence bundle.

:::review-steps
Delegate | A2A + код | TaskSpec з correlation id
Work | Remote harness | Свій loop і policy
Result | A2A | Structured artifact назад
:::

**Для QA:** mTLS, anti-replay, tenant scope.`,

  'concept-09': `**Проблема:** один «універсальний» агент погано поєднує investigation, coding і review.

**Ідея:** **multi-agent** — ролі з різними policies; координує orchestration.

**У агенті:** investigation read-only → artifact → coding agent з write після gate.

:::review-compare
Investigation agent | Facts з tools після login_spec || Coding agent | Patch proposal з окремим token
:::

**Для QA:** немає двох writer на один файл без lock.`,

  'concept-16': `**Проблема:** end-to-end «від падіння до fix» не вкладається в один monolith run.

**Ідея:** **agentic workflows** — сценарій з handoff artifact між агентами.

**У агенті:** investigation hypothesis + refs → coding agent → CI → review.

:::review-steps
Triage | Workflow | Старт після nightly
Investigate | Agent | login_spec run
Handoff | Orchestrator | JSON artifact між ролями
:::

**Для QA:** contract на artifact schema.`,

  'concept-17': `**Проблема:** LLM може запропонувати небезпечний tool або піддатись injection у retrieved doc.

**Ідея:** **guardrails** — validators, permission matrix, sandbox, approvals у **коді**.

**У агенті:** read report allow; createJira needs_approval; delete prod — немає в registry.

:::review-steps
Proposal | LLM | tool_call або текст
Policy | Код | allow / deny / needs_approval
Executor | Код | Лише після allow (+ approve)
:::

**Для QA:** injection, bypass, deny без side effect у trace.`,

  'concept-18': `**Проблема:** без trace не зрозуміти, чому агент створив хибний Jira після investigation.

**Ідея:** **observability** — spans model/tool/policy, correlation id, prompt version.

**У агенті:** кожен tool call після login_spec логується з decision і duration.

:::review-steps
Run | Harness | correlationId на весь workflow
Spans | Код | model, tool, retrieval, policy
On-call | Людина | Trace як доказ у тикеті
:::

**Для QA:** PII redaction у логах.`,

  'concept-19': `**Проблема:** важко обґрунтувати вибір base model лише на «відчуттях».

**Ідея:** **benchmarks** — стандартні набори; **domain evals** — gate для investigation agent.

**У агенті:** високий public score не замінює golden login_spec cases.

:::review-compare
Public benchmark | Загальні здібності моделі || Internal eval | Tool choice + groundedness на ваших кейсах
:::

**Для QA:** вимагайте обидва сигнали, не один.`,

  'concept-20': `**Проблема:** demo agent ламається на rate limits, partial outage і cost у real tenant.

**Ідея:** **production** — SLO, deploy, rollback, degraded mode, incident response навколо всіх шарів.

**У агенті:** nightly load на investigation з rate cap і explicit fallback без RAG.

:::review-steps
Alert | Ops | Spike failures login_spec
Run | Prod harness | Queues + limits
Learn | Evals | Новий кейс у golden set після інциденту
:::

**Для QA:** chaos на MCP/LLM; runbooks.`,

  'qa-interview': `**Проблема:** на співбесіді питають про AI у QA окремо від «як працює RAG» чи tool calling.

**Ідея:** банк питань за категоріями — короткі відповіді й типові помилки; доповнює Fundamentals і PART II, не замінює їх.

**У маршруті:** окрема картка без лічильника обов’язкових тем Fundamentals; Study Mode — інтерактивний список.

**Для QA:** відповідайте лише з власного досвіду; навчальні приклади курсу (login_spec) не видавайте за реальний проєкт.

**Запам’ятати:** AI прискорює чернетки, перевірка фактів і рішення про якість — за командою.`,

  'reference-library': `**Проблема:** глибокі довідкові матеріали губляться серед 20 concepts і labs.

**Ідея:** **Reference Library** — архів карт, interview bank, portfolio; не замінює актуальні Study уроки PART II.

**У маршруті:** вузол «довідник» без лічильника прогресу labs; відкривайте коли потрібен глосарій або співбесіда.

**Для QA:** використовуйте як джерело формулювань, не як єдиний навчальний шлях.

**Запам’ятати:** reference доповнює, не дублює concept-03/10.`,

  'lab-0': `**Проблема:** один prompt з текстом помилки не дає root cause без tools.

**Ідея:** Lab 0 — чому потрібні harness, fixtures і дозволені read-tools для investigation.

**У агенті:** \`failed-run.json\` (навчальна фікстура) замість live prod log.

:::review-compare
Чат без tools | LLM лише гіпотезує || Harness + tools | Evidence у messages перед висновком
:::

**Для QA:** контрольована фікстура, не випадковий prod.

**Запам’ятати:** факти з tools, не з фантазії.`,

  'lab-1': `**Проблема:** треба мінімальний reproducible run перед складним agent graph.

**Ідея:** Lab 1 — перший крок до regression agent: структура проєкту, mock failure, один tool path.

**У агенті:** той самий login/checkout narrative, що в курсі, у безпечному sandbox.

:::review-steps
Fixture | Ви / код | Відтворюваний fail
Harness | Код | Один turn або tool
Перевірка | QA | Trace містить evidence
:::

**Запам’ятати:** lab будує навичку trace-first.`,

  'lab-2': `**Проблема:** без tool schema модель вигадує імена операцій.

**Ідея:** Lab 2 — опис tools, JSON schema, реєстрація в harness.

**У агенті:** allow-list перед readPlaywrightReport.

**Для QA:** invalid tool name → deny до handler.

**Запам’ятати:** schema в коді, не в голові моделі.`,

  'lab-3': `**Проблема:** investigation без збереження кроків не відновлюється.

**Ідея:** Lab 3 — state між tool calls у навчальному run.

**У агенті:** runId і lastObservation після читання звіту.

:::review-steps
Крок tool | Harness | Пише state
Наступний turn | LLM | Бачить observation
:::

**Для QA:** перервати run і перевірити continuity.`,

  'lab-4': `**Проблема:** внутрішні runbook не в prompt цілком.

**Ідея:** Lab 4 — підключення retrieval / mock index до investigation.

**У агенті:** фрагмент postmortem у context після login_spec.

:::review-phases
Підготовка | Навчальний індекс / mock chunks
Запит | Retriever → prompt → LLM
:::

**Для QA:** який chunk_id у trace.`,

  'lab-5': `**Проблема:** write-дії (Jira) небезпечні без policy.

**Ідея:** Lab 5 — permission matrix і approve на create issue.

**У агенті:** createJiraIssue лише після human gate у навчальному UI/mock.

:::review-steps
Proposal | LLM | createJiraIssue
Policy | Код | needs_approval
Approve | Людина | Дозвіл на write
:::

**Для QA:** deny без approve у trace.`,

  'lab-6': `**Проблема:** важко дебажити довгий run «на око».

**Ідея:** Lab 6 — trace/log навчального harness: spans, correlation id.

**У агенті:** той самий login_spec run з видимими model/tool подіями.

**Для QA:** знайти policy_decision у trace при deny.`,

  'lab-7': `**Проблема:** якість плаває після зміни prompt.

**Ідея:** Lab 7 — міні eval set на фікстурах investigation.

**У агенті:** 3–5 кейсів login_spec з очікуваним tool.

:::review-steps
Baseline | Код | Pass rate v1
Зміна prompt | Ви | Регресія v2
Gate | CI | Поріг pass
:::

**Запам’ятати:** eval у lab готує до concept-05.`,

  'lab-8': `**Проблема:** кілька кроків workflow важко тримати в голові.

**Ідея:** Lab 8 — простий orchestration graph: CI → investigate → optional fix path.

**У агенті:** подія nightly failure запускає наступний вузол лише після artifacts.

:::review-steps
Blocked | Orchestrator | Чекає CI
Ready | Код | Старт investigation
Branch | Код | fix vs retry
:::

**Для QA:** не стартувати investigate без artifact.`,

  'lab-9': `**Проблема:** інтеграція всіх шарів у один «майже prod» сценарій.

**Ідея:** Lab 9 — capstone regression agent: RAG + tools + guardrails + trace на одному наративі.

**У агенті:** login_spec end-to-end у навчальному середовищі.

:::review-phases
Збір | Усі шари курсу в одному run
Перевірка | QA | Trace + eval + manual review
:::

**Запам’ятати:** lab-9 — мостик до concept-20 production.`,

};
