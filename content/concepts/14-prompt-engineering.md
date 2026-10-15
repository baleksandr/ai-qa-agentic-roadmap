# Concept 14 — Prompt Engineering

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** PART II — Concept 14 (pdf)  
> Текст з PDF; DOCX не знайдено — таблиці/зображення не звірені.

## Review Mode

Prompt Engineering: проєктування instruction, constraints, examples і output format для конкретної задачі. Concept 13 — Fine-tuning ↓ [Concept 14 — Prompt Engineering] <-- ЗАРАЗ ВИВЧАЄМО ↓ Concept 15 — Vector Database

## Study Mode

Concept 14. Prompt Engineering — проєктування промптів
### QUICK VIEW — Prompt Engineering: проєктування instruction, constraints, examples і output format для
конкретної задачі.
Concept 13 — Fine-tuning
↓
[Concept 14 — Prompt Engineering] <-- ЗАРАЗ ВИВЧАЄМО
↓
Concept 15 — Vector Database
### 0. Яку проблему ми взагалі намагаємося вирішити?
LLM реагує на формулювання, структуру та контекст. Розмитий prompt "зроби тести" дає розмитий
результат. Потрібно чітко описати роль, task, constraints, format і examples.
Vague prompt
↓
Vague/variable output
Structured instruction
↓
More reliable behavior
### 1. Головна ідея простими словами
Ключова думка
Prompt Engineering — дизайн instructions і input context так, щоб модель розуміла задачу, межі, критерії
й формат результату.
### 2. З яких компонентів це складається?
• System instruction
• User request
• Context
• Examples/few-shot
• Output schema
• Constraints/guardrails text
### 3. Що фізично передається між компонентами?
Text/messages, structured JSON schema, examples, retrieved context.
### 4. Що відбувається під капотом — крок за кроком
### 97. 1) Application збирає messages у визначеному order.
### 98. 2) Model tokenizer перетворює їх у tokens.
### 99. 3) Attention дозволяє використовувати instructions/context під час generation.
### 100. 4) Output parser/validator перевіряє формат.

### 5. Де тут LLM, а де звичайний deterministic code?
LLM відповідає за probabilistic interpretation/decision/generation там, де потрібне розуміння природної
мови або вибір наступної дії. Усе, що стосується реального I/O, зберігання, permissions, network calls,
retries, schema validation, queues, databases і policy enforcement, виконується звичайним програмним
кодом та інфраструктурою. Межа між цими двома світами — одна з найважливіших mental models у
всьому курсі.
### 6. Повний простий приклад
Замість "write tests": роль Senior SDET + acceptance criteria + framework conventions + list risks + require
JSON fields title/preconditions/steps/expected + do not invent unavailable APIs.
### 7. Де це може впасти? — failure modes
• Instruction conflict
• Prompt injection
• Too much irrelevant context
• Ambiguous schema
• Example bias
### 8. Security — що важливо захистити?
• Treat external content as untrusted data
• Separate instructions from retrieved/user content
• Do not put secrets in prompt
### 9. Як це тестувати як QA/SDET?
• Prompt regression dataset
• A/B versions
• Schema pass rate
• Instruction compliance
• Adversarial injection
### 10. Observability — що потрібно бачити в production?
Prompt/version hash, context sources, tokens, output validation failures, quality score.
### 11. Production considerations
У production важливо думати не лише про happy path, а про versioning, backward compatibility, latency,
cost, retries, idempotency, rate limits, concurrency, degradation/fallback, data retention, deployment,
monitoring і incident response. Конкретна вага цих факторів залежить від цієї концепції, але production-
система завжди повинна мати контрольовану поведінку при часткових збоях.
### 12. Як ця концепція пов’язана з іншими?
Ця концепція не існує ізольовано. Попередній логічний крок: Concept 13 — Fine-tuning. Наступний:
Concept 15 — Vector Database. Під час навчання завжди повертайся до глобальної карти: модель,
harness, state/memory, tools/MCP, RAG, A2A, guardrails, evals та observability — це шари однієї системи.

### 13. Коротка відповідь на співбесіді
**Interview answer**
Prompt engineering is the design of instructions, examples, constraints and output format given to the model.
It shapes runtime behavior without changing model weights.
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
