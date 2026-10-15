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
3. Push у гілку **`main`** запускає workflow **Deploy GitHub Pages**
4. Після успішного run: **Actions** → зелений job **deploy** → посилання на сайт

Перший деплой може зайняти 1–3 хвилини після завершення Actions.

### Помилка: `Branch "main" is not allowed to deploy to github-pages`

Це **правила середовища** (Environment), не збірка. Job **build** зазвичай зелений, падає **deploy**.

1. **Settings** → **Environments** → **github-pages** (якщо немає — спочатку один раз запустіть workflow, GitHub створить середовище)
2. **Deployment branches** → оберіть **All branches**  
   або **Selected branches** → **Add branch** → `main`
3. Якщо увімкнено **Required reviewers** — для особистого репо вимкніть або підтвердіть deployment у **Actions** (кнопка **Review deployments**)
4. **Save**
5. **Actions** → останній failed run → **Re-run all jobs**  
   або **Deploy GitHub Pages** → **Run workflow** → гілка `main`

Попередження про Node.js 20 / Ubuntu у логах — інформаційні, на deploy не впливають (у workflow уже `node-version: '22'`).

### Default branch

**Settings** → **General** → **Default branch** → **`main`**, щоб PR і Pages узгоджувались з деплоєм.

## Чеклист після публікації

- [ ] Головна: карта, пошук, клік по вузлу
- [ ] `#/topic/fundamentals` — Review Mode
- [ ] `#/topic/fundamentals/study` — Study Mode (акордеони 1–20)
- [ ] `#/agent-architecture` — друга вкладка
- [ ] Прогрес у `localStorage` (оновлення статусу теми)
- [ ] Favicon і іконки на карті
