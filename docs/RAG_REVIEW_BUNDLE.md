# RAG Study Mode — review bundle (знімок стану)

Документ для зовнішнього reviewer **без** локального dev-сервера. Описує сторінку **Study Mode** теми RAG станом на збірку з `content/concepts/03-rag.md` і поточного коду в `src/`. Урок **не** переписувався під цей файл.

---

## 1. URL і `topicId`

| Поле | Значення |
|------|----------|
| **topicId** | `concept-03` |
| **Контент** | `content/concepts/03-rag.md` |
| **Router** | `HashRouter` (`src/App.tsx`) — hash **обов’язковий** у URL |
| **Маршрут (route path)** | `/topic/concept-03/study` |
| **Base path (Vite build)** | `/ai-qa-agentic-roadmap/` |
| **Публічний сайт** | https://baleksandr.github.io/ai-qa-agentic-roadmap/ |
| **Повний URL Study Mode** | https://baleksandr.github.io/ai-qa-agentic-roadmap/#/topic/concept-03/study |
| **Локально (`npm run dev`)** | http://localhost:5173/ai-qa-agentic-roadmap/#/topic/concept-03/study |
| **Review Mode** | `.../#/topic/concept-03` |
| **Атлас RAG** | `.../#/agent-architecture?tab=rag` |
| **Повні тексти панелей (клік)** | [`docs/RAG_REVIEW_PANELS_APPENDIX.md`](RAG_REVIEW_PANELS_APPENDIX.md) |

**Заголовок сторінки (H1):** «RAG — пошук знань перед відповіддю» (не generic map label).  
**Підзаголовок:** «Study Mode».  
**Бейдж перенесення:** `partial` (з реєстру тем / frontmatter).

---

## 2. Текст у порядку відображення (як бачить користувач)

Нижче — логічний порядок зверху вниз. Акордеон-розділи **2–8** за замовчуванням **згорнуті** (відкритий лише **розділ 1** через `initialOpenId` першої секції). Вміст згорнутих розділів **включено повністю** (так само, як після «Розгорнути» / клік по заголовку).

### 2.1. Хром сторінки

- Посилання: «← До карти курсу», «← Review Mode».
- **SiteNav** (глобальна навігація курсу).
- Бейджі: перенесення + прогрес навчання (`not_studied` / …).

### 2.2. Ліва колонка — зміст

- Заголовок: **RAG** (`getMapLabel('concept-03')`).
- Blurb: «Від проблеми внутрішніх документів — через один запит QA-агента — до індексації, ролей коду/LLM і перевірок.» (`study-lesson-intros.ts`).
- Список **8 розділів** (нумерація читача 1–8):
  1. Навіщо потрібен RAG?
  2. Як RAG працює в одному запиті?
  3. Як підготувати документи для пошуку?
  4. Де код, а де LLM?
  5. Де RAG може помилитися?
  6. Як QA це тестує?
  7. Що потрібно для production?
  8. Запам’ятати та співбесіда

### 2.3. Блок «Що я зрозумію після цього уроку»

Текст **не** з `QUICK VIEW` у markdown (його немає в `03-rag.md`), а з `buildStudyLearningOutcomes('concept-03', …)`:

> Перед відповіддю застосунок **знаходить** доречні фрагменти ваших документів і **додає** їх у запит до моделі. Модель не має прямого доступу до внутрішньої wiki чи архіву інцидентів — пошук виконує код.
>
> *(Далі — інтерактивний ribbon «запит → пошук фрагментів → контекст моделі → відповідь» через `StudyMarkdownWithFlows`.)*
>
> Окремо існує **підготовка знань** (індексація документів) і **один запит під час investigation** — не змішуйте їх на одній схемі в голові.
>
> *(Ribbon: «підготовка знань → індексація → searchable store».)*

### 2.4. Toolbar

- «Розгорнути всі»
- «Згорнути всі»

### 2.5. Розділ 1 — «1. Навіщо потрібен RAG?»

*(Markdown секції, `MarkdownBody` + таблиця GFM.)*

Велика мовна модель добре продовжує текст і пояснює загальні речі, але вона **не підключена** до вашого Confluence, внутрішнього git, postmortem чи закритих інцидентів. Усе, що сталося в компанії після дати навчання моделі, або ніколи не було публічним, для неї **невидиме**, поки ви явно не передасте текст у поточний запит.

Уявіть типову ситуацію в QA. На staging впав автотест `login_spec`: таймаут на кнопці входу, у логах CI — `Timeout 30000ms exceeded`. Ви питаєте модель без додаткових даних: *«Чому в нас знову падає login на staging і що ми вже робили в минулому?»* Відповідь може звучати переконливо, але бути **вигаданою**: «перевірте мережу», хоча в минулому інциденті вже фіксували зламаний селектор після редизайну. Модель не «бреше навмисно» — у неї немає вашого розслідування в контексті цього запиту.

Якщо натомість покласти в prompt увесь wiki і всі логи, ви впретесь у **ліміт контексту**, заплатите зайве за токени і заплутаєте модель шумом. Потрібен компроміс: **не вся база**, а **доречні уривки** під конкретне питання.

**RAG** (Retrieval-Augmented Generation) означає: **retrieval** — знайти фрагменти в підготовленому сховищі; **augment** — додати їх у prompt разом із запитом; **generation** — відповідь моделі з опорою на цей контекст. На практиці це дві фази:

| Фаза | Коли | Навіщо |
|------|------|--------|
| **Підготовка знань** (offline) | При оновленні документів | Зробити з великих файлів те, по чому **швидко шукати** |
| **Запит** (runtime) | Кожен run investigation | Підібрати **малий** релевантний шар і передати в LLM |

**Модель не ходить у базу сама.** Пошук, ACL і збір `messages[]` — код застосунку. Vector database — **поширений**, але **не обов’язковий** спосіб retrieval; той самий принцип працює з BM25, hybrid search або індексом по метаданих.

### 2.6. Розділ 2 — «2. Як RAG працює в одному запиті?»

**Важливо для reviewer:** тіло markdown цього розділу **не** показується як суцільний текст. Після парсингу сценарію рендериться лише **`StudyRagOneQueryFlow`**. Блоки з markdown **не в UI**:

- `#### Послідовність кроків одного запиту`
- `**Крок 1.**` … `**Крок 6.**` (рядки 51–63 у `03-rag.md`)

**Що користувач бачить:** компонент **`StudyRagOneQueryFlow`** (`rag-one-query-story.ts`). Markdown сценарію (fences, кроки, ризики) парситься для даних; **не** дублюється окремими блоками «Рух даних» / «Навчальний прохід».

- Callout **«Одна історія run»** — вступ людською мовою (узгоджено з `RAG_ONE_QUERY_STORY_INTRO`).
- Один рядок offline: `index-v12` + посилання на §3.
- **Зліва:** 6 кнопок-кроків (номер + назва + teaser).
- **Справа:** панель «Що сталося / Хто зробив / Що далі» + контент кроку + `<details>` «Технічні деталі цього кроку».
- Внизу: **«Два ризики для QA»** (таблиця з markdown `rest`).

| # | Заголовок (UI) | Особливий контент у панелі |
|---|----------------|----------------------------|
| 1 | Тест упав | — |
| 2 | Знайшли схожі документи | Query + chips фільтрів (`tenant`, `env`, `service`) |
| 3 | Відібрали те, що можна показати | **`StudyRagThreeStates`**: знайдено → дозволено → передано LLM; INC-318 не в LLM; картка «інший tenant — був би заборонений» без тексту |
| 4 | Передали вибране моделі | Prompt: badge **Retrieved context · зовнішній документ** + примітка, що текст документа ≠ system policy / injection |
| 5 | Модель висунула гіпотезу | Цитата-гіпотеза |
| 6 | Перевірили гіпотезу | 3 шари перевірки + **3 висновки QA** (підтверджена / спростована / доказів недостатньо) |

**§1 markdown:** визначення RAG і пояснення — **двоколонкові таблиці** (`studyTables`), перша колонка — термін (приглушений фон), друга — текст (основний колір).

**Фільтри в fence (парсер):** `tenant=acme, env=staging, service=auth` — без `incident_date_gte`; 90 днів лише в примітці prose.

### 2.7. Розділ 3 — «3. Як підготувати документи для пошуку?»

**Пролог (markdown до ASCII-схеми):**

Поки користувач не поставив питання, система робить важку роботу окремо від run.

**Звідки беруться документи.** Експорт Confluence, PDF postmortem, архів інцидентів, runbook — джерела, які ви **дозволили** індексувати. Loader читає файли або API, витягує текст і метадані (дата, сервіс, середовище).

**Parse і chunk.** Великий документ ріжуть на **chunks** зручного розміру (інколи з перекриттям або за заголовками). Поганий chunking — головна причина «retrieval ніби є, а відповідь порожня».

**Індексація.** Для кожного chunk можна порахувати embedding у vector index, зберегти BM25-індекс або **hybrid**. У vector store лежать vector + посилання на текст + metadata — це **пам’ять** RAG-додатку, не пам’ять LLM.

**Версії.** Rebuild індексу має версію (`index-v12`). Застарілий індекс дає «правильні» відповіді з неправильного минулого.

Рядок «Типові компоненти pipeline …» у markdown **прибирається** з основного потоку (`stripRagPipelineInlineList`); натомість:

**`StudyRagOfflinePipeline`** — ribbon з підписом з fence:

```text
Offline (навчальний потік):
Documents → Parse → Chunks → [embed / index] → Searchable store
                                      ↑
                              версія, ACL, tenant
```

Клікабельні кроки: Documents, Parse, Chunks, embed/index, Searchable store — inline-панель (`rag-chain-stage-details.ts` → `OFFLINE_PIPELINE`).

**`StudyRagPipelineComponents`** — 9 карток (document loader … generation LLM) з `rag-pipeline-components.ts` + панелі `rag-pipeline-component-details.ts`.

*(Після схеми в markdown немає додаткового «after»-тексту в поточному файлі.)*

### 2.8. Розділ 4 — «4. Де код, а де LLM?»

**Таблиця + абзац** (markdown `before`):

| Дія | Хто виконує |
|-----|-------------|
| Читання файлів, cron індексації, chunking | Код (pipeline) |
| Пошук, фільтри tenant/env, перевірка ACL | Код (retriever) |
| Rerank (якщо є), token budget, збір `messages[]` | Код (harness / context builder) |
| Інтерпретація мови, синтез відповіді | **LLM** |

LLM **не** отримує credentials до wiki, **не** гарантує валідність citation — це політики й валідація після генерації. Межа «детермінований код / ймовірнісна модель» — базова mental model курсу: знайшов **retriever**, не «модель зчитала базу».

**`StudyRagDataChainAndPrompt`:**

Заголовок: «Узагальнений ланцюг даних». Три підланцюги з markdown fences:

1. **Offline · індексація** — `Документ → chunks[{ id, text, metadata }] → (опційно) vectors у index`  
   UI-стадії: Документ → Chunks + metadata → Vectors у index.
2. **Runtime · retrieval** — `Запит → retriever → hits[{ chunk_id, text, score, source_id }]`  
   UI: Запит → Retriever → Hits.
3. **Runtime · генерація** — `Context builder → evidence + user message → API моделі → відповідь`  
   UI: Context builder → Evidence + user message → API моделі → Відповідь.

Кожен крок ribbon — клік → **inline** панель (`rag-data-chain-stage-details.ts`). У т.ч. панель **Hits** з навчальним текстом про top-k, `chunk_id`, `source_id`, `score` (див. §4 нижче).

**Приклад зібраного prompt** (не JSON — структурований text UI):

- **System:** «Використовуй лише retrieved context для фактів про минулі інциденти.»
- **Retrieved context:**
  ```text
  --- INC-442 ---
  ... #login-btn → data-test=login-submit ...
  ```
- **User:** «login_spec failed staging, timeout #login-btn, trace ci-8842»

### 2.9. Розділ 5 — «5. Де RAG може помилитися?»

**`StudyRagFailureCards`** — 7 карток з `####` заголовків markdown (тіло кожної картки = текст під заголовком). Категорії з `rag-failure-modes.ts`:

1. Не знайшли потрібний документ (Retrieval)
2. Застарілий індекс (Індекс)
3. Порушення доступу (Security)
4. Неправильне використання фрагмента (Grounding)
5. Ін’єкція в документ (Injection)
6. Технічний збій (Операції)
7. Безпека на рівні політики (Політика) — маркований список з 4 пунктів у markdown

Тексти карток — **дослівно з** `03-rag.md` §«Де RAG може помилитися?» (рядки 121–150).

### 2.10. Розділ 6 — «6. Як QA це тестує?»

**`StudyRagQaChecks`** — 7 пунктів з markdown `**Заголовок.**` + layout список + бічна панель. Заголовки з уроку:

1. **Індексація.** — …
2. **Retrieval без LLM.** — …
3. **Ізоляція tenant.** — …
4. **Groundedness і citations.** — …
5. **Права.** — …
6. **Adversarial document.** — …
7. **Trace run.** — …

Тіло кожного пункту в UI — абзац з markdown; розширена панель — `rag-qa-check-details.ts` (без показу `bookRefUk` у markdown панелі, якщо не зшито в `meansUk`).

### 2.11. Розділ 7 — «7. Що потрібно для production?»

**`StudyRagProductionCards`** — картки з абзаців markdown (перший рядок кожного блоку стає заголовком картки):

1. Метрики та логування (два речення з §7)
2. **Свіжість індексу**
3. **Поведінка при збої пошуку**
4. **Ліміти**
5. **Моніторинг**

Footer абзац markdown після карток: «Звичайна інженерія навколо RAG (retry, versioning, incident response) — частина застосунку, не «вбудована магія LLM».»

Панелі: `rag-production-details.ts`.

### 2.12. Розділ 8 — «8. Запам’ятати та співбесіда»

Маркований список + два абзаци UK/EN — **як у markdown** (без інтерактиву).

### 2.13. «Джерела та примітки» (згорнутий `<details>`)

- *AI Engineering*, 2025 Edition (Pachaar & Chawla) — RAG: «What is RAG?», друк. с. 106; «Workflow of a RAG system», друк. с. 113–115.
- *AI for QA / Agentic Engineering — Deep Study Guide v10*, Concept 3 — компоненти, failure modes, testing, observability (архів курсу).
- Навчальний сценарій: QA Regression Investigation Agent, умовні `INC-*`, `login_spec` — для закріплення механізму.

### 2.14. Права колонка — `StudyRagLessonAside`

- Прогрес навчання + `ProgressPicker` (для `concept-03` **немає** дубля `ProgressPicker` у футері сторінки).
- **Контекст · розділ N** — `focus`, **Приклад:**, опційно `diagram`, опційно `<details>Підказки до розділу</details>` з `rag-section-aside.ts`.
- Посилання: «Відкрити інтерактивну схему RAG» → атлас.
- Примітка: «8 розділів, нумерація 1–8…»

---

## 3. Розділи після парсингу (`parseStudyDocument`)

Джерело: `src/lib/studySections.ts` + `content/concepts/03-rag.md` (блок `## Study Mode`, без `:::study-sources`).

| readerNumber | `navTitle` / заголовок акордеона | `id` (slug від заголовка markdown) | Група (`sectionGroup`) |
|--------------|-----------------------------------|-------------------------------------|-------------------------|
| 1 | Навіщо потрібен RAG? | `навіщо-потрібен-rag` | Вступ |
| 2 | Як RAG працює в одному запиті? | `як-rag-працює-в-одному-запиті` | Як це працює |
| 3 | Як підготувати документи для пошуку? | `як-підготувати-документи-для-пошуку` | Як це працює |
| 4 | Де код, а де LLM? | `де-код-а-де-llm` | Як це працює |
| 5 | Де RAG може помилитися? | `де-rag-може-помилитися` | Приклади |
| 6 | Як QA це тестує? | `як-qa-це-тестує` | Приклади |
| 7 | Що потрібно для production? | `що-потрібно-для-production` | Production |
| 8 | Запам’ятати та співбесіда | `запам-ятати-та-співбесіда` | Запам’ятати |

**Вкладені блоки після `LessonBodyEnhancements` / `StudyMarkdownSegment`:**

```
TopicStudyPage
└── StudyModeSections (concept-03: study-mode-with-aside)
    ├── nav (8 кнопок)
    ├── intro: StudyMarkdownWithFlows (2 ribbons)
    ├── sections[1]: MarkdownBody (таблиця)
    ├── sections[2]: StudyRagOneQueryFlow
    │   ├── 6 × StudyFlowStageCard
    │   └── aside panel: MarkdownBody + StudyPanelTerms
    ├── sections[3]: MarkdownBody (пролог)
    │   ├── StudyRagOfflinePipeline → StudyFlowRibbon (5 stages, inline)
    │   └── StudyRagPipelineComponents → 9 cards + panel
    ├── sections[4]: MarkdownBody (table + lead)
    │   └── StudyRagDataChainAndPrompt
    │       ├── 3 × StudyFlowRibbon (inline details)
    │       └── prompt stack (System / Retrieved / User)
    ├── sections[5]: StudyRagFailureCards (7 cards)
    ├── sections[6]: StudyRagQaChecks (7 items + panel)
    ├── sections[7]: StudyRagProductionCards (5 cards + footer md)
    ├── sections[8]: MarkdownBody
    ├── StudySourcesCollapsible
    └── StudyRagLessonAside
```

**Не рендериться з markdown §2:** підрозділ `#### Послідовність кроків…` і `**Крок 1–6.**` (залишаються у файлі для `verify:rag` і як джерело змісту кроків у TS).

---

## 4. Інтерактивні елементи (дані)

### 4.1. §2 — один запит (6 кроків)

- **Дані кроків:** `src/data/study/rag-query-flow-steps.ts` (`RAG_QUERY_FLOW_STEPS`)
- **Панелі:** `src/data/study/rag-one-query-step-details.ts`
- **Парсинг сценарію з markdown:** `src/lib/ragInvestigationScenario.ts` (`extractRagInvestigationScenario`)
- **Компонент:** `src/components/lesson/StudyRagOneQueryFlow.tsx`
- **CTA на картці:** «Деталі →»
- **Початковий активний крок:** 1

### 4.2. §3 — offline ribbon

- **Парсинг fence:** `src/lib/ragOfflinePipeline.ts`
- **Деталі стадій:** `src/data/study/rag-chain-stage-details.ts` (`lookupOfflinePipelineStageDetail`)
- **9 компонентів:** `src/data/study/rag-pipeline-components.ts` + `rag-pipeline-component-details.ts`

### 4.3. §4 — ланцюг даних + prompt

- **Парсинг:** `src/lib/ragDataChainPrompt.ts`
- **Стадії UI:** `DATA_CHAIN_CANONICAL_LABELS` / `dataChainDisplayStages`
- **Панелі:** `src/data/study/rag-data-chain-stage-details.ts`
- **Панель Hits (навчальний зміст, не з книги):** узгоджений блок про top-k, приклад `INC-442` / `INC-318`, терміни `chunk_id`, `source_id`, `score` — у `rag-data-chain-stage-details.ts` (стадія Hits, chain index 1).

### 4.4. §5 — failure cards

- **Компонент:** `StudyRagFailureCards.tsx`
- **Метадані категорій:** `rag-failure-modes.ts`
- Текст карток — з markdown, без окремих TS-панелей (клік може розгортати/підсвічувати — перевірити в браузері).

### 4.5. §6 — QA checks

- **Парсинг списку:** `src/lib/ragQaSection.ts`
- **Панелі:** `rag-qa-check-details.ts` (поля `bookRefUk` у TS **не** показуються окремим блоком «Орієнтир у книзі» в UI)

### 4.6. §7 — production

- **Парсинг:** `src/lib/ragProductionSection.ts`
- **Панелі:** `rag-production-details.ts`

### 4.7. JSON

У **Study Mode RAG** немає окремих JSON-прикладів trace/policy (на відміну від guardrails). Структури в UI — **text** (` ```text ` fences, prompt stack).

### 4.8. Блок Hits (канонічний навчальний текст у панелі ланцюга §4)

Reviewer має звірити в UI панель стадії **Hits** (другий ribbon, крок 3). Зміст зібрано в `rag-data-chain-stage-details.ts` (не дублювати повний текст тут — файл у репо). Семантика збігається з chunks у §2:

- кілька кандидатів, не фіксоване k;
- `INC-442` score 0.81 — селектор `#login-btn`;
- `INC-318` score 0.74 — інший root cause (CDN).

---

## 5. Звідки береться кожен блок

| Що бачить користувач | Контент (markdown / data) | React / lib |
|----------------------|---------------------------|-------------|
| Маршрут, H1, legacy study | `topics.registry.ts`, `03-rag.md` | `TopicStudyPage.tsx` |
| Парсинг 8 секцій, джерела | `03-rag.md` `## Study Mode` | `studySections.ts`, `content.ts` |
| Intro + ribbons | `study-lesson-intros.ts` | `StudyModeSections`, `StudyMarkdownWithFlows` |
| Акордеон, nav, toolbar | — | `StudyModeSections.tsx` |
| §1 текст | `03-rag.md` | `MarkdownBody` |
| §2 flow | `03-rag.md` (fences) + `rag-query-flow-steps.ts` + `rag-one-query-step-details.ts` | `extractRagInvestigationScenario`, `StudyRagOneQueryFlow` |
| §3 пролог | `03-rag.md` | `MarkdownBody` |
| §3 offline схема | fence в `03-rag.md` | `extractRagOfflinePipeline`, `StudyRagOfflinePipeline`, `rag-chain-stage-details.ts` |
| §3 pipeline 9 cards | рядок «Типові компоненти…» + TS | `StudyRagPipelineComponents`, `rag-pipeline-components.ts` |
| §4 table + lead | `03-rag.md` | `MarkdownBody` |
| §4 chain + prompt | fences в `03-rag.md` | `extractRagDataChainAndPrompt`, `StudyRagDataChainAndPrompt`, `rag-data-chain-stage-details.ts` |
| §5 failures | `####` в `03-rag.md` | `StudyRagFailureCards`, `rag-failure-modes.ts` |
| §6 QA | `**Title.**` абзаци | `extractRagQaChecks`, `StudyRagQaChecks`, `rag-qa-check-details.ts` |
| §7 production | абзаци §7 | `extractRagProductionSection`, `StudyRagProductionCards`, `rag-production-details.ts` |
| §8 | `03-rag.md` | `MarkdownBody` |
| Джерела | `:::study-sources` | `StudySourcesCollapsible` |
| Права колонка | `rag-section-aside.ts` | `StudyRagLessonAside.tsx` |
| Атлас RAG | `schema-rag.ts`, panels | `ArchitectureAtlas` (окрема сторінка) |
| Verify | `03-rag.md` | `scripts/verify-rag-study.mjs` |

---

## 6. V10, книга, умовний QA-приклад

| Шар | Що це |
|-----|--------|
| **Книга *AI Engineering*** | Визначення RAG, workflow offline/runtime, chunking/retrieval на рівні концепцій. У UI — лише блок «Джерела та примітки» (друк. **с. 106**, **113–115**). Текст `AI.pdf` **не** вбудований у збірку. Звірка: `docs/AI_ENGINEERING_SOURCE_INVENTORY.md` (рядок **concept-03**). |
| **V10 Deep Study Guide** | Каркас Concept 3: компоненти pipeline, failure modes, testing, observability — відображено в структурі 8 розділів і списках QA/production; **не** цитується DOCX/PDF у UI. `migration.generated.ts`: `partial`, DOCX не звірений. |
| **Навчальний QA-приклад (не книга, не V10-дослівно)** | QA Regression Investigation Agent; `login_spec`; `index-v12`; `INC-442` / `INC-318`; retrieval query про `#login-btn`; `env=staging`, `service=auth`; trace `ci-8842`; harness TypeScript — **умовні** імена для механізму. |
| **Enrichment TS** | Панелі «до гвинтиків» у `src/data/study/rag-*.ts` — пояснення курсу + посилання на формулювання уроку; не видавати за цитати книги. |
| **CAG** | У цьому урокі **не** розкривається; термінологія — `docs/CAG_TERMINOLOGY.md`. |

---

## 7. Відомі проблеми та межі перевірки

### Відображення / узгодженість

1. **§2:** передумова offline — окремий блок; **6 runtime-кроків** у `StudyRagOneQueryFlow`. Текст `#### Послідовність` у markdown **не** дублюється в UI.
2. **§2:** дані сценарію (CI, query+фільтри, hits з `chunk_id`) — у панелях кроків 1–3, 5; без кліків видно лише lead + teasers.
3. **`RAG_REVIEW_PANELS_APPENDIX.md`** — повні тексти панелей; для offline/9 pipeline стадій частина зведена з посиланням на рядки TS (розширюйте diff з репо).
4. **`rag-section-aside.ts` §4:** підказки оновлені на inline-панель (не flyout).
5. **`bookRefUk`** у `rag-qa-check-details.ts` (і подібних) може існувати в TS, але **не** показується окремим блоком «Орієнтир у книзі» в панелях (політика study mode).
6. **Slug `id` секцій** залежить від кирилиці в заголовку; на Windows/різних браузерах anchor `#study-section-…` не перевірявся вручну.
7. **Мобільна сітка:** у `study-rag-qa-layout` панель деталей може йти **вище** списку кроків (`order: -1` у CSS) — інший порядок, ніж на desktop.

### Перевірка в браузері (стан після правок)

| Що | Результат |
|----|-----------|
| `npm run verify:rag` | PASS (8 секцій, 6 кроків §2) |
| `npm run build` | PASS |
| Відкриття Study Mode у браузері, F5 на hash-URL | **Не виконувалось** агентом у цій сесії — reviewer має перевірити вручну `.../#/topic/concept-03/study` |
| Кліки по всіх картках / sticky / a11y | **Не перевірялось** |
| GitHub Pages після deploy | **Не перевірялось** (лише формат URL з `HashRouter`) |

---

## 8. Сценарій: від signal CI до перевіреної гіпотези (навчальний)

**Передумова (не крок run):** `index-v12` уже містить postmortem/incident notes.

1. **CI → harness:** `login_spec failed`, лог з timeout `#login-btn`, `trace ci-8842`.
2. **Query + фільтри (код):** текст `login timeout staging #login-btn similar incidents`; фільтри `tenant=acme`, `env=staging`, `service=auth`, `incident_date_gte=90d` (вікно — **фільтр**, не обіцянка з natural-language query).
3. **Retrieve:** після ACL — hits, напр. `chunk_id=chk-442-a`, `source_id=INC-442`, `score=0.81` (score для ранжування, не «правда»); аналогічно `chk-318-b` / INC-318.
4. **Context:** у Retrieved context лише дозволені `chunk_id` (напр. chk-442-a, chk-318-b) під budget.
5. **LLM:** гіпотеза «схоже на INC-442, селектор #login-btn → data-test=login-submit» з citation INC-442.
6. **Перевірки:** **(а)** INC-442 був у переданому context — pass/fail кодом; **(б)** текст chunk справді про селектор — pass/fail groundedness; **(в)** QA відкриває staging DOM/trace — підтверджує або спростовує гіпотезу. Успіх run для investigation = **(а)+(б)+(в)**, не лише (а).

---

## Додаток A. Review Mode (не Study)

Блок `## Review Mode` у `03-rag.md` показується на `#/topic/concept-03`, не на `#/topic/concept-03/study`.

---

## Додаток B. Команди для reviewer з клоном репо

```bash
npm run verify:rag
npm run build
npm run dev
# відкрити .../ai-qa-agentic-roadmap/#/topic/concept-03/study  (F5 має лишатися на Study Mode при HashRouter)
```

Без `source/AI.pdf` і V10 PDF урок залишається самодостатнім; книга потрібна лише для незалежної звірки фактів.

---

*Згенеровано як знімок поточного стану коду та `content/concepts/03-rag.md` для зовнішнього review. Оновлюйте файл після суттєвих змін Study Mode RAG.*
