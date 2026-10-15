# AI QA Agentic Roadmap

Навчальний вебзастосунок: інтерактивна дорожня карта курсу **Agentic AI for QA** (аналогічна за ідеєю до [ITLEAD Roadmaps](https://itlead.org/ua/roadmaps#roadmaps)).

Контент береться з DOCX або PDF у `source/` (оригінал не змінювати). Уроки — окремі markdown-файли в `content/`.

Дві вкладки в UI: **Навчальний маршрут** (`/`) та **Архітектура агента** (`/agent-architecture`) — одні й ті самі `topicId` для уроків і прогресу.

## Запуск

```powershell
cd c:\redwood\ai-qa-agentic-roadmap
npm install
npm run dev
```

Відкрийте URL з терміналу (зазвичай `http://localhost:5173`).

Якщо корпоративний npm-registry не має пакетів — у репозиторії є `.npmrc` з `registry.npmjs.org`.

## DOCX і інвентаризація

1. Скопіюйте файл курсу в `source/` (ім’я див. `source/README.md`).
2. `npm run docx:inventory` → `docs/DOCX_INVENTORY.md`.

## Додати або змінити урок

1. Додайте markdown у `content/concepts/`, `content/labs/`, `content/fundamentals/` або `content/reference/`.
2. Структура уроку:
   - `## Review Mode` — короткий огляд (2–5 хв, лише з фактів DOCX).
   - `## Study Mode` — повний текст з підзаголовками джерела.
3. Зареєструйте тему в `src/data/topics.registry.ts` — машинозчитуваний реєстр (`id`, `sourceNumber`, `contentPath`, `migrationStatus`, `docxSection`, `prerequisites`, `relatedTopicIds`).
4. За потреби додайте `topicIds` / `flowEdges` у `ROADMAP_GROUPS`.

Згенерувати порожні файли (якщо ще немає):

```powershell
node scripts/generate-stubs.mjs
```

## Змінити порядок на карті

- **Номер Concept у документі** — поле `sourceNumber` (не змінюйте для відповідності DOCX).
- **Рекомендований порядок вивчення** — поле `learningOrder` і сторінка `/route`.
- **Візуальні групи та стрілки** — `ROADMAP_GROUPS` у `topics.registry.ts`.

## Перевірка повноти перенесення

1. Порівняйте `Study Mode` з відповідним розділом PART II / Lab у DOCX.
2. Оновіть `migrationStatus`: `complete` | `partial` | `not_migrated`.
3. Для `partial` додайте `migrationNotes` у реєстр і рядок у `docs/MIGRATION_REPORT.md`.

## Прогрес

Чотири стани зберігаються в `localStorage` (ключ `ai-qa-agentic-roadmap-progress-v1`). Стани «можу пояснити» / «можу реалізувати» обираються вручну на сторінці теми.

## Публікація (GitHub Pages)

Сайт: **https://baleksandr.github.io/ai-qa-agentic-roadmap/**

Деталі (HashRouter, Actions, Settings → Pages): [docs/GITHUB_PAGES.md](docs/GITHUB_PAGES.md).

```powershell
npm run build
npm run preview
```

Деплой запускається автоматично після push у гілку **`main`** (workflow `Deploy GitHub Pages`).

## Ліцензія

Навчальний проєкт; текст курсу — за умовами вашого DOCX.
