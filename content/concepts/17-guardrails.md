# Concept 17 — Guardrails

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** PART II — Concept 17 (pdf)  
> Текст з PDF; DOCX не знайдено — таблиці/зображення не звірені.

## Review Mode

Guardrails: deterministic policies, permissions, validators, sandbox і approvals, які обмежують дії probabilistic model. Concept 16 — Agentic Workflows ↓ [Concept 17 — Guardrails] <-- ЗАРАЗ ВИВЧАЄМО ↓ Concept 18 — Observability

## Study Mode

Concept 17. Guardrails — обмеження і захист
### QUICK VIEW — Guardrails: deterministic policies, permissions, validators, sandbox і approvals, які
обмежують дії probabilistic model.
Concept 16 — Agentic Workflows
↓
[Concept 17 — Guardrails] <-- ЗАРАЗ ВИВЧАЄМО
↓
Concept 18 — Observability
### 0. Яку проблему ми взагалі намагаємося вирішити?
LLM probabilistic. Вона може неправильно зрозуміти instruction або бути атакована prompt injection. Не
можна дозволити моделі самій визначати, чи має вона право видалити production data.
LLM proposes action
↓
Policy/validation boundary
├─ allow
├─ deny
└─ human approval
### 1. Головна ідея простими словами
Ключова думка
Guardrails — deterministic controls навколо model behavior: permissions, validation, sandbox, content
policies, budgets і approvals.
### 2. З яких компонентів це складається?
• Input validator
• Output/schema validator
• Tool permission matrix
• Sandbox
• Allowlists/denylists
• Rate/cost limits
• Human approval
• Safety filters
### 3. Що фізично передається між компонентами?
Proposed action + arguments → policy decision allow/deny/approve; sanitized input/output.
### 4. Що відбувається під капотом — крок за кроком
### 114. 1) User/retrieved content проходить input checks.
### 115. 2) Model генерує response/tool call.
### 116. 3) Structured validator перевіряє schema.
### 117. 4) Policy engine перевіряє actor/tool/resource/action.
### 118. 5) Risky action може чекати human approval.
### 119. 6) Executor запускається лише після allow.

### 5. Де тут LLM, а де звичайний deterministic code?
LLM відповідає за probabilistic interpretation/decision/generation там, де потрібне розуміння природної
мови або вибір наступної дії. Усе, що стосується реального I/O, зберігання, permissions, network calls,
retries, schema validation, queues, databases і policy enforcement, виконується звичайним програмним
кодом та інфраструктурою. Межа між цими двома світами — одна з найважливіших mental models у
всьому курсі.
### 6. Повний простий приклад
Agent може read production logs, але production DB write заборонено; create Jira bug вимагає approval;
delete Jira issue відсутній у tool registry.
### 7. Де це може впасти? — failure modes
• Policy too permissive
• Guardrail bypass via indirect prompt injection
• False positives block work
• Inconsistent policy across tools
### 8. Security — що важливо захистити?
• Це і є core security layer: least privilege, defense in depth, sandbox, auditability.
### 9. Як це тестувати як QA/SDET?
• Prompt injection
• Unauthorized resource
• Malformed arguments
• Privilege escalation
• Approval bypass
• Rate-limit abuse
### 10. Observability — що потрібно бачити в production?
policy decision, rule id, actor, resource, denied/approved actions, approval latency.
### 11. Production considerations
У production важливо думати не лише про happy path, а про versioning, backward compatibility, latency,
cost, retries, idempotency, rate limits, concurrency, degradation/fallback, data retention, deployment,
monitoring і incident response. Конкретна вага цих факторів залежить від цієї концепції, але production-
система завжди повинна мати контрольовану поведінку при часткових збоях.
### 12. Як ця концепція пов’язана з іншими?
Ця концепція не існує ізольовано. Попередній логічний крок: Concept 16 — Agentic Workflows. Наступний:
Concept 18 — Observability. Під час навчання завжди повертайся до глобальної карти: модель, harness,
state/memory, tools/MCP, RAG, A2A, guardrails, evals та observability — це шари однієї системи.

### 13. Коротка відповідь на співбесіді
**Interview answer**
Guardrails are deterministic controls around the model. The model may propose an action, but permissions,
validation, sandboxing and approval must be enforced by trusted application code.
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
