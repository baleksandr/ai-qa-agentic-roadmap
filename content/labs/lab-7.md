# Lab 7 — QA Regression Investigation Agent

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** LAB 7 (pdf)  
> Текст з PDF; DOCX не знайдено — таблиці/зображення не звірені.

## Review Mode

LAB 7. CLI — запуск з термінала
0. Яку проблему вирішуємо?
Без інтерфейсу важко відтворювати розслідування та інтегрувати його в CI.
1. Хто що виконує та куди йдуть дані?
npm run investigate -- --report fixtures/failed-run.json

## Study Mode

LAB 7. CLI — запуск з термінала
### 0. Яку проблему вирішуємо?
Без інтерфейсу важко відтворювати розслідування та інтегрувати його в CI.
### 1. Хто що виконує та куди йдуть дані?
npm run investigate -- --report fixtures/failed-run.json
↓
parse args → run agent → write report → exit code
### 2. Що створюємо руками?
Створи src/index.ts і npm script; введи --report, --output, --dry-run.

### 3. Приклад, який можна повторити
// package.json (fragment)
"scripts": {
"investigate": "tsx src/index.ts"
}
// CLI parses --report and invokes the harness.
### 4. Запуск і перевірка
Перевір help, missing args, bad path, successful output. Exit 0 для успіху, ненульовий код для помилки
виконання.
### 5. Що може піти не так / безпека
Не виводь credentials у stdout; у CI завантажуй артефакти з обмеженим доступом.
### 6. Як пояснити на співбесіді
Українською: CLI робить запуск відтворюваним і дозволяє підключити агента до CI/CD.
English: A CLI makes the agent reproducible with explicit inputs, outputs, and exit codes.
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
