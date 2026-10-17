# PART II — прогрес Study Mode (20 концепцій)

Оновлено після rollout пакетів 1–6 (контент + decks + heroes + `npm run build`).

**Перевірка UI:** у середовищі агента **браузер недоступний** — ручний перегляд сторінок Study **не виконувався**. Колонка «Перевірка UI» = `не перевірено` для всіх тем, крім еталонів 03/10 (раніше перевірені вручну в проєкті).

**✓ на карті** (`study-ready-for-learning.ts`): **factually verified** у UI. Зараз: `fundamentals`, `concept-03`, `concept-10`, `concept-14` (PE rollout §1–§9). Інші теми — deck + MD без ✓ до UI-перевірки.

**Особистий прогрес користувача** (○/◐/●) — не змінювався.

---

## Пакети

| Пакет | topicId | Контент | build | UI |
|-------|---------|---------|-------|-----|
| 1 | 01, 02, 04 | ☑ 8§ MD, hero, outcomes, deck (01/02/04) | OK | не перевірено |
| 2 | 14, 12, 15 | ☑ | OK | не перевірено |
| 3 | 06, 13, 07 | ☑ | OK | не перевірено |
| 4 | 11, 16, 09, 08 | ☑ | OK | не перевірено |
| 5 | 05, 18, 19 | ☑ | OK | не перевірено |
| 6 | 17, 20 | ☑ MD + enriched UI hooks; 20 ☑ | OK | не перевірено |

---

## Таблиця по 20 концепціях

| topicId | Тема | Зроблено | Відкриті проблеми | Перевірка | ✓ карта |
|---------|------|----------|-------------------|-----------|---------|
| concept-01 | Memory & State | 8§, hero, deck 5Q | UI не перевірено; shallow topics — без split UI (достатньо MD+deck) | build | ні |
| concept-02 | Orchestration | те саме | UI не перевірено | build | ні |
| concept-03 | RAG | еталон UI+MD | — | verify:rag (раніше), UI (раніше) | **так** |
| concept-04 | Agent Harness | 8§, hero, deck | UI не перевірено | build | ні |
| concept-05 | Evals | 8§, hero, deck | UI не перевірено; deck 2Q (розширити за бажанням) | build | ні |
| concept-06 | MCP | 8§, hero, deck | UI не перевірено | build | ні |
| concept-07 | Skills | 8§, hero, deck | UI не перевірено | build | ні |
| concept-08 | A2A | 8§, hero, deck | UI не перевірено | build | ні |
| concept-09 | Multi-agent | 8§, hero, deck | UI не перевірено | build | ні |
| concept-10 | Tool Calling | еталон | oneStoryFlow flag у registry | verify:tool-calling (раніше) | **так** |
| concept-11 | Planning | 8§, hero, deck | UI не перевірено | build | ні |
| concept-12 | Reasoning | 8§, hero, deck | UI не перевірено | build | ні |
| concept-13 | Fine-tuning | 8§, hero, deck | UI не перевірено | build | ні |
| concept-14 | Prompt Engineering | 9§ Study UI (§1–§9), hero, deck | UI — людина | build, verify:study-standards | **так** |
| concept-15 | Vector Database | 8§, hero, deck | UI не перевірено | build | ні |
| concept-16 | Agentic Workflows | 8§, hero, deck | UI не перевірено | build | ні |
| concept-17 | Guardrails | 8§ MD + enriched UI; deck (legacy+new) | UI не перевірено; звірити enriched картки з новими заголовками § | build | ні |
| concept-18 | Observability | 8§, hero, deck | UI не перевірено | build | ні |
| concept-19 | Benchmarks | 8§, hero, deck | UI не перевірено | build | ні |
| concept-20 | Production | 8§, hero, deck | UI не перевірено | build | ні |

---

## Verify CLI

| Команда | Результат (ця сесія) |
|---------|----------------------|
| `npm run build` | **OK** (після пакета 6) |
| `npm run verify:rag` | не запускалось |
| `npm run verify:tool-calling` | не запускалось |

---

## Файли rollout (додано/змінено)

- `content/concepts/*.md` — усі 20 (крім 03/10 уже були; 01–02–04–17 оновлені; решта переписані)
- `src/data/study/part-ii-interview-decks.ts`, `part-ii-interview-decks-rest.ts`
- `src/data/study/study-interview-registry.ts`
- `src/data/study/study-lesson-heroes.ts`, `study-lesson-intros.ts`
- `src/components/StudyModeSections.tsx` — guardrails section matchers
- `study-ready-for-learning.ts` — `fundamentals`, `concept-14` (+ 03, 10)

**Не чіпали:** `src/App.css`, localStorage прогресу.

---

## Наступний крок для людини

1. Локально `npm run dev` → пройти Study для 01, 02, 04, 17 (enriched), випадкова тема з пакета 2–5.  
2. Після OK — додати topicId у `study-ready-for-learning.ts` і оновити колонку ✓ тут.  
3. За бажанням розширити decks `part-ii-interview-decks-rest.ts` до 5+ питань на тему.
