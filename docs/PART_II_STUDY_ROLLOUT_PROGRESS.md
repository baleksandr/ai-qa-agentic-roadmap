# PART II — прогрес Study Mode (20 концепцій)

Оновлено після rollout пакетів 1–6 (контент + decks + heroes + `npm run build`).

**Перевірка UI:** у середовищі агента **браузер недоступний** — ручний перегляд сторінок Study **не виконувався**. Колонка «Перевірка UI» = `не перевірено` для всіх тем, крім еталонів 03/10 (раніше перевірені вручну в проєкті).

**✓ на карті** (`study-ready-for-learning.ts`): теми з повним Study UI, позначені готовими для навчання. Зараз: `fundamentals`, `concept-01`–`concept-04`, `concept-06`–`concept-10`, `concept-11`–`concept-16` (крім `concept-05`). Інші — deck + MD без ✓ до UI-перевірки.

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
| concept-01 | Memory & State | 9§ Study UI (§1–§9 login_spec), hero, deck 5Q (UA/EN tiers) | — | build, verify:study-standards | **так** |
| concept-02 | Orchestration | те саме | UI не перевірено | build | **так** |
| concept-03 | RAG | еталон UI+MD | — | verify:rag (раніше), UI (раніше) | **так** |
| concept-04 | Agent Harness | 8§, hero, deck | UI не перевірено | build | **так** |
| concept-05 | Evals | 8§, hero, deck | UI не перевірено; deck 2Q (розширити за бажанням) | build | ні |
| concept-06 | MCP | 8§ Study UI, hero, deck | UI — людина | build, verify:study-standards | **так** |
| concept-07 | Skills | hero S/G/C, outcomes, §1–§7 login_spec, deck 5Q, progress sidebar | UI — людина | build, verify:study-standards | **так** |
| concept-08 | A2A | 8§, hero, deck | UI не перевірено | build | **так** |
| concept-09 | Multi-agent | 8§, hero, deck | UI не перевірено | build | **так** |
| concept-10 | Tool Calling | еталон | oneStoryFlow flag у registry | verify:tool-calling (раніше) | **так** |
| concept-11 | Planning | 8§, hero, deck | UI не перевірено | build | **так** |
| concept-12 | Reasoning — як агент перевіряє свої припущення | 9§ Study UI, hero, deck | §1–§9 login_spec, verify:study-standards | build | **так** |
| concept-13 | Fine-tuning | 8§ Study UI, hero E/T/E (EN), deck | UI — людина | build, verify:study-standards | **так** |
| concept-14 | Prompt Engineering | 9§ Study UI (§1–§9), hero, deck | UI — людина | build, verify:study-standards | **так** |
| concept-15 | Vector Database | 8§ Study UI, hero, deck | UI — людина | build, verify:study-standards | **так** |
| concept-16 | Agentic Workflows | 8§, hero, deck | UI не перевірено | build | **так** |
| concept-17 | Guardrails | 8§ MD + enriched UI; deck; outcomes/aside як A2A | UI — людина | build, verify:study-standards | **так** |
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
- `study-ready-for-learning.ts` — див. список у шапці (оновлено: +06, +13, +15, +04)

**Не чіпали:** `src/App.css`, localStorage прогресу.

---

## Наступний крок для людини

1. Локально `npm run dev` → пройти Study для 01, 02, 04, 17 (enriched), випадкова тема з пакета 2–5.  
2. Після OK — додати topicId у `study-ready-for-learning.ts` і оновити колонку ✓ тут.  
3. За бажанням розширити decks `part-ii-interview-decks-rest.ts` до 5+ питань на тему.
