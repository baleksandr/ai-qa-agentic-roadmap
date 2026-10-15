# Concept 01 — Memory & State

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** PART II — Concept 1  

## Review Mode

**QUICK VIEW:** State = де виконання знаходиться зараз. Memory = що система зберегла з минулого і може повернути в майбутній context.

- Проблема: LLM не «пам’ятає» між запитами без application state.
- State — поточний run; memory — збережене з минулого для наступних run.
- Harness + context builder вирішують, що повернути в context перед LLM.

## Study Mode

### 0. Яку проблему ми взагалі намагаємося вирішити?

Уявімо звичайний виклик LLM. Ти пишеш: «Мене звати Олександр». Модель відповідає. Запит завершився. Через хвилину ти робиш новий незалежний запит: «Як мене звати?». Якщо попередня інформація не була знову передана в контекст, модель не має магічного доступу до неї.

Для agentic-систем цього недостатньо ще сильніше. Агент може виконувати задачу 20 хвилин, робити 15 tool calls, чекати approval і відновлюватися після падіння процесу. Йому потрібно знати, що вже зроблено, що отримано і який наступний крок.

```
Request 1: "Мене звати Олександр"
↓
LLM
↓
Response
↓
request finished

Request 2: "Як мене звати?"
↓
LLM
↓
??? якщо application не повернула попередній контекст
```

### 1. Головна ідея простими словами

**Ключова думка**

Тому розділяємо дві речі. **State (стан)** — це поточний робочий стан виконання: `step=4`, `taskStatus=running`, `lastToolResult=...` **Memory (пам’ять)** — це інформація з минулого, яку система вирішила зберегти і, можливо, використати пізніше.

### 2. З яких компонентів це складається?

- State manager (менеджер стану)
- Short-term memory / conversation history
- Long-term memory storage
- Checkpoint store (контрольні точки)
- Context builder (збирач контексту)
- Retention / summarization logic

### 3. Що фізично передається між компонентами?

State часто представлений як JSON/об’єкт: `{runId, step, status, observations, openTasks}`. Memory може зберігатися як текстові записи, структуровані facts, summaries або embeddings + metadata.

### 4. Що відбувається під капотом — крок за кроком

1. Harness створює `runId` і початковий state.
2. Після кожної дії записує observation: результат tool, помилку, вибір користувача.
3. За потреби робить checkpoint у Redis/PostgreSQL/іншому сховищі.
4. Перед новим model call context builder вибирає релевантну частину state/history/memory.
5. LLM бачить лише те, що application поклала в context; вона не читає базу сама.
6. Після рестарту процес може відновити state із checkpoint і продовжити.

### 5. Де тут LLM, а де звичайний deterministic code?

LLM відповідає за probabilistic interpretation/decision/generation там, де потрібне розуміння природної мови або вибір наступної дії. Усе, що стосується реального I/O, зберігання, permissions, network calls, retries, schema validation, queues, databases і policy enforcement, виконується звичайним програмним кодом та інфраструктурою. Межа між цими двома світами — одна з найважливіших mental models у всьому курсі.

### 6. Повний простий приклад

QA Agent розслідує nightly failure. State: `runId=812`, `step=3`, `status=investigating`, `correlationId=abc`. Memory: «У цьому проєкті 500 часто означає product bug у Payment Service». State потрібен для поточного run, memory — для повторного використання знання.

### 7. Де це може впасти? — failure modes

- State загубився після рестарту → агент повторює небезпечну дію
- Стара memory підмішується в нову задачу → неправильний висновок
- Context переповнюється історією → latency/cost і деградація якості
- Checkpoint неатомарний → суперечливий стан

### 8. Security — що важливо захистити?

- Не зберігати secrets/PII без потреби
- Ізолювати memory між users/tenants
- TTL/retention policy
- Encryption at rest + access control

### 9. Як це тестувати як QA/SDET?

- Перевірити restore після crash
- Перевірити reset/new conversation isolation
- Перевірити concurrent updates
- Перевірити, що sensitive data не повертається іншому user
- Перевірити summarization не втрачає critical facts

### 10. Observability — що потрібно бачити в production?

Логувати state transitions, checkpoint id, memory reads/writes, selected memory items і причину retrieval. Не логувати секрети у відкритому вигляді.

### 11. Production considerations

У production важливо думати не лише про happy path, а про versioning, backward compatibility, latency, cost, retries, idempotency, rate limits, concurrency, degradation/fallback, data retention, deployment, monitoring і incident response. Конкретна вага цих факторів залежить від цієї концепції, але production-система завжди повинна мати контрольовану поведінку при часткових збоях.

### 12. Як ця концепція пов’язана з іншими?

Ця концепція не існує ізольовано. Попередній логічний крок: Fundamentals: LLM, context, tokens. Наступний: Concept 2 — Orchestration. Під час навчання завжди повертайся до глобальної карти: модель, harness, state/memory, tools/MCP, RAG, A2A, guardrails, evals та observability — це шари однієї системи.

### 13. Коротка відповідь на співбесіді

**Interview answer**

State описує поточне виконання workflow, а memory — інформацію з минулого, яку система може повторно використати. Обидва механізми контролює application/harness: він зберігає дані та вирішує, що саме повернути в контекст LLM.

### 14. “АААА, ось воно як!” — що треба запам’ятати

Не зубри визначення. Спробуй без документа намалювати flow від входу до виходу і для кожної стрілки відповісти: хто це виконує, що саме передається, де зберігається state, де працює LLM, а де звичайний код. Якщо можеш це відновити — концепція реально засвоєна.
