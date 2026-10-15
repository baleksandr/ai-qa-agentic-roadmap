# Concept 02 — Orchestration

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** PART II — Concept 2 (pdf)  
> Текст з PDF; DOCX не знайдено — таблиці/зображення не звірені.

## Review Mode

Orchestration: керує порядком кроків, виконавцями, паралельністю, retries, approvals і переходами між частинами workflow. Concept 1 — Memory & State ↓ [Concept 2 — Orchestration] <-- ЗАРАЗ ВИВЧАЄМО ↓ Concept 3 — RAG

## Study Mode

Concept 2. Orchestration — оркестрація
### QUICK VIEW — Orchestration: керує порядком кроків, виконавцями, паралельністю, retries, approvals
і переходами між частинами workflow.
Concept 1 — Memory & State
↓
[Concept 2 — Orchestration] <-- ЗАРАЗ ВИВЧАЄМО
↓
Concept 3 — RAG
### 0. Яку проблему ми взагалі намагаємося вирішити?
Є Coding Agent, QA Agent, Review Agent, Jira, GitHub і CI. Якщо кожен компонент діє коли захоче,
отримуємо хаос: reviewer запускається до появи коду, QA пише tests до уточнення requirement, два агенти
одночасно змінюють один файл.
Потрібен рівень, який керує порядком кроків, залежностями, паралельністю, retries, approvals і
переходами між станами.
Goal: implement ticket
↓
??? хто визначає порядок?
├─ Coding Agent
├─ QA Agent
├─ Review Agent
├─ CI
└─ Human approval
### 1. Головна ідея простими словами
Ключова думка
Orchestration (оркестрація) — це керування workflow: хто виконує крок, коли він стартує, що є
precondition, що робити після failure і чи потрібне human approval.
### 2. З яких компонентів це складається?
• Workflow graph / state machine
• Scheduler / dispatcher
• Task queue
• Policies and routing rules
• Retry/timeout logic
• Human approval gates
• Shared state / event bus
### 3. Що фізично передається між компонентами?
Передаються task objects, event messages, status updates, tool results, artifacts і routing metadata. Це часто
JSON або повідомлення в queue/event bus.
### 4. Що відбувається під капотом — крок за кроком
### 12. 1) User goal перетворюється на workflow або plan.

### 13. 2) Orchestrator дивиться на state і визначає ready tasks.
### 14. 3) Вибирає виконавця: agent/tool/human.
### 15. 4) Передає task + context.
### 16. 5) Отримує result/status.
### 17. 6) Оновлює state і переходить по графу.
### 18. 7) При error застосовує retry/fallback/escalation policy.
### 5. Де тут LLM, а де звичайний deterministic code?
LLM відповідає за probabilistic interpretation/decision/generation там, де потрібне розуміння природної
мови або вибір наступної дії. Усе, що стосується реального I/O, зберігання, permissions, network calls,
retries, schema validation, queues, databases і policy enforcement, виконується звичайним програмним
кодом та інфраструктурою. Межа між цими двома світами — одна з найважливіших mental models у
всьому курсі.
### 6. Повний простий приклад
Implement ABC-123: read Jira → code → tests → CI → review. Якщо CI failed через flake, orchestrator може один
раз rerun. Якщо failure product-related — route назад Coding Agent. Якщо зміна production config — чекати
human approval.
### 7. Де це може впасти? — failure modes
• Deadlock між задачами
• Infinite loop/retry storm
• Два виконавці працюють над одним resource
• Неправильний routing
• Lost event / duplicate event
### 8. Security — що важливо захистити?
• Approval для destructive actions
• Least privilege для кожного agent
• Tenant isolation
• Audit trail хто ініціював крок
### 9. Як це тестувати як QA/SDET?
• Happy workflow
• Branch/fallback paths
• Retry count
• Timeout
• Duplicate messages
• Out-of-order events
• Approval denied/timeout
• Crash/recovery
### 10. Observability — що потрібно бачити в production?
Trace повинен показувати workflowId, taskId, parent/child spans, executor, transitions, retry reason, latency
кожного кроку.

### 11. Production considerations
У production важливо думати не лише про happy path, а про versioning, backward compatibility, latency,
cost, retries, idempotency, rate limits, concurrency, degradation/fallback, data retention, deployment,
monitoring і incident response. Конкретна вага цих факторів залежить від цієї концепції, але production-
система завжди повинна мати контрольовану поведінку при часткових збоях.
### 12. Як ця концепція пов’язана з іншими?
Ця концепція не існує ізольовано. Попередній логічний крок: Concept 1 — Memory & State. Наступний:
Concept 3 — RAG. Під час навчання завжди повертайся до глобальної карти: модель, harness,
state/memory, tools/MCP, RAG, A2A, guardrails, evals та observability — це шари однієї системи.
### 13. Коротка відповідь на співбесіді
**Interview answer**
Orchestration coordinates the workflow around agents and tools: ordering, dependencies, routing, retries,
approvals and state transitions. It is usually deterministic control logic around probabilistic model decisions.
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
