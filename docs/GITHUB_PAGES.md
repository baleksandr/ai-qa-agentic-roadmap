# Публікація на GitHub Pages

**Репозиторій:** [baleksandr/ai-qa-agentic-roadmap](https://github.com/baleksandr/ai-qa-agentic-roadmap)  
**Сайт:** https://baleksandr.github.io/ai-qa-agentic-roadmap/

## Маршрутизація (HashRouter)

Для GitHub Pages без серверного fallback використовується **HashRouter**. У URL з’являється `#` перед шляхом застосунку:

| Локально (dev) | На GitHub Pages |
|----------------|-----------------|
| `http://localhost:5173/` | `https://baleksandr.github.io/ai-qa-agentic-roadmap/` |
| `http://localhost:5173/#/topic/fundamentals/study` | `https://baleksandr.github.io/ai-qa-agentic-roadmap/#/topic/fundamentals/study` |

Прямі посилання й **F5** на маршрутах `#/topic/...` працюють. Внутрішні `<Link to="/topic/...">` змінювати не потрібно — React Router додає hash автоматично.

## Base path Vite

Збірка: `npm run build` → `vite build --base /ai-qa-agentic-roadmap/`  
Перевірка локально: `npm run preview` (той самий base).

## Що публікується

Workflow `.github/workflows/deploy-github-pages.yml` збирає проєкт і завантажує **лише вміст `dist/`** на GitHub Pages:

- зібраний JS/CSS (`assets/`)
- `index.html`
- `favicon.svg`, `icons.svg` з `public/`
- навчальний markdown і `*.study.json` **вбудовані в бандл** на етапі build (не окремі файли в `dist/`)

У публічний git **не** потрапляють (через `.gitignore`): `.env`, PDF/DOCX у `source/`, `node_modules`, `dist`.

## GitHub Settings → Pages

1. Репозиторій → **Settings** → **Pages**
2. **Build and deployment** → **Source:** **GitHub Actions** (не «Deploy from a branch»)
3. Змержити зміни в гілку **`main`** — workflow запуститься на push
4. Після успішного run: **Actions** → workflow **Deploy GitHub Pages** → зелений job **deploy** → посилання на сайт

Перший деплой може зайняти 1–3 хвилини після завершення Actions.

## Чеклист після публікації

- [ ] Головна: карта, пошук, клік по вузлу
- [ ] `#/topic/fundamentals` — Review Mode
- [ ] `#/topic/fundamentals/study` — Study Mode (акордеони 1–20)
- [ ] `#/agent-architecture` — друга вкладка
- [ ] Прогрес у `localStorage` (оновлення статусу теми)
- [ ] Favicon і іконки на карті
