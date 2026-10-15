# Concept 18 — Observability

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** PART II — Concept 18 (pdf)  
> Текст з PDF; DOCX не знайдено — таблиці/зображення не звірені.

## Review Mode

Observability: logs, traces, metrics, token/cost/latency data та correlation IDs, що дозволяють відновити реальний execution path. Concept 17 — Guardrails ↓ [Concept 18 — Observability] <-- ЗАРАЗ ВИВЧАЄМО ↓ Concept 19 — Evaluation Benchmarks

## Study Mode

Concept 18. Observability — спостережуваність
### QUICK VIEW — Observability: logs, traces, metrics, token/cost/latency data та correlation IDs, що
дозволяють відновити реальний execution path.
Concept 17 — Guardrails
↓
[Concept 18 — Observability] <-- ЗАРАЗ ВИВЧАЄМО
↓
Concept 19 — Evaluation Benchmarks
### 0. Яку проблему ми взагалі намагаємося вирішити?
Agent може зробити 12 model calls і 8 tools. Якщо final answer неправильний, без telemetry ми не знаємо:
retrieval був поганий, tool повернув error, model неправильно інтерпретувала result чи orchestration
зробив retry storm.
User request
↓ many hidden steps
Final result
Без traces: "щось пішло не так"
### 1. Головна ідея простими словами
Ключова думка
Observability — здатність відновити внутрішню поведінку системи за logs, metrics, traces і structured
events.
### 2. З яких компонентів це складається?
• Logs
• Metrics
• Distributed traces
• Spans
• Correlation/trace IDs
• Dashboards
• Alerts
• Cost/token telemetry
### 3. Що фізично передається між компонентами?
Timestamped events, span context, attributes, counters/histograms, errors, latency, token/cost values.
### 4. Що відбувається під капотом — крок за кроком
### 120. 1) Root request отримує traceId.
### 121. 2) Кожен model/tool/retrieval step створює span.
### 122. 3) Context propagation передає traceId downstream.
### 123. 4) Metrics агрегують latency/error/success.
### 124. 5) Logs містять structured evidence.
### 125. 6) Backend збирає і візуалізує telemetry.

### 5. Де тут LLM, а де звичайний deterministic code?
LLM відповідає за probabilistic interpretation/decision/generation там, де потрібне розуміння природної
мови або вибір наступної дії. Усе, що стосується реального I/O, зберігання, permissions, network calls,
retries, schema validation, queues, databases і policy enforcement, виконується звичайним програмним
кодом та інфраструктурою. Межа між цими двома світами — одна з найважливіших mental models у
всьому курсі.
### 6. Повний простий приклад
Trace показує: RAG 180ms → LLM 2.1s → tool Jira 5.8s timeout → retry 5.6s → final latency 14s. Причина
очевидна.
### 7. Де це може впасти? — failure modes
• Missing trace propagation
• PII in logs
• Cardinality explosion
• Sampling hides rare incident
• Metrics без user-level semantics
### 8. Security — що важливо захистити?
• Redaction
• Access control to traces
• Retention
• Do not log full secrets/prompts blindly
### 9. Як це тестувати як QA/SDET?
• Trace completeness
• Correlation across services
• Metrics accuracy
• Alert threshold
• Log redaction
### 10. Observability — що потрібно бачити в production?
Це сама тема: ключові AI metrics — task success, tool error rate, retrieval latency, model latency, tokens,
cost, guardrail blocks, SLI/SLO.
### 11. Production considerations
У production важливо думати не лише про happy path, а про versioning, backward compatibility, latency,
cost, retries, idempotency, rate limits, concurrency, degradation/fallback, data retention, deployment,
monitoring і incident response. Конкретна вага цих факторів залежить від цієї концепції, але production-
система завжди повинна мати контрольовану поведінку при часткових збоях.

### 12. Як ця концепція пов’язана з іншими?
Ця концепція не існує ізольовано. Попередній логічний крок: Concept 17 — Guardrails. Наступний:
Concept 19 — Evaluation Benchmarks. Під час навчання завжди повертайся до глобальної карти: модель,
harness, state/memory, tools/MCP, RAG, A2A, guardrails, evals та observability — це шари однієї системи.
### 13. Коротка відповідь на співбесіді
**Interview answer**
Observability gives evidence of what happened inside an agent run through logs, metrics and traces. It is
essential because a wrong final answer can originate from retrieval, model, tool, orchestration or policy
layers.
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
