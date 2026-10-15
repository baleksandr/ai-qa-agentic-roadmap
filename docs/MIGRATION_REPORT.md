# Звіт про перенесення (DOCX — джерело правди)

Оновлено: 2026-10-15 (після `npm run source:migrate`)

## Звірка DOCX vs PDF

Див. `docs/DOCX_VS_PDF.md`. У середовищі збірки агента **DOCX у `source/` не виявлено** (лише PDF) — повний DOCX-інвентар і mammoth-експорт зображень потрібно перезапустити локально після збереження файлу.

| | PDF | DOCX (очікується) |
|--|-----|-------------------|
| Абзаці | ~4937 | звірити після інвентаря |
| Таблиці | парсер ≈0 | `w:tbl` у document.xml |
| Зображення | парсер ≈4 | `word/media/*` + mammoth → `public/course-assets/` |

## Статуси `migrationStatus` (з `migration.generated.ts`)

Усі теми з текстовим витягом з **PDF** позначені **`partial`** (не `complete`), поки не пройдена звірка з DOCX, таблицями та зображеннями.

| Пакет | Теми | Статус |
|-------|------|--------|
| Fundamentals | `fundamentals` | partial (текст є) |
| PART II | `concept-01` … `concept-20` | partial (текст PART II витягнуто) |
| Reference | `reference-library` | partial |
| Labs | `lab-0` … `lab-9` | partial |

**`complete`** — лише після DOCX + mammoth + наявність таблиць/зображень у markdown за аудитом.

## UI

- Бічна панель на карті: клік по вузлу → матеріал + **Не вивчено / У процесі / Вивчено** (`localStorage` `ai-qa-agentic-roadmap-learning-v2`).
- `migrationStatus` на бейджі «Перенесення» — окремо від прогресу вивчення.
- Вкладки «Навчальний маршрут» / «Архітектура агента» без змін.

## Структура вузлів

`docs/NODE_STRUCTURE.md` — 32 теми на карті + примітки щодо START HERE / короткої карти.

## Команди (локально, після DOCX у `source/`)

```powershell
npm run docx:inventory
npm run source:migrate
npm run build
```

## Наступний крок після появи DOCX на диску

1. Перегенерувати інвентар і міграцію (команди вище).
2. Пройти Fundamentals + Concept 01–02 вручну в UI (Study + зображення/таблиці).
3. Підняти до `complete` лише теми, де аудит пройшов; решта лишається `partial` з `migrationNotes`.
