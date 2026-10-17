---
name: study-mode-lesson
description: >-
  Покращення Study Mode для уроків курсу (markdown → UI): структура розділів,
  картки, ribbon-схеми, таблиці, inline/flyout панелі деталей, без вигаданих
  фактів. Use when editing content/concepts Study Mode, StudyModeSections,
  src/components/lesson, src/data/study, RAG lesson (concept-03), verify:rag,
  or user asks to improve/fix lesson cards and side panels. Project rule:
  .cursor/rules/study-mode-lesson.mdc (alwaysApply).
---

# Study Mode — правила оформлення уроку

## Еталон concept-03 (RAG)

Нові уроки й картки вирівнюються під [docs/STUDY_LESSON_RAG_TEMPLATE.md](../../docs/STUDY_LESSON_RAG_TEMPLATE.md). Статус тем: `src/data/study/lesson-enrichment.registry.ts`. Співбесіда: `StudyInterviewSelfCheck` + deck у `study-interview-registry.ts` (не дублювати компонент на тему).

## Обов’язково на сторінці Study (не пропускати)

Для кожного урока рівня **reference / partial** (див. `lesson-enrichment.registry.ts`):

1. **Хедер як у RAG** — `getStudyLessonHero(topicId)` + `StudyLessonAcronymHero` у `TopicStudyPage` (коротка назва, повна EN-фраза, tagline UK, сітка 3 літер/опор). Дані — `src/data/study/study-lesson-heroes.ts`. Не лишати лише `getMapLabel` без hero для збагачених тем.
2. **«Що я зрозумію після цього уроку»** — `buildStudyLearningOutcomes()` у `study-lesson-intros.ts`: 1–2 абзаци людською + **1–2 рядки `→`** (runtime vs offline/огляд механізму), рендер `StudyMarkdownWithFlows` у `StudyModeSections`. Текст узгоджувати з Review Mode і §2/§3 markdown, не вигадувати факти.
3. **Blurb у лівому змісті** — `getLessonNavBlurb(topicId)` (одне речення «навіщо цей урок»).

Якщо теми ще немає в реєстрах — додати записи в `study-lesson-heroes.ts` і `buildStudyLearningOutcomes` **разом** з першим збагаченням UI.

## Коли застосовувати

- Редагування `content/concepts/*.md` (блок **Study Mode**).
- Компоненти в `src/components/lesson/`, `StudyModeSections.tsx`, `src/data/study/`.
- Користувач просить «красиво», «картки», «бокова панель», «не злипати в один абзац».

## Джерела (не вигадувати)

1. **Текст уроку** — `content/concepts/NN-*.md` (єдине джерело навчального змісту в UI).
2. **Інвентар книги** — `docs/AI_ENGINEERING_SOURCE_INVENTORY.md` (друковані стор. `source/AI.pdf`).
3. **Навчальні приклади** — QA Regression Investigation Agent, `INC-*`, `login_spec` — позначати як *навчальний приклад*, не цитата книги.
4. Повний текст книги **не** копіювати в UI/JS. У панелях — короткі посилання «Книга: …, друк. с. …».
5. Блок **«Джерела та примітки»** — лише в `:::study-sources` внизу уроку, згорнутий.

## Структура сторінки Study (legacy markdown)

- **8+ розділів** через `###` у Study Mode; парсер `parseStudyDocument` → акордеон + **лівий зміст** (1…N).
- **concept-03 / concept-10**: три колонки — зміст | контент | **контекст** (`StudyLessonAside`: вужча колонка ~280–360px, **окремий скрол**). Права панель — лише підказки до розділу (focus, приклад, tips / рідкий JSON), **не** дублювати таблиці й кроки з центрального блоку; зміст лише зліва.
- За замовчуванням відкритий **перший** розділ; toolbar «Розгорнути / Згорнути всі».
- Заголовок H1 для збагачених тем — **hero**, не дублювати `# Concept` з markdown; `pageTitleUk` у hero для screen readers.

## Рендеринг markdown

- Таблиці GFM: `MarkdownBody` + `studyTables` → обгортка `study-markdown-table`.
- Ланцюги `→`: **лише справжні схеми** (`isPipelineArrowLine` у `studyArrowFlow.ts`):
  - 3+ стрілки або короткі кроки без `**` на початку абзаца.
  - **Не** перетворювати прозу QA (`запит → chunk_id`, `citation → chunk`) на ribbon.
- Абзац лише з `→` у вступі/тілі → `StudyFlowRibbon` (variant `ribbon`).
- Технічні ланцюги (`Documents → Parse → …`) → `layout="cards"`.
- Розділ **«з чого складається»** (tool calling, RAG pipeline тощо): спочатку **оглядовий ribbon** (`StudyFlowRibbon`, `layout="ribbon"`) з повним ланцюгом з markdown (`Harness → LLM → …`), потім **детальні кроки** (`StudyStepDetailLayout`). Stages ribbon — у `*-ribbon-stages.ts` або парсинг через `StudyMarkdownWithFlows` (рядок у ```text``` з `→` підтримується в `studyArrowFlow.ts`). Не лишати ланцюг лише в невидимому code fence.
- Порожній markdown **не** рендерити (`Контент ще не додано`).

## «Де код, а де LLM?» (еталон concept-10)

- Один сценарій (наприклад `readPlaywrightReport` після `login_spec`), **6 кроків** з вхід / дія / вихід; UI `StudyToolCallingLlmCodeBoundary`.
- Дані: `tool-calling-llm-code-flow.ts` — кроки, таблиця відповідальності LLM/код/людина, приклади небезпечного path і duplicate Jira.
- Пояснити: tool call = пропозиція, не I/O; формат tool call залежить від API; allow-list, ACL, sandbox path, max steps (harness), approval (людина) vs idempotency (код).
- Markdown розділу — короткий вступ; не залишати «Never trust args» без українського прикладу.
- Інші теми при аудиті: замінити таблицю «дія | хто» на послідовність передачі даних.

## «Як QA це тестує?» (еталон concept-10)

- Дані: `tool-calling-qa-testing.ts` — 3 рівні, 6 категорій (setup/action/expect/mustNot/evidence), 2 GWT (навчальні, якщо в repo немає harness tests).
- UI: `StudyToolCallingQaTesting` + split nav; markdown — короткий вступ, деталі в UI.
- Sandbox: переносні приклади (`../`, symlink), не `/etc` як єдиний кейс.
- При аудиті інших уроків: замінити таблиці «назва | навіщо» на той самий каркас або посилатися на майбутній `*-qa-testing.ts`.

## Failure modes (tool calling §5, еталон для інших тем)

- UI: `StudyToolCallingFailureModes` + `StudyStepDetailLayout` / `StudyPipelineStepNav` (компакт зліва).
- Дані: `tool-calling-failure-details.ts` — для **кожного** збою: сценарій, точка зупинки, сигнал у trace, що робить harness, перевірка QA; заголовки секцій адаптують під збій.
- Markdown уроку — лише перелік `####` і однорядкові підписи; **не** дублювати повний prose в markdown і панелі.
- Позначати навчальні приклади; не подавати як live run.

## Спеціальні блоки RAG (concept-03)

| Розділ | Компонент / логіка |
|--------|-------------------|
| Один запит | `extractRagInvestigationScenario` + `StudyRagOneQueryFlow` (передумова offline + 6 runtime-кроків) |
| Підготовка | `extractRagOfflinePipeline` + `StudyRagPipelineComponents` (9 карток) |
| Код vs LLM | `extractRagDataChainAndPrompt` + клікабельні кроки + flyout |
| Failure modes | `StudyRagFailureCards` (7 карток, парсер `####`) |
| QA тестує | `extractRagQaChecks` + `StudyRagQaChecks` (список + **inline панель**) |
| Production | `extractRagProductionSection` + `StudyRagProductionCards` + панель деталей |

Деталі панелей: `src/data/study/rag-pipeline-panel-content.ts` + `src/lib/studyClarityPanel.ts` (стандарт **clarity**), або legacy `rag-*-details.ts`. Текст панелі — `panelMarkdownUk`; жаргон — `terms[]` + `StudyPanelTerms` внизу. Не посилатися на «§N» у UI — визначення в самій панелі.

## Бокова панель: міні-секції та терміни (стиль за замовчуванням)

**Зміст панелі (markdown):**

- Генерувати через `clarityProcessPanel()` (крок виконує код/людина) або `clarityDataPanel()` (вузол **дані**: chunks, index).
- Мітки секцій: **Проблема**, **Проста ідея**, **Вхід (навчальний приклад)**, **Хто виконує**, **Вихід**, **Кому передається**, **Як перевіряє QA**, **Глибше** тощо — див. `studyPanelMarkdown.ts` (`isStudyPanelSectionLabel`).
- Не використовувати універсальне «Хто це створює?» для пасивних даних; для даних — «Що містить?», «Хто підготував?», «Хто використовує далі?».
- Наскрізний приклад у межах теми (RAG: `rag-teaching-thread.ts` / INC-442); позначати умовні дані.

**Рендер:**

- `MarkdownBody` з `studyPanelLabels` → клас `markdown-body-study-panel`.
- Кожен абзац `**Мітка** текст` — **міні-картка**: лівий акцент, фон; мітка — uppercase, колір **#e8c878** (клас `study-panel-section-label`), окремий рядок над текстом.
- Звичайний `strong` у тілі абзаца — світліший, без uppercase.

**Терміни (`StudyPanelTerms`):**

- Після тіла панелі, `study-detail-panel-with-terms`; заголовок «Терміни» — uppercase **#7ee8d8**.
- Кожен термін — окрема міні-картка: **chip** з `label` (monospace, teal фон), під ним абзац `text` (повна ширина, без grid «label — desc в один ряд»).
- У **картках навігації** і teaser — людська українська («список tools у запиті», «історія повідомлень»). Технічні імена полів API (`messages`, `tools`) — у блоці **Терміни** або в `` `code` `` у панелі, не `tools[]` у кожному реченні картки.
- Layout: `min-width: 0`, `overflow-wrap: anywhere` на панелі й термінах — без зсуву вправо й горизонтального скролу на вузькій колонці.

**Підказка до split-panel:**

- `StudyInteractionHint` — компактна смуга «Підказка» над списком кроків, **на всю ширину** блоку (не в лівій колонці grid).

CSS: `src/App.css` — блоки `.markdown-body-study-panel`, `.study-panel-terms-*`, `.study-rag-qa-detail-panel`, `.study-interaction-hint`. Нові мітки секцій — дописувати в `PANEL_SECTION_LABELS` у `src/lib/studyPanelMarkdown.ts`.

## Патерн «список + бокова панель»

- Layout: **`StudyStepDetailLayout`** / клас **`.study-step-detail-layout`** — зліва **220–280px** (`study-step-detail-nav`), справа **`study-step-detail-panel`** з повним clarity-текстом. **Не** змішувати з `.study-rag-qa-layout` (раніше інвертував колонки).
- Ліва навігація — **завжди** `StudyPipelineStepNav` → `StudyFlowStageCard` з `layout="pipeline"` (glyph, badge, роль, teaser, «Деталі →»). **Не** дублювати `study-rag-story-step-btn`, `study-rag-qa-card`, `study-split-hint-pick` для нових уроків.
- Зліва лише **навігація**: номер, коротка назва, роль (Код / LLM), teaser з уроку (без line-clamp). Повний текст — **тільки справа**, без зменшення шрифту панелі.
- Мобільно: список зверху, пояснення знизу (без `order: -1` на панелі).
- **Панель всередині блоку**, не fullscreen flyout — для невеликого тексту.
- Flyout (`StudyDetailFlyout`) — лише для **кроків схем** (ланцюг даних, offline pipeline), де потрібен фокус.
- Активний пункт: `is-active`, перший з деталями — за замовчуванням.
- Панель: clarity-міні-секції (див. вище) + опційно **Коротко з уроку** з markdown; **Терміни** окремим блоком.
- Візуалізація: `phase` chip + міні-смуга фаз (`StudyQaPhaseStrip`) — offline / пошук / LLM / security / observability.

## Картки та списки

- Стиль як `topic-card` / `study-component-card`: номер, kind, заголовок, тіло.
- Переліки компонентів — **стовпець** карток з поясненням, не один рядок через кому.
- «Запам’ятати» — маркований список, **не** stepper «Крок 1–4».
- Кроки процесу — лише в блоках `#### Послідовність` / `**Крок N.**` у відповідному розділі.

## Співбесіда (`StudyInterviewSelfCheck`)

Еталон двошарової відповіді — `src/data/study/tool-calling-interview-questions.ts` (concept-10). RAG/guardrails поки legacy `answerUk` — при оновленні переводити на brief+deep.

**Порядок роботи**

1. Прочитати Study Mode §2–§7 і `*-teaching-thread.ts` — вибрати **один** наскрізний приклад (Tool Calling: `login_spec` + `readPlaywrightReport`; write — окремо `createJiraIssue`).
2. Для кожного з 10 питань: сформулювати **коротко** (2–3 речення вголос) і **до гвинтиків** (задача → ролі → вхід/вихід → успіх/помилка → як QA); JSON лише де без нього неясно; позначити навчальні дані.
3. `pitfallUk` — чому помилка, **без** «Помилка:»; питання без префікса `1.` у `questionUk` (номер лише в UI списку).
4. Підключити deck у `*-interview-self-check.ts` + `study-interview-registry.ts`; перевірити в браузері розділ «Запам’ятати та співбесіда».
5. Звірити твердження з markdown уроку й схемою (ribbon / §2 кроки); `npm run build`.

**Типи:** `study-interview-types.ts` — `answerBriefUk`, `answerDeepUk`; UI — `StudyInterviewSelfCheck.tsx`.

## Перевірки

- `npm run verify:rag` — 8 розділів, 6 runtime-кроків у markdown §2 (+ передумова offline в UI), джерела.
- `npm run verify:tool-calling` — розділи markdown + 10 питань співбесіди з brief+deep.
- `npm run build` після змін UI.
- Не скорочувати навчальний текст у markdown без запиту; UI може **дублювати коротко** у панелі, повний зміст лишається в урокі.
- Runtime-кроки з markdown (наприклад tool calling **Крок 1…5** у §2) — виносити в `*-runtime-steps.ts` **дослівно**; картки §2 (`StudyToolCallingOneFlow`) і teaser §3 (`TOOL_CALLING_STAGES.summaryUk`) беруть текст звідти, не переписувати «з голови».

## Мова учня (видимий текст UI)

Перед здачею теми прочитай **видимий** текст очима учня (Study, Review, атлас — поля `what`/`why` на панелях).

**Заборонено в learner-facing copy:**

- Посилання на номери розділів джерела: «§2», «див. §3», «як у розділі N» — замість цього назви ідею (наприклад «один run login_spec»); hero і §3 ribbon — **одна** схема з `tool-calling-learner-flow.ts`, без другої паралельної стрілки.
- Редакційні нотатки: «не зводьте», «нижче —», «не кожен вузол ribbon = крок UI», «clarity лише справа».
- Імена внутрішніх UI-модулів замість дії користувача (окрім загальних «trace», «harness» як термінів курсу).

**Дозволено для навігації:** коротко й природно — «Оберіть крок ліворуч, щоб побачити пояснення» (`studyLearnerCopy.ts`).

**Де правити:** `src/data/study/*-section-aside.ts`, `study-lesson-intros.ts`, `StudyInteractionHint`, enriched lesson components, guardrails/rag panel `bodyUk` — не лише markdown.

## Стиль prose (markdown і панелі)

- **Не** виділяти жирним «порожні» слова для наголосу: `**тут**`, `**пропозиція**`, `**I/O на диску**`, `**факти**`, `**які**`, `**обрізаний**`, `**сказати**`, `**не виконує**` — це не термін курсу, а розмовний акцент.
- **Жирним** — лише **назви концептів / мітки таблиці / перше введення терміну курсу**: `tool_call`, Tool schema, Harness, Never trust args, заголовок рядка таблиці. Технічні поля API — у `` `code` ``, не `tools[]` у кожному реченні.
- **Добре (зміст):** «LLM повертає `tool_call` — пропозиція виклику, не виконання I/O.» «Диск і HTTP обробляє **tool handler**, не модель.»
- **Погано (акцент замість змісту):** «— **пропозиція**, не виконання.» «**I/O на диску** — у handler.»
- У clarity-панелях `**Проста ідея**` / `**Проблема**` — мітки секцій (`studyPanelLabels`); у тексті під міткою — звичайна проза або терміни курсу, без жирного «для краси».

## Навчальна карта (вкладка «Навчальний маршрут»)

Окремо від Study Mode сторінки уроку — вузли на головній (`LearningMapView`, `MapTopicNode`, `MapLearningStatus`, стилі `.learning-map` у `App.css`).

- **Ієрархія на картці:** етап (заголовок секції, UA) → **назва теми** (`getMapLabel` = `shortTitle` з `topics.registry`, коротко EN: RAG, MCP, Tool Calling) → **стан вивчення** (○ ◐ ● + текст UA). Підказка `hint` на карті — українською.
- **Не ставити `!` на вузлах** за `migrationStatus: partial` — це пояснюється в бічній панелі теми (`TopicSidePanel`, badge міграції). На карті лише **«Study Mode готовий для навчання»** для topicId з `study-ready-for-learning.ts`.
- **Композиція етапу:** один вузол — `.map-stage.is-single` (заголовок + картка в одному ряді на десктопі); кілька вузлів — сітка + горизонтальні зв’язки `→` (мобільно — вертикальний маршрут `↓` між темами в етапі).
- **Між етапами:** `.map-route-connector` («Далі по маршруту»), не випадкові риски через текст.
- Нові теми на карті — лише через `learning-map.registry.ts` + `topics.registry.ts`; фільтри «Увесь маршрут / 20 концепцій / Практика» не дублюють уроки.

## Перенесення на інші теми

1. Розбити Study Mode на `###` розділи з зрозумілими заголовками.
2. Винести повторювані патерни в `extract*` + компонент + `*-details.ts`.
3. Підключити в `StudyModeSections` за `topicId` + `sectionTitle`.
4. Звірити з `AI_ENGINEERING_SOURCE_INVENTORY.md` перед додаванням «книжкових» тверджень.

Детальний мапінг файлів: [reference.md](reference.md).
