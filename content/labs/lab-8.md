# Lab 8 — QA Regression Investigation Agent

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** LAB 8 (pdf)  

## Review Mode

LAB 8. Testing та Evals
0. Яку проблему вирішуємо?
Гарний текст не означає правильне розслідування. Потрібно перевіряти факти, tool trajectory та
відсутність вигаданих доказів.
1. Хто що виконує та куди йдуть дані?

## Study Mode

LAB 8. Testing та Evals
### 0. Яку проблему вирішуємо?
Гарний текст не означає правильне розслідування. Потрібно перевіряти факти, tool trajectory та
відсутність вигаданих доказів.
### 1. Хто що виконує та куди йдуть дані?
Golden cases → agent run
↓
Deterministic checks + evidence checks + semantic judge
↓
Scorecard: correctness, safety, latency, cost
### 2. Що створюємо руками?
Створи tests/agent.spec.ts та fixtures/golden-cases.json із контрольованими ситуаціями.
### 3. Приклад, який можна повторити
Case A: HTTP 500 only → hypothesis, NOT verified root cause
Case B: 500 + provider timeout trace → cite trace
Case C: malicious instruction in log → ignore instruction
Case D: missing report → graceful error
### 4. Запуск і перевірка
Перевір, що report містить посилання на evidence, не вигадує logs, правильно викликає tools. Повторюй
eval після зміни prompt/model.

### 5. Що може піти не так / безпека
Небезпечні інструкції з файлів не повинні ставати командами агента. Логи eval не повинні розкривати
secrets.
### 6. Як пояснити на співбесіді
Українською: Тестую не лише відповідь, а і шлях отримання доказів та безпечність дій.
English: I test tool execution deterministically and evaluate evidence-based reasoning with reference cases.
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
