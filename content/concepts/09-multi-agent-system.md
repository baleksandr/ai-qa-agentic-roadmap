# Concept 09 — Multi-Agent System

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** PART II — Concept 9 (pdf)  
> Текст з PDF; DOCX не знайдено — таблиці/зображення не звірені.

## Review Mode

Multi-Agent: кілька спеціалізованих agents координуються навколо спільної задачі; складність зростає через coordination, state і failure handling. Concept 8 — A2A ↓ [Concept 9 — Multi-Agent System] <-- ЗАРАЗ ВИВЧАЄМО ↓ Concept 10 — Tool Calling

## Study Mode

Concept 9. Multi-Agent System — мультиагентна система
### QUICK VIEW — Multi-Agent: кілька спеціалізованих agents координуються навколо спільної задачі;
складність зростає через coordination, state і failure handling.
Concept 8 — A2A
↓
[Concept 9 — Multi-Agent System] <-- ЗАРАЗ ВИВЧАЄМО
↓
Concept 10 — Tool Calling
### 0. Яку проблему ми взагалі намагаємося вирішити?
Складні задачі мають різні спеціалізації: research, coding, testing, review. Один agent із сотнями
tools/instructions може працювати гірше, бути дорожчим і складнішим для permissions.
One giant agent
├─ research
├─ code
├─ test
├─ review
└─ deploy
→ huge context + permissions + complexity
### 1. Головна ідея простими словами
Ключова думка
Multi-Agent System — архітектура, де кілька agent runtimes мають спеціалізовані ролі та координуються
через orchestrator/shared state/A2A.
### 2. З яких компонентів це складається?
• Orchestrator/manager
• Specialist agents
• Shared state or artifact store
• Communication protocol
• Role-specific tools/permissions
• Conflict resolution
### 3. Що фізично передається між компонентами?
Tasks, messages, plans, artifacts, scores, status, references to shared resources.
### 4. Що відбувається під капотом — крок за кроком
### 67. 1) Goal надходить orchestrator.
### 68. 2) Він декомпозує або routes sub-tasks.
### 69. 3) Specialist agents виконують паралельно/послідовно.
### 70. 4) Results пишуться у shared state/artifact store.
### 71. 5) Orchestrator агрегує/перевіряє.
### 72. 6) За конфлікту викликає reviewer/judge або human.

### 5. Де тут LLM, а де звичайний deterministic code?
LLM відповідає за probabilistic interpretation/decision/generation там, де потрібне розуміння природної
мови або вибір наступної дії. Усе, що стосується реального I/O, зберігання, permissions, network calls,
retries, schema validation, queues, databases і policy enforcement, виконується звичайним програмним
кодом та інфраструктурою. Межа між цими двома світами — одна з найважливіших mental models у
всьому курсі.
### 6. Повний простий приклад
Research Agent читає Jira/Confluence, Coding Agent змінює code, QA Agent генерує/запускає tests, Review
Agent перевіряє diff. Orchestrator збирає final PR.
### 7. Де це може впасти? — failure modes
• Context divergence
• Agents duplicate work
• Conflicting edits
• Coordination overhead > benefit
• Cascade hallucinations
• Permission sprawl
### 8. Security — що важливо захистити?
• Role-based permissions
• Separate credentials
• Artifact provenance
• Approval before cross-boundary actions
### 9. Як це тестувати як QA/SDET?
• Specialist unit evals
• Handoff correctness
• Parallel race conditions
• Conflict resolution
• Partial failure
• One agent unavailable
### 10. Observability — що потрібно бачити в production?
Per-agent traces + global workflow trace, token/cost per role, handoff count, rework rate.
### 11. Production considerations
У production важливо думати не лише про happy path, а про versioning, backward compatibility, latency,
cost, retries, idempotency, rate limits, concurrency, degradation/fallback, data retention, deployment,
monitoring і incident response. Конкретна вага цих факторів залежить від цієї концепції, але production-
система завжди повинна мати контрольовану поведінку при часткових збоях.

### 12. Як ця концепція пов’язана з іншими?
Ця концепція не існує ізольовано. Попередній логічний крок: Concept 8 — A2A. Наступний: Concept 10 —
Tool Calling. Під час навчання завжди повертайся до глобальної карти: модель, harness, state/memory,
tools/MCP, RAG, A2A, guardrails, evals та observability — це шари однієї системи.
### 13. Коротка відповідь на співбесіді
**Interview answer**
A multi-agent system separates a complex workflow into specialized agents with scoped context, tools and
permissions, coordinated by an orchestrator or shared workflow. The benefit is specialization; the cost is
coordination complexity.
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
