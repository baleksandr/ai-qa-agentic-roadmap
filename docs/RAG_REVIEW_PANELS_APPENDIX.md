# Додаток до RAG_REVIEW_BUNDLE — повні тексти інтерактивних панелей

Тексти нижче відповідають тому, що рендерить UI після кліку (`studyPanelLabels` + `StudyPanelTerms` під панеллю). Джерело — `src/data/study/*.ts` станом на останню правку уроку concept-03.

---

## D.1 Передумова run (`rag-query-flow-steps.ts` → `RAG_ONE_QUERY_PREREQUISITE`)

**Що це?** Offline-індекс: postmortem і incident notes уже в searchable store (наприклад `index-v12`). Підготовка знань завершена **до** падіння `login_spec`.

**Хто це створює?** Pipeline offline (loader → chunks → embed/index). Не harness одного investigation run.

**Що далі?** Коли з CI приходить signal — починається **нумерований** runtime (кроки 1–6 нижче).

**Що перевірити?** Після зміни wiki — reindex; версія індексу в deploy збігається з очікуваною.

Терміни: **index-v12**, **offline**.

---

## D.2 §2 «Один запит» — 6 runtime-кроків (`rag-one-query-step-details.ts`)

Див. актуальні `panelMarkdownUk` у `rag-one-query-step-details.ts` (6 runtime-кроків). Коротко:

1. **CI + query + фільтри** (`tenant`, `env`, `service`, `incident_date_gte=90d`) — не offline індекс.
2. **Retriever** — candidates → **authorized hits**; ACL на пошуку; демо-retriever і date filter.
3. **Відбір + rerank** — harness (код) викликає rerank-модель → **selected evidence**.
4. **Context builder** — messages[] лише з selected.
5. **LLM** — гіпотеза + citation; INC-442 vs поточний oracle.
6. **Код + QA** — перевірки **A** (citation ⊆ selected), **B** (зміст vs chunk), **C** (DOM/trace/логи); Jira окремо.

**Панель Hits:** `StudyRagHitsLayers` + `rag-hits-layers.ts`.

---

## D.3 §4 «Узагальнений ланцюг даних» (`rag-data-chain-stage-details.ts`)

Повний вміст файлу (усі `panelMarkdownUk` / backtick-панелі) — **ідентичний** коду в репозиторії; ключові панелі:

### Hits — що повернув пошук

**Що це?** Три шари: **candidates** → **authorized hits** (після metadata + ACL) → **selected evidence** (після rerank). `score` — ранжування, не P(правда).

**Що далі?** Rerank-модель (ймовірнісно); context builder відбирає `chunk_id` для messages.

**QA-приклад.** chk-442-a / INC-442 vs chk-318-b / INC-318. Golden — **набір chunk_id**, не score.

### Відповідь (ланцюг 3)

**Що це?** Крок 6 run — (а) citation ∈ context, (б) зміст vs фрагмент, (в) QA vs DOM/trace/логи.

*(Решта стадій: Документ, Chunks + metadata, Vectors у index, Запит, Retriever, Context builder, Evidence + user message, API моделі — див. той самий файл у репо, рядки 4–268.)*

---

## D.4 §3 Offline ribbon (`rag-chain-stage-details.ts` → `OFFLINE_PIPELINE`)

Панелі: **Documents**, **Parse**, **Chunks**, **[embed / index]**, **Searchable store** — повні тексти в `OFFLINE_PIPELINE` (рядки 54–189 файлу).

---

## D.5 §3 Дев’ять компонентів pipeline (`rag-pipeline-component-details.ts`)

Панелі 1–9: Document loader … Generative LLM. Панель **Rerank (опційно)** оновлена: scoring ймовірнісний; golden по `chunk_id`.

---

## D.6 §6 QA (`rag-qa-check-details.ts`)

Кожна перевірка рендериться через `qaCheckDetailToMarkdown`: **Що це?**, **Навіщо тестувати?**, **Як тестувати?**, **QA-приклад.**, **Формулювання в урокі.** (з markdown абзаца).

**Groundedness і citations** — три рівні (а)(б)(в) як у §2 крок 6.

---

## D.7 §7 Production (`rag-production-details.ts`)

Кожна картка: **Що це?**, **Навіщо в production?**, **Що перевірити?** (+ терміни).

---

_Для machine-readable sync запустіть `node scripts/build-rag-review-bundle-appendix.mjs` після доопрацювання скрипта (regex); ручна звірка — diff TS vs цей додаток._
