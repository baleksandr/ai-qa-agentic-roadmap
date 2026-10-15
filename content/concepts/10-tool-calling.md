# Concept 10 — Tool Calling

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** PART II — Concept 10 (pdf)  
> Текст з PDF; DOCX не знайдено — таблиці/зображення не звірені.

## Review Mode

Tool Calling: LLM формує структурований намір викликати tool; application валідовує, авторизує і реально виконує операцію. Concept 9 — Multi-Agent System ↓ [Concept 10 — Tool Calling] <-- ЗАРАЗ ВИВЧАЄМО ↓ Concept 11 — Planning

## Study Mode

Concept 10. Tool Calling — виклик інструментів
### QUICK VIEW — Tool Calling: LLM формує структурований намір викликати tool; application валідовує,
авторизує і реально виконує операцію.
Concept 9 — Multi-Agent System
↓
[Concept 10 — Tool Calling] <-- ЗАРАЗ ВИВЧАЄМО
↓
Concept 11 — Planning
### 0. Яку проблему ми взагалі намагаємося вирішити?
LLM може сформулювати "треба перевірити Jira", але текст сам по собі не читає Jira. Нам потрібна межа
між probabilistic decision і deterministic execution.
LLM says: "I should get QA-123"
↓
Текст ≠ виконана HTTP операція
### 1. Головна ідея простими словами
Ключова думка
Tool calling — механізм, коли application описує available tools схемами, LLM повертає structured intent,
а application валідовує і реально виконує tool.
### 2. З яких компонентів це складається?
• Tool schema
• Model tool-selection capability
• Structured output parser
• Argument validator
• Permission checker
• Executor
• Result adapter
### 3. Що фізично передається між компонентами?
Tool schema: name/description/parameters. Model output: {tool, arguments}. Executor output: structured
result/error.
### 4. Що відбувається під капотом — крок за кроком
### 73. 1) Application передає tool schemas model API.
### 74. 2) LLM обирає tool і генерує arguments.
### 75. 3) Harness парсить structured output.
### 76. 4) Валідовує types/schema/policy.
### 77. 5) Виконує function/API/CLI.
### 78. 6) Нормалізує result.
### 79. 7) Додає tool result у next model context.

### 5. Де тут LLM, а де звичайний deterministic code?
LLM відповідає за probabilistic interpretation/decision/generation там, де потрібне розуміння природної
мови або вибір наступної дії. Усе, що стосується реального I/O, зберігання, permissions, network calls,
retries, schema validation, queues, databases і policy enforcement, виконується звичайним програмним
кодом та інфраструктурою. Межа між цими двома світами — одна з найважливіших mental models у
всьому курсі.
### 6. Повний простий приклад
Tool getJiraIssue(issueKey:string). LLM повертає getJiraIssue("QA-123"). Application робить REST request і
повертає JSON ticket.
### 7. Де це може впасти? — failure modes
• Hallucinated tool name
• Invalid argument
• Wrong tool chosen
• Tool side effect executed twice
• Huge result
• Tool timeout
### 8. Security — що важливо захистити?
• Never trust model arguments
• Allowlist
• Human approval
• Idempotency for side effects
• Sanitize output before re-injecting
### 9. Як це тестувати як QA/SDET?
• Schema validation
• Invalid args
• Tool unavailable
• Duplicate call
• Permission denied
• Result truncation
### 10. Observability — що потрібно бачити в production?
toolName, args hash/redacted args, duration, status, retry, downstream status code, side-effect id.
### 11. Production considerations
У production важливо думати не лише про happy path, а про versioning, backward compatibility, latency,
cost, retries, idempotency, rate limits, concurrency, degradation/fallback, data retention, deployment,
monitoring і incident response. Конкретна вага цих факторів залежить від цієї концепції, але production-
система завжди повинна мати контрольовану поведінку при часткових збоях.

### 12. Як ця концепція пов’язана з іншими?
Ця концепція не існує ізольовано. Попередній логічний крок: Concept 9 — Multi-Agent System. Наступний:
Concept 11 — Planning. Під час навчання завжди повертайся до глобальної карти: модель, harness,
state/memory, tools/MCP, RAG, A2A, guardrails, evals та observability — це шари однієї системи.
### 13. Коротка відповідь на співбесіді
**Interview answer**
The LLM does not execute tools. It produces a structured request to use a tool; deterministic application
code validates permissions and arguments, performs the real operation and returns the result to the model
context.
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
