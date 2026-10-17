# Concept 15 — Vector Database

> **migrationStatus:** `partial` — Study Mode: 8 розділів (PART II пакет 2).

## Review Mode

**Проблема:** пошук по великому корпусу тексту «ключовими словами» пропускає семантично близькі фрагменти.

**Ідея vector database (векторна база):** сховище **embedding-векторів** + metadata з similarity search. У RAG — поширений, але **не єдиний** спосіб retrieval.

**Для QA:** recall на golden queries, ACL на metadata, свіжість індексу.

## Study Mode

### Навіщо vector DB у QA-агенті?

Postmortem і Confluence містять тисячі сторінок. Для питання після `login_spec` потрібні **2–5 релевантних chunks**, не весь wiki. Offline pipeline (див. RAG) ріже текст, embed model перетворює chunk у вектор, vector DB зберігає вектор + `chunk_id` + ACL metadata.

| Термін | Простими словами |
|--------|------------------|
| **Embedding** | Числовий вектор «змісту» тексту |
| **Similarity search** | Top-K найближчих векторів до query vector |

### Де в investigation?

*Навчальний приклад.*

Query: «timeout submit button login staging». Retriever embed query → vector DB повертає `chunk_id` INC-318, runbook-login, з **scores**. Context builder фільтрує по tenant → передає текст у prompt. LLM формулює гіпотезу; **правда про DOM** — у Playwright trace, не в DB.

documents → chunks → vectors → index → query vector → Top-K → context

### Компоненти

| Компонент | Роль |
|-----------|------|
| Collection / index | Namespace документів |
| Metadata filters | tenant, product, date |
| Hybrid (опційно) | BM25 + vectors |

### Послідовність runtime

**Код:** embed query, search, ACL filter. **Вихід:** chunk texts + ids. **LLM:** generation з evidence. **QA:** assert ids у trace match дозволеним ACL.

### Код vs LLM

Пошук і ACL — код. Відповідь — LLM. Vector DB — зовнішній сервіс.

### Збої

Stale index після оновлення runbook. Wrong Top-K без rerank. **QA:** golden query → expected chunk ids; reindex regression.

### Production

Reindex versioning, monitoring recall@K, cost embed API. Альтернатива vector DB — інші індекси (BM25); RAG не = vector only.

### Запам’ятати та співбесіда

Vector DB — **інструмент retrieval**, не визначення RAG. Перевіряйте chunks у prompt і groundedness.

:::study-sources
- *AI Engineering*, 2025 — embeddings, vector search (inventory).
- V10 Concept 15; узгоджено з concept-03 RAG.
:::study-sources-end
