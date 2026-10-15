# Lab 1 — QA Regression Investigation Agent

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** LAB 1 (pdf)  
> Текст з PDF; DOCX не знайдено — таблиці/зображення не звірені.

## Review Mode

LAB 1. Purpose & Scope — мета та межі
0. Яку проблему вирішуємо?
Без контракту агент може почати змінювати Jira або запускати команди, хоча ми хотіли лише аналіз.
Визначаємо вхід, вихід і дозволені операції.
1. Хто що виконує та куди йдуть дані?

## Study Mode

LAB 1. Purpose & Scope — мета та межі
### 0. Яку проблему вирішуємо?
Без контракту агент може почати змінювати Jira або запускати команди, хоча ми хотіли лише аналіз.
Визначаємо вхід, вихід і дозволені операції.
### 1. Хто що виконує та куди йдуть дані?
failed-run.json → read-only investigation
↓
Evidence: report, trace, logs
↓
Result: summary + facts + hypotheses + confidence
↓
Human approves Jira creation
### 2. Що створюємо руками?
Створи docs/agent-contract.md: вхідні дані, expected output, дозволені read-only tools, заборонені
write/delete, критерії завершення.
### 3. Приклад, який можна повторити
Input: path to Playwright report
Output: {test, observations[], hypotheses[], evidence[], nextSteps[]}
Allowed: read_report, read_logs

Requires approval: create_jira_issue
Forbidden: delete_files, write_production_db
### 4. Запуск і перевірка
Перевір: якщо report відсутній, агент має повернути контрольовану помилку, а не вигаданий bug report.
### 5. Що може піти не так / безпека
Використовуй allowlist директорій та мінімальні права. Не давай довільний shell execution за
замовчуванням.
### 6. Як пояснити на співбесіді
Українською: Спершу визначаю задачу, критерії успіху й межі повноважень, потім обираю модель і
інструменти.
English: I define the agent’s input, output, permissions, and success criteria before choosing a model.
Самоперевірка: чи можу я пояснити цей етап без підказки, запустити приклад і назвати щонайменше два
failure modes?

### QA-приклад

Див. відповідний підрозділ «повний приклад» у Study Mode (якщо є в джерелі).

### Failure modes / security / testing / observability / production

Див. розділи failure / security / testing / observability / production у Study Mode.

### Запитання для самоперевірки

Відновіть flow без документа (див. блок «АААА» або hands-on у джерелі).

### Коротка відповідь для співбесіди

Див. **Interview answer** у Study Mode.
