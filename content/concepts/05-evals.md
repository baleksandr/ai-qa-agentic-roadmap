# Concept 05 — Evals

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** PART II — Concept 5 (pdf)  
> Текст з PDF; DOCX не знайдено — таблиці/зображення не звірені.

## Review Mode

Evals: систематичне вимірювання якості probabilistic output та agent behavior на контрольованих прикладах і метриках. Concept 4 — Agent Harness ↓ [Concept 5 — Evals] <-- ЗАРАЗ ВИВЧАЄМО ↓ Concept 6 — MCP

## Study Mode

Concept 5. Evals — оцінювання AI-систем
### QUICK VIEW — Evals: систематичне вимірювання якості probabilistic output та agent behavior на
контрольованих прикладах і метриках.
Concept 4 — Agent Harness
↓
[Concept 5 — Evals] <-- ЗАРАЗ ВИВЧАЄМО
↓
Concept 6 — MCP
### 0. Яку проблему ми взагалі намагаємося вирішити?
Звичайний тест часто має expected=true/false. Для generative output дві різні відповіді можуть бути обидві
правильними, а текст може бути граматично красивим, але фактично неправильним.
Тому потрібні evals — повторювані набори задач і оцінювачів, які переводять якість у вимірювані сигнали.
Prompt
↓
LLM
↓
"Правильна" відповідь може мати 100 формулювань
↓
assert(actual === expected) часто не працює
### 1. Головна ідея простими словами
Ключова думка
Eval — це контрольований експеримент: dataset → run system → evaluator(s) → metrics → thresholds →
compare versions.
### 2. З яких компонентів це складається?
• Evaluation dataset / golden set
• Runner
• Deterministic checks
• Semantic evaluator
• LLM-as-Judge
• Human review
• Safety evaluator
• Metric aggregator
• Threshold/gate
### 3. Що фізично передається між компонентами?
Input cases, expected facts/rubric, actual outputs, tool trajectory, scores, labels, explanations.
### 4. Що відбувається під капотом — крок за кроком
### 37. 1) Фіксуємо набір representative cases.
### 38. 2) Запускаємо однакову system version/config.
### 39. 3) Збираємо outputs + traces.

### 40. 4) Deterministic evaluators перевіряють schema/required facts.
### 41. 5) Semantic/LLM judges оцінюють relevance/groundedness.
### 42. 6) Safety eval перевіряє policy violations.
### 43. 7) Aggregator рахує score distributions.
### 44. 8) CI gate порівнює з baseline/threshold.
### 5. Де тут LLM, а де звичайний deterministic code?
LLM відповідає за probabilistic interpretation/decision/generation там, де потрібне розуміння природної
мови або вибір наступної дії. Усе, що стосується реального I/O, зберігання, permissions, network calls,
retries, schema validation, queues, databases і policy enforcement, виконується звичайним програмним
кодом та інфраструктурою. Межа між цими двома світами — одна з найважливіших mental models у
всьому курсі.
### 6. Повний простий приклад
100 Jira tickets → agent генерує test scenarios. Метрики: requirement coverage, hallucination rate, unsafe tool
calls, average latency, cost per task. Нова model version не проходить, якщо coverage -8%.
### 7. Де це може впасти? — failure modes
• Judge bias
• Dataset leakage
• Overfitting to benchmark
• Poor rubric
• High variance
• Metric не корелює з user value
### 8. Security — що важливо захистити?
• Не передавати sensitive eval data зовнішньому judge без дозволу
• Red-team dataset
• PII leakage checks
### 9. Як це тестувати як QA/SDET?
• Test evaluators themselves
• Calibration against human labels
• Repeatability
• Confidence intervals
• Regression thresholds
### 10. Observability — що потрібно бачити в production?
Зберігати model/version/prompt hash/dataset version, per-case score, judge rationale, latency, token usage.
### 11. Production considerations
У production важливо думати не лише про happy path, а про versioning, backward compatibility, latency,
cost, retries, idempotency, rate limits, concurrency, degradation/fallback, data retention, deployment,

monitoring і incident response. Конкретна вага цих факторів залежить від цієї концепції, але production-
система завжди повинна мати контрольовану поведінку при часткових збоях.
### 12. Як ця концепція пов’язана з іншими?
Ця концепція не існує ізольовано. Попередній логічний крок: Concept 4 — Agent Harness. Наступний:
Concept 6 — MCP. Під час навчання завжди повертайся до глобальної карти: модель, harness,
state/memory, tools/MCP, RAG, A2A, guardrails, evals та observability — це шари однієї системи.
### 13. Коротка відповідь на співбесіді
**Interview answer**
Evals are repeatable quality measurements for probabilistic AI behavior. Instead of relying only on binary
assertions, they combine deterministic checks, semantic scoring, judges, safety evaluation and human
review against a fixed dataset.
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
