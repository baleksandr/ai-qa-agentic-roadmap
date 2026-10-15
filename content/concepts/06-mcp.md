# Concept 06 — MCP

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** PART II — Concept 6 (pdf)  
> Текст з PDF; DOCX не знайдено — таблиці/зображення не звірені.

## Review Mode

MCP: стандартний protocol layer між AI application та зовнішніми tools/data. LLM не є MCP client і не виконує tool сама. Concept 5 — Evals ↓ [Concept 6 — MCP] <-- ЗАРАЗ ВИВЧАЄМО ↓ Concept 7 — Skills

## Study Mode

Concept 6. MCP — Model Context Protocol
### QUICK VIEW — MCP: стандартний protocol layer між AI application та зовнішніми tools/data. LLM не є
MCP client і не виконує tool сама.
Concept 5 — Evals
↓
[Concept 6 — MCP] <-- ЗАРАЗ ВИВЧАЄМО
↓
Concept 7 — Skills
### 0. Яку проблему ми взагалі намагаємося вирішити?
LLM не є Jira client, database driver чи filesystem. Tool calling дозволяє моделі попросити про дію, але без
стандарту кожна AI application пише власні custom integrations.
MCP стандартизує спосіб discovery та виклику tools/resources/prompts між AI host/client і зовнішнім
server.
LLM ≠ Jira client
LLM ≠ HTTP client
LLM ≠ database driver
LLM ≠ filesystem
Потрібен deterministic integration code.
### 1. Головна ідея простими словами
Ключова думка
MCP — протокол. MCP Server — звичайна програма, яка exposes capabilities. MCP Client у host
application підключається, проходить initialization/capability negotiation, робить discovery і protocol
requests.
### 2. З яких компонентів це складається?
• Host application
• MCP Client
• Transport
• MCP Server
• Tool/resource/prompt schemas
• Adapter code
• External API/service
### 3. Що фізично передається між компонентами?
Structured protocol messages: initialize, list tools/resources/prompts, call tool, result/error. Tool
arguments/results — machine-readable JSON-like structures.
### 4. Що відбувається під капотом — крок за кроком
### 45. 1) Host запускає/підключає MCP client до server.
### 46. 2) Client/server обмінюються protocol version та capabilities.
### 47. 3) Client робить discovery доступних tools/resources/prompts.

### 48. 4) Host вибирає tool schemas і передає їх model API.
### 49. 5) LLM генерує tool call intent.
### 50. 6) Harness передає call MCP client.
### 51. 7) MCP client формує protocol request.
### 52. 8) MCP server виконує adapter logic, наприклад Jira REST call.
### 53. 9) Result повертається client → host → model context.
### 54. 10) LLM бачить result і формує next action/final answer.
### 5. Де тут LLM, а де звичайний deterministic code?
LLM відповідає за probabilistic interpretation/decision/generation там, де потрібне розуміння природної
мови або вибір наступної дії. Усе, що стосується реального I/O, зберігання, permissions, network calls,
retries, schema validation, queues, databases і policy enforcement, виконується звичайним програмним
кодом та інфраструктурою. Межа між цими двома світами — одна з найважливіших mental models у
всьому курсі.
### 6. Повний простий приклад
User: "Status QA-123?" → LLM просить get_issue → harness → MCP client → jira-mcp-server → Jira REST API →
JSON status=In Progress → назад у context → final answer.
### 7. Де це може впасти? — failure modes
• Version mismatch
• Server unavailable
• Tool schema drift
• Auth expired
• Malformed tool result
• Timeout
• Server returns too much data
### 8. Security — що важливо захистити?
• Per-server permissions
• Credential isolation
• Tool allowlist
• Human approval
• Input validation
• Audit logs
### 9. Як це тестувати як QA/SDET?
• Initialization
• Discovery
• Schema compatibility
• Tool success/error
• Timeout/retry
• Permission denied
• Server restart
• External API degradation

### 10. Observability — що потрібно бачити в production?
connectionId/serverId/toolName, request duration, result size, protocol errors, downstream API latency, auth
failures.
### 11. Production considerations
У production важливо думати не лише про happy path, а про versioning, backward compatibility, latency,
cost, retries, idempotency, rate limits, concurrency, degradation/fallback, data retention, deployment,
monitoring і incident response. Конкретна вага цих факторів залежить від цієї концепції, але production-
система завжди повинна мати контрольовану поведінку при часткових збоях.
### 12. Як ця концепція пов’язана з іншими?
Ця концепція не існує ізольовано. Попередній логічний крок: Concept 5 — Evals. Наступний: Concept 7 —
Skills. Під час навчання завжди повертайся до глобальної карти: модель, harness, state/memory,
tools/MCP, RAG, A2A, guardrails, evals та observability — це шари однієї системи.
### 13. Коротка відповідь на співбесіді
**Interview answer**
MCP is a standardized integration protocol between AI applications and external capabilities. The model does
not speak to Jira directly: the host exposes tool schemas, the LLM requests a tool call, and deterministic MCP
client/server code executes the real integration.
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
