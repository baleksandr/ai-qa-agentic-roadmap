# Concept 13 — Fine-tuning

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** PART II — Concept 13 (pdf)  
> Текст з PDF; DOCX не знайдено — таблиці/зображення не звірені.

## Review Mode

Fine-tuning: додаткове навчання змінює поведінку/параметри моделі; це не заміна RAG для свіжих зовнішніх знань. Concept 12 — Reasoning ↓ [Concept 13 — Fine-tuning] <-- ЗАРАЗ ВИВЧАЄМО ↓ Concept 14 — Prompt Engineering

## Study Mode

Concept 13. Fine-tuning — донавчання
### QUICK VIEW — Fine-tuning: додаткове навчання змінює поведінку/параметри моделі; це не заміна
RAG для свіжих зовнішніх знань.
Concept 12 — Reasoning
↓
[Concept 13 — Fine-tuning] <-- ЗАРАЗ ВИВЧАЄМО
↓
Concept 14 — Prompt Engineering
### 0. Яку проблему ми взагалі намагаємося вирішити?
Prompting/RAG не завжди дають стабільну поведінку або потрібний стиль/формат. Іноді хочемо змінити
саму learned behavior моделі для спеціалізованого task distribution.
Base model
+ curated training examples
↓
additional training
↓
tuned model
### 1. Головна ідея простими словами
Ключова думка
Fine-tuning — додаткове training на прикладах, яке змінює model weights/behavior. Це не механізм для
"підвантажити сьогоднішні Jira tickets" — для актуальних знань краще RAG/MCP.
### 2. З яких компонентів це складається?
• Base model
• Training dataset
• Preprocessing
• Training objective
• Trainer/optimizer
• Evaluation set
• Tuned model artifact/version
### 3. Що фізично передається між компонентами?
Input-output training examples, labels/preferences, gradients/weight updates (у training infrastructure),
resulting model version.
### 4. Що відбувається під капотом — крок за кроком
### 90. 1) Готуємо representative examples.
### 91. 2) Форматуємо їх під training API/pipeline.
### 92. 3) Model робить forward pass, loss порівнює prediction з target.
### 93. 4) Optimizer оновлює weights.
### 94. 5) Повторюємо epochs/steps.
### 95. 6) Eval перевіряє generalization.

### 96. 7) Deploy new model version.
### 5. Де тут LLM, а де звичайний deterministic code?
LLM відповідає за probabilistic interpretation/decision/generation там, де потрібне розуміння природної
мови або вибір наступної дії. Усе, що стосується реального I/O, зберігання, permissions, network calls,
retries, schema validation, queues, databases і policy enforcement, виконується звичайним програмним
кодом та інфраструктурою. Межа між цими двома світами — одна з найважливіших mental models у
всьому курсі.
### 6. Повний простий приклад
Тисячі validated examples "requirement → concise structured test design" можуть покращити consistency
спеціалізованої моделі. Але список поточних tickets все одно не треба baked into weights.
### 7. Де це може впасти? — failure modes
• Overfitting
• Catastrophic behavior regression
• Bad dataset bias
• Memorization of sensitive data
• No measurable gain over prompting
### 8. Security — що важливо захистити?
• PII/secrets in training data
• Data rights/licensing
• Model extraction/memorization risk
### 9. Як це тестувати як QA/SDET?
• Holdout eval set
• Before/after benchmark
• Safety regression
• Format adherence
• Domain edge cases
### 10. Observability — що потрібно бачити в production?
Dataset version, training config, model version, eval scores, drift after deployment.
### 11. Production considerations
У production важливо думати не лише про happy path, а про versioning, backward compatibility, latency,
cost, retries, idempotency, rate limits, concurrency, degradation/fallback, data retention, deployment,
monitoring і incident response. Конкретна вага цих факторів залежить від цієї концепції, але production-
система завжди повинна мати контрольовану поведінку при часткових збоях.

### 12. Як ця концепція пов’язана з іншими?
Ця концепція не існує ізольовано. Попередній логічний крок: Concept 12 — Reasoning. Наступний:
Concept 14 — Prompt Engineering. Під час навчання завжди повертайся до глобальної карти: модель,
harness, state/memory, tools/MCP, RAG, A2A, guardrails, evals та observability — це шари однієї системи.
### 13. Коротка відповідь на співбесіді
**Interview answer**
Fine-tuning changes model behavior by updating weights on additional examples. RAG changes runtime
context without changing weights, so RAG is usually better for fresh external knowledge while fine-tuning is
for behavior/style/task adaptation.
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
