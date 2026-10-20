# Lab 5 — QA Regression Investigation Agent

> **migrationStatus (з DOCX):** `partial`  
> **Джерело:** LAB 5 (pdf)  

## Review Mode

LAB 5. Memory та State
0. Яку проблему вирішуємо?
Без стану ми не знаємо, який крок виконано, що вже прочитано і скільки викликів залишилось. Memory —
окрема довготривала інформація, не тотожна state.
1. Хто що виконує та куди йдуть дані?

## Study Mode

LAB 5. Memory та State
### 0. Яку проблему вирішуємо?
Без стану ми не знаємо, який крок виконано, що вже прочитано і скільки викликів залишилось. Memory —
окрема довготривала інформація, не тотожна state.
### 1. Хто що виконує та куди йдуть дані?
runId → {step, status, observations, toolHistory}
↓
State store (RAM / file / DB)
↓
Context builder selects relevant evidence for LLM
### 2. Що створюємо руками?
Створи src/agent/state.ts; спочатку збереження стану в пам’яті, потім checkpoint у JSON.
### 3. Приклад, який можна повторити
type RunState = {
runId: string;
step: number;
status: 'running'|'done'|'failed';
observations: string[];
};
### 4. Запуск і перевірка
Перевір restart, duplicate tool result, exceeded step count; поясни, чому state не можна бездумно
відправляти весь у context.
### 5. Що може піти не так / безпека
Визнач retention і redaction; не записуй secrets або персональні дані в довготривалу memory.
### 6. Як пояснити на співбесіді
Українською: State описує поточне виконання, memory може зберігати корисні відомості між запусками.
English: The harness stores run state separately from long-term memory and controls what enters model
context.
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
