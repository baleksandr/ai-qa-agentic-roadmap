# Структура вузлів навчальної карти (весь документ)

Один **вузол карти** = один `topicId` з `src/data/topics.registry.ts`. Клік відкриває бічну панель; повна сторінка — `/topic/:topicId`.

## Передмова та навігація (не окремі вузли на карті)

| Розділ DOCX | Примітка |
|-------------|----------|
| START HERE — Навчальна панель | Вбудовано в UI / маршрут |
| Карта курсу (короткі Concept 1–20) | **Не** вузли — лише огляд; уроки = PART II |

## Вузли карти (32 теми)

### Fundamentals (`fundamentals`)

| id | DOCX |
|----|------|
| `fundamentals` | §1 AI / LLM Fundamentals (1.1–1.8, hands-on lab) |

**Підтеми в панелі (майбутні якорі, один вузол):** 1.1, 1.1.1, 1.2, 1.2.1, 1.3–1.8, Hands-on Lab.

### Ядро агента

| id | DOCX Concept |
|----|----------------|
| `concept-10` | 10 Tool Calling |
| `concept-04` | 4 Agent Harness |
| `concept-02` | 2 Orchestration |
| `concept-01` | 1 Memory & State |
| `concept-06` | 6 MCP |
| `concept-07` | 7 Skills |

### Знання та контекст

| id | Concept |
|----|---------|
| `concept-14` | 14 Prompt Engineering |
| `concept-03` | 3 RAG |
| `concept-15` | 15 Vector Database |
| `concept-13` | 13 Fine-tuning |

### Мислення та мульти-агентність

`concept-12`, `concept-11`, `concept-16`, `concept-09`, `concept-08`

### Контроль і якість

`concept-17`, `concept-18`, `concept-05`, `concept-19`

### Практика

`lab-0` … `lab-9` — LAB 0–9 (QA Regression Investigation Agent)

### Production

`concept-20` — Concept 20 AI Agents in Production

### Довідник

`reference-library` — Reference Library (перед практичним курсом у DOCX)

## Вкладка «Архітектура агента»

Окремий **runtime-цикл** одного run; посилання на ті самі `topicId` (без нових уроків).

## Статуси

- **migrationStatus** — повнота перенесення з DOCX (`migration.generated.ts` після `npm run source:migrate`).
- **learningStatus** — `not_studied` | `in_progress` | `studied` у `localStorage` (`ai-qa-agentic-roadmap-learning-v2`).
