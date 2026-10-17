/**
 * Review Mode для бічної панелі та /topic/:id.
 * Якщо є запис — використовується замість сирого ## Review Mode з markdown (узгоджено з Study).
 */
export function getEnrichedReviewMarkdown(topicId: string, fallbackFromFile: string): string {
  return REVIEW_BY_TOPIC_ID[topicId] ?? fallbackFromFile;
}

const REVIEW_BY_TOPIC_ID: Record<string, string> = {
  fundamentals: `**Проблема:** без спільного словника «токен», «context window», «inference» розмови про агента й investigation збиваються з півслова.

**Ідея:** Fundamentals — 20 опорних поняттів до PART II: що модель робить на inference, чим відрізняється від коду, чому hallucination не лікується «кращим промптом» сама по собі.

**У QA Regression Agent:** кожен run — це API-виклик з \`messages[]\`, ліміт токенів і ймовірнісна відповідь; harness і evals компенсують це **кодом**.

:::review-compare
LLM | Генерує наступні токени з контексту; не гарантує правду || Код | Збирає prompt, викликає API, валідує output, тримає state
:::

**Для QA:** тестуйте structured output і поведінку harness, не «магічність» моделі.

**Запам’ятати:** inference ≠ training, контекст обмежений, агент = модель + код навколо.`,

  'concept-01': `**Проблема:** після \`login_spec\` investigation триває багато кроків; без state/memory run «забуває», що вже зробив, після рестарту pod.

**Ідея:** **state** — знімок поточного run; **memory** — збережене з минулого; **context builder** (код) вирішує, що потрапить у наступний prompt.

**У агенті:** між tool calls harness дописує observations у state; перед LLM — лише дозволений шмат history/memory.

:::review-steps
Checkpoint | Код | Знімок state після кроку N
Context builder | Код | Збирає messages[] перед model call
LLM | Модель | Бачить лише переданий контекст
:::

**Для QA:** restore після kill process; ізоляція tenant; snapshot prompt без секретів.

**Запам’ятати:** модель не читає БД пам’яті напряму.`,

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

  'concept-03': `**Проблема:** модель не бачить Confluence, postmortem і закриті інциденти, поки ви явно не передасте текст; «вся wiki» в prompt — дорого й шумно.

**Ідея RAG:** **код** знаходить релевантні фрагменти, додає в prompt, **LLM** відповідає з опорою на уривки.

:::review-phases
Offline | Документи → parse → chunks → індекс (embed / інший retrieval)
Runtime | Query після login_spec → retriever → (rerank) → context builder → LLM
:::

**У агенті:** пошук і ACL — harness; модель не «ходить у базу» сама.

**Для QA:** chunk_id у trace, groundedness, свіжість індексу vs DOM/trace CI.

**Запам’ятати:** retrieval ≠ правда про поточне падіння.`,

  'concept-04': `**Проблема:** один виклик LLM не читає Playwright report і не тримає цикл tool calls після \`login_spec\`.

**Ідея:** **harness** — runtime: context, model API, parse tool_call, policy, handler, state, stop rules, trace.

:::review-steps
createRun | Код | runId і початковий state
model.complete | LLM | text або tool_call proposal
handler | Код | I/O після allow
stop | Код | max steps / timeout / final text
:::

**Для QA:** mock LLM integration; policy deny без side effect.

**Запам’ятати:** harness перетворює чат на систему.`,

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

  'concept-06': `**Проблема:** багато інтеграцій (CI, Jira) — дублювати SDK у кожному агенті дорого.

**Ідея:** **MCP** — протокол client (harness) ↔ server (tools/resources).

**У агенті:** read CI artifact через MCP server; policy лишається в harness.

:::review-compare
MCP server | Надає tools і виконує I/O до зовнішніх API || Harness client | Discover tools, policy, trace
:::

**Для QA:** contract tests на server; auth і sandbox paths.

**Запам’ятати:** MCP не замінює guardrails.`,

  'concept-07': `**Проблема:** один prompt з усіма tools — шум і помилки вибору після failure.

**Ідея:** **skills** — модулі (instructions + subset tools), які router підключає за задачею.

**У агенті:** skill «Playwright investigation» після login_spec без write-tools до approve.

:::review-steps
Router | Код | Обирає skill за intent/workflow
Bundle | Код | Звужений allow-list + prompt slice
LLM | Модель | Працює в межах skill
:::

**Для QA:** matrix сценарій → expected skill id у trace.`,

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

  'concept-10': `**Проблема:** текст відповіді ≠ дія; після \`login_spec\` потрібен звіт з диска, не вигадка.

**Ідея:** LLM повертає **tool_call** (пропозиція); harness валідує й виконує handler.

:::review-steps
Proposal | LLM | readPlaywrightReport + args
Policy | Код | schema, sandbox, allow-list
Handler | Код | Читає файл → observation у messages
:::

**Для QA:** matrix schema/sandbox/permission/duplicate/trace (див. Study §6).

**Запам’ятати:** I/O на диску — не в моделі.`,

  'concept-11': `**Проблема:** без плану investigation робить хаотичні tool calls.

**Ідея:** **planning** — явні кроки (JSON/список), harness валідує проти allow-list.

**У агенті:** read CI → read report → hypothesis → optional Jira draft.

:::review-steps
Plan | LLM | Кроки з tool names
Validate | Код | Кроки ∈ registry
Execute | Harness | По одному з replan
:::

**Для QA:** max replans; deny забороненого кроку.`,

  'concept-12': `**Проблема:** модель може «красиво» пояснити падіння без facts з trace.

**Ідея:** **reasoning** — проміжні кроки мислення, але **grounding** з tool/RAG results.

**У агенті:** гіпотеза про селектор лише після readPlaywrightReport.

:::review-compare
Guess | LLM без tools | Не приймається як root cause || Evidence | Tool snippet у trace | Підтверджує або спростовує
:::

**Для QA:** strong claims лише після tool span.`,

  'concept-13': `**Проблема:** внутрішній стиль звітів важко тримати лише довгим prompt.

**Ідея:** **fine-tuning** змінює weights; **не** підставляє свіжий postmortem (RAG).

**У агенті:** коротший tone у summary після login_spec — можливий tune; факти — retrieval.

:::review-phases
Training | Offline job на ваших прикладах звітів
Inference | Той самий harness + RAG що й раніше
:::

**Для QA:** eval до/після; safety regression.`,

  'concept-14': `**Проблема:** розмитий «розбери тест» дає нестабільну поведінку.

**Ідея:** **prompt engineering** — role, constraints, format, few-shot у \`messages[]\`.

**У агенті:** system: Senior SDET, JSON hypothesis, не вигадувати API; user: login_spec failure.

:::review-steps
Context builder | Код | Порядок system/user/RAG
LLM | Модель | Наступна дія або текст
Validator | Код | JSON schema pass
:::

**Для QA:** prompt regression set; injection у retrieved text.`,

  'concept-15': `**Проблема:** keyword search пропускає семантично близькі postmortem.

**Ідея:** **vector DB** — embeddings + Top-K similarity (варіант RAG retrieval).

**У агенті:** query embed після login_spec → chunks у prompt з ACL filter.

:::review-phases
Index | Offline: chunks → vectors у колекції
Query | Runtime: similarity + metadata filters
:::

**Для QA:** golden query → expected chunk_ids; stale index tests.`,

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
