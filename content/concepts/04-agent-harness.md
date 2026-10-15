# Concept 04 — Agent Harness

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** PART II — Concept 4 (pdf)  
> Текст з PDF; DOCX не знайдено — таблиці/зображення не звірені.

## Review Mode

Agent Harness: звичайний software layer навколо LLM, який керує context, tools, state, loop, permissions, retries, stop conditions і tracing. Concept 3 — RAG ↓ [Concept 4 — Agent Harness] <-- ЗАРАЗ ВИВЧАЄМО ↓ Concept 5 — Evals

## Study Mode

Concept 4. Agent Harness — виконавча оболонка агента
### QUICK VIEW — Agent Harness: звичайний software layer навколо LLM, який керує context, tools, state,
loop, permissions, retries, stop conditions і tracing.
Concept 3 — RAG
↓
[Concept 4 — Agent Harness] <-- ЗАРАЗ ВИВЧАЄМО
↓
Concept 5 — Evals
### 0. Яку проблему ми взагалі намагаємося вирішити?
LLM може отримати context і згенерувати response, але сама по собі не запускає Playwright, не читає Jira,
не зберігає state, не контролює permissions і не вирішує технічно, коли зупинити цикл.
Щоб модель стала частиною системи, яка реально діє, потрібен програмний каркас навколо неї.
Context
↓
LLM
↓
Response
А де tools? state? retries? permissions? tracing?
### 1. Головна ідея простими словами
Ключова думка
Agent Harness — звичайний програмний runtime навколо LLM. Він збирає context, викликає model API,
парсить tool calls, перевіряє policy, виконує tools, зберігає state, повторює loop і збирає trace.
### 2. З яких компонентів це складається?
• Context builder
• Model client
• Tool registry
• Tool executor
• State manager
• Memory layer
• Policy/permission layer
• Retry/timeout logic
• Stop conditions
• Tracing/telemetry
### 3. Що фізично передається між компонентами?
Model input — messages + tool schemas + context. Model output — text або structured tool call. Tool executor
приймає validated arguments і повертає structured result/error.
### 4. Що відбувається під капотом — крок за кроком
### 28. 1) Harness створює run.

### 29. 2) Збирає system instructions, user input, state, tools.
### 30. 3) Викликає model API.
### 31. 4) Якщо output=text — може завершити.
### 32. 5) Якщо output=tool_call — валідовує schema/permissions.
### 33. 6) Виконує deterministic tool code.
### 34. 7) Записує observation/state.
### 35. 8) Додає result у наступний model context.
### 36. 9) Повторює до stop condition.
### 5. Де тут LLM, а де звичайний deterministic code?
LLM відповідає за probabilistic interpretation/decision/generation там, де потрібне розуміння природної
мови або вибір наступної дії. Усе, що стосується реального I/O, зберігання, permissions, network calls,
retries, schema validation, queues, databases і policy enforcement, виконується звичайним програмним
кодом та інфраструктурою. Межа між цими двома світами — одна з найважливіших mental models у
всьому курсі.
### 6. Повний простий приклад
QA Agent отримує "розбери nightly failure" → LLM просить getCiFailure → harness виконує API call → result 500
→ LLM просить getLogs → harness виконує log query → LLM робить висновок "product bug".
### 7. Де це може впасти? — failure modes
• Infinite tool loop
• Tool call з невалідними аргументами
• Модель просить заборонену операцію
• Timeout завислого tool
• State lost
• Context overflow
### 8. Security — що важливо захистити?
• Policy enforcement не віддавати LLM
• Allowlist tools
• Sandbox
• Human approval для destructive actions
• Secret isolation
### 9. Як це тестувати як QA/SDET?
• Unit tests harness logic
• Schema validation
• Permission tests
• Retry/timeout
• Stop conditions
• Mock model outputs
• End-to-end deterministic fixtures

### 10. Observability — що потрібно бачити в production?
Trace кожного model call/tool call, token usage, latency, state transitions, policy decisions, errors, retries,
cost.
### 11. Production considerations
У production важливо думати не лише про happy path, а про versioning, backward compatibility, latency,
cost, retries, idempotency, rate limits, concurrency, degradation/fallback, data retention, deployment,
monitoring і incident response. Конкретна вага цих факторів залежить від цієї концепції, але production-
система завжди повинна мати контрольовану поведінку при часткових збоях.
### 12. Як ця концепція пов’язана з іншими?
Ця концепція не існує ізольовано. Попередній логічний крок: Concept 3 — RAG. Наступний: Concept 5 —
Evals. Під час навчання завжди повертайся до глобальної карти: модель, harness, state/memory,
tools/MCP, RAG, A2A, guardrails, evals та observability — це шари однієї системи.
### 13. Коротка відповідь на співбесіді
**Interview answer**
An agent harness is the deterministic runtime around an LLM. It manages context, tool execution, state,
permissions, retries, stop conditions and tracing, while the LLM primarily makes probabilistic decisions
about what to do next.
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
