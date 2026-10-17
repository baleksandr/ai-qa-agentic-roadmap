---
name: study-mode-lesson
description: >-
  Покращення Study Mode для уроків курсу (markdown → UI): структура розділів,
  картки, ribbon-схеми, таблиці, inline/flyout панелі деталей, без вигаданих
  фактів. Use when editing content/concepts Study Mode, StudyModeSections,
  src/components/lesson, src/data/study, PART II concepts 01–20, verify:*-study,
  or user asks to improve/fix lesson cards and side panels. Project rule:
  .cursor/rules/study-mode-lesson.mdc (alwaysApply).
---

# Study Mode — правила оформлення уроку

## Єдиний стандарт навчального UI (усі теми)

Застосовується до **Fundamentals**, **20 Concepts**, **Lab 0–9**, **Review** і **Study** (панелі, картки, markdown). Деталі реалізації: `docs/SITE_LEARNING_UI_STANDARDS.md`. Перевірка: `npm run verify:study-standards` (у т.ч. симуляція inline `**`/`#` без браузера) + `npm run build`. Перед ✓ «готова» картка: переглянути **весь** текст панелі після рендеру (усі вибори внутрішніх кроків), не лише рядок у `.ts`.

1. **Пара «назва — пояснення»:** `StudyLabeledExplanation` (`termUk` + `explanationUk`); дані — `labeledLead`, `labeledLines`, `labeledPairs`, key-phrase. Пояснення на **окремому рядку** після абзаца (`StudyLearnerExplanationBlocks`: цілий абзац-пара або хвіст «. Агентний run — коли…»). Акцент лише на назві; ` — ` у DOM. Не фарбувати тире всередині звичайного речення. `**` — `.study-text-emphasis`.
2. **Панелі карток:** власне пояснення, приклад, QA; «Вхід/вихід» лише для процесу. `StudyDefinitionAccent` — термін окремим рядком без тире в `leadUk`.
3. **Терміни:** перша поява — UA + EN/розшифрування за потреби; без повторного словника в кожній панелі.
4. **«Запам’ятати» / `keyIdea`:** 2–3 висновки з уроку (знання), не інструкції UI («оберіть картку», «картки нижче»). **Підсумок після інтерактивних карток** (наприклад «Як це перевіряти») — `afterInteractiveSummary` + `StudyAfterInteractiveSummary`, не `phraseParagraphs` під віджетом; не дублювати `keyIdea`. **Навчальний сценарій** (`leadUk` / callout) окремо від **єдиної UI-підказки** на Study-сторінці: `StudyPageCardsHint` + `STUDY_PAGE_CARDS_INTERACTION_HINT_UK` (`studyPageInteractive.ts`) — після outcomes, перед розділами; лише якщо `topicStudyPageHasInteractiveCards`. У розділах, вкладених картках і панелях не дублювати «оберіть крок/картку» (`StudyInteractionHint` лише в `StudyPageCardsHint`). Кілька висновків — `StudyRememberTakeaways`: компактні проміжки між рядками, **без** маркерів, нумерації чи внутрішніх рисок (акцентна рамка лише на `.lesson-callout`). Один висновок — один абзац. Concepts/labs — `study-remember-markdown`. **Пунктуація:** простий однорідний перелік — коми й сполучник перед останнім елементом; `;` лише між складними самостійними частинами речення (не в коді/JSON/URL).
5. **Процес vs поняття:** справжній послідовний run (RAG, tool calling) — `presentation: 'process'` і кроки ланцюга. Якщо картки описують **різні аспекти однієї історії** (eval окремо від training, drift ≠ retrain) — `presentation: 'concepts'`, групи `conceptGroups`, без «Крок N з M». Не створювати враження, що hold-out відокремлюють після навчання, якщо в змісті це навпаки. **§15 Deterministic vs Probabilistic:** код — точні очікування за зафіксованих fixture/умов, LLM — змістові критерії на eval-наборі, не exact string match prose.
6. **Інтерактивні навчальні картки:** стилі `study-interactive-cards.css`, стан вибору — `src/lib/studyInteractiveCardState.ts` (`activeKey` у React → `is-active` + `aria-pressed` + `data-selected`). Обрана картка лишається рожевою без фокусу; hover/focus-visible — окремо. **Назва картки** — `StudyInteractiveCardTitle` + `--study-interactive-card-title` (світлий синьо-фіолетовий, напівжирна); teaser/description — звичайний світлий текст; не фарбувати назви рожевим при виборі. Нові списки — `StudyPipelineStepNav` → `StudyFlowStageCard`. **Нумерація:** `studyCardNumber.ts` + `numberPrefix` / `parentCardNumber` — на картці `1`, `2`, `3.1` (не в тексті уроку); у панелі «Картка N», не «Крок» для понять. Порівняння двох режимів у панелі — `processStepPick` (еталон §13 «Reasoning і агент»), не `labeledLines`.

## PART II — довести 20 концепцій до навчального рівня

**Еталони глибини (не копіювати структуру механічно):** `concept-03` (RAG), `concept-10` (Tool Calling). Решта 18 тем — той самий **стандарт якості**, форма UI/розділів **за змістом** теми.

**Джерело змісту:** повні уроки PART II V10 (`content/concepts/`, архів курсу), не короткі картки «Карти курсу». Перед редагуванням теми звір поточний Study Mode з V10: що вже є в поясненнях, схемах, QA-сценаріях, співбесіді; що загубилось або злиплось у стіну тексту. `source/AI.pdf` + `docs/AI_ENGINEERING_SOURCE_INVENTORY.md` — лише **перевірка фактів і термінів**; урок на сайті **самодостатній** (не «відкрийте книгу замість пояснення»).

**Обов’язковий зміст кожної концепції**

1. Просте визначення + конкретна проблема, яку вирішує.
2. Один наскрізний приклад **QA Regression Investigation Agent** (`login_spec` → дії агента → результат). Якщо концепція не в кожному кроці — явно сказати, **де** вона потрібна.
3. Послідовність: вхід → хто виконує → дія → вихід → що отримує наступний компонент.
4. Межа **LLM** / **код (harness, handler)** / **зовнішній сервіс** / **людина (approve)**.
5. Новий термін при першій появі — простими словами, потім EN/скорочення.
6. Типові збої + QA-перевірки: умова → дія → очікування → чого **не** має статися → докази (trace/spy).
7. Production — якщо доречно для теми (не шаблонний абзац «versioning…» без прив’язки).
8. Кілька питань самоперевірки з **Коротко для співбесіди** + **Розберімо до гвинтиків** + типова помилка (deck у `study-interview-registry.ts`).

**Подача:** короткі абзаци, списки, окремі схеми `→` лише для потоку даних/рішень (`studyArrowFlow.ts`). Не дублювати один flow трьома блоками. Технічні деталі — у **Глибше** (панелі clarity або розгортання), якщо заважають першому прочитанню. Без learner-facing «§N», «компонент 5 pipeline», «оберіть вузол», посилань на файли репозиторію.

**Темп роботи (агент)**

- Пакети **3–4 концепції** послідовно по маршруту курсу (див. `docs/PART_II_STUDY_ROLLOUT_PROGRESS.md`).
- Після кожного пакета: повнота змісту (8 пунктів), рендер, переходи, self-check, `npm run build`; виправити знайдене; **не зупинятися** з пропозицією «продовжити» — ціль усі **18** тем (окрім еталонів 03 і 10).
- Якщо джерело не дає підстав — позначити невизначеність; **не вигадувати** механізми чи комерційний досвід.

**Позначка «Study Mode готовий для навчання»** (`study-ready-for-learning.ts`, ✓ на карті)

Ставити **лише** після чекліста для **цієї** теми: усі 8 пунктів змісту, hero + outcomes + nav blurb (для збагачених), інтерактив там, де еталон вимагає (split nav, failure cards, QA matrix — за потреби теми), interview deck brief+deep, verify-скрипт за наявності, ручна перевірка в UI. **Не** ставити за наявність тексту, акордеонів або успішний `build`.

**Прогрес:** оновлювати `docs/PART_II_STUDY_ROLLOUT_PROGRESS.md` (topicId → зроблено → бракує → результат перевірки). **Не чіпати** особистий прогрес користувача (Не вивчено / У процесі / Вивчено) — лише `useProgress` / local storage.

## Навчальні картки + бокова панель (єдиний патерн)

**Еталони взаємодії:** concept-03 (RAG), concept-10 (Tool Calling) — компактні кроки зліва, предметна панель справа (`StudyStepDetailLayout`, `StudyPipelineStepNav`, `StudyFlowStageCard`).

**Спільна реалізація для нових тем і Fundamentals:**

- UI: `StudyTeachingCardsSection` + дані в `*-teaching-cards.ts` / `fundamentals-teaching-cards.ts` (`getFundamentalsTeachingCards` через `study-teaching-cards.registry.ts`). Панелі: `fundamentalsTeachingStep()` → `fundamentalsPanel` + `StudyTeachingCardPanel`.
- Кожна картка — **унікальне** пояснення: простими словами, зв’язок із сусідніми кроками, приклад QA investigation (`login_spec`), збій і як помітити при тестуванні. Поле **«Зв’язок з іншими поняттями»** (`linkUk` / `relationUk`) — логіка між ідеями, не назви груп UI чи позиція картки на сторінці. Рендер: `StudyTermAccent` / `StudyLabeledExplanation` для кольору терміна; `parseLessonBold` і `MarkdownBody` — наголос `.study-text-emphasis` без кольору терміна. **Вхід/вихід** — лише для процесу (`omitInputOutput` для порівнянь). Без сирих маркерів і «§N».
- Структура карток **визначається змістом** (процес, компоненти, порівняння, ризики, QA) — не механічні «5 кроків» у кожну тему; не дублювати вже готові блоки RAG/Tool Calling.
- **Порівняння двох процесів:** `StudyProcessCompareBundle` → `StudyProcessCompareSection` (картки з вхід/дія/результат + ключова ознака на картці; панель — механізм, приклад login_spec, QA). Дані Fundamentals: `fundamentals-study-widgets.ts`. Не замінює кодові блоки й не парсить markdown автоматично.
- **Картки з панеллю для аспектів теми:** `StudyTeachingCardsSection` + `fundamentalsPanel` (§4 Model — три картки). Лише коли без панелі важко зрозуміти механізм; не кожен `phraseParagraphs` → картка.
- **Ключова фраза в Study Mode (єдиний UI):** `StudyLearnerKeyPhraseLine`; між фразою й поясненням у DOM — текстовий роздільник ` — ` (копіювання без злипання). **Fundamentals JSON:** `keyIdea` + `definitionAccent`; довгі `phraseParagraphs` / `diagram` / `flow` / `code` / `list` **не дублювати** те саме, що вже в teaching-картках (§2–3, §7–12 — один процес = одна схема карток, без паралельного ASCII-блоку в JSON). **Markdown/Lab:** `:::study-key-phrase` + `фраза|пояснення`. Не автопарсинг тире; не всі `strong`.
- Fundamentals зміст (§2–5 і далі): ланцюг **визначення → keyIdea (коротка суть) → teaching-картки з панелями**; §2 ML — один сценарій, **різні** тікети для training і hold-out/eval, `flowArrowLine` з **групами** (не 7 кроків одного виклику); примітку «умовний сценарій» — у `leadUk`, не в «Запам’ятати». У тексті панелі — терміни простими словами при першій появі. Блок **«Терміни»** — лише 1–3 записи для **обраної** картки (`fundamentalsTeachingStep` → `panel.terms`), не один словник на першій картці. Teaser на картці видимий без кліку. Панелі **унікальні** (що відбувається → приклад → QA), без повтору загального визначення ML/LLM у кожній панелі, без панелей-заглушок заради однакової кількості полів.
- **QA-перевірка в панелі:** окремий підблок `StudyLearnerPanelQaCheck` — поле `qaCheckUk` на кроці `processStepPick` / секції `plain`, або секція `type: 'qaCheck'`. Не вбудовувати `**QA-перевірка:**` у `bodyUk`/`detailUk`; не підсвічувати довільне «QA» в тексті. Блок «Для QA investigation» — короткий підсумок, без дубля `qaCheckUk`.
- **Інтерактивний перелік у правій панелі:** коли **кожен пункт** списку потребує окремого пояснення й QA-перевірки — `processStepPick` → `StudyLearnerPanelProcessStepPick` (не перетворювати автоматично кожен звичайний `labeledLines` / markdown-список). **process** — кроки run (`presentation: 'process'`, виконавець у панелі); **concepts** — питання до одного твердження (`presentation: 'concepts'`, без «кроків API»). Картки **колонкою**, деталь поруч (десктоп) або під картками; `qaEvidence` або `qaCheckUk` на кроці (`StudyLearnerPanelQaCheck`) — без дубля teaser у панелі й без повтору в «Для QA investigation». Стилі: `study-learner-panel-step-pick`.
- **Щільні панелі:** `FundamentalsCardPanel.sections` + `StudyLabeledExplanation` (`termUk` / `explanationUk`); акцент лише на `termUk`. Усередині `explanationUk` — `parseLessonBold` (наголос без кольору). **Рядок «назва + пояснення»:** `StudyLabeledExplanation` — inline-потік (`study-learner-labeled-head` + пояснення в тому ж абзаці); не flex-wrap усього пояснення на новий рядок; на вузькій мінікартці — колонка без тире (`@container` у `study-learner-panel.css`). **Терміни картки:** `FundamentalsCardPanel.terms` (1–3 записи `StudyPanelTermEntry`) → `StudyPanelTerms` у `StudyLearnerPanelBody` для **поточної** teaching-картки, не один словник на весь урок. Teaser на картці схеми — одне речення «що це?», не перелік сусідів. Заголовки блоків панелі — бірюзові `.study-learner-panel-label` / `.study-panel-section-label`.
- **Fundamentals (§1–20):** `teaserUk` — лише на картці; при `fundamentalsPanel` права панель після заголовка одразу з розділів (`StudyTeachingCardsSection`), без дубля teaser. Панелі понять — `fundamentalsConceptStep` + `panel.terms`; reasoning ≠ tool calls у логах harness.
- **§14 Hallucination (еталон понять + докази):** одна історія `login_spec` / `#submit` у `leadUk` без повтору визначення з `definitionAccent`. Розділяти **непідтверджено ≠ спростовано** і **валідний формат ≠ правдивий зміст**. Вкладені орієнтири в панелі — `processStepPick` + `qaCheckUk`, не `labeledLines`: «Симптом» («Що ми знаємо…» — не три стани одного факту), «Формат» (три рівні parse/schema/факт). **Приклад відповіді моделі:** спочатку зрозуміла картка полів і статуси перевірок (`StudyModelResponseExampleBlock`, дані `login-spec-model-response-json.ts` — одне джерело для UI й JSON), технічний JSON і правила схеми — у розгортанні «Показати JSON», без великого code block наперед. У навчальному UA не склеювати вимоги через `;` — короткі речення. У кожній з чотирьох карток — `panel.terms` (2–3 предметні терміни) + унікальні секції; «Зв’язок з іншими поняттями» без «Далі» / «Після schema». Orphan-текст у JSON §14 не дублювати під віджетом — лише `keyIdea`.
- Стилі: `study-teaching-cards-layout.css` + `StudyStepDetailLayout`: на **десктопі (≥769px)** картки/навігація зліва, **повна** панель справа на всю ширину `study-col-main` (без `max-width: 52rem` по центру). Мобільно — панель під списком, на всю ширину. Кіберпанк — лише вигляд карток, не ламати grid. §1 AI: `fundamentals-ai-map-body` row на десктопі.
- Markdown уроку **залишається** повним; картки допомагають вивчати, не замінюють текст.

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
- За замовчуванням відкритий **перший** розділ; `StudySectionsToolbar` + `useStudySectionsOpen`: `aria-pressed` і `.is-active` лише коли **усі** розгорнуті / **усі** згорнуті; частковий стан — обидві кнопки нейтральні. Вибрана навчальна картка — `.is-active` + `data-selected="true"`, рожевий лівий край не залежить від `:hover`/`:focus` (див. `study-teaching-cards-layout.css`).
- Заголовок H1 для збагачених тем — **hero**, не дублювати `# Concept` з markdown; `pageTitleUk` у hero для screen readers.

## Рендеринг markdown

- Таблиці GFM: `MarkdownBody` + `studyTables` → обгортка `study-markdown-table`.
- Ланцюги `→`: **лише справжні схеми** (`isPipelineArrowLine` у `studyArrowFlow.ts`):
  - 3+ стрілки або короткі кроки без `**` на початку абзаца.
  - **Не** перетворювати прозу QA (`запит → chunk_id`, `citation → chunk`) на ribbon.
- Абзац лише з `→` у вступі/тілі → `StudyFlowRibbon` (variant `ribbon`) для коротких ланцюгів; **4+ кроків** у блоці outcomes / довгі §3 — `StudyLearnerFlowTrack` (компактно по центру, `study-learner-flow-layout.css`): без розтягування вузлів на всю ширину; 7 кроків — ряд 4 + ряд 3 з однозначним `↓` між рядами; на вузькому екрані — вертикальний timeline без горизонтального скролу.
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

- `StudyPageCardsHint` / `StudyInteractionHint` — **одна** смуга «Підказка» на Study-сторінку з інтерактивними картками; не повторювати в `StudyStepDetailLayout`, `processStepPick`, RAG/TC блоках.

CSS: `src/App.css` — блоки `.markdown-body-study-panel`, `.study-panel-terms-*`, `.study-rag-qa-detail-panel`, `.study-interaction-hint`. Нові мітки секцій — дописувати в `PANEL_SECTION_LABELS` у `src/lib/studyPanelMarkdown.ts`.

## Патерн «список + бокова панель»

- Layout: **`StudyStepDetailLayout`** / клас **`.study-step-detail-layout`** — зліва **220–280px** (`study-step-detail-nav`), справа **`study-step-detail-panel`** з повним clarity-текстом. **Не** змішувати з `.study-rag-qa-layout` (раніше інвертував колонки).
- Ліва навігація — **завжди** `StudyPipelineStepNav` → `StudyFlowStageCard` з `layout="pipeline"` (glyph, badge, роль, teaser, «Деталі →»). **Не** дублювати `study-rag-story-step-btn`, `study-rag-qa-card`, `study-split-hint-pick` для нових уроків.
- Зліва лише **навігація**: номер, коротка назва, роль (Код / LLM), teaser з уроку (без line-clamp). Повний текст — **тільки справа**, без зменшення шрифту панелі.
- Мобільно: список зверху, пояснення знизу (без `order: -1` на панелі).
- **Панель всередині блоку**, не fullscreen flyout — для невеликого тексту.
- Flyout (`StudyDetailFlyout`) — лише для **кроків схем** (ланцюг даних, offline pipeline), де потрібен фокус.
- **Вибрана картка навігації** (`StudyFlowStageCard` / `StudyPipelineStepNav`, policy-flow, compare, transfer ribbon): `study-interactive-card` + `is-active` / `data-selected="true"` + `aria-pressed` / `aria-current="step"`; стилі — `study-interactive-cards.css`. Перший пункт відкритий у панелі за замовчуванням.
- **Картки понять vs процес:** `presentation: 'concepts'` у `StudyTeachingCardsBundle` — без «Крок N з M», без `StudyLearnerFlowTrack` з усіх заголовків, без номера на картці; заголовок блоку (`conceptsHeadingUk`), опційно `conceptGroups`. Процесні уроки — `flowArrowLine` і підпис «Розбір по кроках». Приклад і QA у панелі — **унікальні** для кожної картки.
- Панель: clarity-міні-секції (див. вище) + опційно **Коротко з уроку** з markdown; **Терміни** окремим блоком.
- Візуалізація: `phase` chip + міні-смуга фаз (`StudyQaPhaseStrip`) — offline / пошук / LLM / security / observability.

## Картки та списки

- Стиль як `topic-card` / `study-component-card`: номер, kind, заголовок, тіло.
- Переліки компонентів — **стовпець** карток з поясненням, не один рядок через кому.
- «Запам’ятати» — кілька коротких висновків у компактному блоці (`StudyRememberTakeaways`), **не** stepper «Крок 1–4».
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

## Review Mode (бічна панель і `/topic/:id`)

- **Джерело:** `src/data/review/review-mode-by-topic.ts` (пріоритет) + fallback з `## Review Mode` у markdown.
- **Еталон якості:** concept-03 RAG — проблема, ідея, роль у **QA Regression Investigation Agent**, QA, запам’ятати; без шаблону з підстановкою назви.
- **Візуалізація:** `ReviewMarkdownBody` + `:::review-phases`, `:::review-steps`, `:::review-compare` (див. `src/lib/reviewMarkdownBlocks.ts`). Дві фази — дві картки; процес — кроки; порівняння — два блоки. Не зливати ланцюг у один абзац зі стрілками.
- **Стилі:** `src/styles/review-mode.css` (не дублювати великі блоки в `App.css` без потреби).
- **Карта маршруту:** доп. layout — `src/styles/learning-map-layout.css`; migration badge лише в панелі деталей, не «!» на кожному вузлі.

## Навчальна карта (вкладка «Навчальний маршрут»)

Окремо від Study Mode сторінки уроку — вузли на головній (`LearningMapView`, `MapTopicNode`, `MapLearningStatus`, стилі `.learning-map` у `App.css`).

- **Ієрархія на картці:** етап (заголовок секції, UA) → **назва теми** (`getMapLabel` = `shortTitle` з `topics.registry`, коротко EN: RAG, MCP, Tool Calling) → **стан вивчення** (○ ◐ ● + текст UA). Підказка `hint` на карті — українською.
- **Не ставити `!` на вузлах** за `migrationStatus: partial` — це пояснюється в бічній панелі теми (`TopicSidePanel`, badge міграції). На карті лише **«Study Mode готовий для навчання»** для topicId з `study-ready-for-learning.ts`.
- **Композиція етапу:** один вузол — `.map-stage.is-single`; кілька вузлів — **група по центру** етапу (`learning-map-layout.css`), `→` лише між картками (без полоски `map-flow-link-line`). Назва теми на десктопі **в один рядок** (`white-space: nowrap`, достатній `min-width` вузла); якщо ряд не вміщується — **цілий вузол** на наступний ряд (`packConceptStageRows`), між рядами `↓` під останньою карткою попереднього ряду. Lab — сітка з `minmax` для довших назв. Мобільно — вертикальний маршрут без обрізання.
- **Компактні схеми в Study Mode** (outcomes, §3, `StudyLearnerFlowTrack`): блок **обмеженої ширини**, по центру (`study-learner-flow-layout.css`); кроки не розтягувати на всю ширину колонки; перенос між рядами — однозначний `↓` від останнього кроку першого ряду; стрілки `→` з відступом від карток.
- **Між етапами:** `.map-route-connector` («Далі по маршруту»), не випадкові риски через текст.
- Нові теми на карті — лише через `learning-map.registry.ts` + `topics.registry.ts`; фільтри «Увесь маршрут / 20 концепцій / Практика» не дублюють уроки.

## Перенесення на інші теми

1. Розбити Study Mode на `###` розділи з зрозумілими заголовками.
2. Винести повторювані патерни в `extract*` + компонент + `*-details.ts`.
3. Підключити в `StudyModeSections` за `topicId` + `sectionTitle`.
4. Звірити з `AI_ENGINEERING_SOURCE_INVENTORY.md` перед додаванням «книжкових» тверджень.

Детальний мапінг файлів: [reference.md](reference.md).
