# Concept 12 — Reasoning

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** PART II — Concept 12 (pdf)  
> Текст з PDF; DOCX не знайдено — таблиці/зображення не звірені.

## Review Mode

Reasoning: model inference аналізує context і формує рішення/наступну дію. Reasoning сам по собі ще не робить систему agent. Concept 11 — Planning ↓ [Concept 12 — Reasoning] <-- ЗАРАЗ ВИВЧАЄМО ↓ Concept 13 — Fine-tuning

## Study Mode

Concept 12. Reasoning — міркування
### QUICK VIEW — Reasoning: model inference аналізує context і формує рішення/наступну дію.
Reasoning сам по собі ще не робить систему agent.
Concept 11 — Planning
↓
[Concept 12 — Reasoning] <-- ЗАРАЗ ВИВЧАЄМО
↓
Concept 13 — Fine-tuning
### 0. Яку проблему ми взагалі намагаємося вирішити?
Модель має не лише продовжити текст, а вибрати між альтернативами: відповідати зараз, викликати tool,
попросити уточнення, перевірити факт. Для цього потрібне внутрішнє обчислення над context.
Context
↓
Model inference
↓
Decision / answer / tool proposal
### 1. Головна ідея простими словами
Ключова думка
Reasoning — процес, у якому модель використовує context і свої learned representations для отримання
рішення/проміжної стратегії. Reasoning ≠ agent: без harness/tools воно не виконує зовнішні actions.
### 2. З яких компонентів це складається?
• Context
• Model weights
• Inference process
• Optional intermediate reasoning representation
• Decision/output
### 3. Що фізично передається між компонентами?
Input tokens → internal activations → output token probabilities / structured decision. Детальні внутрішні
міркування не обов’язково доступні application.
### 4. Що відбувається під капотом — крок за кроком
### 86. 1) Context токенізується.
### 87. 2) Transformer обчислює representations/attention across tokens.
### 88. 3) Model генерує наступні tokens або structured choice.
### 89. 4) Harness інтерпретує output як answer/tool call/plan.
### 5. Де тут LLM, а де звичайний deterministic code?
LLM відповідає за probabilistic interpretation/decision/generation там, де потрібне розуміння природної
мови або вибір наступної дії. Усе, що стосується реального I/O, зберігання, permissions, network calls,

retries, schema validation, queues, databases і policy enforcement, виконується звичайним програмним
кодом та інфраструктурою. Межа між цими двома світами — одна з найважливіших mental models у
всьому курсі.
### 6. Повний простий приклад
Після 500 error + backend stack trace модель робить висновок: більш імовірно product defect, тому
рекомендує створити bug, а не rerun test.
### 7. Де це може впасти? — failure modes
• Confident wrong inference
• Missing context
• Bias toward first hypothesis
• Overthinking/latency
• Reasoning not grounded in evidence
### 8. Security — що важливо захистити?
• Do not rely on model reasoning for authorization
• Sensitive reasoning/context exposure
• Policy decisions deterministic
### 9. Як це тестувати як QA/SDET?
• Reasoning-sensitive eval tasks
• Counterexamples
• Evidence attribution
• Tool-choice accuracy
• Robustness to irrelevant context
### 10. Observability — що потрібно бачити в production?
Input/output, decision labels, model version, latency/tokens; не вимагати/логувати прихований chain-of-
thought як production dependency.
### 11. Production considerations
У production важливо думати не лише про happy path, а про versioning, backward compatibility, latency,
cost, retries, idempotency, rate limits, concurrency, degradation/fallback, data retention, deployment,
monitoring і incident response. Конкретна вага цих факторів залежить від цієї концепції, але production-
система завжди повинна мати контрольовану поведінку при часткових збоях.
### 12. Як ця концепція пов’язана з іншими?
Ця концепція не існує ізольовано. Попередній логічний крок: Concept 11 — Planning. Наступний: Concept
13 — Fine-tuning. Під час навчання завжди повертайся до глобальної карти: модель, harness,
state/memory, tools/MCP, RAG, A2A, guardrails, evals та observability — це шари однієї системи.

### 13. Коротка відповідь на співбесіді
**Interview answer**
Reasoning is the model’s inference over context to choose an answer or next action. It can improve
decisions, but it is still probabilistic and does not replace deterministic policy, validation or tool execution.
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
