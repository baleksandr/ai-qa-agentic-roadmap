# Concept 16 — Agentic Workflows

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** PART II — Concept 16 (pdf)  
> Текст з PDF; DOCX не знайдено — таблиці/зображення не звірені.

## Review Mode

Agentic Workflows: довготривалий execution flow, який поєднує triggers, planning, tools, state, loops, approvals і error handling. Concept 15 — Vector Database ↓ [Concept 16 — Agentic Workflows] <-- ЗАРАЗ ВИВЧАЄМО ↓ Concept 17 — Guardrails

## Study Mode

Concept 16. Agentic Workflows — агентні робочі процеси
### QUICK VIEW — Agentic Workflows: довготривалий execution flow, який поєднує triggers, planning,
tools, state, loops, approvals і error handling.
Concept 15 — Vector Database
↓
[Concept 16 — Agentic Workflows] <-- ЗАРАЗ ВИВЧАЄМО
↓
Concept 17 — Guardrails
### 0. Яку проблему ми взагалі намагаємося вирішити?
Один model call вирішує лише короткий step. Реальна engineering task може тривати багато кроків,
містити loops, tools, approvals, retries, parallel branches і persisted state.
Trigger
↓
Step 1
↓
Step 2
↘ error → retry/fallback
↓
approval
↓
Step N
### 1. Головна ідея простими словами
Ключова думка
Agentic workflow — довготривалий процес, де model decisions поєднані з deterministic orchestration,
tools, state, guardrails і human checkpoints.
### 2. З яких компонентів це складається?
• Trigger
• Workflow definition/graph
• Agents/model calls
• Tools
• State/checkpoints
• Policies
• Human approval
• Error handling
### 3. Що фізично передається між компонентами?
Workflow state, task data, tool results, artifacts, approval events.
### 4. Що відбувається під капотом — крок за кроком
### 107. 1) Trigger створює workflow instance.
### 108. 2) State engine визначає next node.
### 109. 3) Node може бути model/tool/human.

### 110. 4) Result записується.
### 111. 5) Router обирає branch.
### 112. 6) Checkpoint дозволяє resume.
### 113. 7) Завершення за completion condition.
### 5. Де тут LLM, а де звичайний deterministic code?
LLM відповідає за probabilistic interpretation/decision/generation там, де потрібне розуміння природної
мови або вибір наступної дії. Усе, що стосується реального I/O, зберігання, permissions, network calls,
retries, schema validation, queues, databases і policy enforcement, виконується звичайним програмним
кодом та інфраструктурою. Межа між цими двома світами — одна з найважливіших mental models у
всьому курсі.
### 6. Повний простий приклад
Nightly regression finishes → workflow fetches report → classifies failures → for suspicious product failures
fetches logs → drafts Jira bug → human approves creation → posts Slack summary.
### 7. Де це може впасти? — failure modes
• Workflow stuck
• Compensation missing after partial side effect
• Duplicate trigger
• Long-running timeout
• State corruption
### 8. Security — що важливо захистити?
• Approval gates
• Scoped service accounts
• Immutable audit log
• Compensation/rollback for side effects
### 9. Як це тестувати як QA/SDET?
• End-to-end workflow simulation
• Branch coverage
• Resume after crash
• Duplicate trigger idempotency
• Approval paths
• Compensation
### 10. Observability — що потрібно бачити в production?
workflow duration, node latency, retries, queue time, success rate, stuck instances, cost per workflow.
### 11. Production considerations
У production важливо думати не лише про happy path, а про versioning, backward compatibility, latency,
cost, retries, idempotency, rate limits, concurrency, degradation/fallback, data retention, deployment,

monitoring і incident response. Конкретна вага цих факторів залежить від цієї концепції, але production-
система завжди повинна мати контрольовану поведінку при часткових збоях.
### 12. Як ця концепція пов’язана з іншими?
Ця концепція не існує ізольовано. Попередній логічний крок: Concept 15 — Vector Database. Наступний:
Concept 17 — Guardrails. Під час навчання завжди повертайся до глобальної карти: модель, harness,
state/memory, tools/MCP, RAG, A2A, guardrails, evals та observability — це шари однієї системи.
### 13. Коротка відповідь на співбесіді
**Interview answer**
Agentic workflows combine model decisions with deterministic orchestration, tools, state, retries and
approvals to complete long-running multi-step tasks reliably.
### 14. “АААА, ось воно як!” — що треба запам’ятати
Не зубри визначення. Спробуй без документа намалювати flow від входу до виходу і для кожної стрілки
відповісти: хто це виконує, що саме передається, де зберігається state, де працює LLM, а де звичайний
код. Якщо можеш це відновити — концепція реально засвоєна.

### QA-приклад

Див. відповідний підрозділ «повний приклад» у Study Mode (якщо є в джерелі).

### Failure modes / security / testing / observability / production

Див. розділи failure / security / testing / observability / production у Study Mode.

### Запитання для самоперевірки

Відновіть flow без документа (див. блок «АААА» або hands-on у джерелі).

### Коротка відповідь для співбесіди

Див. **Interview answer** у Study Mode.
