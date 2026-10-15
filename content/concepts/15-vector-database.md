# Concept 15 — Vector Database

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** PART II — Concept 15 (pdf)  
> Текст з PDF; DOCX не знайдено — таблиці/зображення не звірені.

## Review Mode

Vector Database: зберігає embeddings + metadata та підтримує similarity search для semantic retrieval. Concept 14 — Prompt Engineering ↓ [Concept 15 — Vector Database] <-- ЗАРАЗ ВИВЧАЄМО ↓ Concept 16 — Agentic Workflows

## Study Mode

Concept 15. Vector Database — векторна база даних
### QUICK VIEW — Vector Database: зберігає embeddings + metadata та підтримує similarity search для
semantic retrieval.
Concept 14 — Prompt Engineering
↓
[Concept 15 — Vector Database] <-- ЗАРАЗ ВИВЧАЄМО
↓
Concept 16 — Agentic Workflows
### 0. Яку проблему ми взагалі намагаємося вирішити?
Текстовий keyword search погано знаходить semantic similarity: "login timeout" і "authentication request
expires" можуть бути близькими за змістом без однакових слів.
Потрібно шукати за близькістю meaning representation.
Text chunk
↓ embedding model
[0.12, -0.73, 0.41, ...]
↓
store + index
### 1. Головна ідея простими словами
Ключова думка
Vector DB — сховище/індекс для embedding vectors і metadata, оптимізований під nearest-neighbor
similarity search.
### 2. З яких компонентів це складається?
• Vector
• Vector index (HNSW/IVF etc.)
• Document/chunk ID
• Metadata
• Original text/reference
• Similarity metric
• Filter engine
### 3. Що фізично передається між компонентами?
High-dimensional float arrays + metadata. Query — vector тієї ж dimensionality + optional filters.
### 4. Що відбувається під капотом — крок за кроком
### 101. 1) Embedding model створює vector fixed dimension.
### 102. 2) DB зберігає vector і будує approximate nearest-neighbor index.
### 103. 3) Query vector приходить у search.
### 104. 4) Index знаходить кандидатів без повного порівняння з усіма vectors.
### 105. 5) Metric (cosine/dot product/L2 залежно від system) ранжує.
### 106. 6) Повертаються IDs/scores/metadata.

### 5. Де тут LLM, а де звичайний deterministic code?
LLM відповідає за probabilistic interpretation/decision/generation там, де потрібне розуміння природної
мови або вибір наступної дії. Усе, що стосується реального I/O, зберігання, permissions, network calls,
retries, schema validation, queues, databases і policy enforcement, виконується звичайним програмним
кодом та інфраструктурою. Межа між цими двома світами — одна з найважливіших mental models у
всьому курсі.
### 6. Повний простий приклад
Chunk про "Playwright auto-waiting" і query "how does synchronization work" можуть мати близькі vectors,
тому semantic search поверне цей chunk.
### 7. Де це може впасти? — failure modes
• Wrong embedding model/dimension
• Index stale
• Filters remove correct chunk
• Approximate search misses neighbor
• Metadata inconsistency
### 8. Security — що важливо захистити?
• Tenant filters must be mandatory
• Encrypt sensitive metadata
• Delete vectors when source permission revoked
### 9. Як це тестувати як QA/SDET?
• Known nearest-neighbor queries
• Filter correctness
• Recall@K
• Delete/update consistency
• Load/latency
### 10. Observability — що потрібно бачити в production?
query latency, candidates scanned, index version, Top-K scores, filter selectivity.
### 11. Production considerations
У production важливо думати не лише про happy path, а про versioning, backward compatibility, latency,
cost, retries, idempotency, rate limits, concurrency, degradation/fallback, data retention, deployment,
monitoring і incident response. Конкретна вага цих факторів залежить від цієї концепції, але production-
система завжди повинна мати контрольовану поведінку при часткових збоях.
### 12. Як ця концепція пов’язана з іншими?
Ця концепція не існує ізольовано. Попередній логічний крок: Concept 14 — Prompt Engineering.
Наступний: Concept 16 — Agentic Workflows. Під час навчання завжди повертайся до глобальної карти:

модель, harness, state/memory, tools/MCP, RAG, A2A, guardrails, evals та observability — це шари однієї
системи.
### 13. Коротка відповідь на співбесіді
**Interview answer**
A vector database stores embedding vectors with references and metadata, then performs nearest-neighbor
search so semantically similar content can be retrieved even when exact keywords differ.
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
