# Concept 03 — RAG

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** PART II — Concept 3 (pdf)  
> Текст з PDF; DOCX не знайдено — таблиці/зображення не звірені.

## Review Mode

RAG: зовнішній retrieval pipeline знаходить релевантні знання і додає їх як context перед model call. LLM сама Vector DB не шукає. Concept 2 — Orchestration ↓ [Concept 3 — RAG] <-- ЗАРАЗ ВИВЧАЄМО ↓ Concept 4 — Agent Harness

## Study Mode

Concept 3. RAG — Retrieval-Augmented Generation
### QUICK VIEW — RAG: зовнішній retrieval pipeline знаходить релевантні знання і додає їх як context
перед model call. LLM сама Vector DB не шукає.
Concept 2 — Orchestration
↓
[Concept 3 — RAG] <-- ЗАРАЗ ВИВЧАЄМО
↓
Concept 4 — Agent Harness
### 0. Яку проблему ми взагалі намагаємося вирішити?
LLM не має автоматичного доступу до твоєї внутрішньої документації, а її training knowledge може бути
застарілим. Просто додавати 5 000 сторінок документації у prompt дорого, повільно і може перевищити
context window.
Потрібен механізм: знайти тільки релевантні шматки знань і передати їх моделі перед генерацією.
500-page documentation
↓
User asks one question
↓
Не хочемо надсилати всі 500 сторінок
↓
Потрібно знайти тільки релевантні фрагменти
### 1. Головна ідея простими словами
Ключова думка
RAG (Retrieval-Augmented Generation — генерація з доповненням через пошук) складається з двох фаз:
indexing та retrieval/runtime. Модель не виконує пошук сама; звичайний application code готує
зовнішній контекст.
### 2. З яких компонентів це складається?
• Document loader/parser
• Chunker
• Embedding model
• Vector database/index
• Retriever
• Metadata filters
• Reranker
• Context builder
• Generation LLM
### 3. Що фізично передається між компонентами?
Document text → chunks → embedding vectors (масиви чисел) + metadata. User question → query vector.
Retriever повертає chunk IDs/text + similarity scores. Context builder формує текстовий context для LLM.

### 4. Що відбувається під капотом — крок за кроком
### 19. 1) Loader читає PDF/HTML/Confluence і дістає текст.
### 20. 2) Chunker ріже текст на фрагменти керованого розміру.
### 21. 3) Embedding model перетворює кожен chunk у vector [0.12, -0.73, ...].
### 22. 4) Vector DB зберігає vector + reference на original text + metadata.
### 23. 5) Під час question application створює embedding самого question.
### 24. 6) Vector DB порівнює query vector зі stored vectors і повертає Top-K близьких результатів.
### 25. 7) За потреби reranker переставляє кандидатів за релевантністю.
### 26. 8) Context builder бере original chunk text і вставляє його у model input.
### 27. 9) LLM бачить user question + retrieved text і генерує відповідь.
### 5. Де тут LLM, а де звичайний deterministic code?
LLM відповідає за probabilistic interpretation/decision/generation там, де потрібне розуміння природної
мови або вибір наступної дії. Усе, що стосується реального I/O, зберігання, permissions, network calls,
retries, schema validation, queues, databases і policy enforcement, виконується звичайним програмним
кодом та інфраструктурою. Межа між цими двома світами — одна з найважливіших mental models у
всьому курсі.
### 6. Повний простий приклад
**Питання: "Як у нашому framework працює authentication fixture?" Retriever знаходить chunks із**
документації про auth fixture, а не весь repo wiki. LLM відповідає на основі цих фрагментів і може додати
source references.
### 7. Де це може впасти? — failure modes
• Поганий chunking
• Embedding не відображає domain vocabulary
• Top-K не містить правильний chunk
• Stale index
• Reranker відкинув корисний документ
• LLM hallucination попри правильний context
### 8. Security — що важливо захистити?
• ACL-aware retrieval
• Не індексувати secrets
• Tenant filters
• Source-level permissions
• Prompt injection у retrieved document
### 9. Як це тестувати як QA/SDET?
• Golden queries + expected relevant chunks
• Recall@K / Precision@K
• Groundedness
• Citation correctness
• Freshness after document update
• Permission filters

• Adversarial injected document
### 10. Observability — що потрібно бачити в production?
Логувати query, retrieval latency, selected chunk IDs, similarity scores, reranker scores, token count context,
generation latency, citation mapping.
### 11. Production considerations
У production важливо думати не лише про happy path, а про versioning, backward compatibility, latency,
cost, retries, idempotency, rate limits, concurrency, degradation/fallback, data retention, deployment,
monitoring і incident response. Конкретна вага цих факторів залежить від цієї концепції, але production-
система завжди повинна мати контрольовану поведінку при часткових збоях.
### 12. Як ця концепція пов’язана з іншими?
Ця концепція не існує ізольовано. Попередній логічний крок: Concept 2 — Orchestration. Наступний:
Concept 4 — Agent Harness. Під час навчання завжди повертайся до глобальної карти: модель, harness,
state/memory, tools/MCP, RAG, A2A, guardrails, evals та observability — це шари однієї системи.
### 13. Коротка відповідь на співбесіді
**Interview answer**
RAG retrieves relevant external knowledge before generation. The retrieval pipeline — parsing, chunking,
embeddings, vector search and context assembly — is ordinary application infrastructure; the LLM only
receives the selected context and generates the answer.
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
