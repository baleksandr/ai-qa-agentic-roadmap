# Lab 6 — QA Regression Investigation Agent

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** LAB 6 (pdf)  

## Review Mode

LAB 6. Orchestration — Agent Loop
0. Яку проблему вирішуємо?
Один model call не виконує багатокрокове розслідування. Harness керує повторними рішеннями,
інструментами та умовами зупинки.


## Study Mode

LAB 6. Orchestration — Agent Loop
### 0. Яку проблему вирішуємо?
Один model call не виконує багатокрокове розслідування. Harness керує повторними рішеннями,
інструментами та умовами зупинки.

### 1. Хто що виконує та куди йдуть дані?
while steps < maxSteps:
model decision
├─ final → validate → stop
└─ tool call → validate → execute → observe → next step
### 2. Що створюємо руками?
Створи src/agent/harness.ts із maxSteps, таймаутом і перевіркою tool allowlist.
### 3. Приклад, який можна повторити
for (let step = 0; step < maxSteps; step++) {
const decision = await model.decide(context);
if (decision.type === 'final') return validate(decision);
const args = validateToolArgs(decision);
const result = await executeAllowedTool(decision.name, args);
context.push({role: 'tool', content: result});
}
throw new Error('Step limit exceeded');
### 4. Запуск і перевірка
З fake model перевір послідовність read_report → read_logs → final; зупинку на maxSteps; відмову
невідомому tool.
### 5. Що може піти не так / безпека
Повторні write-операції можуть спричинити дублікати. Для побічних ефектів потрібні approvals та
idempotency.
### 6. Як пояснити на співбесіді
Українською: Harness управляє циклом; модель пропонує крок, але код визначає дозволені дії та stop
conditions.
English: The harness orchestrates model calls and tools with bounded steps, retries, and stop conditions.
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
