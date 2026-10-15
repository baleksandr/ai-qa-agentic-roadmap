# Concept 11 — Planning

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** PART II — Concept 11 (pdf)  
> Текст з PDF; DOCX не знайдено — таблиці/зображення не звірені.

## Review Mode

Planning: велика ціль розбивається на кроки; після нових observations план може змінюватися. Concept 10 — Tool Calling ↓ [Concept 11 — Planning] <-- ЗАРАЗ ВИВЧАЄМО ↓ Concept 12 — Reasoning

## Study Mode

Concept 11. Planning — планування
### QUICK VIEW — Planning: велика ціль розбивається на кроки; після нових observations план може
змінюватися.
Concept 10 — Tool Calling
↓
[Concept 11 — Planning] <-- ЗАРАЗ ВИВЧАЄМО
↓
Concept 12 — Reasoning
### 0. Яку проблему ми взагалі намагаємося вирішити?
Велика задача не виконується одним action. "Implement feature" включає requirements, code, tests, CI,
review. Якщо agent одразу діє без плану, він може пропустити залежності або робити зайві кроки.
Goal: implement ABC-123
↓
Need sequence of sub-goals/tasks
### 1. Головна ідея простими словами
Ключова думка
Planning — створення явної або неявної структури кроків до goal. Replanning — зміна плану після
observations/errors.
### 2. З яких компонентів це складається?
• Goal
• Task decomposition
• Dependencies
• Priority/order
• Plan state
• Replanning policy
• Completion criteria
### 3. Що фізично передається між компонентами?
Structured plan/task list/graph, status per step, assumptions, dependencies.
### 4. Що відбувається під капотом — крок за кроком
### 80. 1) User goal + constraints → planner model/code.
### 81. 2) Planner формує steps.
### 82. 3) Harness validates feasibility/permissions.
### 83. 4) Executor виконує step.
### 84. 5) Observation змінює state.
### 85. 6) Planner може revise remaining steps.

### 5. Де тут LLM, а де звичайний deterministic code?
LLM відповідає за probabilistic interpretation/decision/generation там, де потрібне розуміння природної
мови або вибір наступної дії. Усе, що стосується реального I/O, зберігання, permissions, network calls,
retries, schema validation, queues, databases і policy enforcement, виконується звичайним програмним
кодом та інфраструктурою. Межа між цими двома світами — одна з найважливіших mental models у
всьому курсі.
### 6. Повний простий приклад
1 Read Jira; 2 inspect repo; 3 identify affected module; 4 implement; 5 add tests; 6 run targeted tests; 7 run lint;
8 review diff.
### 7. Де це може впасти? — failure modes
• Plan hallucinated nonexistent tool
• Overplanning
• No replanning after new info
• Circular dependencies
• Plan drifts from goal
### 8. Security — що важливо захистити?
• Plan cannot bypass policy
• Approval before risky steps
• Do not expose secrets in plan text
### 9. Як це тестувати як QA/SDET?
• Known tasks with expected high-level steps
• Replanning after injected failure
• Stop when goal met
• Do not execute optional risky step without approval
### 10. Observability — що потрібно бачити в production?
Plan version, step transitions, replan reason, skipped/added steps, success per step.
### 11. Production considerations
У production важливо думати не лише про happy path, а про versioning, backward compatibility, latency,
cost, retries, idempotency, rate limits, concurrency, degradation/fallback, data retention, deployment,
monitoring і incident response. Конкретна вага цих факторів залежить від цієї концепції, але production-
система завжди повинна мати контрольовану поведінку при часткових збоях.
### 12. Як ця концепція пов’язана з іншими?
Ця концепція не існує ізольовано. Попередній логічний крок: Concept 10 — Tool Calling. Наступний:
Concept 12 — Reasoning. Під час навчання завжди повертайся до глобальної карти: модель, harness,
state/memory, tools/MCP, RAG, A2A, guardrails, evals та observability — це шари однієї системи.

### 13. Коротка відповідь на співбесіді
**Interview answer**
Planning decomposes a high-level goal into executable steps and dependencies. In agentic systems it is
valuable when tasks are multi-step, especially when the plan can be revised after new observations.
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
